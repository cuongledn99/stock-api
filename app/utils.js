const _ = require('lodash');
const axios = require("axios");
const cheerio = require("cheerio");
var GetUniqueSelector = require('cheerio-get-css-selector');
const puppeteer = require('puppeteer')
const isHeadless = false

/**
 * Loads the html string returned for the given URL
 * and sends a Cheerio parser instance of the loaded HTML
 */
const fetchHtmlFromUrl = async url => {
    return await axios
        .get(enforceHttpsUrl(url))
        .then(response => cheerio.load(response.data))
        .catch(error => {
            error.status = (error.response && error.response.status) || 500;
            throw error;
        });
};

/**
 * Fetches the inner text of the element
 * and returns the trimmed text
 */
const fetchElemInnerText = elem => (elem.text && elem.text().trim()) || null;

/**
* Fetches the specified attribute from the element
* and returns the attribute value
*/
const fetchElemAttribute = attribute => elem =>
    (elem.attr && elem.attr(attribute)) || null;

/**
 * Extract an array of values from a collection of elements
 * using the extractor function and returns the array
 * or the return value from calling transform() on array
 */
const extractFromElems = extractor => transform => elems => $ => {
    const results = elems.map((i, element) => extractor($(element))).get();
    return _.isFunction(transform) ? transform(results) : results;
};


const getIndexByColumnName = ($, name) => {
    var $child = $('th').filter(function () {
        return $(this).text().trim().includes(name)
    });
    var $parent = $child.parent();
    const idx = $parent.children().index($child)
    return idx
}

const getTextAtIndex = ($, $parent, index) => {
    const $matchedEle = $($parent.children()[index]).contents().first()

    return fetchElemInnerText($matchedEle)
}

const formatNumber = num => {
    return num.split(',').join('')
}

const fetchHtmlFromPuppeteer = async pupDom => {
    const $ = cheerio.load(pupDom)
    GetUniqueSelector.init($);
    return $
}
const getChiSoTaiChinhBySelector = ($, quarter, selector) => {
    // console.log(quarter, 'quarterquarter')
    // console.log(selector, 'selectorselector')
    const timeIndex = getIndexByColumnName($, quarter)
    // console.log(timeIndex, 'timeIndextimeIndex')
    const $chiSo = $(selector)


    const text = getTextAtIndex($, $chiSo, timeIndex)
    const result = formatNumber(text)
    return result
}

const isTextExist = async (page, text) => {
    try {
        let chk = false
        if ((await page.waitForXPath(`//*[contains(text(), "${text}")]`, {
            timeout: 50
        })) !== null) {
            chk = true
        } else {
            chk = false
        }
        return chk
    } catch (error) {
        // console.log(error, 'errorerror')
        return false
    }
}

const click = async (page, selector) => {
    await page.$eval(selector, btn => btn.click());

}

const goToPreviousPage = async (page) => {
    await click(page, '.fa-chevron-left')
}

const goToNextPage = async (page) => {
    await click(page, '.fa-chevron-left')
}

async function goBackUntilFound(page, time) {
    await goToPreviousPage(page)
    await page.waitForSelector('#table-0 > tbody > tr:nth-child(1)')
    let isQuarterFound = await isTextExist(page, time)
    // console.log(isQuarterFound, 'isQuarterFound ' + time)

    if (!isQuarterFound) {
        return goBackUntilFound(page, time)
    }

}

const getCompanyUrl = async code => {
    const url = `https://finance.vietstock.vn/BVH-tap-doan-bao-viet.htm`
    /* #region  set up browser and page */
    let browser = await puppeteer.launch({
        defaultViewport: null,
        headless: isHeadless,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        ignoreHTTPSErrors: true
    });

    let page = await browser.newPage();
    await page._client.send("Network.enable", {
        maxResourceBufferSize: 1024 * 1204 * 100,
        maxTotalBufferSize: 1024 * 1204 * 200
    });
    /* #endregion */

    /* #region  login */
    await page.goto(url);
    const searchSelector = '#txt-top-filter'
    await page.waitForSelector(searchSelector)
    await page.focus(searchSelector)
    await page.keyboard.type(code)
    await page.waitForSelector('.tt-suggestion')
    const resultSelector = 'body > div.page-container > div.navbar.navbar-top > div > div.navbar-collapse.collapse.no-padder > div.form.navbar-form.navbar-right.hidden-xs.hidden-sm > div > span > div > div > div:nth-child(2)'
    await click(page, resultSelector)
    const result = page.url()
    await browser.close()
    return result
    // console.log(page.url(), 'page.url()')
}

const fetchDomPuppeteer = async (url, quarter) => {
    /* #region  set up browser and page */
    let browser = await puppeteer.launch({
        defaultViewport: null,
        headless: isHeadless,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        ignoreHTTPSErrors: true
    });

    let page = await browser.newPage();
    await page._client.send("Network.enable", {
        maxResourceBufferSize: 1024 * 1204 * 100,
        maxTotalBufferSize: 1024 * 1204 * 200
    });
    /* #endregion */

    /* #region  login */
    await page.goto(url);
    await page.waitForSelector('#table-0 > tbody > tr:nth-child(1)')


    let isQuarterFound = await isTextExist(page, quarter)

    if (!isQuarterFound) {
        await goBackUntilFound(page, quarter)
    }


    const dom = await page.evaluate(() => document.querySelector('*').outerHTML);
    browser.close()
    return dom
    // console.log(dom)

    /* #endregion */
}


module.exports = {
    fetchHtmlFromUrl,
    fetchElemInnerText,
    fetchElemAttribute,
    extractFromElems,
    getIndexByColumnName,
    getTextAtIndex,
    fetchHtmlFromPuppeteer,
    formatNumber,
    getChiSoTaiChinhBySelector,
    fetchDomPuppeteer,
    getCompanyUrl
}