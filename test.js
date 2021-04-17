let test_over = false;
let time_is_up = false;
let user_signed_in = false;
let name_of_user = null;

$("body").fadeIn("slow");

const setCookie = (cname, cvalue, exdays) => {
    // Set a cookie
    // cname is the cookie name | cvalue is the cookie value | exdays is the expirary date of the cookie
    let d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
};

const getCookie = (cname) => {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
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

const deleteCookie = () => {
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

if (getCookie("username") != "") {
    let username = getCookie("username");
    document.getElementById("sign_in_nav").style.display = "none";
    document.getElementById("name_of_user").innerText = `${username}  `;
    $("#user_name").fadeIn();
    user_signed_in = true;
    name_of_user = username;
    $("#input_sign_in_username").val("");
    $("#inputPassword").val("");
}

$("#press").on("click", function (e) {
    e.preventDefault();
    $.ajax({
        url: "http://localhost/Web%20Project/test.php",
        type: "GET",
        dataType: 'json',
        success: function (obj) {
            for (let i = 0; i < obj.length; i++) {
                let q = obj[i].question;
                let cans = obj[i].correct_answer;
                let ans2 = obj[i].answer2;
                let ans3 = obj[i].answer3;
                let choice1 = parseInt(Math.random() * 50);
                let choice2 = parseInt(Math.random() * 50);
                let choice3 = parseInt(Math.random() * 50);
                let form = document.querySelector("#ans");
                let header_question = document.createElement("h3");
                header_question.id = "question";
                header_question.innerText = `Question ${i + 1}: ${q}`;
                form.appendChild(header_question);

                let rad1 = document.createElement("input");
                let rad2 = document.createElement("input");
                let rad3 = document.createElement("input");
                rad1.type = "radio";
                rad2.type = "radio";
                rad3.type = "radio";
                rad1.name = rad2.name = rad3.name = i;
                rad1.id = `answer1_${i}`;
                rad2.id = `answer2_${i}`;
                rad3.id = `answer3_${i}`;
                for (let j = 0; j < 3; j++) {
                    if (choice1 > choice2 && choice1 > choice3) {
                        let answer = document.createElement("label");
                        let br = document.createElement("br");
                        answer.htmlFor = `answer1_${i}`;
                        answer.innerText = cans;
                        answer.className = "labelcorrect";
                        rad1.className = "correct"; // Changing the class name to correct to identify that this answer is the correct one
                        form.appendChild(rad1);
                        rad1.after(answer);
                        answer.after(br);
                        choice1 = -1;
                    }

                    else if (choice2 > choice3) {
                        let answer = document.createElement("label");
                        let br = document.createElement("br");
                        answer.htmlFor = `answer2_${i}`;
                        answer.innerText = ans2;
                        form.appendChild(rad2);
                        rad2.after(answer);
                        answer.after(br);
                        choice2 = -2;
                    }

                    else {
                        let answer = document.createElement("label");
                        let br = document.createElement("br");
                        answer.htmlFor = `answer3_${i}`;
                        answer.innerText = ans3;
                        form.appendChild(rad3);
                        rad3.after(answer);
                        answer.after(br);
                        choice3 = -3;
                    }
                }
                document.querySelector("#ans").appendChild(document.createElement("br"));
            }

            let submit = document.createElement("input");
            submit.type = "submit";
            submit.value = "Submit";
            submit.id = "submit_btn"
            submit.style.display = "none";
            document.querySelector("#ans").appendChild(submit);
            countdown("countdown", 15, 0); // Starting timer
            document.querySelector("#press").innerText = "Good Luck !";
            document.getElementById("press").style.backgroundColor = "lightgreen";
            document.querySelector("#press").className = `${document.querySelector("#press").className} disabled`;
            document.getElementById("countdown").style.display = ""; // Making timer visible
            document.getElementById("countdown").style.visibility = "visible";
            document.getElementById("countdown").style.border = "5px solid #004853"; // Making timer border visible
            document.getElementById("countdown").style.display = "none"; // This is for the effect to work
            $("#countdown").fadeIn("slow");
            document.getElementById("sbmit_btn").style.display = ""; // Making submit button visible
            $("#press").fadeOut(2000);
        },
        error: function (errorObj, txt) {
            alert(errorObj.status + " " + errorObj.statusText);
        }
    })
});

$("#submit").on("click", function () {
    // This method will be called once the user presses submit on the popup
    test_over = true;
    let score = getScore();
    let correct = getScoreWeight();

    let correct_answers = Array.from(document.querySelectorAll("label.labelcorrect"));
    let radiobtns = Array.from(document.querySelectorAll("input[type='radio']"));

    for (let j in radiobtns) {
        radiobtns[j].disabled = "true";
    }

    for (let i in correct_answers) {
        correct_answers[i].style.color = "green";
        correct_answers[i].style.fontWeight = "bold";
    }

    document.querySelector("#sbmit_btn").setAttribute("disabled", "");

    //document.getElementById("submit_btn").click();
    if (score > 24) {
        // User passed
        if (!time_is_up) {
            document.querySelector("#myModalLabel").innerText = `Score: ${score}/${correct}`;
        }

        document.querySelector("#cancel_btn").innerHTML = "Close";
        document.getElementById("submit").style.display = "none";
        document.getElementById("p_check_submit").style.display = "none";
        document.getElementById("passed").style.display = "";
    }

    else {
        // User Failed
        if (!time_is_up) {
            document.querySelector("#myModalLabel").innerText = `Score: ${score}/${correct}`;
        }

        document.querySelector("#cancel_btn").innerHTML = "Close";
        document.getElementById("submit").style.display = "none";
        document.getElementById("p_check_submit").style.display = "none";
        document.getElementById("failed").style.display = "";

    }
});

// $("#cancel_btn").on("click", function(){
//     // This will be called on the cancel button of the popup to make sure that the test is not over and to not end the test
//     if(test_over){
//         document.getElementById("submit_btn").click();
//     }
// });

// $("#btn_close_popup").on("click", function(){
//     // This will be called on the cancel button of the popup to make sure that the test is not over and to not end the test
//     if(test_over){
//         document.getElementById("submit_btn").click();
//     }
// });

// Below is the timer functions
function countdown(elementName, minutes, seconds) {
    // This is the main function that will be called on an empty div
    let element, endTime, hours, mins, msLeft, time;

    function twoDigits(n) {
        return (n <= 9 ? "0" + n : n);
    }

    function updateTimer() {
        if (test_over) {
            return;
        }

        msLeft = endTime - (+new Date);
        if (msLeft < 1000) {
            // When time is up
            time_is_up = true;
            element.innerHTML = "Time is up!";
            let score = getScore();
            let correct = getScoreWeight();
            document.querySelector("#myModalLabel").innerText = `Time is up!\nScore: ${score}/${correct}`;
            document.getElementById("sbmit_btn").click();
            document.getElementById("submit").click(); // Pressing button submit
        }

        else {
            time = new Date(msLeft);
            hours = time.getUTCHours();
            mins = time.getUTCMinutes();
            element.innerHTML = (hours ? hours + ':' + twoDigits(mins) : mins) + ':' + twoDigits(time.getUTCSeconds());
            setTimeout(updateTimer, time.getUTCMilliseconds() + 500);
        }
    }

    element = document.getElementById(elementName);
    endTime = (+new Date) + 1000 * (60 * minutes + seconds) + 500;
    updateTimer();
};

$("a#a_sign_up").click(function () {
    $("#form_signin").fadeOut();
    const e = setInterval(function () {
        if (document.getElementById("form_signin").style.display == "none") {
            document.querySelector("#sign_in_title").innerHTML = "Sign Up";
            $("#form_signup").fadeIn("slow");
            clearInterval(e);
        }
    }, 100);
});

$("a#a_sign_in").click(function () {
    $("#form_signup").fadeOut();
    const e = setInterval(function () {
        if (document.getElementById("form_signup").style.display == "none") {
            document.querySelector("#sign_in_title").innerHTML = "Sign In";
            $("#form_signin").fadeIn("slow");

            $("#input_sign_up_username").val("");
            $("#sign_up_inputPassword").val("");
            $("#sign_up_ccinputPassword").val("");
            clearInterval(e);
        }
    }, 100);
});

$("#btn_form_submit_sign_in").on("click", function () {
    // For sign in forms
    $.ajax({
        url: "http://localhost/Web%20Project/database.php",
        type: "GET",
        data: {
            username: $("#input_sign_in_username").val(),
            password: $("#inputPassword").val()
        },
        dataType: 'text',
        success: function (obj) {
            if (obj == 1) {
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
            }

            else if (obj == -1) {
                toastr.warning('Incorrect Password !');
            }

            else {
                toastr.warning('Incorrect Username !');
            }
        },
        error: function (errorObj, txt) {
            alert(errorObj.status + " " + errorObj.statusText);
        }
    });

});

$("#btn_form_submit_sign_up").on("click", function () {
    // For sign up form
    if ($("#input_sign_up_username").val() == "") {
        toastr.error("Username must not be empty");
        return;
    }

    if ($("#sign_up_inputPassword").val().length <= 5) {
        toastr.error("Password must be greater than 5 characters");
        return;
    }

    $.ajax({
        url: "http://localhost/Web%20Project/database.php",
        type: "POST",
        data: {
            username: $("#input_sign_up_username").val(),
            password: $("#sign_up_inputPassword").val(),
            ccpassword: $("#sign_up_ccinputPassword").val(),
            signupreq: "true"
        },
        dataType: 'text',
        success: function (obj) {
            if (obj == 1) {
                let username = $("#input_sign_up_username").val();
                toastr.success(`User: ${username} successfully added`);
                document.getElementById("a_sign_in").click();
                $("#input_sign_up_username").val("");
                $("#sign_up_inputPassword").val("");
                $("#sign_up_ccinputPassword").val("");
            }

            else if (obj == -1) {
                toastr.warning('Username already exists');
            }

            else {
                toastr.warning('Incorrect Passwords !');
            }
        },
        error: function (errorObj, txt) {
            alert(errorObj.status + " " + errorObj.statusText);
        }
    });

});


$("a#sign_out").on("click", function () {
    toastr.success(`${name_of_user} has signed out`);
    user_signed_in = false;
    name_of_user = null;
    $("#user_name").fadeOut();
    $("#sign_in_nav").fadeIn();
    deleteCookie();
});

$("#view_profile").on("click", function () {
    document.getElementById("profile_name").innerText = `${name_of_user}'s Profile`;
    $.ajax({
        url: "http://localhost/Web%20Project/database.php",
        type: "POST",
        data: { username: name_of_user },
        dataType: 'json',
        success: function (obj) {
            document.getElementById("high_score").innerText = `${obj[0].high_score}/30`;
            if (obj[0].high_score < 24) {
                document.getElementById("is_ready_for_test").innerText = "NOT YET !";
                document.getElementById("is_ready_for_test").style.color = "red";
            }

            else {
                document.getElementById("is_ready_for_test").innerText = "Yes, Good Luck !";
                document.getElementById("is_ready_for_test").style.color = "green";
            }
        },
        error: function (errorObj, txt) {
            alert(errorObj.status + " " + errorObj.statusText);
        }
    });
});

const getScore = () => {
    let score = 0;
    let correct = Array.from(document.querySelectorAll(".correct"));
    for (let i in correct) {
        if (correct[i].checked == true) {
            score++;
        }
    }
    return score;
}

const getScoreWeight = () => {
    let correct = Array.from(document.querySelectorAll(".correct"));

    return correct.length;
}