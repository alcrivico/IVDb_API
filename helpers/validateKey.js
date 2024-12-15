const { request, response } = require("express");
const jwt = require("jsonwebtoken");

const { SECRET_KEY } = require("../helpers/config");
console.log("SECRET_KEY: ", SECRET_KEY);

const validateKey = (req = request, res = response, next) => {
  const token = req.header("x-token");

  console.log("GIVEN_KEY: ", token);

  if (!token) {
    return res.status(401).json({ mensaje: "No hay token en la petición" });
  }

  try {
    const { uid } = jwt.verify(token, SECRET_KEY);
    req.uid = uid;

    console.log(uid);
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ mensaje: "Token no válido" });
  }
};

module.exports = {
  validateKey,
};
