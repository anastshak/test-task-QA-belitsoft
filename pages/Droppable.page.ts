import { Locator, Page } from "@playwright/test";

export class DroppablePage {
  readonly page: Page;

  // tabs
  readonly simpleTab: Locator;

  // simple tab elements
  readonly simpleTabContainer: Locator;
  readonly simpleDragElement: Locator;
  readonly simpleDropZone: Locator;

  constructor(page: Page) {
    this.page = page;

    this.simpleTab = page.locator("#droppableExample-tab-simple");
    this.simpleTabContainer = page.locator("#simpleDropContainer");
    this.simpleDragElement = this.simpleTabContainer.locator("#draggable");
    this.simpleDropZone = this.simpleTabContainer.locator("#droppable");
  }

  async open() {
    await this.page.goto("/droppable");
  }

  async openSimpleTab() {
    await this.simpleTab.click();
  }

  async simpleDragAndDrop() {
    await this.simpleDragElement.dragTo(this.simpleDropZone);
  }
}
