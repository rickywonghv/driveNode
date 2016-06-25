/**
 * Created by damon on 6/21/16.
 */
var mongoose=require("mongoose");
require("../db.js");

var Add=function(query,model,next){
  var DB=mongoose.model(model);
  var newinsert=new DB(query);
  newinsert.save(function(err,data){
     if(err){
         next({success:false,error:err});
         return;
     }
      next({success:true,data:data});
  });
};

var FindAll=function(query,model,next){
    var DB=mongoose.model(model);
    DB.find(query,function(err,data){
        if(err){
            next({success:false,error:err});
            return;
        }
        next({success:true,data:data});
    });
};

var FindAllFilter=function(query,filter,model,next){
    var DB=mongoose.model(model);
    DB.find(query,filter,function(err,data){
        if(err){
            next({success:false,error:err});
            return;
        }
        next({success:true,data:data});
    });
};

var FindOne=function(query,model,next){
    var DB=mongoose.model(model);
    DB.findOne(query,function(err,data){
        if(err){
            next({success:false,error:err});
            return;
        }
        next({success:true,data:data});
    });
};

var Remove=function(query,model,next){
    var DB=mongoose.model(model);
    DB.remove(query,function(err,data){
        if(err){
            next({success:false,error:err});
            return;
        }
        next({success:true,data:data});
    });
};

var Update=function(query,newquery,next){
    var DB=mongoose.model(model);
    DB.update(query,{ $set: newquery},function(err,data){
        if(err){
            next({success:false,error:err});
            return;
        }
        next({success:true,data:data});
    })
};

module.exports.Add=Add;
module.exports.FindAll=FindAll;
module.exports.FindAllFilter=FindAllFilter;
module.exports.FindOne=FindOne;
module.exports.Remove=Remove;
module.exports.Update=Update;