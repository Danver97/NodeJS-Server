$(document).ready(function(){
    var currencyDropDownShown = { bool: false };
    var currency = "EUR";
    var currencies = [{
        acronym: "EUR",
        symbol: "€"
    },
    {
        acronym: "USD",
        symbol: "$"
    },
    {
        acronym: "AUD",
        symbol: "$"
    },
    {
        acronym: "GBP",
        symbol: "£"
    }];
    
    currencies.sort(function(a,b){
        if (a.symbol + a.acronym < b.symbol + b.acronym)
            return -1;
        if (a.symbol + a.acronym > b.symbol + b.acronym)
            return 1;
        return 0;
    });
    
    var showCurrencyDropDown = function(currencyDropDownShown) {
        $("#othercurrencies").addClass("show");
        $("#currency").addClass("shadow");
        currencyDropDownShown.bool = true;
    }
    
    var hideCurrencyDropDown = function(currencyDropDownShown) {
        $("#othercurrencies").removeClass("show");
        $("#currency").removeClass("shadow");
        currencyDropDownShown.bool = false;
    }
    
    var buildListCurrencies = function(currencies, currencySelected){
        var list = "<ul>";
        currencies.forEach(function(currency){
            if(currency.acronym != currencySelected){
                list += "<li><a value=\"" + currency.acronym + "\">" + currency.symbol + " (" + currency.acronym + ")</a></li>"
            }
        });
        list += "</ul>";
        return list;
    }
    
    var initCurrenciesInput = function(currencies, currencySelected){
        $("#othercurrencies").html(buildListCurrencies(currencies, currencySelected));
        $("#currency").attr("currency", currencySelected);
        var i = 0;
        while(currencies[i].acronym != currencySelected){
            i++
        }
        $("#currency").val(currencies[i].symbol + " (" + currencies[i].acronym + ")");
    }
    
    var setLinksClickListeners = function(currencies, currency, currencyDropDownShown){
        $("#othercurrencies a").click(function(){
            //$(this).off("click");
            currency = $(this).attr("value");
            $("#othercurrencies").html(buildListCurrencies(currencies, currency));
            $("#currency").attr("currency", currency);
            var i = 0;
            while(currencies[i].acronym != currency){
                i++
            }
            $("#currency").val(currencies[i].symbol + " (" + currencies[i].acronym + ")");
            hideCurrencyDropDown(currencyDropDownShown);
            setLinksClickListeners(currencies, currency, currencyDropDownShown);
        });
    }
    
    var formValidate = function(){
        var send = true;
        
        if(!$("input[name=title]").val()){
            $("input[name=title]").siblings("[alert-error]").css("display","block");
            send = false;
        } else {
            $("input[name=title]").siblings("[alert-error]").css("display","none");
        }
        if($("input[name=headimg]")[0].files.length == 0){
            $("input[name=headimg]").siblings("[alert-error]").css("display","block");
            send = false;
        } else {
            $("input[name=headimg]").siblings("[alert-error]").css("display","none");
        }
        if(!$("input[name=price]").val()){
            $("input[name=price]").parent().siblings("[alert-error]").css("display","block");
            send = false;
        } else {
            $("input[name=price]").parent().siblings("[alert-error]").css("display","none");
        }
        
        var countries = [];
        $(".country").each(function(i, c){
            var country = {};
            country.name = $(this).find("input[name=country]").val();
            country.cities = [];
            $(this).find(".city").each(function(i, cityelem){
                var city = {};
                city.name = $(this).find("input[name=city]").val();
                city.days = $(this).find("input[name=days]").val();
                if(city.name)
                    country.cities.push(city);
            });
            if(country.name){
                countries.push(country);
                return false;
            }
        });
        var sections = [];
        $(".section").each(function(i, c){
            var section = {};
            section.title = $(this).find("input[name=sectiontitle]").val();
            section.description = $(this).find("textarea[name=sectiondescription]").val();
            if($(this).find('input[name=sectionimg]')[0].files.length != 0)
                section.imgurl = $(this).find('input[name=sectionimg]')[0].files[0].name;
            //alert(section.imgurl);
            if(section.title){
                sections.push(section);
                return false;
            }
        });
        
        if(countries.length==0){
            $("#countries > [alert-error]").css("display","block");
            send = false;
        } else
            $("#countries > [alert-error]").css("display","none");
        if(sections.length==0){
            $("#sections > [alert-error]").css("display","block");
            send = false;
        } else 
            $("#sections > [alert-error]").css("display","none");
        return send;
    }
    
    /*$.getJSON( "/currencies/", function(data) {
        if(data instanceof String)
            currencies = JSON.parse(data);
        else
            currencies = data;
    });*/
    
    initCurrenciesInput(currencies, "EUR");
    
    $("#othercurrencies").click(function(event){
        if(!event.isPropagationStopped())
            event.stopPropagation();
    });
    
    $(document.body).click(function(){
        hideCurrencyDropDown(currencyDropDownShown);
    });
    
    $("#currency").click(function(event){
        if(!event.isPropagationStopped())
            event.stopPropagation();
        if(!currencyDropDownShown.bool){
            showCurrencyDropDown(currencyDropDownShown);
        } else {
            hideCurrencyDropDown(currencyDropDownShown);
        }
    });
    
    setLinksClickListeners(currencies, currency, currencyDropDownShown);
    
    $("form").submit(function(e){
        e.preventDefault();
        if(!formValidate())
            return false;
        var formData = new FormData($("form")[0]);
        var countries = [];
        $(".country").each(function(i, c){
            var country = {};
            country.name = $(this).find("input[name=country]").val();
            country.cities = [];
            $(this).find(".city").each(function(i, cityelem){
                var city = {};
                city.name = $(this).find("input[name=city]").val();
                city.days = $(this).find("input[name=days]").val();
                if(city.name)
                    country.cities.push(city);
            });
            if(country.name)
                countries.push(country);
        });
        var sections = [];
        $(".section").each(function(i, c){
            var section = {};
            section.title = $(this).find("input[name=sectiontitle]").val();
            section.description = $(this).find("textarea[name=sectiondescription]").val();
            if($(this).find('input[name=sectionimg]')[0].files.length != 0)
                section.imgurl = $(this).find('input[name=sectionimg]')[0].files[0].name;
            //alert(section.imgurl);
            if(section.title)
                sections.push(section);
        });
        formData.append("currency", currency);
        formData.append("countries", JSON.stringify(countries));
        formData.append("sections", JSON.stringify(sections));
        $.ajax({
            url: '/guides/create/',
            data: formData,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function(data){
                alert(data);
            }
        });
    });
    
});

function addCity(button){
    var newCityHTML = '<div class="city inlinecontainer"><div class="inline"><h5>City:</h5><input class="textbox" type="text" name="city" value=""><br><br></div><div class="inline"><h5>Days:</h5><input type="number" name="days" min="0" max="365" value="1"><br><br></div></div>';
    $(newCityHTML).insertBefore(button);
}

function addCountry(button){
    var newCountryHTML = '<div class="country"><h5>Country:</h5><input class="textbox" type="text" name="country" value=""><br><br><div class="city inlinecontainer"><div class="inline"><h5>City:</h5><input class="textbox" type="text" name="city" value=""><br><br></div><div class="inline"><h5>Days:</h5><input type="number" name="days" min="0" max="365" value="1"><br><br></div></div><input class="addcity" type="button" onclick="addCity(this)" value="Add City"/></div><br>';
    $(newCountryHTML).insertBefore(button);
}

function addSection(button) {
    var newSectionHTML = '<div class="section"><h4>Section:</h4><br><div class="inlinecontainer"><div class="inline"><h5>Section title:</h5><input class="textbox" type="text" name="sectiontitle" value=""><br><br></div><div class="inline"><h5>Image section:</h5><input type="file" name="sectionimg" value=""><br><br></div></div><h5>Section description:</h5><textarea cols="60" rows="4" maxlength="500" name="description"></textarea><br><br></div>';
    $(newSectionHTML).insertBefore(button);
}