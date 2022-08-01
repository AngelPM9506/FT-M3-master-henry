const { server } = require('./server.js');

const PORT = 8080;

server.listen(PORT, () => {
    console.log(`Servidor Corriendo en http://127.0.0.1:${PORT}`);
});
