const { baseHandler } = require('./../handlers/base')
const { getBCTCHandler } = require('./../handlers/bctc')
const getBCTC = async (time, code) => {
    const url = `https://finance.vietstock.vn/${code.toUpperCase()}/tai-chinh.htm`
    return baseHandler(url, time, getBCTCHandler, '#finance-content > div > div > div.pos-relative.content-grid.w100 > div:nth-child(1) > table > thead > tr')
}

module.exports = { getBCTC }