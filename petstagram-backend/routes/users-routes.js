const express = require("express");
const { check } = require("express-validator");

const usersControllers = require("../controllers/users-controllers");

// express.Router nam daje posebni objekt pomoću kojeg možemo
// koristit i radit sa middleware-ima priko kojih šaljemo zahtjeve
const router = express.Router();

// uid == userId
router.get("/", usersControllers.getUsers);

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 8 }),
  ],
  usersControllers.signUp
);

router.post("/login", usersControllers.login);

module.exports = router;
