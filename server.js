const express = require("express");
const cors = require("cors");
const userRoutes = require("../routes/User");
const videogameRoutes = require("../routes/Videogame");
require("dotenv").config();

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use("/api/user", userRoutes);
    this.app.use("/api/videogame", videogameRoutes);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server listening on port ${this.port}`);
    });
  }
}

sequelize
  .sync()
  .then(() => {
    console.log("Conexión a la base de datos establecida");
    const server = new Server();
    server.listen();
  })
  .catch((error) => {
    console.log("Error al conectar a la base de datos: ", error);
  });
