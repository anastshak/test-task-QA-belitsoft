import { Locator, Page } from "@playwright/test";

export class DroppablePage {
  readonly page: Page;

  // tabs
  readonly simpleTab: Locator;

  // tab elements
  readonly simpleTabContainer: Locator;
  readonly dragElement: Locator;
  readonly dropZone: Locator;

  constructor(page: Page) {
    this.page = page;
    this.simpleTab = page.locator("#droppableExample-tab-simple");

    this.simpleTabContainer = page.locator("#simpleDropContainer");

    this.dragElement = this.simpleTabContainer.locator("#draggable");
    this.dropZone = this.simpleTabContainer.locator("#droppable");
  }

  async open() {
    await this.page.goto("/droppable");
  }

  async openSimpleTab() {
    await this.simpleTab.click();
  }

  async dragAndDrop() {
    await this.dragElement.dragTo(this.dropZone);
  }
}
