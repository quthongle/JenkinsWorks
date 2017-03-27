// used for alternative to floating global nav
function changeAffix(){
    // Removing navbar-fixed-top from main navbar and fixing offset
    $('.navbar').removeClass('navbar-fixed-top affix-top').removeAttr('data-spy');
    $('.navbar').attr("style", "margin-top: -80px");

    //Setting default offset for tutorial title bar
    $('.row.floating-title').attr('data-offset-top', $('.row.floating-title').offset().top);
};

// Applying navbar-fixed-top class to tutorial bar, showing logo, profile, and calculating positions and showing comment and top link
function altAffix() {
    $('#floating-heading').removeClass('col-md-11').addClass('col-md-8');        
    $('.row.floating-title').addClass('navbar-fixed-top');
    $('#floating-profile').addClass('col-md-3').fadeIn(450);
    $('#floating-logo').fadeIn(450);
    $('#floating-comment').addClass('navbar-fixed-top').attr('style', 'margin-top: ' + ($('.row.floating-title').height() + 40) + 'px').fadeIn(500);
    $('#floating-top').addClass('navbar-fixed-top').fadeIn(500);
    return false;
};

function revertAffix() {
    $('.row.floating-title').removeClass('navbar-fixed-top');
    $('#floating-logo').fadeOut(350);
    $('#floating-comment').removeClass('navbar-fixed-top').hide();
    $('#floating-top').removeClass('navbar-fixed-top').hide();
    $('#floating-profile').fadeOut(0).removeClass('col-md-3');
    $('#floating-heading').removeClass('col-md-8').addClass('col-md-11');
    return false;
};

// Scroll to comments on click
function scrollToComments() {
    $('body').animate({
        scrollTop: $('.comments').offset().top - $('.row.floating-title').height()
        }), 450;
    return false;
};

// Scroll on top on click
function scrollToTop() {
    $('body').animate({scrollTop:0},450);
    return false;
};

function stopScroll() {
    console.log('Scroll has been stopped');
    var viewportHeight = $(window).height();
    var actionsArea = $(window).scrollTop() + viewportHeight;
    var safeBottom = $(document).height() - 90;
    var safeTop = $('.row.metadata').offset().top;
    var safeTopToo = $('.row.floating-title').hasClass('affix-top');

    if( actionsArea > safeBottom ) {
        console.log('Fadeout: 1');
        $('#floating-top').css('top',viewportHeight - 220).animate(500);
        $('#floating-comment').fadeOut(350);
    }
    else if ( actionsArea < safeBottom && safeTop < 100 ){
        console.log('Fadein: 2');
        $('#floating-top').css('top','') // clear 'top'
        $('#floating-comment').fadeIn();
    }
    else if ( safeTopToo == true || safeTop > 100 ) {
        console.log('Fadeout: 3');
        $('#floating-comment').fadeOut(3350);
    }
    else {
        console.log('Fadeout: 4');
        $('#floating-comment').fadeOut(3350);       
    };
};

// change the affixed element
$(document).ready(changeAffix);

// Executes when tutorial title bar reaches top of the screen
$('.row.floating-title').on('affixed.bs.affix', altAffix);

// Reverting all made in previous function
$('.row.floating-title').on('affixed-top.bs.affix', revertAffix);

// Sidebar nav links
$('#floating-comment').on('click', scrollToComments);
$('#floating-top').on('click', scrollToTop);

// Adjust location of 'back to top' near the bottom of the page and toggle 'comments' link
$(window).scroll(function(){
    //clear the timeout
    clearTimeout(window.scroll_timeout); 
    
    window.scroll_timeout = setTimeout(function() { 
        // function to call
        stopScroll();
    // wait to fire
    }, 20);

});
