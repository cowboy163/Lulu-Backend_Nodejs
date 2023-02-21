import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import routes from "./routes";

const SERVER_PORT = 3001

createConnection().then(async connection => {
    let cors = require('cors')

    // create express app
    const app = express();
    app.use(bodyParser.json(), cors());
    app.use( express.json() )
    app.use( express.urlencoded({ extended: true }))
    // app.use(cors())

    // register express routes from defined application routes
    app.use('/', routes)

    // setup express app here
    // ...

    // start express server
    app.listen(SERVER_PORT);

    console.log(`Express server has started on port ${SERVER_PORT}. Open http://localhost:${SERVER_PORT} to see results`);

}).catch(error => console.log(error));
