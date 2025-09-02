
export default class NotesView {
    //constructor takes 2 parameters root(which is main as everything runs from it) and object with callback functions-

    constructor(root, { onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete } = {}) {
        this.root = root;
        this.onNoteSelect = onNoteSelect;
        this.onNoteAdd = onNoteAdd;
        this.onNoteEdit = onNoteEdit;
        this.onNoteDelete = onNoteDelete;

        this.root.innerHTML = `
         <div class="notes">
        <div class="sidebar">
            <button class="add">Add Notes</button>
            <div class="noteslist">
                <div class="listitem"></div>
            </div>
        </div>
        <div class="preview">
            <input type="text" class="notestitle" placeholder="New Note..."></input>
            <textarea class="notesbody" placeholder="Take a Note..."></textarea>
        </div>
    </div>
        `;

        // finding and saving elements to use them later -

        const btnAddNote = this.root.querySelector(".add");
        const inpTitle = this.root.querySelector(".notestitle");
        const inpBody = this.root.querySelector(".notesbody");

        // Now using them (for adding event listeners)
        btnAddNote.addEventListener('click', () => {
            this.onNoteAdd()
        });

        // when users enters title and body - using blur - to autosave when user stops typing and press tab - using trim - to trim the extra spaces
        [inpTitle, inpBody].forEach(inpField => {
            inpField.addEventListener('blur', () => {
                const UpdatedTitle = inpTitle.value.trim();
                const UpdatedBody = inpBody.value.trim();

                this.onNoteEdit(UpdatedTitle, UpdatedBody);

            });
        });
        console.log(this._createListItemHTML(300, "hey", "this is naina", new Date()));
    }

    //creating a small preview card for a note - (making it private using underscore)
    _createListItemHTML(id, title, body, updated) {

        const maxbody_length = 60;
        //returning and creating  a div container with class notes_list_item and a data attribute for the note ID - setting max length 60 -if it exceeds showing ...
        return `
                <div class = "notes_list_item" data-note-id="${id}">
                <div class = "notes_small_title">${title}</div>
                <div class = "notes_small_body">
                ${body.substring(0, maxbody_length)}
                ${body.length > maxbody_length ? "..." : ""}
                </div>
                 <div class="notes_small_updated">
                    ${updated.toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" })}
                </div>
                </div>
                `;
    }

    updateNoteList(notes) {
        const notesListContainer = this.root.querySelector(".noteslist")

        //emptying list -
        notesListContainer.innerHTML = "";

        for (const note of notes) {
            const html = this._createListItemHTML(note.id, note.title, note.body, new Date(note.updated));

            notesListContainer.insertAdjacentHTML("beforeend", html);
        }

        //select and delete event for each note/listitem - 
        notesListContainer.querySelectorAll(".notes_list_item").forEach(noteListItem => {
            noteListItem.addEventListener('click', (e) => {
                e.stopPropagation();
                if (this.onNoteSelect) {
                    this.onNoteSelect(noteListItem.dataset.noteId);
                }
            });

            noteListItem.addEventListener("dblclick", (e) => {
                e.stopPropagation();
                const doDelete = confirm("Are you sure you want to delete this note?");
                if (doDelete) {
                    this.onNoteDelete(noteListItem.dataset.noteId);
                }
            });
        });
    }

    // NEW METHOD: To update the active note in the preview panel
    updateActiveNote(note) {
        // First clear any existing active state
        this.root.querySelectorAll(".notes_list_item").forEach(item => {
            item.classList.remove("active");
        });

        // Then set the new active note if one was provided
        if (note) {
            const selectedNote = this.root.querySelector(
                `.notes_list_item[data-note-id="${note.id}"]`
            );
            if (selectedNote) {
                selectedNote.classList.add("active");
            }

            // Update the preview fields
            this.root.querySelector(".notestitle").value = note.title;
            this.root.querySelector(".notesbody").value = note.body;
        } else {
            // Clear the preview fields if no note is selected
            this.root.querySelector(".notestitle").value = "";
            this.root.querySelector(".notesbody").value = "";
        }
    }
}