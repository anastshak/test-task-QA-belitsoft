import { Locator, Page } from "@playwright/test";

export const DROP_COLORS = {
  default: "rgb(255, 255, 255)",
  dropped: "rgb(70, 130, 180)",
  hoverAccept: "rgb(60, 179, 113)",
  hoverPrevent: "rgb(143, 188, 143)",
  activePrevent: "rgb(60, 179, 113)",
};

export const DROP_TEXTS = {
  success: "Dropped!",
  defaultSimple: "Drop Here",
  defaultAccept: "Drop here",
  outerDefault: "Outer droppable",
  innerNotGreedyDefault: "Inner droppable (not greedy)",
  innerGreedyDefault: "Inner droppable (greedy)",
};

export class DroppablePage {
  readonly page: Page;

  // tabs
  readonly simpleTab: Locator;
  readonly acceptTab: Locator;
  readonly preventTab: Locator;

  // simple tab elements
  readonly simpleTabContainer: Locator;
  readonly simpleDragElement: Locator;
  readonly simpleDropZone: Locator;

  // accept tab elements
  readonly acceptTabContainer: Locator;
  readonly acceptDragElement: Locator;
  readonly notAcceptDragElement: Locator;
  readonly acceptDropZone: Locator;

  // accept tab elements
  readonly preventTabContainer: Locator;
  readonly preventDragElement: Locator;
  readonly outerNotGreedyDropZone: Locator;
  readonly innerNotGreedyDropZone: Locator;
  readonly outerGreedyDropZone: Locator;
  readonly innerGreedyDropZone: Locator;

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

    this.preventTab = page.locator("#droppableExample-tab-preventPropogation");
    this.preventTabContainer = page.locator("#ppDropContainer");
    this.preventDragElement = this.preventTabContainer.locator("#dragBox");
    this.outerNotGreedyDropZone =
      this.preventTabContainer.locator("#notGreedyDropBox");
    this.innerNotGreedyDropZone = this.outerNotGreedyDropZone.locator(
      "#notGreedyInnerDropBox",
    );
    this.outerGreedyDropZone =
      this.preventTabContainer.locator("#greedyDropBox");
    this.innerGreedyDropZone = this.outerGreedyDropZone.locator(
      "#greedyDropBoxInner",
    );
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

  /* prevent propagation tab */
  async openPreventTab() {
    await this.preventTab.click();
  }

  async outerNotGreedyDragAndDrop() {
    await this.preventDragElement.dragTo(this.outerNotGreedyDropZone);
  }

  async innerNotGreedyDragAndDrop() {
    await this.preventDragElement.dragTo(this.innerNotGreedyDropZone);
  }

  async outerGreedyDragAndDrop() {
    await this.preventDragElement.dragTo(this.outerGreedyDropZone);
  }

  async innerGreedyDragAndDrop() {
    await this.preventDragElement.dragTo(this.innerGreedyDropZone);
  }
}
