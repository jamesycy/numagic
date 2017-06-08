var express = require('express');
var app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/static'));

app.get('/', function(req ,res) {
    res.render('index');
});

app.listen(process.env.PORT || 4000);
