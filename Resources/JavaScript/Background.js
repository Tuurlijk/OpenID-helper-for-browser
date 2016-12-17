/*jshint bitwise:true, curly:true, eqeqeq:true, forin:true, globalstrict: true,
 latedef:true, noarg:true, noempty:true, nonew:true, undef:true, maxlen:256,
 strict:true, trailing:true, boss:true, browser:true, devel:true, jquery:true */
/*global browser, document, localStorage, tabId, changeInfo, tab, openTab, localize */

'use strict';
function updateIcon(tabId) {
    browser.pageAction.setTitle({
        tabId: tabId,
        title: 'Login with OpenID'
    });
    browser.pageAction.setIcon({
        tabId: tabId,
        path: {
            '19': '/Resources/Icons/OpenId19.png',
            '38': '/Resources/Icons/OpenId38.png'
        }
    });
}

function getSettings() {
    let settings = {
        autoSubmit: false,
        elements: [],
        openIdUrl: ''
    };
    if (localStorage.elements) {
        settings.elements = JSON.parse(localStorage.elements);
        settings.autoSubmit = localStorage.autoSubmit === 'true';
        settings.openIdUrl = localStorage.openIdUrl ? localStorage.openIdUrl : '';
    }
    return settings;
}

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // We only react on a complete load of a http(s) page,
    // only then we're sure the content.js is loaded.
    if (changeInfo.status !== 'complete' || tab.url.indexOf('http') !== 0) {
        return;
    }

    let settings = getSettings();
    if (settings.elements.length === 0) {
        return;
    }

    // Request the current status and update the icon accordingly
    browser.tabs.sendMessage(
        tabId,
        {
            cmd: 'getFirstMatchingElement',
            settings: settings
        },
        function(response) {
            console.log(response.status);
            if (response.status !== false) {
                // Show the pageAction
                browser.pageAction.show(tabId);
                updateIcon(tabId);
            }
        }
    );
});

browser.pageAction.onClicked.addListener(function(tab) {
    // Request the current status and update the icon accordingly
    browser.tabs.sendMessage(
        tab.id,
        {
            cmd: 'loginWithOpenId',
            settings: getSettings()
        },
        function(response) {
            if (response.status !== undefined) {
                //var bkg = browser.extension.getBackgroundPage();
                //bkg.console.log(response);
            }
        }
    );
});
