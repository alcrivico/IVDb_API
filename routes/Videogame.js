const { Router } = require("express");
const { validateKey } = require("../helpers/validateKey");

const {
  GETVideogame,
  GETVideogames,
  POSTVideogame,
  GETUserComment,
  GETCUserComments,
  GETPUserComments,
  PATCHHideComment,
  PUTVideogame,
  DELETEVideogame,
} = require("../controllers/Videogame");

const videogameRoutes = Router();

videogameRoutes.get("/single/:title/:releaseDate", validateKey, GETVideogame);
videogameRoutes.get("/group/:limit/:page/:filter", validateKey, GETVideogames);
videogameRoutes.get("/comment", validateKey, GETUserComment);
videogameRoutes.get("/comments/critic", validateKey, GETCUserComments);
videogameRoutes.get("/comments/public", validateKey, GETPUserComments);
videogameRoutes.patch("/comment/hide", validateKey, PATCHHideComment);
videogameRoutes.post("/add", validateKey, POSTVideogame);
videogameRoutes.put("/change", validateKey, PUTVideogame);
videogameRoutes.delete("/delete", validateKey, DELETEVideogame);

module.exports = videogameRoutes;
