class AppBar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header>
        <h1>My Notes</h1>
        <button id="add-note-btn">+ Add new</button>
      </header>
    `;
  }
}

customElements.define("app-bar", AppBar);
