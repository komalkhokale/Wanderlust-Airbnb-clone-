const Listing = require("../models/listing.js"); // Import the Listing model

// Listing index route - Fetch and display all listings
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

// Route to render the form for creating a new listing
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// Route to show a specific listing by ID
module.exports.showListing = async (req, res) => {
  let { id } = req.params; // Extract listing ID from request parameters
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews", // Populate reviews associated with the listing
      populate: {
        path: "author", // Populate the author of each review
      },
    })
    .populate("owner"); // Populate the owner of the listing
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist..!"); // Flash error message if listing doesn't exist
    return res.redirect("/listings"); // Redirect to listings page
  }
  res.render("listings/show.ejs", { listing }); // Render the listing details page
};

// Route to create a new listing
module.exports.createListing = async (req, res, next) => {
  let url = req.file.path; // Get the uploaded image URL
  let filename = req.file.filename; // Get the uploaded image filename

  const newListing = new Listing(req.body.listing); // Create a new listing object
  newListing.owner = req.user._id; // Set the owner of the listing to the logged-in user
  newListing.image = { url, filename }; // Add image details to the listing
  await newListing.save(); // Save the listing to the database
  req.flash("success", "New Listing Created..!"); // Flash success message
  res.redirect("/listings"); // Redirect to the listings page
};

// Route to render the form for editing a listing
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params; // Extract listing ID from request parameters
  const listing = await Listing.findById(id); // Find the listing by ID
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist..!"); // Flash error message if listing doesn't exist
    return res.redirect("/listings"); // Redirect to listings page
  }

  let originalImageUrl = listing.image.url; // Get the original image URL
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250"); // Modify the image URL for thumbnail display
  res.render("listings/edit.ejs", { listing, originalImageUrl }); // Render the edit form
};

// Route to update a listing
module.exports.updateListings = async (req, res) => {
  let { id } = req.params; // Extract listing ID from request parameters
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }); // Update the listing details

  if (typeof req.file !== "undefined") {
    let url = req.file.path; // Get the uploaded image URL
    let filename = req.file.filename; // Get the uploaded image filename
    listing.image = { url, filename }; // Update the image details
    await listing.save(); // Save the updated listing
  }
  req.flash("success", "Listing Updated..!"); // Flash success message
  res.redirect(`/listings/${id}`); // Redirect to the updated listing page
};

// Route to delete a listing
module.exports.destroyListings = async (req, res) => {
  let { id } = req.params; // Extract listing ID from request parameters
  let deletedListing = await Listing.findByIdAndDelete(id); // Delete the listing by ID
  console.log(deletedListing); // Log the deleted listing details
  req.flash("success", "Listing Deleted..!"); // Flash success message
  res.redirect("/listings"); // Redirect to the listings page
};
