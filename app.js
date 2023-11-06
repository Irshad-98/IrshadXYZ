const express = require("express");
const app = express();
const { Client } = require("pg");
const cors = require("cors");

app.use(express.json());
app.use(cors())

const client = new Client({
    user: "root",
    password: "GvO7uBQXjIoMxqROv7txvhOeqDm0frCo",
    database: "test_db_h4e7",
    port: 5432,
    host: "dpg-cl19nbjmgg9c73875org-a.oregon-postgres.render.com",
    ssl: { rejectUnauthorized: false }, 
});



async function start() {
    try {
      await client.connect();
      console.log('Connected to the database');
  
      app.get("/mobile", async (req, res) => {
        console.log("Inside /mobile get api");
        try {
          const queryText = 'SELECT * FROM mobiles';
          const result = await client.query(queryText);
          console.log('Query result:', result.rows);
          res.status(200).json(result.rows);
        } catch (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });

      app.get("/mobile/:id", async (req, res) => {
        console.log("Inside /mobile get api");
        try {
          const { id } = req.params;
          const queryText = "SELECT * FROM mobiles WHERE id = $1"; 
          const result = await client.query(queryText, [id]); 
          console.log('Query result:', result.rows);
          res.status(200).json(result.rows);
        } catch (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Internal Server Error' });
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
          res.status(201).json({ message: 'Insertion successful' });
        } catch (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });
  
      app.put("/mobile/:id", async (req, res) => {
        console.log("Inside put of mobile");
        const id = req.params.id;
        const { brand, model, price } = req.body;
      
        const queryText = `
          UPDATE mobiles 
          SET brand = $1, model = $2, price = $3
          WHERE id = $4
        `;
      
        try {
          const result = await client.query(queryText, [brand, model, price, id]);
          console.log('Update result:', result);
          res.status(200).json({ message: 'Update successful' });
        } catch (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });
      

      app.delete("/mobile/:id", async (req, res) => {
        console.log("Inside delete of mobile");
        const id = req.params.id;
        const queryText = `
        DELETE FROM mobiles WHERE id = $1
        `;
        try {
            const result = await client.query(queryText, [id]); 
            console.log('Delete result:', result);
            res.status(200).json({ message: 'Delete successful' });
        } catch (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
    
  
      const port = process.env.PORT || 2410;
      app.listen(port, () => {
        console.log(`Node app listening on port ${port}`);
      });
    } catch (error) {
      console.error('Error connecting to the database:', error);
      process.exit(1);
    }
  }
  
  start();