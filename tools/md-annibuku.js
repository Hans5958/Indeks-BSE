const fs = require("fs-extra")

let data = JSON.parse(fs.readFileSync("./dataset/annibuku-complete.json"))

data.sort((a, b) => a.year - b.year)

data.sort((a, b) => {
	if (a.title < b.title) return -1
	if (a.title > b.title) return 1
	return 0
})

let groups = {}

data.forEach(book => {
	if (groups[book.class] === undefined) groups[book.class] = []
	groups[book.class].push(book)
})

let toWrite = ""

Object.keys(groups).forEach((groupName) => {
	let group = groups[groupName].sort((a, b) => a.year - b.year)
	toWrite += `## Kelas ${groupName}\r\n\r\n| Judul | Tahun Terbit | Pranala |\r\n| - | - | - |\r\n`
	group.forEach(book => {
		toWrite += `| ${book.title} | ${book.year} | [Pranala](${book.catalogHref}) [📘](${book.fileHref}) |\r\n`
	})
})

fs.writeFileSync("./md/md-annibuku.md", toWrite)

