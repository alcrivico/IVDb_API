const Videogame = require("../models/Videogame");
const Developer = require("../models/Developer");
const Genre = require("../models/Genre");
const Platform = require("../models/Platform");
const { response } = require("express");

const GETVideogame = async (req, res = response) => {
  const { title, realeseDate } = req.body;

  try {
    const videogame = await Videogame.findOne({
      where: { title, realeseDate },
    });

    if (!videogame) {
      return res.status(404).json({ message: "Videojuego no encontrado" });
    }

    res.status(200).json(videogame);
  } catch (error) {
    res.status(500).json({ message: "No se pudo obtener el videojuego" });
  }
};

const POSTVideogame = async (req, res = response) => {
  const {
    title,
    description,
    realeseDate,
    imageRoute,
    developers,
    genres,
    platforms,
  } = req.body;

  try {
    const newVideogame = await Videogame.create({
      title,
      description,
      realeseDate,
      imageRoute,
    });

    if (developers && developers.length > 0) {
      const developerInstances = await Promise.all(
        developers.map(async (name) => {
          const [developer] = await Developer.findOrCreate({ where: { name } });
          return developer;
        })
      );
      await newVideogame.addDevelopers(developerInstances);
    }

    if (genres && genres.length > 0) {
      const genreInstances = await Promise.all(
        genres.map(async (name) => {
          const [genre] = await Genre.findOrCreate({ where: { name } });
          return genre;
        })
      );
      await newVideogame.addGenres(genreInstances);
    }

    if (platforms && platforms.length > 0) {
      const platformInstances = await Promise.all(
        platforms.map(async (name) => {
          const [platform] = await Platform.findOrCreate({ where: { name } });
          return platform;
        })
      );
      await newVideogame.addPlatforms(platformInstances);
    }

    res.status(201).json(newVideogame);
  } catch (error) {
    res.status(400).json({ message: "No se pudo crear el videojuego" });
  }
};

const PUTVideogame = async (req, res = response) => {
  const {
    title,
    realeseDate,
    newTitle,
    newRealeseDate,
    newImageRoute,
    newDevelopers,
    newGenres,
    newPlatforms,
  } = req.body;

  try {
    const videogame = await Videogame.findOne({
      where: { title, realeseDate },
    });

    if (!videogame) {
      return res.status(404).json({ message: "Videojuego no encontrado" });
    }

    await Videogame.update(
      {
        title: newTitle,
        realeseDate: newRealeseDate,
        imageRoute: newImageRoute,
      },
      { where: { title, realeseDate } }
    );

    if (newDevelopers && newDevelopers.length > 0) {
      const developerInstances = await Promise.all(
        newDevelopers.map(async (name) => {
          const [developer] = await Developer.findOrCreate({ where: { name } });
          return developer;
        })
      );
      await videogame.setDevelopers(developerInstances);
    }

    if (newGenres && newGenres.length > 0) {
      const genreInstances = await Promise.all(
        newGenres.map(async (name) => {
          const [genre] = await Genre.findOrCreate({ where: { name } });
          return genre;
        })
      );
      await videogame.setGenres(genreInstances);
    }

    if (newPlatforms && newPlatforms.length > 0) {
      const platformInstances = await Promise.all(
        newPlatforms.map(async (name) => {
          const [platform] = await Platform.findOrCreate({ where: { name } });
          return platform;
        })
      );
      await videogame.setPlatforms(platformInstances);
    }

    res.status(200).json({ message: "Videojuego actualizado" });
  } catch (error) {
    res.status(500).json({ message: "No se pudo actualizar el videojuego" });
  }
};

const DELETEVideogame = async (req, res = response) => {
  const { title, realeseDate } = req.body;

  try {
    const videogame = await Videogame.findOne({
      where: { title, realeseDate },
    });

    if (!videogame) {
      return res.status(404).json({ message: "Videojuego no encontrado" });
    }

    await Videogame.destroy({ where: { title, realeseDate } });

    res.status(200).json({ message: "Videojuego eliminado" });
  } catch (error) {
    res.status(500).json({ message: "No se pudo eliminar el videojuego" });
  }
};

module.exports = {
  GETVideogame,
  POSTVideogame,
  PUTVideogame,
  DELETEVideogame,
};
