const { composeAsync, fetchElemInnerText } = require("./helpers")
const fs = require('fs')
const { getIndexByColumnName, getTextAtIndex, fetchHtmlFromPuppeteer, formatNumber, getChiSoTaiChinhBySelector, fetchDomPuppeteer } = require("./utils")
const url = `https://finance.vietstock.vn/BVH-tap-doan-bao-viet.htm`


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

    const dom = await fetchDomPuppeteer(url, getQuarterText(time))

    const $ = await fetchHtmlFromPuppeteer(dom)
    return handler($, getQuarterText(time), code)


}

module.exports = { fetchData }