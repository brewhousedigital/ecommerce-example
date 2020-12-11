if(document.querySelector("[data-document]") !== null) {
	document.querySelectorAll("[data-document]").forEach(function(el) {
		el.addEventListener("click", function() {
			let thisDocument = el.dataset.document;



			if(document.getElementById("load-document") !== null) {
				let documentCanvas = document.getElementById("load-document-canvas");

				// If absolute URL from the remote server is provided, configure the CORS header on that server.
				let url = thisDocument;

				// Loaded via <script> tag, create shortcut to access PDF.js exports.
				let pdfjsLib = window['pdfjs-dist/build/pdf'];

				// The workerSrc property shall be specified.
				pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

				// Asynchronous download of PDF
				let loadingTask = pdfjsLib.getDocument(url);
				loadingTask.promise.then(function(pdf) {
					// PDF loaded

					// Fetch the first page
					let pageNumber = 1;
					pdf.getPage(pageNumber).then(function(page) {
						// Page loaded

						let scale = 1.5;
						let viewport = page.getViewport({scale: scale});

						// Prepare canvas using PDF page dimensions
						let canvas = documentCanvas;
						let context = canvas.getContext('2d');
						canvas.height = viewport.height;
						canvas.width = viewport.width;

						// Render PDF page into canvas context
						let renderContext = {
							canvasContext: context,
							viewport: viewport
						};
						let renderTask = page.render(renderContext);
						renderTask.promise.then(function () {
							// Page rendered
							documentCanvas.classList.add("loaded", "shadow-lg");
							document.getElementById('load-document').scrollIntoView();
						});
					});
				}, function (reason) {
					// PDF loading error
					console.error(reason);
				});
			}
		});
	});
}

