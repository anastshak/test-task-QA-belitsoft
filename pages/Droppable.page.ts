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
  readonly revertTab: Locator;

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

  // revert tab elements
  readonly revertTabContainer: Locator;
  readonly revertDragElement: Locator;
  readonly notRevertDragElement: Locator;
  readonly revertDropZone: Locator;

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

    this.revertTab = page.locator("#droppableExample-tab-revertable");
    this.revertTabContainer = page.locator("#revertableDropContainer");
    this.revertDragElement = this.revertTabContainer.locator("#revertable");
    this.notRevertDragElement =
      this.revertTabContainer.locator("#notRevertable");
    this.revertDropZone = this.revertTabContainer.locator("#droppable");
  }

  async open() {
    await this.page.goto("/droppable");
  }

  /* helper */
  async dragWithMouse(
    source: Locator,
    target: Locator,
    position: "center" | "top-left" = "center",
  ) {
    const sourceBox = await source.boundingBox();
    const targetBox = await target.boundingBox();

    if (!sourceBox || !targetBox) throw new Error("Elements not found");

    const startX = sourceBox.x + sourceBox.width / 2;
    const startY = sourceBox.y + sourceBox.height / 2;

    let endX = targetBox.x + targetBox.width / 2;
    let endY = targetBox.y + targetBox.height / 2;

    if (position === "top-left") {
      endX = targetBox.x + 20;
      endY = targetBox.y + 20;
    }

    await this.page.mouse.move(startX, startY);
    await this.page.mouse.down();
    await this.page.waitForTimeout(100);
    await this.page.mouse.move(endX, endY, { steps: 10 });
    await this.page.mouse.up();
  }

  /* simple tab actions */
  async openSimpleTab() {
    await this.simpleTab.click();
  }

  async simpleDragAndDrop() {
    await this.dragWithMouse(this.simpleDragElement, this.simpleDropZone);
  }

  /* accept tab actions */
  async openAcceptTab() {
    await this.acceptTab.click();
  }

  async acceptDragAndDrop() {
    await this.dragWithMouse(this.acceptDragElement, this.acceptDropZone);
  }

  async notAcceptDragAndDrop() {
    await this.dragWithMouse(this.notAcceptDragElement, this.acceptDropZone);
  }

  /* prevent propagation tab */
  async openPreventTab() {
    await this.preventTab.click();
  }

  async outerNotGreedyDragAndDrop() {
    await this.dragWithMouse(
      this.preventDragElement,
      this.outerNotGreedyDropZone,
      "top-left",
    );
  }

  async innerNotGreedyDragAndDrop() {
    await this.dragWithMouse(
      this.preventDragElement,
      this.innerNotGreedyDropZone,
    );
  }

  async outerGreedyDragAndDrop() {
    await this.dragWithMouse(
      this.preventDragElement,
      this.outerGreedyDropZone,
      "top-left",
    );
  }

  async innerGreedyDragAndDrop() {
    await this.dragWithMouse(this.preventDragElement, this.innerGreedyDropZone);
  }

  /* revert draggable tab */
  async openRevertTab() {
    await this.revertTab.click();
  }

  async revertDragAndDrop() {
    await this.dragWithMouse(this.revertDragElement, this.revertDropZone);
  }

  async notRevertDragAndDrop() {
    await this.dragWithMouse(this.notRevertDragElement, this.revertDropZone);
  }
}
