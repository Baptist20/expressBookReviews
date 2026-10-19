// Run the server first (npm start), then in another terminal: node axios_client.js
const axios = require("axios");
const BASE = "http://localhost:5000";

// Task 14: list of books, using a Promise callback
function getBookListWithPromise() {
  return axios
    .get(`${BASE}/`)
    .then((response) => {
      console.log("All books (promise):", response.data);
      return response.data;
    })
    .catch((err) => console.error("Failed to fetch books:", err.message));
}

// Same request with async/await
async function getBookList() {
  try {
    const { data } = await axios.get(`${BASE}/`);
    console.log("All books (async/await):", data);
    return data;
  } catch (err) {
    console.error("Failed to fetch books:", err.message);
  }
}

// Bonus: the other search endpoints with async/await
async function getByISBN(isbn) {
  try {
    const { data } = await axios.get(`${BASE}/isbn/${isbn}`);
    console.log(`ISBN ${isbn}:`, data);
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
}

async function getByAuthor(author) {
  try {
    const { data } = await axios.get(
      `${BASE}/author/${encodeURIComponent(author)}`,
    );
    console.log(`Author "${author}":`, data);
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
}

async function getByTitle(title) {
  try {
    const { data } = await axios.get(
      `${BASE}/title/${encodeURIComponent(title)}`,
    );
    console.log(`Title "${title}":`, data);
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
}

(async () => {
  await getBookListWithPromise();
  await getBookList();
  await getByISBN(1);
  await getByAuthor("Jane Austen");
  await getByTitle("Things Fall Apart");
})();
