const express = require("express");
const next = require("next");
const dotenv = require("dotenv");
const registerRoutes = require("./routes/register_routes");
const Router = require('express').Router()
dotenv.config();

const port = 80;
const host = process.env.HOST || "127.0.0.1";
const dev = process.env.NODE_ENV !== "production";

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const apiRouter = Router;
  registerRoutes(apiRouter);
 
  // setup server
  server.use(express.json());
  server.use(express.urlencoded({extended : true}));
  server.use('/apis', apiRouter);
  server.use(async (req, res) => {
    await handle(req, res);
    return;
  });

  server.listen(port, () => {
    console.log(`> Ready on http://${port}`);
  });
});