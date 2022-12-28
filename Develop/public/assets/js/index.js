// Declaring several variables that are used to store references to elements on the page. These variables are only defined if the current page is the '/notes' route.

let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;

// If we are on the notes page, get all notes from the db and render them to the sidebar

if (window.location.pathname === '/notes') {
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  noteList = document.querySelectorAll('.list-container .list-group');
}

// Several functions for performing common tasks, such as showing or hiding elements, making HTTP requests to the server, and rendering the notes to the page.

const show = (elem) => {
  elem.style.display = 'inline';
};

const hide = (elem) => {
  elem.style.display = 'none';
};


let activeNote = {};

// The getNotes function sends an HTTP GET request to the '/api/notes' route to retrieve a list of notes from the server.

const getNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

// The saveNote function sends an HTTP POST request to the same route, passing along a new note to be saved to the server.

const saveNote = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });

// The deleteNote function sends an HTTP DELETE request to the '/api/notes/:id' route, passing along the id of the note to be deleted.

const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });



// The renderActiveNote function displays the currently active note, or hides the elements if no note is active.

const renderActiveNote = () => {
  hide(saveNoteBtn);

  if (activeNote.id) {
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else {
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};


// The handleNoteSave function is called whenever the user clicks the save icon. It saves the active note to the db and updates the view.

const handleNoteSave = () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
  };
  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};



// The handleNoteDelete function is called when the user clicks the delete icon for a note in the list. It removes the note from the db and updates the view.
const handleNoteDelete = (e) => {

  // prevents the click listener for the list from being called when the button inside of it is clicked
  e.stopPropagation();

  const note = e.target;
  const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

  if (activeNote.id === noteId) {
    activeNote = {};
  }

  deleteNote(noteId).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};


// The handleNoteView function is called when the user clicks on a note's title in the list. It sets the activeNote and displays it.

const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
};

// The handleNewNoteView function is called when the user clicks the 'New Note' button. It sets the activeNote to an empty object and allows the user to enter a new note.

const handleNewNoteView = (e) => {
  activeNote = {};
  renderActiveNote();
};

// The handleRenderSaveBtn function is called whenever the user types in the note title or text. It determines whether or not the save button should be shown based on the values of the noteTitle and noteText elements.

const handleRenderSaveBtn = () => {
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
};

// The renderNoteList function renders the list of note titles to the sidebar, setting up an event listener for each one to handle viewing, deleting, or editing a note.
const renderNoteList = async (notes) => {
  let jsonNotes = await notes.json();
  if (window.location.pathname === '/notes') {
    noteList.forEach((el) => (el.innerHTML = ''));
  }

  let noteListItems = [];

  // the script sets up event listeners for various user actions, such as clicking on buttons or typing in the textarea. These event listeners call the appropriate functions to handle the user's actions.

  const createLi = (text, delBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');

    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleNoteView);

    liEl.append(spanEl);

    if (delBtn) {
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      delBtnEl.addEventListener('click', handleNoteDelete);

      liEl.append(delBtnEl);
    }

    return liEl;
  };

  if (jsonNotes.length === 0) {
    noteListItems.push(createLi('No saved Notes', false));
  }

  jsonNotes.forEach((note) => {
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);

    noteListItems.push(li);
  });

  if (window.location.pathname === '/notes') {
    noteListItems.forEach((note) => noteList[0].append(note));
  }
};


// The getAndRenderNotes function is called when the page loads. It gets the notes from the db and renders them to the sidebar.
const getAndRenderNotes = () => getNotes().then(renderNoteList);


if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  noteTitle.addEventListener('keyup', handleRenderSaveBtn);
  noteText.addEventListener('keyup', handleRenderSaveBtn);
}

getAndRenderNotes();
