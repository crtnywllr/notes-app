var clientTable;
var notesTable;
var paymentTable;
var editNoteId;
var editPaymentId;
var noteToEdit;
var uId;

var sidebar = [];
var notesFromDatabase = [];
var clientList = [];
var stickyNoteList = [];

$(document).ready(function () {
    //Initial display
    $("#singleClient").hide();
    $("#payments").hide();
    $("#clientProfile").hide();
    $("#allClients").show();

});
