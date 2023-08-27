const mongoose = require("mongoose");

//create Author schema

//Schema-(key,datatype of value pairs)
const AuthorSchema = mongoose.Schema (
  {
    id: Number,
    name: String,
    books: [String]
  }
);


const AuthorModel = mongoose.model("author",AuthorSchema);

module.exports = AuthorModel;
