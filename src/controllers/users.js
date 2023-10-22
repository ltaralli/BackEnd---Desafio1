import UserServices from "../services/session.js";
import logger from "../utils/logger.js";

const userServices = new UserServices();

export const getUsers = async (req, res) => {
  try {
    const users = await userServices.getAll();
    res.send({ status: "successful", users });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "error",
      msg: "Error al obtener los usuarios",
    });
  }
};

export const changeRole = async (req, res) => {
  let uid = req.params.uid;

  try {
    const hasRequiredDocuments = await userServices.checkDocuments(uid);

    if (!hasRequiredDocuments) {
      return res.status(400).send({
        status: "error",
        error: "El usuario no ha subido todos los documentos requeridos",
      });
    }

    // Continuar con el cambio de rol
    let user = await userServices.getById(uid);
    if (!user) {
      return res.status(400).send({
        status: "error",
        error: `No existe un usuario con el id ${uid}`,
      });
    }

    user.role === "user" ? (user.role = "premium") : (user.role = "user");
    await user.save();

    return res.send({
      status: "successful",
      msg: `Se cambió el rol del usuario ${user.email} a ${user.role}`,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      msg: "Error al cambiar de rol del usuario",
      error: error.message,
    });
    logger.error(error);
  }
};

export const updateDocuments = async (req, res) => {
  try {
    const uid = req.params.uid;
    const documentName = req.files[0].filename;
    const documentPath = req.files[0].path;

    const documentInfo = {
      name: documentName,
      reference: documentPath,
    };

    const updatedUser = await userServices.updateDocument(uid, documentInfo);
    if (updatedUser) {
      res.send({
        status: "successful",
        message: "Documento subido correctamente",
        user: updatedUser,
      });
    }
  } catch (error) {
    res.status(500).send({
      status: error,
      msg: "Error al subir el documento",
      error: error,
    });
    logger.error(error);
  }
};

export const deleteAccounts = async (req, res) => {
  try {
    const maxLastConnection = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

    const { result, usersToDelete } = await userServices.deleteAccounts(
      maxLastConnection
    );

    if (result.deletedCount > 0) {
      res.send({
        status: "successful",
        message: "usuarios eliminados correctamente",
        payload: usersToDelete.map((user) => user.email),
        deleted: result.deletedCount,
      });
    } else {
      res.send({
        status: "successful",
        message: "No se encontraron usuarios a eliminar",
        deleted: result.deletedCount,
      });
    }
  } catch (error) {
    res.status(500).send({
      status: error,
      msg: "Error al eliminar usuarios",
      error: error,
    });
    logger.error(error);
  }
};

export const deleteUser = async (req, res) => {
  let user = req.params.uid;
  try {
    const result = await userServices.deleteUser(user);

    if (result) {
      res.send({
        status: "successful",
        msg: "Usuario eliminado correctamente",
      });
    }
  } catch (error) {
    res.status(500).send({
      status: "error",
      msg: "No se puedo eliminar al usuario",
      error: error,
    });
  }
};
