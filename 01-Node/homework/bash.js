const commands = require('./commands');
const promp = 'henry-promp# ';

process.stdout.write(promp);
const done = val => {
    if (Array.isArray(val)) {
        val.forEach(item => process.stdout.write('\n' + item))
    } else {
        process.stdout.write(val);
    }
    process.stdout.write('\n' + promp);
}

process.stdin.on('data', function (data) {
    var cmd = data.toString().trim(); //remueve la nueva línea
    var cmdSplit = cmd.split(' ');
    if (commands[cmdSplit[0]] !== undefined) {
        commands[cmdSplit[0]](cmd, done);
    } else {
        process.stdout.write(`Comando ${cmd} no encontrado intenta de nuevo`);
        process.stdout.write('\n' + promp);
    }
});