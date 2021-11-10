const { getQuarterText } = require('./../utils/index')
const { fetchDomMatchedTime } = require('./../utils/chrome')
const { fetchHtmlFromPuppeteer } = require('./../utils/cheerio')
const baseHandler = async (url, time, mainHandler, detectorSelector) => {
    // const url = 'https://finance.vietstock.vn/VNM/tai-chinh.htm'
    // const url = await getCompanyUrl(code)
    const quarter = getQuarterText(time)

    const dom = await fetchDomMatchedTime(url, quarter, detectorSelector)
    if (dom === null) {
        return "No data"
    }

    const $ = await fetchHtmlFromPuppeteer(dom)
    return mainHandler($, quarter)
}

module.exports = { baseHandler }