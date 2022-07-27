/**modulos requeridos */
var fs = require("fs");
var http = require("http");
var url = require("url");

// Escribí acá tu servidor

/**parametros**/
const host = '127.0.0.1';
const port = 8080;

/**responses */
const requestListener = (req, res) => {
    let status = 0;
    let image = url.parse(req.url, true).query;
    let pathFile = __dirname + `/images/${image.name}`;
    if (fs.existsSync(pathFile)) {
        status = 202;
        let file = fs.readFileSync(pathFile);
        res.writeHead(status, { 'Content-Type': 'image/jpeg' });
        res.end(file);
    } else {
        status = 404;
        let error = {
            status: status,
            message: 'No se encontro ninguna imagen con ese nombre'
        }
        res.writeHead(status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(error));
    }
    console.log(`${status} ${req.url}`);
}

/**servidor como tal */
const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Servidor corriendo en: ${host}:${port}`);
})