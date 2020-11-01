namespace App {
  export class ProjectItem
    extends Component<HTMLUListElement, HTMLLIElement>
    implements Draggable {
    private _project: Project;

    public get person(): string {
      if (this._project.people === 1) {
        return '1 person';
      } else {
        return `${this._project.people} persons`;
      }
    }

    constructor(hostId: string, project: Project) {
      super('single-project', hostId, 'beforeend', `${project.id}`);
      this._project = project;
      this.configure();
      this.renderContent();
    }

    @Autobind
    public dragStartHandler(event: DragEvent): void {
      event.dataTransfer!.setData('text/plain', `${this._project.id}`);
      event.dataTransfer!.effectAllowed = 'move';
    }

    @Autobind
    public dragEndHandler(_: DragEvent): void {}

    protected configure(): void {
      this.element.draggable = true;
      this.element.addEventListener('dragstart', this.dragStartHandler);
      this.element.addEventListener('dragend', this.dragEndHandler);
    }

    protected renderContent(): void {
      const elementTitle = document.createElement('h2');
      elementTitle.textContent = this._project.title;
      const elementPeople = document.createElement('h3');
      elementPeople.textContent = `${this.person} assigned`;
      const elementDescription = document.createElement('p');
      elementDescription.textContent = this._project.description;
      const hostElement = document.getElementById(
        this._project.id.toString()
      ) as HTMLLIElement;

      hostElement.append(elementTitle, elementPeople, elementDescription);
    }
  }
}
