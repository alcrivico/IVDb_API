const { Router } = require("express");
const { validateKey } = require("../helpers/validateKey");

const {
  GETVideogame,
  POSTVideogame,
  PUTVideogame,
  DELETEVideogame,
} = require("../controllers/Videogame");

const videogameRoutes = Router();

videogameRoutes.get("/:id", validateKey, GETVideogame);
videogameRoutes.post("/", validateKey, POSTVideogame);
videogameRoutes.put("/:id", validateKey, PUTVideogame);
videogameRoutes.delete("/:id", validateKey, DELETEVideogame);
