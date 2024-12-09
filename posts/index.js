const express = require('express');
const bodyParser = require('body-parser')
const axios = require('axios')
const cors = require('cors')

const { randomBytes } = require('crypto')

const posts = {}

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/posts', (req,res) => {
    res.send(posts)
});

app.post('/posts/create', async (req,res) => {
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;
    posts[id] = {
        id, title
    };

    await axios.post('http://event-bus-srv:4005/events', {
        type: 'PostCreated',
        data: {
            id,title
        }
    })

    res.status(201).send(posts[id]);
});

app.post('/events', (req,res) => {
    console.log('Received Event', req.body.type)

    res.send({})
})

app.listen(4001, () => {
    console.log('listening on 40001')
})