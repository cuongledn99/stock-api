const { getQuarterText, getYearText, getTimeType } = require('./../utils/index')
const { fetchDomMatchedTime } = require('./../utils/chrome')
const { fetchHtmlFromPuppeteer } = require('./../utils/cheerio')
const baseHandler = async (url, time, mainHandler, detectorSelector) => {
    // const url = 'https://finance.vietstock.vn/VNM/tai-chinh.htm'
    // const url = await getCompanyUrl(code)
    let timeLabel
    if (getTimeType(time) === 'QUARTER') {
        timeLabel = getQuarterText(time)
    } else {
        timeLabel = getYearText(time)
    }

    const dom = await fetchDomMatchedTime(url, timeLabel, detectorSelector)
    if (dom === null) {
        return "No data"
    }

    const $ = await fetchHtmlFromPuppeteer(dom)
    return mainHandler($, timeLabel)
}

module.exports = { baseHandler }