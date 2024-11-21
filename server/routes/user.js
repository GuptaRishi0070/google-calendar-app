
const express = require("express");
const passport = require("passport");

const router = express.Router();

router.get("/auth", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/auth/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("http://localhost:3000");
  }
);

router.get("/current", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});

module.exports = router;
