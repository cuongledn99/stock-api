const { fetchHtmlFromPuppeteer, getChiSoTaiChinhBySelector, fetchDomPuppeteer, getCompanyUrl, fetchDomMatchedTime } = require("./utils")
const { getBCTCHandler } = require("./handler")

// const getQuarterText = quarterCode => {
//     // console.log(quarterCode, 'quarterCodequarterCode')
//     const year = quarterCode.split('_')[1]
//     const quarter = quarterCode.split('_')[0][1]
//     return `Quý ${quarter}/${year}`
// }

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
    // const url = 'https://finance.vietstock.vn/VCB-ngan-hang-tmcp-ngoai-thuong-viet-nam.htm'
    const url = await getCompanyUrl(code)
    // console.log("url from pro " + url)
    const dom = await fetchDomPuppeteer(url, getQuarterText(time))
    if (dom === null) {
        return "No data"
    }

    const $ = await fetchHtmlFromPuppeteer(dom)
    return handler($, getQuarterText(time), code)
}

const getCanDoiKeToan = async (time, code) => {
    console.log(code, 'codecodecode')
    const companyUrl = `https://finance.vietstock.vn/${code}/tai-chinh.htm`
    const dom = await fetchDomPuppeteer(companyUrl, getQuarterText(time))
    if (dom === null) {
        return "No data"
    }

    const $ = await fetchHtmlFromPuppeteer(dom)
    return handler($, getQuarterText(time), code)
}

// const baseHandler = async (url, time, mainHandler, detectorSelector) => {
//     // const url = 'https://finance.vietstock.vn/VNM/tai-chinh.htm'
//     // const url = await getCompanyUrl(code)
//     const quarter = getQuarterText(time)

//     const dom = await fetchDomMatchedTime(url, quarter, detectorSelector)
//     if (dom === null) {
//         return "No data"
//     }

//     const $ = await fetchHtmlFromPuppeteer(dom)
//     return mainHandler($, quarter)
// }


// const getBCTC = async (time, code) => {
//     const url = 'https://finance.vietstock.vn/VNM/tai-chinh.htm'
//     return baseHandler(url, time, getBCTCHandler, '#finance-content > div > div > div.pos-relative.content-grid.w100 > div:nth-child(1) > table > thead > tr')
// }


module.exports = { fetchData, baseHandler, getDoanhThuThuan, getEPS, getVonChuSoHuu }