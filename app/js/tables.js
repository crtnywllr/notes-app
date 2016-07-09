//------Initializing Tables ----------------

//Initialize table of all clients
clientTable = $("#allClientsTable").DataTable({
    responsive: true,
    "columnDefs": [
        {
            "width": "20%",
            "render": function (data, type, row) {
                return "<a class='clientLink' href='' value='" + row[1] + "' name= '" + row[0] + "'>" + row[0] + "</a>";
            },
            "targets": 0
        },
        {
            "visible": false,
            "targets": [1]
        },
        {
            "width": "12%",
            "targets": [4, 5, 6]
        }
    ]
});

//Initialize table for single client dispaly
notesTable = $("#notesTable").DataTable({
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
            "targets": 1,
            "visible": false
        },
        {
            "targets": 2,
            "data": null,
            "render": function (data, type, row) {
                return "<a class='noteLink' value='" + row[1] + "' href=''>" + row[2] + "</a>";
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
paymentTable = $("#paymentTable").DataTable({
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
