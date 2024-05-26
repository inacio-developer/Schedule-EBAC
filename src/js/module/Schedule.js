export default class Schedule {
  constructor(btn, name, phone, schedule, error) {
    this.btn = document.querySelector(`.${btn}`);
    this.name = document.querySelector(`.${name}`);
    this.phone = document.querySelector(`.${phone}`);
    this.schedule = document.querySelector(`.${schedule} ul`);
    this.error = document.querySelector(`.${error}`);
    this.values = { name: "", phone: "" };
  }

  // DOM button actions - EDIT

  cancelEdit(click) {
    const element = click.target.parentElement.parentElement;
    element.outerHTML = this.createElement().outerHTML;
  }

  saveEdit(click) {
    const nameField = click.target.parentElement.parentElement.children[0];
    const phoneField = click.target.parentElement.parentElement.children[1];
    const element = click.target.parentElement.parentElement;

    if (nameField.value && phoneField.value) {
      this.values.name = nameField.value;
      this.values.phone = phoneField.value;
    }

    if (nameField.value && !phoneField.value)
      this.values.name = nameField.value;

    if (!nameField.value && phoneField.value)
      this.values.phone = phoneField.value;

    element.outerHTML = this.createElement().outerHTML;
  }

  // DOM button actions

  editItem(click) {
    const editName = click.target.parentElement.parentElement.children[0];
    const editPhone = click.target.parentElement.parentElement.children[1];
    const btn = [
      click.target.parentElement.children[0],
      click.target.parentElement.children[1],
    ];

    this.values.name = editName.innerText;
    this.values.phone = editPhone.innerText;

    editName.outerHTML = `<input type='text' value="${this.values.name}" class='editText'>`;
    editPhone.outerHTML = `<input type='phone' value="${this.values.phone}" class='editPhone'>`;

    btn.forEach((btn) => (btn.style.display = "none"));

    this.btnEdit().forEach((element) =>
      click.target.parentElement.appendChild(element)
    );

    this.EditEvents();
  }

  deleteItem(click) {
    click.target.parentElement.parentElement.remove();
  }

  // DOM element creation

  btnEdit() {
    const save = document.createElement("img");
    const cancel = document.createElement("img");

    save.src = "/src/img/icon-save.svg";
    cancel.src = "src/img/icon-cancel.svg";

    save.classList.add("btn-confirm-schedule");
    cancel.classList.add("btn-cancel-schedule");

    save.title = "accept";
    cancel.title = "cancel";

    [save, cancel].forEach((btn) => btn.classList.add("buttons-edit-schedule"));

    return [save, cancel];
  }

  createElement() {
    const item = document.createElement("li");
    const p = document.createElement("p");
    const andress = document.createElement("andress");
    const divIcons = document.createElement("div");
    const iconTrash = document.createElement("img");
    const iconEdit = document.createElement("img");

    p.innerText = this.values.name;
    andress.innerText = this.values.phone;

    iconEdit.src = "src/img/icon-edit.svg";
    iconEdit.title = "EDIT";
    iconEdit.alt = "EDIT";

    iconTrash.src = "src/img/icon-delete.svg";
    iconTrash.title = "DELETE";
    iconTrash.alt = "trash";

    andress.setAttribute("href", this.values.phone);

    p.classList.add("name-schedule");
    andress.classList.add("andress-schedule");
    iconEdit.classList.add("btn-edit-schedule");
    iconTrash.classList.add("btn-trash-schedule");

    divIcons.appendChild(iconEdit);
    divIcons.appendChild(iconTrash);

    item.appendChild(p);
    item.appendChild(andress);
    item.appendChild(divIcons);

    return item;
  }

  insert(click) {
    click.preventDefault();

    if (this.checkingFields()) {
      const attValue = this.inputValue();
      const element = this.createElement();

      this.schedule.appendChild(element);

      this.name.value = "";
      this.phone.value = "";
    }
  }

  // events

  EditEvents() {
    const btnAccept = document.querySelectorAll(".btn-confirm-schedule");
    const btnCancel = document.querySelectorAll(".btn-cancel-schedule");

    btnAccept.forEach((btn) => btn.addEventListener("click", this.saveEdit));
    btnCancel.forEach((btn) => btn.addEventListener("click", this.cancelEdit));
  }

  btnEvents() {
    const delContact = document.querySelectorAll(".btn-trash-schedule");
    const editContact = document.querySelectorAll(".btn-edit-schedule");

    delContact.forEach((btn) => btn.addEventListener("click", this.deleteItem));
    editContact.forEach((btn) => btn.addEventListener("click", this.editItem));
  }

  addEvent() {
    this.btn.addEventListener("click", this.insert);
  }

  // business rules methods

  messageError(boolean, string) {
    boolean
      ? (this.error.style.display = "none")
      : (this.error.style.display = "block");

    this.error.innerText = string;

    this.observer();
  }

  checkingFields() {
    let isValid;
    let error;

    if (this.name.value && this.phone.value) isValid = true;
    else {
      isValid = false;

      if (!this.phone.value && !this.name.value)
        error = "you did not enter any data";
      else if (!this.name.value) error = "You did not insert the name";
      else if (!this.phone.value) error = "You did not insert the phone";
    }

    this.messageError(isValid, error);

    return isValid;
  }

  //help methods

  observer() {
    const configs = { childList: true };

    const observer = new MutationObserver((isLi) => {
      const li = isLi[0] ? this.btnEvents() : this.removeEvents();
    });

    observer.observe(this.schedule, configs);
  }

  inputValue() {
    this.values.name = this.name.value;
    this.values.phone = this.phone.value;

    return this.values;
  }

  bind() {
    this.insert = this.insert.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.editItem = this.editItem.bind(this);
    this.saveEdit = this.saveEdit.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
  }

  // start of execution

  init() {
    if (this.btn && this.name && this.phone && this.schedule && this.error) {
      this.bind();
      this.addEvent();
    }
  }
}
