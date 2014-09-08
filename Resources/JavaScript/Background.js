/*jshint bitwise:true, curly:true, eqeqeq:true, forin:true, globalstrict: true,
 latedef:true, noarg:true, noempty:true, nonew:true, undef:true, maxlen:256,
 strict:true, trailing:true, boss:true, browser:true, devel:true, jquery:true */
/*global chrome, document, localStorage, safari, SAFARI, openTab, DS, localize */

function updateIcon(tabId) {
    'use strict';
    var title = 'Login with OpenID',
        image = 'OpenId';

    // Update title
    chrome.pageAction.setTitle({
        tabId: tabId,
        title: title
    });

    // Update image
    chrome.pageAction.setIcon({
        tabId: tabId,
        path: {
            '19': '/Resources/Icons/' + image + '19.png',
            '38': '/Resources/Icons/' + image + '38.png'
        }
    });
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    'use strict';
    // We only react on a complete load of a http(s) page,
    // only then we're sure the content.js is loaded.
    if (changeInfo.status !== 'complete' || tab.url.indexOf('http') !== 0) {
        return;
    }

    // Prep some variables
    var autoSubmit,
        elements = [],
        openIdUrl = '';

    // Check if localStorage is available and get the settings out of it
    if (localStorage) {
        if (localStorage.elements) {
            autoSubmit = localStorage.autoSubmit;
            openIdUrl = localStorage.openIdUrl;
            elements = JSON.parse(localStorage.elements);
        }
    }

    autoSubmit = (autoSubmit === 'true');

    // Show the pageAction
    chrome.pageAction.show(tabId);

    // Request the current status and update the icon accordingly
    chrome.tabs.sendMessage(
        tabId,
        {
            cmd: 'isElementPresent',
            autoSubmit: autoSubmit,
            elements: elements,
            openIdUrl: openIdUrl
        },
        function (response) {
            if (response.status !== false) {
                updateIcon(tabId);
            }
        }
    );
});

chrome.pageAction.onClicked.addListener(function (tab) {
    'use strict';
    var autoSubmit,
        elements = [],
        openIdUrl = '';

    // Check if localStorage is available and get the settings out of it
    if (localStorage) {
        if (localStorage.openIdUrl) {
            autoSubmit = localStorage.autoSubmit;
            openIdUrl = localStorage.openIdUrl;
            elements = JSON.parse(localStorage.elements);
        }
    }

    autoSubmit = (autoSubmit === 'true');

    // Request the current status and update the icon accordingly
    chrome.tabs.sendMessage(
        tab.id,
        {
            cmd: 'loginWithOpenId',
            autoSubmit: autoSubmit,
            elements: elements,
            openIdUrl: openIdUrl
        },
        function (response) {
            if (response.status !== undefined) {
                //var bkg = chrome.extension.getBackgroundPage();
                //bkg.console.log(response);
            }
        }
    );
});
