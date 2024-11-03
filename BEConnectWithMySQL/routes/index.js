var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");
const cors = require("cors");

const pool = mysql.createPool({
  host: "localhost",
  user: "root", // Thay bằng user của bạn
  password: "haipro456", // Thay bằng password của bạn
  database: "usermoblie", // Thay bằng tên database của bạn
});

/* GET All User. */
router.get("/listUser", function (req, res, next) {
  pool
    .query("SELECT * FROM user")
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Lỗi khi lấy dữ liệu người dùng" });
    });
});

router.post("/login", function (req, res, next) {
  const { username, password } = req.body;

  if (username == "admin" && password == "adminpassword") {
    res.status(200).json({ role: "admin" });
  } else {
    pool
      .query("SELECT * FROM user WHERE name = ? AND pass = ?", [
        username,
        password,
      ])
      .then((data) => {
        if (data[0].length > 0) {
          res.status(200).json({ user: data[0] });
        } else {
          res.status(404).json("Tai Khoan Khong Hop Le");
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(500);
      });
  }
});

router.post("/addUser", function (req, res, next) {
  const { username, password, avatar } = req.body;

  pool
    .query("Insert into user (name , pass ,avatar) values (? , ? , ?)", [
      username,
      password,
      avatar,
    ])
    .then((respone) => {
      res.sendStatus(200);
    })
    .catch((error) => {
      res.sendStatus(500);
    });
});

router.delete("/deleteUser/:id", function (req, res, next) {
  const userId = req.params.id;

  pool
    .query("DELETE FROM user WHERE id = ?", [userId])
    .then((response) => {
      res.status(200).json({ message: "User deleted successfully" });
    })
    .catch((error) => {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Error deleting user" });
    });
});

router.put("/updateUser/:id", function (req, res, next) {
  const userId = req.params.id;
  const { username, password } = req.body; // Lấy dữ liệu từ body yêu cầu

  pool
    .query("UPDATE user SET name = ?, pass = ? WHERE id = ?", [
      username,
      password,
      userId,
    ])
    .then((response) => {
      // Người dùng đã được cập nhật thành công
      res.status(200).json({ message: "User updated successfully" });
    })
    .catch((error) => {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Error updating user" });
    });
});

module.exports = router;
