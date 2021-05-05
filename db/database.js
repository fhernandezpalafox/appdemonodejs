const mysql = require('mysql');

const mysqlConnection = mysql.createConnection({
  host: 'us-cdbr-east-03.cleardb.com',
  user: 'b4900007e06841',
  password: 'dea9cb74',
  database: 'heroku_9c613d96d271cbe',
  multipleStatements: true
});

mysqlConnection.connect(function (err) {
  if (err) {
    console.error(err);
    return;
  } else {
    console.log('db is connected');
  }
});

module.exports = mysqlConnection;