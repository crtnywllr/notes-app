var clientTable;
var notesTable;

var notesFromDatabase = [];

var notes;
var totalSessions;
var lastSession;

$(document).ready(function () {
    //Sends all notes to array for filtering later
    database.ref("notes/").on("child_added", function (snap) {
        notesFromDatabase.push(snap.val());
        //console.log(notesFromDatabase);
    })

    //Initial display
    $("#singleClient").hide();
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

    //--------Managing Clients --------------

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
    };

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
        //$('#clientForm').empty();

    });

    //Update clients display
    database.ref("clients/").on("child_added", function (snapshot) {
        key = (snapshot.getKey());
        clientTable.row.add([snapshot.val().name, key, "Yes", "", "", snapshot.val().payMethod, snapshot.val().rate])
            .draw();
        /*database.ref("notes/").on("value", function (snap) {
    var snapKey = snap.getKey(); //notes
    console.log(snapKey)
    console.log("key ", snap.val().key)
    console.log(key)
    if (snap.exists() && (snap.val().key === key)) {
        database.ref("notes/").on("child_added", function (snap) {
            console.log(snap.val().key)
            console.log(key)
            var sessions = [];
            sessions.push(snap.val())
            totalSessions = sessions.length || null;
            lastSession = snap.val().date || null;
            dataCapture(totalSessions, lastSession)
        })

        function dataCapture(totalSessions, lastSession) {
            console.log(totalSessions);
            console.log(lastSession);
            clientTable.row().data([snapshot.val().name, key, "Yes", lastSession, totalSessions, snapshot.val().payMethod, snapshot.val().rate])
                .draw();
        }
    } else {
        //console.log("else")
        clientTable.row.add([snapshot.val().name, key, "Yes", "", "", snapshot.val().payMethod, snapshot.val().rate])
            .draw();
    }
});*/
    });


    //Navigate to single client
    $("#allClientsTable tbody").on("click", "a", function (e) {
        e.preventDefault();
        //Set var to clientId, send id to addNote button so it can be included with notes
        var clientKey = $(this).attr("value");
        $('#addNote').attr("value", clientKey);
        var clientName = $(this).attr("name")
        $("#clientNameDisplay").text(clientName);
        //Send id to display function for use in filtering notes
        singleClientDisplay(clientKey);
        noteDisplay(clientKey);
        //Update UI
        $("#allClients").hide();
        $("#singleClient").show();
    });

    //Navigate to all clients
    $("#showClients").on("click", function (e) {
        e.preventDefault();
        $("#singleClient").hide();
        $("#allClients").show();
    })

    // ---------------- Managing Notes ------------

    //Handle noteForm submission
    $("#noteForm").submit(function (event) {
        event.preventDefault();
        var key = $("#addNote").attr("value");
        //console.log(key);
        var date = $("#date").val();
        var title = $("#title").val();
        var keywords = $("#keywords").val() || null;
        var notes = $("#notes").val();
        var paid = $("#paid").val();
        var datePaid = $("#datePaid").val() || null;
        var paySource = $("#paySource").val() || null;
        //Send info to be added to database
        addNotes(key, date, title, keywords, notes, paid, datePaid, paySource);
        //Update UI
        $("#notesModal").modal("hide");
    });

    //Add notes to database
    function addNotes(key, date, title, keywords, notes, paid, datePaid, paySource) {
        database.ref("notes/").push({
            key: key,
            date: date,
            title: title,
            keywords: keywords,
            notes: notes,
            paid: paid,
            datePaid: datePaid,
            paySource: paySource
        });
        singleClientDisplay(key);
        noteDisplay(key);
    }

    //Display notes in table
    function singleClientDisplay(key) {
        //console.log(key)
        var currentNotes = notesFromDatabase.filter(function (note) {
            return (note.key === key)
        })
        notesTable.rows().remove().draw();
        currentNotes.forEach(function (note) {
            //console.log(note.title)
            var details = [note.title, note.date, note.keywords, note.paid, (note.datePaid || null)]
            notesTable.row.add(details).draw();
        })
    };

    //Display note content in slideshow
    function noteDisplay(key) {
        var currentKey = key
        console.log("key1", currentKey)
        if (notesFromDatabase.length === 0) {
            $("#noteTitle").html(null)
            $("#noteContent").html("No notes added yet.")

        } else {
            console.log("key2", currentKey)
            var currentNotes = notesFromDatabase.filter(function (note) {
                return (note.key === key)
            })
            if (currentNotes.length === 0) {
                //console.log("key3", key)
                $("#noteTitle").html(null)
                $("#noteContent").html("No notes added yet.")
            } else {
                console.log("key4", currentKey)
                var i = (currentNotes.length - 1)
                    //console.log(i)
                $("#noteTitle").html(currentNotes[i].title || null)
                $("#noteContent").html(currentNotes[i].notes || "No notes added yet.")
                    //scroll through notes array
                    //!!!!scroll issue when # notes < the prev one viewed
                $("#decrement").click(function () {
                    console.log("decKey", key);
                    console.log("decKey2", currentKey);
                    var decNotes = currentNotes.filter(function (note) {
                        return note.key == key
                    });
                    //console.log("decNotes", decNotes)
                    if (decNotes.length === 0) {
                        return;
                    } else if (i > 0) {
                        //console.log("decrement ", currentNotes)
                        i--;
                        $("#noteTitle").html(decNotes[i].title)
                        $("#noteContent").html(decNotes[i].notes)
                    }
                });
                $("#increment").click(function () {
                    console.log(currentNotes)
                    if (currentNotes.length === 0) {
                        return
                    } else if (i < (currentNotes.length - 1)) {
                        //console.log("increment ", currentNotes)
                        i++;
                        $("#noteTitle").html(currentNotes[i].title)
                        $("#noteContent").html(currentNotes[i].notes)
                    }
                });
                //change display on click
                //!!!!!need way to make the click local to link, not whole row
                $('#notesTable tbody').on('click', 'tr', function () {
                    //get table row data
                    var data = notesTable.row(this).data();
                    var title = data[0];
                    var keywords = data[2];
                    //compare data to each note in array
                    currentNotes.forEach(function (note) {
                        if (note.title === title && note.keywords === keywords) {
                            //if data matches, find index of note and display content
                            i = ($.inArray(note, currentNotes))
                            $("#noteTitle").html(currentNotes[i].title)
                            $("#noteContent").html(currentNotes[i].notes)
                        }
                    });
                });
            }
        }
    };
});



//Display payments in table

//Delete client

//Edit client details

//Delete note

//Edit note details
