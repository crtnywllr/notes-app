//-----------Managing Users-------------
$(".dropdown").on("click", "#logout", function () {
    firebase.auth().signOut().then(function () {
        console.log("Sign-out successful.");
    }, function (error) {
        console.log("An error occurred");
    });
})
