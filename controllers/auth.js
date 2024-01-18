import userSchema from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signUp = async (req, res) => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  try {
    const newUser = new userSchema({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    await newUser.save();
    return res.status(200).json("berhasil membuat akun");
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const login = async (req, res) => {
  const user = await userSchema.findOne({ username: req.body.username });
  const email = await userSchema.findOne({ email: req.body.email });
  const data = user || email;
  try {
    if (user || email) {
      bcrypt.compare(req.body.password, data.password, (err, result) => {
        if (err) return res.status(400).json("masukkan password");
        if (!result) {
          return res.status(404).json("wrong password!");
        } else {
          const token = jwt.sign({ id: data._id }, "secretkey");
          const { $__, $isNew, ...val } = data;
          const { password, ...dataUser } = val._doc;
          return res
            .status(200)
            .cookie("accessToken", token, {
              httpOnly: true,
              secure: true,
              sameSite: "none",
            })
            .json(dataUser);
        }
      });
    } else {
      res.status(404).json("user not found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const logout = (req, res) => {
  res
    .clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .json("user has been loged out");
};
