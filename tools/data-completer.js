const axios = require("axios").default
const parseHTML = require("node-html-parser").parse
const fs = require("fs-extra")
const parseAttribute = require("html-attribute-parser")

let document, i2 = 0

;(async () => {

	let data = JSON.parse(fs.readFileSync("./dataset/data-early.json"))

	data.map(async (book, i) => {

		book.catalogId = /#!\/Content\/Home\/Details\/([\w\d]+)/.exec(book.href)[1]
		book.catalogHref = `https://bse.belajar.kemdikbud.go.id/${book.href}`

		let response = await axios.get(`https://bse.belajar.kemdikbud.go.id/Content/Home/Detailss/${book.catalogId}`, {
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		})

		document = parseHTML(response.data)
		let embed = document.querySelector("embed")
		let attributes = parseAttribute(`<a ${embed.rawAttrs}></a>`).attributes

		book.fileHref = attributes.src
		book.fileId = /pdf\/([\w\d]+)\.pdf/.exec(book.fileHref)[1]
		book.downloadHref = `https://rest-app.belajar.kemdikbud.go.id//Media/Download/${book.fileId}`

		i2++
		console.log(`Added information on ${book.title}. (${i2}/${data.length})`)

		if ((i % 100) === 0) {
			console.log(`Wrote checkpoint.`)
			fs.writeFileSync("./checkpoint-complete.json", JSON.stringify(data))
		}

		return book
	})

	setInterval(() => {
		if (i2 === data.length) {
			console.log("All done!")
			fs.writeFileSync("./dataset/data.json", JSON.stringify(data))
			process.exit()
		}
	}, 100)

})()