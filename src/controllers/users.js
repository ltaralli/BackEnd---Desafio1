import UserServices from "../services/session.js";
import logger from "../utils/logger.js";

const userServices = new UserServices();

export const changeRole = async (req, res) => {
  let uid = req.params.uid;

  try {
    const hasRequiredDocuments = await userServices.checkDocuments(uid);

    console.log(hasRequiredDocuments);

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

    console.log(req.files);
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
