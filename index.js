var fs = require("fs");
const http = require("http");
const url = require("url");
const slugify = require("slugify");
const replacetemplate = require("./module/replacetemplate");
//////////////////////////////////////////
////File System

/*
const textIn = fs.readFileSync('starter/txt/input.txt', 'utf-8')
console.log(textIn)

const textOut = 'Testing the Node file'
fs.writeFileSync('starter/txt/output.txt', textOut);
    
fs.readFile("starter/txt/start.txt", "utf-8", (err, data1) => {
  console.log(data1);
  fs.readFile("starter/txt/" + data1 + ".txt", "utf-8", (err, data2) => {
    console.log(data2);
    fs.readFile("starter/txt/append.txt", "utf-8", (err, data3) => {
      console.log(data3);
      fs.writeFile(
        "starter/txt/final.txt",
        "" + data2 + "/n" + data3,
        "utf-8",
        (err) => {
          console.log("file have been written");
        }
      );
    });
  });
});
console.log("waiting for file read");*/

//////////////////////////////////////////
//// Http

const data = fs.readFileSync("starter/dev-data/data.json", "utf-8");
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

const tempOverview = fs.readFileSync(
  "starter/templates/template-overview.html",
  "utf-8"
);
const tempProduct = fs.readFileSync(
  "starter/templates/template-product.html",
  "utf-8"
);
const tempCard = fs.readFileSync(
  "starter/templates/template-card.html",
  "utf-8"
);

const server = http.createServer((req, res) => {
  //console.log(req.url);
  //console.log(url.parse(req.url, true));

  const { query, pathname } = url.parse(req.url, true);

  // OVERVIEW PAGE

  if (pathname === "/overview" || pathname === "/") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const cardsHtml = dataObj
      .map((el) => replacetemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);
    res.end(output);
  }

  // PRODUCT PAGE
  if (pathname === "/product") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const product = dataObj[query.id];
    const output = replacetemplate(tempProduct, product);

    res.end(output);
  }

  if (pathname === "/about") {
    res.end("This is the About Page");
  }

  if (pathname === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    // res.end("<h2>Page not found</h2>");
  }
});

server.listen("8001", "127.0.0.1", () => {
  console.log("listening to request");
});
