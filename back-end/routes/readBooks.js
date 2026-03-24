import express from "express";
import ReadBook from "../models/ReadBook.js";


const router = express.Router();




// ============================
// ADD READ BOOK
// ============================


router.post("/add", async (req, res) => {


  try {


    const newBook = new ReadBook(req.body);


    const savedBook = await newBook.save();


    res.status(201).json(savedBook);


  } catch (error) {


    res.status(500).json({ error: error.message });


  }


});




// ============================
// GET ALL READ BOOKS
// ============================


router.get("/", async (req, res) => {


  try {


    const books = await ReadBook.find().sort({ createdAt: -1 });


    res.json(books);


  } catch (error) {


    res.status(500).json({ error: error.message });


  }


});




// ============================
// SEARCH BOOK
// ============================


router.get("/search", async (req, res) => {


  try {


    const query = req.query.q;


    const books = await ReadBook.find({
      title: { $regex: query, $options: "i" }
    });


    res.json(books);


  } catch (error) {


    res.status(500).json({ error: error.message });


  }


});




// ============================
// SORT BOOKS
// ============================


router.get("/sort/:type", async (req, res) => {


  try {


    const type = req.params.type;


    let sortOption = {};


    if (type === "title") sortOption = { title: 1 };


    if (type === "author") sortOption = { author: 1 };


    if (type === "date") sortOption = { finishedDate: -1 };


    const books = await ReadBook.find().sort(sortOption);


    res.json(books);


  } catch (error) {


    res.status(500).json({ error: error.message });


  }


});




// ============================
// ADD / UPDATE REVIEW
// ============================


router.put("/review/:id", async (req, res) => {


  try {


    const updatedBook = await ReadBook.findByIdAndUpdate(


      req.params.id,


      { review: req.body.review },


      { new: true }


    );


    res.json(updatedBook);


  } catch (error) {


    res.status(500).json({ error: error.message });


  }


});




// ============================
// UPDATE OWNED STATUS
// ============================


router.put("/owned/:id", async (req, res) => {


  try {


    const updatedBook = await ReadBook.findByIdAndUpdate(


      req.params.id,


      { owned: req.body.owned },


      { new: true }


    );


    res.json(updatedBook);


  } catch (error) {


    res.status(500).json({ error: error.message });


  }


});




// ============================
// UPDATE READING DATES
// ============================


router.put("/dates/:id", async (req, res) => {


  try {


    const updatedBook = await ReadBook.findByIdAndUpdate(


      req.params.id,


      {
        startedDate: req.body.startedDate,
        finishedDate: req.body.finishedDate
      },


      { new: true }


    );


    res.json(updatedBook);


  } catch (error) {


    res.status(500).json({ error: error.message });


  }


});




// ============================
// DELETE BOOK
// ============================


router.delete("/:id", async (req, res) => {


  try {


    await ReadBook.findByIdAndDelete(req.params.id);


    res.json({ message: "Book deleted" });


  } catch (error) {


    res.status(500).json({ error: error.message });


  }


});




export default router;
