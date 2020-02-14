//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

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

const secret = 'thisisatopsecret';
userSchema.plugin(encrypt,({secret:secret,encryptedFields:['password']}));


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
  const newUser = new User({
    username: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err) {
    if (!err) {
      res.render('secrets');
    }
  });
});
app.post("/login", function(req, res) {
  User.findOne({
    username: req.body.username,
  }, function(err, foundUser) {
    if (foundUser) {
      if (foundUser.password === req.body.password) {
        res.render('secrets');
      }
    } else res.send('user not found')
  });
});


app.listen(3000, function() {
  console.log("Server Listening at port 3000");
});
