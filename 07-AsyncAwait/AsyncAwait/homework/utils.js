'use strict';

var fs = require('fs');
var Promise = require('bluebird');
var chalk = require('chalk');

var utils = {};

utils.readFile = function (filename, callback) {
	var randExtraTime = Math.random() * 200;
	setTimeout(function () {
		fs.readFile(filename, function (err, buffer) {
			if (err) callback(err);
			else callback(null, buffer.toString());
		});
	}, randExtraTime);
};

utils.promisifiedReadFile = function (filename) {
	return new Promise(function (resolve, reject) {
		utils.readFile(filename, function (err, str) {
			if (err) reject(err);
			else resolve(str);
		});
	});
};

utils.blue = function (text) {
	console.log(chalk.blue.bold(text));
};

utils.cyanBright = text => {
	console.log(chalk.cyanBright.bold(text));
}

utils.redBright = text => {
	console.log(chalk.redBright.bold(text));
}

utils.yellowBright = text => {
	console.log(chalk.yellowBright.bold(text));
}

utils.magenta = function (text) {
	console.error(chalk.magentaBright.bold(text));
};

module.exports = utils;
