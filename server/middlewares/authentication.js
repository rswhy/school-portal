const { readPayloadFromToken } = require("../helpers/hashPassword");
const User = require('../models/user');

const authentication = async (req, res, next) => {
  try {
    const { access_token } = req.headers;
    const payload = readPayloadFromToken(access_token);

    console.log(payload);

    const userFound = await User.findOne({id: payload.id})
    
    console.log(userFound);

    if (!userFound) {
      throw { name: "Unauthorized", statusCode: 401 };
    } else {
      req.user = {
        id: userFound._id,
        name: userFound.name,
        email: userFound.email,
        role: userFound.role
      };
    }
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = { authentication }