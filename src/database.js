const mysql =require('mysql');
const {database} = require('./keys');
const connect = mysql.createConnection(database);

connect.connect((err) => {
    if (err) throw err;
    console.log('BD in connect!');
})
module.exports = connect;
