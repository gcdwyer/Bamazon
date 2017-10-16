var mysql = require("mysql");
var inquirer = require("inquirer");
var {table, getBorderCharacters} = require("table");

let config, output, data;

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
			choices: ["View Product Sales by Department", "Create New Department"]
	    }, 
	]).then(function (ans) {

		if (ans.question === "View Product Sales by Department") {
			viewDept();
		} else if (ans.question === "Create New Department") {
			createDept();
		} else {
			console.log("You did something wrong");
		}
	});
}

function viewDept() {

	data = [
	    ["ID", "Deptment Name", "Over Head ($)", "Product Sales ($)", "Total Profit ($)"]
	];

	config = {
	    border: getBorderCharacters("honeywell"),
	};

	connection.query(

		"SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(products.product_sales) AS product_sales FROM departments LEFT JOIN products ON departments.department_name = products.department_name GROUP BY departments.department_name ORDER BY departments.department_id", function(err, res) {

		for (var i = 0; i < res.length; i++) {

			var totalProfit = res[i].product_sales - res[i].over_head_costs;

			data.push(
				[
					res[i].department_id,
					res[i].department_name,
					res[i].over_head_costs,
					res[i].product_sales,
					totalProfit
				]
			)
		}

		output = table(data, config);
		console.log(output);
	});

	// cant figure out how to push totalProfit back into DB =============================================
	// connection.query(

	// 	"UPDATE departments SET", function(err, res) {

	// });

}

function createDept() {

	inquirer.prompt([
		{
			name: "whatDept",
			type: "input",
			message: "What department would you like to add?"
	    }, 
	    {
			name: "deptOver",
			type: "input",
			message: "What is the department's over head cost?"
	    }

	]).then(function (ans) {

		connection.query("INSERT INTO departments SET ?", 
		{
			department_name: ans.whatDept,
			over_head_costs: ans.deptOver
		},

		function(err, res) {

		    if (err) throw err;

	        console.log("====================================================");
			console.log("               DEPARTMENT ADDED");
			console.log("====================================================");
		    restart();
		});
	});
}

function restart() {

    inquirer.prompt([
		{
			name: "again",
			type: "confirm",
			message: "Would you like to start over?",
        }, 
    ]).then(function (ans) {
    	if (ans.again === true) {
    		readProducts();
    	} else {
    		process.exit();
    	}
    });	

}


start();