const _ = require('lodash');
const axios = require("axios");
const cheerio = require("cheerio");
var GetUniqueSelector = require('cheerio-get-css-selector');


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
// const getTextBy


module.exports = {
    fetchHtmlFromUrl,
    fetchElemInnerText,
    fetchElemAttribute,
    extractFromElems,
    getIndexByColumnName,
    getTextAtIndex,
    fetchHtmlFromPuppeteer,
    formatNumber
}