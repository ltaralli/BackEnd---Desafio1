import UserServices from "../services/session.js";
import logger from "../utils/logger.js";

const userServices = new UserServices();

export const changeRole = async (req, res) => {
  let uid = req.params.uid;
  try {
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
      status: "success",
      msg: `Se cambio el rol del usuario ${user.email} a ${user.role}`,
    });
  } catch (error) {
    logger.error(error);
  }
};
