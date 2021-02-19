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
				$("[href]").each((i, el) => {
					var href = (new URL(el.attribs.href, res.request.href)).href
					if (!href.startsWith("https://bsd.pendidikan.id/data") || hrefs.includes(href)) return
					console.log(href)
					hrefs.push(href)
					i1 += 1
					if (/https?:\/\/.+\.(\w{2,4})$/.exec(href) !== null && !href.endsWith(".php") && !href.endsWith(".html") && !href.endsWith(".htm")) return
					c.queue(href)
				});
				$("[src]").each((i, el) => {
					var href = (new URL(el.attribs.href, res.request.href)).href
					if (!href.startsWith(res.request.href) || hrefs.includes(href)) return
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

c.queue({
    uri: 'https://bsd.pendidikan.id/data',
});

