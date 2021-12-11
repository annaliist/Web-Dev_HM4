const express = require('express');
const pool = require('./database');
const cors = require('cors');
const { max } = require('lodash');

const app = express();

// register the ejs view engine
app.set('view engine', 'ejs');

//without this middleware, we cannot use data submitted by forms
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(cors());
app.use(express.static('Public'));

app.listen(3000, () => {
 console.log("Server is listening to port 3000")
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/', async(req, res) => {
 try {
 console.log("get posts request has arrived");
 const posts = await pool.query(
 "SELECT * FROM posts"
 );
 res.render('posts', { posts: posts.rows });
 } catch (err) {
 console.error(err.message);
 }
});

app.get('/singlepost/:id', async(req, res) => {
 try {
 const id = req.params.id;
 console.log(req.params.id);
 console.log("get a single post request has arrived");
 const posts = await pool.query(
 "SELECT * FROM posts WHERE id = $1", [id]
 );
 res.render('singleposts', { posts: posts.rows[0] });
 } catch (err) {
 console.error(err.message);
 }
});

app.get('/posts/:id', async(req, res) => {
 try {
 const { id } = req.params;
 console.log("get a post request has arrived");
 const Apost = await pool.query(
 "SELECT * FROM posts WHERE id = $1", [id]
 );
 res.json(Apost.rows[0]);
 } catch (err) { console.error(err.message);
 }
});

app.delete('/posts/:id', async(req, res) => {
 try {
 console.log(req.params);
 const { id } = req.params;
 const post = req.body;
 console.log("delete a post request has arrived");
 const deletepost = await pool.query(
 "DELETE FROM posts WHERE id = $1", [id]
 );
 res.redirect('posts');
 } catch (err) {
 console.error(err.message);
 }
});

app.post('/create', async(req, res) => {
    try {
    console.log("a post request has arrived");
    const post = req.body;

    const newpost = await pool.query(
    "INSERT INTO posts(id, author, body, date, image, authorImage) values (DEFAULT, $1, $2, $3, $4, $5, $6) RETURNING*", [post.author, post.body, post.date, post.image, post.authorImage]
    );
    res.json( newpost );
    res.redirect('posts');
} catch (err) {
    console.error(err.message)
    }
   });
   
   app.post('/posts/:id', (req, res, next) => {
    const action = req.body.action;
    const counter = action == 'Like' ? 1 : 0;
    posts.update({_id: req.params.id}, {$inc: {likes: counter}}, {}, (err, numberAffected) => {
        res.send('');
    });
});

app.get('/create', (req, res) => {
 res.render('create');
});

app.use((req, res) => {
 res.status(404).render('404');
});