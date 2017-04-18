/*jshint esversion: 6*/
let number = 2;
const http = require('http');
const fs = require('fs');
const querystring = require('querystring');

const server = http.createServer((req, res) => {

  //GET method
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
      ++number;
      let elementInsert = indexRead.replace(/(<!-- new  -->)/g, elementHTML);
      elementInsert = elementInsert.replace(/(<h3>There are [^A-Z])/g, `<h3>There are ${number}`);

      fs.writeFile('./public/index.html', elementInsert, 'utf-8', (err) => {
          console.log('new element added!');
      });

   res.end(data);

  });

  }

  //PUT method
  if(req.method === 'PUT'){
    req.on('data', (data) => {
      let elementObj = querystring.parse(data.toString());
      element = elementObj.elementName;
      elementSymbol = elementObj.elementSymbol;
      elementAtomic = elementObj.elementAtomicNumber;
      elementDescription = elementObj.elementDescription;

      let newElement = `<!DOCTYPE html>
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
</html>`;

      let elementRead = fs.readFileSync(`./public${req.url}`, 'utf-8');

      fs.writeFile(`./public${req.url}`, newElement, 'utf-8', (err) => {
          console.log('modified');
      });

    res.end(data);
    });
  }


  //DELETE method
  if(req.method === 'DELETE'){

    req.on('data', (data) => {
      // remove element HTML file
      // fs.unlink(`./public${req.url}`, (err) => {
      //   console.log('deleted');
      // });
      let str = req.url;
      str = str.slice(1,-5);


      //edit index HTML file to remove link and decrease number by 1.
      let indexRead = fs.readFileSync('./public/index.html', 'utf-8');
      indexRead = indexRead.split('\n');
      console.log(`<a href="${req.url}">${str.charAt(0).toUpperCase() + str.slice(1)}</a>`);
      console.log(indexRead.indexOf(`      <a href="${req.url}">${str.charAt(0).toUpperCase() + str.slice(1)}</a>`));
      let updateIndex = indexRead.splice(indexRead.indexOf(`      <a href="${req.url}">${str.charAt(0).toUpperCase() + str.slice(1)}</a>`) -1, 1);
      updateIndex = indexRead.splice(indexRead.indexOf(`      <a href="${req.url}">${str.charAt(0).toUpperCase() + str.slice(1)}</a>`) + 1, 1);
      updateIndex = indexRead.splice(indexRead.indexOf(`      <a href="${req.url}">${str.charAt(0).toUpperCase() + str.slice(1)}</a>`) , 1);


      indexRead = indexRead.join('\n').replace(/(<h3>There are [^A-Z])/g, `<h3>There are ${number}`);
      console.log('updated', indexRead);




      // fs.writeFile('./public/index.html', indexRead, 'utf-8', (err) => {
      //     console.log('modified index!');
      // });


    res.end(data);
    });

  }



});

server.listen(3000, () => {
  console.log('server started on port 3000');
});