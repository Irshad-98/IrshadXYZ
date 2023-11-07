const express = require("express");
const app = express();
const { Client } = require("pg");
const cors = require("cors");

app.use(express.json());
app.use(cors());

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
    console.log("Connected to the database");

    app.get("/mobile", async (req, res) => {
      const { brand, ram, rom, os } = req.query;

      let query = "SELECT * FROM mobiles WHERE 1 = 1";
      const queryParams = [];

      if (brand) {
        query += ` AND brand = ANY($${queryParams.length + 1}::text[])`;
        queryParams.push(brand.split(","));
      }

      if (ram) {
        query += ` AND ram = ANY($${queryParams.length + 1}::text[])`;
        queryParams.push(ram.split(","));
      }

      if (rom) {
        query += ` AND rom = ANY($${queryParams.length + 1}::text[])`;
        queryParams.push(rom.split(","));
      }

      if (os) {
        query += ` AND os = ANY($${queryParams.length + 1}::text[])`;
        queryParams.push(os.split(","));
      }

      try {
        const { rows } = await client.query(query, queryParams);
        res.json(rows);
      } catch (err) {
        console.error("Error fetching mobiles: " + err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.get("/mobile/:id", async (req, res) => {
      const { id } = req.params;
      const query = "SELECT * FROM mobiles WHERE id = $1";

      try {
        const { rows } = await client.query(query, [id]);
        res.json(rows);
      } catch (err) {
        console.error("Error fetching Mobile: " + err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.get("/mobile/brand/:brand", async (req, res) => {
      const { brand } = req.params;
      const { ram, rom, os } = req.query;

      const conditions = [];
      const queryParams = [brand];

      if (ram) {
        conditions.push(`ram = ANY($${queryParams.length + 1}::text[])`);
        queryParams.push(ram.split(","));
      }

      if (rom) {
        conditions.push(`rom = ANY($${queryParams.length + 1}::text[])`);
        queryParams.push(rom.split(","));
      }

      if (os) {
        conditions.push(`os = ANY($${queryParams.length + 1}::text[])`);
        queryParams.push(os.split(","));
      }

      let query = "SELECT * FROM mobiles WHERE brand = $1";
      if (conditions.length > 0) {
        query += " AND " + conditions.join(" AND ");
      }

      try {
        const { rows } = await client.query(query, queryParams);
        res.json(rows);
      } catch (err) {
        console.error("Error fetching mobile: " + err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.get("/mobile/ram/:ram", async (req, res) => {
      const { ram } = req.params;
      const { brand, rom, os } = req.query;
      const conditions = [];
      const queryParams = [ram];

      if (brand) {
        conditions.push(`brand = $${queryParams.length + 1}`);
        queryParams.push(brand);
      }

      if (rom) {
        conditions.push(`rom = ANY($${queryParams.length + 1}::text[])`);
        queryParams.push(rom.split(","));
      }

      if (os) {
        conditions.push(`os = ANY($${queryParams.length + 1}::text[])`);
        queryParams.push(os.split(","));
      }

      let query = "SELECT * FROM mobiles WHERE ram = $1";
      if (conditions.length > 0) {
        query += " AND " + conditions.join(" AND ");
      }

      try {
        const { rows } = await client.query(query, queryParams);
        res.json(rows);
      } catch (err) {
        console.error("Error fetching mobiles by RAM: " + err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

  
    app.get("/mobile/rom/:rom", async (req, res) => {
      const { rom } = req.params;
      const { brand, ram, os } = req.query;
      const conditions = [];
      const queryParams = [rom];

      if (brand) {
        conditions.push(`brand = $${queryParams.length + 1}`);
        queryParams.push(brand);
      }

      if (ram) {
        conditions.push(`ram = ANY($${queryParams.length + 1}::text[])`);
        queryParams.push(ram.split(","));
      }

      if (os) {
        conditions.push(`os = ANY($${queryParams.length + 1}::text[])`);
        queryParams.push(os.split(","));
      }

      let query = "SELECT * FROM mobiles WHERE rom = $1";
      if (conditions.length > 0) {
        query += " AND " + conditions.join(" AND ");
      }

      try {
        const { rows } = await client.query(query, queryParams);
        res.json(rows);
      } catch (err) {
        console.error("Error fetching mobiles by ROM: " + err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.get("/mobile/os/:os", async (req, res) => {
      const { os } = req.params;
      const { brand, ram, rom } = req.query;
      const conditions = [];
      const queryParams = [os];

      if (brand) {
        conditions.push(`brand = $${queryParams.length + 1}`);
        queryParams.push(brand);
      }

      if (ram) {
        conditions.push(`ram = ANY($${queryParams.length + 1}::text[])`);
        queryParams.push(ram.split(","));
      }

      if (rom) {
        conditions.push(`rom = ANY($${queryParams.length + 1}::text[])`);
        queryParams.push(rom.split(","));
      }

      let query = "SELECT * FROM mobiles WHERE os = $1";
      if (conditions.length > 0) {
        query += " AND " + conditions.join(" AND ");
      }

      try {
        const { rows } = await client.query(query, queryParams);
        res.json(rows);
      } catch (err) {
        console.error("Error fetching mobiles by OS: " + err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.post("/mobile", async (req, res) => {
      console.log("Inside post of mobile");
      const { name, price, brand, ram, rom, os } = req.body;
      const queryText = `
        INSERT INTO mobiles (name, price, brand, ram, rom, os)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      try {
        const result = await client.query(queryText, [name, price, brand, ram, rom, os]);
        console.log('Insertion result:', result);
        res.status(201).json({ message: 'Insertion successful' });
      } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    // Implement similar routes for updating and deleting

    app.put("/mobile/:id", async (req, res) => {
      const { id } = req.params;
      const { name, price, brand, ram, rom, os } = req.body;

      const query = "UPDATE mobiles SET name = $1, price = $2, brand = $3, ram = $4, rom = $5, os = $6 WHERE id = $7";

      try {
        await client.query(query, [name, price, brand, ram, rom, os, id]);
        res.json({ message: "Mobile updated successfully" });
      } catch (err) {
        console.error("Error updating Mobile: " + err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.delete("/mobile/:id", async (req, res) => {
      const { id } = req.params;
      const query = "DELETE FROM mobiles WHERE id = $1";

      try {
        await client.query(query, [id]);
        res.json({ message: "Mobile deleted successfully" });
      } catch (err) {
        console.error("Error deleting mobile: " + err);
        res.status(500).json({ error: "Internal Server Error" });
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
