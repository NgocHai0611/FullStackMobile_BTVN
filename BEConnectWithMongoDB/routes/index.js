var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");
const cors = require("cors");

//lets require/import the mongodb native drivers.
var mongodb = require("mongodb");
const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");
const { ObjectId } = require("mongodb"); // Ensure you have this import

let db;

// Connect to MongoDB
const mongoURI = "mongodb://localhost:27017/Users"; // replace with your MongoDB URI

// Connect to MongoDB
MongoClient.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then((client) => {
    console.log("Connected to MongoDB");
    db = client.db("Users"); // Replace with your database name
  })
  .catch((err) => console.error("MongoDB connection error:", err));

/* GET All User. */
router.get("/listUser", function (req, res, next) {
  db.collection("users")
    .find()
    .toArray()
    .then((users) => {
      res.status(200).json(users); // Send users as JSON response
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Server Error"); // Handle errors
    });
});

router.post("/login", function (req, res, next) {
  const { username, password } = req.body; // Lấy username và password từ body

  // Kiểm tra kết nối MongoDB trước khi thực hiện truy vấn
  if (!db) {
    return res.status(500).send("MongoDB connection is not established");
  }

  const collection = db.collection("users"); // Lấy collection 'users'

  // Tạo điều kiện tìm kiếm với username và password
  let query = {};
  if (username) {
    query.name = username; // Tìm người dùng theo tên
  }
  if (password) {
    query.pass = password; // Tìm người dùng theo mật khẩu
  }

  // Thực hiện truy vấn trong MongoDB
  collection
    .find(query)
    .toArray()
    .then((users) => {
      if (users.length > 0) {
        res.status(200).json(users); // Trả về danh sách người dùng khớp điều kiện
      } else {
        res.status(404).json("Tài khoản không hợp lệ"); // Không tìm thấy người dùng
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Server Error"); // Xử lý lỗi khi truy vấn
    });
});

router.post("/addUser", function (req, res, next) {
  const { username, password, avatar } = req.body;

  // Basic validation
  if (!username || !password) {
    return res.status(400).json({ message: "Name and password are required." });
  }

  const newUser = { name: username, pass: password, avatar };

  db.collection("users")
    .insertOne(newUser)
    .then((result) => {
      res.sendStatus(201);
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(500);
    });
});

router.delete("/deleteUser/:id", function (req, res, next) {
  const userId = req.params.id;

  db.collection("users")
    .deleteOne({ _id: new ObjectId(userId) }) // Convert the string ID to ObjectId
    .then((result) => {
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User deleted" });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Server Error");
    });
});

router.put("/updateUser/:id", function (req, res, next) {
  const userId = req.params.id;
  const { username, password } = req.body; // Lấy dữ liệu từ body yêu cầu

  // Basic validation
  if (!username && !password) {
    return res.status(400).json({
      message: "At least one field (name or password) is required to update.",
    });
  }

  const updateFields = {};
  if (username) updateFields.name = username;
  if (password) updateFields.password = password;

  db.collection("users")
    .updateOne({ _id: new ObjectId(userId) }, { $set: updateFields })
    .then((result) => {
      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "User not foun d" });
      }
      res.status(200).json({ message: "User updated" });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Server Error");
    });
});

router.post("/findUser/:id", function (req, res, next) {
  const id = req.params.id; // Lấy ID từ params

  // Kiểm tra nếu MongoDB chưa kết nối
  if (!db) {
    return res.status(500).send("MongoDB connection is not established");
  }

  // Tìm kiếm user trong MongoDB
  db.collection("users")
    .findOne({ _id: new ObjectId(id) }) // Chuyển ID sang ObjectId
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User found", user });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Server Error");
    });
});

module.exports = router;
