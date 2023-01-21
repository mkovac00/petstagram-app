const fs = require("fs");
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

require("dotenv").config();

// Ovo ispod funkcionira kao nekakav middleware sada kojeg možemo
// koristit ovde u app.js nakon što smo ga export iz animalroutes
const animalsRoutes = require("./routes/animals-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

// Zato što ne možemo samo pristupit podacima na backendu iz sigurnosnih
// razloga, ne možemo tako pristupit ni slikama, pa zato imamo ovaj
// dio koda ispod koji nam odobrava da pristupimo slikama tj. samo ako
// tražimo podatke iz /uploads/images on će nam ih vratit
app.use("/uploads/images", express.static(path.join("uploads", "images")));

// Ovde dodajemo određene headers kako bi rijesili CORS problem tj.
// kako bi server i klijent mogli komunicirat na razlicitim portovima
// u ovom slucaju localhost 3000 i localhost 5000
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

// Kako bi osigurali da na ovaj route idemo samo kada smo na
// /api/animals/... a ne bilo kada treba dodati filter (prvi
// argument u ovom slučaju) na ovaj middleware
app.use("/api/animals", animalsRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

// Ako u middleware funkciju pošaljemo i 'error' parametar prije
// ostala tri, onda express.js to tretira kao poseban middleware
// tj. error handling middleware funkciju, i execute-at će se samo
// kada se dogodi neki error u middleware-u prije ovog middleware-a
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error occured!" });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d9zme.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
