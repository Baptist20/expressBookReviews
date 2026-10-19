const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Promise-based data access so handlers never block each other
const getBooks = () => new Promise((resolve) => resolve(books));

const getBookByISBN = (isbn) =>
  new Promise((resolve, reject) => {
    books[isbn]
      ? resolve(books[isbn])
      : reject(new Error(`Book with ISBN ${isbn} not found`));
  });

const filterBooksBy = (field, value) =>
  new Promise((resolve, reject) => {
    const needle = value.toLowerCase();
    const matches = Object.entries(books)
      .filter(([, book]) => book[field].toLowerCase().includes(needle))
      .map(([isbn, book]) => ({ isbn, ...book }));
    matches.length
      ? resolve(matches)
      : reject(new Error(`No books found for ${field} "${value}"`));
  });

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  if (!isValid(username)) {
    return res
      .status(409)
      .json({ message: "Username is invalid or already exists" });
  }

  users.push({ username, password });
  return res
    .status(201)
    .json({ message: "Customer successfully registered. Now you can login" });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  const allBooks = await getBooks();
  return res.status(200).json(allBooks);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  try {
    const book = await getBookByISBN(req.params.isbn);
    return res.status(200).json(book);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  try {
    const result = await filterBooksBy("author", req.params.author);
    return res.status(200).json({ booksbyauthor: result });
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  try {
    const result = await filterBooksBy("title", req.params.title);
    return res.status(200).json({ booksbytitle: result });
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
});

// Get book review
public_users.get("/review/:isbn", async function (req, res) {
  try {
    const book = await getBookByISBN(req.params.isbn);
    return res.status(200).json(book.reviews);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
});

module.exports.general = public_users;
