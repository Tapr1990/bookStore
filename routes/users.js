const User = require("../models/users");
const auth = require("../middleware/auth");

const joi = require("joi");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();





//* joi
const validationSchema = joi.object({
    name: joi.string().min(2).max(60).required(),
    email: joi.string().email().required(),
    phone: joi.string().min(9).max(30).required(),
    birth_date: joi.date().required(),
    password: joi.string().min(8).max(1000).required(),
    
}); 






router.get("/", auth, async (req, res) => {
    if(!req.userPayload.isAdmin) {
        return res.status(403).send({"message":"Forbiden"});
    }

    const users = await User.find().select("name email");
    res.send(users);
    
});


router.get("/:id", auth, async (req, res) => {

    try {
        const user =  await User
            .findById(req.params.id)
            .select("name email phone birth_date");

        if(!user) {
            return res.status(404).send({"message":"not found"});
        }

        if(user._id != req.userPayload._id && !req.userPayload.isAdmin) {
            return res.status(403).send({"message":"Forbiden"});
        }

        return res.status(200).send(user);
    }
    catch(err) {
        return res.status(400).send({"message":"Invalid ID"});
    }

});

    
    

   



  


router.post("/", async (req, res) => {

    const user = req.body;

    try {

        await validationSchema.validateAsync(user);
    }
    
    catch(error) {
        return res.status(400).send({"message": error.details[0].message});
    }
    
    try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        const createdUser = new User(user);
        await createdUser.save();

        return res.status(200).send(createdUser);
    }
    catch(err) {
        return res.status(400).send({"message": "Bad Request"});
    }
    
    


});

router.put("/:id", auth, async (req, res) => {

    if(req.params.id != req.userPayload._id && !req.userPayload.isAdmin) {
        return res.status(403).send({"message":"Forbiden"});
    }



    const user = req.body;

    try {
        
        await validationSchema.validateAsync(user).error;
    }

    catch(error) {
        return res.status(400).send({"message": error.details[0].message});
    }

    try {
        //*temos que encriptar outra vez a pass, antes de actualizar
        user.password = await bcrypt.hash(user.password, 10);

        const updateUser = await User.findByIdAndUpdate(req.params.id, user, {new: true});

        if(!updateUser) {
            return res.status(404).send({"message": "Not Found"});
        }

        return res.status(202).send(updateUser);
    }
    catch(err) {
        return res.status(400).send({"message": "Invalid ID"});
    }
    
    


    



});

router.delete("/:id", async (req, res) => {
    if(req.params.id != req.userPayload._id && !req.userPayload.isAdmin) {
        return res.status(403).send({"message":"Forbiden"});
    }

    try {
        
        const result = await User.findByIdAndDelete(req.params.id);

        if(!result) {
            return res.status(404).send({"message":"Not found"});    
        }

        return res.status(202).send({"message":"Delete ID " + req.params.id});
        
    }
    catch(err) {
        return res.status(400).send({"message":"Invalid ID"});
    } 



   
});

module.exports = router;
