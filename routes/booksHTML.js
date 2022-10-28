const express = require("express");
const router = express.Router();


const Book = require("../models/book");


router.get("/", async (req, res) => {
    const books = await Book.find().lean();

    return res.render("books", {books: books});
});

router.get("/:id", async (req, res) => {

    try {

        const book = await Book.findById(req.params.id);

        if(!book) {
            return res.status(404).render("e404");
        }
        
        return res.render("book", {book});
    }
    catch(err) {
        res.status(400).send("<p>Bad Request: Invalid ID</p>");
    }

});


module.exports = router;