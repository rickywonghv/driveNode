/**
 * Created by damon on 6/20/16.
 */
var mongoose=require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');
var autopopulate=require('mongoose-autopopulate');
var db = mongoose.connection;

var fs=require("fs");
var config = fs.readFileSync("config/config.json");
var json = JSON.parse(config);
var connect=json.connections;
var dbport=json.dbport;
var dbname=json.dbname;
mongoose.connect("mongodb://"+connect+":"+dbport+"/"+dbname);

db.on('error', console.error.bind(console,'connection error:'));
db.once('open', function (callback) {
    console.log("DB Connected!");
});
var Schema=mongoose.Schema;
var user=new Schema({
    username:{type:String,unique:true,required: true},
    password:{type:String,required: true},
    email:{type:String,unique: true,required: true,uniqueCaseInsensitive: true},
    name:{type:String,required: true},
    createDT:{type:Number},
    updateDT:{type:Number},
    admin:{type:Boolean,required: true},
    space:{type:Number,require:true}
});
var dir=new Schema({
   name:{type:String,unique:true},
   parent:{type:String,ref:"dir"},
   share:{type:Boolean},
   owner:{type:String,ref:"user"}
});
var file=new Schema({
    key:{type:String},
    meta:{type:Object},
    parent:{type:String,ref:"dir"},
    share:{type:Boolean},
    owner:{type:String,ref:"user"}
});

user.plugin(uniqueValidator, { message: 'Sorry, {PATH} : {VALUE} is used already, please enter another and submit again!' });
dir.plugin(uniqueValidator, { message: 'Sorry, {PATH} : {VALUE} is used already.' });
file.plugin(uniqueValidator, { message: 'Sorry, {PATH} : {VALUE} is used already.' });

module.exports=mongoose.model("user",user);
module.exports=mongoose.model("file",file);
module.exports=mongoose.model("dir",dir);