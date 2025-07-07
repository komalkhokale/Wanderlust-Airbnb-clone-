const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js"); // Utility function to handle async errors
const Listing = require("../models/listing.js"); // Listing model
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js"); // Middleware functions
const listingController = require("../controllers/listings.js"); // Controller for listing-related logic
const multer = require("multer"); // Multer for handling file uploads
const { storage } = require("../cloudConfig.js"); // Cloud storage configuration
const upload = multer({ storage }); // Multer instance with storage configuration

// Route to get all listings and create a new listing
router
  .route("/")
  .get(wrapAsync(listingController.index)) // Fetch all listings
  .post(
    isLoggedIn, // Ensure user is logged in
    upload.single("listing[image]"), // Handle single image upload
    validateListing, // Validate listing data
    wrapAsync(listingController.createListing) // Create a new listing
  );

// Route to render the form for creating a new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Routes for specific listing by ID
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing)) // Fetch a specific listing
  .put(
    isLoggedIn, // Ensure user is logged in
    isOwner, // Ensure user owns the listing
    upload.single("listing[image]"), // Handle single image upload
    validateListing, // Validate listing data
    wrapAsync(listingController.updateListings) // Update the listing
  )
  .delete(
    isLoggedIn, // Ensure user is logged in
    isOwner, // Ensure user owns the listing
    wrapAsync(listingController.destroyListings) // Delete the listing
  );

// Route to render the form for editing a listing
router.get(
  "/:id/edit",
  isLoggedIn, // Ensure user is logged in
  isOwner, // Ensure user owns the listing
  wrapAsync(listingController.renderEditForm) // Render edit form
);

module.exports = router; // Export the router
