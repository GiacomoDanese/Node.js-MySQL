var mysql = require("mysql");
var inquirer = require("inquirer");
// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  // Your username
  user: "root",
  // Your password
  database: "bamazon"
});
// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user

  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
      console.log("===============================");
      console.log("Available for Sale");
    
    for (var i = 0; i < results.length; i++) {
      console.log("\nId: " + results[i].item_id + "\nProduct: " + results[i].product_name + "\nDepartment: " + results[i].department_name + "\nPrice: $" + results[i].price + "\nStock: " + results[i].stock + " units");
    }

      start();

  })
});

function start () {
  inquirer.prompt([
  
    {
    name: "id",
    message: "Enter the id of the product you would like to purchase:",
    type: "input",
    validate: function(input) {
      if (input === "") {
        console.log("Invalid input");
        return false;
      } else {
        return true;
      }
    }
  },
    {
    
    
      name: "quantity",
      message: "How many units would you like to purchase?",
      type: "input",
      validate: function(input) {
        if (input === "") {
          console.log("invalid Input");
          return false;
        } else {
          return true;
        }
      }
    }
  
  ]).then(function(results) {
    var id = results.id;
    var quantity = results.quantity;

    connection.query("SELECT * FROM products WHERE item_id = ' " + id + " ' ", function(err, results) {
      if (err) throw err;

      console.log("ID: " + id + "\nBuying: " + quantity + " units");
      for (var i = 0; i < results.length; i++) {
        console.log(results[i].stock + " Units available");

        if (results[i].stock >= quantity) {
          var cart = results[i].stock - quantity;
          var cartTotal = results[i].price * quantity;

          connection.query("UPDATE products SET? WHERE? ", [ 
          {
            stock: cart
          },
          {
            item_id: id
          }],

          function(err) {
            if (err) throw err;
            console.log("Congratulations! Your Purchase was Completed.");
            console.log("Your total was " + "$" + cartTotal);
          }
          )
        } else {
          console.log("Only " + results[i].stock + " available. Please try again.");
          start ();
        };
        }
      }

     );
  });

}



