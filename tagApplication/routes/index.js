var express = require('express');
var router = express.Router();
var db= require('../connexion');
var moment = require('moment');
/* GET home page. */
router.get('/', function(req, res, next) {
var lst ;
  db.query("select nom,prenom,entree,sortie from pointage join user on(pointage.employeid=user.id)", function(err,resu){
    if(err) throw err
    lst = resu;
    res.render('index', { title: 'Historique', pointage:resu,moment:moment});
   
  })
  
});


module.exports = router;
