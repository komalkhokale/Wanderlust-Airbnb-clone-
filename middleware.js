const Listing = require("./models/listing.js"); // Listing model
const Review = require("./models/review.js"); // Review model
const { listingSchema } = require("./schema.js"); // Schema for validating listings
const ExpressError = require("./utils/ExpressError.js"); // Custom error class
const { reviewsSchema } = require("./schema.js"); // Schema for validating reviews

// Middleware to check if the user is logged in
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; // Save the URL the user was trying to access
    req.flash("error", "You are not Log-In...😕"); // Flash error message
    return res.redirect("/login"); // Redirect to login page
  }
  next();
};

// Middleware to save the redirect URL for later use
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl; // Save redirect URL in local variables
  }
  next();
};

// Middleware to check if the user is the owner of a listing
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params; // Extract listing ID from request parameters
  let listing = await Listing.findById(id); // Find the listing by ID
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of this listing"); // Flash error message
    return res.redirect(`/listings/${id}`); // Redirect to the listing page
  }
  next();
};

// Middleware to validate listing data
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body); // Validate the listing data
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(","); // Extract error messages
    throw new ExpressError(400, errMsg); // Throw validation error
  } else {
    next();
  }
};

// Middleware to validate review data
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewsSchema.validate(req.body); // Validate the review data
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(","); // Extract error messages
    throw new ExpressError(400, errMsg); // Throw validation error
  } else {
    next();
  }
};

// Middleware to check if the user is the author of a review
module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params; // Extract listing and review IDs
  let review = await Review.findById(reviewId); // Find the review by ID
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the author of this review"); // Flash error message
    return res.redirect(`/listings/${id}`); // Redirect to the listing page
  }
  next();
};
