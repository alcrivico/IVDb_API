const User = require("../models/User");
const Rating = require("../models/Rating");
const Application = require("../models/Application");
const Comment = require("../models/Comment");
const Videogame = require("../models/Videogame");
const { generateKey } = require("../helpers/generateKey");
const { response } = require("express");

const GETUser = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email, password } });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "No se pudo obtener el usuario", error });
  }
};

const POSTUser = async (req, res = response) => {
  const { username, email, password } = req.body;
  try {
    const newUser = await User.create({
      username,
      email,
      password,
      roleId: 2,
    });

    const userResponse = await User.findOne({ where: { email } });

    res.status(201).json(userResponse);
  } catch (error) {
    res.status(400).json({ message: "No se pudo crear el usuario", error });
  }
};

const POSTLogin = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || user.password !== password) {
      return res
        .status(401)
        .json({ message: "Usuario y/o contraseña incorrectos" });
    }

    const token = await generateKey(user.id);

    res
      .status(200)
      .header("x-token", token)
      .json({
        message: `Bienvenido ${user.username}`,
        user,
      });
  } catch (error) {
    res.status(500).json({ message: "No se pudo iniciar sesión", error });
  }
};

const POSTApplication = async (req, res = response) => {
  const { email, request } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const application = await Application.findOne({
      where: { userId: user.id },
    });

    if (application) {
      application.request = request;
      application.requestDate = Date.now();
      await application.save();

      return res.status(200).json(application);
    } else {
      const newApplication = new Application({
        request,
        requestDate: new Date(),
        userId: user.id,
      });

      await newApplication.save();

      const applicationResponse = await Application.findOne({
        where: { userId: user.id },
      });

      res.status(201).json(applicationResponse);
    }
  } catch (error) {
    res.status(500).json({ message: "No se pudo crear la solicitud", error });
  }
};

const GETApplications = async (req, res = response) => {
  try {
    const applications = await Application.findAll();

    res.status(200).json(applications);
  } catch (error) {
    res
      .status(500)
      .json({ message: "No se pudieron obtener las solicitudes", error });
  }
};

const GETApplication = async (req, res = response) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const application = await Application.findOne({
      where: { userId: user.id },
    });

    if (!application) {
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }

    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: "No se pudo obtener la solicitud", error });
  }
};

const PATCHApplication = async (req, res = response) => {
  const { email, request } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const application = await Application.findOne({
      where: { userId: user.id },
    });

    if (!application) {
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }

    application.request = request;
    application.requestDate = new Date();
    await application.save();

    res.status(200).json(application);
  } catch (error) {
    res
      .status(500)
      .json({ message: "No se pudo actualizar la solicitud", error });
  }
};

const PATCHEvaluateApplication = async (req, res = response) => {
  const { email, state } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const application = await Application.findOne({
      where: { userId: user.id },
    });

    if (!application) {
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }

    application.state = state;

    await application.save();

    if (application.state) {
      user.roleId = 3;
      await user.save();
    }

    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: "No se pudo evaluar la solicitud", error });
  }
};

const POSTRating = async (req, res = response) => {
  const { email, title, releaseDate, rate } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const videogame = await Videogame.findOne({
      where: { title, releaseDate },
    });

    if (!videogame) {
      return res.status(404).json({ message: "Videojuego no encontrado" });
    }

    const rating = await Rating.findOne({
      where: { userId: user.id, videogameId: videogame.id },
    });

    if (rating) {
      rating.rate = rate;
      await rating.save();
    } else {
      const newRating = new Rating({
        rate,
        createdAt: new Date(),
        userId: user.id,
        videogameId: videogame.id,
      });

      await newRating.save();
    }

    res.status(201).json({ message: "Calificación exitosa", rate });
  } catch (error) {
    res.status(500).json({ message: "No se pudo calificar", error });
  }
};

const POSTComment = async (req, res = response) => {
  const { email, title, releaseDate, comment } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const videogame = await Videogame.findOne({
      where: { title, releaseDate },
    });

    if (!videogame) {
      return res.status(404).json({ message: "Videojuego no encontrado" });
    }

    const rating = await Rating.findOne({
      where: { userId: user.id, videogameId: videogame.id },
    });

    if (!rating) {
      return res
        .status(404)
        .json({ message: "No es posible comentar hasta calificar el juego" });
    }

    const newComment = new Comment({
      content: comment,
      createdAt: new Date(),
      ratingId: rating.id,
    });

    await newComment.save();

    const commentResponse = await Comment.findOne({
      where: { id: newComment.id },
    });

    res.status(201).json({ message: "Comentario exitoso", commentResponse });
  } catch (error) {
    res.status(500).json({ message: "No se pudo comentar", error });
  }
};

module.exports = {
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
};
