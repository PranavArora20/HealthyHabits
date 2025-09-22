const express = require("express");

const healthRouter = express.Router();
const { getHealth } = require("../controllers/healthController");

healthRouter.get("/", getHealth);

module.exports = healthRouter;
