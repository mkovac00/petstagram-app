const fs = require("fs");

const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Animal = require("../models/animal");
const User = require("../models/user");

const getAnimalById = async (req, res, next) => {
  // params property sadrži objekt gdje naš dynamic segment
  // tj. ovaj :aid dio postoji kao nekakav key
  const animalId = req.params.aid;

  let animal;

  try {
    animal = await Animal.findById(animalId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find an animal.",
      500
    );
    return next(error);
  }

  if (!animal) {
    const error = new HttpError(
      "Could not find an animal for the provided ID.",
      404
    );
    return next(error);
  }

  // Vraćamo json, jer ovaj json ovde sadrži bilo koji objekt npr.
  // broj, niz, string itd. kojeg lako pritvorimo u json za lakše
  // korištenje kasnije
  res.json({ animal: animal.toObject({ getters: true }) }); // isto kao i => { animal } => { animal: animal }
};

const getAnimalsByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let userWithAnimals;
  try {
    userWithAnimals = await User.findById(userId).populate("animals");
  } catch (err) {
    const error = new HttpError(
      "Fetching animals failed, please try again.",
      500
    );
    return next(error);
  }

  // if (!userWithAnimals || userWithAnimals.animals.length === 0) {
  //   return next(
  //     new HttpError("Could not find any animals for the provided user ID.", 404)
  //   );
  // }

  res.json({
    animals: userWithAnimals.animals.map((animal) =>
      animal.toObject({ getters: true })
    ),
  });
};

const createAnimalCard = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, description } = req.body;
  const createdAnimalCard = new Animal({
    name,
    description,
    image: req.file.path,
    creator: req.userData.userId,
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
      "Creating an animal card failed, please try again",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError(
      "Could not find user for the provided ID.",
      404
    );
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdAnimalCard.save({ session: sess });

    user.animals.push(createdAnimalCard);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating animal card failed. Please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ animal: createdAnimalCard });
};

const updateAnimalCard = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid input passed, please check your data.", 422)
    );
  }

  const { name, description } = req.body;
  const animalId = req.params.aid;

  let animal;
  try {
    animal = await Animal.findById(animalId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update the animal card.",
      500
    );
    return next(error);
  }

  if (animal.creator.toString() !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to edit this animal card.",
      401
    );
    return next(error);
  }

  animal.name = name;
  animal.description = description;

  try {
    await animal.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update the animal card.",
      500
    );
    return next(error);
  }

  res.status(200).json({ animal: animal.toObject({ getters: true }) });
};

const deleteAnimalCard = async (req, res, next) => {
  const animalId = req.params.aid;

  let animal;
  try {
    animal = await Animal.findById(animalId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete the animal card.",
      500
    );
    return next(error);
  }

  if (!animal) {
    const error = new HttpError(
      "Could not find animal for the provided ID.",
      404
    );
    return next(error);
  }

  if (animal.creator.id !== req.userData.userId) {
    const error = new HttpError(
      "You don't have permission to delete this animal card.",
      401
    );
    return next(error);
  }

  const imagePath = animal.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await animal.remove({ session: sess });
    animal.creator.animals.pull(animal);
    await animal.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete the animal card.",
      500
    );
    return next(error);
  }

  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  res.status(200).json({ message: "Deleted the animal card." });
};

exports.getAnimalById = getAnimalById;
exports.getAnimalsByUserId = getAnimalsByUserId;
exports.createAnimalCard = createAnimalCard;
exports.updateAnimalCard = updateAnimalCard;
exports.deleteAnimalCard = deleteAnimalCard;
