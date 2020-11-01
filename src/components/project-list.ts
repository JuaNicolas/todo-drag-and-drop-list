import { Component } from './base.js';
import { DragTarget } from '../models/drag-drop.js';
import { Autobind } from '../decorators/autobind.js';
import { Project, ProjectStatus } from '../models/project.js';
import { globalProjectState } from '../state/project-state.js';
import { ProjectItem } from './project-item.js';

export class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget {
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
    this.configure();
  }

  @Autobind
  public dragOverHandler(event: DragEvent): void {
    if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
      event.preventDefault();
      const listEl = this.element.querySelector('ul')! as HTMLUListElement;
      listEl.classList.add('droppable');
    }
  }

  @Autobind
  public dropHandler(event: DragEvent): void {
    const ListEl = this.element.querySelector('ul')! as HTMLUListElement;
    ListEl.classList.remove('droppable');
    const prjId = event.dataTransfer!.getData('text/plain');
    globalProjectState.moveProject(
      +prjId,
      this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished
    );
  }

  @Autobind
  public dragLeaveHandler(_: DragEvent): void {
    const listEl = this.element.querySelector('ul')! as HTMLUListElement;
    listEl.classList.remove('droppable');
  }

  protected configure() {
    this.element.addEventListener('dragover', this.dragOverHandler);
    this.element.addEventListener('drop', this.dropHandler);
    this.element.addEventListener('dragleave', this.dragLeaveHandler);
  }

  protected renderProjects() {
    const listId = `${this.type}-projects-list`;
    const listEl = document.getElementById(listId) as HTMLUListElement;
    listEl.innerHTML = '';
    for (const prjItem of this.assignedProjects) {
      new ProjectItem(this.element.querySelector('ul')!.id, prjItem);
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
