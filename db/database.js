var mysql =  require("mysql");
require('dotenv').config();


var pool = mysql.createPool({
    host:  process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
});

modeDevelopper  =  function(){
    console.log(process.env.NODE_ENV);
    if ( process.env.NODE_ENV === 'test' ) { 
        return true;  
    }
    return false;
}

module.exports = {
       query: function(){
           var sql_args = [];
           var args = [];
           for(var i=0; i<arguments.length; i++){
               args.push(arguments[i]);
           }
           var callback = args[args.length-1]; //last arg is callback
           pool.getConnection(function(err, connection) {
           if(err) {
                   console.log(err);
                   return callback(err);
               }
               if(args.length > 2){
                   sql_args = args[1];
               }
           connection.query(args[0], sql_args, function(err, results) {
             connection.release(); // always put connection back in pool after last query
             if(err){
                       console.log(err);
                       return callback(err);
                   }
             callback(null, results);
           });
         });
       }
};