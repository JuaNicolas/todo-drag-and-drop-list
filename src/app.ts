// OOP Aproach

enum ProjectStatus {
  Active,
  Finished,
}

type gatherUser = [string, string, number] | void;

type Listener<T> = (items: T[]) => void;

interface IProjectInput {
  title: string;
  description: string;
  people: number;
}

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

  if (
    validatableInput.minLength != null &&
    typeof validatableInput.value === 'string'
  ) {
    isValid =
      isValid &&
      validatableInput.value.trim().length >= validatableInput.minLength;
  }

  if (
    validatableInput.maxLength != null &&
    typeof validatableInput.value === 'string'
  ) {
    isValid =
      isValid &&
      validatableInput.value.trim().length <= validatableInput.maxLength;
  }

  if (
    validatableInput.min != null &&
    typeof validatableInput.value === 'number'
  ) {
    isValid = isValid && validatableInput.value >= validatableInput.min;
  }

  if (
    validatableInput.max != null &&
    typeof validatableInput.value === 'number'
  ) {
    isValid = isValid && validatableInput.value <= validatableInput.max;
  }

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

//Component Base Class
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  protected templateElement: HTMLTemplateElement;
  protected hostElement: T;
  protected element: U;
  constructor(
    public templateID: string,
    public hostElementID: string,
    public insertPosition: InsertPosition,
    public elementID?: string
  ) {
    this.templateElement = document.getElementById(
      this.templateID
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById(this.hostElementID)! as T;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as U;
    if (this.elementID) {
      this.element.id = this.elementID;
    }

    this.attach(insertPosition);
  }

  private attach(position: InsertPosition) {
    this.hostElement.insertAdjacentElement(position, this.element);
  }

  protected abstract configure(): void;
  protected abstract renderContent(): void;
}

class Project {
  constructor(
    public id: number,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

class State<T> {
  protected _listeners: Listener<T>[] = [];
  constructor() {}

  public addListener(listenerFn: Listener<T>) {
    this._listeners.push(listenerFn);
  }
}

class ProjectState extends State<Project> {
  private _projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    super();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  public addProject({ title, description, people }: IProjectInput) {
    const project = new Project(
      Date.now(),
      title,
      description,
      people,
      ProjectStatus.Active
    );
    this._projects.push(project);
    for (const listenerFn of this._listeners) {
      listenerFn(this._projects.slice());
    }
  }
}

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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

// ProjectList
class ProjectList extends Component<HTMLDivElement, HTMLElement> {
  assignedProjects: Project[] = [];

  constructor(private type: 'active' | 'finished') {
    super('project-list', 'app', 'beforeend', `${type}-projects`);
    globalProjectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter(({ status }) => {
        if (this.type === 'active') {
          return status === ProjectStatus.Active;
        }
        return status === ProjectStatus.Finished;
      });
      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });
    this.renderContent();
  }

  protected configure() {}

  protected renderProjects() {
    const listId = `${this.type}-projects-list`;
    const listEl = document.getElementById(listId) as HTMLUListElement;
    listEl.innerHTML = '';
    for (const prjItem of this.assignedProjects) {
      const listItem = document.createElement('li');
      listItem.textContent = prjItem.title;
      listEl.appendChild(listItem);
    }
  }

  protected renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector(
      'h2'
    )!.textContent = `${this.type.toUpperCase()} PROJECTS`;
  }
}

const globalProjectState = ProjectState.getInstance();
new ProjectInput();
new ProjectList('active');
new ProjectList('finished');
