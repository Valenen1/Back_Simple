import { connect } from "../databases";
import jwt from "jsonwebtoken";

// const global
const claveSecreta = process.env.SECRET_KEY || "your-default-secret-key";

export const logIn = async (req, res) => {
  try {
    const { dni, contra } = req.body;
    const cnn = await connect();

    const q = `SELECT contra FROM alumno WHERE dni=?`;
    const value = [dni];
    const [result] = await cnn(q, value);

    if (result.length > 0) {
      if (result[0].contra === contra) {
        const token = getToken({ dni: dni });
        return res
          .status(200)
          .json({ message: "correcto", success: true, token: token });
      } else {
        return res.status(400).json({
          message: "o el usuario o la contraseña son incorrectos",
          success: false,
        });
      }
    } else {
      return res
        .status(400)
        .json({ message: "el user no existe", success: false });
    }
  } catch (error) {
    res.status(500).json({ message: "fallo en el catch", error: error });
  }
};

const validation = async (campo, valor, tabla, cnn) => {
  const q = `SELECT * FROM ${tabla} WHERE ${campo}=?`;
  const value = [valor];
  const [result] = await cnn(q, value);
  return result.length === 1;
};

export const createUsers = async (req, res) => {
  try {
    const cnn = await connect();
    const { dni, nombre, contra } = req.body;
    const userExist = await validation("dni", dni, "alumno", cnn);

    if (userExist)
      return res.status(400).json({ message: "el usuario ya existe" });

    const [result] = await cnn(
      "INSERT INTO alumno ( dni, nombre, contra) VALUES (?,?,?)",
      [dni, nombre, contra]
    );

    if (result.affectedRows === 1) {
      return res
        .status(200)
        .json({ message: "se creo el usuario", success: true });
    } else {
      return res
        .status(500)
        .json({ message: "no se creo el usuario", success: false });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const authorization = (req, res, next) => {
  const tokenFront = req.headers["authorization"];
  if (!tokenFront) return res.status(400).json({ message: "no hay token" });

  jwt.verify(tokenFront, claveSecreta, (error, payLoad) => {
    if (error) {
      return res.status(400).json({ message: "el token no es valido" });
    } else {
      req.payLoad = payLoad;
      next();
    }
  });
};

export const getMateriasbyDni = (req, res) => {
  const dni = req.payLoad.dni;
  const materias = [
    { id: 1, nombre: "so2" },
    { id: 2, nombre: "web" },
    { id: 3, nombre: "arquitectura" },
  ];
  return res.status(200).json(materias);
};

export const addMateria = async (req, res) => {
  try {
    const cnn = await connect();
    const { nombre_materia } = req.body;

    if (!nombre_materia) {
      return res
        .status(400)
        .json({ message: "El nombre de la materia es obligatorio" });
    }

    const materiaExist = await validation(
      "nombre_materia",
      nombre_materia,
      "materia",
      cnn
    );

    if (materiaExist)
      return res.status(400).json({ message: "La materia ya existe" });

    const [result] = await cnn(
      "INSERT INTO materia (nombre_materia) VALUES (?)",
      [nombre_materia]
    );

    if (result.affectedRows === 1) {
      return res
        .status(200)
        .json({ message: "Se creó la materia", success: true });
    } else {
      return res
        .status(500)
        .json({ message: "No se creó la materia", success: false });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const cursarMateria = async (req, res) => {
  try {
    const cnn = await connect();
    const { dni, id_m } = req.body;

    // Verificar que ambos campos están presentes y son válidos

    // Realizar la inserción en la tabla 'cursar'
    const [result] = await cnn.query(
      "INSERT INTO cursar (dni, id_m) VALUES (?, ?)",
      [dni, id_m]
    );

    if (result.affectedRows === 1) {
      return res
        .status(200)
        .json({ message: "Se creó la cursada", success: true });
    } else {
      return res
        .status(500)
        .json({ message: "No se pudo crear la cursada", success: false });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

const getToken = (payLoad) => {
  const token = jwt.sign(payLoad, claveSecreta, { expiresIn: "5h" });
  return token;
};
