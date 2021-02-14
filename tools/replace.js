const fs = require("fs-extra")

let md = fs.readFileSync("./md/md.md", {encoding: "utf-8"})
let data = JSON.parse(fs.readFileSync("./dataset/dataset/data-complete.json"))

data.forEach((book, i) => {
	console.log(md.length)
	md = md.replace(`(${book.catalogHref})`, `(${book.catalogHref}) [⬇️](${book.downloadHref})[📘](${book.fileHref})`)
})

fs.writeFileSync("./md/md-complete.md", md)

