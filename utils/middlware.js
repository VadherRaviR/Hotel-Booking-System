const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.isloggedin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.yash = req.baseUrl + req.path;

    req.flash("error", "you must be logged in to create listing");
    return res.redirect("/login");
  }

  next();
};
module.exports.savedredirecturl = (req, res, next) => {
  if (req.session.yash) {
    res.locals.redirecturl = req.session.yash;
  }
  next();
};
module.exports.isowner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  if (res.locals.current && !listing.owner._id.equals(res.locals.current._id)) {
    req.flash("error", "sorry you don't have access to edit!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
module.exports.isauthor = async (req, res, next) => {
  let { id, reviewid } = req.params;
  let listing = await Review.findById(reviewid);

  if (res.locals.current && !listing.owner._id.equals(res.locals.current._id)) {
    req.flash("error", "sorry you don't have access to edit!");

    return res.redirect(`/listings/${id}`);
  }
  next();
};
