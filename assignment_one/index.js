const express = require("express");
const puppeteer = require("puppeteer");
const fs = require("fs/promises");

const app = express();

let browser;

async function processUrl(url) {
  if (!browser) {
    browser = await puppeteer.launch();
  }

  const page = await browser.newPage();
  await page.goto(`https://${url}`);
  const title = await page.title();
  await page.close();

  
  const data = await fs.readFile('db.json', 'utf-8');
  const titleArr = JSON.parse(data);

  const singleTitle = titleArr?.find(t => t[url] === title);
  let titleObj = {};

  if (!singleTitle) {
    titleObj = { [url]: title };
    titleArr.push(titleObj)
    await fs.writeFile('db.json', JSON.stringify(titleArr));
  } else {
    return
  }
}

app.get("/create/:url", async (req, res) => {
  const { url } = req.params;
  processUrl(url);
  res.send('success');
});

app.get("/read/:url", async (req, res) => {
  const { url } = req.params;

  const data = await fs.readFile('db.json', 'utf-8');
  const titleArr = JSON.parse(data);

  const singleTitle = titleArr?.find(t => t[url]);

  res.json(singleTitle)

});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
