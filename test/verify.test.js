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

describe("the narrow-text-area class", () => {
  it("should be 100px wide", async () => {
    const width = await page.$eval('div[class="narrow-text-area"]', (div) => {
      let style = window.getComputedStyle(div);
      return style.getPropertyValue("width");
    });

    expect(width).toEqual("100px");
  });

  it("should be centered on the page", async () => {
    const autoMargins = await page.$eval(
      'div[class="narrow-text-area"]',
      (div) => {
        let style = window.getComputedStyle(div);
        return style.getPropertyValue("margin");
      }
    );

    expect(autoMargins).toMatch(/0px \d\d\dpx/);
  });

  it("should be outlined with an orange border", async () => {
    const borderColor = await page.$eval(
      'div[class="narrow-text-area"]',
      (div) => {
        let style = window.getComputedStyle(div);
        return style.getPropertyValue("border-color");
      }
    );

    expect(borderColor).toEqual("rgb(255, 165, 0)");
  });

  it("should be outlined with a 5px wide border", async () => {
    const borderWidth = await page.$eval(
      'div[class="narrow-text-area"]',
      (div) => {
        let style = window.getComputedStyle(div);
        return style.getPropertyValue("border-width");
      }
    );

    expect(borderWidth).toEqual("5px");
  });

  it("should be outlined with a solid border", async () => {
    const borderStyle = await page.$eval(
      'div[class="narrow-text-area"]',
      (div) => {
        let style = window.getComputedStyle(div);
        return style.getPropertyValue("border-style");
      }
    );

    expect(borderStyle).toEqual("solid");
  });
});

describe('the text-box class', () => {
  it('should be backed with the color cyan behind the text', async () => {
    const backgroundColor = await page.$eval('div[class="text-box"]', (div) => {
      let style = window.getComputedStyle(div);
      return style.getPropertyValue('background-color');
    });

    expect(backgroundColor).toEqual('rgb(0, 255, 255)');
  });

  it('should be padding the text with 5px on all sides', async () => {
    const padding = await page.$eval('div[class="text-box"]', (div) => {
      let style = window.getComputedStyle(div);
      return style.getPropertyValue('padding');
    });

    expect(padding).toEqual('5px');
  });

  it('should be surrounded with a margin of 10px on the top and bottom and 20px on the left and right', async () => {
    const margin = await page.$eval('div[class="text-box"]', (div) => {
      let style = window.getComputedStyle(div);
      return style.getPropertyValue('margin');
    });

    expect(margin).toEqual('10px 20px');
  });
});
