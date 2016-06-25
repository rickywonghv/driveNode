/**
 * Created by damon on 6/24/16.
 */
var express = require('express');
var Auth=require("./auth.js");
var DB=require("./db.js");
var File=require("./file.js");

var createDir=function(token,parentId,dirName,next){
    Auth.ckTk(token,function(data){
        if(data.success){
            var name=dirName;
            var parentDir=parentId;
            var owner=data.decoded.id;
            var share=false;
            var query={name:name,parent:parentDir,share:share,owner:owner};
            DB.Add(query,"dir",function(result){ //name,parent,share,owner
                if(result.success){
                    next({status:201,success:true,data:result});
                }else{
                    next({status:400,success:false,error:result.error});
                }
            })
        }else{
            next({status:401,success:false,error:data.error});
        }
    })
};

var listDir=function(token,parentId,next){
    Auth.ckTk(token,function(data){
        if(data.success){
            var owner=data.decoded.id;
            DB.FindAll({owner:owner,parent:parentId},"dir",function(result){
                if(data.success){
                    var arr=[];
                    for(var i=0;i<result.data.length;i++){
                        var id=result.data[i]._id;
                        var name=result.data[i].name;
                        var parent=result.data[i].parent;
                        arr.push({id:id,name:name,parent:parent});
                    }
                    return next({status:200,success:true,data:arr});
                }
                next({status:400,success:false,error:result.error});
            })            
        }else{
            next({status:401,success:false,error:data.error});
        }
    })
};

module.exports.CreateDir=createDir;
module.exports.ListDir=listDir;