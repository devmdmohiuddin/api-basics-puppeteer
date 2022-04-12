const express = require("express");
const puppeteer = require("puppeteer");

const app = express();

let browser;
let data = {};

async function processUrl(url) {
  if (!browser) {
    browser = await puppeteer.launch();
  }

  const page = await browser.newPage();
  await page.goto(`https://${url}`);
  const title = await page.title();
  await page.close();

  data[url] = title
}

app.get("/create/:url", async (req, res) => {
  const { url } = req.params;
  data[url] = 'processing...';
  processUrl(url);
  res.send('Successfully created.');
});

app.get("/read/:url", async (req, res) => {
  const { url } = req.params;

  res.send(data[url])
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
