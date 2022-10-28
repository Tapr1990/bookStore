const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const joi = require("joi");
const User = require("../models/users");
const router = express.Router();


const validationSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(8).max(1000).required()
});

router.post("/", async (req, res) => {
    const login = req.body;

    try{
        await validationSchema.validateAsync(login);
    }
    catch(err){
        return res.status(400).send({"message":err.details[0].message});
    }

    const user = await User.findOne({
        email: login.email
    });

    if(!user) {
        return res.status(401).send({"message":"invalid email"});
    }


    const success = await bcrypt.compare(login.password, user.password);

    if( !success) {
        return res.status(401).send({"message":"invalid password"});
    }

    const payload = {
        _id: user._id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);

    return res
    .header({"Authorization": "Bearer " + token})
    .send({"header": "Authorization Bearer", "token":token});

    //return res.send(user);
});


module.exports = router;


/*vamos criar um login para o utlizador, precisamos do email e da password,
para ver se bate certo com a informação guarda na base de dados no registo*/