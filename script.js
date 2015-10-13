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
		itemObj.lineCost.push(parseInt(tempItemObj.cost) * parseInt(tempItemObj.quantity));
		draw(itemObj);
	} else if (itemObj.redraw > -1) {
		// remove duplicate line then draw
		draw(itemObj);
	} else {
		return;
	}
	calcTotal(itemObj);
}
//error checking
var validate = function(tempItemObj) {
	//check for current code value in existing itemObj code array
	var duplicate = itemObj.code.indexOf(tempItemObj.code);
	try {
		if (tempItemObj.code === "" || tempItemObj.name === "" || tempItemObj.cost === "" || tempItemObj.quantity === "") {
			throw "Error1";
		} else if (tempItemObj.cost < 0 || tempItemObj.quantity < 0) {
			throw "Error2";
		} else if (duplicate !== -1) {
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
			if (!continueAdd){
				return false;
			} else {
				itemObj.quantity[duplicate] = parseInt(tempItemObj.quantity) + parseInt(itemObj.quantity[duplicate]); 
				itemObj.lineCost[duplicate] = parseInt(itemObj.quantity[duplicate]) * parseInt(itemObj.cost[duplicate]);
				itemObj.redraw = duplicate;
				return false;
			}
		}
	} 
	return true;
}

// draw the table
var draw = function(itemObj) {
	var table = document.getElementById("orderTable");
	// loop to prevent repeated table entries
	while(table.rows.length > 1) {
  		table.deleteRow(1);
	}

	for (var row = 0; row < itemObj.code.length; row++) {
		// insertRow value of -1 inserts new line item in last position
		var newRow = table.insertRow(-1);
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
					pos.innerHTML = itemObj.cost[row];
					break;
				case 3: 
					pos.innerHTML = itemObj.quantity[row];
					break;
				case 4: 
					pos.innerHTML = "$" + itemObj.lineCost[row];
					break;
				case 5:
					pos.innerHTML = "<input type='checkbox' onclick='deleteRow(this)'>remove</input>";
			}	
		}
	}
}

// function to calculate subtotal, tax, and total for invoice
function calcTotal(itemObj) {
	var sum = 0;
	for (var p = 0; p < itemObj.code.length; p++) {
		sum += parseInt(itemObj.lineCost[p]);
	}
	var subTotal = document.getElementById("subTotal");
	subTotal.value = "$" + sum;
	// calc 6.25% sales tax for line cost total and put in tax box
	var tax = document.getElementById("tax");
	var taxAmnt = sum * 0.0625;
	tax.value = "$" + taxAmnt.toFixed(2);
	// calc total based on subtotal + tax and put in total box
	var total = document.getElementById("total");
	total.value = "$" + (sum + taxAmnt).toFixed(2);
}

// function to remove an entry
function deleteRow(self) {
	var row = self.parentNode.parentNode;
	row.parentNode.removeChild(row);
	var removed = row.rowIndex;
	itemObj.code.splice(removed, 1);
	itemObj.name.splice(removed, 1);
	itemObj.cost.splice(removed, 1);
	itemObj.quantity.splice(removed, 1);
	itemObj.lineCost.splice(removed, 1);
	console.log(itemObj);
	calcTotal(itemObj);
}