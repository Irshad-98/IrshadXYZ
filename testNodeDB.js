let mysql = require("mysql");
let connData = {
    host: "localhost",
    user:"root",
    password:'',
    database:"testDB",
};

function ShowPersons(){
    let connection = mysql.createConnection(connData);
    let sql = "SELECT * FROM person";
    connection.query(sql,function(err,result){
    if (err) console.log(err);
    else console.log(result);
    })
}

function ShowPersonsByName(name){
    let connection = mysql.createConnection(connData);
    let sql = "SELECT * FROM person WHERE name=?";
    connection.query(sql, name, function(err,result){
    if (err) console.log(err);
    else console.log(result);
    })
}

function insertPerson(params){
    let connection = mysql.createConnection(connData);
    let sql = "INSERT INTO person(name,age) VALUES(?,?)";
    connection.query(sql, params, function(err,result){
    if (err) console.log(err);
    else console.log("Id Of Inserted Record",result.insertId);
    let sql2 = "SELECT * FROM person";
    connection.query(sql2,function(err,result){
    if (err) console.log(err);
    else console.log(result);
    })
    })
}

function insertPersons(params){
    let connection = mysql.createConnection(connData);
    let sql = "INSERT INTO person(name,age) VALUES ?";
    connection.query(sql, [params], function(err,result){
    if (err) console.log(err);
    else console.log(result);
    })
}

function incrementAge(id){
    let connection = mysql.createConnection(connData);
    let sql = "UPDATE person SET age=age+1 WHERE id=?";
    connection.query(sql, id, function(err,result){
    if (err) console.log(err);
    else console.log(result);
    })
}

function changeAge(id,newAge){
    let connection = mysql.createConnection(connData);
    let sql = "UPDATE person SET age=? WHERE id=?";
    connection.query(sql, [newAge,id], function(err,result){
    if (err) console.log(err);
    else console.log(result);
    })
}

function resetData() {
    let connection = mysql.createConnection(connData);
    let sql = "DELETE FROM person";
    connection.query(sql, function(err,result){
    if (err) console.log(err);
    else console.log("SuccessFully deleted Affected rows :",result.affectedRows);
    let { persons } = require("./testData.js");
    let arr = persons.map(p => [p.name,p.age]);
    let sql2 = "INSERT INTO person(name,age) VALUES ?";
    connection.query(sql2, [arr],function(err,result){
    if (err) console.log(err);
    else console.log("SuccessFully insterted Affected rows :",result.affectedRows)
    })
})
}

//resetData()
//changeAge(3,33);
//incrementAge(3);
ShowPersons();
//ShowPersonsByName("Bob");
//insertPerson(["Albert",42]);
// insertPersons([
//     ["Jim",30],
//     ["Amy",34],
//     ["Steven",30],
//     ["Amy",34]
// ]);
