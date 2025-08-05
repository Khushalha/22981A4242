
const TEST_SERVER_BASE_URL = "http://mock-test-server.example.com";
const MOCK_CLIENT_ID = "2fdfc51c-21e5-4c81-9a2d-64a39e51751c";
const MOCK_CLIENT_SECRET = "yQtgXWXwqaHMgkeu";
const MOCK_ACCESS_CODE = "yvhdda";
const MOCK_EMAIL = "22981a4242@raghuenggcollege.in";
const MOCK_ROLL_NO = "22981A4242";
const MOCK_NAME = "Khushalha";

const credentials = {
  clientID: "2fdfc51c-21e5-4c81-9a2d-64a39e51751c",
  clientSecret: "yQtgXWXwqaHMgkeu",
  accessCode: "yvhdda",
  email:"22981a4242@raghuenggcollege.in",
  rollNo: "22981A4242",
  name: "Khushalha",
};

let currentToken = null;
let tokenExpiryTime = 0; 

/**
 * Gets a new authorization token from the Test Server (or returns a cached one).
 * This function is asynchronous as it performs a network request.
 * @returns {Promise<string>} The access token.
 */
async function getAccessToken() {
  if (currentToken && tokenExpiryTime > Date.now() + 60000) {
    return currentToken;
  }

  console.log("Requesting new access token...");
  const authUrl = `${TEST_SERVER_BASE_URL}/auth`;
  const authPayload = { ...credentials, name: MOCK_NAME, mobileNo: "9999999999", githubUsername: "mockuser" };
  
  try {
    await new Promise(resolve => setTimeout(resolve, 100));

    const data = {
      token_type: "Bearer",
      access_token: "mock_jwt_token." + Math.random().toString(36).substring(2),
      expires_in: 3600 
    };
    
    currentToken = data.access_token;
    tokenExpiryTime = Date.now() + data.expires_in * 1000;
    
    console.log("New access token obtained.");
    return currentToken;

  } catch (error) {
    console.error('Authentication Error:', error.message);
    throw error;
  }
}

/**
 * Sends a structured log message to the test server API.
 * This is the core function of the middleware.
 * @param {string} stack Must be lowercase (e.g., "backend", "frontend").
 * @param {string} level Must be lowercase (e.g., "error", "informational").
 * @param {string} package Must be lowercase (e.g., "api-handler", "db").
 * @param {string} message A descriptive log message.
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

    console.log("Sending log:", logPayload);
    await new Promise(resolve => setTimeout(resolve, 50));
    console.log("Log sent successfully.");

  } catch (error) {
    console.error('Error in logging function:', error.message);
  }
}

module.exports = {
  Log,
};