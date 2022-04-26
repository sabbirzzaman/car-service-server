const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect mongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jhcnp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

const run = async () => {
    try {
        await client.connect();

        // Service collections
        const serviceCollection = client
            .db('carServiceCollection')
            .collection('services');

        // Order Collection
        const orderCollection = client
            .db('carServiceCollection')
            .collection('orders');

        // Send all service data API
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const result = await cursor.toArray();

            res.send(result);
        });

        // send the single service data
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);

            res.send(service);
        });

        // receive orders detail from the client side
        app.post('/orders', async (req, res) => {
            const orders = req.body;
            const result = await orderCollection.insertOne(orders);

            res.send(result);
        });
    } finally {
    }
};

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Car service server!');
});

// listening to the port
app.listen(port, () => {
    console.log('Car service server is running');
});
