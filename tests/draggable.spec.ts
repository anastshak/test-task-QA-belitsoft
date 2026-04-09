import { test, expect } from "@playwright/test";
import { DraggablePage } from "../pages/Draggable.page";

test.describe("Draggable Functionality", () => {
  let draggablePage: DraggablePage;

  test.beforeEach(async ({ page }) => {
    draggablePage = new DraggablePage(page);
    await draggablePage.open();
  });

  test.describe("Simple Tab", () => {
    test.beforeEach(async () => {
      await draggablePage.openSimpleTab();
    });

    test("element should be moved when dragged", async () => {
      const before = await draggablePage.simpleDragElement.boundingBox();

      await draggablePage.dragSimple(100, 100);

      const after = await draggablePage.simpleDragElement.boundingBox();

      expect(after?.x).toBeCloseTo((before?.x || 0) + 100, 1);
      expect(after?.y).toBeCloseTo((before?.y || 0) + 100, 1);
    });
  });
});
