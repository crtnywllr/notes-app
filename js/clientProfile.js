//--------------Managing Client Profile---------
//pulling client details for profiles
function showClientDetails(key) {
    $("#editClientProfile").attr("value", key)
    clientList.map(function (client) {
        if (client.id === key) {
            var status = $("#act");
            var email = $("#eml");
            var location = $("#loc");
            var occupation = $("#occ");
            var dob = $("#DOB");
            var age = $("#Age");
            var payment = $("#pay");
            var rate = $("#fee");
            var first = $("#first");
            var last = $("#last");
            var total = $("#total");
            var unpaid = $("#unpaid");
            status.html("<strong>Status: </strong>" + client.client.status);
            email.html("<strong>Email: </strong>" + client.client.email);
            location.html("<strong>Location: </strong>" + client.client.location);
            occupation.html("<strong>Occupation: </strong>" + client.client.occupation);
            dob.html("<strong>Date of Birth: </strong>" + client.client.dob);
            age.html("<strong>Age: </strong>" + client.client.age);
            payment.html("<strong>Preferred Payment Method: </strong>" + client.client.payMethod);
            rate.html("<strong>Session Rate: </strong>" + client.client.rate);
            var noteData = getData(key);
            var html = "";
            first.html("<li><strong>First Session: </strong>" + noteData.firstSession + "</li>");
            last.html("<li><strong>Most Recent Session: </strong>" + noteData.lastSession + "</li>");
            total.html("<li><strong>Number of Sessions: </strong>" + noteData.totalSessions + "</li>");
            unpaid.html("<li><strong><a href='' class='paymentShow'>Unpaid Sessions: </a></strong>" + noteData.unpaidSessions + " (" + noteData.numUnpaid + ")</li>");
        } else {
            return;
        }
    })
}

//edit client details
//Loading modal
$("#editClientProfile").on("click", function (event) {
    event.preventDefault();
    var id = $("#editClientProfile").attr("value");
    var clientArray = clientList.filter(function (client) {
        return client.id === id;
    })
    var client = clientArray[0].client;
    //fill placeholders with current info
    var name = $("#nameEdit").attr("value", client.name);
    var email = $("#emailEdit").attr("value", client.email);
    var dob = $("#dobEdit").attr("value", client.dob);
    var age = $("#ageEdit").attr("value", client.age);
    var location = $("#locationEdit").attr("value", client.location);
    var occupation = $("#occupationEdit").attr("value", client.occupation);
    var payMethod = $("#payMethodEdit").val(client.payMethod);
    var rate = $("#rateEdit").val(client.rate);
    //handle form submission
    $("#clientEditForm").submit(function (e) {
        e.preventDefault();
        clientEditDetails(id);
    })
});

//set params to send to db
function clientEditDetails(id) {
    var uId = $("#addClientBtn").attr("value");
    var status = $("#status").val().trim();
    var name = $("#nameEdit").val().trim();
    var email = $("#emailEdit").val().trim();
    var dob = $("#dobEdit").val().trim();
    var age = $("#ageEdit").val().trim();
    var location = $("#locationEdit").val().trim();
    var occupation = $("#occupationEdit").val().trim();
    var payMethod = $("#payMethodEdit").val().trim();
    var rate = $("#rateEdit").val().trim();
    //send info to be added to database
    editClient(uId, id, status, name, email, dob, age, location, occupation, payMethod, rate)
        //Update UI
    $("#editClientModal").modal("hide");
}

//Send edits for client to database
function editClient(uId, id, status, name, email, dob, age, location, occupation, payMethod, rate) {
    var key = $("#editClientProfile").attr("value");
    if (id === key) {
        var updates = {};
        var editedInfo = {
            uId: uId,
            status: status,
            name: name,
            email: email,
            dob: dob,
            age: age,
            location: location,
            occupation: occupation,
            payMethod: payMethod,
            rate: rate
        };
        updates["clients/" + id] = editedInfo;
        database.ref().update(updates);
        //update client table
        updateClientTable();
        //update client profile
        showClientDetails(id);
        updateSidebar(id);
    } else {
        return;
    }
}

//delete client
$("#deleteClient").click(function () {
    var id = $("#editClientProfile").attr("value");
    //remove client from db
    database.ref("clients/").child(id).remove();
    //remove notes with client key attached
    database.ref("notes/").once("value", function (snap) {
        snap.forEach(function (note) {
            var noteData = note.val();
            if (noteData.key === id) {
                var noteId = note.getKey()
                database.ref("notes/").child(noteId).remove();
            } else {
                return;
            }
        });
    });
    updateClientTable();
    updateSidebar(id);
    displayPayments();
    //switch view back to all clients
    $("#singleClient").hide();
    $("#payments").hide();
    $("#clientProfile").hide();
    $("#allClients").show();
});
