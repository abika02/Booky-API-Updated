require("dotenv").config(); //Requrinig and configuring

const express = require("express");
const mongoose = require('mongoose');
var bodyParser = require("body-parser") //importing body-paeser

//Database
const database = require("./database/database");

//Importing Models
const BookModel = require("./database/book");
const PublicationModel = require("./database/publication");
const AuthorModel = require("./database/author");

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
//async - other tasks are not waited until one task is completed
booky.get("/",async(req,res) => {
  const getAllBooks = await BookModel.find();//No paramater given so print eveythingh
  return res.json(getAllBooks);
});


// Route           /is
// Description     Get specific book on ISBN
// Access          Public
// Parameter       NONE
// Methods          GET

booky.get("/is/:isbn",async(req,res) =>{
  const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn});


//null !0 = 1 that is if 1 then return these statements
  if(!getSpecificBook) {
    return res.json({error: `No book found for the ISBN of ${req.params.isbn}`})
  }
  return res.json({book : getSpecificBook});
});


// Route           /c
// Description     Get specific book on Category
// Access          Public
// Parameter       Category
// Methods          GET

booky.get("/c/:category",async(req,res) =>{
  const getSpecificBook = await BookModel.findOne({category: req.params.category});


  //null !0 = 1 that is if 1 then return these statements
  if(!getSpecificBook) {
    return res.json({error: `No book found for the category of ${req.params.category}`})
  }
  return res.json({book : getSpecificBook});
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

booky.get("/author",async(req,res) =>{
  const getAllAuthor = await AuthorModel.find();//No paramater given so print eveythingh
  return res.json(getAllAuthor);
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

booky.get("/publication",async(req,res) =>{
  const getAllPublication = await PublicationModel.find();//No paramater given so print eveythingh
  return res.json(getAllPublication);

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

booky.post("/book/new", async(req, res) => {
          //Desturturing    //fetching from body.
    const { newBook } = req.body;
    const addNewBook = BookModel.create(newBook);
    return res.json({
      books: addNewBook,
      message: "Book was added"
    });

  });


  //POST
  // Route           /author/new
  // Description     Add new authors
  // Access          Public
  // Parameter       NONE
  // Methods         POST

  booky.post("/author/new", async(req, res) => {
            //Desturturing    //fetching from body.
      const { newAuthor } = req.body;
      const addNewAuthor = AuthorModel.create(newAuthor);
      return res.json({
        author: addNewAuthor,
        message: "Author was added"
      });
    });

    //POST
    // Route           /publication/new
    // Description     Add new publication
    // Access          Public
    // Parameter       NONE
    // Methods         POST

    booky.post("/publication/new", async(req, res) => {
              //Desturturing    //fetching from body.
        const { newPublication } = req.body;
        const addNewPublication = PublicationModel.create(newPublication);
        return res.json({
          publication: addNewPublication,
          message: "Publication was added"
        });
      });

/************* PUT*************/

/*******Updating New Book*******/

// Route           /book/update
// Description     Update book on isbn
// Access          Public
// Parameter       isbn
// Methods         PUT

booky.put("/book/update/:isbn", async (req,res) => {
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn
    },
    {
      title: req.body.bookTitle
    },
    {
      new: true        //updates book title in backend and shows updated title in frontend
    }
  );
  return res.json({
    books: updatedBook
  });

});

/*******Updating New Author*******/

// Route           /book/author/update
// Description     Update book on isbn
// Access          Public
// Parameter       isbn
// Methods         PUT

booky.put("/book/author/update/:isbn", async (req,res) => {
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      //update book database
      ISBN: req.params.isbn
    },
    {
      $addToSet: {
        author: req.body.newAuthor
      }
    },
    {
      new: true
    }
  );

  //Update author database
  const updatedAuthor = await AuthorModel.findOneAndUpdate(
    {
      id: req.body.newAuthor
    },
    {
      $addToSet:{
        books: req.params.isbn
      }
    },
    {
      new: true
    }
  );
  return res.json(
    {
      bookss: updatedBook,
      author: updatedAuthor,
      message: "New Author was added"
    }
  )
});

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

    booky.delete("/book/delete/:isbn",async (req,res) => {
      //Whichever book that does'nt match with isbn is sent to an updated array and rest wwill be filtered out
    const updatedBookDatabase = await BookModel.findOneAndDelete(
      {
        ISBN: req.params.isbn
      }
    );
    return res.json({
      books: updatedBookDatabase
    });
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
