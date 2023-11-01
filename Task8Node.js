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


app.get("/mobile", (req, res) => {
    let brand = req.query.brand;
    let RAM = req.query.RAM;
    let ROM = req.query.ROM;
    let OS = req.query.OS;
  
    let query = "SELECT * FROM mobile8 WHERE 1"; 
  
    if (brand) {
      query += ` AND brand IN ('${brand.split(',').join("','")}')`;
    }
  
    if (RAM) {
      query += ` AND RAM IN ('${RAM.split(',').join("','")}')`;
    }
  
    if (ROM) {
      query += ` AND ROM IN ('${ROM.split(',').join("','")}')`;
    }
  
    if (OS) {
      query += ` AND OS IN ('${OS.split(',').join("','")}')`;
    }
  
    connection.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching mobiles: " + err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
  
      res.json(results);
    });
  });
  
  
  

app.get("/mobile/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM mobile8 WHERE id = ?";
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching Emp: " + err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});

app.get("/mobile/brand/:brand", (req, res) => {
  const brand = req.params.brand;
  const { RAM, ROM, OS } = req.query;

  const conditions = [];
  const params = [brand];

  if (RAM) {
    conditions.push("RAM = ?");
    params.push(RAM);
  }

  if (ROM) {
    conditions.push("ROM = ?");
    params.push(ROM);
  }

  if (OS) {
    conditions.push("OS = ?");
    params.push(OS);
  }

  let query = "SELECT * FROM mobile8 WHERE brand = ?";
  if (conditions.length > 0) {
    query += " AND " + conditions.join(" AND ");
  }

  connection.query(query, params, (err, results) => {
    if (err) {
      console.error("Error fetching mobile: " + err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});

  app.get("/mobile/RAM/:RAM", (req, res) => {
    const  RAM = req.params.RAM;
    const { brand, ROM, OS } = req.query;
  
    const conditions = [];
    const params = [RAM];
  
    if (brand) {
      conditions.push("brand = ?");
      params.push(brand);
    }
  
    if (ROM) {
      conditions.push("ROM = ?");
      params.push(ROM);
    }
  
    if (OS) {
      conditions.push("OS = ?");
      params.push(OS);
    }
  
    let query = "SELECT * FROM mobile8 WHERE RAM = ?";
    if (conditions.length > 0) {
      query += " AND " + conditions.join(" AND ");
    }

    connection.query(query, params, (err, results) => {
      if (err) {
        console.error("Error fetching mobile: " + err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json(results);
      }
    });
  });

  app.get("/mobile/ROM/:ROM", (req, res) => {
    const  ROM = req.params.ROM;
    const { brand, RAM, OS } = req.query;
  
    const conditions = [];
    const params = [ROM];
  
    if (brand) {
      conditions.push("brand = ?");
      params.push(brand);
    }
  
    if (RAM) {
      conditions.push("RAM = ?");
      params.push(RAM);
    }
  
    if (OS) {
      conditions.push("OS = ?");
      params.push(OS);
    }
  
    let query = "SELECT * FROM mobile8 WHERE ROM = ?";
    if (conditions.length > 0) {
      query += " AND " + conditions.join(" AND ");
    }

    connection.query(query, params, (err, results) => {
      if (err) {
        console.error("Error fetching mobile: " + err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json(results);
      }
    });
  });

  app.get("/mobile/OS/:OS", (req, res) => {
    const  OS = req.params.OS;
    const { brand, ROM, RAM } = req.query;
  
    const conditions = [];
    const params = [OS];
  
    if (brand) {
      conditions.push("brand = ?");
      params.push(brand);
    }
  
    if (ROM) {
      conditions.push("ROM = ?");
      params.push(ROM);
    }
  
    if (RAM) {
      conditions.push("RAM = ?");
      params.push(RAM);
    }
  
    let query = "SELECT * FROM mobile8 WHERE OS = ?";
    if (conditions.length > 0) {
      query += " AND " + conditions.join(" AND ");
    }

    connection.query(query, params, (err, results) => {
      if (err) {
        console.error("Error fetching mobile: " + err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json(results);
      }
    });
  });


  app.put("/mobile/:id", (req, res) => {
    const { id } = req.params;
    const { name, price, brand, RAM, ROM, OS } = req.body;
  
    const query = "UPDATE mobile8 SET name = ?, price = ?, brand = ?, RAM = ?, ROM = ?, OS = ? WHERE id = ?";
    connection.query(query, [name, price, brand, RAM, ROM, OS, id], (err) => {
      if (err) {
        console.error("Error updating Mobile: " + err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json({ message: "Mobile updated successfully" });
      }
    });
  });
  


app.put("/mobile/:id", (req, res) => {
    const { id } = req.params;
    const { brand, RAM, ROM, OS } = req.body;
    const query = "UPDATE mobile8 SET brand = ?, RAM = ?, ROM = ?, OS = ? WHERE id = ?";
    connection.query(query, [id, brand, RAM, ROM, OS], (err) => {
      if (err) {
        console.error("Error updating Emp: " + err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json({ message: "Mobile updated successfully" });
      }
    });
  });
  

app.delete("/mobile/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM mobile8 WHERE id = ?";
  connection.query(query, [id], (err) => {
    if (err) {
      console.error("Error deleting mob: " + err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json({ message: "mob deleted successfully" });
    }
  });
});

app.get("/resetData", (req, res) => {
  const resetTableSQL = "DELETE FROM mobile8";
  connection.query(resetTableSQL, (err, deleteResult) => {
    if (err) {
      console.error("Error resetting data: " + err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    let { mobiles } = require("./mobileData.js");
    let arr = mobiles.map((p) => [p.name, p.price, p.brand, p.RAM, p.ROM, p.OS]);
    let insertSQL = "INSERT INTO mobile8 (name, price, brand, RAM, ROM, OS) VALUES ?";
    
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




