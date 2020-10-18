// OOP Aproach

interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validatableInput: Validatable) {
  let isValid = true;

  if (validatableInput.required) {
    isValid = isValid && !!validatableInput.value.toString().trim().length;
  }

  if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
    isValid = isValid && validatableInput.value.trim().length >= validatableInput.minLength;
  }

  if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
    isValid = isValid && validatableInput.value.trim().length <= validatableInput.maxLength;
  }

  if (validatableInput.min != null && typeof validatableInput.value === 'number') {
    isValid = isValid && validatableInput.value >= validatableInput.min;
  }

  if (validatableInput.max != null && typeof validatableInput.value === 'number') {
    isValid = isValid && validatableInput.value <= validatableInput.max;
  }

  console.log(validatableInput.value, isValid);

  return isValid;
}

function Autobind(
  _target: any,
  _methodName: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const original = descriptor.value;
  const modified: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = original.bind(this);
      return boundFn;
    },
  };
  return modified;
}

type gatherUser = [string, string, number] | void;

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

    this.configure();
    this.attach();
  }

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
      [this.titleInputElement, this.descriptionInputElement, this.peopleInputElement].forEach((x) =>
        this.clearInput(x)
      );
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  @Autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      console.log(userInput);
    }
  }

  private clearInput(input: HTMLInputElement) {
    input.value = '';
  }

  private configure() {
    this.form.addEventListener('submit', this.submitHandler);
  }

  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.form);
  }
}

new ProjectInput();
