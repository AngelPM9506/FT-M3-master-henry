/**dependencias */
var http = require('http');
var fs = require('fs');
const url = require('url');


/**datos */
var beatles = [
  {
    name: "John Lennon",
    birthdate: "09/10/1940",
    profilePic: "https://blogs.correiobraziliense.com.br/trilhasonora/wp-content/uploads/sites/39/2020/10/CBNFOT081020100047-550x549.jpg"
  },
  {
    name: "Paul McCartney",
    birthdate: "18/06/1942",
    profilePic: "http://gazettereview.com/wp-content/uploads/2016/06/paul-mccartney.jpg"
  },
  {
    name: "George Harrison",
    birthdate: "25/02/1946",
    profilePic: "https://canaldosbeatles.files.wordpress.com/2012/02/george-george-harrison-8321345-438-600.jpg"
  },
  {
    name: "Richard Starkey",
    birthdate: "07/08/1940",
    profilePic: "http://cp91279.biography.com/BIO_Bio-Shorts_0_Ringo-Starr_SF_HD_768x432-16x9.jpg"
  }
]
/**parametros*/
const host = '127.0.0.1';
const port = 8080;

/**responce */
const listener = (req, res) => {
  var status = 0;
  var templeteHTML = fs.readFileSync(`${__dirname}/index.html`, 'utf-8');
  if (req.url === '/') {
    status = 200;
    let beatlesHTMLArray = beatles.map(beatle => {
      let html = fs.readFileSync(`${__dirname}/beatle.html`, 'utf-8');
      html = html.replace(/{name}/g, beatle.name);
      html = html.replace(/{birthdate}/g, beatle.birthdate);
      html = html.replace(/{profilePic}/g, beatle.profilePic);
      return html;
    });
    console.log(beatlesHTMLArray);
    templeteHTML = templeteHTML.replace('{section}', beatlesHTMLArray.join('\n'));
    res.writeHead(status, { 'Content-Type': 'text/html' });
    res.end(templeteHTML);
  } else {
    console.log(url.parse(req.url, true).query.name);
    for (let i = 0; i < beatles.length; i++) {
      if (url.parse(req.url, true).query.name === beatles[i].name) {
        status = 200;
        let html = fs.readFileSync(`${__dirname}/beatle.html`, 'utf-8');
        html = html.replace(/{name}/g, beatles[i].name);
        html = html.replace(/{birthdate}/g, beatles[i].birthdate);
        html = html.replace(/{profilePic}/g, beatles[i].profilePic);
        templeteHTML = templeteHTML.replace('{section}', html);
        res.writeHead(status, { 'Content-Type': 'text/html' });
        res.end(templeteHTML);
        return;
      }
    }
    status = 404;
    res.writeHead(status, { 'Content-Type': 'text/html' });
    res.end(`<h1>${status}</h1><p>No se encontro ningun beatle con ese nombre</p>`);
  }
}

const server = http.createServer(listener);
server.listen(port, host, () => {
  console.log(`Server Runing at ${host}:${port}`);
})

/**
 * templeteHTML.replace('{section}', html) solo reemplaza una vez lo qeu este entre las comillas simples 
 * html.replace(/{name}/g, beatles[i].name); rempleza todas las veces que aparece lo que esta entre las diagonales
 */