const db = require("./database")
var encrypt = require("sha256");
db.createAdmin(encrypt("cryptx"),encrypt("saral"),"cryptx").then((doc)=>{
    console.log(doc);
})