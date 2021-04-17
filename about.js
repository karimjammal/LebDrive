let user_signed_in = false;
let name_of_user = null;
let sign_in_btn_class_name = document.getElementById("sign_in_about").className; // This will be used when dealing with the sign in/up button on the about page content

const setCookie = (cname, cvalue, exdays)=>{
    // Set a cookie
    // cname is the cookie name | cvalue is the cookie value | exdays is the expirary date of the cookie
    let d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
};

const getCookie = (cname)=>{
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  };

const deleteCookie = ()=>{
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

if(getCookie("username")!=""){
            let username = getCookie("username");
            document.getElementById("sign_in_nav").style.display = "none";
            document.getElementById("name_of_user").innerText = `${username}  `;
            $("#user_name").fadeIn();
            user_signed_in = true;
            name_of_user = username;
            document.getElementById("sign_in_about").className = document.getElementById("sign_in_about").className + " disabled";
            document.getElementById("sign_in_about").innerText = "Already Signed In";
            document.getElementById("sign_in_about").style.backgroundColor = "lightgreen";
            $("#input_sign_in_username").val("");
            $("#inputPassword").val("");
}

$("a#a_sign_up").click(function(){
    $("#form_signin").fadeOut();
    const e = setInterval(function(){
    if(document.getElementById("form_signin").style.display=="none"){
    document.querySelector("#sign_in_title").innerHTML = "Sign Up";
    $("#form_signup").fadeIn("slow");
    clearInterval(e);
    }
    }, 100);
});

$("a#a_sign_in").click(function(){
    $("#form_signup").fadeOut();
    const e = setInterval(function(){
    if(document.getElementById("form_signup").style.display=="none"){
    document.querySelector("#sign_in_title").innerHTML = "Sign In";
    $("#form_signin").fadeIn("slow");
    
    $("#input_sign_up_username").val("");
    $("#sign_up_inputPassword").val("");
    $("#sign_up_ccinputPassword").val("");
    clearInterval(e);
    }
    }, 100);
});

$("#btn_form_submit_sign_in").on("click", function(){
    // For sign in forms
    $.ajax({
        url:"http://localhost/Web%20Project/database.php",
        type:"GET",
        data: {username: $("#input_sign_in_username").val(),
               password: $("#inputPassword").val()},
        dataType:'text',
        success:function(obj){
            if(obj==1){
            let username = $("#input_sign_in_username").val();
            $("#sign_in_nav").fadeOut();
            document.getElementById("form_btn_close").click();
            document.getElementById("name_of_user").innerText = `${username}  `;
            $("#user_name").fadeIn();
            user_signed_in = true;
            name_of_user = username;
            toastr.success(`Welcome ${username}`);
            $("#input_sign_in_username").val("");
            $("#inputPassword").val("");
            setCookie("username", name_of_user, 1);
            // Disabling the sign in/up button on the about content page
            document.getElementById("sign_in_about").className = document.getElementById("sign_in_about").className + " disabled";
            document.getElementById("sign_in_about").innerText = "Already Signed In";
            document.getElementById("sign_in_about").style.backgroundColor = "lightgreen";
            }

            else if(obj==-1){
                toastr.warning('Incorrect Password !');
                $("#inputPassword").val("");
            }

            else{
                toastr.warning('Incorrect Username !');
                $("#input_sign_in_username").val("");
                $("#inputPassword").val("");
            }
        },
        error: function(errorObj,txt){
            alert(errorObj.status+" "+errorObj.statusText);
        }
    });

});

$("#btn_form_submit_sign_up").on("click", function(){
    // For sign up form
    if($("#input_sign_up_username").val()==""){
        toastr.error("Username must not be empty");
        return;
    }

    if($("#sign_up_inputPassword").val().length <=5){
        toastr.error("Password must be greater than 5 characters");
        return;
    }

    $.ajax({
        url:"http://localhost/Web%20Project/database.php",
        type:"POST",
        data: {username: $("#input_sign_up_username").val(),
               password: $("#sign_up_inputPassword").val(),
               ccpassword: $("#sign_up_ccinputPassword").val(),
               signupreq: "true"},
        dataType:'text',
        success:function(obj){
            if(obj==1){
            let username = $("#input_sign_up_username").val();
            toastr.success(`User: ${username} successfully added`);
            document.getElementById("a_sign_in").click();
            $("#input_sign_up_username").val("");
            $("#sign_up_inputPassword").val("");
            $("#sign_up_ccinputPassword").val("");
            }

            else if(obj==-1){
                toastr.warning('Username already exists');
            }

            else{
                toastr.warning('Incorrect Passwords !');
            }
        },
        error: function(errorObj,txt){
            alert(errorObj.status+" "+errorObj.statusText);
        }
    });

});


$("a#sign_out").on("click", function(){
    toastr.success(`${name_of_user} has signed out`);
    user_signed_in = false;
    name_of_user = null;
    $("#user_name").fadeOut();
    $("#sign_in_nav").fadeIn();
    deleteCookie();

    document.getElementById("sign_in_about").className = sign_in_btn_class_name;
    document.getElementById("sign_in_about").innerText = "Sign In/Up";
    document.getElementById("sign_in_about").style.backgroundColor = "";
});

$("#view_profile").on("click", function(){
    document.getElementById("profile_name").innerText = `${name_of_user}'s Profile`;
    $.ajax({
        url:"http://localhost/Web%20Project/database.php",
        type:"POST",
        data: {username: name_of_user},
        dataType:'json',
        success:function(obj){
            document.getElementById("high_score").innerText = `${obj[0].high_score}/30`;
            if(obj[0].high_score<24){
                document.getElementById("is_ready_for_test").innerText = "NOT YET !";
                document.getElementById("is_ready_for_test").style.color = "red";
            }

            else{
                document.getElementById("is_ready_for_test").innerText = "Yes, Good Luck !";
                document.getElementById("is_ready_for_test").style.color = "green";
            }
        },
        error: function(errorObj,txt){
            alert(errorObj.status+" "+errorObj.statusText);
        }
    });
});

$("#view_team").click(function() {
    $('html,body').animate({
        scrollTop: $("#team").offset().top},
        'slow');
});