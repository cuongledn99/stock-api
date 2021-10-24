const { composeAsync, fetchElemInnerText } = require("./helpers")
const fs = require('fs')
const { fetchHtmlFromPuppeteer, getChiSoTaiChinhBySelector, fetchDomPuppeteer, getCompanyUrl } = require("./utils")


const getQuarterText = quarterCode => {
    const year = quarterCode.split('_')[1]
    const quarter = quarterCode.split('_')[0][1]
    return `Quý ${quarter}/${year}`
}

const getDoanhThuThuan = ($, quarter) => {
    return getChiSoTaiChinhBySelector($, quarter, '#table-0 > tbody > tr:nth-child(1)')
}

const getVonChuSoHuu = ($, quarter) => {
    return getChiSoTaiChinhBySelector($, quarter, '#table-1 > tbody > tr:nth-child(5)')
}
const getEPS = ($, quarter) => {
    return getChiSoTaiChinhBySelector($, quarter, '#table-2 > tbody > tr:nth-child(1)')
}



const handler = ($, time) => {
    const doanhThuThuan = getDoanhThuThuan($, time)

    const vonChuSoHuu = getVonChuSoHuu($, time)
    const eps = getEPS($, time)
    return {
        doanhThuThuan,
        vonChuSoHuu,
        eps
    }
}

const fetchData = async (time, code) => {
    const url = await getCompanyUrl(code)
    const dom = await fetchDomPuppeteer(url, getQuarterText(time))

    const $ = await fetchHtmlFromPuppeteer(dom)
    return handler($, getQuarterText(time), code)


}

// const fetchData = async (time, code) => {

//     await getCompanyUrl(code)

//     return "Done"
// }

module.exports = { fetchData }