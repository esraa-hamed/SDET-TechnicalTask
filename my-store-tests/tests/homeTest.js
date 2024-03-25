module.exports = {
    '@tags': ['home'],
    'Home search: dress'(browser){

        const searchQuery = 'dress';
        const searchSuggestionsSelector = '.ac_results';
        const titleSpanSelector = 'span[class="lighter"]';
        const optionSpanSelector = '#uniform-selectProductSort span';
        const counterSpanSelector = 'span[class="heading-counter"]';
        const textPriceAsc = "Price: Lowest first";
        const textPriceDesc = "Price: Highest first";
        const textNameAsc = "Product Name: A to Z";
        const textNameDesc = "Product Name: Z to A";
        const textInStock = "In stock";
        const textReferenceLowest = "Reference: Lowest first";
        const textReferenceHighest = "Reference: Highest first";
        const imageSelector = '.product_img_link img';
        var textCounter ;
        var counter;

        const page = browser.page.homeObject();

        page.navigate();

        page
            .setSearchQuery('@searchBoxSelector',searchQuery)
            .assert.visible(searchSuggestionsSelector, "On writing dress in the search box, a dropdown menu containing search suggestions appears")

            .click('@searchButtonSelector')
            .assert.textContains(titleSpanSelector, searchQuery.toUpperCase(), "On writing dress in the search box, the word [DRESS] appears in the heading of the search results page")

            .waitForElementVisible('@sortDropdownSelector', 5000)

            .selectSortOption('@optionPriceAsc')
            .assert.textContains(optionSpanSelector, textPriceAsc, "On chosing the option of ascending price sorting, the text [Price: Lowest first] appears")

            .selectSortOption('@optionPriceDesc')
            .assert.textContains(optionSpanSelector, textPriceDesc, "On chosing the option of ascending price sorting, the text [Price: Highest first] appears")

            .selectSortOption('@optionNameAsc')
            .assert.textContains(optionSpanSelector, textNameAsc, "On chosing the option of ascending price sorting, the text [Product Name: A to Z] appears")

            .selectSortOption('@optionNameDesc')
            .assert.textContains(optionSpanSelector, textNameDesc, "On chosing the option of ascending price sorting, the text [Product Name: Z to A] appears")

            .selectSortOption('@optionInStock')
            .assert.textContains(optionSpanSelector, textInStock, "On chosing the option of ascending price sorting, the text [In stock] appears")

            .selectSortOption('@optionReferenceLowest')
            .assert.textContains(optionSpanSelector, textReferenceLowest, "On chosing the option of ascending price sorting, the text [Reference: Lowest first] appears")

            .selectSortOption('@optionReferenceHighest')
            .assert.textContains(optionSpanSelector, textReferenceHighest, "On chosing the option of ascending price sorting, the text [Reference: Highest first] appears");

            browser.getText('css selector', counterSpanSelector, function(result){
                textCounter = result.value;
                counter = textCounter.split(" ")[0];
            })
        
            browser.elements('css selector', imageSelector, function(result){
                browser.assert.equal(result.value.length === Number(counter), true, 'All product images are displayed');
            })

            .end();
    }
}
