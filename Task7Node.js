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


app.get("/employee", (req, res) => {
    let department = req.query.department;
    let designation = req.query.designation;
    let gender = req.query.gender;
    let sort = req.query.sort;
  
    let query = "SELECT * FROM employee";
    const conditions = [];
  
    if (department) {
      conditions.push(`department = '${department}'`);
    }
  
    if (designation) {
      conditions.push(`designation = '${designation}'`);
    }

    if (gender) {
        conditions.push(`gender = '${gender}'`);
      }
  
    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }
  
    if (sort) {
        if (sort === 'name' || sort === 'salary') {
          query += ` ORDER BY ${sort} ASC`; 
        } else {
          return res.status(400).json({ error: "Invalid sort parameter" });
        }
      }
  
    connection.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching employees: " + err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
  
      res.json(results);
    });
  });
  
  app.get("/employee/department/:name", (req, res) => {
    let designation = req.query.designation;
    let gender = req.query.gender;
    let sort = req.query.sort;
    const { name } = req.params;

    const conditions = [];

    if (designation) {
      conditions.push(`designation = '${designation}'`);
    }

    if (gender) {
        conditions.push(`gender = '${gender}'`);
      }
  

  
   
    let query = "SELECT * FROM employee WHERE department = ? ";
        if (conditions.length > 0) {
      conditions.forEach( (condition) => {
      query +=  " AND "  + condition;
      })
    }
     if (sort) {
        if (sort === 'name' || sort === 'salary') {
          query += ` ORDER BY ${sort} ASC`; 
        } else {
          return res.status(400).json({ error: "Invalid sort parameter" });
        }
      } 
      console.log(query);

    connection.query(query, [name], (err, results) => {
      if (err) {
        console.error("Error fetching Emp: " + err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json(results);
      }
    });
  });

  app.get("/employee/designation/:name", (req, res) => {
    let department = req.query.department;
    let gender = req.query.gender;
    let sort = req.query.sort;
    const { name } = req.params;

     const conditions = [];
  
    if (department) {
      conditions.push(`department = '${department}'`);
    }

    if (gender) {
        conditions.push(`gender = '${gender}'`);
      }

    let query = "SELECT * FROM employee WHERE designation = ? "; 
  
    if (conditions.length > 0) {
      conditions.forEach( (condition) => {
      query +=  " AND "  + condition;
      })
    }
  

    if (sort) {
        if (sort === 'name' || sort === 'salary') {
          query += ` ORDER BY ${sort} ASC`; 
        } else {
          return res.status(400).json({ error: "Invalid sort parameter" });
        }
      }
    
    connection.query(query, [name], (err, results) => {
      if (err) {
        console.error("Error fetching Emp: " + err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json(results);
      }
    });
  });
  

app.get("/employee/:empCode", (req, res) => {
  const { empCode } = req.params;
  const query = "SELECT * FROM employee WHERE empCode = ?";
  connection.query(query, [empCode], (err, results) => {
    if (err) {
      console.error("Error fetching Emp: " + err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});


app.post("/employee", (req, res) => {
  const { empCode, name, department, designation, salary, gender } = req.body;
  const query = "INSERT INTO employee(empCode, name, department, designation, salary, gender) VALUES (?, ?, ?, ?, ?, ?)";
  connection.query(query, [empCode, name, department, designation, salary, gender], (err, result) => {
    if (err) {
      console.error("Error creating Emp: " + err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json({ message: "Emp created successfully", empCode: result.insertempCode });
    }
  });
});


app.put("/employee/:empCode", (req, res) => {
  const { empCode } = req.params;
  const { name, department, designation, salary, gender } = req.body;

  const query = "UPDATE employee SET name = ?, department = ?, designation = ?, salary = ?, gender = ? WHERE empCode = ?";
  connection.query(query, [name, department, designation, salary, gender, empCode], (err) => {
    if (err) {
      console.error("Error updating Emp: " + err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json({ message: "Employee updated successfully" });
    }
  });
});


app.delete("/employee/:empCode", (req, res) => {
  const { empCode } = req.params;
  const query = "DELETE FROM employee WHERE empCode = ?";
  connection.query(query, [empCode], (err) => {
    if (err) {
      console.error("Error deleting Emp: " + err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json({ message: "Emp deleted successfully" });
    }
  });
});

app.get("/resetData", (req, res) => {
  const resetTableSQL = "DELETE FROM employee";
  connection.query(resetTableSQL, (err, deleteResult) => {
    if (err) {
      console.error("Error resetting data: " + err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    let { emp } = require("./empsData.js");
    let arr = emp.map((p) => [p.empCode, p.name, p.department, p.designation, p.salary, p.gender]);
    let insertSQL = "INSERT INTO employee (empCode, name, department, designation, salary, gender) VALUES ?";
    
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




