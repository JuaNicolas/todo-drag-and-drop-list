// OOP Aproach

class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  form: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
    this.hostElement = document.getElementById('app')! as HTMLDivElement;

    const importedNode = document.importNode(this.templateElement.content, true);
    this.form = importedNode.firstElementChild as HTMLFormElement;
    this.form.id = 'user-input';

    this.titleInputElement = this.form.querySelector('#title')! as HTMLInputElement;
    this.descriptionInputElement = this.form.querySelector('#description')! as HTMLInputElement;
    this.peopleInputElement = this.form.querySelector('#people')! as HTMLInputElement;

    this.attach();
    this.configure();
  }

  private submitHandler(event: Event) {
    event.preventDefault();
    console.log(event);
  }

  private configure() {
    this.form.addEventListener('submit', this.submitHandler);
  }

  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.form);
  }
}

new ProjectInput();
