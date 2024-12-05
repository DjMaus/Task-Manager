// DOM Elements for Quote Module
const quoteDisplay = document.getElementById("quote-display");
const fetchQuoteButton = document.getElementById("fetch-quote");

// Preloaded Quotes
const preloadedQuotes = [
    { q: "The only way to do great work is to love what you do.", a: "Steve Jobs" },
    { q: "Life is what happens when you're busy making other plans.", a: "John Lennon" },
    { q: "Do what you can, with what you have, where you are.", a: "Theodore Roosevelt" },
    { q: "Believe you can and you're halfway there.", a: "Theodore Roosevelt" },
    { q: "Act as if what you do makes a difference. It does.", a: "William James" },
];

// Define the API URL
const api_url = "https://cors-anywhere.herokuapp.com/https://zenquotes.io/api/random";

// Fetch and display a random quote
async function getapi(url) {
    try {
        // Display a loading message
        quoteDisplay.textContent = "Fetching a motivational quote...";

        // Fetch data from the API
        const response = await fetch(url);

        // Check for HTTP errors
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        // Parse the response JSON
        const data = await response.json();
        console.log("API Response:", data);

        // Extract the quote and author
        const quote = data[0]?.q || "No quote found";
        const author = data[0]?.a || "Unknown";

        // Display the quote on the webpage
        quoteDisplay.textContent = `"${quote}" — ${author}`;
    } catch (error) {
        // Handle API errors or offline fallback
        console.error("Error fetching quote:", error);

        // Use a random preloaded quote
        const randomIndex = Math.floor(Math.random() * preloadedQuotes.length);
        const { q: quote, a: author } = preloadedQuotes[randomIndex];

        // Display the preloaded quote
        quoteDisplay.textContent = `"${quote}" — ${author}`;
    }
}

// Add an event listener to the button
fetchQuoteButton.addEventListener("click", () => getapi(api_url));