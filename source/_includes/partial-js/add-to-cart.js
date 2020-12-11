// This adds a nice checkmark to the button, letting users know their action was successful
function animateActionButton(el) {
	let thisText = el.innerText;
	let thisWidth = el.offsetWidth;

	el.style.width = thisWidth + "px";
	el.innerText = "✔";
	el.disabled = true;

	setTimeout(function() {
		el.innerText = thisText;
		el.disabled = false;
		el.style.width = "";
	}, 2000);
}


// Save a product into the cart. The
if(document.querySelector(".add-to-cart-form") !== null) {
	document.querySelectorAll(".add-to-cart-form").forEach(function(el) {
		el.addEventListener("submit", function(e) {
			// Stop the form from refreshing
			e.preventDefault();

			// Get the cart from localstorage
			let cart = getCart();

			// Get the button element
			let button = this.querySelector("[data-sku]");

			// Get the number of products the user wanted
			let amount = parseInt(this.querySelector("input").value);

			// Get the SKU number from the product button
			let product = button.getAttribute("data-sku");

			// If the number was modified to be text or below 1, set to 1
			if(amount < 1 || isNaN(amount)) amount = 1;

			// Loop through the amount and add that many products to the cart
			for (let i = 0; i < amount; i++) {
				cart.push(product);
			}

			// Update the localstorage cart
			updateCart(cart);

			// Disable the button until the function has completed
			animateActionButton(button);
		});
	});
}
