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
    var email = $("#email").val();
    var password = $("#password").val();
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage);
    });
})

$("#newUserForm").submit(function (e) {
    e.preventDefault();
    var email = $("#newEmail").val();
    console.log(email);
    var password = $("#newPassword").val();
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage);
    });
});
