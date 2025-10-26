const { fetchUserById } = require("../models/users");

exports.getUserById = async (req, res, next) => {
  const { id } = req.params;

  let isNumber = true;
  for (let i = 0; i < id.length; i++) {
    if (id[i] < "0" || id[i] > "9") {
      isNumber = false;
    }
  }

  if (!isNumber) {
    return res.status(400).send({ msg: "Bad Request" });
  }

  try {
    const user = await fetchUserById(id);
    if (!user) {
      return res.status(404).send({ msg: "Error: User not found" });
    }
    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
};