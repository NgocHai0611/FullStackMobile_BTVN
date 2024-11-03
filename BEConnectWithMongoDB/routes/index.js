var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");
const cors = require("cors");

//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb'); // Ensure you have this import

let db;

// Connect to MongoDB
const mongoURI = 'mongodb://localhost:27017/Users'; // replace with your MongoDB URI


// Connect to MongoDB
MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to MongoDB');
        db = client.db('Users'); // Replace with your database name
    })
    .catch(err => console.error('MongoDB connection error:', err));


    router.get('/getUsersMongo', (req, res) => {
      db.collection('users')
          .find()
          .toArray()
          .then(users => {
              res.status(200).json(users); // Send users as JSON response
          })
          .catch(error => {
              console.error(error);
              res.status(500).send('Server Error'); // Handle errors
          });
    });

    router.post('/addUsersMongo', (req, res) => {
      const { name, password , avatar } = req.body;
  
      // Basic validation
      if (!name || !password) {
          return res.status(400).json({ message: 'Name and password are required.' });
      }
  
      const newUser = { name, password };
  
      db.collection('users')
          .insertOne(newUser)
          .then(result => {
              res.sendStatus(201);
          })
          .catch(error => {
              console.error(error);
              res.sendStatus(500);
          });
  });


  // Delete a user by ID
router.delete('/users/:id', (req, res) => {
  const userId = req.params.id;

  db.collection('users')
      .deleteOne({ _id: new ObjectId(userId) }) // Convert the string ID to ObjectId
      .then(result => {
          if (result.deletedCount === 0) {
              return res.status(404).json({ message: 'User not found' });
          }
          res.status(200).json({ message: 'User deleted' });
      })
      .catch(error => {
          console.error(error);
          res.status(500).send('Server Error');
      });
});


// Update
router.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  const { name, password , avatar } = req.body;

  // Basic validation
  if (!name && !password) {
      return res.status(400).json({ message: 'At least one field (name or password) is required to update.' });
  }

  const updateFields = {};
  if (name) updateFields.name = name;
  if (password) updateFields.password = password;

  db.collection('users')
      .updateOne({ _id: new ObjectId(userId) }, { $set: updateFields })
      .then(result => {
          if (result.matchedCount === 0) {
              return res.status(404).json({ message: 'User not found' });
          }
          res.status(200).json({ message: 'User updated' });
      })
      .catch(error => {
          console.error(error);
          res.status(500).send('Server Error');
      });
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
