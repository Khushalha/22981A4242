/**
 * @fileoverview Reusable Logging Middleware for the Evaluation Service.
 * This module handles authentication and logs messages to the Test Server.
 */

const TEST_SERVER_BASE_URL = "http://20.244.56.144/evaluation-service";
const CLIENT_ID = "2fdfc51c-21e5-4c81-9a2d-64a39e51751c";
const CLIENT_SECRET = "yQtgXWXwqaHMgkeu";
const ACCESS_CODE = "yvhdda";
const EMAIL = "22981a4242@raghuenggcollege.in";
const GITHUB_USERNAME = "khushalha";
const ROLL_NO = "22981A4242";
const NAME = "Khushalha";

let currentToken = null;
let tokenExpiryTime = 0;

/**
 * Gets a new authorization token from the Test Server.
 * @returns {Promise<string>} The access token.
 */
async function getAccessToken() {
  if (currentToken && tokenExpiryTime > Date.now() + 60000) {
    return currentToken;
  }

  const authUrl = `${TEST_SERVER_BASE_URL}/auth`;
  const authPayload = {
    "email": "22981a4242@raghuenggcollege.in",
    "name": "khushalha",
    "rollNo": "22981a4242",
    "accessCode": "yvhdda",
    "clientID": "2fdfc51c-21e5-4c81-9a2d-64a39e51751c",
    "clientSecret": "yQtgXWXwqaHMgkeu"
  };

  try {
    const response = await fetch(authUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(authPayload),
    });

    if (!response.ok) {
      throw new Error(`Failed to authenticate. Status: ${response.status}`);
    }

    const data = await response.json();
    currentToken = data.access_token;
    tokenExpiryTime = Date.now() + data.expires_in * 1000;
    
    return currentToken;

  } catch (error) {
    console.error('Authentication Error:', error);
    throw error;
  }
}

/**
 * A reusable logging function that sends structured log messages to the Test Server.
 *
 * @param {string} stack The high-level component (e.g., "backend"). Must be lowercase.
 * @param {string} level The severity level (e.g., "error", "fatal"). Must be lowercase.
 * @param {string} package The specific module or package (e.g., "handler"). Must be lowercase.
 * @param {string} message A specific and descriptive log message.
 */
async function Log(stack, level, package, message) {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      console.error("Cannot log: No access token available.");
      return;
    }

    const logUrl = `${TEST_SERVER_BASE_URL}/logs`;
    const logPayload = {
      timestamp: new Date().toISOString(),
      stack: stack.toLowerCase(),
      level: level.toLowerCase(),
      package: package.toLowerCase(),
      message: message,
    };

    const response = await fetch(logUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`, 
      },
      body: JSON.stringify(logPayload),
    });

    if (!response.ok) {
      console.error(`Failed to send log. Status: ${response.status}. Response: ${await response.text()}`);
    } else {
      // Optional: console.log("Log successfully sent to Test Server.");
    }
  } catch (error) {
    console.error('Error in logging function:', error);
  }
}

module.exports = {
  Log
};