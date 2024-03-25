module.exports = {
    url: 'http://automationpractice.multiformis.com/index.php',

    elements: {
        searchBoxSelector : 'input[name="search_query"]',
        searchButtonSelector : 'button[name="submit_search"]',
        sortDropdownSelector: '.content_sortPagiBar',
        optionPriceAsc: 'option[value="price:asc"]',
        optionPriceDesc: 'option[value="price:desc"]',
        optionNameAsc: 'option[value="name:asc"]',
        optionNameDesc: 'option[value="name:desc"]',
        optionInStock: 'option[value="quantity:desc"]',
        optionReferenceLowest: 'option[value="reference:asc"]',
        optionReferenceHighest: 'option[value="reference:desc"]'
    },

    commands: [{
        setSearchQuery(selector, value){
            return this
                    .setValue(selector, value);
        },
        selectSortOption(option){
            return this
                    .click('@sortDropdownSelector')
                    .click(option);
        }
    }]
}