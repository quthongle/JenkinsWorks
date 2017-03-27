$(document).ready(function() {
    $("[class='remove-tutorial-content']").on('click', function(e) {
        var csrftoken = getCookie('csrftoken');
        var remove_type = $(this).attr('value');
        var id = $(this).attr('id').split("_")[0];

        $.ajax({
          url : "/tutorials/remove",
          type : "POST",
          dataType : "json",
          data : {
            remove_type : remove_type,
            id : id,
            csrfmiddlewaretoken : csrftoken
          },
          success : function(json) {
            window.location.replace(location.pathname);
          },
          error : function(xhr,errmsg,err) {
            console.log(xhr.status)
          }
        });
        return false;
    })
});

// Flag and unflag tutorial comments.
$(document).ready(function () {
    $("[class='flag-content-class']").on('click', function (e) {
        var csrftoken = getCookie('csrftoken');
        var flag = $(this).attr('value');
        var flag_type = $("#" + $(this).attr('id').split("_")[0] + "_id_flag_type").attr('value')
        var id = $(this).attr('id').split("_")[0]

        if(flag_type == "tutorial_comment") {
            var tutorial_id = $("#"+id+"_id_tutorial_flag").attr('value')
            var comment_id = $("#"+id+"_id_comment_flag").attr('value')
        }

        $.ajax({
                url : "/tutorials/flag",
                type : "POST",
                dataType: "json",
                data : {
                flag : flag,
                flag_type : flag_type,
                comment_id : comment_id,
                tutorial_id : tutorial_id,
                csrfmiddlewaretoken: csrftoken
            },
            success : function(json) {
                if(flag_type == "tutorial_comment") {
                    if(flag == 'true') {
                        $("a[id$="+comment_id+"_flag]").html('<i class="fa fa-flag"></i> remove flag');
                        $("a[id$="+comment_id+"_flag]").attr("value", "false")
                    }
                    else if (flag == 'false') {
                        $("a[id$="+comment_id+"_flag]").html('<i class="fa fa-flag-o"></i> flag this comment');
                        $("a[id$="+comment_id+"_flag]").attr("value", "true")
                    }
                }
            },
            error : function(xhr,errmsg,err) {
                console.log(xhr.responseText)
            }
        });
        return false;
    });
});

$(document).ready(function() {
    $("#publish-button").click(function() {
        var csrftoken = getCookie('csrftoken');
        var tutorial_id = $("#id_tutorial").val()
        var flag = $(this).attr('value')

        $.ajax({
                url : "/tutorials/publish",
                type : "POST",
                dataType: "json",
                data : {
                tutorial_id : tutorial_id,
                flag : flag,
                csrfmiddlewaretoken: csrftoken
            },
                success : function(json) {
                    window.location.replace(window.location.pathname);
            },
                error : function(xhr,errmsg,err) {
                    console.log(xhr.status)
            }
        });
        return false;
    })
});

/**
 *  Difficulty buttons on the tutorials view
 *  We need this to mimic the behaviour of radio
 *  buttons which cannot be styled. 
 */
$(document).ready(function() {
    addButtons('#id_difficulty');

    $('.difficulty').on('click', function(e) {
        e.preventDefault();
        $('.difficulty').removeClass('selected');
        setDifficulty($(this));
    });
});

var addButtons = function(py_radio_field) {
    var container       = $(py_radio_field),
        radiobuttons    = $('input[type="radio"]', container),
        checkedvalue    = $('input[type="radio"][checked]').val(),
        selected = '';

    if(!radiobuttons.length) return;

    $.each(radiobuttons, function(index, item) {
        if(checkedvalue === item.value) { 
            selected = 'selected';
        }
        else {
            selected = '';
        } 
        container.append('<button tabindex="-1" class="btn-choice difficulty ' + selected + '" data-value="' + item.value + '" title="' + item.value + '" />');
    });
    $('button.selected', py_radio_field).addClass('selected').prevAll().addClass('selected');
};

var setDifficulty = function(selected_button) {
    
    var value   = selected_button.data('value'),
        options = $('input[type="radio"]', selected_button.siblings('li')),
        radio   = $('input[type="radio"][value="' + value + '"]');
    
    radio.prop('checked', true);
    selected_button.addClass('selected').prevAll().addClass('selected');
};
