const fs = require("fs-extra")

let data = JSON.parse(fs.readFileSync("./dataset/dataset/data.json"))

data.sort((a, b) => {
	if (a.title < b.title) return -1
	if (a.title > b.title) return 1
	return 0
})

let toWrite = ""

let dataNonPaired = []

let dataPaired = data.filter(book => {
	if (/^Buku (\w+)[-&#x2013; ]*(.+) ?/.exec(book.title) !== null) return true
	else {
		dataNonPaired.push(book)
		return false
	}
})

let dataPairedTidy = {}

dataPaired = dataPaired.map(book => {
	let regexResult = /^Buku (\w+)[-&#x2013; ]*(.+) ?/.exec(book.title)

	if (!dataPairedTidy[regexResult[2].toLowerCase()]) dataPairedTidy[regexResult[2].toLowerCase()] = {title: "", variations: {}}

	dataPairedTidy[regexResult[2].toLowerCase()].title = regexResult[2]
	dataPairedTidy[regexResult[2].toLowerCase()].variations[regexResult[1]] = { 
		title: book.title,
		href: book.href
	}

	return {
		...book,
		pairMetadata: {
			target: regexResult[1],
			title: regexResult[2],
			href: book.href
		}
	}
})

toWrite += "| Judul | Pranala |\r\n| --- | --- |\r\n"
Object.values(dataPairedTidy).forEach(book => {
	// console.log(JSON.stringify(book))
	toWrite += `| ${book.title} | ${Object.keys(book.variations).map(variation => `[${variation}](https://bse.belajar.kemdikbud.go.id/${book.variations[variation].href})`).join(", ")} |\r\n`
})

toWrite += "\r\n| Judul | Pranala |\r\n| --- | --- |\r\n"
Object.values(dataNonPaired).forEach(book => {
	toWrite += `| ${book.title} | [Pranala](https://bse.belajar.kemdikbud.go.id/${book.href}) |\r\n`
})


fs.writeFileSync("./md.md", toWrite)

