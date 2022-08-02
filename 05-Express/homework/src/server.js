// const bodyParser = require("body-parser");
'use strict'
/**modulos para crear el servidor*/
const express = require("express");

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
var posts = [];
var id = 0;

const server = express();
// to enable parsing of json bodies for post requests
// server.use(express.json());
// TODO: your code to handle requests
// server.use(bodyParser.urlencoded({ extended: false }));
server.use(express.json());
/**header para llamar desde el front-end*/
 server.use((req, res, next) => {
     res.header('Access-Control-Allow-Origin', '*');
     res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
     res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
     res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
     next();
 });

/**controlador */

var posts_routes = require('../routes/serverRoutes');
var authors_routes = require('../routes/authorRoutes');

var Router = express.Router();

var PostController = {
    newPost: (req, res) => {
        let { author, title, contents } = req.body;
        let response = {}, status;
        if (author !== undefined && title !== undefined && contents !== undefined) {
            status = 200;
            response = {
                id: id,
                author: author,
                title: title,
                contents: contents,
            }
            id++;
            posts.push(response);
        } else {
            status = 422;
            response = {
                error: "No se recibieron los parámetros necesarios para crear el Post"
            }
        }
        res.status(status).json(response);
    },
    postAuthor: (req, res) => {
        let { title, contents } = req.body, { author } = req.params, status;
        let response = {};
        if (title !== undefined && contents !== undefined && author !== undefined) {
            status = 200;
            response = {
                id: id,
                author: author,
                title: title,
                contents: contents,
            }
            id++;
            posts.push(response);
        } else {
            status = 422;
            response = {
                error: "No se recibieron los parámetros necesarios para crear el Post"
            }
        }
        res.status(status).json(response);
    },
    getAllPosts: (req, res) => {
        let { term } = req.query;
        if (term !== undefined) {
            let postsMaped = posts.filter(
                post => (post.title.includes(term) || post.contents.includes(term))
            );
            return res.json(postsMaped);
        } else {
            res.json(posts);
        }
    },
    getByAuthor: (req, res) => {
        let { author } = req.params;
        let authorPosts = posts.filter(post => post.author === author);
        if (authorPosts.length > 0) {
            res.json(authorPosts);
        } else {
            res.status(422).json({
                error: "No existe ningun post del autor indicado"
            });
        }
    },
    getByAuthorTitle: (req, res) => {
        let { author, title } = req.params,
            response = {},
            status = 200;
        response = posts.filter(post => {
            if (post.author === author && post.title === title) {
                return post;
            }
        });
        if (response.length === 0) {
            status = 422;
            response = {
                error: "No existe ningun post con dicho titulo y autor indicado"
            };
        }
        res.status(status).json(response);
    },
    updatePost: (req, res) => {
        let { id, title, contents } = req.body;
        if (id !== undefined && title !== undefined && contents !== undefined) {
            posts.forEach(post => {
                if (post.id === id) {
                    let lastPost = post;
                    post.title = title;
                    post.contents = contents;
                    return res.status(200).json(lastPost);
                }
            });
            return res.status(422).json({ error: "No se Encontró el post a modificar" });
        } else {
            return res.status(422).json({ error: "No se recibieron los parámetros necesarios para modificar el Post" });
        }
    },
    deletePost: (req, res) => {
        let { id } = req.body;
        let lastPost = posts.find(post => post.id === parseInt(id));
        if (id === undefined) {
            return res.status(422).json({ error: "Mensaje de error" });
        }
        if (lastPost === undefined) {
            return res.status(422).json({ error: "Id invalido o Post no existe intenta de nuevo" });
        }
        posts = posts.filter(post => post.id !== parseInt(id));
        return res.json({ success: true });
    }
}

var AutorController = {
    AutorDelete: (req, res) => {
        let { author } = req.body;
        let lastPost = posts.filter(post => post.author === author);
        console.log(req.body);
        if (author === undefined) {
            return res.status(422).json({ error: "Mensaje de error" });
        }
        if (lastPost.length === 0) {
            return res.status(422).json({ error: "No existe el autor indicado" });
        }
        posts = posts.filter(post => post.author !== author);
        return res.status(200).json(lastPost);
    }
}

 server.use("/posts", [
     Router.get("/", PostController.getAllPosts),
     Router.get("/:author", PostController.getByAuthor),
     Router.get("/:author/:title", PostController.getByAuthorTitle),
     Router.post('/', PostController.newPost),
     Router.post("/author/:author", PostController.postAuthor),
     Router.put("/", PostController.updatePost),
     Router.delete("/", PostController.deletePost),
 ]);
 server.delete("/author", AutorController.AutorDelete)

// server.use("/posts", posts_routes);
// server.use("/author", authors_routes);

module.exports = { posts, server };

/**
 * hace extamente lo mismo por modulos pero no pasa los teste
 * no se clase de brujeria es esta...
 * y solo se puede usar use una sola vez sino te lo manda a de nuevo a post 
 * en author 
 */