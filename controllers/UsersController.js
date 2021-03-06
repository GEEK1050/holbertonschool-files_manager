/* eslint-disable */

const DBClient = require("../utils/db");
const sha1 = require("sha1");
const ObjectId = require("mongodb").ObjectId;

exports.postNew = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) return res.status(400).json({ error: "Missing email" });
    if (!password) return res.status(400).json({ error: "Missing password" });

    const user = await DBClient.db.collection("users").findOne({ email });
    if (user) return res.status(400).json({ error: "Already exist" });

    const h_password = sha1(password);

    const user_data = await DBClient.db
      .collection("users")
      .insertOne({ email, password: h_password });
    return res.status(201).send({ email, id: user_data.insertedId });
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

exports.getMe = async (req, res) => {
  const usr = DBClient.db
    .collection("users")
    .findOne({ _id: ObjectId(req.userID) });

  if (!usr) return res.status(401).json({ error: "Unauthorized" });

  return res.status(200).json({ id: usr._id, email: usr.email });
};
