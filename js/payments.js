//------------Managing Payments -------------
//Display payments in table
function displayPayments() {
    paymentTable.rows().remove().draw();
    if (notesFromDatabase.length === 0) {
        return;
    } else {
        notesFromDatabase.forEach(function (note) {
            var noteId = note.id;
            var note = note.note;
            var payment = ["", note.clientName, note.key, note.title, noteId, note.date, note.paid, (note.datePaid || null), (note.paySource || null), (note.amount || null)]
            paymentTable.row.add(payment).draw();
        })
    }
}

//Update payments on edit

//select note to edit
$("#paymentTable tbody").on("click", "#edit", function () {
    var uId = $("#addClientBtn").attr("value");
    var data = paymentTable.row($(this).parents("tr")).data();
    editPaymentId = data[4];
    //filter notes to return note that was clicked
    noteToEdit = notesFromDatabase.filter(function (note) {
        return note.id === editPaymentId;
    });
    var n = noteToEdit[0].note;
    var noteId = noteToEdit[0].id;
    //update placeholders in modal
    $("#updatePaid").val(n.paid);
    $("#updateDatePaid").attr("value", n.datePaid || null);
    $("#updateAmount").attr("value", n.amount || null);
    $("#updatePaySource").val(n.paySource || null);
});

//call to handle form submission on click
$("#paymentForm").submit(function (event) {
    event.preventDefault();
    var n = noteToEdit[0].note;
    var noteId = noteToEdit[0].id;
    sendPaymentUpdates(uId, noteId, n);
});


//Handle paymentForm submission
function sendPaymentUpdates(uId, id, n) {
    var paid = $("#updatePaid").val().trim();
    var datePaid = $("#updateDatePaid").val().trim() || "";
    var amount = $("#updateAmount").val().trim() || "";
    var paySource = $("#updatePaySource").val().trim() || "";
    //Send info to be added to database
    editPayment(uId, id, n, paid, datePaid, amount, paySource);
    //Update UI
    $("#payModal").modal("hide");
};

function editPayment(uId, id, n, paid, datePaid, amount, paySource) {
    if (id === editPaymentId) {
        var updates = {};
        var key = n.key
        var editedInfo = {
            uId: uId,
            key: key,
            clientName: n.clientName,
            date: n.date,
            title: n.title,
            keywords: n.keywords,
            notes: n.notes,
            paid: paid,
            datePaid: datePaid,
            amount: amount,
            paySource: paySource
        };
        updates["notes/" + id] = editedInfo;
        database.ref().update(updates);
        //update all clients table
        updateClientTable();
        //update client table
        singleClientDisplay(key);
        //update payment table
        displayPayments();
    }
}
