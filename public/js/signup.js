/*var showPwButton = $("#divpassword > img");
var holdShowFlag = false;
var dontShow = "0.5";
var hoverShow = "0.7";
var holdShowPw = "1";
var passwordTextBox = $("#divpassword > .textbox");
var confirmPasswordTextBox = $("#divconfirmpassword > .textbox");

function intializePasswordShowButton(){
    //showPw.css("opacity", dontShow);
    showPwButton.mouseenter(function(){
        if(!holdShowFlag){
            passwordTextBox.attr("type", "text");
            showPwButton.css("opacity", hoverShow);
        }
    });
    showPwButton.mouseleave(function(){
        if(!holdShowFlag){
            passwordTextBox.attr("type", "password");
            showPwButton.css("opacity", dontShow);
        }
    });

    showPwButton.click(function(){
        if(!holdShowFlag){
            //showPw.css("opacity", holdShowPw);
            passwordTextBox.attr("type", "text");
        } else {
            //showPw.css("opacity", dontShow);
            passwordTextBox.attr("type", "password");
        }
        holdShowFlag = toggleHoldShowImg(showPwButton, holdShowFlag);
    });
}

function toggleHoldShowImg(img, holdShowMode){
    if(!holdShowMode)
        img.css("opacity", holdShowPw);
    else
        img.css("opacity", dontShow);
    return !holdShowMode;
}

intializePasswordShowButton();*/
$.getScript('/js/login.js', function() {
    
    var confirmPasswordTextBox = $("#divconfirmpassword > .textbox");

    $(".required > input").focusout(requiredOut);
    passwordTextBox.focusout(passFocusOut);
    confirmPasswordTextBox.focusout(confPassFocusOut);
    $("#divemail > input").focusout(emailNotValid);
    
    $("a").click(function(){
        if(validateEmail($("#divemail > input").val()))
            $(this).attr("href", $(this).attr("href")+"?username="+$("#divemail > input").val());
        else if($("#divfirstname > input").val() != ""){
            $(this).attr("href", $(this).attr("href")+"?username="+$("#divfirstname > input").val());
        }
    });
    
    function emailNotValid(){
        if(!validateEmail($(this).val()) && $(this).val() != ""){
            displayBlock($(this).siblings("p.notvalid"));
            errorCss($(this));
        } else {
            displayNone($(this).siblings("p.notvalid"));
        }
        if(validateEmail($(this).val()))
            correctCss($(this));
    }
    
    function requiredOut(){
        if($(this).val() === "") {
            //$(this).val("Required");
            displayBlock($(this).siblings("p.required"));
            errorCss($(this));
        } else {
            displayNone($(this).siblings("p.required"));
            if($(this).attr("name") === "password")
                correctCss($(this), true);
            else
                correctCss($(this));
        }
    }

    function errorCss(elem){
        elem.css({
            //"border-color": "red"
            "background-color": "#FAEBEB"
        });
    }
    
    function correctCss(elem, isPwTextBox){
        /*elem.css({
            //"border-color": "rgba(0,0,0,0.3)"
            "background-color": "#F9F9F9"
        });*/
        if(isPwTextBox == undefined){
            isPwTextBox = false;
        }
        if(isPwTextBox){
            if(validatePassword(elem.val())){
                elem.css({
                    //"border-color": "rgba(0,0,0,0.3)"
                    "background-color": "#F9F9F9"
                });
            }
            return;
        }
        elem.css({
            //"border-color": "rgba(0,0,0,0.3)"
            "background-color": "#F9F9F9"
        });
    }
    
    function displayBlock(elem){
        elem.css("display","block");
    }
    
    function displayNone(elem){
        elem.css("display","none");
    }
    
    function passFocusOut(){
        confirmedPasswordImg();
        if(!validatePassword($(this).val()) && $(this).val() != ""){
            displayBlock($(this).siblings("p.notvalid"));
            errorCss($(this).val());
        } else {
            displayNone($(this).siblings("p.notvalid"));
        }
        if(validatePassword($(this).val()))
            correctCss($(this).val());
    }

    function confPassFocusOut(){
        confirmedPasswordImg();
        if(validateConfirmPassword($(this).val(), passwordTextBox.val())){
            correctCss($(this));
            displayNone($(this).siblings("p"));
        } else {
            errorCss($(this));
            displayBlock($(this).siblings("p"));
        }
    }

    function confirmedPasswordImg(){
        if(confirmPasswordTextBox.val() === passwordTextBox.val() && 
          confirmPasswordTextBox.val() != "" && 
          passwordTextBox.val() != ""){
            displayBlock($("#divconfirmpassword > img"));
            correctCss(confirmPasswordTextBox);
        } else {
            displayNone($("#divconfirmpassword > img"));
        }
    }
    
    function getQuery(){
        var sPageURL = decodeURIComponent(window.location.search.substring(1));
        var sURLVariables = sPageURL.split('&');
        var query = {};
        sURLVariables.forEach(function(str){
            var pair = str.split('=');
            query[pair[0]] = pair[1];
        });
        return query;//*/
    }
    
    function init(){
        var query = getQuery();
        initValues(query);
        initErrors(query);
    }
    
    function initValues(query){
        if(query.firstname)
            $("#divfirstname > input").val(query.firstname);
        if(query.lastname)
            $("#divlastname > input").val(query.lastname);
        if(query.email)
            $("#divemail > input").val(query.email);
    }
    
    function initErrors(query){
        if(query.eusername){
            displayBlock($("#divusername > p." + query.eusername));
            errorCss($("#divusername > input"));
        }
        if(query.efirstname){
            displayBlock($("#divfirstname > p"));
            errorCss($("#divfirstname > input"));
        }
        if(query.eemail){
            displayBlock($("#divemail > p." + query.eemail));
            errorCss($("#divemail > input"));
        }
        if(query.epassword){
            displayBlock($("#divpassword > p." + query.epassword));
            errorCss($("#divpassword > input"));
        }
        if(query.econfirmpassword){
            displayBlock($("#divconfirmpassword > p"));
            errorCss($("#divconfirmpassword > input"));
        }
    }

    init();//*/
});