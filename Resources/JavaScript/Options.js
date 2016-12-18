/*jshint bitwise:true, curly:true, eqeqeq:true, forin:true, globalstrict: true,
 latedef:true, noarg:true, noempty:true, nonew:true, undef:true, maxlen:256,
 strict:true, trailing:true, boss:true, browser:true, devel:true, jquery:true */
/*global browser, document, localStorage, safari, SAFARI, openTab, DS, localize */

document.addEventListener("DOMContentLoaded", function() {
    'use strict';

    function restore_options() {
        let selectors = localStorage.elements;

        document.getElementById('openIdUrl').value = localStorage.openIdUrl;

        if (localStorage.autoSubmit === 'true') {
            document.getElementById('autoSubmit').checked = true;
        }

        if (selectors) {
            selectors = JSON.parse(selectors);
            selectors.forEach(function(selector) {
                addSelector(selector);
            });
        }
    }

    function save_options() {
        let selectorBox = document.getElementById('selectors'),
            elements = [];

        localStorage.openIdUrl = document.getElementById('openIdUrl').value;
        localStorage.autoSubmit = document.getElementById('autoSubmit').checked;

        if (selectorBox) {
            selectorBox.childNodes.forEach(function(selector){
                elements.push(selector.innerText);
            });
        }
        localStorage.elements = JSON.stringify(elements);
    }

    function addSelector(selector = '') {
        if (selector === '') {
            return;
        }

        let closeButton = document.createElement('span'),
            label = document.createElement('span'),
            elementText;

        elementText = document.createTextNode(selector);
        closeButton.classList.add('aui-icon', 'aui-icon-close');
        label.classList.add('aui-label', 'aui-label-closeable');
        label.appendChild(elementText);
        label.appendChild(closeButton);

        document.getElementById('selectors').appendChild(label);
        closeButton.addEventListener('click', function(event) {
            removeSelector(event.target.parentNode);
        });

        document.getElementById('newSelector').value = '';
        save_options();
    }

    function removeSelector(element) {
        element.remove();
        save_options();
    }

    document.getElementById('autoSubmit').addEventListener('change', save_options);
    document.getElementById('openIdUrl').addEventListener('keyup', save_options);
    document.getElementById('add-element').addEventListener('click', function() {
        addSelector(document.getElementById('newSelector').value);
    });
    document.getElementById('newSelector').addEventListener('keyup', function(event) {
        if (event.keyCode === 13) {
            addSelector(event.target.value);
        }
    });
    restore_options();
});
