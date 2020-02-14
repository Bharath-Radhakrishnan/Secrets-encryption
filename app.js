//jshint esversion:6
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
mongoose.connect('mongodb://localhost:27017/userDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});




const User = mongoose.model('User', userSchema);




app.get("/", function(req, res) {
  res.render("home");
});
app.get("/login", function(req, res) {
  res.render("login");
});
app.get("/register", function(req, res) {
  res.render("register");
});
app.post("/register", function(req, res) {
  const username= req.body.username;
  const password= req.body.password;
  bcrypt.hash(password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    const newUser = new User({
      username: username,
      password: hash
    });
    newUser.save(function(err) {
      if (!err) {
        res.render('secrets');
      }
    });
  });

});
app.post("/login", function(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  //console.log(password);
  User.findOne({
    username: username,
  }, function(err, foundUser) {
    if (foundUser) {
      bcrypt.compare(password, foundUser.password, function(err, result) {
        if (result) {
          res.render('secrets');
        } else {
          res.send('password incorrect');
        }

      });

    } else res.send('user not found')
  });
});


app.listen(3000, function() {
  console.log("Server Listening at port 3000");
});
