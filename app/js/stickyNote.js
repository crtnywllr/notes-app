//------------Managing Sticky Note ----------
//save notes on enter and send to db
$(".stickyNote").keydown(function (e) {
    var uId = $("#stickyToggle").attr("value");
    var key = $("#editClientProfile").attr("value");
    if (e.keyCode == 13) {
        var updates = {
            uId: uId,
            notes: $(".stickyNote").val().trim(),
            key: key
        }
        database.ref("sticky-note/").child(key).update(updates);
    }
})

//display only sticky for that client
function displayStickyNote(key) {
    var currentSticky = stickyNoteList.filter(function (note) {
        if (stickyNoteList.length === 0) {
            $(".stickyNote").html("");
        } else {
            if (note.id === key) {
                $(".stickyNote").html(note.note.notes);
            }
        }
    })
}
