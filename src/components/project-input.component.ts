namespace App {
  type gatherUser = [string, string, number] | void;

  export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    public titleInputElement!: HTMLInputElement;
    public descriptionInputElement!: HTMLInputElement;
    public peopleInputElement!: HTMLInputElement;
    constructor() {
      super('project-input', 'app', 'afterbegin', 'user-input');
      this.configure();
    }

    protected renderContent() {}

    private gatherUserInput(): gatherUser {
      const enteredTitle = this.titleInputElement.value;
      const enteredDescription = this.descriptionInputElement.value;
      const enteredPeople = this.peopleInputElement.value;

      const titleValidatable: Validatable = {
        value: enteredTitle,
        required: true,
        minLength: 2,
      };
      const descriptionValidatable: Validatable = {
        value: enteredDescription,
        required: true,
        minLength: 2,
        maxLength: 240,
      };
      const peopleValidatable: Validatable = {
        value: +enteredPeople,
        required: true,
        min: 1,
        max: 10,
      };

      if (
        !validate(titleValidatable) ||
        !validate(descriptionValidatable) ||
        !validate(peopleValidatable)
      ) {
        return;
      } else {
        this.cleanInputs();
        return [enteredTitle, enteredDescription, +enteredPeople];
      }
    }

    private cleanInputs() {
      [
        this.titleInputElement,
        this.descriptionInputElement,
        this.peopleInputElement,
      ].forEach((input) => (input.value = ''));
    }

    @Autobind
    private submitHandler(event: Event) {
      event.preventDefault();
      const userInput = this.gatherUserInput();
      if (Array.isArray(userInput)) {
        const [title, description, people] = userInput;
        globalProjectState.addProject({ title, description, people });
      }
    }

    protected configure() {
      this.titleInputElement = this.element.querySelector(
        '#title'
      ) as HTMLInputElement;
      this.descriptionInputElement = this.element.querySelector(
        '#description'
      ) as HTMLInputElement;
      this.peopleInputElement = this.element.querySelector(
        '#people'
      ) as HTMLInputElement;
      this.element.addEventListener('submit', this.submitHandler);
    }
  }
}
