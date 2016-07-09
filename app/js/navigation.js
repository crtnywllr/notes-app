//------------Navigation------------
//Navigate to single client from all clients
$("tbody").on("click", ".clientLink", function (e) {
    e.preventDefault();
    //send id and name to DOM elements so it can be included with notes
    var key = $(this).attr("value");
    $("#addNote").attr("value", key);
    $("#editNote").attr("value", key);
    $("#noteTitle").attr("value", key);
    var name = $(this).attr("name");
    $("#addNote").attr("name", name);
    $("#editNote").attr("name", name);
    //Update UI
    showHide([$("#allClients"), $("#clientProfile"), $("#payments")], $("#singleClient"));
    singleDisplay(key, name);
});

//Navigate to all clients
$(".showClients").on("click", function (e) {
    e.preventDefault();
    showHide([$("#singleClient"), $("#clientProfile"), $("#payments")], $("#allClients"));
});

//Navigate to payments
$(document).on("click", ".paymentShow", function (e) {
    e.preventDefault();
    showHide([$("#allClients"), $("#clientProfile"), $("#singleClient")], $("#payments"));
});

//Navigate to single client from sidebar
$("#activeList").on("click", "a", function (e) {
    e.preventDefault();
    var key = $(this).attr("id");
    var name = $(this).text();
    showHide([$("#allClients"), $("#clientProfile"), $("#payments")], $("#singleClient"));
    singleDisplay(key, name);
});
$("#archiveList").on("click", "a", function (e) {
    e.preventDefault();
    var key = $(this).attr("id");
    var name = $(this).text();
    showHide([$("#allClients"), $("#clientProfile"), $("#payments")], $("#singleClient"));
    singleDisplay(key, name);
});

//Navigate to client profile from notes page
$("#clientNameDisplay").on("click", function (e) {
    e.preventDefault();
    var key = $(this).attr("value");
    var name = $(this).text();
    showHide([$("#allClients"), $("#singleClient"), $("#payments")], $("#clientProfile"));
    $("#clientProfile").attr("value", key);
    //show client name at top
    $("#clientProfileName").text(name);
    //access client info and display it in details box
    showClientDetails(key);
    displayStickyNote(key);
})

//Navigate to single client from client profile page
$("#clientProfileName").on("click", function (e) {
    e.preventDefault();
    var key = $("#editClientProfile").attr("value");
    var name = $(this).text();
    showHide([$("#allClients"), $("#clientProfile"), $("#payments")], $("#singleClient"));
    singleDisplay(key, name);
})

function showHide(hide, show) {
    hide.forEach(function (div) {
        div.hide();
    })
    show.show();
}

function singleDisplay(key, name) {
    singleClientDisplay(key);
    noteDisplay(key);
    $("#clientNameDisplay").text(name);
    $("#clientNameDisplay").attr("value", key);
    $("#noteTitle").attr("value", key);
}
