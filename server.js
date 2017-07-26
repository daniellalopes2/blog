var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose'); // requisição do banco
var mongo_url = process.env.MONGODB_URI || 'mongodb://localhost/blog2017';
mongoose.connect(mongo_url);

var LeadSchema = mongoose.Schema({
    name: {type: String, require: true},
    email: {type: String, require: true},
    ip: {type: String, require: true},
    createDate: {type: Date, default: Date.now}
}, {collection: "lead"});

var LeadModel = mongoose.model("LeadModel", LeadSchema);

var PostSchema = mongoose.Schema({
    title: {type:String, require: true},
    body: String,
    tag: {type: String, enum: ['SALES', 'GROWTH HACKING']},
    posted: {type: Date, default: Date.now}
}, {collection: "post"});

var PostModel = mongoose.model("PostModel", PostSchema);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


app.post("/api/blogpost", createPost);
app.get("/api/blogpost", getAllPosts);
app.get("/api/blogpost/:id", getPostById);
app.delete("/api/blogpost/:id", deletePost);
app.put("/api/blogpost/:id", updatePost);
app.post("/api/bloglead", createLead);


function updatePost(req, res){
    var postId = req.params.id;
    var post = req.body;
    PostModel
        .update({_id: postId},{
            title: post.title,
            body: post.body
        })
        .then (
            function(status) {
                res.sendStatus(200);
            },
            function (error) {
                res.sendStatus(400);
            }
        )
}

function getPostById(req, res) {
    var postId = req.params.id;
    PostModel
        .findById(postId)
        .then(
            function (post) {
                res.json(post);
            }
        );
}

function deletePost(req, res){
    var postId = req.params.id;
    PostModel
        .remove({_id: postId}) // novo
        .then(
        function (status) {
            console.log(status.result);
            res.sendStatus(200);
        },
        function () {
            res.sendStatus(400);
        }
    );
}

function getAllPosts(req, res){
    PostModel
        .find()
        .then(
            function (posts) {
                res.json(posts);
            },
            function (error) {
                res.sendStatus(400);
            }
        );
}

function createPost(req, res) {
    var post = req.body;
    console.log(post);
    PostModel
        .create(post)
        .then(
            function (postObj) {
                res.json(201);
            },
            function (error) {
                res.sendStatus(400);
            }
        );

}

function createLead(req, res) {
    var lead = req.body;
    console.log(lead);
    LeadModel
        .create(lead)
        .then(
            function (leadObj) {
                res.json(201);
            },
            function (error) {
                res.sendStatus(400);
            }
        );

}

app.listen(process.env.PORT || 3000);
