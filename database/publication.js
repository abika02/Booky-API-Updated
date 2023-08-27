const mongoose = require("mongoose");

//create Publication schema

//Schema-(key,datatype of value pairs)
const PublicationSchema = mongoose.Schema (
  {
    id: Number,
    name: String,
    books: [String]
  }
);


const PublicationModel = mongoose.model("publication",PublicationSchema);//model creation

module.exports = PublicationModel;
