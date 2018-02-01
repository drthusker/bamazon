var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_db"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);

    listInventory();
});

//List the Inventory
function listInventory() {
    var query = "SELECT * FROM products";
    connection.query(query, function(err, data) {
        if (err) throw err;
        console.log("Selecting all products...\n");
        // var printOut = "";
        for (var i = 0; i < data.length; i++) {
            console.log("Item ID: " + data[i].item_id + " || Product name: " + data[i].product_name + " || Price: $" + data[i].price + " || No. in Stock: " + data[i].stock_quantity);
        };
        selectionPrompt();
    });
}


function selectionPrompt() {

    inquirer.prompt([{
            type: "input",
            name: "inputId",
            message: "Please enter the item id that you would like to purchase.",
        },
        {
            type: "input",
            name: "inputNumber",
            message: "How many would you like to purchase?",
        }
    ]).then(function(userPurchase) {

        //connect to database to find stock_quantity in database. If user quantity input is greater than stock, decline purchase.

        connection.query("SELECT * FROM products WHERE item_id=?", userPurchase.inputId, function(err, res) {
            for (var i = 0; i < res.length; i++) {

                if (userPurchase.inputNumber > res[i].stock_quantity) {
                    console.log("Sorry! Not enough in stock. Please try again later.");
                    listInventory();
                } else {
                    console.log("You've selected the following:");
                    console.log("");
                    console.log("Item: " + res[i].product_name);
                    console.log("Department: " + res[i].department);
                    console.log("Price: " + res[i].price);
                    console.log("Quantity: " + userPurchase.inputNumber);
                    console.log("----------------");
                    console.log("Total: " + res[i].price * userPurchase.inputNumber);

                    var newStock = (res[i].stock_quantity - userPurchase.inputNumber);
                    var purchaseId = (userPurchase.inputId);

                    updateStock(newStock, purchaseId);
                }
            }
        });
    });
}

function updateStock(newStock, purchaseId) {
    connection.query("UPDATE products SET ? WHERE ?", [{
        stock_quantity: newStock
    }, {
        item_id: purchaseId
    }], function(err, res) {});

    console.log("Transaction completed. Thank you.");

    purchaseAnother();
}

// Option to purchase another product
function purchaseAnother() {

    inquirer.prompt([{

        type: "confirm",
        name: "continue",
        message: "Would you like to purchase another item?",
        default: true

    }]).then(function(user) {
        if (user.continue === true) {
            listInventory();
        } else {
            console.log("Thank you for your purchase");
            connection.end();
        }
    });
}