import { Router } from "express";
import estadosRouter from "./estado.js";
import municipiosRouter from "./municipios.js";
const v1Router = Router();
v1Router.use('/estados',estadosRouter)
v1Router.use('/municipios',municipiosRouter)
export default v1Router;