const express = require("express");
const app = express();
app.use(express.json());

const mysql = require("mysql");
const connData = {
  host: "localhost",
  user: "root",
  password: '', 
  database: "testDB",
};


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
  );
  next();
});

const port = 2410;
app.listen(port, () => {
  console.log(`Node app listening on port ${port}`);
});

const connection = mysql.createConnection(connData);
connection.connect();


app.get("/svr/mobiles", (req, res) => {
  const query = "SELECT * FROM mobiles";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching mobiles: " + err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});

app.get("/svr/mobiles/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM mobiles WHERE id = ?";
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching mobile: " + err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});

app.get("/svr/mobiles/brand/:brand", (req, res) => {
  const { brand } = req.params;
  const query = "SELECT * FROM mobiles WHERE brand = ?";
  connection.query(query, [brand], (err, results) => {
    if (err) {
      console.error("Error fetching mobiles: " + err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});


app.post("/svr/mobiles", (req, res) => {
  const { brand, model, price } = req.body;
  const query = "INSERT INTO mobiles (brand, model, price) VALUES (?, ?, ?)";
  connection.query(query, [brand, model, price], (err, result) => {
    if (err) {
      console.error("Error creating mobile: " + err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json({ message: "Mobile created successfully", id: result.insertId });
    }
  });
});


app.put("/svr/mobiles/:id", (req, res) => {
  const { id } = req.params;
  const { brand, model } = req.body;
  const query = "UPDATE mobiles SET brand = ?, model = ? WHERE id = ?";
  connection.query(query, [brand, model, id], (err) => {
    if (err) {
      console.error("Error updating mobile: " + err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json({ message: "Mobile updated successfully" });
    }
  });
});

app.delete("/svr/mobiles/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM mobiles WHERE id = ?";
  connection.query(query, [id], (err) => {
    if (err) {
      console.error("Error deleting mobile: " + err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json({ message: "Mobile deleted successfully" });
    }
  });
});

app.get("/svr/resetData", (req, res) => {
  // Delete all existing data from the "mobiles" table
  const resetTableSQL = "DELETE FROM mobiles";
  connection.query(resetTableSQL, (err, deleteResult) => {
    if (err) {
      console.error("Error resetting data: " + err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    let { mobile } = require("./mobileData.js");
    let arr = mobile.map((p) => [p.brand, p.model, p.price]);
    let insertSQL = "INSERT INTO mobiles (brand, model, price) VALUES ?";
    
    connection.query(insertSQL, [arr], (insertErr, insertResult) => {
      if (insertErr) {
        console.error("Error inserting data: " + insertErr);
        return res.status(500).json({ error: "Internal Server Error" });
      } else {
        console.log("Successfully inserted, affected rows:", insertResult.affectedRows);
        res.json({ message: "Data reset and inserted successfully" });
      }
    });
  });
});




