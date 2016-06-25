/**
 * Created by damon on 6/25/16.
 */
var express = require('express');
var path = require('path');
var router = express.Router();
var File=require("../model/upload.js");
var DriveFile=require("../model/file.js");
var Auth=require("../model/auth.js");
var Admin=require("../model/admin.js");
var check=require("check-types");


router.get('/admin',function(req,res,next){
    Admin.ListAdmin(req.param("token"),function(data){
        res.status(data.status).json(data);
    })
});
module.exports = router;