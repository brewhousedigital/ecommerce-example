function fuseSearch(products, searchParameter) {
	let fuse =  new Fuse(products, {
		keys: ['name', 'description', 'sku'],
		threshold: 0.2
	});

	return fuse.search(searchParameter);
}

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
	let searchBarTimer = null;
	let searchResults = null;

	searchBar.addEventListener("keyup", function() {
		let searchValue = searchBar.value;

		if(searchValue.length > 3) {
			// Show the autocomplete
			if(typeof searchBarTimer === "number") clearTimeout(searchBarTimer);

			searchBarTimer = setTimeout(function() {
				fetch('/api/products.json')
					.then(function(response) {return response.json()})
					.then(function(products) {
						let autocompleteList = "";

						let searchResponse = fuseSearch(products, searchValue);

						if(searchResponse.length === 0) {
							autocompleteList = "<li class='list-group-item'>No Results Found</li>";
						} else {
							searchResponse.forEach(function(product) {
								autocompleteList += `<a href="/products${product.item.url}" class="list-group-item list-group-item-action">${product.item.name}</a>`;
							});
						}

						searchResults = generateSearchBoxResults(autocompleteList, searchBar);
					});
			}, 500);
		} else {
			// Hide the autocomplete
			if(searchResults !== null) {
				searchResults.hide();
			}
		}
	});
}

