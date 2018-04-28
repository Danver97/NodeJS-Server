$(document).ready(function(){
    var formValidate = function(){
        var send = true;
        $(".required").each(function(){
            if(!$(this).val()){
                $(this).find("[alert-error]").css("display","block");
                send = false;
            }
        });
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
            section.description = $(this).find("input[name=sectiondescription]").val();
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
        }
        if(sections.length==0){
            $("#sections > [alert-error]").css("display","block");
            send = false;
        }
        return send;
    }
    
    
}