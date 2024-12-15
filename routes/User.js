const { Router } = require("express");
const { validateKey } = require("../helpers/validateKey");

const {
  GETUser,
  POSTUser,
  POSTLogin,
  POSTApplication,
  GETApplications,
  GETApplication,
  PATCHApplication,
  PATCHEvaluateApplication,
  POSTRating,
  POSTComment,
} = require("../controllers/User");

const userRoutes = Router();

userRoutes.get("/", validateKey, GETUser);
userRoutes.post("/signup", POSTUser);
userRoutes.post("/login", POSTLogin);
userRoutes.post("/application", validateKey, POSTApplication);
userRoutes.get("/applications", validateKey, GETApplications);
userRoutes.get("/application", validateKey, GETApplication);
userRoutes.patch("/application", validateKey, PATCHApplication);
userRoutes.patch(
  "/application/evaluate",
  validateKey,
  PATCHEvaluateApplication
);
userRoutes.post("/rating", validateKey, POSTRating);
userRoutes.post("/comment", validateKey, POSTComment);

module.exports = userRoutes;
