/*jshint bitwise:true, curly:true, eqeqeq:true, forin:true, globalstrict: true,
 latedef:true, noarg:true, noempty:true, nonew:true, undef:true, maxlen:256,
 strict:true, trailing:true, boss:true, browser:true, devel:true, jquery:true */
/*global browser, document, localStorage, safari, SAFARI, openTab, DS, localize */

document.addEventListener("DOMContentLoaded", function() {
    'use strict';

    function restore_options() {
        let blacklist = localStorage.blacklist,
            selectors = localStorage.elements;

        document.getElementById('openIdUrl').value = localStorage.openIdUrl || '';

        if (localStorage.autoSubmit === 'true') {
            document.getElementById('autoSubmit').checked = true;
        }

        if (blacklist) {
            blacklist = JSON.parse(blacklist);
            blacklist.forEach(function(domain) {
                addElement(domain, 'newDomain', 'domains');
            });
        }
        if (selectors) {
            selectors = JSON.parse(selectors);
            selectors.forEach(function(selector) {
                addElement(selector, 'newSelector', 'selectors');
            });
        }
    }

    function save_options() {
        let blacklist = [],
            elements = [];

        localStorage.openIdUrl = document.getElementById('openIdUrl').value;
        localStorage.autoSubmit = document.getElementById('autoSubmit').checked;

        document.getElementById('domains').childNodes.forEach(function(domain) {
            blacklist.push(domain.innerText);
        });
        localStorage.blacklist = JSON.stringify(blacklist);

        document.getElementById('selectors').childNodes.forEach(function(selector) {
            elements.push(selector.innerText);
        });
        localStorage.elements = JSON.stringify(elements);
    }

    function addElement(element = '', newElementId, containerID) {
        if (element === '') {
            return;
        }

        let closeButton = document.createElement('span'),
            label = document.createElement('span'),
            elementText;

        elementText = document.createTextNode(element);
        closeButton.classList.add('aui-icon', 'aui-icon-close');
        label.classList.add('aui-label', 'aui-label-closeable');
        label.appendChild(elementText);
        label.appendChild(closeButton);

        document.getElementById(containerID).appendChild(label);
        closeButton.addEventListener('click', function(event) {
            removeElement(event.target.parentNode);
        });

        document.getElementById(newElementId).value = '';
        save_options();
    }

    function removeElement(element) {
        element.remove();
        save_options();
    }

    document.getElementById('autoSubmit').addEventListener('change', save_options);
    document.getElementById('openIdUrl').addEventListener('keyup', save_options);
    document.getElementById('addDomain').addEventListener('click', function() {
        addElement(document.getElementById('newDomain').value, 'newDomain', 'domains');
    });
    document.getElementById('addSelector').addEventListener('click', function() {
        addElement(document.getElementById('newSelector').value, 'newSelector', 'selectors');
    });
    document.getElementById('newSelector').addEventListener('keyup', function(event) {
        if (event.keyCode === 13) {
            addElement(event.target.value, 'newSelector', 'selectors');
        }
    });
    document.getElementById('newDomain').addEventListener('keyup', function(event) {
        if (event.keyCode === 13) {
            addElement(event.target.value, 'newDomain', 'domains');
        }
    });
    restore_options();
});
