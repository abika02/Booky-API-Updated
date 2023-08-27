const mongoose = require("mongoose");

//create book schema

//Schema-(key,datatype of value pairs)
const BookSchema = mongoose.Schema (
  {
    ISBN: String,
    title: String,
    pubDate: String,
    language: String,
    numPage: Number,
    author: [Number],
    publication: [Number],
    category: [String]
  }
);


const BookModel = mongoose.model("books",BookSchema);

module.exports = BookModel;
