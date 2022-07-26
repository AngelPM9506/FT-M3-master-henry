var fs = require('fs');
var request = require('request');
var filesListe = [];
fs.readdir('.', (err, files) => {
    if (err) throw err;
    files.forEach(file => filesListe.push(file));
});

const commands = {
    date: (data, fun) => { fun(Date()) },
    pwd: (data, fun) => { fun(process.cwd()) },
    ls: (data, fun) => { fun(filesListe) },
    cat: (data, fun) => readFile(data, fun),
    head: (data, fun) => readFile(data, fun),
    tail: (data, fun) => readFile(data, fun),
    echo: (data, fun) => parseEcho(data, fun),
    curl: (data, fun) => getCurl(data, fun),
};

function readFile(comand, fun) {
    var comandSplit = comand.split(' ');
    var type = comandSplit[0];
    var file = comandSplit[1];
    fs.readFile(file, (err, bodyFile) => {
        if (err) throw err;
        switch (type) {
            case 'cat':
                fun(bodyFile);
                break;
            case 'head':
                fun(bodyFile.toString('utf-8').split('\n').slice(0,5).join('\n'));
                break;
            case 'tail':
                fun(bodyFile.toString('utf-8').split('\n').slice(-5).join('\n'));
                break;
        }
    });
}

function parseEcho(input, fun) {
    var str = '';
    var inpSplit = input.split(' ');
    inpSplit.shift();
    if (commands[inpSplit[0]] !== undefined) {
        fun(commands[inpSplit[0]].toString())
    } else {
        inpSplit.forEach(val => str = str + `${val} `);
        fun(str.trim());
    }
}

function getCurl(url, fun) {
    var urlSplit = url.split(' ');
    request(`https://${urlSplit[1]}/`, (err, res, body) => {
        if (err) throw err;
        fun(body);
    });
}
module.exports = commands;