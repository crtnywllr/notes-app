//------------Retrieving data from database --------

//gets uId for current user
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        uId = firebase.auth().currentUser.uid;
        $("#addClientBtn").attr("value", uId);
        $("#addNoteBtn").attr("value", uId);
        $("#stickyToggle").attr("value", uId);
    }
});

//Sends all notes to array for filtering later
database.ref("notes/").on("child_added", function (snap) {
    var note = snap.val();
    if (note.uId === uId) {
        notesFromDatabase.push({
            note: snap.val(),
            id: snap.getKey()
        });
    } else {
        return;
    }
    displayPayments();
});

//Sends all clients to array for filtering later
database.ref("clients/").on("child_added", function (snap) {
    var client = snap.val();
    if (client.uId === uId) {
        var key = snap.getKey()
        clientList.push({
            client: snap.val(),
            id: key
        });
    } else {
        return;
    }
    updateClientTable();
    updateSidebar();
});

//Sends sticky note details to array for filtering later
database.ref("sticky-note/").on("child_added", function (snap) {
    var note = snap.val();
    if (note.uId === uId) {
        var key = snap.getKey()
        stickyNoteList.push({
            note: snap.val(),
            id: key
        });
    } else {
        return;
    }
});

//Listens for updates on clients
database.ref("clients/").on("child_changed", function (snap) {
    var client = snap.val();
    if (client.uId === uId) {
        var id = snap.getKey();
        var clientArray = clientList.filter(function (client) {
            return client.id === id;
        });
        var client = clientArray[0];
        var i = clientList.indexOf(client);
        //if client is in array, set its properties to new info
        if (i !== -1) {
            clientList[i] = {
                client: snap.val(),
                id: id
            }
            updateClientTable();
            showClientDetails(id);
        }
    }
});

//Listens for removed clients
database.ref("clients/").on("child_removed", function (snap) {
    var id = snap.getKey();
    var clientArray = clientList.filter(function (client) {
        return client.id === id;
    })
    var client = clientArray[0];
    var i = clientList.indexOf(client);

    if (i !== -1) {
        clientList.splice(i, 1);
    }
})

//Listens for updates on notes
database.ref("notes/").on("child_changed", function (snap) {
    var note = snap.val();
    if (note.uId === uId) {
        var id = snap.getKey();
        var noteArray = notesFromDatabase.filter(function (note) {
            return note.id === id;
        })
        var note = noteArray[0];
        var i = notesFromDatabase.indexOf(note);

        if (i !== -1) {
            notesFromDatabase[i] = {
                note: snap.val(),
                id: id
            }
        }
    }
});

//Listens for removed notes
database.ref("notes/").on("child_removed", function (snap) {
    var id = snap.getKey();
    var noteArray = notesFromDatabase.filter(function (note) {
        return note.id === id;
    })
    var note = noteArray[0];
    var i = notesFromDatabase.indexOf(note);

    if (i !== -1) {
        notesFromDatabase.splice(i, 1);
    }
})
