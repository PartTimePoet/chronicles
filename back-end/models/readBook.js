import mongoose from "mongoose";


const readBookSchema = new mongoose.Schema({


  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },


  title: {
    type: String,
    required: true
  },


  author: {
    type: String
  },


  seriesName: {
    type: String
  },


  bookNumber: {
    type: Number
  },


  pages: Number,


  binding: String,


  firstPubYear: Number,


  edition: String,


  editionsCount: Number,


  genres: [String],


  moods: [String],


  pace: String,


  nf: {
    type: Boolean,
    default: false
  },


  startedDate: Date,


  finishedDate: Date,


  status: {
    type: String,
    default: "read"
  },


  owned: {
    type: Boolean,
    default: false
  },


  review: String,


  coverImage: String


}, { timestamps: true });


export default mongoose.model("ReadBook", readBookSchema);
