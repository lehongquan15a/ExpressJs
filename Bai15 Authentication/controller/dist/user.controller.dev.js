"use strict";

var db = require("../db");

var shortid = require("shortid");

module.exports.index = function (req, res) {
  res.render("users/index", {
    users: db.get("users").value()
  });
};

module.exports.view = function (req, res) {
  var id = req.params.id;
  var user = db.get("users").find({
    id: id
  }).value();
  res.render("users/user", {
    user: user
  });
};

module.exports.search = function (req, res) {
  var keyword = req.query.keyword;
  var MatchedText = db.get("users").filter(function (item) {
    return item.content.toLowerCase().indexOf(keyword.toLowerCase()) !== -1;
  }).value();
  res.render("users/index", {
    users: MatchedText,
    keyword: keyword
  });
};

module.exports.createGet = function (req, res) {
  res.render("users/create");
};

module.exports.createPost = function (req, res) {
  req.body.id = shortid.generate();
  var errors = [];

  if (!req.body.name) {
    errors.push('Name is required.');
  }

  if (!req.body.phone) {
    errors.push('Phone is required.');
  }

  if (errors.length) {
    res.render("users/create", {
      errors: errors,
      values: req.body
    });
    return;
  }

  db.get("users").push(req.body).write();
  res.redirect("/users");
};

module.exports["delete"] = function (req, res) {
  var id = req.params.id;
  db.get("users").remove({
    id: id
  }).write();
  res.redirect("/users");
};