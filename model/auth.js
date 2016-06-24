/**
 * Created by damon on 6/21/16.
 */
var express = require('express');
var app = express();
var datatime=require("node-datetime");
var fs=require("fs");
var jwt=require("jsonwebtoken");
var DB=require("./db.js");
var check = require('check-types');
var bc=require("bcrypt-nodejs");
var priKey = fs.readFileSync('./key/private.key');
var pubKey=fs.readFileSync('./key/public.key');

var AddUser=function(query,next){
    AdminOnly(query.token,function(ckres){
        if(!ckres.success){
            next(ckres);
            return;
        }
        if(check.object(query)) {
            if(check.nonEmptyString(query.username,query.password,query.conpassword,query.email,query.name,query.admin)) {
                if(query.password==query.conpassword){
                    var hash=bc.hashSync(query.password, bc.genSaltSync());
                    var DT=datatime.create().now();
                    var json={username:query.username,password:hash,email:query.email,name:query.name,admin:query.admin,createDT:DT,updateDT:DT};
                    DB.Add(json,"user",function (data) {
                        next(data);
                        return
                    });
                }else {
                    next({success:false,error:"Password are not match!"});
                    return
                }
            }else{
                next({success:false,error:"1Miss Param"});
                return
            }
        }else{
            next({success:false,error:"Miss Param"});
            return
        }
    });
};

var LoginUser=function(query,next){
    if(check.emptyObject(query)) {
        return next({success:false,error:"Miss Param",status:400});
    }
    if(check.null(query.username,query.password)){
        return next({success:false,error:"Miss Param",status:400});
    }
    DB.FindOne({username:query.username},"user",function(data){
        if(data.success&&data.data){
            var hash=data.data.password;
            if(bc.compareSync(query.password,hash)){
                var json={id:data.data._id,username:data.data.username,admin:data.data.admin};
                genTk(json,function(result){
                    if(result.success){
                        next({success:true,token:result.token,userdata:json,status:200});
                    }else{
                        next({success:false,error:"Error! Please try to login again!",status:400});
                    }
                });
            }else{
                next({success:false,error:"Wrong username or password!",status:401});
            }
        }else{
            next({success:false,error:"Wrong username or password!",status:401});
        }
    });
};

function AdminOnly(token,next){
    ckTk(token,function(data){
        if(data.success&&data.decoded){
            if(data.decoded.admin){
                next({success:true,decoded:data.decoded});
            }else{
                next({success:false,error:"Not Admin",decoded:data.decoded});
            }
        }else{
            next(data);
        }
    });
};

function ckTk(token,next){
    if(!check.null(token)){
        jwt.verify(token, pubKey, {issuer:'driveDT' }, function(err, decoded) {
            if(err){
                next({success:false,error:err});
                return;
            }
            next({success:true,decoded:decoded});
        });
    }else{
        next({success:false,error:"Miss Param"});
    }
}

function genTk(query,next){
    if(check.object(query)) {
        jwt.sign(query, priKey, {algorithm: 'RS256', expiresIn: "5h", issuer: "driveDT"}, function (err, token) {
            if (err) {
                next({success: false, error: err});
                return;
            }
            next({success: true, token: token});
        });
    }else{
        next({success:false,error:"Miss Param"});
    }
}

module.exports.AddUser=AddUser;
module.exports.LoginUser=LoginUser;
module.exports.ckTk=ckTk;
module.exports.AdminOnly=AdminOnly;