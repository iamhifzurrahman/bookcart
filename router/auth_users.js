const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("Customer successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});
let reviews ={};
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
const isbn = req.params.isbn;
    const { review } = req.query;
    const username = req.session.authorization['username'];
    // Check if a review for this ISBN already exists
    if (reviews[isbn]) {
        // Check if the current user has already posted a review for this ISBN
        if (reviews[isbn][username]) {
            // If yes, modify the existing review
            reviews[isbn][username] = review;
            res.send(`The Review for the book with isbn ${isbn} has been added /updated.`);
        } else {
            // If no, add a new review under the same ISBN
            reviews[isbn][username] = review;
            res.send(`The Review for the book with isbn ${isbn} has been added /updated.`);
        }
    } else {
        // If no reviews exist for this ISBN, create a new entry
        reviews[isbn] = { [username]: review };
        res.send(`The Review for the book with isbn ${isbn} has been added /updated.`);
    }
});
regd_users.delete("/auth/review/:isbn", (req, res) =>{
    const isbn = req.params.isbn;
    const username = req.session.authorization['username'];

    // Check if there are reviews for this ISBN
    if (reviews[isbn]) {
        // Check if the current user has posted a review for this ISBN
        if (reviews[isbn][username]) {
            // Delete the review for the current user
            delete reviews[isbn][username];
            // If there are no more reviews for this ISBN, remove the ISBN entry
            if (Object.keys(reviews[isbn]).length === 0) {
                delete reviews[isbn];
            }
        res.send(`Reviews for the isbn ${isbn} posted by the user ${username} deleted.`);
        } else {
            res.send('You have not posted a review for this ISBN');
        }
    } else {
        res.send('No reviews found for this ISBN');
    }
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
