export default class NotesAPI {
    //This class acts like a simple database using localStorage - data is being saved in the browser.
    static getAllNotes() {
        const notes = JSON.parse(localStorage.getItem("notesapp-notes") || "[]");
        //Sorting dates by newest first - descending order
        return notes.sort((a, b) => {
            return notes.sort((a, b) => new Date(b.updated) - new Date(a.updated));
        });
    }

    static saveNotes(noteToSave) {
        const notes = NotesAPI.getAllNotes();
        const existing = notes.find(note => note.id == noteToSave.id)
//For updating or editing 
        if (existing) {
            existing.title = noteToSave.title;
            existing.body = noteToSave.body;
            existing.updated = new Date().toISOString();
            localStorage.setItem("notesapp-notes", JSON.stringify(notes));
        }
//For inserting a new note - generating id and timestamp
        else {
            noteToSave.id = Math.floor(Math.random() * 1000000);
            noteToSave.updated = new Date().toISOString();
            notes.push(noteToSave);
            localStorage.setItem("notesapp-notes", JSON.stringify(notes));
        };
    }

    static deleteNotes(id) {
        //filtering by id match n if it doesnt matches - will remove ultimately

        const notes = NotesAPI.getAllNotes()
        const newNotes = notes.filter(note => note.id != id)
        localStorage.setItem("notesapp-notes",JSON.stringify(newNotes))

    };
}