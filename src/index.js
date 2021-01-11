/**
 * (main entry file) express server module
 */
import express from "express"
import cors from "cors"
import { mainRouter, router404 } from "./routes"
import { handleErrors, requestInterceptor } from "./middlewares"
import { logger } from "./middlewares/logger"
const qs = require("qs")
require("dotenv").config()
export const app = express()

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))

// parse application/json
app.use(express.json())

// configure CORS headers
app.use(cors())

//use request interceptors
//app.use(requestInterceptor);

//handle brizo routes
app.use("/", mainRouter)

//handle errors
app.use(handleErrors)

let port = process.env.PORT || 4002
let host = process.env.HOST || "localhost"
app.listen(port, () => {
  logger.info(`Server started on host (${host}) and port (${port}).`)
})
