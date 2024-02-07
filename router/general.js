const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "Customer successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "Customer already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register Customer."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
res.send(JSON.stringify(books,null,4));

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
const isbn = req.params.isbn;
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
const author = req.params.author;
// 1. Obtain all the keys for the ‘books’ object.
const bookKeys = Object.keys(books);

// 2. Iterate through the ‘books’ array & check the author matches the one provided in the request parameters.
const authorToMatch = author; // Assuming this is the author provided in the request parameters
const matchingBooks = [];

for (const key in books) {
    if (books.hasOwnProperty(key)) {
        const book = books[key];
        if (book.author === authorToMatch) {
            matchingBooks.push(book);
        }
    }
}
  res.send({
    'booksbyauthor':matchingBooks
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
const title = req.params.title;
  // 1. Obtain all the keys for the ‘books’ object.
const bookKeys = Object.keys(books);

// 2. Iterate through the ‘books’ array & check the author matches the one provided in the request parameters.
const titleToMatch = title; // Assuming this is the title provided in the request parameters
const matchingBooks = [];

for (const key in books) {
    if (books.hasOwnProperty(key)) {
        const book = books[key];
        if (book.title === titleToMatch) {
            matchingBooks.push(book);
        }
    }
}
  res.send({
    'booksbytitle':matchingBooks
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});
// get books by async-await 
async function getBooks() {
    try {
        const response = await axios.get('https://mirzahifzu-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/');
        return response.data;
    } catch (error) {
        console.error('Error fetching books:', error);
        return null;
    }
}
// Get the book list available in the shop
public_users.get('/async',async function (req, res) {
    //Write your code here
    const books = await getBooks();
  res.send(JSON.stringify(books,null,4));
  
  });
  // Function to get book details based on ISBN
async function getBookDetails(isbn) {
    try {
        const response = await axios.get(`https://mirzahifzu-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/isbn/${isbn}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching book details for ISBN ${isbn}:`, error);
        return null;
    }
}
public_users.get('async/isbn/:isbn',async function (req, res) {
    //Write your code here
    let isbn = req.params.isbn;
    const bookDetails = await getBookDetails(isbn);
  res.send(bookDetails);
  
  });
  // Function to get book details based on author
async function getBookDetailsByAuthor(author) {
    try {
        const response = await axios.get(`https://mirzahifzu-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/author/${author}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching book details for author ${author}:`, error);
        return null;
    }
}
public_users.get('async/author/:author',async function (req, res) {
    //Write your code here
    let author = req.params.author;
    const bookDetails = await getBookDetailsByAuthor(author);
  res.send({
    'booksbyauthor':bookDetails
  });  
  });
// Function to get book details based on title
async function getBookDetailsByTitle(title) {
    try {
        const response = await axios.get(`https://mirzahifzu-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/title/${title}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching book details for title "${title}":`, error);
        return null;
    }
}
public_users.get('async/title/:title',async function (req, res) {
    //Write your code here
    let title = req.params.title;
    const bookDetails = await getBookDetailsByTitle(title);  
  res.send({
    'booksbytitle':matchingBooks
  });
});

module.exports.general = public_users;
