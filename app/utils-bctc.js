const _ = require('lodash');
const axios = require("axios");
const cheerio = require("cheerio");
var GetUniqueSelector = require('cheerio-get-css-selector');
const puppeteer = require('puppeteer')
const { isHeadless } = require('../config')

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

// const isTextExist = async (page, text) => {
//     console.log(text, 'texttext')
//     try {
//         let chk = false
//         if ((await page.waitForXPath(`//*[contains(text(), "${text}")]`, {
//             timeout: 100
//         })) !== null) {
//             chk = true
//         } else {
//             chk = false
//         }
//         return chk
//     } catch (error) {
//         console.log("Timeout isTextExist")
//         // console.log(error, 'errorerror')
//         return false
//     }
// }

const click = async (page, selector) => {
    await page.$eval(selector, btn => btn.click());

}

const goToPreviousPage = async (page) => {
    await click(page, '.fa-chevron-left')
}


const getClassName = async (page, selector) => {
    const el = await page.$(selector)
    const propertyHandle = await el.getProperty('className')
    const propertyValue = await propertyHandle.jsonValue();
    return propertyValue
}
// #finance-content > div > div > div:nth-child(3) > div > div.pull-right.m-b > div:nth-child(2)
// #finance-content > div > div > div:nth-child(1) > div.col-xs-14.col-sm-8.m-b.text-right > div.btn.btn-default.m-l.disabled
const isFirstPage = async (page) => {
    const btnBackClass = await getClassName(page, '#finance-content > div > div > div:nth-child(3) > div > div.pull-right.m-b > div:nth-child(2)')
    if (btnBackClass.includes("disabled")) {
        return true
    }
    return false

}


const goToNextPage = async (page) => {
    await click(page, '.fa-chevron-left')
}

/**
 * 
 * @param {*} page 
 * @param {*} time 
 * @returns 
 * ko co data thoa man -> null
 */
async function goBackUntilFound(page, time) {
    await goToPreviousPage(page)
    const isOutOfData = await isFirstPage(page)
    // console.log(isOutOfData, 'isOutOfDataisOutOfData')
    await page.waitForSelector('#table-0 > tbody > tr:nth-child(1)')
    let isQuarterFound = await isTextExist(page, time)
    console.log({ isQuarterFound, isOutOfData, time })
    if (!isQuarterFound && isOutOfData) {
        console.log("return ne")
        console.log({ isQuarterFound, isOutOfData, time })
        return null
    }
    // console.log(isQuarterFound, 'isQuarterFound ' + time)

    if (!isQuarterFound) {
        return goBackUntilFound(page, time)
    }

}

const initChrome = async () => {
    let browser = await puppeteer.launch({
        defaultViewport: null,
        headless: isHeadless,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            '--disable-speech-api', // 	Disables the Web Speech API (both speech recognition and synthesis)
            '--disable-background-networking', // Disable several subsystems which run network requests in the background. This is for use 									  // when doing network performance testing to avoid noise in the measurements. ↪
            '--disable-background-timer-throttling', // Disable task throttling of timer tasks from background pages. ↪
            '--disable-backgrounding-occluded-windows',
            '--disable-breakpad',
            '--disable-client-side-phishing-detection',
            '--disable-component-update',
            '--disable-default-apps',
            '--disable-dev-shm-usage',
            '--disable-domain-reliability',
            '--disable-extensions',
            '--disable-features=AudioServiceOutOfProcess',
            '--disable-hang-monitor',
            '--disable-ipc-flooding-protection',
            '--disable-notifications',
            '--disable-offer-store-unmasked-wallet-cards',
            '--disable-popup-blocking',
            '--disable-print-preview',
            '--disable-prompt-on-repost',
            '--disable-renderer-backgrounding',
            '--disable-setuid-sandbox',
            '--disable-sync',
            '--hide-scrollbars',
            '--ignore-gpu-blacklist',
            '--metrics-recording-only',
            '--mute-audio',
            '--no-default-browser-check',
            '--no-first-run',
            '--no-pings',
            '--no-sandbox',
            '--no-zygote',
            '--password-store=basic',
            '--use-gl=swiftshader',
            '--use-mock-keychain',
        ],
        ignoreHTTPSErrors: true
    });

    let page = await browser.newPage();
    await page.setRequestInterception(true)

    page.on('request', async (request) => {
        // console.log(`${request.method()} -> ${request.url()}`)
        if (request.resourceType() == 'image'
            || request.resourceType() === 'media'
            || request.url().includes("google")
            || request.url().includes("facebook")) {
            await request.abort()
        } else {
            await request.continue()
        }
    })
    return { page, browser }
}

const getCompanyUrl = async code => {
    // console.log("getCompanyUrl")
    const url = `https://finance.vietstock.vn/BVH-tap-doan-bao-viet.htm`
    return new Promise(async (resolve, reject) => {

        const { page, browser } = await initChrome()

        await page.goto(url);
        const searchSelector = '#txt-top-filter'
        // console.log("searchSelector")
        await page.waitForSelector(searchSelector)
        // console.log("searchSelector done")
        await page.focus(searchSelector)
        await page.keyboard.type(code)
        // console.log("Type done")
        page.on("response", async res => {
            // console.log("Reponse ...")


            if (res.request().method() !== "GET") return
            // console.log(res.request().method() + "===>" + res.url(), 'res.url()res.url()')
            if (res.url().includes("/search")) {
                // console.log("Found request url with /search")
                const data = await res.json()
                const url = data.data.split('|')
                    .filter(item => item.includes("https"))
                // return url[0]
                await browser.close()
                resolve(url[0])
            }
        })
    })

}

/**
 * 
 * @param {*} url 
 * @param {*} quarter 
 * @returns 
 * ko co data -> null
 */
const fetchDomPuppeteer = async (url, quarter) => {
    const { page, browser } = await initChrome()

    /* #region  login */
    await page.goto(url);
    await page.waitForSelector('#table-0 > tbody > tr:nth-child(1)')

    let isQuarterFound = await isTextExist(page, quarter)
    let goBackRes = ''
    if (!isQuarterFound) {
        goBackRes = await goBackUntilFound(page, quarter)
        // console.log(goBackRes, 'goBackResgoBackRes 1')

    }
    // console.log(goBackRes, 'goBackResgoBackRes')
    if (goBackRes === null) {
        return null
    }

    const dom = await page.evaluate(() => document.querySelector('*').outerHTML);
    browser.close()
    return dom
    // console.log(dom)

    /* #endregion */
}

// const fetchDomMatchedTime = async (url, quarter, detectorSelector) => {
//     const { page, browser } = await initChrome()

//     /* #region  login */
//     await page.goto(url);
//     await page.waitForSelector(detectorSelector)

//     let isQuarterFound = await isTextExist(page, quarter)
//     let goBackRes = ''
//     if (!isQuarterFound) {
//         goBackRes = await goBackUntilFound(page, quarter)
//         // console.log(goBackRes, 'goBackResgoBackRes 1')

//     }
//     // console.log(goBackRes, 'goBackResgoBackRes')
//     if (goBackRes === null) {
//         return null
//     }

//     const dom = await page.evaluate(() => document.querySelector('*').outerHTML);
//     browser.close()
//     return dom
//     // console.log(dom)

//     /* #endregion */
// }


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
    getCompanyUrl,
    // fetchDomMatchedTime
}