var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var player_schema=new  Schema({
    title:{
        type:String,
        required:true,
    },content:{
        type:String,
        required:true
    },date_time:{
        type:Date
    },
},{
    collection:'review',
    timestamps:true
})
module.exports=mongoose.model('review',player_schema);

