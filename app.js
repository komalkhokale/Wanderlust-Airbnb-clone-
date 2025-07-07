// Load environment variables in non-production mode
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

// Import required modules
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoDBStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// Import routers
const listeningRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// Database connection URL
const dbUrl = process.env.ATLASDB_URL;

// Connect to MongoDB
async function main() {
  await mongoose.connect(dbUrl);
}
main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

// Set up view engine and views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware for parsing request body and overriding HTTP methods
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Use ejs-mate for EJS templates
app.engine("ejs", ejsMate);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "/public")));

// Configure session store using MongoDB
const store = MongoDBStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600, // time in seconds
});

store.on("error", (err) => {
  console.log("Session store error: ", err);
});

// Session options configuration
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUnintialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 3, // 3 days expiration
    maxAge: 1000 * 60 * 60 * 24 * 3, // 3 days max age
    httpOnly: true, // Prevent client-side access to cookies
  },
};

// Use session and flash middleware
app.use(session(sessionOptions));
app.use(flash());

// Initialize Passport for authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to set local variables for templates
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Use routers for different routes
app.use("/listings", listeningRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// Start the server on port 8080
app.listen(8080, (req, res) => {
  console.log("Server is listening on port 8080");
});
