"use strict"
var express = require('express');
var app = express();
var mongodb = require('mongodb').MongoClient;
var MONGODB_URI = 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.DB_PORT+'/'+process.env.DB;
var db,coll,x;
var reg1 = /^www\.\w{1,}\.\w{1,}/i;
var reg2 = /^[0-9]{1,}$/;

mongodb.connect(MONGODB_URI,(err,database)=>{
  if(err) throw err;
  db = database;
  app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  console.log('shorten-url app listening');
})
});

app.use(express.static('client'));
app.route('/:id').get((req,res)=>{
  var id = parseInt(req.params.id);
  
  if(reg2.test(id)){
    var collection = db.collection('short_address');
    
      collection.findOne({_id:id},{fields:{url:1}}).then((doc)=>{
      
      res.redirect('https://'+ doc.url)
    })
    }
  else{
    res.send("can not find the short url")
  }})

app.route('/new/:addr').get((req,res)=>{
  var addr = req.params.addr;
  if (reg1.test(addr)){  
      var collAdd = db.collection('short_address');
      var counters = db.collection('counters')
      counters.findOneAndUpdate(
      {_id: 'productid' },
      {$inc:{sequence_value:1}},
     {returnOriginal:false}
   ).then((r)=>{
     collAdd.insertOne({_id:r.value.sequence_value,url:addr},(err,r)=>{
        if(err) throw err;
        res.send(JSON.stringify({
          "original_url":addr,
          "new_url":'https://shorten-url.glitch.me/'+ r.ops[0]._id
        }));       
      })
          })
      }
  else {
    res.end(JSON.stringify({
      "original_url":null,
      "new_url":null
    }))
  }
})

