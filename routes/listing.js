const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapsync = require("../utils/wrapsync.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const { isloggedin, isowner, isauthor } = require("../utils/middlware.js");
const { listingSchema, reviewSchema } = require("../models/listing.js");
const { storage } = require("../cloudconfig.js");
const multer = require("multer");
const upload = multer({ storage });
const listingcontroller = require("../controllers/listings.js");

router.get("/new", isloggedin, listingcontroller.rendernewform);
//create route
router
  .route("/")
  .get(wrapsync(listingcontroller.index))
  .post(
    isloggedin,
    upload.single("listings[image]"),
    wrapsync(listingcontroller.createlisting)
  );
// show route
router
  .route("/:id")
  .get(wrapsync(listingcontroller.showlisting))
  .put(
    isloggedin,
    isowner,
    upload.single("listings[image]"),
    wrapsync(async (req, res) => {
      res.send(req.file);
    })
  )
  .delete(isloggedin, wrapsync(listingcontroller.deletelisting));
// edit route
router.get("/:id/edit", isowner, wrapsync(listingcontroller.rendereditform));

module.exports = router;
