const fs = require("fs-extra")

let data = JSON.parse(fs.readFileSync("./dataset/data.json"))

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

dataPaired.forEach(book => {
	let regexResult = /^Buku (\w+)[-&#x2013; ]*(.+) ?/.exec(book.title)

	if (!dataPairedTidy[regexResult[2].toLowerCase()]) dataPairedTidy[regexResult[2].toLowerCase()] = {title: "", variations: {}}

	dataPairedTidy[regexResult[2].toLowerCase()].title = regexResult[2]
	dataPairedTidy[regexResult[2].toLowerCase()].variations[regexResult[1]] = { 
		...book
	}
})

toWrite += "| Judul | Pranala |\r\n| --- | --- |\r\n"
Object.values(dataPairedTidy).forEach(book => {
	// console.log(JSON.stringify(book))
	toWrite += `| ${book.title} | ${Object.keys(book.variations).map(variation => `[${variation}](${book.catalogHref}) [⬇️](${book.downloadHref})[📘](${book.fileHref})`).join(", ")} |\r\n`
})

toWrite += "\r\n| Judul | Pranala |\r\n| --- | --- |\r\n"
Object.values(dataNonPaired).forEach(book => {
	toWrite += `| ${book.title} | [Pranala](${book.catalogHref}) [⬇️](${book.downloadHref})[📘](${book.fileHref}) |\r\n`
})


fs.writeFileSync("./md/md.md", toWrite)

