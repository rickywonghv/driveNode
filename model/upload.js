/**
 * Created by damon on 6/20/16.
 */
var express = require('express');
var app = express();
var multer  = require('multer');
var upload = multer({dest:"upload/",inMemory: true}).single('file');
var Auth=require("../model/auth.js");
var fs=require("fs");
var DB=require("../model/db.js");
var Encrypt=require("../model/encrypt.js");
var uuid = require('uuid');

var FileUpload=function(req, res,next){
    upload(req,res, function (err) {
        if (err) {
            return next({success:false,error:err,status:400});
        }
        Auth.ckTk(req.body.token,function(ata){
            if(ata.success){
                var key=uuid.v4();
                var query = {key:key,meta:req.file,share:false,owner:ata.decoded.id,parent:req.body.dir};
                Encrypt.en(req.file.filename,key,function(resu){
                    if(!resu.success){
                        console.log(resu);
                        return false;
                    }
                });
                DB.Add(query,"file",function(data){
                    if(data.success){
                        next({success:true,data:data,status:201});
                    }else{
                        next({success:false,data:data,status:400});
                    }
                })
            }else{
                fs.unlinkSync(req.file.path);
                return next({success:false,error:"Invalid Token",err:ata,status:401});
            }
        });
    });
};

var FileList=function(token,dir,next){
    
};


module.exports.FileUpload=FileUpload;