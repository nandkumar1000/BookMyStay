const Listing = requie("../models.listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const baseClient = mbxGecoding({ accessToken: mapToken });
module.exports.index = async (req, res) => {
  console.log('Fetching all listings...');
  const alllisting = await Listing.find({});
  res.render("listings/index", { alllisting });
}

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
}

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
  if (!listing) {
    req.flash("error", "Listing you  requested for  does not exit!");
    res.redirect("/listings");
  }
  res.render("listings/show", { listing });
}

module.exports.createLisiting = async (req, res) => {
  let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
  })
    .send();
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.Listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.feature[0].geometry;
  let savedlisting = await newListing.save();
  req.flash("succes", "New listing is created");
  res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you  requested for  does not exit!");
    res.redirect("/listings");
  }
  let orignalImageUrl = listing.imgae.Url;
  orignalImageUrl = orignalImageUrl.replace("/upload", "/upload/w_250")
  res.render("listings/edit", { listing, orignalImageUrl });
}

module.exports.updateListings = async (req, res, next) => {
  let { id } = req.params;
  // Log incoming data for debugging
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save()
  }
  if (!listing) {
    return next(new ExpressError(404, "Listing not found"));
  }

  // Log the updated listing
  const updatedListing = await Listing.findById(id);
  console.log("Updated Listing:", updatedListing);
  req.flash("succes", "Listings updated!");
  res.redirect(`/listings/${id}`);
}

module.exports.destroyListings = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("succes", "listing is Deleted");
  res.redirect('/listings');
}