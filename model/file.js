/**
 * Created by damon on 6/24/16.
 */
var express = require('express');
var DB=require("./db.js");
var Auth=require("./auth.js");
var FileList=function(token,dir,next){
    Auth.ckTk(token,function(data){
        if(data.success){
            DB.FindAll({owner:data.decoded.id},"file",function(result){
                if(data.success){
                    var files=[];
                    for(var i=0;i<result.data.length;i++){
                        var id=result.data[i]._id;
                        var name=result.data[i].meta.originalname;
                        var mimetype=result.data[i].meta.mimetype;
                        files.push({id:id,mimetype:mimetype,name:name});
                    }
                    next({success:true,status:200,data:files});
                }else{
                    next({success:false,status:400,error:result.error});
                }
            })
        }else{
            next({success:false,status:401,error:"Invalid Token"})
        }
    })
};

var FileDownload=function(req,res){
    fileOwner(req.param("token"),req.param("fileId"),function(data){
        if(data.success){
            res.set('Content-Type', data.data.mimetype);
            res.status(data.status).download(data.data.path,data.data.originalname);
        }else{
            res.set('Content-Type','application/json');
            res.status(data.status).json({success:false,error:data.error});
        }
    })
};

function fileOwner(token,query,next){
    Auth.ckTk(token,function(data){
        if(data.success){
            var tkid=data.decoded.id;
            DB.FindOne({_id:query},"file",function(filedata){
                if(filedata.success){
                    if(filedata.data.owner!=tkid){
                        return next({success:false,error:"No Permission",status:401});
                    }else{
                        return next({success:true,data:filedata.data.meta,status:200});
                    }
                }
            })
        }else{
            return next({success:false,error:"No Permission",status:401});
        }
    });
}

module.exports.FileList=FileList;
module.exports.FileDownload=FileDownload;