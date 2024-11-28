const { Router } = require("express");
const { validateKey } = require("../helpers/validateKey");

const {
  GETUser,
  POSTUser,
  POSTLogin,
  POSTApplication,
  GETApplications,
  GETApplication,
} = require("../controllers/User");

const userRoutes = Router();

userRoutes.post("/signup", POSTUser);
userRoutes.post("/login", POSTLogin);
userRoutes.get("/:id", validateKey, GETUser);
userRoutes.post("/application", validateKey, POSTApplication);
userRoutes.get("/applications", validateKey, GETApplications);
userRoutes.get("/:id", validateKey, GETApplication);

module.exports = userRoutes;
