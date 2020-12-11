if(document.getElementById("search-results") !== null) {
	let resultsContainer = document.getElementById("search-results");
	let searchParameterContainer = document.getElementById("search-parameter");

	let getURL = window.location.href;
	let urlObject = new URL(getURL);
	let searchParameter = urlObject.searchParams.get("search");

	fetch('/api/products.json')
		.then(function(response) {return response.json()})
		.then(function(products) {
			let searchResultsHTML = "";

			let searchResponse = fuseSearch(products, searchParameter);

			if(searchResponse.length === 0) {
				searchResultsHTML = "No Results Found";
			} else {
				searchResponse.forEach(function(product) {
					searchResultsHTML += `<p><a href="/products${product.item.url}" class="list-group-item list-group-item-action">${product.item.name}</a></p>`;
				});
			}

			resultsContainer.innerHTML = searchResultsHTML;
			searchParameterContainer.innerText = searchParameter;
		});
}
