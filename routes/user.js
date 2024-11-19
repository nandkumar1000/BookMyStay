const express = require("express");
const router = express.Router();
const User = require("../model/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs")
})
router.post("/signup", wrapAsync(
  async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const regisereduser = await User.register(newUser, password);
      req.login(regisereduser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("Success", "User Was Registered")
        req.redirect("/listings")
      })
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  }
))

// for login
router.get("/login", (req, res) => {
  res.render("users/login.ejs");
})
// for router post login
router.post("/login", saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), async (req, res) => {
  req.flash("success", "welcome back to BookMyStay");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
})
// for log out
router.get("/logout", (req, res, next) => {
  req.logout((err => {
    if (err) {
      return next(err);
    }
    req.flash("success", "you have been logged out");
    res.redirect("/listings");
  }));

});
module.exports = router;