'use strict';

$('document').ready(function() {
    $.each($('.markdown-editor'), function(index, item) {
        primeEditorPane($(item));
    });
});

var primeEditorPane = function(parent) {
    var tab_buttons = $('.tab-button', parent);

    tab_buttons.on('click', function(e) {
        e.preventDefault();        
        tab_buttons.removeClass('tab-button--active');
        $(this).addClass('tab-button--active');
        var which = $(this).data('show');
        toggleEditorPane(which, parent);
    });
};

var toggleEditorPane = function(which, parent) {
    // console.log('toggleEditorPane, which = ' + which);
    var formatting = $("#wmd-button-row, div.markdown-help");

    if(!$('.' + which).length) {
        console.warn('Could not find the pane with class: ', which);
        return;
    }

    else if (which === 'editor-pane--preview') { 
        $('div.markdown-help').hide();
        $("#wmd-button-row").hide();
    }

    // making the selection 'sticky'
    else if ( formatting.hasClass('help-on') ) {
        formatting.show();
    }

    $('.editor-pane', parent).removeClass('editor-active');
    $('.' + which, parent).addClass('editor-active');

};

function toggleHelp(e) {
    e.preventDefault();
    var formatting = $("#wmd-button-row, div.markdown-help");
    formatting.slideToggle().toggleClass('help-on');
};

$("a.markdown-guide").on('click', toggleHelp);