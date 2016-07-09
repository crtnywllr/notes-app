$(document).ready(function () {
    var uId;

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            uId = user.uid;
            $(location).attr("href", "index.html");
        }
    });


    $("#loginForm").submit(function (e) {
        e.preventDefault();
        var email = $("#email").val().trim();
        var password = $("#password").val().trim();
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode, errorMessage);
            if (errorCode === "auth/user-not-found") {
                $("#errorDisplay").text("No account found for that email address. Please try again or register below.")
            } else if (errorCode === "auth/wrong-password") {
                $("#errorDisplay").text("Incorrect password. Please try again.")
            } else {
                $("#errorDisplay").text(errorMessage);
            }
        });
    })
});
