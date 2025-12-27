const express = require("express");
const regd_users = express.Router();
const books = require("./booksdb.js");

let users = [];

// Check if username is valid
const isValid = (username) => {
  return typeof username === "string" && username.trim().length > 0;
};

// Check if username and password match
const authenticatedUser = (username, password) => {
  return users.some((u) => u.username === username && u.password === password);
};

// Register a new user
regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "Username and password required" });
  if (!isValid(username))
    return res.status(400).json({ message: "Invalid username" });

  if (users.some((u) => u.username === username))
    return res.status(400).json({ message: "User already exists" });

  users.push({ username, password });
  res.json({ message: "User registered successfully" });
});

// Login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "Username and password required" });

  if (authenticatedUser(username, password)) {
    res.json({ message: "Login successful" });
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }
});

// Add/update a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { username, review } = req.body;
  const isbn = req.params.isbn;

  if (!books[isbn]) return res.status(404).json({ message: "Book not found" });
  if (!username || !review)
    return res.status(400).json({ message: "Username and review required" });

  if (!books[isbn].reviews) books[isbn].reviews = {};
  books[isbn].reviews[username] = review;

  res.json({ message: "Review added/updated", reviews: books[isbn].reviews });
});

module.exports = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
