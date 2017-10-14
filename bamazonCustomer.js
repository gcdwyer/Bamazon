var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 8889,
  user: "root",
  password: "root",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  console.log("db connected");
  readProducts();
});

function readProducts() {
	console.log("Selecting all products...\n");

	connection.query("SELECT * FROM products", function(err, res) {

	    if (err) throw err;

	    for (var i = 0; i < res.length; i++) {

	    	console.log("id: " + res[i].id + " | Product: " + res[i].product_name + " | Price: $" + res[i].price);

	    	console.log("----------------------------------------------------");

	    }

	    buyProduct();

	    connection.end();
    });

}


function buyProduct() {

	// console.log("buy product");

	inquirer.prompt([
		{
			name: "idBuy",
			type: "input",
			message: "Which ID would you like to buy?",
			validate: function(value) {
				if (isNaN(value) === false && value.length != 0) {
					return true;
				} else {
					return false;
				}
            }
        },
		{
			name: "quantity",
			type: "input",
			message: "How many would you like to buy?",
			validate: function(value) {
				if (isNaN(value) === false && value.length != 0) {
					return true;
				} else {
					return false;
				}
            }
        },
	]).then(function (ans) {

		console.log("inside inquire promise");

		connection.query(

			"SELECT ? FROM products",

			{
				id: ans.idBuy
			}, 

		function(err, res) {
		
		    console.log("got here");

    });


	});

}