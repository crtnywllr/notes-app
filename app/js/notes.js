// ---------------- Managing Notes ------------

//Handle noteForm submission
$("#noteForm").submit(function (event) {
    event.preventDefault();
    var uId = $("#addNoteBtn").attr("value");
    var key = $("#addNote").attr("value");
    var clientName = $("#addNote").attr("name");
    var date = $("#date").val().trim();
    var title = $("#title").val().trim();
    var keywords = $("#keywords").val().trim() || null;
    var notes = $("#notes").val().trim();
    var paid = $("#paid").val().trim();
    var datePaid = $("#datePaid").val().trim() || null;
    var amount = $("#amount").val().trim() || null;
    var paySource = $("#paySource").val().trim() || null;
    //Send info to be added to database
    addNotes(uId, key, clientName, date, title, keywords, notes, paid, datePaid, amount, paySource);
    //Update UI
    //$("#noteForm textarea").val(" ");
    $("#notesModal").modal("hide");
});

//Add notes to database
function addNotes(uId, key, clientName, date, title, keywords, notes, paid, datePaid, amount, paySource) {
    database.ref("notes/").push({
        uId: uId,
        key: key,
        clientName: clientName,
        date: date,
        title: title,
        keywords: keywords,
        notes: notes,
        paid: paid,
        datePaid: datePaid,
        amount: amount,
        paySource: paySource
    });
    //add new note to table
    singleClientDisplay(key);
    //change noteDisplay to display added note
    noteDisplay(key);
    //update # of sessions and last session after note add
    updateClientTable();
    //update payment table
    displayPayments();
}

//Edit Notes
//select row by clicking button
$("#notesTable tbody").on("click", "#edit", function () {
    var data = notesTable.row($(this).parents("tr")).data();
    editNoteId = data[7];
    $("#editNote").attr("name", editNoteId);
    //filter notes to return note that was clicked
    var noteToEdit = notesFromDatabase.filter(function (note) {
        return note.id === editNoteId;
    });
    var note = noteToEdit[0].note;
    var noteId = noteToEdit[0].id
        //update placeholders in modal
    $("#editDate").attr("value", note.date);
    $("#editTitle").attr("value", note.title);
    $("#editKeywords").attr("value", note.keywords);
    $("#editNotes").val(note.notes);
    $("#editPaid").val(note.paid);
    $("#editDatePaid").attr("value", note.datePaid || null);
    $("#editAmount").attr("value", note.amount || null);
    $("#editPaySource").val(note.paySource || null);
});

//call to handle edit note form submission on click
$("#editForm").submit(function (event) {
    event.preventDefault();
    var id = $("#editNote").attr("name");
    var uId = $("#addNoteBtn").attr("value");
    var key = $("#editNote").attr("value");
    var clientName = $("#clientNameDisplay").text();
    sendNoteUpdates(uId, id, key, clientName);
});

//Handle editForm submission
function sendNoteUpdates(uId, id, key, clientName) {
    var date = $("#editDate").val().trim();
    var title = $("#editTitle").val().trim();
    var keywords = $("#editKeywords").val().trim() || null;
    var notes = $("#editNotes").val().trim();
    var paid = $("#editPaid").val().trim();
    var datePaid = $("#editDatePaid").val().trim() || null;
    var amount = $("#editAmount").val().trim() || null;
    var paySource = $("#editPaySource").val().trim() || null;
    //Send info to be added to database
    editNotes(uId, id, key, clientName, date, title, keywords, notes, paid, datePaid, amount, paySource);
    //Update UI
    $("#editModal").modal("hide");
};

//Update notes after edit
function editNotes(uId, id, key, clientName, date, title, keywords, notes, paid, datePaid, amount, paySource) {
    if (id === editNoteId) {
        var updates = {};
        var editedInfo = {
            uId: uId,
            key: key,
            clientName: clientName,
            date: date,
            title: title,
            keywords: keywords,
            notes: notes,
            paid: paid,
            datePaid: datePaid,
            amount: amount,
            paySource: paySource
        };
        updates["notes/" + id] = editedInfo;
        database.ref().update(updates);
        //update client table
        singleClientDisplay(key);
        //change noteDisplay to display added note
        noteDisplay(key);
        //update # of sessions and last session after note add
        updateClientTable();
        //update payment table
        displayPayments();
    }
}

//Delete Note
$("#notesTable tbody").on("click", "#delete", function () {
    var data = notesTable.row($(this).parents("tr")).data();
    var id = data[7];
    var key = data[1];
    var item = {};
    item["notes/" + id] = id;
    database.ref("notes/").child(id).remove();
    //update client's list of notes
    var clientNotes = notesFromDatabase.filter(function (note) {
        return (key === note.note.key);
    });
    var i = (clientNotes.length - 1);
    var lastSession = clientNotes[i];
    key = lastSession.note.key;
    singleClientDisplay(key);
    //update note in slideshow if it was selected
    noteDisplay(key);
    //change number of notes on client table
    updateClientTable();
    //change history of notes for payment table
    displayPayments();
});

//Display notes in table
function singleClientDisplay(key) {
    //match notes to client by key
    var currentNotes = notesFromDatabase.filter(function (note) {
            return (note.note.key === key)
        })
        //remove old data
        //!!!!!!!eventually want fix that doesn't require wiping each time
    notesTable.rows().remove().draw();
    //loop through array and add updated data
    currentNotes.forEach(function (note) {
        var details = ["", note.note.key, note.note.title, note.note.date, note.note.keywords, note.note.paid, (note.note.datePaid || null), note.id, ""]
        notesTable.row.add(details).draw();
    })
};

//Display note content in slideshow
function noteDisplay(key) {
    if (notesFromDatabase.length === 0) {
        $("#noteTitle").html(null);
        $("#noteContent").html("No notes added yet.");

    } else {
        var currentNotes = notesFromDatabase.filter(function (note) {
            return (note.note.key === key)
        });
        if (currentNotes.length === 0) {
            $("#noteTitle").html(null);
            $("#noteContent").html("No notes added yet.");
        } else {
            var i = (currentNotes.length - 1);
            $("#noteTitle").html("<i class='fa fa-chevron-left' id='decrement'></i>" +
                currentNotes[i].note.title + "<i class='fa fa-chevron-right disabled' id='increment'></i>" || null);
            $("#noteContent").html(currentNotes[i].note.notes || "No notes added yet.");
            //scroll through notes array
            $("#noteTitle").on("click", "#decrement", function () {
                var key = $("#noteTitle").attr("value");
                var currentNotes = notesFromDatabase.filter(function (note) {
                    return note.note.key == key;
                });
                if (currentNotes.length === 0) {
                    return;
                } else if (i > 0) {
                    if ($("#decrement").hasClass("disabled")) {
                        $("#decrement").removeClass("disabled");
                    }
                    i--;
                    $("#noteTitle").html("<i class='fa fa-chevron-left' id='decrement'></i>" +
                        currentNotes[i].note.title + "<i class='fa fa-chevron-right' id='increment'></i>" || null);
                    $("#noteContent").html(currentNotes[i].note.notes || "No notes added yet.");
                    if (i === 0) {
                        $("#decrement").addClass("disabled");
                    }
                }
            });
            $("#noteTitle").on("click", "#increment", function () {
                var key = $("#noteTitle").attr("value");
                var currentNotes = notesFromDatabase.filter(function (note) {
                    return note.note.key == key;
                });
                if (currentNotes.length === 0) {
                    return;
                } else if (i < (currentNotes.length - 1)) {
                    if ($("#increment").hasClass("disabled")) {
                        $("#increment").removeClass("disabled");
                    }
                    i++;
                    $("#noteTitle").html("<i class='fa fa-chevron-left' id='decrement'></i>" +
                        currentNotes[i].note.title + "<i class='fa fa-chevron-right' id='increment'></i>" || null);
                    $("#noteContent").html(currentNotes[i].note.notes || "No notes added yet.");
                    if (i === (currentNotes.length - 1)) {
                        $("#increment").addClass("disabled");
                    }
                }

            });
            //change display on click
            $("#notesTable tbody").on("click", "a", function (e) {
                e.preventDefault();
                //get table row data
                var data = notesTable.row($(this).parents("tr")).data();
                var title = data[2];
                var keywords = data[4];
                //compare data to each note in array
                currentNotes.forEach(function (note) {
                    if (note.note.title === title && note.note.keywords === keywords) {
                        //if data matches, find index of note and display content
                        i = ($.inArray(note, currentNotes))
                        $("#noteTitle").html("<i class='fa fa-chevron-left' id='decrement'></i>" +
                            currentNotes[i].note.title + "<i class='fa fa-chevron-right' id='increment'></i>" || null);
                        $("#noteContent").html(currentNotes[i].note.notes || "No notes added yet.");
                    }
                });
            });
        }
    }
};
