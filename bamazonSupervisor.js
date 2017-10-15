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
	    ["ID", "Deptment Name", "Over Head", "Product Sales", "Total Profit"]
	];

	config = {
	    border: getBorderCharacters("honeywell")
	};

	output = table(data, config);

	console.log(output);


}

function createDept() {

	// TBD

}









start();