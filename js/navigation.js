//------------Navigation------------
//Navigate to single client from all clients
$("tbody").on("click", ".clientLink", function (e) {
    e.preventDefault();
    //send id and name to addNote button so it can be included with notes
    var clientKey = $(this).attr("value");
    $("#addNote").attr("value", clientKey);
    $("#editNote").attr("value", clientKey);
    $("#noteTitle").attr("value", clientKey);
    var clientName = $(this).attr("name")
    $("#addNote").attr("name", clientName);
    $("#editNote").attr("name", clientName);
    //Show name of client on notes page
    $("#clientNameDisplay").text(clientName);
    $("#clientNameDisplay").attr("value", clientKey);
    //Send id to display function for use in filtering notes
    singleClientDisplay(clientKey);
    noteDisplay(clientKey);
    //Update UI
    $("#allClients").hide();
    $("#payments").hide();
    $("#clientProfile").hide();
    $("#singleClient").show();
});

//Navigate to all clients
$(".showClients").on("click", function (e) {
    e.preventDefault();
    $("#singleClient").hide();
    $("#payments").hide();
    $("#clientProfile").hide();
    $("#allClients").show();
})

//Navigate to payments
$(document).on("click", ".paymentShow", function (e) {
    e.preventDefault();
    $("#singleClient").hide();
    $("#allClients").hide();
    $("#clientProfile").hide();
    $("#payments").show();
})

//Navigate to single client from sidebar
$("#activeList").on("click", "a", function (e) {
    e.preventDefault();
    var key = $(this).attr("id");
    var name = $(this).text();
    $("#allClients").hide();
    $("#payments").hide();
    $("#clientProfile").hide();
    $("#singleClient").show();
    singleClientDisplay(key);
    noteDisplay(key);
    $("#clientNameDisplay").text(name);
    $("#clientNameDisplay").attr("value", key);
    $("#noteTitle").attr("value", key);
})
$("#archiveList").on("click", "a", function (e) {
    e.preventDefault();
    var key = $(this).attr("id");
    var name = $(this).text();
    $("#allClients").hide();
    $("#payments").hide();
    $("#clientProfile").hide();
    $("#singleClient").show();
    singleClientDisplay(key);
    noteDisplay(key);
    $("#clientNameDisplay").text(name);
    $("#clientNameDisplay").attr("value", key);
    $("#noteTitle").attr("value", key);
})

//Navigate to client profile from notes page
$("#clientNameDisplay").on("click", function (e) {
    e.preventDefault();
    var key = $(this).attr("value");
    var name = $(this).text();
    $("#allClients").hide();
    $("#payments").hide();
    $("#singleClient").hide();
    $("#clientProfile").show();
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
    $("#allClients").hide();
    $("#payments").hide();
    $("#clientProfile").hide();
    $("#singleClient").show();
    //show notes table
    singleClientDisplay(key);
    //display clients' notes
    noteDisplay(key);
    //set client key for scrolling through notes
    $("#noteTitle").attr("value", key);
})
