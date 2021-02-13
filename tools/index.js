const axios = require("axios").default
const parseHTML = require("node-html-parser").parse
const chalk = require("chalk")
const fs = require("fs-extra")
const parseAttribute = require("html-attribute-parser")

let response, cards, document, nextPage = true, books = [], page = 0

;(async () => {

	while (nextPage === true) {

		response = await axios.get(`https://bse.belajar.kemdikbud.go.id/Content/Filter/Index/?start=${page}&sortOrder=&currentFilter=&searchString=&search=true`, {
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		})
	
		document = parseHTML(response.data)
		cards = document.querySelectorAll(".card-body .card-title a")
	
		// console.log(document.outerHTML)
		for (i in cards) {
			let card = cards[i]
			let attributes = parseAttribute(`<a ${card.rawAttrs}></a>`).attributes
			books.push({
				"title": attributes["ajax-title"],
				"href": attributes.href
			})
		}
	
		nextPage = (!!document.querySelector(".other-konten"))
		console.log(`${books.length} books indexed. On page ${page + 1}.`)
		page++

		if ((books.length % 100) === 0) {
			console.log(`Wrote checkpoint on \`page: ${page}\` (or page ${page+1}).`)
			fs.writeFileSync("./checkpoint.txt", JSON.stringify(books))
		}

	}

	console.log(`Final index count is ${books.length}.`)
	console.log(`Final page count is ${page + 1}.`)
	fs.writeFileSync("./dataset/data.txt", JSON.stringify(books))

})()
