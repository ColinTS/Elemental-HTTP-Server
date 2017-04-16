/*jshint esversion: 6*/
const http = require('http');
const fs = require('fs');
const querystring = require('querystring');

const server = http.createServer((req, res) => {

  //GET Method
  if(req.method === 'GET'){
    if (req.url === '/'){
      fs.readFile(`./public/index.html`, (err, data) => {
        res.end(data);
      });
    }
    else {
      fs.readFile(`./public${req.url}`, (err, data) => {
        if(err){
          fs.readFile('./public/404.html', (err, data) => {
            res.end(data);
          });
        } else {
        res.end(data);
        }
      });
    }
  }

  //POST method
  if(req.method === 'POST'){
    req.on('data', (data) => {
      let elementObj = querystring.parse(data.toString());
      element = elementObj.elementName;
      elementSymbol = elementObj.elementSymbol;
      elementAtomic = elementObj.elementAtomicNumber;
      elementDescription = elementObj.elementDescription;

      let newElement = fs.createWriteStream(`./public/${element}.html`);
      newElement.write(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>The Elements - ${element}</title>
<link rel="stylesheet" href="/css/styles.css">
</head>
<body>
<h1>${element}</h1>
<h2>${elementSymbol}</h2>
<h3>Atomic number ${elementAtomic}</h3>
<p>${elementDescription}</p>
<p><a href="/">back</a></p>
</body>
</html>`);

      let indexRead = fs.readFileSync('./public/index.html', 'utf-8');
      let elementHTML = `<li>
<a href="/${element}.html">${element}</a>
</li>
<!-- new  -->`;
      let elementInsert = indexRead.replace(/(<!-- new  -->)/g, elementHTML);
      console.log(elementInsert);

      fs.writeFile('./public/index.html', elementInsert, 'utf-8', (err) => {
          console.log('new element added!');
      });

   res.end(data);

  });




  }


});

server.listen(3000, () => {
  console.log('server started on port 3000');
});