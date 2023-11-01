let mysql = require("mysql");
let connData = {
    host: "localhost",
    user:"root",
    password:'',
    database:"testDB",
};

function ShowProducts(){
    let connection = mysql.createConnection(connData);
    let sql = "SELECT * FROM products";
    connection.query(sql,function(err,result){
    if (err) console.log(err);
    else console.log(result);
    })
}

function ShowProductByName(name){
    let connection = mysql.createConnection(connData);
    let sql = "SELECT * FROM products WHERE prod=?";
    connection.query(sql, name, function(err,result){
    if (err) console.log(err);
    else console.log(result);
    })
}

function ShowProductByCategory(name){
    let connection = mysql.createConnection(connData);
    let sql = "SELECT * FROM products WHERE category=?";
    connection.query(sql, name, function(err,result){
    if (err) console.log(err);
    else console.log(result);
    })
}

function ShowProductByPrice(name){
    let connection = mysql.createConnection(connData);
    let sql = "SELECT * FROM products WHERE price > ?";
    connection.query(sql, name, function(err,result){
    if (err) console.log(err);
    else console.log(result);
    })
}

function insertProduct(params){
    let connection = mysql.createConnection(connData);
    let sql = "INSERT INTO products(prod,price,quantity,category) VALUES(?,?,?,?)";
    connection.query(sql, params, function(err,result){
    if (err) console.log(err);
    else console.log(result);
    })
}

function insertProducts(params){
    let connection = mysql.createConnection(connData);
    let sql = "INSERT INTO products(prod,price,quantity,category) VALUES ?";
    connection.query(sql, [params], function(err,result){
    if (err) console.log(err);
    else console.log(result);
    })
}

function changeQuantity(id,newQuantity){
    let connection = mysql.createConnection(connData);
    let sql = "UPDATE products SET quantity=? WHERE id=?";
    connection.query(sql, [newQuantity,id], function(err,result){
    if (err) console.log(err);
    else console.log(result);
    })
}

function decreaseQuantity(id){
    let connection = mysql.createConnection(connData);
    let sql = "UPDATE products SET quantity=quantity-1 WHERE id=?";
    connection.query(sql, id, function(err,result){
    if (err) console.log(err);
    else console.log(result);
    })
}

function resetData() {
    let connection = mysql.createConnection(connData);
    let sql = "DELETE FROM products";
    connection.query(sql, function(err,result){
    if (err) console.log(err);
    else console.log("SuccessFully deleted Affected rows :",result.affectedRows);
    let { product } = require("./productData.js");
    let arr = product.map(p => [p.prod,p.price,p.quantity,p.category,]);
    let sql2 = "INSERT INTO products(prod,price,quantity,category) VALUES ?";
    connection.query(sql2, [arr],function(err,result){
    if (err) console.log(err);
    else console.log("SuccessFully insterted Affected rows :",result.affectedRows)
    })
})
}

//resetData()
//decreaseQuantity(17)
//changeQuantity(17,100)
ShowProducts();
// //insertProducts([
//     ["Bee",25,10,"Food"],
//     ["Beer",25,10,"Shampoo"],
//     ["Santoor",25,10,"Soap"],
// ])
//insertProduct(["Beery",25,10,"Food"])
//ShowProductByName("AllClear");
//ShowProductByCategory("Shampoo");
//ShowProductByPrice(60);