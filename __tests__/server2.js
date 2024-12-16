const express = require("express");
const cors = require("cors");
const database = require("./models/context/IVDatabase_test");
const userRoutes = require("./routes/User");
const videogameRoutes = require("./routes/Videogame");

class Server2 {
  constructor() {
    this.app = express();
    this.port = 8084;
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
    this.app.listen(8084, () => {
      console.log(`Server listening on port ${this.port}`);
    });
  }
}

database
  .sync()
  .then(() => {
    const server = new Server();
    console.log("Conexión a la base de datos establecida");
    server.listen();
  })
  .catch((error) => {
    console.log("Error al conectar a la base de datos: ", error);
  });

module.exports = Server2;
