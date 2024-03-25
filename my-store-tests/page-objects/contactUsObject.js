module.exports = {
    url: 'http://automationpractice.multiformis.com/index.php?controller=contact',

    elements: {
        subjectHeadingSelector : '#id_contact[name="id_contact"]',
        emailAddressSelector : 'input[name="from"]',
        orderReferenceSelector : 'input[name="id_order"]',
        messageSelector : 'textarea[name="message"]',
        submitButtonSelector : '#submitMessage[type="submit"]',
        successMessageSelector : '.alert-success',
        fileUploadSelector: 'input[name="fileUpload"]'
    },

    commands: [{
        selectHeaderDropdownOption(value){
            return this
                .click('@subjectHeadingSelector')
                .click(`option[value="${value}"]`);
        },

        setElementValue(selector, value){
            return this
                .setValue(selector, value);
        },

        submitContactForm(){
            return this
                .click('@submitButtonSelector');
        },

        clearElementValue(selector){
            return this
                .clearValue(selector);
        },

        uploadFileWithPath(selector, path){
            return this
                .setValue(selector, path);
        }
    }]
}