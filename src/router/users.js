//archivo para manejar las rutas de usuarios

import { Router } from "express";
import {
  authorization,
  createUsers,
  getMateriasbyDni,
  logIn,
  addMateria,
  cursarMateria,
} from "../controller/users";

//objeto para manejo de url
const routerUsers = Router();

//Enpoint para loguear usuario
/**
 * @swagger
 * /user/login:
 *  post:
 *      sumary: loguear usuario
 */
routerUsers.post("/user/login", logIn);

/**
 * @swagger
 * /usersp:
 *  post:
 *      sumary: crea usuarios
 */
routerUsers.post("/user/usersp", createUsers);

/**
 * @swagger
 * /getMaterias:
 *  get:
 *      sumary: devuelve la materias para un usuario determinado
 */
routerUsers.get("/user/getMaterias", authorization, getMateriasbyDni);

/**
 * @swagger
 * /addMateria:
 *  post:
 *      sumary: agrega materias
 */
routerUsers.post("/user/addMateria", authorization, addMateria);

/**
 * @swagger
 * /usersp:
 *  post:
 *      sumary: crea usuarios
 */
routerUsers.post("/user/cursarMateria", cursarMateria);

export default routerUsers;
