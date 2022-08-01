'use strict'
/**repos */
var express = require('express');
var Router = express.Router();
/**variables */
var { PostController } = require('../Controllers/controller');


Router.get("/", PostController.getAllPosts);
Router.get("/:author", PostController.getByAuthor);
Router.get("/:author/:title", PostController.getByAuthorTitle);

Router.post('/', PostController.newPost);
Router.post("/author/:author", PostController.postAuthor);

Router.put("/", PostController.updatePost);

Router.delete("/", PostController.deletePost);

module.exports = Router;