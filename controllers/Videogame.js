const Videogame = require("../models/Videogame");
const Developer = require("../models/Developer");
const Genre = require("../models/Genre");
const Platform = require("../models/Platform");
const User = require("../models/User");
const Role = require("../models/Role");
const Rating = require("../models/Rating");
const Comment = require("../models/Comment");
const VideogameDetailedView = require("../models/views/VideogameDetailedView");
const { response } = require("express");
const { where, Op } = require("sequelize");
const e = require("express");

const GETVideogame = async (req, res = response) => {
  const { title, releaseDate } = req.params;

  req.params.title = req.params.title.replace("-", " ");

  try {
    const videogame = await VideogameDetailedView.findOne({
      where: { title, releaseDate },
    });

    if (!videogame) {
      return res.status(404).json({ message: "Videojuego no encontrado" });
    }

    res.status(200).json(videogame);
  } catch (error) {
    res.status(500).json({ message: "No se pudo obtener el videojuego" });
  }
};

const GETVideogames = async (req, res = response) => {
  const { filter, limit, page } = req.params;
  const limitNumber = parseInt(limit) || 8;
  const pageNumber = parseInt(page) || 1;
  const offsetNumber = (pageNumber - 1) * limitNumber;

  let order;

  switch (filter) {
    case "A-Z":
      order = [["title", "ASC"]];
      break;
    case "Z-A":
      order = [["title", "DESC"]];
      break;
    case "MasRecientes":
      order = [["releaseDate", "DESC"]];
      break;
    case "MasAntiguos":
      order = [["releaseDate", "ASC"]];
      break;
    default:
      order = [["title", "ASC"]];
  }

  try {
    const videogames = await VideogameDetailedView.findAll({
      limit: limitNumber,
      offset: offsetNumber,
      order: order || [["title", "ASC"]],
    });

    res.status(200).json(videogames);
  } catch (error) {
    res
      .status(500)
      .json({ message: "No se pudo obtener los videojuegos", error });
  }
};

const GETUserComment = async (req, res = response) => {
  const { title, releaseDate, email } = req.body;

  try {
    const videogame = await Videogame.findOne({
      where: { title, releaseDate },
    });

    if (!videogame) {
      return res.status(404).json({ message: "Videojuego no encontrado" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const comment = await Comment.findOne({
      include: [
        {
          model: Rating,
          where: {
            [Op.and]: [{ videogameId: videogame.id }, { userId: user.id }],
          },
          include: [
            {
              model: User,
              where: { email },
              include: [
                {
                  model: Role,
                },
              ],
            },
          ],
        },
      ],
    });

    if (!comment) {
      return res.status(404).json({ message: "Comentario no encontrado" });
    }

    res.status(200).json(comment);
  } catch (error) {
    res
      .status(500)
      .json({ message: "No se pudo obtener el comentario", error });
  }
};

const GETCUserComments = async (req, res = response) => {
  const { title, releaseDate } = req.body;

  console.log(title, releaseDate);

  try {
    const videogame = await Videogame.findOne({
      where: { title, releaseDate },
    });

    console.log(videogame.title);

    if (!videogame) {
      return res.status(404).json({ message: "Videojuego no encontrado" });
    }

    const comments = await Comment.findAll({
      where: { hidden: false },
      include: [
        {
          model: Rating,
          where: { videogameId: videogame.id },
          include: [
            {
              model: User,
              where: { roleId: 3 },
              include: [
                {
                  model: Role,
                },
              ],
            },
          ],
        },
      ],
    });

    res.status(200).json(comments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "No se pudieron obtener los comentarios", error });
  }
};

const GETPUserComments = async (req, res = response) => {
  const { title, releaseDate } = req.body;

  try {
    const videogame = await Videogame.findOne({
      where: { title, releaseDate },
    });

    if (!videogame) {
      return res.status(404).json({ message: "Videojuego no encontrado" });
    }

    const comments = await Comment.findAll({
      where: { hidden: false },
      include: [
        {
          model: Rating,
          where: { videogameId: videogame.id },
          include: [
            {
              model: User,
              where: { roleId: 2 },
              include: [
                {
                  model: Role,
                },
              ],
            },
          ],
        },
      ],
    });

    res.status(200).json(comments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "No se pudieron obtener los comentarios", error });
  }
};

const PATCHHideComment = async (req, res = response) => {
  const { value, title, releaseDate, email } = req.body;

  try {
    const videogame = await Videogame.findOne({
      where: { title, releaseDate },
    });

    if (!videogame) {
      return res.status(404).json({ message: "Videojuego no encontrado" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const comment = await Comment.findOne({
      include: [
        {
          model: Rating,
          where: {
            [Op.and]: [{ videogameId: videogame.id }, { userId: user.id }],
          },
          include: [
            {
              model: User,
              where: { email },
              include: [
                {
                  model: Role,
                },
              ],
            },
          ],
        },
      ],
    });

    if (!comment) {
      return res.status(404).json({ message: "Comentario no encontrado" });
    }

    comment.hidden = value;
    await comment.save();

    res.status(200).json(comment);
  } catch (error) {
    res
      .status(500)
      .json({ message: "No se pudo ocultar el comentario", error });
  }
};

const POSTVideogame = async (req, res = response) => {
  const {
    title,
    description,
    releaseDate,
    imageRoute,
    developers,
    genres,
    platforms,
  } = req.body;

  try {
    const newVideogame = await Videogame.create({
      title,
      description,
      releaseDate,
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

    const videogameResponse = await Videogame.findOne({
      where: { title, releaseDate },
    });

    res.status(201).json(videogameResponse);
  } catch (error) {
    res.status(400).json({ message: "No se pudo crear el videojuego", error });
  }
};

const PUTVideogame = async (req, res = response) => {
  const {
    title,
    releaseDate,
    newTitle,
    newDescription,
    newReleaseDate,
    newImageRoute,
    newDevelopers,
    newGenres,
    newPlatforms,
  } = req.body;

  try {
    const videogame = await Videogame.findOne({
      where: { title, releaseDate },
    });

    if (!videogame) {
      return res.status(404).json({ message: "Videojuego no encontrado" });
    }

    await Videogame.update(
      {
        title: newTitle,
        description: newDescription,
        releaseDate: newReleaseDate,
        imageRoute: newImageRoute,
      },
      { where: { title, releaseDate } }
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

    res.status(200).json({ message: "Videojuego actualizado", videogame });
  } catch (error) {
    res
      .status(500)
      .json({ message: "No se pudo actualizar el videojuego", error });
  }
};

const DELETEVideogame = async (req, res = response) => {
  const { title, releaseDate } = req.body;

  try {
    const videogame = await Videogame.findOne({
      where: { title, releaseDate },
    });

    if (!videogame) {
      return res.status(404).json({ message: "Videojuego no encontrado" });
    }

    await Videogame.destroy({ where: { title, releaseDate } });

    res.status(200).json({ message: "Videojuego eliminado" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "No se pudo eliminar el videojuego", error });
  }
};

module.exports = {
  GETVideogame,
  GETVideogames,
  GETUserComment,
  GETCUserComments,
  GETPUserComments,
  PATCHHideComment,
  POSTVideogame,
  PUTVideogame,
  DELETEVideogame,
};
