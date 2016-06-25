/**
 * Created by damon on 6/25/16.
 */
var express = require('express');
var app = express();
var encryptor = require('file-encryptor');
var fs=require("fs");

var inputDir="./upload/";
var outputDir="./files/encrypt/";
var decryptDir="./files/decrypt/";

var fileEn=function(filename,key,next){
    encryptor.encryptFile(inputDir+filename, outputDir+filename, key, function(err) {
        if(err){
            return next({success:false,error:err});
        }
        fs.unlinkSync(inputDir+filename);
        return next({success:true,data:{key:key}});
    });
};

var fileDe=function(filename,key,next){
    encryptor.decryptFile(outputDir+filename, decryptDir+filename, key, function(err) {
        if(err){
            return next({success:false,error:err});
        }
        return next({success:true,data:{key:key}});
    });
};

module.exports.en=fileEn;
module.exports.de=fileDe;