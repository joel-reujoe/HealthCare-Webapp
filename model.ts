var express=require('express');
var sql=require('mysql');
var fs=require('fs');
var bodyParser=require('body-parser');
var services=require('./db.js');
class model
{
    registrationLogic={
        registerUser:async(firstname,lastname,email,password,dob,gender,address,state,city)=>{
            return new Promise(async(resolve,reject)=>{
            var connection=await services.connectdb("healthcare_webapp");
            var sql="INSERT INTO customer(`uid`,`firstname`,`lastname`,`email`,`password`,`dob`,`gender`,`address`,`state`,`city`) VALUES? ";
            var values=[];
            var registrationStatus={status:true};
            values.push([0,firstname,lastname,email,password,dob,gender,address,state,city]);
            try{
                var data=await this.registrationLogic.checkEmailAvailable(email,connection,'customer','uid');
                if(data.status==true){
                connection.query(sql,[values],async(err,result)=>{
                    if(err)throw err;
                        resolve(registrationStatus);
                    })   
                }
                else{
                    registrationStatus={status:false};
                    resolve(registrationStatus)
                } 
            }catch(e)
            {
                reject("failed")
            }
            services.disconnectdb(connection);
            });
        },
        checkEmailAvailable:async(email,connection,who,id)=>{
                return new Promise(async(resolve,reject)=>{
                    var sql=`SELECT ${id} FROM ${who} WHERE email=?`;
                    try{
                    var available={status:true};
                    connection.query(sql,[email],async(err,result)=>{
                        if(err)throw err;
                        if(result.length>0)
                        {
                            available={status:false}
                            resolve(available);
                        }
                        else{
                            resolve(available);
                        }
                    })
                }catch(e)
                {
                    reject(e);
                }
                })
        },
        registerHealthCareService:async(name,manager,address,state,city,started,email,password,phone)=>{
            return new Promise(async(resolve,reject)=>{
                var connection=await services.connectdb("healthcare_webapp");
                var sql="INSERT INTO health_care_service(`hid`,`name`,`manager`,`address`,`state`,`city`,`started`,`email`,`password`,`phone`) VALUES? ";
                var values=[];
                var registrationStatus={status:true};
                values.push([0,name,manager,address,state,city,started,email,password,phone])
                try{
                var data=await this.registrationLogic.checkEmailAvailable(email,connection,'health_care_service','hid');
                if(data.status==true){
                connection.query(sql,[values],async(err,result)=>{
                    if(err)throw err;
                    resolve(registrationStatus);
                })
            }else{
                registrationStatus={status:false};
                resolve(registrationStatus);
            }
            services.disconnectdb(connection)
            }catch(e)
            {
                reject("Could not insert");
            }
            })
        },
        registerMedicalStore:async(mname,owner,email,password,address,state,city,start_on,phone)=>{
            return new Promise(async(resolve,reject)=>{
                var connection=await services.connectdb("healthcare_webapp");
                var sql="INSERT INTO medical_store(`mid`,`mname`,`address`,`state`,`city`,`owner`,`start_on`,`email`,`password`,`phone`) VALUES? ";
                var values=[];
                values.push([0,mname,address,state,city,owner,start_on,email,password,phone]);
                var registrationStatus={status:true};
                try{
                    var data=await this.registrationLogic.checkEmailAvailable(email,connection,'medical_store','mid');
                    if(data.status==true){
                    connection.query(sql,[values],async(err,result)=>{
                        if(err)throw err;
                        resolve(registrationStatus);
                    })
                }
                else{
                    registrationStatus={status:false};
                    resolve(registrationStatus);
                }
                }catch(e)
                {
                    reject(e);
                }
                services.disconnectdb(connection)
            })
        }
    }
    loginLogic={
        loginFunction:async(email,password)=>{
            return new Promise(async(resolve,reject)=>{
                var sql="SELECT uid,firstname,lastname FROM customer WHERE email=? AND password=?";
                var connection=await services.connectdb("healthcare_webapp");
                var loginStatus={};
                try{
                connection.query(sql,[email,password],async(err,result)=>{
                    if(err)throw err;
                    if(result.length>0)
                    {
                        loginStatus={status:true,uid:result[0].uid,firstname:result[0].firstname,lastname:result[0].lastname};
                        resolve(loginStatus);
                    }
                    else{
                        loginStatus={status:false,msg:"Please Register to Login",uid:""};
                        resolve(loginStatus);
                    }
                })
            }catch(e){
                reject(e);
            }
            services.disconnectdb(connection)
            })
        },
        getDetailsLogic:async(uid)=>{
            return new Promise(async(resolve,reject)=>{
            var connection=await services.connectdb("healthcare_webapp");
            var sql="SELECT firstname,lastname,email,dob,gender,address FROM customer WHERE uid=?";
            try{
            connection.query(sql,[uid],async(err,result)=>{
                if(err)throw err;
                services.disconnectdb(connection);
                resolve(result);
            })
        }catch(e)
        {
            reject(e);
        }
        })
        },
        editDetailsLogic:async(uid,email,password,address)=>{
            return new Promise(async(resolve,reject)=>{
            var connection=await services.connectdb("healthcare_webapp");
            try{
            if(email!="")
            {
                var sql="UPDATE customer SET email=? WHERE uid=?";
                connection.query(sql,[email,uid],async(err,result)=>{
                    if(err)throw err;
                })
            }
            if(password!="")
            {
                var sql="UPDATE customer SET password=? WHERE uid=?";
                connection.query(sql,[password,uid],async(err,result)=>{
                    if(err)throw err;
                })
            }
            if(address!="")
            {
                var sql="UPDATE customer SET address=? WHERE uid=?";
                connection.query(sql,[address,uid],async(err,result)=>{
                    if(err)throw err;
                })
            }
            resolve(true);
            services.disconnectdb(connection);
        }catch(e)
        {
            reject(e)
        }
            });
        },
        loginMedicalStore:async(email,password)=>{
            return new Promise(async(resolve,reject)=>{
                var sql="SELECT mid FROM medical_store WHERE email=? AND password=?";
                try{
                    var that=this;
                    var data={};
                    var connection=await services.connectdb("healthcare_webapp");
                    connection.query(sql,[email,password],async(err,result)=>{
                        if(err)throw err;
                        console.log(result);
                        if(result.length>0)
                        {
                            //var legal=await that.medical_storeFunctions.getLegalMedicineList(result[0].mid);
                            data={mid:result[0].mid};
                            resolve(data);
                        }
                        else{
                            data={msg:"Please register to login",mid:""};
                            resolve(data);
                        }
                       
                    })
                }catch(e)
                {
                    reject(e);
                }
                services.disconnectdb(connection);
                
            })
        },
        loginHealthCare:async(email,password)=>{
            return new Promise(async(resolve,reject)=>{
                var sql="SELECT hid FROM health_care_service WHERE email=? AND password=?";
                try{
                    var that=this;
                    var data={};
                    var connection=await services.connectdb("healthcare_webapp");
                    connection.query(sql,[email,password],async(err,result)=>{
                        if(err)throw err;
                        console.log(result);
                        if(result.length>0)
                        {
                        var service=await that.healthCare_functions.getServices(result[0].hid);
                        data={hid:result[0].hid,service:service};
                        services.disconnectdb(connection);
                        resolve(data);
                        }
                        else{
                            data={msg:"Please register to login",hid:""}
                            resolve(data);
                        }
                    })
                }catch(e)
                {
                    reject(e);
                }
                
                
            })
        }
    }
    searchLogic={
        searchService:async(query)=>{
            return new Promise(async(resolve,reject)=>{
                var sql="SELECT hid,price FROM services WHERE service=?"
                var values=[];
                try{
                var connection=await services.connectdb("healthcare_webapp");
                var searchStatus={status:true}
                if(query=="")
                {
                    searchStatus={status:false}
                    services.disconnectdb(connection);
                    resolve(searchStatus);
                }
                else{
                    var values=[];
                    values.push(query);
                    var that=this;
                    var data_got=[];
                    var data;
                    var prices=[];
                    var end_result={};
                    connection.query(sql,[values],async(err,result)=>{
                        if(err)throw err;
                        if(result.length>0)
                        {
                            for(var i=0;i<result.length;i++)
                            {
                                data=await that.searchLogic.checkHealthCareService(result[i],connection);
                                 data_got.push(data);
                                 prices.push(result[i].price);
                                
                            }
                            end_result={data:data_got,prices:prices,status:true};
                            services.disconnectdb(connection);
                            resolve(end_result);
                        }
                        else   
                        {
                            services.disconnectdb(connection);
                            resolve({data:"No Matching results",status:false});
                        }
                       
                    })
                }
            }catch(e){
                reject(e);
            }
            })
        },
        searchHealthCareService:async(query)=>{
            return new Promise(async(resolve,reject)=>{
                var sql="SELECT hid,state,city FROM health_care_service WHERE name=?";
                try{
                var connection=await services.connectdb("healthcare_webapp");
                var that=this;
                connection.query(sql,[query],async(err,result)=>{
                    if(err)throw err;
                    console.log(result);
                    if(result.length>0)
                    {
                        var data=await that.searchLogic.checkService(result[0],connection);
                        services.disconnectdb(connection);
                        resolve(data);
                    }
                    else{
                        services.disconnectdb(connection);
                        resolve({msg:"No matching result",status:false});
                    }
                })
                }catch(e)
                {
                    reject(e);
                }

            })
        },
        searchMedicine:async(query)=>{
            return new Promise(async(resolve,reject)=>{
                var sql="SELECT mid,price FROM medicines WHERE medicine_name=? AND availability=1"
                var connection=await services.connectdb("healthcare_webapp");
                var searchStatus={status:true}
                try{
                    if(query=="")
                    {
                        searchStatus={status:false}
                        services.disconnectdb(connection);
                        resolve(searchStatus);
                    }
                    else{
                        var that=this;
                        var data_got=[];
                        var data;
                        var prices=[];
                        var end_result={}
                        connection.query(sql,[query],async(err,result)=>{
                        if(err)throw err;
                        if(result.length>0)
                        {
                            for(var i=0;i<result.length;i++)
                            {
                                data=await that.searchLogic.checkMedicalStore(result[i],connection);
                                data_got.push(data);
                                prices.push(result[i].price);
                                
                            }
                            services.disconnectdb(connection);
                            console.log(prices);
                            end_result={data:data_got,prices:prices,status:true}
                            resolve(end_result);
                        }
                        else   
                        {
                            services.disconnectdb(connection);
                            resolve({msg:"No Matching results",status:false});
                        }
                    });
                }
                }catch(e)
                {
                    reject(e);
                }
            })
        },
        searchMedicalStore:async(query)=>{
            return new Promise(async(resolve,reject)=>{
                var sql="SELECT mid,state,city,phone FROM medical_store WHERE mname=?";
                var connection=await services.connectdb("healthcare_webapp");
                try{
                var searchStatus={status:true}
                if(query=="")
                {
                    searchStatus={status:false}
                    services.disconnectdb(connection);
                    resolve(searchStatus);
                }
                else
                {
                    var that=this;
                    var data_got=[];
                    var data;
                    connection.query(sql,[query],async(err,result)=>{
                        if(err)throw err;
                        if(result.length>0)
                        {

                            for(var i=0;i<result.length;i++)
                            {
                                data=await that.searchLogic.checkMedicine(result[i],connection);
                            
                                    data_got.push(data);
                                
                            }
                            services.disconnectdb(connection);
                            resolve(data_got);
                        }
                        else{
                            services.disconnectdb(connection);
                            resolve({msg:"No Matching results",status:false});
                        }

                    })
                }
            }catch(e)
            {
                reject(e);
            }
               
                
            })
        },
        checkMedicine:async(values,connection)=>{
            return new Promise(async(resolve,reject)=>{
                var sql="SELECT medicine_name, quantity,qtype,price FROM medicines WHERE mid=? and availability=1";
                try{
                    var value=[];
                    value.push([values.mid]);
                    console.log(values.mid)
                    connection.query(sql,[value],async(err,result)=>{
                        if(err)throw err;
                        console.log(result);
                        if(result.length>0)
                        {
                            console.log("hi")
                            resolve({result:result,status:true});
                        }
                        else{
                            console.log("error")
                            resolve({result:"They haven't made any medicines available yet",status:false});
                        }
                    });
                }catch(e)
                {
                    reject(e);
                }
            })
        },
        checkMedicalStore:async(values,connection)=>{
            return new Promise(async(resolve,reject)=>{
                var sql="SELECT mname,address,state,city FROM medical_store WHERE mid=?"
                try{
                    connection.query(sql,[values.mid],async(err,result)=>{
                        if(err)throw err;
                        if(result.length>0)
                        {
                            resolve({result:result,status:true});
                        }
                        else{
                            resolve({result:"This medicine is not available anywhere",status:false});
                        }
                    })
                }
                catch(e)
                {
                    reject(e);
                }

            })

        },
        checkService:async(values,connection)=>{
            return new Promise(async(resolve,reject)=>{
                var sql="SELECT service ,price FROM services WHERE hid=?";
                try{
                    connection.query(sql,[values.hid],async(err,result)=>{
                        if(err)throw err;
                        if(result.length>0)
                        {
                            resolve({result:result,status:true});
                        }
                        else{
                            resolve({result:"They haven't made any service available yet",status:false});
                        }
                    })
                }
                catch(e)
                {
                    reject(e);
                }
            })
        },
        checkHealthCareService:async(values,connection)=>{
            return new Promise(async(resolve,reject)=>{
                var sql="SELECT hid,name,address,state,city,phone FROM health_care_service WHERE hid=?"
                try{
                var data=[]
                var temp;
                connection.query(sql,[values.hid],async(err,result)=>{
                        if(err)throw err;
                        console.log(result);
                        resolve(result);
                    })       
                //console.log(data)
                             
            }catch(e)
            {
                reject(e);
            }
                
            })
        }

    }
    medical_storeFunctions={
        getLegalMedicineList:async(mid)=>{
            return new Promise(async(resolve,reject)=>{
                var sql1="SELECT medicine_name FROM medicines WHERE mid=?";
                var sql2="SELECT lname,category FROM legal_medicines";
                try{
                    var end_result=[];
                    var connection=await services.connectdb("healthcare_webapp");
                    connection.query(sql1,[mid],async(err,result1)=>{
                        if(err)throw err;
                        connection.query(sql2,async(err,result2)=>{
                            if(err)throw err;
                            for(var i=0;i<result2.length;i++)
                            {
                                var temp=result2[i]
                                for(var j=0;j<result1.length;j++)
                                {
                                    if(temp.lname!=result1[j].medicine_name)
                                    {
                                        // console.log(result1[j].medicine_name);
                                        // console.log(result2[j].lname)
                                        end_result.push([temp]);
                                    }
                                }
                            }
                            services.disconnectdb(connection)
                            resolve(end_result);
                        }) 
                    })
                    
                    
                }catch(e)
                {
                    reject(e);
                }   
            })
        },
        put_med_in_store:async(mid,medicine_name,quantity,qtype,price)=>{
            return new Promise(async(resolve,reject)=>{
                var data=[];
                data.push([0,medicine_name,quantity,qtype,0,0,mid,price]);
                var connection=await services.connectdb("healthcare_webapp");
                console.log(mid,medicine_name);
                var sql1="SELECT medicine_name FROM medicines WHERE mid=? AND medicine_name=?"
                var sql2="INSERT INTO medicines VALUES ? "
                connection.query(sql1,[mid,medicine_name],async(err,result)=>{
                    if(err)throw err;
                    if(result.length==0)
                    {
                        connection.query(sql2,[data],async(err,result)=>{
                            if(err)throw err;
                            var message={msg:"Added to the available list",status:true}
                            services.disconnectdb(connection);
                            resolve(message);
                        })
                    }
                    else{
                        var message={msg:"Cannot select",status:false};
                        services.disconnectdb(connection);
                        resolve(message);
                    }
                })
                
            });
        },
        make_med_available:async(mid,medicine,availability_status)=>{
            return new Promise(async(resolve,reject)=>{
            var sql="UPDATE medicines SET availability=? WHERE mid=? AND medicine_name=?";
            try{
            var connection=await services.connectdb("healthcare_webapp");
            connection.query(sql,[availability_status,mid,medicine],async(err,result)=>{
                if(err)throw err;
                resolve(true);
            })
        }catch(e)
        {
            reject(e);
        }
        services.disconnectdb(connection);
        })
        },
        get_med_available:async(mid)=>{
            return new Promise(async(resolve,reject)=>{
                var sql="SELECT * FROM medicines WHERE mid=?"
                try{
                    var connection=await services.connectdb("healthcare_webapp");
                    connection.query(sql,[mid],function(err,result){
                        if(err)throw err;
                        if(result.length>0)
                        {
                            resolve({result:result,status:true});
                        }
                        else
                        {
                            resolve({status:false});
                        }
                        
                    })
                }catch(e)
                {
                    reject(e);
                }
            })
        },
        make_med_favourite:async(mid,medicine,favourite_status)=>{
            return new Promise(async(resolve,reject)=>{
                var sql="UPDATE medicines SET favourite=? WHERE mid=? AND medicine_name=?";
                try{
                var connection=await services.connectdb("healthcare_webapp");
                connection.query(sql,[favourite_status,mid,medicine],async(err,result)=>{
                    if(err)throw err;
                    resolve(true);
                })
            }catch(e){
                reject(e);
            }
            })
        }
    }
    healthCare_functions={
        saveService:async(hid,service ,price)=>{
            return new Promise(async(resolve,reject)=>{
                var sql="INSERT INTO services VALUES ?"
                var data;
                try
                {
                    var connection=await services.connectdb("healthcare_webapp");
                    for(var i=0;i<service.length;i++)
                    {
                        data=[];
                        if(price[i]!="")
                        {
                            data.push([0,service[i],hid,price[i]])
                            connection.query(sql,[data],async(err,result)=>{
                                if(err)throw err;
                               })
                        }
                        
                    }
                    services.disconnectdb(connection);
                    resolve(true); 
                }
                catch(e)
                {
                    reject(e);
                }

            })       
        },
        setServices:async(hid,price,service_name)=>{
            return new Promise(async(resolve,reject)=>{
                try{
                    console.log(price);
                    var data
                    var sql="UPDATE services SET price=? WHERE hid=? AND service=?"
                    var connection=await services.connectdb("healthcare_webapp");
                    for(var i=0;i<price.length;i++)
                    {
                        console.log(price[i]);
                        data=[];
                        if(price[i]!="")
                        {
                            data.push([])
                            connection.query(sql,[price[i],hid,service_name[i]],async(err,result)=>{
                                if(err)throw err;
                            })
                        }
                    }
                    
                   //services.disconnectdb(connection);
                    resolve(true);
                    

                }catch(e)
                {
                    reject(e);
                }
            })
        },
        getServices:async(hid)=>{
            return new Promise(async(resolve,reject)=>{
                var sql="SELECT service,price FROM services WHERE hid=?";
                try{
                    var connection=await services.connectdb("healthcare_webapp");
                    console.log("in get Serivces")
                connection.query(sql,[hid],async(err,result)=>{
                    if(err)throw err;
                    //console.log(result);
                    resolve(result);
                })
            }catch(e){
                reject(e);
            }
            })
        }
    }

}
module.exports=model;