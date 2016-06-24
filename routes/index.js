var express = require('express');
var router = express.Router();
var path=require("path");
var Auth=require("../model/auth.js");

/* GET home page. */
router.get('/', function(req, res, next) {
  ckTk(req,res,"index",'Drive');
});

router.get('/upload', function(req, res, next) {
  ckTk(req,res,"upload",'Drive | Upload');
});

router.get('/login',function(req,res,next){
  res.render("login",{title:"Drive"});
});

function ckTk(req,res,jade,title){
  Auth.ckTk(req.cookies.token,function(data){
    if(data.success){
      res.render(jade,{title:title});
    }else{
      res.render("login",{title:"Drive"});
    }
  });
}

module.exports = router;
