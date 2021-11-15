const puppeteer = require('puppeteer')
const { isHeadless } = require('./../../config')
const { getTimeLabel, getTimeType, isTimeLabelExist } = require('./../utils/index')

// const DETECTOR_SELECTOR = ['#table-0 > tbody > tr:nth-child(1)']
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
const setTimeType = async (page, timeType) => {
    console.log(timeType, 'timeTypetimeType')
    if (timeType === 'YEAR') {
        console.log("Styart seelct eyar")
        // await click(page, "#btn-menu-all")
        await page.select('select[name="period"]', "1")
        await click(page, "#finance-content > div > div > div:nth-child(3) > div > button")
    }
}
const fetchDomMatchedTime = async (url, time, detectorSelector) => {
    const { page, browser } = await initChrome()

    await page.goto(url);
    await page.waitForSelector(detectorSelector)

    await setTimeType(page, getTimeType(time))

    let isTimeFouned = await isTimeLabelExist(page, getTimeLabel(time))
    // let isTimeFouned = await isTextExist(page, time)
    let goBackRes = ''
    if (!isTimeFouned) {
        goBackRes = await goBackUntilFound(page, getTimeLabel(time))
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

async function goBackUntilFound(page, time) {
    await goToPreviousPage(page)
    const isOutOfData = await isFirstPage(page)
    // console.log(isOutOfData, 'isOutOfDataisOutOfData')
    await page.waitForSelector('#finance-content > div > div > div.pos-relative.content-grid.w100 > div:nth-child(1) > table > thead > tr')
    let isQuarterFound = await isTimeLabelExist(page, time)
    // console.log({ isQuarterFound, isOutOfData, time })
    if (!isQuarterFound && isOutOfData) {
        console.log("return ne")
        // console.log({ isQuarterFound, isOutOfData, time })
        return null
    }
    // console.log(isQuarterFound, 'isQuarterFound ' + time)

    if (!isQuarterFound) {
        return goBackUntilFound(page, time)
    }

}

const goToPreviousPage = async (page) => {
    await click(page, '.fa-chevron-left')
}
const isFirstPage = async (page) => {
    const btnBackClass = await getClassName(page, '#finance-content > div > div > div:nth-child(3) > div > div.pull-right.m-b > div:nth-child(2)')
    if (btnBackClass.includes("disabled")) {
        return true
    }
    return false

}

const getClassName = async (page, selector) => {
    const el = await page.$(selector)
    const propertyHandle = await el.getProperty('className')
    const propertyValue = await propertyHandle.jsonValue();
    return propertyValue
}

const click = async (page, selector) => {
    await page.$eval(selector, btn => btn.click());

}
module.exports = { fetchDomMatchedTime, click }