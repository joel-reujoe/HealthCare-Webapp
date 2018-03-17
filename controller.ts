var express=require('express');
var sql=require('mysql');
var fs=require('fs');
var bodyParser=require('body-parser');
var model=require('./model.js');
var data=fs.readFileSync('state_city.json', 'utf8');
var state_city=JSON.parse(data);
var model1=new model();

var app=express();
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.get('/',async(req,res)=>{

    console.log(state_city);
    res.send(state_city);
});
app.post('/registerUser',async(req,res)=>{
    var msg=[]
    if(req.body.fname=="")
    {
        msg.push({msg:"first name field can't be empty", status:false});
    }
    if(req.body.lname=="")
    {
        msg.push({msg:"last name field can't be empty", status:false});
    
    }
    if(req.body.email=="")
    {
        msg.push({msg:"email field can't be empty", status:false});
    
    }
    if(req.body.password=="")
    {
        msg.push({msg:"password field can't be empty", status:false});
    
    }
    if(req.body.dob=="")
    {
        msg.push({msg:"date of birth field can't be empty", status:false});
    
    }
    if(req.body.gender=="")
    {
        msg.push({msg:"select a gender", status:false});
    
    }
    if(req.body.address=="")
    {
        msg.push({msg:"address field can't be empty", status:false});

    }
    if(req.body.state=="--Enter your State--")
    {
        msg.push({msg:"select a state", status:false});
    }
    if(req.body.city=="--Enter your city--")
    {
        console.log("city");
        msg.push({msg:"select a city", status:false});
        res.send(msg)
    }
    else
    {
        console.log("register")
        var data=await model1.registrationLogic.registerUser(req.body.fname, req.body.lname, req.body.email, req.body.password, req.body.dob, req.body.gender, req.body.address, req.body.state, req.body.city);
        res.send(data);
    }

   
});
app.post('/registerHealthCareService',async(req,res)=>{
    var msg=[]
    console.log(req.body.name);
    if(req.body.name=="")
    {
        msg.push({msg:"This field cannot be empty", status:false});
    }
    if(req.body.email=="")
    {
        msg.push({msg:"Please enter an email", status:false});
    }
    if(req.body.password=="")
    {
        msg.push({msg:"Please enter a password", status:false});
    }
    if(req.body.reception=="")
    {
        msg.push({msg:"Please enter this field", status:false});
    }
    if(req.body.address=="")
    {
        msg.push({msg:"Please enter the address", status:false});
    }
    if(req.body.state=="")
    {
        msg.push({msg:"Select a state", status:false});
    }
    if(req.body.city=="")
    {
        msg.push({msg:"Select a city", status:false});
    }
    if(req.body.phone=="")
    {
        msg.push({msg:"Please enter a phone number", status:false});
        res.send(msg);
    }
    else
    {
        var data=await model1.registrationLogic.registerHealthCareService(req.body.name, req.body.reception, req.body.address, req.body.state, req.body.city,'12-12-2018', req.body.email, req.body.password, req.body.phone);
        res.send(data);
    }
    
});
app.post('/registerMedicalStore',async(req,res)=>{
    var msg=[]
    console.log(req.body.name);
    if(req.body.name=="")
    {
        msg.push({msg:"This field cannot be empty", status:false});
    }
    if(req.body.email=="")
    {
        msg.push({msg:"Please enter an email", status:false});
    }
    if(req.body.password=="")
    {
        msg.push({msg:"Please enter a password", status:false});
    }
    if(req.body.address=="")
    {
        msg.push({msg:"Please enter the address", status:false});
    }
    if(req.body.state=="--Enter your State--")
    {
        msg.push({msg:"Select a state", status:false});
    }
    if(req.body.city=="")
    {
        msg.push({msg:"Select a city", status:false});
    }
    if(req.body.phone=="")
    {
        msg.push({msg:"Please enter a phone number", status:false});
        res.send(msg);
    }
    else
    {
        var data=await model1.registrationLogic.registerMedicalStore(req.body.name, req.body.owner, req.body.email, req.body.password, req.body.address, req.body.state, req.body.city,'12-12-2018',req.body.phone);
        res.send(data);
    }
    
});
app.post('/loginUser',async(req,res)=>{
    var msg=[];
    if(req.body.email=="")
    {
        msg.push({msg:"Enter a valid email",status:false});
    }
    if(req.body.password=="")
    {
        msg.push({msg:"Enter a password",status:false});
        res.send(msg);
    }
    else{
        var data=await model1.loginLogic.loginFunction(req.body.email,req.body.password);
        res.send(data);
    }
});
app.post('/loginMedicalStore',async(req,res)=>{
    var msg=[];
    if(req.body.email=="")
    {
        msg.push({msg:"Enter a valid email",status:false});
    }
    if(req.body.password=="")
    {
        msg.push({msg:"Enter a password",status:false});
        res.send(msg);
    }
    else{
        var data=await model1.loginLogic.loginMedicalStore(req.body.email,req.body.password);
        res.send(data);
    }
    
});
app.post('/loginHealthCare',async(req,res)=>{
    var msg=[];
    if(req.body.email=="")
    {
        msg.push({msg:"Enter a valid email",status:false});
    }
    if(req.body.password=="")
    {
        msg.push({msg:"Enter a password",status:false});
        res.send(msg);
    }
    else{
        var data=await model1.loginLogic.loginHealthCare(req.body.email,req.body.password);
        res.send(data);
    }
   
});
app.post('/getDetails',async(req,res)=>{
    if(req.body.uid!="")
    {
        var data=await model1.loginLogic.getDetailsLogic(req.body.uid);
        res.send(data);
    }
    else{
        res.send("");
    }
    
});
app.post('/editDetailsLogic',async(req,res)=>{
    if(req.body.uid!="")
    {
        var data=await model1.loginLogic.editDetailsLogic(5,"joel.rdsouza@gmail.com","7709776820","A-302,Jonna Villa,Manickpur, Vasai West");
        res.send(data);
    }
    else{
        res.send("");
    }
   
});
app.post('/searchService',async(req,res)=>{
    if(req.body.query=="")
    {
        res.send("");
    }
   else{
    var data=await model1.searchLogic.searchService(req.body.query);
    res.send(data);
   }
})
app.post('/searchHealthCareService',async(req,res)=>{
    var data=await model1.searchLogic.searchHealthCareService(req.body.query);
    res.send(data);
});
app.post('/searchMedicine',async(req,res)=>{
    var data=await model1.searchLogic.searchMedicine(req.body.query);
    res.send(data);
});
app.post('/searchMedicalStore',async(req,res)=>{
    var data=await model1.searchLogic.searchMedicalStore(req.body.query);
    res.send(data);
});
app.post('/putInMedStore',async(req,res)=>{
    console.log(req.body);
    var data=await model1.medical_storeFunctions.put_med_in_store(req.body.mid,req.body.medicine_name,10,"mg",20);
    res.send(data);
});
app.post('/makeMedAvailable',async(req,res)=>{
    console.log(req.body.availability)
    var data=await model1.medical_storeFunctions.make_med_available(req.body.mid,req.body.medicine_name,req.body.availability);
    res.send(data);
});
app.post('/getMedAvailable',async(req,res)=>{
    var data=await model1.medical_storeFunctions.get_med_available(req.body.mid);
    res.send(data);
});
app.post('/setService',async(req,res)=>{
    console.log(req.body);
    var hid=JSON.parse(req.body.hid);
    var existService=JSON.parse(req.body.existService);
    var existPrice=JSON.parse(req.body.existPrice);
    var data=await model1.healthCare_functions.setServices(hid,existPrice,existService);
    res.send(data);
});

app.post('/saveService',async(req,res)=>{
    var hid=JSON.parse(req.body.hid);
    var service=JSON.parse(req.body.service);
    var price=JSON.parse(req.body.price);
    var data=await model1.healthCare_functions.saveService(hid,service,price);
    res.send(data);
});
app.post('/getServices',async(req,res)=>{
    var data=await model1.healthCare_functions.getServices(req.body.hid);
    res.send(data);
});
app.post('/getLegalList',async(req,res)=>{
    var data=await model1.medical_storeFunctions.getLegalMedicineList(req.body.mid);
    res.send(data);
});



app.listen(8000,()=>{
    console.log('Server Started');
})
