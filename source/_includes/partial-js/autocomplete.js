// Fuse is a third party library used for fuzzy searching arrays of text
// https://fusejs.io/
// This function takes an array to search through, and a search parameter and returns a list of close matches
function fuseSearch(products, searchParameter) {
	let fuse =  new Fuse(products, {
		keys: ['name', 'description', 'sku'],
		threshold: 0.2
	});

	return fuse.search(searchParameter);
}


// This creates a popover styled as an autocomplete box. It is tied to the header search bar
function generateSearchBoxResults(content, target) {
	let popoverOptions = {
		html : true,
		placement: "bottom",
		title: "Testing...",
		trigger: 'focus',
		content: content,
		template: `
			<div class='popover search-results-popover w-100' role='tooltip'>
				<div class='popover-arrow'></div>
				<div class="popover-body list-group p-0"></div>
			</div>`
	};

	let popover = new bootstrap.Popover(target, popoverOptions);
	popover.show();
	return popover;
}


// Autocomplete function for the search bar
if(document.getElementById("header-search-bar") !== null) {
	let searchBar = document.getElementById("header-search-bar");

	// Set some default variables to be referenced later
	let searchBarTimer = null;
	let searchResults = null;

	searchBar.addEventListener("keyup", function() {
		// grab the search value immediately
		let searchValue = searchBar.value;

		// Only search if the length is 4 characters or more
		if(searchValue.length >= 4) {
			// The search runs on a timer. If the timer has not elapsed yet, clear it and start a new one
			if(typeof searchBarTimer === "number") clearTimeout(searchBarTimer);

			// Set a timeout so that it only queries the backend every 500 milliseconds
			searchBarTimer = setTimeout(function() {
				// Fetch the product JSON file
				fetch('/api/products.json')
					.then(function(response) {return response.json()})
					.then(function(products) {
						let autocompleteList = "";

						// Use the Fuze library fuzzy search to return a list of matching products
						let searchResponse = fuseSearch(products, searchValue);

						// If the list is empty, show the "no results" message
						if(searchResponse.length === 0) {
							autocompleteList = "<li class='list-group-item'>No Results Found</li>";
						} else {
							// Loop through the returned response and generate a dropdown list for the user
							searchResponse.forEach(function(product) {
								autocompleteList +=
									`<a href="/products${product.item.url}" class="list-group-item list-group-item-action">${product.item.name}</a>`;
							});
						}

						// Add these to the autocomplete popover
						searchResults = generateSearchBoxResults(autocompleteList, searchBar);
					});
			}, 500);
		} else {
			// Hide the autocomplete
			if(searchResults !== null) {
				// This is a bootstrap function that hides the popover
				searchResults.hide();
			}
		}
	});
}

