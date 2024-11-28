const User = require("../models/User");
const Application = require("../models/Application");
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
    res.status(500).json({ message: "No se pudo obtener el usuario" });
  }
};

const POSTUser = async (req, res = response) => {
  const { username, email, password } = req.body;
  try {
    const newUser = await User.create({
      username,
      email,
      password,
      roleId: 1,
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: "No se pudo crear el usuario" });
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
    res.status(500).json({ message: "No se pudo iniciar sesión" });
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

      res.status(201).json(newApplication);
    }
  } catch (error) {
    res.status(500).json({ message: "No se pudo crear la solicitud" });
  }
};

const GETApplications = async (req, res = response) => {
  try {
    const applications = await Application.findAll();

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "No se pudieron obtener las solicitudes" });
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
    res.status(500).json({ message: "No se pudo obtener la solicitud" });
  }
};

module.exports = {
  GETUser,
  POSTUser,
  POSTLogin,
  POSTApplication,
  GETApplications,
  GETApplication,
};
