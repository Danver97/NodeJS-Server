function openTripMap(elem, duration) {
    if(duration == undefined || duration == null || typeof duration != "number")
        duration = 300;
    var finalBoudingRect = elem.parentElement.getBoundingClientRect();
    var finalWidth = finalBoudingRect.width;
    var finalHeight = finalBoudingRect.height;
    var currentBoundingRect = elem.getBoundingClientRect();
    var currentWidth = currentBoundingRect.width;
    var currentHeight = currentBoundingRect.height;
    var currentTop = elem.offsetTop;
    var currentRight = finalWidth - (elem.offsetLeft + currentWidth);
    if (currentTop == 0) 
        return;
    elem.style.borderRadius = "50px";
    var radStr = elem.style.borderRadius;
    //alert("aaaa" + elem.style.borderRadius + " " + radStr.substr(0, radStr.length-2));
    var currentRadius = parseInt(radStr.substr(0, radStr.length-2));
    var heightIncr = (finalHeight - currentHeight)/duration;
    var widthIncr = (finalWidth - currentWidth)/duration;
    var topIncr = ( 0-currentTop)/duration;
    var rightIncr = ( 0-currentRight)/duration;
    var radiusIncr = ( 2-currentRadius)/duration;
    /*alert("suca!" + currentRight + ' ' + currentTop + ' ' + currentWidth + ' ' + currentHeight+"\n" + 
         finalWidth + " " + finalHeight + " " + currentRadius);*/
    //alert(radiusIncr +" "+ topIncr+ " "+ rightIncr+" "+heightIncr+" "+widthIncr);
    
    var arrows = elem.parentElement.getElementsByClassName("arrowimg");
    hide(arrows[0],300);
    hide(arrows[1],300);
    var id = setInterval(openTripMapAnim, 1);
    function openTripMapAnim() {
        if(currentWidth >= finalWidth && currentHeight >= finalHeight && currentTop<=0 && currentRight <= 0 && currentRadius<=2){
            elem.style.right = 0 + 'px';
            elem.style.top = 0 + 'px';
            elem.style.width = finalWidth + 'px';
            elem.style.height = finalHeight + 'px';
            elem.style.borderRadius = 2 + "px";
            clearInterval(id);
            //elem.parentElement.getElementsByClassName("tripmapclose")[0].style.display = "block";
            var x = elem.parentElement.getElementsByClassName("tripmapclose")[0];
            x.style.opacity = 0;
            x.style.display = 'block';
            show(x, 300, 1);
        } else {
            if(currentRight>0){
                currentRight += rightIncr;
                elem.style.right = currentRight + 'px';
            }
            if(currentTop>0){
                currentTop += topIncr;
                elem.style.top = currentTop + 'px';
            }else{
                alert(currentHeight + " "+ finalHeight);
            }
            if(currentWidth <= finalWidth){
                currentWidth += widthIncr;
                elem.style.width = currentWidth + 'px';
            }
            if(currentHeight <= finalHeight){
                currentHeight += heightIncr;
                elem.style.height = currentHeight + 'px';
            }
            if(currentRadius > 2){
                currentRadius += radiusIncr;
                elem.style.borderRadius = currentRadius + "px";
            }
        }
    }
}

function closeTripMap(cross, duration){
    if(duration == undefined || duration == null || typeof duration != "number")
        duration = 300;
    var parent = cross.parentElement;
    var elem = parent.getElementsByClassName("tripmap")[0];
    var finalBoudingRect = parent.getBoundingClientRect();
    var finalWidth = 100;
    var finalHeight = 100;
    var currentBoundingRect = elem.getBoundingClientRect();
    var currentWidth = currentBoundingRect.width;
    var currentHeight = currentBoundingRect.height;
    var currentTop = elem.offsetTop;
    var currentRight = currentWidth - (elem.offsetLeft + currentWidth);
    if (currentTop == 16)
        return;
    //elem.style.borderRadius = "0px";
    var radStr = elem.style.borderRadius;
    var currentRadius = parseInt(radStr.substr(0, radStr.length-2));
    /*alert("suca!" + currentRight + ' ' + currentTop + ' ' + currentWidth + ' ' + currentHeight+"\n" + 
         finalWidth + " " + finalHeight + " " + currentRadius);*/
    var finalRadius = Math.min(finalHeight, finalWidth)/2;
    var heightIncr = (finalHeight - currentHeight)/duration;
    var widthIncr = (finalWidth - currentWidth)/duration;
    var topIncr = (16 - currentTop)/duration;
    var rightIncr = (16 - currentRight)/duration;
    var radiusIncr = (finalRadius - currentRadius)/duration;
    //alert(radiusIncr +" "+ topIncr+ " "+ rightIncr+" "+heightIncr+" "+widthIncr);
    var x = parent.getElementsByClassName("tripmapclose")[0];
    hide(x, 300);
    x.style.display = 'none';
    var id = setInterval(closeTripMapAnim, 5);
    function closeTripMapAnim() {
        if(currentWidth >= finalWidth && currentHeight >= finalHeight && currentTop>=16 && currentRight >= 16 && currentRadius>=50){
            elem.style.right = 16 + 'px';
            elem.style.top = 16 + 'px';
            elem.style.width = finalWidth + 'px';
            elem.style.height = finalHeight + 'px';
            elem.style.borderRadius = finalRadius + "px";
            clearInterval(id);
            var arrows = parent.getElementsByClassName("arrowimg");
            show(arrows[0]);
            show(arrows[1]);
        } else {
            if(currentRight<16){
                currentRight += rightIncr;
                elem.style.right = currentRight + 'px';
            }
            if(currentTop<16){
                currentTop += topIncr;
                elem.style.top = currentTop + 'px';
            }
            if(currentWidth >= finalWidth){
                currentWidth += widthIncr;
                elem.style.width = currentWidth + 'px';
            }
            if(currentHeight >= finalHeight){
                currentHeight += heightIncr;
                elem.style.height = currentHeight + 'px';
            }
            if(currentRadius < 50){
                currentRadius += radiusIncr;
                elem.style.borderRadius = currentRadius + "px";
            }
        }
    }
}

function show(elem, millis, finalOpacity){
    if(finalOpacity == undefined || finalOpacity == null || typeof finalOpacity != "number")
        finalOpacity = 1;
    if(millis == undefined || millis == null || typeof millis != "number")
        millis = 300;
    var opacity = parseInt(elem.style.opacity);
    //alert("start!!" + opacity);
    var inter = setInterval(showAnim, millis/100);
    function showAnim(){
        if(opacity >= finalOpacity){
            clearInterval(inter);
            elem.style.opacity = 1;
            //alert("end!!" + opacity);
        } else {
            opacity += 0.01;
            elem.style.opacity = opacity;
        }
    }
}

function hide(elem, millis){
    if(millis == undefined || millis == null || typeof millis != "number")
        millis = 300;
    var opacity = parseInt(elem.style.opacity);
    //alert("start!!" + opacity);
    var inter = setInterval(showAnim, millis/100);
    function showAnim(){
        if(opacity < 0.01){
            clearInterval(inter);
            elem.style.opacity = 0;
            //alert("end!!" + opacity);
        } else {
            opacity -= 0.01;
            console.log(opacity);
            elem.style.opacity = opacity;
        }
    }
}

function foo(){
    alert("suca!");
}

function getReq(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            var d = document.getElementsByClassName("card2")[0];
            //document.write(this.responseText);
            d.innerHTML = this.responseText;
        }
    };
    xhttp.open("GET", "http://localhost:3000/pace", true);
    xhttp.send();
}