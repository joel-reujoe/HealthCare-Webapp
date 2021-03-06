var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var express = require('express');
var sql = require('mysql');
var fs = require('fs');
var bodyParser = require('body-parser');
var services = require('./db.js');
class model {
    constructor() {
        this.registrationLogic = {
            registerUser: (firstname, lastname, email, password, dob, gender, address, state, city) => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    var connection = yield services.connectdb("healthcare_webapp");
                    var sql = "INSERT INTO customer(`uid`,`firstname`,`lastname`,`email`,`password`,`dob`,`gender`,`address`,`state`,`city`) VALUES? ";
                    var values = [];
                    var registrationStatus = { status: true };
                    values.push([0, firstname, lastname, email, password, dob, gender, address, state, city]);
                    try {
                        var data = yield this.registrationLogic.checkEmailAvailable(email, connection, 'customer', 'uid');
                        if (data.status == true) {
                            connection.query(sql, [values], (err, result) => __awaiter(this, void 0, void 0, function* () {
                                if (err)
                                    throw err;
                                resolve(registrationStatus);
                            }));
                        }
                        else {
                            registrationStatus = { status: false };
                            resolve(registrationStatus);
                        }
                    }
                    catch (e) {
                        reject("failed");
                    }
                    services.disconnectdb(connection);
                }));
            }),
            checkEmailAvailable: (email, connection, who, id) => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    var sql = `SELECT ${id} FROM ${who} WHERE email=?`;
                    try {
                        var available = { status: true };
                        connection.query(sql, [email], (err, result) => __awaiter(this, void 0, void 0, function* () {
                            if (err)
                                throw err;
                            if (result.length > 0) {
                                available = { status: false };
                                resolve(available);
                            }
                            else {
                                resolve(available);
                            }
                        }));
                    }
                    catch (e) {
                        reject(e);
                    }
                }));
            }),
            registerHealthCareService: (name, manager, address, state, city, started, email, password, phone) => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    var connection = yield services.connectdb("healthcare_webapp");
                    var sql = "INSERT INTO health_care_service(`hid`,`name`,`manager`,`address`,`state`,`city`,`started`,`email`,`password`,`phone`) VALUES? ";
                    var values = [];
                    var registrationStatus = { status: true };
                    values.push([0, name, manager, address, state, city, started, email, password, phone]);
                    try {
                        var data = yield this.registrationLogic.checkEmailAvailable(email, connection, 'health_care_service', 'hid');
                        if (data.status == true) {
                            connection.query(sql, [values], (err, result) => __awaiter(this, void 0, void 0, function* () {
                                if (err)
                                    throw err;
                                resolve(registrationStatus);
                            }));
                        }
                        else {
                            registrationStatus = { status: false };
                            resolve(registrationStatus);
                        }
                        services.disconnectdb(connection);
                    }
                    catch (e) {
                        reject("Could not insert");
                    }
                }));
            }),
            registerMedicalStore: (mname, owner, email, password, address, state, city, start_on, phone) => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    var connection = yield services.connectdb("healthcare_webapp");
                    var sql = "INSERT INTO medical_store(`mid`,`mname`,`address`,`state`,`city`,`owner`,`start_on`,`email`,`password`,`phone`) VALUES? ";
                    var values = [];
                    values.push([0, mname, address, state, city, owner, start_on, email, password, phone]);
                    var registrationStatus = { status: true };
                    try {
                        var data = yield this.registrationLogic.checkEmailAvailable(email, connection, 'medical_store', 'mid');
                        if (data.status == true) {
                            connection.query(sql, [values], (err, result) => __awaiter(this, void 0, void 0, function* () {
                                if (err)
                                    throw err;
                                resolve(registrationStatus);
                            }));
                        }
                        else {
                            registrationStatus = { status: false };
                            resolve(registrationStatus);
                        }
                    }
                    catch (e) {
                        reject(e);
                    }
                    services.disconnectdb(connection);
                }));
            })
        };
        this.loginLogic = {
            loginFunction: (email, password) => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    var sql = "SELECT uid,firstname,lastname FROM customer WHERE email=? AND password=?";
                    var connection = yield services.connectdb("healthcare_webapp");
                    var loginStatus = {};
                    try {
                        connection.query(sql, [email, password], (err, result) => __awaiter(this, void 0, void 0, function* () {
                            if (err)
                                throw err;
                            if (result.length > 0) {
                                loginStatus = { status: true, uid: result[0].uid, firstname: result[0].firstname, lastname: result[0].lastname };
                                resolve(loginStatus);
                            }
                            else {
                                loginStatus = { status: false, msg: "Please Register to Login", uid: "" };
                                resolve(loginStatus);
                            }
                        }));
                    }
                    catch (e) {
                        reject(e);
                    }
                    services.disconnectdb(connection);
                }));
            }),
            getDetailsLogic: (uid) => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    var connection = yield services.connectdb("healthcare_webapp");
                    var sql = "SELECT firstname,lastname,email,dob,gender,address FROM customer WHERE uid=?";
                    try {
                        connection.query(sql, [uid], (err, result) => __awaiter(this, void 0, void 0, function* () {
                            if (err)
                                throw err;
                            services.disconnectdb(connection);
                            resolve(result);
                        }));
                    }
                    catch (e) {
                        reject(e);
                    }
                }));
            }),
            editDetailsLogic: (uid, email, password, address) => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    var connection = yield services.connectdb("healthcare_webapp");
                    try {
                        if (email != "") {
                            var sql = "UPDATE customer SET email=? WHERE uid=?";
                            connection.query(sql, [email, uid], (err, result) => __awaiter(this, void 0, void 0, function* () {
                                if (err)
                                    throw err;
                            }));
                        }
                        if (password != "") {
                            var sql = "UPDATE customer SET password=? WHERE uid=?";
                            connection.query(sql, [password, uid], (err, result) => __awaiter(this, void 0, void 0, function* () {
                                if (err)
                                    throw err;
                            }));
                        }
                        if (address != "") {
                            var sql = "UPDATE customer SET address=? WHERE uid=?";
                            connection.query(sql, [address, uid], (err, result) => __awaiter(this, void 0, void 0, function* () {
                                if (err)
                                    throw err;
                            }));
                        }
                        resolve(true);
                        services.disconnectdb(connection);
                    }
                    catch (e) {
                        reject(e);
                    }
                }));
            }),
            loginMedicalStore: (email, password) => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    var sql = "SELECT mid FROM medical_store WHERE email=? AND password=?";
                    try {
                        var that = this;
                        var data = {};
                        var connection = yield services.connectdb("healthcare_webapp");
                        connection.query(sql, [email, password], (err, result) => __awaiter(this, void 0, void 0, function* () {
                            if (err)
                                throw err;
                            console.log(result);
                            if (result.length > 0) {
                                data = { mid: result[0].mid };
                                resolve(data);
                            }
                            else {
                                data = { msg: "Please register to login", mid: "" };
                                resolve(data);
                            }
                        }));
                    }
                    catch (e) {
                        reject(e);
                    }
                    services.disconnectdb(connection);
                }));
            }),
            loginHealthCare: (email, password) => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    var sql = "SELECT hid FROM health_care_service WHERE email=? AND password=?";
                    try {
                        var that = this;
                        var data = {};
                        var connection = yield services.connectdb("healthcare_webapp");
                        connection.query(sql, [email, password], (err, result) => __awaiter(this, void 0, void 0, function* () {
                            if (err)
                                throw err;
                            console.log(result);
                            if (result.length > 0) {
                                var service = yield that.healthCare_functions.getServices(result[0].hid);
                                data = { hid: result[0].hid, service: service };
                                services.disconnectdb(connection);
                                resolve(data);
                            }
                            else {
                                data = { msg: "Please register to login", hid: "" };
                                resolve(data);
                            }
                        }));
                    }
                    catch (e) {
                        reject(e);
                    }
                }));
            })
        };
        this.searchLogic = {
            searchService: (query) => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    var sql = "SELECT hid,price FROM services WHERE service=?";
                    var values = [];
                    try {
                        var connection = yield services.connectdb("healthcare_webapp");
                        var searchStatus = { status: true };
                        if (query == "") {
                            searchStatus = { status: false };
                            services.disconnectdb(connection);
                            resolve(searchStatus);
                        }
                        else {
                            var values = [];
                            values.push(query);
                            var that = this;
                            var data_got = [];
                            var data;
                            var prices = [];
                            var end_result = {};
                            connection.query(sql, [values], (err, result) => __awaiter(this, void 0, void 0, function* () {
                                if (err)
                                    throw err;
                                if (result.length > 0) {
                                    for (var i = 0; i < result.length; i++) {
                                        data = yield that.searchLogic.checkHealthCareService(result[i], connection);
                                        data_got.push(data);
                                        prices.push(result[i].price);
                                    }
                                    end_result = { data: data_got, prices: prices, status: true };
                                    services.disconnectdb(connection);
                                    resolve(end_result);
                                }
                                else {
                                    services.disconnectdb(connection);
                                    resolve({ data: "No Matching results", status: false });
                                }
                            }));
                        }
                    }
                    catch (e) {
                        reject(e);
                    }
                }));
            }),
            searchHealthCareService: (query) => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    var sql = "SELECT hid,state,city FROM health_care_service WHERE name=?";
                    try {
                        var connection = yield services.connectdb("healthcare_webapp");
                        var that = this;
                        connection.query(sql, [query], (err, result) => __awaiter(this, void 0, void 0, function* () {
                            if (err)
                                throw err;
                            console.log(result);
                            if (result.length > 0) {
                                var data = yield that.searchLogic.checkService(result[0], connection);
                                services.disconnectdb(connection);
                                resolve(data);
                            }
                            else {
                                services.disconnectdb(connection);
                                resolve({ msg: "No matching result", status: false });
                            }
                        }));
                    }
                    catch (e) {
                        reject(e);
                    }
                }));
            }),
            searchMedicine: (query) => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    var sql = "SELECT mid,price FROM medicines WHERE medicine_name=? AND availability=1";
                    var connection = yield services.connectdb("healthcare_webapp");
                    var searchStatus = { status: true };
                    try {
                        if (query == "") {
                            searchStatus = { status: false };
                            services.disconnectdb(connection);
                            resolve(searchStatus);
                        }
                        else {
                            var that = this;
                            var data_got = [];
                            var data;
                            var prices = [];
                            var end_result = {};
                            connection.query(sql, [query], (err, result) => __awaiter(this, void 0, void 0, function* () {
                                if (err)
                                    throw err;
                                if (result.length > 0) {
                                    for (var i = 0; i < result.length; i++) {
                                        data = yield that.searchLogic.checkMedicalStore(result[i], connection);
                                        data_got.push(data);
                                        prices.push(result[i].price);
                                    }
                                    services.disconnectdb(connection);
                                    console.log(prices);
                                    end_result = { data: data_got, prices: prices, status: true };
                                    resolve(end_result);
                                }
                                else {
                                    services.disconnectdb(connection);
                                    resolve({ msg: "No Matching results", status: false });
                                }
                            }));
                        }
                    }
                    catch (e) {
                        reject(e);
                    }
                }));
            }),
            searchMedicalStore: (query) => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    var sql = "SELECT mid,state,city,phone FROM medical_store WHERE mname=?";
                    var connection = yield services.connectdb("healthcare_webapp");
                    try {
                        var searchStatus = { status: true };
                        if (query == "") {
                            searchStatus = { status: false };
                            services.disconnectdb(connection);
                            resolve(searchStatus);
                        }
                        else {
                            var that = this;
                            var data_got = [];
                            var data;
                            connection.query(sql, [query], (err, result) => __awaiter(this, void 0, void 0, function* () {
                                if (err)
                                    throw err;
                                if (result.length > 0) {
                                    for (var i = 0; i < result.length; i++) {
                                        data = yield that.searchLogic.checkMedicine(result[i], connection);
                                        data_got.push(data);
                                    }
                                    services.disconnectdb(connection);
                                    resolve(data_got);
                                }
                                else {
                                    services.disconnectdb(connection);
                                    resolve({ msg: "No Matching results", status: false });
                                }
                            }));
                        }
                    }
                    catch (e) {
                        reject(e);
                    }
                }));
            }),
            checkMedicine: (values, connection) => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    var sql = "SELECT medicine_name, quantity,qtype,price FROM medicines WHERE mid=? and availability=1";
                    try {
                        var value = [];
                        value.push([values.mid]);
                        console.log(values.mid);
                        connection.query(sql, [value], (err, result) => __awaiter(this, void 0, void 0, function* () {
                            if (err)
                                throw err;
                            console.log(result);
                            if (result.length > 0) {
                                console.log("hi");
                                resolve({ result: result, status: true });
                            }
                            else {
                                console.log("error");
                                resolve({ result: "They haven't made any medicines available yet", status: false });
                            }
                        }));
                    }
                    catch (e) {
                        reject(e);
                    }
                }));
            }),
            checkMedicalStore: (values, connection) => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    var sql = "SELECT mname,address,state,city FROM medical_store WHERE mid=?";
                    try {
                        connection.query(sql, [values.mid], (err, result) => __awaiter(this, void 0, void 0, function* () {
                            if (err)
                                throw err;
                            if (result.length > 0) {
                                resolve({ result: result, status: true });
                            }
                            else {
                                resolve({ result: "This medicine is not available anywhere", status: false });
                            }
                        }));
                    }
                    catch (e) {
                        reject(e);
                    }
                }));
            }),
            checkService: (values, connection) => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    var sql = "SELECT service ,price FROM services WHERE hid=?";
                    try {
                        connection.query(sql, [values.hid], (err, result) => __awaiter(this, void 0, void 0, function* () {
                            if (err)
                                throw err;
                            if (result.length > 0) {
                                resolve({ result: result, status: true });
                            }
                            else {
                                resolve({ result: "They haven't made any service available yet", status: false });
                            }
                        }));
                    }
                    catch (e) {
                        reject(e);
                    }
                }));
            }),
            checkHealthCareService: (values, connection) => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    var sql = "SELECT hid,name,address,state,city,phone FROM health_care_service WHERE hid=?";
                    try {
                        var data = [];
                        var temp;
                        connection.query(sql, [values.hid], (err, result) => __awaiter(this, void 0, void 0, function* () {
                            if (err)
                                throw err;
                            console.log(result);
                            resolve(result);
                        }));
                    }
                    catch (e) {
                        reject(e);
                    }
                }));
            })
        };
        this.medical_storeFunctions = {
            getLegalMedicineList: (mid) => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    var sql1 = "SELECT medicine_name FROM medicines WHERE mid=?";
                    var sql2 = "SELECT lname,category FROM legal_medicines";
                    try {
                        var end_result = [];
                        var connection = yield services.connectdb("healthcare_webapp");
                        connection.query(sql1, [mid], (err, result1) => __awaiter(this, void 0, void 0, function* () {
                            if (err)
                                throw err;
                            connection.query(sql2, (err, result2) => __awaiter(this, void 0, void 0, function* () {
                                if (err)
                                    throw err;
                                for (var i = 0; i < result2.length; i++) {
                                    var temp = result2[i];
                                    for (var j = 0; j < result1.length; j++) {
                                        if (temp.lname != result1[j].medicine_name) {
                                            end_result.push([temp]);
                                        }
                                    }
                                }
                                services.disconnectdb(connection);
                                resolve(end_result);
                            }));
                        }));
                    }
                    catch (e) {
                        reject(e);
                    }
                }));
            }),
            put_med_in_store: (mid, medicine_name, quantity, qtype, price) => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    var data = [];
                    data.push([0, medicine_name, quantity, qtype, 0, 0, mid, price]);
                    var connection = yield services.connectdb("healthcare_webapp");
                    console.log(mid, medicine_name);
                    var sql1 = "SELECT medicine_name FROM medicines WHERE mid=? AND medicine_name=?";
                    var sql2 = "INSERT INTO medicines VALUES ? ";
                    connection.query(sql1, [mid, medicine_name], (err, result) => __awaiter(this, void 0, void 0, function* () {
                        if (err)
                            throw err;
                        if (result.length == 0) {
                            connection.query(sql2, [data], (err, result) => __awaiter(this, void 0, void 0, function* () {
                                if (err)
                                    throw err;
                                var message = { msg: "Added to the available list", status: true };
                                services.disconnectdb(connection);
                                resolve(message);
                            }));
                        }
                        else {
                            var message = { msg: "Cannot select", status: false };
                            services.disconnectdb(connection);
                            resolve(message);
                        }
                    }));
                }));
            }),
            make_med_available: (mid, medicine, availability_status) => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    var sql = "UPDATE medicines SET availability=? WHERE mid=? AND medicine_name=?";
                    try {
                        var connection = yield services.connectdb("healthcare_webapp");
                        connection.query(sql, [availability_status, mid, medicine], (err, result) => __awaiter(this, void 0, void 0, function* () {
                            if (err)
                                throw err;
                            resolve(true);
                        }));
                    }
                    catch (e) {
                        reject(e);
                    }
                    services.disconnectdb(connection);
                }));
            }),
            get_med_available: (mid) => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    var sql = "SELECT * FROM medicines WHERE mid=?";
                    try {
                        var connection = yield services.connectdb("healthcare_webapp");
                        connection.query(sql, [mid], function (err, result) {
                            if (err)
                                throw err;
                            if (result.length > 0) {
                                resolve({ result: result, status: true });
                            }
                            else {
                                resolve({ status: false });
                            }
                        });
                    }
                    catch (e) {
                        reject(e);
                    }
                }));
            }),
            make_med_favourite: (mid, medicine, favourite_status) => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    var sql = "UPDATE medicines SET favourite=? WHERE mid=? AND medicine_name=?";
                    try {
                        var connection = yield services.connectdb("healthcare_webapp");
                        connection.query(sql, [favourite_status, mid, medicine], (err, result) => __awaiter(this, void 0, void 0, function* () {
                            if (err)
                                throw err;
                            resolve(true);
                        }));
                    }
                    catch (e) {
                        reject(e);
                    }
                }));
            })
        };
        this.healthCare_functions = {
            saveService: (hid, service, price) => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    var sql = "INSERT INTO services VALUES ?";
                    var data;
                    try {
                        var connection = yield services.connectdb("healthcare_webapp");
                        for (var i = 0; i < service.length; i++) {
                            data = [];
                            if (price[i] != "") {
                                data.push([0, service[i], hid, price[i]]);
                                connection.query(sql, [data], (err, result) => __awaiter(this, void 0, void 0, function* () {
                                    if (err)
                                        throw err;
                                }));
                            }
                        }
                        services.disconnectdb(connection);
                        resolve(true);
                    }
                    catch (e) {
                        reject(e);
                    }
                }));
            }),
            setServices: (hid, price, service_name) => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        console.log(price);
                        var data;
                        var sql = "UPDATE services SET price=? WHERE hid=? AND service=?";
                        var connection = yield services.connectdb("healthcare_webapp");
                        for (var i = 0; i < price.length; i++) {
                            console.log(price[i]);
                            data = [];
                            if (price[i] != "") {
                                data.push([]);
                                connection.query(sql, [price[i], hid, service_name[i]], (err, result) => __awaiter(this, void 0, void 0, function* () {
                                    if (err)
                                        throw err;
                                }));
                            }
                        }
                        resolve(true);
                    }
                    catch (e) {
                        reject(e);
                    }
                }));
            }),
            getServices: (hid) => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    var sql = "SELECT service,price FROM services WHERE hid=?";
                    try {
                        var connection = yield services.connectdb("healthcare_webapp");
                        console.log("in get Serivces");
                        connection.query(sql, [hid], (err, result) => __awaiter(this, void 0, void 0, function* () {
                            if (err)
                                throw err;
                            resolve(result);
                        }));
                    }
                    catch (e) {
                        reject(e);
                    }
                }));
            })
        };
    }
}
module.exports = model;
//# sourceMappingURL=model.js.map