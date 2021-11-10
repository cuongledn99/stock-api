const cheerio = require("cheerio");
var GetUniqueSelector = require('cheerio-get-css-selector');

const fetchHtmlFromPuppeteer = async pupDom => {
    const $ = cheerio.load(pupDom)
    GetUniqueSelector.init($);
    return $
}

module.exports = { fetchHtmlFromPuppeteer }