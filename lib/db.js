var mysql = require('mysql2');
var connection = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'',
	database:'biblio_app_libros'
});
connection.connect(function(error){
	if(!!error) {
		console.log(error);
	} else {
		console.log('Connected..!');
	}
});

module.exports = connection;