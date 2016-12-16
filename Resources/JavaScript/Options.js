/*jshint bitwise:true, curly:true, eqeqeq:true, forin:true, globalstrict: true,
 latedef:true, noarg:true, noempty:true, nonew:true, undef:true, maxlen:256,
 strict:true, trailing:true, boss:true, browser:true, devel:true, jquery:true */
/*global browser, document, localStorage, safari, SAFARI, openTab, DS, localize */

jQuery(document).ready(function($) {
    'use strict';

    function addItem(id, value) {
        var opt = document.createElement('option');
        document.getElementById(id).options.add(opt);
        opt.value = value;
        opt.text = value;
    }

    function restore_options() {
        var openIdUrl = localStorage.openIdUrl,
            elements = localStorage.elements,
            i;

        if (!openIdUrl) {
            openIdUrl = 'http://example.com/exampleuser';
        }
        $('#openIdUrl').val(openIdUrl);

        if (localStorage.autoSubmit === 'true') {
            $('#autoSubmit').prop('checked', 'true');
        }

        if (elements) {
            elements = JSON.parse(elements);
            for (i = 0; i < elements.length; i += 1) {
                addItem('elementBox', elements[i]);
            }
        }
    }

    function save_options() {
        var elementBox = document.getElementById('elementBox'),
            elements = [],
            i;

        localStorage.openIdUrl = $('#openIdUrl').val();

        localStorage.autoSubmit = $('#autoSubmit').is(':checked');

        for (i = 0; i < elementBox.length; i += 1) {
            elements.push(elementBox.options[i].value);
        }
        localStorage.elements = JSON.stringify(elements);
    }

    function addElement() {
        var elementText = document.getElementById('newElement').value;
        addItem('elementBox', elementText);
        save_options();
        document.getElementById('newElement').value = '';
        save_options();
    }

    function removeSelectedElement() {
        var elementBox = document.getElementById('elementBox'),
            i;
        for (i = elementBox.length - 1; i >= 0; i -= 1) {
            if (elementBox.options[i].selected) {
                elementBox.remove(i);
            }
        }
        save_options();
    }

    $('#autoSubmit').change(function() {
        save_options();
    });

    $('#openIdUrl').keyup(function() {
        save_options();
    });
    $('#add-element').click(addElement);
    $('#remove-element').click(removeSelectedElement);
    $('#save-options').click(save_options);
    restore_options();
});
