namespace App {
  export abstract class Component<
    T extends HTMLElement,
    U extends HTMLElement
  > {
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
}
