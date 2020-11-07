import { Project, ProjectStatus } from '../models/project';

type Listener<T> = (items: T[]) => void;

interface IProjectInput {
  title: string;
  description: string;
  people: number;
}

export class State<T> {
  protected _listeners: Listener<T>[] = [];
  constructor() {}

  public addListener(listenerFn: Listener<T>) {
    this._listeners.push(listenerFn);
  }
}

export class ProjectState extends State<Project> {
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
    this.updateListeners();
  }

  public moveProject(projectId: number, newStatus: ProjectStatus) {
    const project = this._projects.find(({ id }) => id === projectId);
    if (project && project?.status !== newStatus) {
      project.status = newStatus;
      this.updateListeners();
    }
  }

  private updateListeners() {
    for (const listenerFn of this._listeners) {
      listenerFn(this._projects.slice());
    }
  }
}

export const globalProjectState = ProjectState.getInstance();
