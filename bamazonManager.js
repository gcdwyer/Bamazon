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
});

function start() {

	inquirer.prompt([
		{
			name: "question",
			type: "list",
			message: "What would you like to do?",
			choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
	    }, 
	]).then(function (ans) {

		if (ans.question === "View Products for Sale") {

			viewProducts();

		} else if (ans.question === "View Low Inventory") {

			lowInventory();

		} else if (ans.question === "Add to Inventory") {

			addInventory();

		}

	});

}



function viewProducts() {

	connection.query("SELECT * FROM products", function(err, res) {

	    if (err) throw err;

	    for (var i = 0; i < res.length; i++) {

	    	console.log("id: " + res[i].id + " | Product: " + res[i].product_name + " | Price: $" + res[i].price + " | Quantity: " + res[i].stock_quantity);
	    	console.log("----------------------------------------------------");

	    }

	    inquireAgain();

	});

}


function lowInventory() {

	//"SELECT artist FROM top5000 GROUP BY artist HAVING count(*) > 1"

	connection.query("SELECT product_name, stock_quantity FROM products GROUP BY stock_quantity HAVING count(*) < 5", function(err, res) {

	    if (err) throw err;

	    console.log("===============================================+====");
	    console.log("LOW INVENTORY");
	    console.log("===============================================+====");

	    for (var i = 0; i < res.length; i++) {

	    	console.log("Product: " + res[i].product_name + " | Quantity: " + res[i].stock_quantity);
	    	console.log("----------------------------------------------------");

	    }

	    inquireAgain();

	});

}


function addInventory() {

	// TBD

}









function inquireAgain() {

    inquirer.prompt([
		{
			name: "manager",
			type: "confirm",
			message: "Would you like to do something else?",
        }, 
    ]).then(function (ans) {
    	if (ans.manager === true) {
    		start();
    	} else {
    		process.exit();
    	}
    });

}



start();