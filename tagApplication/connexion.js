var mysql= require('mysql');
var con = mysql.createConnection({
host: 'localhost',
user :'root' ,
password :'',
database:'iot' 
});

con.connect(function(err){

    if(err) throw err ;
    console.log('connexion mysql ok !');
});
module.exports = con ;
