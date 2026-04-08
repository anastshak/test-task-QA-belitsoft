import { Locator, Page } from "@playwright/test";

export const DROP_COLORS = {
  default: "rgb(255, 255, 255)",
  dropped: "rgb(70, 130, 180)",
  hoverAccept: "rgb(60, 179, 113)",
};
export const DROP_TEXTS = {
  defaultSimple: "Drop Here",
  defaultAccept: "Drop here",
  success: "Dropped!",
};

export class DroppablePage {
  readonly page: Page;

  // tabs
  readonly simpleTab: Locator;
  readonly acceptTab: Locator;

  // simple tab elements
  readonly simpleTabContainer: Locator;
  readonly simpleDragElement: Locator;
  readonly simpleDropZone: Locator;

  // accept tab elements
  readonly acceptTabContainer: Locator;
  readonly acceptDragElement: Locator;
  readonly notAcceptDragElement: Locator;
  readonly acceptDropZone: Locator;

  constructor(page: Page) {
    this.page = page;

    this.simpleTab = page.locator("#droppableExample-tab-simple");
    this.simpleTabContainer = page.locator("#simpleDropContainer");
    this.simpleDragElement = this.simpleTabContainer.locator("#draggable");
    this.simpleDropZone = this.simpleTabContainer.locator("#droppable");

    this.acceptTab = page.locator("#droppableExample-tab-accept");
    this.acceptTabContainer = page.locator("#acceptDropContainer");
    this.acceptDragElement = this.acceptTabContainer.locator("#acceptable");
    this.notAcceptDragElement =
      this.acceptTabContainer.getByText("Not Acceptable");
    this.acceptDropZone = this.acceptTabContainer.locator(".drop-box");
  }

  async open() {
    await this.page.goto("/droppable");
  }

  /* simple tab actions */
  async openSimpleTab() {
    await this.simpleTab.click();
  }

  async simpleDragAndDrop() {
    // works unstable (try to drop to the center manually)
    // await this.simpleDragElement.dragTo(this.simpleDropZone);

    const box = await this.simpleDropZone.boundingBox();
    if (!box) throw new Error("Drop zone not found");

    await this.simpleDragElement.dragTo(this.simpleDropZone, {
      targetPosition: {
        x: box.width / 2,
        y: box.height / 2,
      },
      force: true,
    });
  }

  /* accept tab actions */
  async openAcceptTab() {
    await this.acceptTab.click();
  }

  async acceptDragAndDrop() {
    await this.acceptDragElement.dragTo(this.acceptDropZone);
  }

  async notAcceptDragAndDrop() {
    await this.notAcceptDragElement.dragTo(this.acceptDropZone);
  }
}
