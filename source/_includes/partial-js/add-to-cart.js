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

if(document.querySelector(".add-to-cart-form") !== null) {
	document.querySelectorAll(".add-to-cart-form").forEach(function(el) {
		el.addEventListener("submit", function(e) {
			e.preventDefault();

			// If cart is not created on user's localstorage, create one
			createCart();

			// Get the cart from localstorage
			let cart = getCart();

			// Get the button
			let button = this.querySelector("[data-sku]");

			// Add the product to cart
			let amount = parseInt(this.querySelector("input").value);
			let product = button.dataset.sku;

			if(amount < 1 || isNaN(amount)) amount = 1;

			for (let i = 0; i < amount; i++) {
				cart.push(product);
			}

			// Update the localstorage cart
			updateCart(cart);

			// Animate the button
			animateActionButton(button);
		});
	});
}
