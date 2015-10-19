window.onload = function() {
	document.getElementById("item_add").onclick = item_add_click;
}

// initializing item object to store input values in arrays
var itemObj = {
	code: [],
	name: [],
	cost: [],
	quantity: [],
	lineCost: [],
	redraw: -1
};

// code that processes the form on click
function item_add_click() {	
	// temp object to store input until validation 
	var tempItemObj = {
		code: document.getElementById("item_code").value,
		name: document.getElementById("item_name").value,
		cost: document.getElementById("item_cost").value,
		quantity: document.getElementById("item_quantity").value 
	}
	// if validation passes, push objects from temp obj to itemObj
	if (validate(tempItemObj)) {
		itemObj.code.push(tempItemObj.code);
		itemObj.name.push(tempItemObj.name);
		itemObj.cost.push(tempItemObj.cost);
		itemObj.quantity.push(tempItemObj.quantity);
		itemObj.lineCost.push(parseFloat(tempItemObj.cost) * parseInt(tempItemObj.quantity)).toFixed(2);
		draw(itemObj);
	} else if (itemObj.redraw > -1) {  // validation for duplicate entries sets redraw to location of duplicate which is always > -1
		draw(itemObj);
	} else {    // if validation fails, exit
		return;
	}
	// calculate subtotal, tax, and total based on line items
	calcTotal(itemObj);
}

//error checking
var validate = function(tempItemObj) {
	//check for current code value in existing itemObj code array
	var duplicate = itemObj.code.indexOf(tempItemObj.code);
	try {
		if (tempItemObj.code === "" || tempItemObj.name === "" || tempItemObj.cost === "" || tempItemObj.quantity === "") { // empty values not accepted
			throw "Error1";
		} else if (tempItemObj.cost < 0 || tempItemObj.quantity < 0) { // negative values not accepted
			throw "Error2";
		} else if (duplicate !== -1) { // duplicates flagged
			throw "Error3";
		} 
	}
	catch(err) { 
		if (err === "Error1") {
			alert("Error: You must enter a value for each field.");
			return false;
		} if (err === "Error2") {
			alert("Error: You must enter a positive number for both item cost and quantity.");
			return false;
		} if (err === "Error3") {
			var continueAdd = confirm("You have entered a duplicate item code. Click okay to add quantity to current line item, or cancel to return to the form.");
			if (!continueAdd){ // do not add item if user clicks cancel
				return false;
			} else { // otherwise add current quantity to existing line item with duplicate code and recalculate line cost with new quantity
				itemObj.quantity[duplicate] = parseInt(tempItemObj.quantity) + parseInt(itemObj.quantity[duplicate]); 
				itemObj.lineCost[duplicate] = parseInt(itemObj.quantity[duplicate]) * parseFloat(itemObj.cost[duplicate]);
				itemObj.redraw = duplicate;
				return false;
			}
		}
	} 
	return true;
}

// draw the invoice table
var draw = function(itemObj) {
	var table = document.getElementById("orderTable");
	// loop to reset the table before drawing the updated table to prevent duplicate table entries each time user clicks Add Item
	while(table.rows.length > 1) {
  		table.deleteRow(1);
	}
	// create a new row for each item added
	for (var row = 0; row < itemObj.code.length; row++) {
		// insertRow value of -1 inserts new line item in last position
		var newRow = table.insertRow(-1);
		// create cells and populate with invoice values
		for (var c=0; c < 6; c++) {
			var pos = "cell" + (c + 1);
			var pos = newRow.insertCell([c]);
			switch(c) {
				case 0: 
					pos.innerHTML = itemObj.code[row];
					break;
				case 1: 
					pos.innerHTML = itemObj.name[row];
					break;
				case 2: 
					pos.innerHTML = "$" + itemObj.cost[row];
					break;
				case 3: 
					pos.innerHTML = itemObj.quantity[row];
					break;
				case 4: 
					pos.innerHTML = "$" + itemObj.lineCost[row].toFixed(2);
					break;
				case 5:
					pos.innerHTML = "<button type='button' onclick='deleteRow(this)'>remove</button>";
			}	
		}
	}
}

// function to calculate subtotal, tax, and total for invoice
function calcTotal(itemObj) {
	var sum = 0;
	for (var p = 0; p < itemObj.code.length; p++) {
		sum += parseFloat(itemObj.lineCost[p]);
	}
	var subTotal = document.getElementById("subTotal");
	subTotal.value = "$" + sum.toFixed(2);
	// calc 6.25% sales tax for line cost total and put in tax box
	var tax = document.getElementById("tax");
	var taxAmnt = sum * 0.05;
	tax.value = "$" + taxAmnt.toFixed(2);
	// calc total based on subtotal + tax and put in total box
	var total = document.getElementById("total");
	total.value = "$" + (sum + taxAmnt).toFixed(2);
}

// function to remove an entry
function deleteRow(self) {
	var row = self.parentNode.parentNode; 
	var removed = row.rowIndex - 1;
	row.parentNode.removeChild(row);
	itemObj.code.splice(removed, 1);
	itemObj.name.splice(removed, 1);
	itemObj.cost.splice(removed, 1);
	itemObj.quantity.splice(removed, 1);
	itemObj.lineCost.splice(removed, 1);
	calcTotal(itemObj);
}