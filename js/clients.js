var clientTable;
var notesTable;
var paymentTable;

var editSubmitOldIds = [];
var paymentSubmitOldIds = [];
var sidebar = [];

var notesFromDatabase = [];
var clientList = [];
var stickyNoteList = [];

//populating side menu from clientList, generate li's under active ul that have key as id on a

$(document).ready(function () {
    //------------Retrieving data from database --------

    //Sends all notes to array for filtering later
    database.ref("notes/").on("child_added", function (snap) {
        notesFromDatabase.push({
            note: snap.val(),
            id: snap.getKey()
        });
        //console.log(notesFromDatabase);
        displayPayments();
    })

    //Sends all clients to array for filtering later
    database.ref("clients/").on("child_added", function (snap) {
        var key = snap.getKey()
        clientList.push({
            client: snap.val(),
            id: key
        });
        updateClientTable();
        updateSidebar();
    })

    //Sends sticky note details to array for filtering later
    database.ref("sticky-note/").on("child_added", function (snap) {
        var key = snap.getKey()
        stickyNoteList.push({
            note: snap.val(),
            id: key
        });
    })

    //Listens for updates on clients
    database.ref("clients/").on("child_changed", function (snap) {
        var id = snap.getKey();
        //console.log(id)
        var clientArray = clientList.filter(function (client) {
            return client.id === id;
        })
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
    })

    //Listens for removed clients
    database.ref("clients/").on("child_removed", function (snap) {
        var id = snap.getKey();
        //console.log(id)
        var clientArray = clientList.filter(function (client) {
            return client.id === id;
        })
        var client = clientArray[0];
        //console.log(note)
        var i = clientList.indexOf(client);
        //console.log(i)

        if (i !== -1) {
            clientList.splice(i, 1);
        }
    })

    //Listens for updates on notes
    database.ref("notes/").on("child_changed", function (snap) {
        var id = snap.getKey();
        //console.log(id)
        var noteArray = notesFromDatabase.filter(function (note) {
            return note.id === id;
        })
        var note = noteArray[0];
        //console.log(note)
        var i = notesFromDatabase.indexOf(note);
        //console.log(i)

        if (i !== -1) {
            notesFromDatabase[i] = {
                note: snap.val(),
                id: id
            }
        }
        //console.log(notesFromDatabase);
    })

    //Listens for removed notes
    database.ref("notes/").on("child_removed", function (snap) {
        var id = snap.getKey();
        //console.log(id)
        var noteArray = notesFromDatabase.filter(function (note) {
            return note.id === id;
        })
        var note = noteArray[0];
        //console.log(note)
        var i = notesFromDatabase.indexOf(note);
        //console.log(i)

        if (i !== -1) {
            notesFromDatabase.splice(i, 1);
        }
    })

    //Initial display
    $("#singleClient").hide();
    $("#payments").hide();
    $("#clientProfile").hide();
    $("#allClients").show();

    //------Initializing Tables ----------------

    //Initialize table of all clients
    var clientTable = $("#allClientsTable").DataTable({
        responsive: true,
        "columnDefs": [
            {
                "render": function (data, type, row) {
                    //console.log(row[0]);
                    return "<a class='clientLink' href='' value='" + row[1] + "' name= '" + row[0] + "'>" + row[0] + "</a>";
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
        "columnDefs": [
            {
                "targets": 0,
                "data": null,
                "render": function (data, type, row) {
                    return "<i data-toggle='modal' data-target='#editModal' id='edit' class='fa fa-pencil'></i>";
                }

            },
            {
                "targets": [1],
                "visible": false
            },
            {
                "targets": 2,
                "data": null,
                "render": function (data, type, row) {
                    return "<a class='noteLink' href=''>" + row[2] + "</a>";
                }
            },
            {
                "targets": [7],
                "visible": false
            },
            {
                "targets": -1,
                "data": null,
                "render": function (data, type, row) {
                    return "<i id='delete' class='fa fa-trash-o'></i>";
                }

            }
        ]
    });

    //Initialize table for payments
    var paymentTable = $("#paymentTable").DataTable({
        responsive: true,
        "columnDefs": [
            {
                "targets": 0,
                "data": null,
                "render": function (data, type, row) {
                    return "<i data-toggle='modal' data-target='#payModal' id='edit' class='fa fa-pencil'></i>";
                }

            },
            {
                "render": function (data, type, row) {
                    return "<a class='clientLink' href='' value='" + row[2] + "' name= '" + row[1] + "'>" + row[1] + "</a>";
                },
                "targets": 1
            },
            {
                "visible": false,
                "targets": [2, 4]
            }
        ]
    });

    //------------Navigation------------
    //Navigate to single client from all clients
    $("tbody").on("click", ".clientLink", function (e) {
        e.preventDefault();
        //send id and name to addNote button so it can be included with notes
        var clientKey = $(this).attr("value");
        $("#addNote").attr("value", clientKey);
        $("#editNote").attr("value", clientKey);
        $("#decrement").attr("value", clientKey);
        $("#increment").attr("value", clientKey);
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
    $("#paymentShow").on("click", function (e) {
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
        $("#decrement").attr("value", key);
        $("#increment").attr("value", key);
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
        $("#decrement").attr("value", key);
        $("#increment").attr("value", key);
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
            console.log(client)
            var found = $.inArray(key, sidebar)
            if (sidebar.length === 0 || found === -1) {
                sidebar.push(key);
                var html = "";
                html += "<li><a id='" + key + "' href=''>" + client.client.name + "</a></li>"
                if (client.client.status === "Active") {
                    $("#activeList").append(html);
                } else {
                    $("#archiveList").append(html);
                }
            }
        });
    }

    //Update clients table display
    function updateClientTable() {
        //console.log(clientList);
        clientTable.rows().remove().draw();
        clientList.forEach(function (client) {
            //console.log("client ", client)
            var id = client.id;
            var client = client.client;
            //get data from notes array to fill in table
            var noteData = getData(id);
            clientTable.row.add([client.name, id, client.status, noteData.lastSession, noteData.totalSessions, client.payMethod, client.rate]).draw();
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


    //--------------Managing Client Profile---------
    //pulling client details for profiles
    function showClientDetails(key) {
        $("#editClientProfile").attr("value", key)
        clientList.filter(function (client) {
            if (client.id === key) {
                $("#act").text("Status: " + client.client.status);
                $("#eml").text("Email: " + client.client.email);
                $("#loc").text("Location: " + client.client.location);
                $("#occ").text("Occupation: " + client.client.occupation);
                $("#DOB").text("Date of Birth: " + client.client.dob);
                $("#Age").text("Age: " + client.client.age);
                $("#pay").text("Preferred Payment Method: " + client.client.payMethod);
                $("#fee").text("Session Rate: " + client.client.rate);
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
        var client = clientList.filter(function (client) {
            return client.id === id;
        })
        var c = client[0].client;
        //fill placeholders with current info
        var name = $("#nameEdit").attr("value", c.name);
        var email = $("#emailEdit").attr("value", c.email);
        var dob = $("#dobEdit").attr("value", c.dob);
        var age = $("#ageEdit").attr("value", c.age);
        var location = $("#locationEdit").attr("value", c.location);
        var occupation = $("#occupationEdit").attr("value", c.occupation);
        var payMethod = $("#payMethodEdit").val(c.payMethod);
        var rate = $("#rateEdit").val(c.rate);
        //handle form submission
        $("#clientEditForm").submit(function (e) {
            e.preventDefault();
            clientEditDetails(id);

        })
    });
    //set params to send to db
    function clientEditDetails(id) {
        var status = $("#status").val();
        var name = $("#nameEdit").val();
        var email = $("#emailEdit").val();
        var dob = $("#dobEdit").val();
        var age = $("#ageEdit").val();
        var location = $("#locationEdit").val();
        var occupation = $("#occupationEdit").val();
        var payMethod = $("#payMethodEdit").val();
        var rate = $("#rateEdit").val();
        //send info to be added to database
        editClient(id, status, name, email, dob, age, location, occupation, payMethod, rate)
            //Update UI
        $("#editClientModal").modal("hide");
    }

    //Send edits for client to database
    function editClient(id, status, name, email, dob, age, location, occupation, payMethod, rate) {
        var updates = {};
        var editedInfo = {
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
            })
        })
        updateClientTable();
        updateSidebar(id);
        displayPayments();
        //switch view back to all clients
        $("#singleClient").hide();
        $("#payments").hide();
        $("#clientProfile").hide();
        $("#allClients").show();
    })

    //Delete Note
    $('#notesTable tbody').on('click', '#delete', function () {
        var data = notesTable.row($(this).parents('tr')).data();
        //console.log(data);
        id = data[7];
        key = data[1];
        database.ref("notes/").child(id).remove();
        //update client's list of notes
        singleClientDisplay(key);
        //update note in slideshow if it was selected
        noteDisplay();
        //change number of notes on client table
        updateClientTable();
        //change history of notes for payment table
        displayPayments();
    });

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
        //console.log("1", clientName)
        //Update UI
        $("#notesModal").modal("hide");
    });

    //Add notes to database
    function addNotes(key, clientName, date, title, keywords, notes, paid, datePaid, amount, paySource) {
        //console.log("2", clientName)
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

    //Edit Notes
    //select row by clicking button
    $('#notesTable tbody').on('click', '#edit', function () {
        var data = notesTable.row($(this).parents('tr')).data();
        var id = data[7];
        //filter notes to return note that was clicked
        var noteToEdit = notesFromDatabase.filter(function (note) {
            return note.id === id
        });
        var n = noteToEdit[0].note;
        var noteId = noteToEdit[0].id
            //update placeholders in modal
        $("#editDate").attr("value", n.date);
        $("#editTitle").attr("value", n.title);
        $("#editKeywords").attr("value", n.keywords);
        $("#editNotes").val(n.notes);
        $("#editPaid").val(n.paid);
        $("#editDatePaid").attr("value", n.datePaid || null);
        $("#editAmount").attr("value", n.amount || null);
        $("#editPaySource").val(n.paySource || null);
        //call to handle form submission on click
        $("#editForm").submit(function (event) {
            var key = $("#editNote").attr("value");
            var clientName = $("#editNote").attr("name");
            // console.log("clicked");
            event.preventDefault();
            //console.log(submitCounter + " " + noteId);
            sendNoteUpdates(id, key, clientName);
            //submitCounter++;
        });
    });

    //Handle editForm submission
    function sendNoteUpdates(id, key, clientName) {
        var found = $.inArray(id, editSubmitOldIds);
        if (editSubmitOldIds.length === 0 || found === -1) {
            var date = $("#editDate").val();
            var title = $("#editTitle").val();
            var keywords = $("#editKeywords").val() || null;
            var notes = $("#editNotes").val();
            var paid = $("#editPaid").val();
            var datePaid = $("#editDatePaid").val() || null;
            var amount = $("#editAmount").val() || null;
            var paySource = $("#editPaySource").val() || null;
            //Send info to be added to database
            editNotes(id, key, clientName, date, title, keywords, notes, paid, datePaid, amount, paySource);
            //Update UI
            $("#editModal").modal("hide");
            editSubmitOldIds.push(id);
        }
    };

    //Update notes after edit
    function editNotes(id, key, clientName, date, title, keywords, notes, paid, datePaid, amount, paySource) {
        var updates = {};
        var editedInfo = {
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

    //Delete Note
    $('#notesTable tbody').on('click', '#delete', function () {
        var data = notesTable.row($(this).parents('tr')).data();
        //console.log(data);
        id = data[7];
        key = data[1];
        var item = {};
        item["notes/" + id] = id;
        database.ref("notes/").child(id).remove();
        //update client's list of notes
        singleClientDisplay(key);
        //update note in slideshow if it was selected
        noteDisplay();
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
        //console.log(key)
        if (notesFromDatabase.length === 0) {
            $("#noteTitle").html(null);
            $("#noteContent").html("No notes added yet.");

        } else {
            //console.log("key2", currentKey)
            var currentNotes = notesFromDatabase.filter(function (note) {
                return (note.note.key === key)
            });
            if (currentNotes.length === 0) {
                //console.log("key3", key)
                $("#noteTitle").html(null);
                $("#noteContent").html("No notes added yet.");
            } else {
                //console.log("key4", currentKey)
                var i = (currentNotes.length - 1);
                //console.log(i)
                //console.log(currentNotes[i].note.notes);
                $("#noteTitle").html(currentNotes[i].note.title || null);
                $("#noteContent").html(currentNotes[i].note.notes || "No notes added yet.");
                //scroll through notes array
                //!!!!scroll issue when # notes < the prev one viewed
                $("#decrement").click(function () {
                    var key = $("#decrement").attr("value");
                    var currentNotes = notesFromDatabase.filter(function (note) {
                        return note.note.key == key;
                    });
                    if (currentNotes.length === 0) {
                        return;
                    } else if (i > 0) {
                        //console.log("decrement ", currentNotes)
                        i--;
                        $("#noteTitle").html(currentNotes[i].note.title);
                        $("#noteContent").html(currentNotes[i].note.notes);
                    }
                });
                $("#increment").click(function () {
                    var key = $("#increment").attr("value");
                    var currentNotes = notesFromDatabase.filter(function (note) {
                        return note.note.key == key;
                    });
                    if (currentNotes.length === 0) {
                        return;
                    } else if (i < (currentNotes.length - 1)) {
                        i++;
                        $("#noteTitle").html(currentNotes[i].note.title);
                        $("#noteContent").html(currentNotes[i].note.notes);
                    }

                });
                //change display on click
                $("#notesTable tbody").on("click", "a", function (e) {
                    e.preventDefault();
                    //get table row data
                    var data = notesTable.row($(this).parents("tr")).data();
                    console.log(data);
                    var title = data[2];
                    var keywords = data[4];
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

    //------------Managing Sticky Note ----------

    //save notes on enter and send to db
    $('.stickyNote').keydown(function (e) {
        var key = $("#editClientProfile").attr("value");
        if (e.keyCode == 13) {
            var updates = {
                notes: $(".stickyNote").val(),
                key: key
            }
            database.ref("sticky-note/").child(key).update(updates);
        }
    })

    //display only sticky for that client
    function displayStickyNote(key) {
        var currentSticky = stickyNoteList.filter(function (note) {
            console.log(note);
            if (stickyNoteList.length === 0) {
                $(".stickyNote").html("");
            } else {
                if (note.id === key) {
                    $(".stickyNote").html(note.note.notes);
                }
            }
        })
    }


    //------------Managing Payments -------------
    //Display payments in table
    function displayPayments() {
        //console.log(notesFromDatabase);
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
        var data = paymentTable.row($(this).parents('tr')).data();
        //console.log(data);
        var id = data[4];
        //console.log(id)
        //filter notes to return note that was clicked
        var noteToEdit = notesFromDatabase.filter(function (note) {
            return note.id === id
        });
        var n = noteToEdit[0].note;
        var key = n.key;
        //update placeholders in modal
        $("#updatePaid").val(n.paid);
        $("#updateDatePaid").attr("value", n.datePaid || null);
        $("#updateAmount").attr("value", n.amount || null);
        $("#updatePaySource").val(n.paySource || null);
        //call to handle form submission on click
        $("#paymentForm").submit(function (event) {
            event.preventDefault();
            sendPaymentUpdates(id, n);
        });
    });

    //Handle paymentForm submission
    function sendPaymentUpdates(id, n) {
        var found = $.inArray(id, paymentSubmitOldIds);
        if (paymentSubmitOldIds.length === 0 || found === -1) {
            var paid = $("#updatePaid").val();
            var datePaid = $("#updateDatePaid").val() || "";
            var amount = $("#updateAmount").val() || "";
            var paySource = $("#updatePaySource").val() || "";
            //Send info to be added to database
            editPayment(id, n, paid, datePaid, amount, paySource);
            //Update UI
            $("#payModal").modal("hide");
            paymentSubmitOldIds.push(id);
        }
    };

    function editPayment(id, n, paid, datePaid, amount, paySource) {
        console.log(n)
        var updates = {};
        var key = n.key
        var editedInfo = {
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
    //end of document.ready
});




//Delete client

//Edit client details

//Delete note

//Edit note details

//Create client profile
