const express = require("express");
const router = express.Router({ mergeParams: true }); // Router with merged params to access parent route parameters
const wrapAsync = require("../utils/wrapAsync.js"); // Utility function to handle async errors
const ExpressError = require("../utils/ExpressError.js"); // Custom error handling class
const Review = require("../models/review.js"); // Review model
const Listing = require("../models/listing.js"); // Listing model
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js"); // Middleware functions for validation and authorization

const reviewController = require("../controllers/reviews.js"); // Controller for review-related logic

// Route to create a new review
router.post(
  "/",
  isLoggedIn, // Ensure user is logged in
  validateReview, // Validate review data
  wrapAsync(reviewController.createReview) // Handle review creation logic
);

// Route to delete a review
router.delete(
  "/:reviewId",
  isLoggedIn, // Ensure user is logged in
  isReviewAuthor, // Ensure user is the author of the review
  wrapAsync(reviewController.destroyReview) // Handle review deletion logic
);

module.exports = router; // Export the router
