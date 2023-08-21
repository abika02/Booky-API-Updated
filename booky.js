require("dotenv").config(); //Requrinig and configuring

const express = require("express");
const mongoose = require('mongoose');
var bodyParser = require("body-parser") //importing body-paeser

//Database
const database = require("./database");

//initialise express
const booky = express();
booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json()); //we want body parser only to use json


//provide your URL  in .env filer

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connection Established");
}).catch((err) => {
  console.error("Connection Error:", err);
});


// Route           /
// Description     Get all the books
// Access          Public
// Parameter       NONE
// Methods          GET


//checking
booky.get
("/",(req,res) => {
  return res.json({books:database.books});
});


// Route           /is
// Description     Get specific book on ISBN
// Access          Public
// Parameter       NONE
// Methods          GET

booky.get("/is/:isbn",(req,res) =>{
  const getSpecificBook = database.books.filter(
    (book) => book.ISBN === req.params.isbn
  );

  if(getSpecificBook.length === 0) {
    return res.json({error: `No book found for the ISBN of ${req.params.isbn}`})
  }
  return res.json({book : getSpecificBook});
});


// Route           /c
// Description     Get specific book on Category
// Access          Public
// Parameter       Category
// Methods          GET

booky.get("/c/:category",(req,res) =>{
  const getSpecificBook = database.books.filter(
    (book) => book.category.includes(req.params.category)//include checks if the given parameter is included
  )
  if(getSpecificBook.length === 0){
    return res.json({error:`No book found for the category of ${req.params.category} `})
  }
  return res.json({Book: getSpecificBook});
});



// Route           /l
// Description     Get specific book on Language
// Access          Public
// Parameter       Language
// Methods          GET

booky.get("/l/:language",(req,res) =>{
  const getSpecificLanguage = database.books.filter(
    (book) => book.language.includes(req.params.language)
  )
  if(getSpecificLanguage.length === 0){
    return res.json({error:`No book found in the language ${req.params.language} `})
  }
  return res.json({Langguage:getSpecificLanguage});
});



// Route           /author
// Description     Get author list
// Access          Public
// Parameter       NONE
// Methods          GET

booky.get("/author",(req,res) =>{
  return res.json({publications: database.author});
});



// Route           /author
// Description     Get specific book on Author
// Access          Public
// Parameter       Author
// Methods          GET

booky.get("/author/:id", (req, res) => {

  const getSpecificAuthor = database.author.filter(
    (author) => author.id === parseInt(req.params.id)
  );

  if (getSpecificAuthor.length === 0) {
    return res.json({ error: `No author found with ID ${req.params.id}` });
  }

  return res.json({ Author: getSpecificAuthor });
});


// Route           /author/book
// Description     Get all author Author and books
// Access          Public
// Parameter       Author
// Methods          GET

booky.get("/author/book/:isbn", (req, res) => {

  const getSpecificAuthor = database.author.filter(
    (author) =>author.books.includes(req.params.isbn)

  );

  if (getSpecificAuthor.length === 0) {
    return res.json({ error: `No books found for the Author ${req.params.isbn}` });
  }

  return res.json({ Authors: getSpecificAuthor });
});



// Route           /publication
// Description     Get all author publication and books
// Access          Public
// Parameter       NONE
// Methods          GET

booky.get("/publication",(req,res) =>{
  return res.json({Publication: database.publication});
});


// Route           /pub
// Description     Get specific publicion
// Access          Public
// Parameter       id
// Methods         GET

booky.get("/pub/:id", (req, res) => {

  const getSpecificPublication = database.publication.filter(
    (publication) => publication.id === parseInt(req.params.id)
  );

  if (getSpecificPublication.length === 0) {
    return res.json({ error: `No Publication found with ID ${req.params.id}` });
  }

  return res.json({ Publication: getSpecificPublication });
});


// Route           /pub/book
// Description     Get all author publication and books
// Access          Public
// Parameter       ISBN
// Methods          GET

booky.get("/pub/book/:isbn", (req, res) => {

  const getSpecificPublication = database.publication.filter(
    (publication) =>publication.books.includes(req.params.isbn)

  );

  if (getSpecificPublication.length === 0) {
    return res.json({ error: `No books found for the Author ${req.params.isbn}` });
  }

  return res.json({ Publication: getSpecificPublication});
});

//POST
// Route           /book/new
// Description     Add new books
// Access          Public
// Parameter       NONE
// Methods         POST

booky.post("/book/new", (req, res) => {

    const newBook = req.body;
    database.books.push(newBook);
    return res.json({updatedBooks: database.books});
  });


  //POST
  // Route           /author/new
  // Description     Add new authors
  // Access          Public
  // Parameter       NONE
  // Methods         POST

  booky.post("/author/new", (req, res) => {

      const newAuthor = req.body;
      database.author.push(newAuthor);
      return res.json(database.author);
    });


    //POST
    // Route           /publication/new
    // Description     Add new publication
    // Access          Public
    // Parameter       NONE
    // Methods         POST

    booky.post("/publication/new", (req, res) => {

        const newPublication = req.body;
        database.publication.push(newPublication);
        return res.json(database.Publication);
      });


      //POST
      // Route          /publication/update/book
      // Description    Update or add new publicatin
      // Access          Public
      // Parameter       isbn
      // Methods         PUT


      //PUT
      // Route           /publication/update/book
      // Description     Update or Add new publication
      // Access          Public
      // Parameter       isbn
      // Methods         PUT

      booky.put("/publication/update/book/:isbn",(req,res) => {
        //update the publication Database
        database.publication.forEach((pub) =>{
          if(pub.id === req.body.pubId) {
            return pub.books.push(req.params.isbn);
          }
        });
        //Update the bok database
        database.books.forEach((book) =>{
          if(book.ISBN === req.params.isbn) {
            book.publication = req.body.pubId;
            return;
          }
      });
      return res.json(
        {
          books: database.books,
          publication: database.publication,
          message: "successfully updated publications"

        }
      );
    });

    //DELETE
    // Route           /book/delete
    // Description     Delete a book
    // Access          Public
    // Parameter       isbn
    // Methods         DELETE

    booky.delete("/book/delete/:isbn",(req,res) => {
      //Whichever book that does'nt match with isbn is sent to an updated aarray and rest wwill be filtered out
      const updatedBookDatabase = database.books.filter(
        (book) => book.ISBN !== req.params.isbn
      )
      database.books = updatedBookDatabase;
      return res.json({books: database.books});
    });

    //DELETE
    // Route           /book/delete/author
    // Description     Delete a book
    // Access          Public
    // Parameter       isbn
    // Methods         DELETE

    booky.delete("/book/delete/author/:authorId",(req,res) => {
      // Whichever book that doesn't match with the specified author is sent to an updated array and the rest will be filtered out
      const updatedBookDatabase = database.books.filter(
          (book) => book.author !== req.params.author
      );
      database.books = updatedBookDatabase;
      return res.json({books: database.books});
  });

  //DELETE
  // Route           /book/delete/author
  // Description     Delete an author from a book and vice versa
  // Access          Public
  // Parameter       isbn
  // Methods         DELETE

  booky.delete("/book/delete/author/:isbn/:authorId",(req,res) => {
//Update the book Database
database.books.forEach((book) => {
  if(book.ISBN === req.params.isbn) {
    const newAuthorList = book.author.filter(
      (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
    );
    book.author = newAuthorList;
    return;
  }
});

//Update the author database
database.author.forEach((eachAuthor) => {
  if(eachAuthor.id === parseInt(req.params.authorId)){
    const newBookList = eachAuthor.books.filter(
      (book) => book !== req.params.isbn
    );
    eachAuthor.books = newBookList;
    return;
  }
});

  return res.json({
    book: database.boooks,
    author: database.author,
    message: "Author was deleted!!!"
  })
});



booky.listen(3000,() => {
  console.log("server is up and runing");
});
