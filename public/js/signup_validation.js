function validateForm() {
    var send = true;
    var pw = "";
    $(".required > input, .confirm > input").each(function(){
        if($(this).val() == "" || $(this).val() == "Required" || $(this).val() == "Confirm password")
            send = false;
        if($(this).attr("name") === "password")
            pw = $(this).val();
        if($(this).attr("name") === "confirmpassword" && $(this).val() != pw)
            send = false;
    });
    
    return send;
}

function validateEmail(email){
    var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg.test(email);
}

function validatePassword(pw){
    //(?=.*[A-Z])
    var reg = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z_\.]{8,}$/;
    return reg.test(pw);
}

function validateConfirmPassword(pw, cpw){
    return (pw === cpw && cpw != "");
}