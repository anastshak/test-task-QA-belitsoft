import { Locator, Page } from "@playwright/test";

export class DraggablePage {
  readonly page: Page;

  // tabs
  readonly simpleTab: Locator;
  readonly axisTab: Locator;
  readonly containerTab: Locator;
  readonly cursorTab: Locator;

  // simple tab elements
  readonly simpleDragElement: Locator;

  // axis restricted tab elements
  readonly dragXElement: Locator;
  readonly dragYElement: Locator;

  // container restricted tab elements
  readonly containerWrapper: Locator;
  readonly containerDragElement: Locator;
  readonly containerParentWrapper: Locator;
  readonly textDragElement: Locator;

  // cursor style tab elements

  constructor(page: Page) {
    this.page = page;

    this.simpleTab = page.locator("#draggableExample-tab-simple");
    this.simpleDragElement = page.locator("#dragBox");

    this.axisTab = page.locator("#draggableExample-tab-axisRestriction");
    this.dragXElement = page.locator("#restrictedX");
    this.dragYElement = page.locator("#restrictedY");

    this.containerTab = page.locator(
      "#draggableExample-tab-containerRestriction",
    );
    this.containerWrapper = page.locator("#containmentWrapper");
    this.containerDragElement = this.containerWrapper.locator(".draggable");
    this.containerParentWrapper = page
      .locator("#draggableExample-tabpane-containerRestriction")
      .locator(".draggable");
    this.textDragElement =
      this.containerParentWrapper.locator(".ui-widget-header ");

    this.cursorTab = page.locator("#draggableExample-tab-cursorStyle");
  }

  async open() {
    await this.page.goto("/dragabble");
  }

  // helper
  async dragWithMouse(element: Locator, x: number, y: number) {
    const box = await element.boundingBox();
    if (!box) throw new Error("Element not found");

    const startX = box.x + 10;
    const startY = box.y + 10;

    await this.page.mouse.move(startX, startY);
    await this.page.mouse.down();
    await this.page.waitForTimeout(100);
    await this.page.mouse.move(startX + x, startY + y, { steps: 30 });
    await this.page.waitForTimeout(50);
    await this.page.mouse.up();
  }

  /* simple tab actions */
  async openSimpleTab() {
    await this.simpleTab.click();
  }

  async dragSimple(x: number, y: number) {
    await this.dragWithMouse(this.simpleDragElement, x, y);
  }

  /*  axis restricted actions */
  async openAxisTab() {
    await this.axisTab.click();
  }

  async dragX(x: number, y: number) {
    await this.dragWithMouse(this.dragXElement, x, y);
  }

  async dragY(x: number, y: number) {
    await this.dragWithMouse(this.dragYElement, x, y);
  }

  /* container restricted tab actions */
  async openContainerTab() {
    await this.containerTab.click();
  }

  async dragWithContainer(x: number, y: number) {
    await this.dragWithMouse(this.containerDragElement, x, y);
  }

  async dragOnlyText(x: number, y: number) {
    await this.dragWithMouse(this.textDragElement, x, y);
  }
}
