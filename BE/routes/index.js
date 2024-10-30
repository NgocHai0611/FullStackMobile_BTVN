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
  console.log(req.body);
});

router.delete("/deleteUser/:id", function (req, res, next) {});

router.put("/updateUser/:id", function (req, res, next) {});

module.exports = router;
