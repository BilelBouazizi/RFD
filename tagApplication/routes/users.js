var express = require('express');
var router = express.Router();
var db= require('../connexion');

const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;

const port = new SerialPort('COM13',{ baudRate: 9600 });
const parser = new Readline();
port.pipe(parser);
var d1="";
parser.on('data',data1=> {
 
  if(d1.length <=12) {
    d1=d1+data1 ;
  }
  if(d1.length==12) {

  
    var sql1= "select * from user where(user.tag=?)" ;
    var c =d1 ;
    
    db.query(sql1,[d1.replace(/(\r\n|\n|\r)/gm,'')],function(err,resu){
      
    if(err) throw err ;
    if(resu[0]!=null){ 
      
      if(resu[0].etat==10) {
        port.write(";");
        var s1="select * from pointage where sortie is null and pointage.employeid=(SELECT id FROM user WHERE user.tag = ?)" ;
       db.query(s1,[resu[0].tag],function(ex,rx){
        if (ex) throw ex
        if(rx[0] != null) {
          console.log(rx);
          var sql2 ="UPDATE pointage  set sortie=CURRENT_TIMESTAMP WHERE sortie is null AND pointage.employeid = (SELECT id FROM user WHERE user.tag = ?)" ;
          db.query(sql2,[c.replace(/(\r\n|\n|\r)/gm,'')],function(err,re){
            if(err) throw err
            console.log(re) ;
            port.write("=");
     
        
            port.write(resu[0].nom+' '+resu[0].prenom+'\n');
          });
        
        }
        else {
            var sql3 = "insert into pointage(sortie,employeid) values (?,?)" ;
            db.query(sql3,[null,resu[0].id],function(er,rs){
              if(er) throw er
              console.log(rs);
              port.write("|");
              port.write(resu[0].nom+' '+resu[0].prenom+'\n');
            })
        }
     

       });
      }
      else if (resu[0].etat==20) {
        port.write(",");
      }   

     
      
    }
    else {d=d1 ;    port.write(",");
  }
    d1="";
  }

)
  }
});

router.get('/scantag',function(req,res,next){
 
    console.log("scanning...");
    port.write("A");
  
    if(d.length==12) {
      
        res.end(d);
  
      }
      else res.end("please scan a tag first !");
});
  
/* GET users listing. */
router.get('/', function(req, res, next) {
  
  db.query("SELECT * FROM USER", function(err,result,fields){
    if(err) throw err ;
   
    res.render('users',{'users':result});

  });

});



router.get('/update/:id/:tag',function(req,res,next){
var sql="update user set etat=? where id=?";

var state;
db.query("SELECT etat FROM user where id= ?",[req.params.id],function(error,datas){
  if(error) throw err;
  if(datas) {
    console.log(datas);
    state=datas[0].etat;
    if (state==10 ) state=20 ; else state=10;
    db.query(sql,[state,req.params.id],function(err,resu){
      if(err) throw err;
       if(resu.affectedRows) {
          console.log(resu.affectedRows);
          db.query("SELECT * FROM USER", function(err,result,fields){
            if(err) throw err ;
           
            
            res.render('users',{'users':result});
          });
        }
    });
  }
});



  /**/
});
router.get('/delete/:id',function(req,res,next){

  var sql11 = "delete from pointage where(employeid = ?)"
  db.query(sql11,[req.params.id],function(err,resu){

    var sql="delete from user where(user.id=?)";
    db.query(sql,[req.params.id],function(err,resu){
      if(err) throw err ;
      if(resu.affectedRows) {
        console.log(resu.affectedRows);
        db.query("SELECT * FROM USER", function(err,result,fields){
          if(err) throw err ;
         
          
          res.render('users',{'users':result});
        });
        
      }
      
    });
  

  });


})
router.post('/ajouter', function(req,res,next){

var sql1= "select * from user where(user.tag=?)" ;
db.query(sql1,[req.body.tag],function(err,resu){
if(err) throw err ;
if(resu[0]!=null){ 
  console.log(resu) ;
res.render('error')  ;
}
else {

  var sql = "INSERT INTO USER(nom,prenom,tag,etat) VALUES(?,?,?,?)";
db.query(sql,[req.body.nom,req.body.prenom,req.body.tag,req.body.etat],function(error,result){
if(error) throw error ;
console.log("ajout ok !");
});

db.query("SELECT * FROM USER", function(err,result,fields){
  if(err) throw err ;
 
  res.render('users',{'users':result});

});


}
}

);   
});

module.exports = router;
