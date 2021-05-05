var mysql =  require("mysql");


var pool = mysql.createPool({
    host: 'us-cdbr-east-03.cleardb.com',
    user: 'b4900007e06841',
    password: 'dea9cb74',
    database: 'heroku_9c613d96d271cbe',
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