const mongoose = require("mongoose");
const User = require("../models/user");

exports.user_signup = (req, res, next) => {
  console.log("inside signup");
  const data = req.body;
  console.log("data", data);

  User.find({ email: data.email })
    .exec()
    .then((user) => {
      console.log("user", user);

      if (user.length >= 1) {
        return res.status(409).json({
          message: "User exists",
        });
      } else {
        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          mobileNumber: data.mobileNumber,
        });

        user
          .save()
          .then((result) => {
            console.log("result", result);
            res.status(201).json({
              message: "User created",
              data: result,
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              error: err,
            });
          });
      }
    });
};

exports.user_login = (req, res) => {
  User.find();
};
