/*jshint bitwise:true, curly:true, eqeqeq:true, forin:true, globalstrict: true,
 latedef:true, noarg:true, noempty:true, nonew:true, undef:true, maxlen:256,
 strict:true, trailing:true, boss:true, browser:true, devel:true, jquery:true */
/*global browser, document, localStorage, safari, SAFARI, openTab, DS, localize */

let OpenId = (function() {
    'use strict';

    // Get first element if present
    function getFirstMatchingElement(selectors) {
        let element, i;
        for (i = 0; i < selectors.length; i += 1) {
            element = document.querySelector(selectors[i]);
            if (element !== null) {
                return element;
            }
        }
        return false;
    }

    // Find closest form element
    function findClosestFormElement(element) {
        let formElement = null, formFound = false;
        while (!formFound) {
            element = element.parentNode;
            if (element.tagName.toLowerCase() === 'form') {
                formFound = true;
            }
        }
        if (formFound) {
            formElement = element;
        }
        return formElement;
    }

    // Login with OpenID
    function loginWithOpenId(selectors, openIdUrl) {
        let element = getFirstMatchingElement(selectors), form;
        // Check if element is present before finding a parent
        if (element !== false) {
            form = findClosestFormElement(element);
            element.value = openIdUrl;
            if (form !== null) {
                form.submit();
            }
        }
        return true;
    }

    // Public methods
    return {
        // Handles messages from other extension parts
        messageListener: function(request, sender, sendResponse) {
            let settings = request.settings, result;

            // Execute the requested command
            if (request.cmd === 'getFirstMatchingElement') {
                result = getFirstMatchingElement(settings.elements);
                if (settings.autoSubmit && result) {
                    result = loginWithOpenId(settings.elements, settings.openIdUrl);
                }
            } else if (request.cmd === 'loginWithOpenId') {
                result = loginWithOpenId(settings.elements, settings.openIdUrl);
            }

            // Respond with the current status
            sendResponse({status: result});
        }
    };
}());

// Attach the message listener
browser.runtime.onMessage.addListener(OpenId.messageListener);
