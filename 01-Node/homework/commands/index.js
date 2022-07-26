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
    cat: readFile,
    head: readFile,
    tail: readFile,
    echo: parseEcho,
    curl: getCurl,
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

function parseEcho(input) {
    var str = '';
    var inpSplit = input.split(' ');
    inpSplit.shift();
    if (commands[inpSplit[0]] !== undefined) {
        process.stdout.write(commands[inpSplit[0]].toString());
    } else {
        inpSplit.forEach(val => str = str + `${val} `);
        process.stdout.write(str.trim());
    }
}

function getCurl(url) {
    var urlSplit = url.split(' ');
    request(`https://${urlSplit[1]}/`, (err, res, body) => {
        if (err) throw err;
        process.stdout.write(body);
    });
}
module.exports = commands;