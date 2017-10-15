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

		} else if (ans.question === "Add New Product") {

			addProduct();

		} else {

			console.log("You did something wrong");

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

	    console.log("====================================================");
	    console.log("                  LOW INVENTORY");
	    console.log("====================================================");

	    for (var i = 0; i < res.length; i++) {

	    	console.log("Product: " + res[i].product_name + " | Quantity: " + res[i].stock_quantity);
	    	console.log("----------------------------------------------------");
	    }

	    inquireAgain();
	});
}

function addInventory() {
	// display currenttable
	connection.query("SELECT * FROM products", function(err, res) {

	    if (err) throw err;

	    for (var i = 0; i < res.length; i++) {
	    	console.log("id: " + res[i].id + " | Product: " + res[i].product_name + " | Quantity: " + res[i].stock_quantity);
	    	console.log("----------------------------------------------------");
	    }

		inquirer.prompt([
	        {
		        name: "item",
		        type: "input",
		        message: "Which item would you like to add inventory"
	        },
	        {
		        name: "add",
		        type: "input",
		        message: "How much inventory would you like to add?",
		        validate: function(value) {
		            if (isNaN(value) === false) {
		                return true;
		            } else {
		            	return false;
		            }
		        }
	        }
		])

	    .then(function(ans) {

	    	var newAmount;
			connection.query(
				// SELECT stock_quantity FROM products WHERE id = 1
				"SELECT stock_quantity FROM products WHERE ?", 
				{
					id: ans.item
				},
				function (err, res) {

				if (err) throw err;

				newAmount = res[0].stock_quantity + parseInt(ans.add);
				// UPDATE products SET stock_quantity = 15 WHERE id = 10
		    	connection.query("UPDATE products SET ? WHERE ?", 
		    		[
		    			{
		    				stock_quantity: newAmount
		    			},
		    			{
		    				id: ans.item
		    			}
		    		],
		    		function(err) {

		    			if (err) throw err;

		    			console.log("====================================================");
		    			console.log("                  STOCK ADDED");
		    			console.log("====================================================");
						connection.query("SELECT * FROM products", function(err, res) {

						    if (err) throw err;

						    for (var i = 0; i < res.length; i++) {
						    	console.log("id: " + res[i].id + " | Product: " + res[i].product_name + " | Quantity: " + res[i].stock_quantity);
						    	console.log("----------------------------------------------------");
						    }
						    inquireAgain();
						});
		    		}
		    	);
			});
	    });
	});
}


function addProduct() {

	inquirer.prompt([
        {
	        name: "newItem",
	        type: "input",
	        message: "What is the name of the product?",
	        validate: function(value) {
	        	if (value === "") {
	        		return false;
	        	}
	        	return true;
	        }
        },
        {
	        name: "newItemDepart",
	        type: "input",
	        message: "Which department does the prduct belong to?"
        },
        {
	        name: "newItemPrice",
	        type: "input",
	        message: "What is the price of the product?",
	        validate: function(value) {
	            if (isNaN(value) === false) {
	                return true;
	            } 
	            return false;
	        }
        },
        {
	        name: "newItemStock",
	        type: "input",
	        message: "How many are in stock?",
	        validate: function(value) {
	            if (isNaN(value) === false) {
	                return true;
	            } 
	            return false;
	        }
        }
	])
	.then(function(ans) {

		connection.query(

	        "INSERT INTO products SET ?",

	        {
	            product_name: ans.newItem,
	            department_name: ans.newItemDepart,
	            price: ans.newItemPrice,
	            stock_quantity: ans.newItemStock
	        },

	        function(err) {

	            if (err) throw err;

    			console.log("====================================================");
    			console.log("                 PRODUCT ADDED");
    			console.log("====================================================");
    			inquireAgain();
	        }
	    );
	});
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