const express = require("express");
const { isloggedin, isowner, isauthor } = require("./utils/middlware.js");
const app = express();
const wrapsync = require("./utils/wrapsync.js");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodoverride = require("method-override");
const cookieParser = require("cookie-parser");
app.set("view engine", "ejs");
const ExpressError = require("./utils/ExpressError.js");
app.set("views", path.join(__dirname, "views"));
main().catch((err) => console.log(err));
const ejsmate = require("ejs-mate");
app.use(express.urlencoded({ extended: true }));
app.use(methodoverride("_method"));
app.engine("ejs", ejsmate);

const userrouter = require("./routes/user.js");
const passport = require("passport");
const Localstrategy = require("passport-local");
const review = require("./routes/review.js");
const { listingschema } = require("./schema.js");
const Review = require("./models/review.js");

const session = require("express-session");
const flash = require("connect-flash");
const User = require("./models/user.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const { savedredirecturl } = require("./utils/middlware.js");
app.use(express.static(path.join(__dirname, "/public")));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
app.listen(8000, () => {
  console.log("it is working");
});
const sessionoptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(session(sessionoptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.err = req.flash("error");
  res.locals.current = req.user;

  next();
});
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", userrouter);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found"));
});
// errorhandling middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong!" } = err;
  res.render("error.ejs", { message });
});
