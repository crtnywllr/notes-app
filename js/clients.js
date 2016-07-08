//--------Managing Clients --------------

//Handle clientForm submission
$("#clientForm").submit(function (event) {
    event.preventDefault();
    var uId = $("#addClientBtn").attr("value");
    var name = $("#name").val().trim();
    var email = $("#email").val().trim();
    var dob = $("#dob").val().trim();
    var age = $("#age").val().trim();
    var location = $("#location").val().trim();
    var occupation = $("#occupation").val().trim();
    var payMethod = $("#payMethod").val().trim();
    var rate = $("#rate").val().trim();
    //send info to be added to database
    addClient(uId, name, email, dob, age, location, occupation, payMethod, rate);
    //Update UI
    //$("#clientForm")[0].reset();
    $("#clientModal").modal("hide");

});

//Add client to database
function addClient(uId, name, email, dob, age, location, occupation, payMethod, rate) {
    database.ref("clients/").push({
        uId: uId,
        name: name,
        email: email,
        dob: dob,
        age: age,
        location: location,
        occupation: occupation,
        payMethod: payMethod,
        rate: rate,
        status: "Active"
    });
    //Update client table after add
    updateClientTable();
    //Update side nav after add
    updateSidebar();
};

//Update sidebar display with client names
function updateSidebar(id) {
    $("#" + id + "").remove();
    clientList.forEach(function (client) {
        var key = client.id;
        var found = $.inArray(key, sidebar)
        if (sidebar.length === 0 || found === -1) {
            sidebar.push(key);
            var html = "<li><a id='" + key + "' href=''>" + client.client.name + "</a></li>"
            if (client.client.status === "Active") {
                $("#activeList").append(html);
            } else {
                $("#archiveList").append(html);
            }
        } else {
            if (($("#activeList").find($("#" + key + "")).length > 0) && client.client.status === "Active") {
                return;
            } else if (client.client.status === "Active") {
                var html = "<li><a id='" + key + "' href=''>" + client.client.name + "</a></li>"
                $("#activeList").append(html);
            } else if ($("#archiveList").find($("#" + key + "")).length) {
                return;
            } else if (client.client.status === "Archive") {
                var html = "<li><a id='" + key + "' href=''>" + client.client.name + "</a></li>"
                $("#archiveList").append(html);
            }
        };
    });
};

//Update clients table display
function updateClientTable() {
    clientTable.rows().remove().draw();
    clientList.forEach(function (client) {
        var id = client.id;
        var client = client.client;
        //get data from notes array to fill in table
        var noteData = getData(id);
        clientTable.row.add([client.name, id, client.status, noteData.lastSession, noteData.totalSessions, client.payMethod, client.rate]).draw();
    })
}

//Get lastSession and totalSessions for client table
function getData(id) {
    var counter = 0;
    var data = notesFromDatabase.filter(function (note) {
        return note.note.key === id
    })
    if (data.length === 0) {
        //If no notes have been added, display message to user
        var noteData = {
            firstSession: "No recorded sessions",
            lastSession: "No recorded sessions",
            totalSessions: 0,
            unpaidSessions: "No",
            numUnpaid: 0
        }
        return noteData;
    } else {
        //find and return lastSession and totalSessions
        var totalSessions = data.length;
        //!!!!!!!!may eventually want to sort by date rather than just taking last added
        var unpaidSessions;
        var firstSession = data[0].note.date;

        //find any unpaid sessions
        var unpaid = data.filter(function (note) {
            return (note.note.paid === "No")
        })
        if (unpaid.length === 0) {
            unpaidSessions = "No";
        } else {
            counter = unpaid.length;
            unpaidSessions = "Yes";
        }
        var lastNote = data.pop();
        var lastSession = lastNote.note.date;
        var noteData = {
            firstSession: firstSession,
            lastSession: lastSession,
            totalSessions: totalSessions,
            unpaidSessions: unpaidSessions,
            numUnpaid: counter
        };
        return noteData;
    }
}
