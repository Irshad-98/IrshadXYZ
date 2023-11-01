const express = require("express");
const app = express();
const { Client } = require("pg");
app.use(express.json());

const client = new Client({
    user: "postgres",
    password: "irshad123",
    database: "postgres",
    port: 5432,
    host: "localhost",
    ssl: false, 
});



client.connect()
    .then(() => {
        console.log('Connected to the database');
    })
    .catch((err) => {
        console.error('Error connecting to the database:', err);
    });




app.get("/mobile", async (req, res) => {
    console.log("Inside /mobile get api");
    try {
        const queryText = 'SELECT * FROM mobiles';
        const result = await client.query(queryText);
        console.log('Query result:', result.rows);
        res.send(result.rows);
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.post("/mobile", async (req, res) => {
    console.log("Inside post of mobile");
    const { brand, model, price } = req.body;
    const queryText = `
        INSERT INTO mobiles (brand, model, price)
        VALUES ($1, $2, $3)
    `;
    try {
        const result = await client.query(queryText, [brand, model, price]);
        console.log('Insertion result:', result);
        res.send('Insertion successful');
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.put("/mobile/:id", async (req, res) => {
    console.log("Inside put of mobile");
    const mobileID = req.params.id;
    const price = req.body.price;
    const queryText = `
        UPDATE mobiles SET price = $1
        WHERE id = $2
    `;
    try {
        const result = await client.query(queryText, [price, mobileID]);
        console.log('Update result:', result);
        res.send('Update successful');
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Internal Server Error');
    }
});

const port = process.env.PORT||2410
app.listen(port, () => {
    console.log(`Node app listening on port ${port}`);
});
