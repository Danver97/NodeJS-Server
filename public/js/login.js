var showPwButton = $("#divpassword > img");
var holdShowFlag = false;
var dontShow = "0.5";
var hoverShow = "0.7";
var holdShowPw = "1";
var passwordTextBox = $("#divpassword > .textbox");

/*if($("a.signup") != undefined){//*/
$("#divusername > input").focusout(function(){
    var url = "/signup/"
    if(validateEmail($("#divusername > input").val())){
        url + "?email=" + $("#divusername > input").val();
    }
    else if($("#divusername > input").val() != ""){
        url + "?firstname=" + $("#divusername > input").val();
    }
    //alert($("a.signup").text());
    $("a.signup").attr("href", url);
});
//}//*/

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

intializePasswordShowButton();