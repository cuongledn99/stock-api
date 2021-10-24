const { composeAsync, fetchElemInnerText } = require("./helpers")
const fs = require('fs')
const { getIndexByColumnName, getTextAtIndex, fetchHtmlFromPuppeteer, formatNumber } = require("./utils")
const url = `https://finance.vietstock.vn/BVH-tap-doan-bao-viet.htm`

const TIME = {
    Q3_2020: 'Quý 3/2020',
    Q4_2020: 'Quý 4/2020',
    Q1_2021: 'Quý 1/2021',
    Q2_2021: 'Quý 2/2021',
}

const getDoanhThuThuan = ($, quarter) => {
    const timeIndex = getIndexByColumnName($, quarter)
    const $doanhThuThuanRow = $('#table-0 > tbody > tr:nth-child(1)')


    const text = getTextAtIndex($, $doanhThuThuanRow, timeIndex)
    const doanhThuThuan = formatNumber(text)
    return doanhThuThuan
}

const getVonChuSoHuu = ($, quarter) => {
    const timeIndex = getIndexByColumnName($, quarter)
    const $vonChuSoHuu = $('#table-1 > tbody > tr:nth-child(5)')


    const text = getTextAtIndex($, $vonChuSoHuu, timeIndex)
    const result = formatNumber(text)
    return result
}



const handler = $ => {

    const doanhThuThuan = getDoanhThuThuan($, TIME.Q1_2021)
    const vonChuSoHuu = getVonChuSoHuu($, TIME.Q4_2020)
    console.log(vonChuSoHuu)
    // console.log(doanhThuThuan, 'doanhThuThuan')
    // console.log(childIndex, 'childIndexchildIndex')
    // const qq = fetchElemInnerText($parent)
    // console.log($parent, '$parent$parent')
    // console.log(qq, 'qqqqqq')
    // const pr = $parent.innerHTML
    // console.log(pr, 'parentparent')





    const $tables = $('#table-0 > tbody > tr:nth-child(1) > td:nth-child(2)').contents().first()
    const table = fetchElemInnerText($tables)


    return "Hello"
}

const fetchData = async () => {
    // const dom = await fetchDomPuppeteer(url)
    const dom = fs.readFileSync('./app/dom')
    // console.log(dom, 'domdom')
    // fs.writeFileSync('./dom', dom)

    return composeAsync(handler, fetchHtmlFromPuppeteer)(dom);


}

module.exports = { fetchData }