// tong quan

const getIndexByColumnName = ($, name) => {
    var $child = $('th').filter(function () {
        return $(this).text().trim().includes(name)
    });
    var $parent = $child.parent();
    const idx = $parent.children().index($child)
    return idx
}

const getIndexByColumnNameTaiChinh = ($, name) => {
    var $child = $('th').filter(function () {
        return $(this).text().trim().includes(name)
    });
    var $parent = $child.parent();
    const idx = $parent.children().index($child)
    return idx + 1
}

const fetchElemInnerText = elem => (elem.text && elem.text().trim()) || null;


const getTextAtIndex = ($, $parent, index) => {
    const $matchedEle = $($parent.children()[index]).contents().first()
    // console.log($matchedEle, '$matchedEle$matchedEle')

    return fetchElemInnerText($matchedEle)
}

const formatNumber = num => {
    return num.split(',').join('')
}

const getChiSoTaiChinhBySelector = ($, quarter, selector) => {
    // getValueByLabel($, 'Tài sản ngắn hạn')
    // console.log(quarter, 'quarterquarter')
    // console.log(selector, 'selectorselector')
    const timeIndex = getIndexByColumnNameTaiChinh($, quarter)
    // console.log(timeIndex, 'timeIndextimeIndex')
    const $chiSo = $(selector)

    // #finance-content > div > div > div.pos-relative.content-grid.w100 > div:nth-child(2) > table > tbody > tr:nth-child(3)


    const text = getTextAtIndex($, $chiSo, timeIndex)
    if (text === null) {
        return 0
    }
    // console.log(text, 'texttexttext')
    const result = formatNumber(text)
    return result
}

// const getValueByLabel = ($, label) => {
//     var category = $('span:contains("tồn kho")').next().text();
//     console.log(category, 'categorycategory')

// }

module.exports = { getChiSoTaiChinhBySelector }