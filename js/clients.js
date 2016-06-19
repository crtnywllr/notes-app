var clientTable;
var notesTable;
var paymentTable;

var notesFromDatabase = [];
var clientList = [];


$(document).ready(function () {
    //Sends all notes to array for filtering later
    database.ref("notes/").on("child_added", function (snap) {
        notesFromDatabase.push({
            note: snap.val(),
            id: snap.getKey()
        });
        displayPayments();
    })

    //Sends all clients to array for filtering later
    database.ref("clients/").on("child_added", function (snap) {
        clientList.push({
            client: snap.val(),
            id: snap.getKey()
        });
        updateClientTable();
    })

    //Initial display
    $("#singleClient").hide();
    $("#payments").hide();
    $("#allClients").show();

    //Initialize table of all clients
    var clientTable = $("#allClientsTable").DataTable({
        responsive: true,
        "columnDefs": [
            {
                "render": function (data, type, row) {
                    return "<a class='clientLink' href='#client' value=" + row[1] + " name= " + row[0] + ">" + row[0] + "</a>";
                },
                "targets": 0
            },
            {
                "visible": false,
                "targets": [1]
            }
        ]
    });

    //Initialize table for single client dispaly
    var notesTable = $("#notesTable").DataTable({
        responsive: true,
        /*"columnDefs": [
            {
                "render": function (data, type, row) {
                    return "<a class='noteLink' href='#client' value=" + row[1] + ">" + row[0] + "</a>";
                },
                "targets": 0
            },
            {
                "visible": false,
                "targets": [1]
            }
        ]*/
    });

    //Initialize table for payments
    var paymentTable = $("#paymentTable").DataTable({
        responsive: true,
        /*"columnDefs": [
            {
                "render": function (data, type, row) {
                    return "<a class='noteLink' href='#client' value=" + row[1] + ">" + row[0] + "</a>";
                },
                "targets": 0
            },
            {
                "visible": false,
                "targets": [1]
            }
        ]*/
    });

    //------------Navigation------------
    //Navigate to single client
    $("#allClientsTable tbody").on("click", "a", function (e) {
        e.preventDefault();
        //Set var to clientId, send id to addNote button so it can be included with notes
        var clientKey = $(this).attr("value");
        $("#addNote").attr("value", clientKey);
        var clientName = $(this).attr("name")
            //console.log(clientName);
        $("#addNote").attr("name", clientName);
        $("#clientNameDisplay").text(clientName);
        //Send id to display function for use in filtering notes
        singleClientDisplay(clientKey);
        noteDisplay(clientKey);
        //Update UI
        $("#allClients").hide();
        $("#payments").hide();
        $("#singleClient").show();
    });

    //Navigate to all clients
    $(".showClients").on("click", function (e) {
        e.preventDefault();
        $("#singleClient").hide();
        $("#payments").hide();
        $("#allClients").show();
    })

    //Navigate to payments
    $("#paymentShow").on("click", function (e) {
        e.preventDefault();
        $("#singleClient").hide();
        $("#allClients").hide();
        $("#payments").show();
    })

    //--------Managing Clients --------------

    //Handle clientForm submission
    $("#clientForm").submit(function (event) {
        event.preventDefault();
        var name = $("#name").val();
        var email = $("#email").val();
        var dob = $("#dob").val();
        var age = $("#age").val();
        var location = $("#location").val();
        var occupation = $("#occupation").val();
        var payMethod = $("#payMethod").val();
        var rate = $("#rate").val();
        //send info to be added to database
        addClient(name, email, dob, age, location, occupation, payMethod, rate);
        //Update UI
        $("#clientModal").modal("hide");
        //$("#clientForm").empty();
    });

    //Add client to database
    function addClient(name, email, dob, age, location, occupation, payMethod, rate) {
        database.ref("clients/").push({
            name: name,
            email: email,
            dob: dob,
            age: age,
            location: location,
            occupation: occupation,
            payMethod: payMethod,
            rate: rate,
            active: true
        });
        //Update client table after add
        updateClientTable();
    };

    //Update clients display
    function updateClientTable() {
        //console.log(clientList);
        clientTable.rows().remove().draw();
        clientList.forEach(function (client) {
            //console.log("client ", client)
            var id = client.id;
            var client = client.client;
            //get data from notes array to fill in table
            var noteData = getData(id);
            clientTable.row.add([client.name, id, "Yes", noteData.lastSession, noteData.totalSessions, client.payMethod, client.rate]).draw();
        })
    }

    //Get lastSession and totalSessions for client table
    function getData(id) {
        var data = notesFromDatabase.filter(function (note) {
            return note.note.key === id
        })
        if (data.length === 0) {
            //If no notes have been added, display message to user
            var noteData = {
                lastSession: "No recorded sessions",
                totalSessions: 0
            }
            return noteData;
        } else {
            //find and return lastSession and totalSessions
            var totalSessions = data.length;
            //!!!!!!!!may eventually want to sort by date rather than just taking last added
            var lastNote = data.pop();
            var lastSession = lastNote.note.date;
            var noteData = {
                lastSession: lastSession,
                totalSessions: totalSessions
            };
            return noteData;
        }
    }

    // ---------------- Managing Notes ------------

    //Handle noteForm submission
    $("#noteForm").submit(function (event) {
        event.preventDefault();
        var key = $("#addNote").attr("value");
        var clientName = $("#addNote").attr("name");
        //console.log(clientName);
        var date = $("#date").val();
        var title = $("#title").val();
        var keywords = $("#keywords").val() || null;
        var notes = $("#notes").val();
        var paid = $("#paid").val();
        var datePaid = $("#datePaid").val() || null;
        var amount = $("#amount").val() || null;
        var paySource = $("#paySource").val() || null;
        //Send info to be added to database
        addNotes(key, clientName, date, title, keywords, notes, paid, datePaid, amount, paySource);
        console.log("1", clientName)
            //Update UI
        $("#notesModal").modal("hide");
    });

    //Add notes to database
    function addNotes(key, clientName, date, title, keywords, notes, paid, datePaid, amount, paySource) {
        console.log("2", clientName)
        database.ref("notes/").push({
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
            var details = [note.note.title, note.note.date, note.note.keywords, note.note.paid, (note.note.datePaid || null)]
            notesTable.row.add(details).draw();
        })
    };

    //Display note content in slideshow
    function noteDisplay(key) {
        var currentKey = key
            //console.log("key1", currentKey)
        if (notesFromDatabase.length === 0) {
            $("#noteTitle").html(null)
            $("#noteContent").html("No notes added yet.")

        } else {
            //console.log("key2", currentKey)
            var currentNotes = notesFromDatabase.filter(function (note) {
                return (note.note.key === key)
            })
            if (currentNotes.length === 0) {
                //console.log("key3", key)
                $("#noteTitle").html(null)
                $("#noteContent").html("No notes added yet.")
            } else {
                //console.log("key4", currentKey)
                var i = (currentNotes.length - 1)
                    //console.log(i)
                $("#noteTitle").html(currentNotes[i].note.title || null)
                $("#noteContent").html(currentNotes[i].note.notes || "No notes added yet.")
                    //scroll through notes array
                    //!!!!scroll issue when # notes < the prev one viewed
                $("#decrement").click(function () {
                    //console.log("decKey", key);
                    //console.log("decKey2", currentKey);
                    var decNotes = currentNotes.filter(function (note) {
                        return note.key == key
                    });
                    //console.log("decNotes", decNotes)
                    if (decNotes.length === 0) {
                        return;
                    } else if (i > 0) {
                        //console.log("decrement ", currentNotes)
                        i--;
                        $("#noteTitle").html(decNotes[i].note.title)
                        $("#noteContent").html(decNotes[i].note.notes)
                    }
                });
                $("#increment").click(function () {
                    //console.log(currentNotes)
                    if (currentNotes.length === 0) {
                        return
                    } else if (i < (currentNotes.length - 1)) {
                        //console.log("increment ", currentNotes)
                        i++;
                        $("#noteTitle").html(currentNotes[i.note].title)
                        $("#noteContent").html(currentNotes[i].note.notes)
                    }
                });
                //change display on click
                //!!!!!need way to make the click local to link, not whole row
                $("#notesTable tbody").on("click", "tr", function () {
                    //get table row data
                    var data = notesTable.row(this).data();
                    var title = data[0];
                    var keywords = data[2];
                    //compare data to each note in array
                    currentNotes.forEach(function (note) {
                        if (note.note.title === title && note.note.keywords === keywords) {
                            //if data matches, find index of note and display content
                            i = ($.inArray(note, currentNotes))
                            $("#noteTitle").html(currentNotes[i].note.title)
                            $("#noteContent").html(currentNotes[i].note.notes)
                        }
                    });
                });
            }
        }
    };
    //------------Managing Payments -------------
    //Display payments in table
    function displayPayments() {
        console.log(notesFromDatabase);
        paymentTable.rows().remove().draw();
        if (notesFromDatabase.length === 0) {
            return;
        } else {
            notesFromDatabase.forEach(function (note) {
                var note = note.note
                var payment = [note.clientName, note.title, note.date, note.paid, (note.datePaid || null), (note.paySource || null), (note.amount || null)]
                paymentTable.row.add(payment).draw();
            })
        }
    }

    //end of document.ready
});




//Delete client

//Edit client details

//Delete note

//Edit note details

//Create client profile
