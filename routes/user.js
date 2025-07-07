const express = require("express");
const router = express.Router(); // Create a new router instance
const User = require("../models/user.js"); // User model for database operations
const wrapAsync = require("../utils/wrapAsync"); // Utility function to handle async errors
const passport = require("passport"); // Passport for authentication
const { saveRedirectUrl } = require("../middleware.js"); // Middleware to save redirect URL

const userController = require("../controllers/users.js"); // Controller for user-related logic

// Routes for user signup
router
  .route("/signup")
  .get(userController.renderSignupForm) // Render the signup form
  .post(wrapAsync(userController.signUp)); // Handle user signup logic

// Routes for user login
router
  .route("/login")
  .get(userController.renderLoginForm) // Render the login form
  .post(
    saveRedirectUrl, // Middleware to save the redirect URL
    passport.authenticate("local", {
      failureRedirect: "/login", // Redirect to login page on failure
      failureFlash: true, // Display error message on failure
    }),
    userController.login // Handle user login logic
  );

// Route for user logout
router.get("/logout", userController.logout); // Handle user logout logic

module.exports = router; // Export the router
