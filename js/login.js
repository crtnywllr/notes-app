var uId;

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        uId = user.uid;
        $(location).attr("href", "index.html");
    } else {
        console.log("no users signed in");
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
        $("#errorDisplay").text("There was an error with your email or password. Please try again.")
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
