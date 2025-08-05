// /aa1bb/Backend/Frontend Test Submission/server.js

const express = require('express');
const bodyParser = require('body-parser');

// Import the Log function from your middleware folder.
// Note the relative path: `../` moves up one directory level.
const { Log } = require('../../Logging Middleware/logger');

const app = express();
app.use(bodyParser.json());

// Example of using the Log function in a route handler
app.post('/shorturls', (req, res) => {
    // Log an informational message when a new request is received.
    Log("backend", "informational", "shorturl-handler", "New short URL request received.");

    // ... (rest of your microservice logic here) ...
    // ...
    // ...
    
    // Example of logging an error
    try {
        // ... some code that might fail ...
    } catch (error) {
        Log("backend", "error", "shorturl-handler", `An error occurred: ${error.message}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// ... other routes and server setup ...

const PORT = process.3333;
app.listen(PORT, () => {
    console.log(`Microservice listening on port ${PORT}`);
    // You could even log a message here with your middleware
    Log("backend", "informational", "server", `Application started on port ${PORT}.`);
});