/**
 * Created by damon on 6/25/16.
 */
var express = require('express');
var app = express();
var datatime=require("node-datetime");
var fs=require("fs");
var jwt=require("jsonwebtoken");
var DB=require("./db.js");
var Auth=require("./auth.js");

var listAdmin=function(token,next){
    Auth.AdminOnly(token,function(data){
        if(data.success){
            DB.FindAllFilter({},"id username email name createDT updateDT admin","user",function(result){
                if(result.success&&result.data){
                    var array=[];
                    for(var i=0;i<result.data.length;i++){
                        var id=result.data[i].id;
                        var username=result.data[i].username;
                        var email=result.data[i].email;
                        var name=result.data[i].name;
                        var cdt = datatime.create(result.data[i].createDT);
                        var cDT = cdt.format('m/d/Y H:M:S');
                        var updateDT=datatime.create(result.data[i].updateDT);
                        var uDT=updateDT.format('m/d/Y H:M:S');
                        var admin=result.data[i].admin;
                        array.push({id:id,username:username,email:email,name:name,createDT:cDT,updateDT:uDT,admin:admin});
                    }
                    next({success:true,status:200,data:array});
                }else if(!result.data){
                    next({success:false,status:400,data:"No data"});
                }else{
                    next({success:false,status:400,data:result.error});
                }
            })
        }else{
            next({success:false,status:401,data:data.error});
        }
    })
};

module.exports.ListAdmin=listAdmin;