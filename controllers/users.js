
module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs")
}

module.exports.signup = async (req, res) => {
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

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
}

module.exports.login = async (req, res) => {
  req.flash("success", "welcome back to BookMyStay");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
  req.logout((err => {
    if (err) {
      return next(err);
    }
    req.flash("success", "you have been logged out");
    res.redirect("/listings");
  }));

}