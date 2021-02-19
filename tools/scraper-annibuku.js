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
				$("#masonryContainer a").each((i, el) => {
					var href = (new URL(el.attribs.href, res.request.href)).href
					if (hrefs.includes(href)) return
					console.log(href)
					hrefs.push(href)
					i1 += 1
				});
				fs.writeFileSync("./dataset/test.txt", hrefs.join("\n"))
				console.log(i1)
			} catch (e) {
				console.error(e)
			}
        }
        done();
    }
});

let hrefs = []

for (var i = 1; i < 173; i++) { //173
	c.queue(`https://annibuku.com/bse?page=${i}`)
}
