const Videogame = require("../models/Videogame");
const Developer = require("../models/Developer");
const Genre = require("../models/Genre");
const Platform = require("../models/Platform");
const { response } = require("express");
const { where, Op } = require("sequelize");

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

const GETVideogames = async (req, res = response) => {
  const { filter, limit, page } = req.query;
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
    case "Mas Recientes":
      order = [["releaseDate", "DESC"]];
      break;
    case "Mas Antiguos":
      order = [["releaseDate", "ASC"]];
      break;
    default:
      order = [["title", "ASC"]];
  }

  try {
    const videogames = await Videogame.findAll({
      limit: limitNumber,
      offset: offsetNumber,
      order: order,
    });

    res.status(200).json(videogames);
  } catch (error) {
    res.status(500).json({ message: "No se pudo obtener los videojuegos" });
  }
};

const GETUserComment = async (req, res = response) => {
  const { title, realeseDate, email } = req.body;

  try {
    const videogame = await Videogame.findOne({
      where: { title, realeseDate },
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
            },
          ],
          include: [
            {
              model: Videogame,
              where: { title, realeseDate },
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
    res.status(500).json({ message: "No se pudo obtener el comentario" });
  }
};

const GETCUserComments = async (req, res = response) => {
  const { title, realeseDate } = req.body;

  try {
    const videogame = await Videogame.findOne({
      where: { title, realeseDate },
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
              where: { roleId: 3 },
              include: [
                {
                  model: Role,
                  where: { id: 3 },
                },
              ],
            },
          ],
        },
      ],
    });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "No se pudieron obtener los comentarios" });
  }
};

const GETPUserComments = async (req, res = response) => {
  const { title, realeseDate } = req.body;

  try {
    const videogame = await Videogame.findOne({
      where: { title, realeseDate },
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
                  where: { id: 2 },
                },
              ],
            },
          ],
        },
      ],
    });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "No se pudieron obtener los comentarios" });
  }
};

const PATCHHideComment = async (req, res = response) => {
  const { value, title, realeseDate, email } = req.body;

  try {
    const videogame = await Videogame.findOne({
      where: { title, realeseDate },
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
            },
          ],
          include: [
            {
              model: Videogame,
              where: { title, realeseDate },
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
    res.status(500).json({ message: "No se pudo ocultar el comentario" });
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
  GETVideogames,
  GETUserComment,
  GETCUserComments,
  GETPUserComments,
  PATCHHideComment,
  POSTVideogame,
  PUTVideogame,
  DELETEVideogame,
};
