var crawler = require("crawler")
var { URL } = require("url")
var fs = require("fs-extra")

let i1 = 0

var c = new crawler({
    maxConnections: 10,

	callback: function (error, res, done) {
        if (error) {
            console.log(error);
        } else {
			try {
            	var $ = res.$;
				books.push({
					id: bookHrefs.indexOf(res.request.href),
					title: $("h1").text(),
					coverImg: $(".detail-cover")[0].attribs.src,
					class: $("tr:nth-child(1) > td:nth-child(2)").text(),
					year: $("tr:nth-child(4) > td:nth-child(2)").text(),
					catalogHref: res.request.href,
					downloadHref: $("#downloadButton")[0].attribs["data-file"]
				})
				i1 += 1
				fs.writeFileSync("./dataset/annibuku-complete.json", JSON.stringify(books))
				console.log(i1, res.request.href)
			} catch (e) {
				console.error(e)
			}
        }
        done();
    }
});

let books = [], bookHrefs = fs.readFileSync("dataset/annibuku.txt", "utf-8").split("\n")

c.queue(bookHrefs)
