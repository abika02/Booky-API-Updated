const books = [
  {
    ISBN: "12345book",
    title: "Harry Potter",
    pubDate: "2023-08-05",
    language: "en",
    numPage: "260",
    author: [1, 2],
    publication: [1],
    category: ["mystery", "magic"]
  }
];

const author = [
  {
    id: 1,
    name: "jk rowling",
    books: ["12345book", "Another Book"]
  },
  {
    id: 2,
    name: "Jane",
    books: ["12345book","secret"]
  },
];

const publication = [
  {
    id: 1,
    name: "Lumina",
    books: ["12345book"]
  },
  {
    id: 2,
    name: "Serinity",
    books: ["12345book"]
  }
];

// Exporting dataset

module.exports = {
  books,
  author,
  publication
};
