const http = require("http");
const fs = require("fs");
const puppeteer = require("puppeteer");

let server;
let browser;
let page;

beforeAll(async () => {
  server = http.createServer(function (req, res) {
    fs.readFile(__dirname + "/.." + req.url, function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  });

  server.listen(process.env.PORT || 3000);
});

afterAll(() => {
  server.close();
});

beforeEach(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto("http://localhost:3000/index.html");
});

afterEach(async () => {
  await browser.close();
});

describe('the rgb-color class ', () => {
  it('should be set to the RGB equivalent of the color yellow', async () => {
    const matches = await page.$eval('style', (style) => {
      return style.innerHTML.match(/\.rgb-color.*{[\s\S][^}]*color.*:.*rgb\(255,.*255,.*0\).*;/g);
    });
    
    expect(matches.length).toBe(1);
  });
});

describe('the hex-color class ', () => {
  it('should be set to the HEX equivalent of the color yellow', async () => {
    const matches = await page.$eval('style', (style) => {
      return style.innerHTML.match(/\.hex-color.*{[\s\S][^}]*color.*:.*#ffff00.*;/g);
    });
    
    expect(matches.length).toBe(1);
  });
});

