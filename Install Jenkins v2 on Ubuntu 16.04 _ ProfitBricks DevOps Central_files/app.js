var vote_up_click = 1;
var vote_down_click = 1;
var vote_count = 0

function insertTextAtCursor(el, text) {
    if(el.selectionEnd === 'undefined') {
        console.warn('This function needs to be used on a textarea or input type text.');
        return;
    }
    var currentValue        = el.value,
        cursorRangeEnd      = el.selectionEnd,
        beginning,
        end;

    beginning = currentValue.slice(0, cursorRangeEnd);
    end = currentValue.slice(cursorRangeEnd);
    el.value = beginning + text + end;
};

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
function cast_vote(vote, user_id, question_id, answer_id, clear) {
    var csrftoken = getCookie('csrftoken');

    $.ajax({
            url : "/vote_json",
            type : "POST",
            dataType: "json",
            data : {
            vote : vote,
            user_id : user_id,
            question_id : question_id,
            answer_id : answer_id,
            clear : clear,
            csrfmiddlewaretoken: csrftoken
        },
            error : function(xhr,errmsg,err) {
                console.log(xhr.status)
        }
    });
    return false;
}
function set_vote_page(direction, answer_id) {
    if(direction == "up") {
        vote_up_click = 2
        vote_down_click = 2
        $("#"+answer_id+"_vote_up").addClass('clear')
    }
    else if(direction == "down") {
        vote_down_click = 2
        vote_up_click = 2

        $("#"+answer_id+"_vote_down").addClass('clear')
    }
}
function has_user_voted(user_id, question_id) {
    var csrftoken = getCookie('csrftoken');
    var direction
    var answer_id

    $.ajax({
        url : "/has_voted_json",
        type : "POST",
        dataType : "json",
        data : {
            user_id : user_id,
            question_id : question_id,
            csrfmiddlewaretoken : csrftoken
        },
            success : function(json) {
                set_vote_page(json['direction'], json['answer_id'])
        }
    })
}
function has_accepted_answer(user_id, question_id) {
    var csrftoken = getCookie('csrftoken');
    var accepted_status
    var direction
    var answer_id
/**
    $.ajax({
        url : "/has_accepted_answer",
        type : "POST",
        dataType : "json",
        data : {
            user_id : user_id,
            question_id : question_id,
            csrfmiddlewaretoken : csrftoken
        },
            success : function(json) {
                if(json['accepted_status'] == true) {
                    $("[class='accepted-answer-class']").attr("value","disabled");
                    $("a#"+json['answer_id']+"_id_accept.accepted-answer-class").attr("value","false");
                }
            }
    })
**/             
}
/**
 *  Add target=_blank to all links marked as external
 */
$('a[rel="external"]').prop('target', '_blank');

$(document).ready(function() {
     if ( $('.multiselect').multiselect ) {
         $('.multiselect').multiselect({

             numberDisplayed: 10,
             buttonClass: 'btn btn-link',
             nonSelectedText: 'No tags',
             enableFiltering: true,
             maxHeight: 200,
         })
     }
});

$(document).ready(function() {
    $("[class='remove-content']").on('click', function(e) {
        var csrftoken = getCookie('csrftoken');
        var remove_type = $(this).attr('value');
        var id = $(this).attr('id').split("_")[0];

        $.ajax({
          url : "/remove",
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

$(document).ready(function(){
    $("[class='vote up']").on('click',function(e) {
        var question_id = $(this).attr('value').split("_")[0]
        var answer_id = $(this).attr('id').split("_")[0]
        var user_id = $("#"+answer_id+"_user_id").attr('value')
        var current_count = $("[class='"+answer_id+"_vote_count']").text()
        vote_count = parseInt(current_count)

        if($("#"+answer_id+"_vote_down").attr('class') == "vote down clear") {
            vote_down_click = 2
            vote_up_click = 2
            vote = 2
            vote_count = vote_count + 2

            $("#"+answer_id+"_vote_down").removeClass('clear')
            $(this).addClass('clear')
            cast_vote(vote, user_id, question_id, answer_id, false)
            $("[class='"+answer_id+"_vote_count']").text(vote_count)
        }
        else if(vote_up_click == 1) {
            vote_up_click = 2
            vote_down_click = 2
            vote = 1
            vote_count = vote_count + 1

            cast_vote(vote, user_id, question_id, answer_id, false)
            $("[class='"+answer_id+"_vote_count']").text(vote_count)

            $(this).addClass('clear')
        }
        else if (vote_up_click == 2) {
            if($(this).attr('class') == "vote up clear") {
                vote_up_click = 1
                vote_down_click = 1
                vote = -1
                vote_count = vote_count - 1

                cast_vote(vote, user_id, question_id, answer_id, true)
                $("[class='"+answer_id+"_vote_count']").text(vote_count)

                $(this).removeClass('clear')
            }
        }
    }),
    $("[class='vote down']").on('click',function(e) {
        var question_id = $(this).attr('value').split("_")[0]
        var answer_id = $(this).attr('id').split("_")[0]
        var user_id = $("#"+answer_id+"_user_id").attr('value')
        var current_count = $("[class='"+answer_id+"_vote_count']").text()
        vote_count = parseInt(current_count)

        if($("#"+answer_id+"_vote_up").attr('class') == "vote up clear") {
            vote_down_click = 2
            vote_up_click = 2
            vote = -2
            vote_count = vote_count - 2

            $("#"+answer_id+"_vote_up").removeClass('clear')
            $(this).addClass('clear')

            cast_vote(vote, user_id, question_id, answer_id, false)
            $("[class='"+answer_id+"_vote_count']").text(vote_count)
        }
        else if(vote_down_click == 1) {
            vote_down_click = 2
            vote_up_click = 2
            vote = -1
            vote_count = vote_count - 1

            cast_vote(vote, user_id, question_id, answer_id, false)
            $("[class='"+answer_id+"_vote_count']").text(vote_count)
            $(this).addClass('clear')
        }
        else if(vote_down_click == 2) {
            if($(this).attr('class') == "vote down clear") {
                vote_down_click = 1
                vote_up_click = 1
                vote = 1
                vote_count = vote_count + 1
                
                cast_vote(vote, user_id, question_id, answer_id, true)
                $("[class='"+answer_id+"_vote_count']").text(vote_count)
                $(this).removeClass('clear')

            }
        }
    })
});

// getElementsByClassName html collection -> to an array
function classy(sel){
    return Array.prototype.slice.call(document.getElementsByClassName(sel))
}
// Reset all the "Accept this answer" links in metadata actions
function mkacceptlinks(){
    var acceptlinks=classy('accepted-answer-class')
    var fa_check= "<i class='fa fa-check'></i>"
    // console.log(acceptlinks);

    acceptlinks.map(function(el){   
        el.innerHTML = fa_check+" accept this answer "; // toggle links 
        el.setAttribute('value',"false") }) // sets other links to false
}


// clears the accepted ticmark from answers
function clearmarks(){
    var tics=classy('ticmark')
    tics.map(function(el){ el.className=""; el.className='ticmark'})

    var labs=classy('label')
    labs.map(function(el){ el.className=""; el.className='label'})
}


// marks accepted answer
function ticmark(answer_id){
    
    if (answer_id){ 
        var aspan=document.getElementById(answer_id+"-span")
        aspan.className="ticmark glyphicon glyphicon-ok-circle"

        var adiv=document.getElementById(answer_id+"-label")
        adiv.className="label accepted"
    }                  
}   

function mkaccepted(answer_id,accept_answer){
    if(accept_answer == 'true'){
        mkacceptlinks()
        var wasaccepted=document.getElementById(answer_id+"_id_accept")
        var fa_check= "<i class='fa fa-check-circle'></i>"
        wasaccepted.innerHTML=fa_check+" answer accepted"
        wasaccepted.setAttribute('value',"true")    
    }
    else if (accept_answer == 'false'){ 
        console.log('you pressed un-accept');
        var wasaccepted=document.getElementById(answer_id+"_id_accept")
        var fa_check= "<i class='fa fa-check-circle'></i>"
        wasaccepted.innerHTML=fa_check+" answer no longer accepted"
        wasaccepted.setAttribute('value',"false")  
    }
    // clearmarks()
    // ticmark(ganswer_id)  
}   


$(".accepted-answer-class").on('click', function(e) {
    var csrftoken = getCookie('csrftoken');
    var accept_answer = $(this).attr('value');
    var id = $(this).attr('id').split("_")[0]
    var answer_id = $("#"+id+"_id_answer_accept").attr('value')
    mkaccepted(answer_id,accept_answer) // showing it before POSTing it in the $.ajax           
    var question_id = $("#"+id+"_id_question_accept").attr('value')
   // var selector = 'div.div-answer a#'+answer_id;
    
    $.ajax({
            url : "/accept_answer_json",
            type : "POST",
            dataType: "json",
            data : {
            accept_answer : accept_answer,
            question_id : question_id,
            answer_id : answer_id, 
            csrfmiddlewaretoken: csrftoken
        },
            success : function(json) {
                // console.log('success '+answer_id+' value = '+accept_answer);
                window.location.reload();       
        },
            error : function(xhr,errmsg,err) {
                console.log(xhr.status)
        }
    });
    
    return false;
});

$(document).ready(function() {
    var tag_list = []
    $("[name='tag']").on('click', function (e) {
        tag_value = $(this).attr('value')

        if($(this).attr('class') == "form-control input-lg active") {
            $(this).removeClass("active")
            var index = tag_list.indexOf(tag_value)

            if (index > -1) {
                tag_list.splice(index, 1)
            }
        }
        else {
            $(this).addClass("active")
            tag_list[tag_list.length] = tag_value
        }
    }),
    $("[id='filter-by-tags']").click(function() {
        window.location = '/community/tags/' + tag_list.join('+')
    });
});


$(function(){
  var host = location.hostname;
  var eshost = site_settings.ES_HOST || host;
  var esport = site_settings.ES_PORT || '9200';
  var esproto = site_settings.ES_PROTO || 'http';
  var espath = site_settings.ES_PATH || '';

  var box = $('#search');
  var res_box = null;
  var box_val = '';
  var isOpen = false;
 
  box.on('input keyup focus click', handle_search_box);
  $(document).click(function(){
    isOpen = false;
    box.popover('hide');
  });

  box.popover({
    html:true,
    placement:'bottom',
    trigger:'manual', 
    template:'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="search_results popover-content"></div></div>',
    content:' '
  });

  function handle_search_box(evt) {
    if(isOpen && evt.type==='click') {
      evt.stopPropagation();
      return;
    }

    var val = this.value;

    if(!isOpen && val.length>2) {
     isOpen = true;
     box.popover('show');
    }

    if(box_val===val && evt.type!=='focus') return;
    if(val.length<3) {
      return;
    }

    box_val = val;

    if(!res_box) {
      res_box = $('.search_group .search_results');
      res_box.click(function(evt){
        evt.stopPropagation();
      });
    }

    var search_endpoint = esproto+'://'+eshost+':'+esport+espath+'/community/web/_search?_source=url,description,title';
    $.ajax(search_endpoint, {
      success:handle_search_results,
      error:handle_search_error,
      cache:false,
      contentType:'application/json',
      //data:'{"query":{"match_phrase_prefix":{"body":{"query":"'+val+'", "slop":10}}}, "highlight":{"fields":{"title":{}}}}',
      //data:'{"query":{"multi_match":{"query":"'+val+'", "fields":["title", "url", "description", "body", "keywords", "author"]}}, "highlight":{"fields":{"title":{}}}}',
      data:'{"query":{"multi_match":{"query":"'+val+'", "fuzziness":"AUTO", "fields":["title", "url", "description", "body", "keywords", "author"]}}, "highlight":{"fields":{"title":{}}}}',
      //data:'{"query":{"match":{"body":"'+val+'"}}}',
      dataType:'json',
      type:'POST'
    });

  }

  function handle_search_results(resp) {
    var hits = resp.hits.hits;
    var total = resp.hits.total;
    var host = location.host;
    var proto = location.protocol;
    var baseurl = proto+'//'+host+'/';
    var cats = {};

    for(var i=0; i<hits.length; i++) {
      var hit = hits[i];
      var src = hit._source;
      var url = src.url;
      var cat = url.split('/')[3]||'';
      if(cats[cat]===undefined) cats[cat] = [];
      cats[cat].push(hit);
    }

    res_box.empty();
    for(var c in cats) {
      var chits = cats[c];
      var str = '';
      res_box.append('<h2 class="results_title">'+c+'</h2>');
      for(var i=0; i<chits.length; i++) {
        var hit   = chits[i];
        var src   = hit._source;
        var hlgt  = hit.highlight||{};
        var url   = src.url;
        var desc  = src.description;
        var title = hlgt.title?hlgt.title[0].split(' | ')[0]:src.title.split(' | ')[0];
        var idx   = hit._index;
        var type  = hit._type;
        var cat   = url.split('/')[3]||'';
  
        var header = '<h2><a href="'+url+'" title="'+desc+'">'+title+'</a></h2>';
        var meta   = '';
        str += header+meta;
      }
      res_box.append(str);
    }
    if(!hits.length) show_no_results_msg();
  }

  function handle_search_error(err) {
    console.log(err);
    show_error_msg();
  }

  function show_error_msg() {
    res_box.empty();
    res_box.append('<h2>An error has occurred</h2>');
  }

  function show_no_results_msg() {
    res_box.empty();
    res_box.append('<h2>No results found</h2>');
  }

});
