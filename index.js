const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json())
require('dotenv').config()


const uri = "mongodb+srv://borhan:RKQlAVMBQNRKV1ba@cluster0.lyy4k.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const userInformation = client.db("userInformation").collection("posts");

        app.post('/posts', async (req, res) => {
            const newPost = req.body;
            const result = await userInformation.insertOne(newPost);
            res.send(result);
        });

        app.get('/posts', async (req, res) => {
            const posts = await userInformation.find().toArray();
            res.send(posts)
        });

        app.put('/posts/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    title: data.title,
                    body: data.body
                }
            };
            const result = await userInformation.updateOne(filter, updatedDoc, options);
            res.send(result);
        })

        app.delete('/posts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userInformation.deleteOne(query);
            res.send(result);
        })
    }
    finally {

    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('CRUD Operation ustin redux toolkit!')
})

app.listen(port, () => {
    console.log(`Listening to port, ${port}`)
})