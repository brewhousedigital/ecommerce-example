// Search results page will show the full list of matched products to the user
if(document.getElementById("search-results") !== null) {
	let resultsContainer = document.getElementById("search-results");
	let searchParameterContainer = document.getElementById("search-parameter");

	// Grab the search parameters out of the URL
	let getURL = window.location.href;
	let urlObject = new URL(getURL);
	let searchParameter = urlObject.searchParams.get("search");

	// Look through the product JSON
	fetch('/api/products.json')
		.then(function(response) {return response.json()})
		.then(function(products) {
			let searchResultsHTML = "";

			// Do a fuzzy search on the product JSON with the user's search query
			let searchResponse = fuseSearch(products, searchParameter);

			// build your HTML template with the results
			if(searchResponse.length === 0) {
				searchResultsHTML = "No Results Found";
			} else {
				searchResponse.forEach(function(product) {
					searchResultsHTML
						+= `<p><a href="/products${product.item.url}" class="list-group-item list-group-item-action">${product.item.name}</a></p>`;
				});
			}

			// Output to the user
			resultsContainer.innerHTML = searchResultsHTML;
			searchParameterContainer.innerText = searchParameter;
		});
}
