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

$("#newUserForm").submit(function (e) {
    e.preventDefault();
    var email = $("#newEmail").val().trim();
    console.log(email);
    var password = $("#newPassword").val().trim();
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage);
        $("#errorDisplay").text("There was an error with your email or password. Please try again.")
    });
});
