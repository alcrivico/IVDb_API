const jwt = require("jsonwebtoken");

const { SECRET_KEY } = require("../helpers/config");

const generateKey = (uid = "") => {
  return new Promise((resolve, reject) => {
    const payload = { uid };

    jwt.sign(payload, SECRET_KEY, { expiresIn: "2h" }, (err, token) => {
      if (err) {
        reject("No se pudo generar el token");
      } else {
        resolve(token);
      }
    });
  });
};

module.exports = {
  generateKey,
};
