import cartSchema from "../models/cart.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const addCart = async (req, res) => {
  const token = req.cookies.accessToken;
  try {
    jwt.verify(token, process.env.SECRET_KEY, async (error, userInfo) => {
      if (error) return res.status(500).json("not logged in");
      const itemInCart = await cartSchema.find({
        item_id: req.params.id,
        user_id: userInfo.id,
      });
      if (itemInCart.length) {
        await cartSchema.findOneAndUpdate(
          { item_id: req.params.id, user_id: userInfo.id },
          { $inc: { qty: req.body.qty } },
          { new: true }
        );
        return res.status(200).json("berhasil menambah item yang ada");
      } else {
        const newCart = new cartSchema({
          user_id: userInfo.id,
          item_id: req.params.id,
          qty: req.body.qty,
          color: req.body.color,
          size: req.body.size,
          price: req.body.price,
          disc: req.body.disc,
          img: req.body.img,
          name: req.body.name,
        });
        await newCart.save();
        return res.status(200).json("berhasil tambah ke cart");
      }
    });
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getAllCart = (req, res) => {
  const token = req.cookies.accessToken;
  try {
    jwt.verify(token, process.env.SECRET_KEY, async (error, userInfo) => {
      if (error) return res.status(400).json("not logged in");
      const response = await cartSchema.find({
        user_id: userInfo.id,
      });
      return res.status(200).json(response);
    });
  } catch (error) {
    return res.status(404).json(error);
  }
};

export const removeFromCart = async (req, res) => {
  const token = req.cookies.accessToken;
  try {
    jwt.verify(token, process.env.SECRET_KEY, async (error, userInfo) => {
      if (error) return res.status(400).json("not logged in");
      const itemIncart = await cartSchema.find({
        item_id: req.body.id,
        user_id: userInfo.id,
      });
      if (itemIncart[0].qty > 1) {
        await cartSchema.findOneAndUpdate(
          { item_id: itemIncart[0].item_id, user_id: userInfo.id },
          { $inc: { qty: -1 } },
          { new: true }
        );
        return res.status(200).json("berhasil mengurangi item");
      } else {
        await cartSchema.findOneAndDelete({
          item_id: itemIncart[0].item_id,
          user_id: userInfo.id,
        });
        return res.status(200).json("berhasil menghapus item");
      }
    });
  } catch (error) {
    return res.status(400).json("gagal mengurangi item");
  }
};

export const clearCart = (req, res) => {
  const token = req.cookies.accessToken;
  try {
    jwt.verify(token, process.env.SECRET_KEY, async (error, userInfo) => {
      if (error) return res.status(400).json("not logged in");
      const response = await cartSchema.deleteMany({
        user_id: userInfo.id,
      });
      return res.status(200).json(response);
    });
  } catch (error) {
    res.status(500).json("server error");
  }
};
