module.exports = {
    '@tags': ['contactus'],
    'Test Form Submission'(browser){

        const validEmailAddressValue = 'test@test.com';
        const orderReferenceValue = '12';
        const messageValue = "This is a message";
        const errorMessageSelector = '.alert-danger';
        const successMessageSelector = '.alert-success';

        const page = browser.page.contactUsObject();

        page.navigate();

        //Firstly: Trying each input on its own

        page
            .selectHeaderDropdownOption('2')
            .submitContactForm();
            browser.assert.visible(errorMessageSelector, "On filling heading input only, form did not submit")
            if (browser.assertionResults && browser.assertionResults.length === 0) {
                browser.end();
            }

        page
            .selectHeaderDropdownOption('0') //clear header input value
            .setElementValue('@emailAddressSelector',validEmailAddressValue)
            .submitContactForm();
            browser.assert.visible(errorMessageSelector, "On filling email input only, form did not submit")
            if (browser.assertionResults && browser.assertionResults.length === 0) {
                browser.end();
            }
        
        page
            .clearElementValue('@emailAddressSelector')
            .setElementValue('@orderReferenceSelector', orderReferenceValue)
            .submitContactForm();
            browser.assert.visible(errorMessageSelector, "On filling order reference input only, form did not submit")
            if (browser.assertionResults && browser.assertionResults.length === 0) {
                browser.end();
            }

        page
            .clearElementValue('@orderReferenceSelector')
            .setElementValue('@messageSelector', messageValue)
            .submitContactForm()
            browser.assert.visible(errorMessageSelector, "On filling message input only, form did not submit")
            if (browser.assertionResults && browser.assertionResults.length === 0) {
                browser.end();
            }

        //Secondly: Trying different combinations (will focus on the email since it should be required)
        
        page
            .clearElementValue('@messageSelector')
            .selectHeaderDropdownOption('2')
            .setElementValue('@emailAddressSelector', validEmailAddressValue)
            .submitContactForm();
            browser.assert.visible(errorMessageSelector, "On filling email and heading inputs only, form did not submit")
            if (browser.assertionResults && browser.assertionResults.length === 0) {
                browser.end();
            }
        
        page
            .selectHeaderDropdownOption('0') //clear header input value
            .setElementValue('@emailAddressSelector', validEmailAddressValue)
            .setElementValue('@orderReferenceSelector', orderReferenceValue)
            .submitContactForm();
            browser.assert.visible(errorMessageSelector, "On filling email & order reference inputs only, form did not submit")
            if (browser.assertionResults && browser.assertionResults.length === 0) {
                browser.end();
            }
        
        page
            .clearElementValue('@orderReferenceSelector')
            .setElementValue('@emailAddressSelector', validEmailAddressValue)
            .setElementValue('@messageSelector', messageValue)
            .submitContactForm()
            browser.assert.visible(errorMessageSelector, "On filling email & message inputs only, form did not submit")
            if (browser.assertionResults && browser.assertionResults.length === 0) {
                browser.end();
            }

        // Adding an assertion for submitting the form with heading and message inputs only

        page
            .clearElementValue('@emailAddressSelector')
            .selectHeaderDropdownOption('2')
            .submitContactForm()
            browser.assert.visible(errorMessageSelector, "On filling heading & message inputs only, form did not submit")
            if (browser.assertionResults && browser.assertionResults.length === 0) {
                browser.end();
            }         

        // Will start considering combinations of 3 including email input
        
        page
            .selectHeaderDropdownOption('2')
            .setElementValue('@emailAddressSelector', validEmailAddressValue)
            .setElementValue('@messageSelector', messageValue)
            .submitContactForm()
            browser.assert.visible(successMessageSelector, "On filling email, heading, and message inputs, form did not submit")
            if (browser.assertionResults && browser.assertionResults.length === 0) {
                browser.end();
            }   

        // Since the above assertion succeeded (~ the form submitted successfully on inputting email, message and heading), 
        //  and the form did NOT submit on inputting email and heading only
        //  --> this means that the MESSAGE input is REQUIRED
        // Since that the assertion of submitting the form with message and email only passed (~ form did NOT submit successfully) 
        // -->  this means that the HEADING input is also REQUIRED
        // So, I am going to add an assertion for submitting the form with heading and message inputs only,
        // to check that the email is also required

        // After checking: 
        // The REQUIRED input fields are:
        // Email, Message and Subject Heading
    },

    'Test File Upload'(browser){

        const page = browser.page.contactUsObject();
        const path = require('path');
        const fileNameBoxSelector = 'span[class="filename"]';
        const fileName = 'test_img';
        const relativeFilePath = './images/test_img.jpeg'
        const absoluteFilePath = path.resolve(__dirname, relativeFilePath);
        // const filePath = '/Users/apple/Documents/Testing/SDET-TechnicalTask/images/'

        page
            .navigate()
            .uploadFileWithPath('@fileUploadSelector', absoluteFilePath);
            browser.assert.textContains(fileNameBoxSelector, fileName, "File upload input box contains same name as that of file selected")
            if (browser.assertionResults && browser.assertionResults.length === 0) {
                browser.end();
            }
    },

    'Test Email Input'(browser){

        const page = browser.page.contactUsObject();
        page.navigate();

        const invalidEmailAddressValue1 = 'test';
        const invalidEmailAddressValue2 = 'test@';
        const invalidEmailAddressValue3 = 'test.com';
        const messageValue = "This is a message";
        const errorMessageSelector = '.alert-danger';

        page
            .setElementValue('@emailAddressSelector', invalidEmailAddressValue1)
            .selectHeaderDropdownOption('2')
            .setElementValue('@messageSelector', messageValue)
            .submitContactForm();
            browser.assert.visible(errorMessageSelector, "On filling all required input fields but with an INVALID email address (test), form doesn't submit")
            if (browser.assertionResults && browser.assertionResults.length === 0) {
                browser.end();
            } 

        page
            .setElementValue('@emailAddressSelector', invalidEmailAddressValue2)
            .selectHeaderDropdownOption('2')
            .setElementValue('@messageSelector', messageValue)
            .submitContactForm();
            browser.assert.visible(errorMessageSelector, "On filling all required input fields but with an INVALID email address (test@), form doesn't submit")
            if (browser.assertionResults && browser.assertionResults.length === 0) {
                browser.end();
            } 

        page
            .setElementValue('@emailAddressSelector', invalidEmailAddressValue3)
            .selectHeaderDropdownOption('2')
            .setElementValue('@messageSelector', messageValue)
            .submitContactForm();
            browser.assert.visible(errorMessageSelector, "On filling all required input fields but with an INVALID email address (test.com), form doesn't submit")
            if (browser.assertionResults && browser.assertionResults.length === 0) {
                browser.end();
            } 
    }
}