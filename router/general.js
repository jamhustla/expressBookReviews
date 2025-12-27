const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered" });
    } else {
      return res.status(404).json({ message: "User already exists" });
    }
  }
  return res.status(400).json({ message: "Username and password required" });
});

// Get all books
public_users.get('/', (req, res) => {
  return res.status(200).json(books);
});

// Get book by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn]);
});

// Get books by author
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;
  let filteredBooks = [];

  for (let key in books) {
    if (books[key].author === author) {
      filteredBooks.push(books[key]);
    }
  }

  return res.status(200).json(filteredBooks);
});

// Get books by title
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;
  let filteredBooks = [];

  for (let key in books) {
    if (books[key].title === title) {
      filteredBooks.push(books[key]);
    }
  }

  return res.status(200).json(filteredBooks);
});

// Get book review
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
