const crypto = require("crypto");
require("dotenv").config();

const SECRET_KEY =
  process.env.SECRET_KEY || crypto.randomBytes(20).toString("hex");

try {
  console.log(`Clave generada: ${SECRET_KEY}`);
} catch (error) {
  console.log(`Error al generar clave: ${error}`);
}

module.exports = {
  SECRET_KEY,
};
