const express = require("express");
const { check } = require("express-validator");

const animalsControllers = require("../controllers/animals-controllers");
const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-auth");

// express.Router nam daje posebni objekt pomoću kojeg možemo
// koristit i radit sa middleware-ima priko kojih šaljemo zahtjeve
const router = express.Router();

// aid == animalId
router.get("/:aid", animalsControllers.getAnimalById);

router.get("/user/:uid", animalsControllers.getAnimalsByUserId);

router.use(checkAuth);

router.post(
  "/",
  fileUpload.single("image"),
  [check("name").not().isEmpty(), check("description").isLength({ min: 5 })],

  animalsControllers.createAnimalCard
);

router.patch(
  "/:aid",
  [check("name").not().isEmpty(), check("description").isLength({ min: 5 })],
  animalsControllers.updateAnimalCard
);

router.delete("/:aid", animalsControllers.deleteAnimalCard);

module.exports = router;
