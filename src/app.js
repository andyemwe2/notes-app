import { notesData } from "./script/data/data.js";
import "./styles/style.css";
import "./script/components/AppBar.js";
import "./script/components/BodyText.js";
import "./script/components/NoteItem.js";
import DataApi from "./script/data/data-api.js";
import anime from "animejs";

document.addEventListener("DOMContentLoaded", () => {
  const notesContainer = document.getElementById("notes-container");
  const loader = document.createElement("div");
  loader.classList.add("loader");
  document.body.appendChild(loader);
  loader.innerText = "Loading...";

  function showLoader() {
    loader.style.display = "block";
    document.body.style.pointerEvents = "none";
    document.body.style.opacity = "0.4";
    anime({
      targets: loader,
      opacity: 1,
      duration: 500,
      easing: "easeInOutSine",
    });
  }

  function hideLoader() {
    loader.style.display = "none";
    document.body.style.pointerEvents = "auto";
    document.body.style.opacity = "1";
    anime({
      targets: loader,
      opacity: 0,
      duration: 500,
      easing: "easeInOutSine",
    });
  }

  showLoader();
  loadNotes();

  document
    .getElementById("notes-container")
    .addEventListener("click", function (event) {
      if (event.target.classList.contains("remove-btn")) {
        const noteElement = event.target.closest("note-item");
        const noteId = noteElement.getAttribute("id");
        const confirmation = confirm(
          "Are you sure you want to delete this note?",
        );
        if (confirmation) {
          showLoader();
          DataApi.delete(noteId)
            .then((responseJson) => {
              hideLoader();
              noteElement.remove();
            })
            .catch((error) => {
              hideLoader();
              alert(`Error deleting note: ${error.message}`);
            });
        }
      }

      if (event.target.classList.contains("archive-btn")) {
        const noteElement = event.target.closest("note-item");
        const noteId = noteElement.getAttribute("id");
        const confirmation = confirm(
          "Are you sure you want to archive this note?",
        );
        if (confirmation) {
          showLoader();
          DataApi.archive(noteId)
            .then((responseJson) => {
              hideLoader();
              noteElement.remove();
            })
            .catch((error) => {
              hideLoader();
              alert(`Error archiving note: ${error.message}`);
            });
        }
      }

      if (event.target.classList.contains("unarchive-btn")) {
        const noteElement = event.target.closest("note-item");
        const noteId = noteElement.getAttribute("id");
        const confirmation = confirm(
          "Are you sure you want to unarchive this note?",
        );
        if (confirmation) {
          showLoader();
          DataApi.unarchive(noteId)
            .then((responseJson) => {
              hideLoader();
              noteElement.remove();
            })
            .catch((error) => {
              hideLoader();
              alert(`Error unarchiving note: ${error.message}`);
            });
        }
      }
    });

  document
    .getElementById("add-note-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const title = document.getElementById("note-title").value;
      const body = document.getElementById("note-body").value;
      const newNote = { id: Date.now(), title, body };
      const noteElement = document.createElement("note-item");
      noteElement.setAttribute("title", newNote.title);
      noteElement.setAttribute("body", newNote.body);
      showLoader();
      DataApi.insert(newNote.title, newNote.body)
        .then((responseJson) => {
          hideLoader();
          document.getElementById("notes-container").appendChild(noteElement);
          anime({
            targets: noteElement,
            opacity: [0, 1],
            duration: 500,
            easing: "easeInOutSine",
          });
        })
        .catch((error) => {
          hideLoader();
          alert(`Error adding note: ${error.message}`);
        });
      document.getElementById("add-note-form").reset();
      toggleModal();
    });

  document
    .querySelector("app-bar button")
    .addEventListener("click", function () {
      toggleModal();
    });

  document.querySelector(".close-btn").addEventListener("click", function () {
    toggleModal();
  });

  document.querySelector(".flag-btn").addEventListener("click", function () {
    const flagInput = document.getElementById("flag");
    const flagButton = document.querySelector(".flag-btn");
    if (flagInput.value === "x") {
      flagInput.value = null;
      flagButton.style.opacity = "0.5";

      DataApi.searchArc()
        .then((responseJson) => {
          const notesContainer = document.getElementById("notes-container");
          notesContainer.innerHTML = "";
          responseJson.data.forEach((note) => {
            const noteElement = document.createElement("note-item");
            noteElement.setAttribute("title", note.title);
            noteElement.setAttribute("body", note.body);

            notesContainer.appendChild(noteElement);
          });

          if (flagInput.value === null) {
            noteElement.innerHTML = noteElement.innerHTML.replace(
              "archive-btn",
              "unarchive-btn",
            );
          }
        })
        .catch((error) => {
          alert(`Error fetching archived notes: ${error.message}`);
        });
    } else {
      const notesContainer = document.getElementById("notes-container");
      notesContainer.innerHTML = "";
      loadNotes();
      flagInput.value = "x";
      flagButton.style.opacity = "1";
    }
  });

  window.addEventListener("click", function (event) {
    const modal = document.getElementById("modal");
    if (event.target === modal) {
      toggleModal();
    }
  });

  function toggleModal() {
    const modal = document.getElementById("modal");
    modal.classList.toggle("hidden");
    modal.style.display = modal.style.display === "block" ? "none" : "block";
    anime({
      targets: modal,
      opacity: [0, 1],
      duration: 500,
      easing: "easeInOutSine",
    });
  }

  function loadNotes() {
    DataApi.search()
      .then((responseJson) => {
        hideLoader();
        responseJson.data.forEach((note) => {
          const noteElement = document.createElement("note-item");
          noteElement.setAttribute("title", note.title);
          noteElement.setAttribute("body", note.body);
          notesContainer.appendChild(noteElement);
          anime({
            targets: noteElement,
            opacity: [0, 1],
            duration: 500,
            easing: "easeInOutSine",
          });
        });
      })
      .catch((error) => {
        hideLoader();
        alert(`Error loading notes: ${error.message}`);
      });
  }
});