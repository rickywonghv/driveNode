/**
 * Created by damon on 6/20/16.
 */
var express = require('express');
var path = require('path');
var router = express.Router();
var File=require("../model/upload.js");
var DriveFile=require("../model/file.js");
var Auth=require("../model/auth.js");
var check=require("check-types");
var multer=require("multer");

/* API. */
router.post('/upload', function(req, res, next) {
    File.FileUpload(req,res,function(data){
        res.status(data.status).json(data);
    });
});

router.get('/list',function(req,res,next){
    DriveFile.FileList(req.param("token"),req.param("dir"),function(data){
        res.status(data.status).json(data);
    })
});

router.get('/download', function(req, res, next) {
    DriveFile.FileDownload(req,res);
});

router.get('/init',function(req,res,next){
    Auth.AddUser({username:"root",password:"28911353",conpassword:"28911353",email:"damon@damonw.com",admin:true,name:"Damon Wong"},function(data){
        res.json(data);
    });
});

router.post('/addadmin',function(req,res,next){
   
       var username=req.body.username;
       var password=req.body.password;
       var conpassword=req.body.conpassword;
       var email=req.body.email;
       var admin=req.body.admin;
       var name=req.body.name;
       var token=req.body.token;
       Auth.AddUser({token:token,username:username,password:password,conpassword:conpassword,email:email,admin:admin,name:name},function(data){
           res.json(data);
       });
});

router.post('/login',function(req,res,next){
    if(check.not.undefined(req.body.username,req.body.password)){
        var username=req.body.username;
        var password=req.body.password;
        Auth.LoginUser({username:username,password:password},function(data){
            res.status(data.status).json(data);
        });
    }else{
        res.json({success:false,error:"Miss Param"});
    }
});

module.exports = router;
