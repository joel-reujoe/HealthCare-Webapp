var sql = require('mysql');
const services={
    connectdb:async(dbname)=>{
                        return new Promise(function (resolve, reject){
                            var connection = sql.createConnection({
                                    host: "localhost",
                                    user: "root",
                                    password: "",
                                    database: dbname
                                });
                       
                                connection.connect((err)=> {
                                  if(err) {
                                    reject(err);
                                    console.error('error connecting: ' + err.stack);
                                    }
                                  else{
                                      resolve(connection);
                                      console.log('connected as id ' + connection.threadId);
                                      }
                                });
                        });
                        },
    disconnectdb:(connection)=>  {
                              connection.end(()=>{console.log("connection closed")})
                                }
    }
    module.exports=services;