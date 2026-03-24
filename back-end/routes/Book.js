const express = require("express");
const router = express.Router();
const Book = require("../models/Book");


// ADD BOOK
router.post("/add-book", async (req, res) => {
  try {


    const { title, author, description } = req.body;


    const book = new Book({
      title,
      author,
      description
    });


    await book.save();


    res.json({
      message: "Book added successfully",
      book
    });


  } catch (error) {
    res.status(500).json({ error: "Error adding book" });
  }
});


// GET ALL BOOKS
router.get("/books", async (req, res) => {
  try {


    const books = await Book.find();


    res.json(books);


  } catch (error) {
    res.status(500).json({ error: "Error fetching books" });
  }
});


module.exports = router;
