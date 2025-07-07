// Custom error class for handling Express errors
class ExpressError extends Error {
    constructor(statusCode, message) {
        super(); // Call the parent class constructor
        this.statusCode = statusCode; // HTTP status code for the error
        this.message = message; // Error message
    }
}

// Export the custom error class for use in other parts of the application
module.exports = ExpressError;