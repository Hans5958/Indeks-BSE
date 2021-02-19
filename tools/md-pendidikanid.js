const fs = require("fs-extra")
const path = require("path")

let dataLines = fs.readFileSync("./dataset/pendidikanid-filtered.txt", {
	encoding: "utf-8"
}).split("\r\n")

let data = []
let sort = ["2013/kelas_1sd", "2013/kelas_2sd", "2013/kelas_3sd", "2013/kelas_4sd", "2013/kelas_5sd", "2013/kelas_6sd", "2013/kelas_7smp", "2013/kelas_8smp", "2013/kelas_9smp", "2013/kelas_10sma", "2013/kelas_10smk", "2013/kelas_11sma", "2013/kelas_11smk", "2013/kelas_12sma", "2013/kelas_12smk", "ktsp/SD_1", "ktsp/SD_2", "ktsp/SD_3", "ktsp/SD_4", "ktsp/SD_5", "ktsp/SD_6", "ktsp/SMP_7", "ktsp/SMP_8", "ktsp/SMP_9", "ktsp/SMA_10", "ktsp/SMK_10", "ktsp/SMA_11", "ktsp/SMK_11", "ktsp/SMA_12", "ktsp/SMK_12", "bi", "komik"]

let toWrite = ""

dataLines.forEach(href => {

	let category, variation
	let bookPath = href.replace("https://bsd.pendidikan.id/data/", "").split("/")
	let bookTitle = path.basename(href).replace(".pdf", "").replace(/_/g, " ")

	if (bookPath[0] === "2013") category = `2013/${bookPath[1]}`
	else if (bookPath[0] === "bi") category = `bi`
	else if (bookPath[0] === "komik") category = `komik`
	else category = `ktsp/${bookPath[0]}`

	if (bookPath[2] === "guru") variation = "Guru"
	else if (bookPath[2] === "siswa") variation = "Siswa"
	else variation = null

	if (variation) bookTitle = bookTitle.replace(/( Siswa)|( Guru)/, "")

	if (!data[category]) data[category] = {}
	if (!data[category][bookTitle]) data[category][bookTitle] = {
		title: bookTitle,
		href,
		category
	}
	if (variation) {
		if (typeof data[category][bookTitle].href === "string") {
			data[category][bookTitle].href = {}
		}
		data[category][bookTitle].href[variation] = href
	}


})

sort.forEach(category => {
	toWrite += `\r\n##### ${category}\r\n\r\n| Judul | Pranala |\r\n| - | - |\r\n`
	Object.keys(data[category]).forEach(bookTitle => {
		let href = data[category][bookTitle].href
		if (typeof href === "object") toWrite += `| ${bookTitle} | ${Object.keys(href).map(variation => `[${variation}](${href[variation]})`).join(", ")} |\r\n`
		else toWrite += `| ${bookTitle} | [Pranala](${href}) |\r\n`
	})
})

fs.writeFileSync("./md/md-pendidikanid.md", toWrite)

