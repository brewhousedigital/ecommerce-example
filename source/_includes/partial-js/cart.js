// Reusable strings
let emptyCartString = `<div>There are no items in your cart</div>`;


// Create a new cart empty for the user
function createCart() {
	if(localStorage.getItem("cart") === null) localStorage.setItem("cart", JSON.stringify([]));
}


// Get the localstorage cart and return it in JSON format
function getCart() {
	createCart();
	let data = JSON.parse(localStorage.getItem("cart"));
	return data.sort();
}


// Update the localstorage cart with new product data. Should be an array
function updateCart(data) {
	createCart();
	// Sort this alphabetically
	data.sort();
	localStorage.setItem("cart", JSON.stringify(data));
}


// Empty the user's cart
function deleteCart() {
	localStorage.setItem("cart", JSON.stringify([]));
	showEmptyCartMessage();
}


// Show an empty cart message
function showEmptyCartMessage() {
	if(document.getElementById("cart-page") !== null) {
		document.getElementById("cart-page").innerHTML = emptyCartString;
	}
}


// Remove an item from the user's cart
function deleteCartSpecificItem(item) {
	let cart = getCart();
	if(item !== undefined) cart.splice(cart.indexOf(item), 1);
	updateCart(cart);

	if(cart.length === 0) showEmptyCartMessage();
}


// Remove all of a specific item from the user's cart
function deleteCartSpecificItemAll(item) {
	let cart = getCart();
	if(item !== undefined) cart = cart.filter(function(product) {return product !== item});
	updateCart(cart);

	if(cart.length === 0) showEmptyCartMessage();
}


// Counts number of times a string shows up inside an array
function getStringOccurrence(array, value) {
	return array.filter((v) => (v === value)).length;
}


// When user clicks the cart button, generate an up-to-date list of their products
function updateCartDropdown() {
	// Get the cart from localstorage
	let cart = getCart();

	let html = "";

	if(cart.length > 0) {
		// Removes duplicate values
		let filterSingleItems = [...new Set(cart)];

		// Loop through to generate the HTML
		filterSingleItems.forEach(function(product) {
			let totalAmount = getStringOccurrence(cart, product);

			html += `
			<li class="dropdown-item d-flex justify-content-between">
				<span>${product}</span>
				<span>x${totalAmount}</span>
			</li>
			`;
		});

		// Add a divider and a cart button at the bottom
		html += `<li><hr class="dropdown-divider"></li>`;
		html += `<li class="text-center"><a class="btn btn-success" href="/cart/">View Your Cart</a></li>`;

	} else {
		html = `<li><a class="dropdown-item disabled" href="#" tabindex="-1" aria-disabled="true">There are no items in your cart</a></li>`;
	}

	// Insert the html into the cart dropdown
	document.getElementById("cart-dropdown").innerHTML = html;
}


// Whenever a user clicks on the cart, always update to the latest list
let cartDropdown = document.getElementById('cart-dropdown-btn');
cartDropdown.addEventListener('show.bs.dropdown', function () {
	updateCartDropdown();
});


// Create the Cart page
if(document.getElementById("cart-page") !== null) {
	let cartContainer = document.getElementById("cart-page");

	let cart = getCart();

	let html = "";

	// If there are products in the cart, generate the list for the user to see
	if(cart.length > 0) {
		// Retrieve product data
		fetch('/api/products.json')
			.then(function(response) {return response.json()})
			.then(function(allProducts) {
				// Removes duplicate values from user's cart
				let filterSingleItems = [...new Set(cart)];

				// Loop through each product and generate a row, while also mapping the product data to each item
				filterSingleItems.forEach(function(cartProduct) {
					let totalAmount = getStringOccurrence(cart, cartProduct);

					// These are the only three data points showing on the cart page. You can add more here
					let productInfo = {
						name: "",
						description: "",
						image: ""
					};

					// Loop through the product JSON and map the data points
					allProducts.forEach(function(eachProduct) {
						if(eachProduct.sku === cartProduct) {
							productInfo.name = eachProduct.name;
							productInfo.description = eachProduct.description;
							productInfo.image = eachProduct.image;
						}
					});

					// Build the HTML template
					html += `
					<div class="cart-product-row row align-items-center justify-content-between py-3 border-bottom">
						<div class="col-auto cart-page-item-image">
							<img src="${productInfo.image}" alt="${productInfo.name}" class="img-fluid">
						</div>

						<div class="col">
							<h2 class="h4">${productInfo.name}</h2>
							<p>SKU: ${cartProduct}</p>
							<p>x<span class="cart-product-row-total">${totalAmount}</span></p>
						</div>

						<div class="col-auto">
							<div><button type="button" class="btn btn-outline-danger btn-sm" data-delete-item="${cartProduct}">Delete One</button></div>
						</div>
						<div class="col-auto">
							<div><button type="button" class="btn btn-danger btn-sm" data-delete-all-items="${cartProduct}">Delete All</button></div>
						</div>
					</div>
					`;
				});

				// Build the cart container
				cartContainer.innerHTML = html;

				// Attach event listeners to newly generated content
				dynamicRemoveItemsFromCart();
			});
	} else {
		showEmptyCartMessage();
	}
}


// When user clicks on the "Delete Cart" button, clear everything out
if(document.querySelector("[data-deleteCart]") !== null) {
	document.querySelector("[data-deleteCart]").addEventListener("click", function() {
		deleteCart();
		animateActionButton(this);
	});
}


// When user clicks on "Delete Item" or "Delete All items", it will only delete that specific item from their cart
function dynamicRemoveItemsFromCart() {
	// Deletes a single item
	if(document.querySelector("[data-delete-item]") !== null) {
		document.querySelectorAll("[data-delete-item]").forEach(function(el) {
			el.addEventListener("click", function() {
				let sku = this.getAttribute("data-delete-item");
				deleteCartSpecificItem(sku);
				animateActionButton(this);

				// Reduce the quantity on screen so the user knows that the number has gone down
				let quantity = parseInt(this.closest(".cart-product-row").querySelector(".cart-product-row-total").innerText);
				quantity--;

				// If the quantity is less than 1, remove the row. Otherwise put the updated number back
				if(quantity > 0) {
					this.closest(".cart-product-row").querySelector(".cart-product-row-total").innerText = quantity;
				} else {
					this.closest(".cart-product-row").remove();
				}
			});
		});
	}

	// Deletes all items of the same type
	if(document.querySelector("[data-delete-all-items]") !== null) {
		document.querySelectorAll("[data-delete-all-items]").forEach(function(el) {
			el.addEventListener("click", function() {
				let sku = this.getAttribute("data-delete-all-items");
				deleteCartSpecificItemAll(sku);
				animateActionButton(this);
				this.closest(".cart-product-row").remove();
			});
		})
	}
}


// To be safe, create an empty cart on the user's localstorage
createCart();
