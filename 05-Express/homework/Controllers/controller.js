var posts = [];
var id = 0;



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

var AuthorController = {
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

module.exports = { PostController, AuthorController };