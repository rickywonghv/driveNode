/**
 * Created by damon on 6/24/16.
 */
var express = require('express');
var DB=require("./db.js");
var Auth=require("./auth.js");
var fs=require("fs");
var Encrypt=require("./encrypt.js");

var FileList=function(token,dir,next){
    Auth.ckTk(token,function(data){
        if(data.success){
            DB.FindAll({owner:data.decoded.id,parent:dir},"file",function(result){
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
    var decryptDir="./files/decrypt/";
    fileOwner(req.param("token"),req.param("fileId"),function(data){
        if(data.success){
            Encrypt.de(data.data.meta.filename,data.data.key,function(re){
                if(re.success){
                    res.setHeader('Content-Type', data.data.meta.mimetype);
                    res.download(decryptDir+data.data.meta.filename, data.data.meta.originalname,function(){
                        fs.unlinkSync(decryptDir+data.data.meta.filename);
                    });
                }
            });
        }else{
            res.set('Content-Type','application/json');
            res.status(data.status).json({success:false,error:data.error});
        }
    })
};

var FileDelete=function(token,fileId,next){
    fileOwner(token,fileId,function(res){
        if(res.success){
            var decryptDir="./files/encrypt/";
            var filepath=decryptDir+res.data.meta.filename;
            DB.Remove({_id:fileId},"file",function(data){
                if(data.success){
                    fs.unlinkSync(filepath);
                    return next({success:true,status:204});
                }else{
                    return next({success:false,error:data.error,status:401});
                }
            })
        }else{
            return next({success:false,error:"dsvs",status:401});
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
                        return next({success:true,data:filedata.data,status:200});
                    }
                }else{
                    return next({success:false,error:"No Permission",status:401});
                }
            })
        }else{
            return next({success:false,error:"No Permission",status:401});
        }
    });
}

module.exports.FileList=FileList;
module.exports.FileDownload=FileDownload;
module.exports.FileDelete=FileDelete;