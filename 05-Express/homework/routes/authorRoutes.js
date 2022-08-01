'use strict'
/**repos */
var express = require('express');
var Router = express.Router();
/**variables */
var { AuthorController } = require('../Controllers/controller');

Router.delete("/", AuthorController.AutorDelete);

module.exports = Router;