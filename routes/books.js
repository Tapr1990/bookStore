const Book = require("../models/book");
const auth = require("../middleware/auth");


const joi = require("joi");

const express = require("express");
const router = express.Router();





//* joi
const validationSchema = joi.object({
    title: joi.string().min(1).max(255).required(),
    author: joi.string().min(2).max(120).required(),
    publication_year: joi.number().integer().min(-2000).max(2030).required(),
    price: joi.number().min(1).required()
}); 




router.get("/", async (req, res) => {
    const books = await Book.find();
    res.send(books);
    
});

router.get("/:id", async (req, res) => {

    try {
        
        const book = await Book.findById(req.params.id);

        if(!book) {
            return res.status(404).send({"message":"not found"});
        }
        
        return res.send(book);
       
    }
    catch(err) {
        //console.error(err)
        return res.status(400).send({"message":"Invalid ID"});
    }
    



  
});


router.post("/",auth ,async (req, res) => {

    if(!req.userPayload.isAdmin) {
        return res.status(403).send({"message":"Forbidden"});
    }


    const newBook = req.body;

    try {

        await validationSchema.validateAsync(newBook).error;
    }

    catch(error) {
        return res.status(400).send({"message": error.details[0].message});
    }


    const book = new Book(newBook);
    await book.save();


    
    return res.status(202).send(book);
  


});

router.put("/:id", auth, async (req, res) => {

    if(!req.userPayload.isAdmin) {
        return res.status(403).send({"message":"Forbidden"});
    }

    const book = req.body;

    try {
        await validationSchema.validateAsync(book).error;

    }
    catch(error) {
        return res.status(400).send({"message": error.details[0].message});
    }

    try {
        
        const updateBook = await Book.findByIdAndUpdate(req.params.id, book, {new: true});

        if(!updateBook) {
            return res.status(404).send({"message":"Invalid ID"});    
        }

        return res.status(202).send(updateBook);
    }
    catch(err) {
        return res.status(400).send({"message":"Invalid ID"});
    }

});
    
    


router.delete("/:id", auth, async (req, res) => {

    if(!req.userPayload.isAdmin) {
        return res.status(403).send({"message":"Forbidden"});
    }

    try {
        
        const result = await Book.findByIdAndDelete(req.params.id);

        if(!result) {
            return res.status(404).send({"message":"Invalid ID"});    
        }

        return res.status(202).send({"message":"Delete ID " + req.params.id});
        
    }
    catch(err) {
        return res.status(400).send({"message":"Invalid ID"});
    }

});

module.exports = router;
