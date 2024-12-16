const Server = require("./server");
const Server2 = require("./server2");
const server = new Server().app;
const server2 = new Server2().app;

module.exports = { server, server2 };
