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

	console.log("got here");

	data = [
	    ["ID", "Deptment Name", "Over Head ($)", "Product Sales ($)", "Total Profit ($)"]
	];

	config = {
	    border: getBorderCharacters("honeywell"),
	};

	connection.query(

		"SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(products.product_sales) AS product_sales FROM departments LEFT JOIN products ON departments.department_name = products.department_name GROUP BY departments.department_name ORDER BY departments.department_id", function(err, res) {

		for (var i = 0; i < res.length; i++) {

			// console.log(res[i].department_id);
			// console.log(res[i].department_name);
			// console.log(res[i].over_head_costs);
			// console.log(res[i].product_sales);

			var totaLProfit = res[i].product_sales - res[i].over_head_costs;

			data.push(
				[
					res[i].department_id,
					res[i].department_name,
					res[i].over_head_costs,
					res[i].product_sales,
					totaLProfit
				]
			)

		}

		output = table(data, config);

		console.log(output);

	});




	


}

function createDept() {

	// TBD

}









start();