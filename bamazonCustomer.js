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

	    	console.log("id: " + res[i].id + " | " + res[i].product_name + " | Price: $" + res[i].price);

	    	console.log("----------------------------------------------------");

	    }

	    buyProduct();

	    // connection.end();
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
				if (isNaN(value) === false && value.length != 0 && value != 0) {
					return true;
				} else {
					return false;
				}
            }
        },
		{
			name: "quantity",
			type: "input",
			message: "How many?",
			validate: function(value) {
				if (isNaN(value) === false && value.length != 0 && value != 0) {
					return true;
				} else {
					return false;
				}
            }
        },
	]).then(function (ans) {

		connection.query(

			"SELECT * FROM products WHERE ?",

			{
				id: ans.idBuy
			}, 

		function(err, res) {
		
		    var prod = res[0];

		    // console.log(prod.product_name + " | qty: " + prod.stock_quantity);

		    if (prod.stock_quantity < ans.quantity) {

		    	console.log("----------------------------------------------------");
		    	console.log("Insufficient quantity!");
		    	console.log("----------------------------------------------------");

		    	buyProduct();

		    } else {

		    	var total = ans.quantity * prod.price;

		    	console.log("----------------------------------------------------");
		    	console.log("Your total is: $" + total);
		    	console.log("----------------------------------------------------");

		    	// subtract ans.quantity from DB
				var query = connection.query(

					//UPDATE products SET stock_quantity = 49 WHERE id = 3
					"UPDATE products SET ? WHERE ?",
						[
							{
							    stock_quantity: prod.stock_quantity - ans.quantity
							},
							{
							    id: ans.idBuy
							}
						],

				function(err, res) {

					    // console.log(res.affectedRows + " products updated!\n");

					    // inquire would you like to buy something else?
					    inquirer.prompt([

							{
								name: "buyAgain",
								type: "confirm",
								message: "Would you like to buy another item?",
					        }, 

					    ]).then(function (ans) {

					    	if (ans.buyAgain === true) {

					    		readProducts();

					    	} else {

					    		process.exit();

					    	}

					    });

					}

				);

		    }

    	});

	});

}