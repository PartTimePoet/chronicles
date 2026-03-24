import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import readBooksRoutes from "./routes/readBooks.js";
import nodemailer from "nodemailer";
import crypto from "crypto";


dotenv.config();
const app = express();
app.use("/read-books", readBooksRoutes);


// ===============================
//           MIDDLEWARES
// ===============================
app.use(cors({
  origin: "http://127.0.0.1:5500",
  credentials: true
}));


app.use(express.json());


// ===============================
//        AUTH MIDDLEWARE
// ===============================
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;


    if (!authHeader) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }


    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    req.user = decoded;
    next();


  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};




// ===============================
//        GLOBAL BOOK MODEL
// ===============================
const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: String,
    genre: String,
    coverImage: String,
  },
  { timestamps: true }
);


const Book = mongoose.model("Book", bookSchema);




// ===============================
//        USER BOOK MODEL
// ===============================
const userBookSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true
    },
    status: {
      type: String,
      enum: ["to-read", "reading", "completed"],
      default: "to-read",
    },


    owned: {
      type: Boolean,
      default: false
    }


  },
  { timestamps: true }
);


const UserBook = mongoose.model("UserBook", userBookSchema);// ===============================
//            SIGNUP
// ===============================
app.post("/signup", async (req, res) => {
  try {
    const { fullName, email, username, password } = req.body;


    if (!fullName || !email || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }


    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });


    if (existingUser) {
      return res.status(400).json({ message: "Email or username already exists" });
    }


    const hashedPassword = await bcrypt.hash(password, 10);


    const newUser = new User({
      fullName,
      email,
      username,
      password: hashedPassword
    });


    await newUser.save();


    res.status(201).json({ message: "Account created successfully!" });


  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});




// ===============================
//             LOGIN
// ===============================
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;


    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }


    const user = await User.findOne({ email });


    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }


    const isMatch = await bcrypt.compare(password, user.password);


    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }


    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );


    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email
      }
    });


  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// ===============================
// FORGOT PASSWORD
// ===============================
app.post("/forgot-password", async (req, res) => {


  try {


    const { email } = req.body;


    const user = await User.findOne({ email });


    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    // generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");


    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 3600000; // 1 hour


    await user.save();


    const resetLink =
      `http://127.0.0.1:5500/reset-password.html?token=${resetToken}`;


    // for development we print the link
    console.log("RESET PASSWORD LINK:", resetLink);


    res.json({
      message: "Reset link generated. Check server terminal."
    });


  } catch (error) {


    console.error("FORGOT PASSWORD ERROR:", error);


    res.status(500).json({
      message: "Error sending reset instructions"
    });


  }


});
// ===============================
// RESET PASSWORD
// ===============================
app.post("/reset-password/:token", async (req, res) => {


  try {


    const { token } = req.params;
    const { password } = req.body;


    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }
    });


    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset token"
      });
    }


    const hashedPassword = await bcrypt.hash(password, 10);


    user.password = hashedPassword;


    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;


    await user.save();


    res.json({
      message: "Password reset successful"
    });


  } catch (error) {


    console.error("RESET PASSWORD ERROR:", error);


    res.status(500).json({
      message: "Error resetting password"
    });


  }


});
// ===============================
//         PROTECTED DASHBOARD
// ===============================
app.get("/dashboard", authMiddleware, async (req, res) => {
  try {


    const user = await User.findById(req.user.id).select("-password");


    res.status(200).json({
      message: "Welcome to dashboard",
      user
    });


  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});




// ===============================
//        ADD GLOBAL BOOK
// ===============================
app.post("/api/books", async (req, res) => {
  try {


    const { title, author, coverImage } = req.body;


    if (!title || !author) {
      return res.status(400).json({ message: "Title and author required" });
    }


    const existingBook = await Book.findOne({ title, author });


    // If book already exists → return it
    if (existingBook) {
      return res.status(200).json(existingBook);
    }


    const newBook = new Book({
      title,
      author,
      coverImage
    });


    const savedBook = await newBook.save();


    res.status(201).json(savedBook);


  } catch (error) {
    res.status(500).json({ message: "Error adding book" });
  }
});
// ===============================
//        GET ALL BOOKS
// ===============================
app.get("/api/books", async (req, res) => {
  try {


    const { search } = req.query;


    let filter = {};


    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }


    const books = await Book.find(filter);


    res.status(200).json(books);


  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});




// ===============================
//      SEARCH BOOKS (OPEN API)
// ===============================
app.get("/api/search-books", async (req, res) => {
  const query = req.query.q;


  try {
    const response = await fetch(
      `http://openlibrary.org/search.json?q=${encodeURIComponent(query)}`
    );


    const data = await response.json();


    // Map to only needed fields + cover
    const books = data.docs.slice(0, 12).map(book => ({
      title: book.title,
      author: book.author_name ? book.author_name[0] : "Unknown",
      coverImage: book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : (book.cover_edition_key
            ? `https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-M.jpg`
            : null),
      openLibraryId: book.key
    }));


    res.json(books);


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error searching books" });
  }
});


// ===============================
//     ADD BOOK TO USER SHELF
// ===============================
app.post("/api/user/books", authMiddleware, async (req, res) => {
  try {


    const { bookId, status } = req.body;


    const bookExists = await Book.findById(bookId);


    if (!bookExists) {
      return res.status(404).json({ message: "Book not found" });
    }


    const alreadyAdded = await UserBook.findOne({
      userId: req.user.id,
      bookId
    });


    if (alreadyAdded) {
      return res.status(400).json({ message: "Book already in shelf" });
    }


    const newUserBook = new UserBook({
      userId: req.user.id,
      bookId,
      status
    });


    await newUserBook.save();


    res.status(201).json({ message: "Book added to shelf" });


  } catch (error) {
    res.status(500).json({ message: "Error adding to shelf" });
  }
});




// ===============================
//      GET USER SHELF BOOKS
// ===============================
app.get("/api/user/books", authMiddleware, async (req, res) => {
  try {


    const { status, owned } = req.query;


    let filter = {
      userId: req.user.id
    };


    if (status) {
      filter.status = status;
    }


    if (owned === "true") {
      filter.owned = true;
    }


    const books = await UserBook.find(filter).populate("bookId");


    res.status(200).json(books);


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching books" });
  }
});
// ===============================
//     UPDATE BOOK STATUS
// ===============================
app.put("/api/user/books/:id/owned", authMiddleware, async (req, res) => {


  try {


    const userBook = await UserBook.findOne({
      _id: req.params.id,
      userId: req.user.id
    });


    if (!userBook) {
      return res.status(404).json({ message: "Book not found" });
    }


    userBook.owned = true;


    await userBook.save();


    res.json({ message: "Book marked as owned" });


  } catch (err) {


    res.status(500).json({ error: err.message });


  }


});
// ===============================
// DELETE BOOK FROM USER SHELF
// ===============================
app.delete("/api/user/books/:id", authMiddleware, async (req, res) => {


  try {


    const userBook = await UserBook.findByIdAndDelete(req.params.id);


    if (!userBook) {
      return res.status(404).json({ message: "Book not found" });
    }


    res.json({ message: "Book removed from shelf" });


  } catch (error) {
    res.status(500).json({ message: "Error removing book" });
  }


});
 // ==========================
// EXPLORE BOOK SEARCH
// ==========================


app.get("/api/books/search", async (req, res) => {


  const query = req.query.q;


  try {


    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=20`
    );


    const data = await response.json();


    const books = data.items.map(book => ({


      googleId: book.id,
      title: book.volumeInfo.title,
      author: book.volumeInfo.authors?.join(", ") || "Unknown",
      cover: book.volumeInfo.imageLinks?.thumbnail || "",
      pages: book.volumeInfo.pageCount || "N/A",
      year: book.volumeInfo.publishedDate || "N/A",
      description: book.volumeInfo.description || ""


    }));


    res.json(books);


  } catch (err) {


    console.error(err);
    res.status(500).json({ message: "Book search failed" });


  }


});
// ==========================
// ADD BOOK TO USER SHELF
// ==========================


app.post("/api/user/books", async (req, res) => {


  const { googleId, status } = req.body;


  try {


    const userId = req.user.id;


    const book = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          books: {
            googleId,
            status
          }
        }
      },
      { new: true }
    );


    res.json(book);


  } catch (err) {


    console.error(err);
    res.status(500).json({ message: "Could not add book" });


  }


});
app.put("/api/user/books/:id/owned", async (req, res) => {


  try {


    const userBook = await UserBook.findById(req.params.id);


    if (!userBook) {
      return res.status(404).json({ message: "Book not found" });
    }


    userBook.owned = true;


    await userBook.save();


    res.json({ message: "Book marked as owned" });


  } catch (err) {


    res.status(500).json({ error: err.message });


  }


});
// ===============================
//        GET RECOMMENDATIONS
// ===============================
app.get("/api/recommendations", async (req, res) => {
  try {


    // Get random books
    const books = await Book.aggregate([
      { $sample: { size: 6 } }
    ]);


    res.status(200).json(books);


  } catch (error) {
    res.status(500).json({ message: "Error fetching recommendations" });
  }
});


// ===============================
//           DATABASE
// ===============================
const PORT = process.env.PORT || 8000;
const MONGOURL = process.env.MONGO_URL;


mongoose.connect(MONGOURL)
  .then(() => {
    console.log("MongoDB connected successfully.");
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch(err => console.log(err));
