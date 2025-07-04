const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const data = await Listing.find();
  res.render("index.listings.ejs", { data });
};

module.exports.rendernewform = (req, res) => {
  res.render("new.listings.ejs");
};

module.exports.showlisting = async (req, res) => {
  let { id } = req.params;
  const list = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "owner" } })
    .populate("owner");

  res.render("show.listings.ejs", { list });
};
module.exports.createlisting = async (req, res, next) => {
  try {
    let url = req.file.path;
    let filename = req.file.filename;

   

    let listing = new Listing(req.body.listings);
    listing.image = { url, filename };
    listing.owner = req.user._id;

    console.log(listing);
    await listing.save();

    req.flash("success", "New listing Created");
    res.redirect(`/listings/${listing._id}`);
  } catch (err) {
    next(err);
  }
};

module.exports.rendereditform = async (req, res) => {
  let { id } = req.params;
  const list = await Listing.findById(id);
  const photo = list.image.url;
  photo.replace("/upload", "/upload/h_300");
  res.render("edit.listings.ejs", { list, photo });
};

module.exports.updatelisting = async (req, res) => {
  if (!req.body.listings) {
    throw new ExpressError(400, "send valid data for listing");
  }
  let { id } = req.params;
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    let listing = await Listing.findByIdAndUpdate(id, {
      ...req.body.listings,
    });
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", " listing updated successfully!");
  res.redirect(`/listings/${id}`);
};

module.exports.deletelisting = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", " listing deleted successfully!");
  res.redirect("/listings");
};
