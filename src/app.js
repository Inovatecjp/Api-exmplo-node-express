import { resolve } from "path";

import "./database";
const bodyParser = require("body-parser");

import express from "express";
import cors from "cors";
import helmet from "helmet";

import validateResponse from "./middlewares/validateResponse";



import v1 from './apps'
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

const whiteList = ["http://localhost:3000"];

const corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());

    this.app.use(validateResponse);
  }

  routes() {
    this.app.use('/api-docs', swaggerUi.serve);
    this.app.get('/api-docs', swaggerUi.setup(swaggerDocument));


    this.app.use("/v1", v1);
   
    // //end points dev
    // this.app.use("/profile", profileRoutes);
    // this.app.use("/grands", grandsRoutes);

    // this.app.use("/bethouse_liga", betshouseRoutes);

  }
}

export default new App().app;
