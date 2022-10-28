
const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        min: 1,
        max: 255,
        required: true
    },
    author: {
        type: String,
        min: 2,
        max: 128,
        required: true
    },
    publication_year: {
        type: Number,
        min: -2000,
        max: 2030,
        required: true
    },
    price: {
        type: Number,
        min: 1,
        required: true
        
    }

});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;



