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

  test.describe("Axis Restriction Tab", () => {
    test.beforeEach(async () => {
      await draggablePage.openAxisTab();
    });

    test("should move only along X axis", async () => {
      const before = await draggablePage.dragXElement.boundingBox();

      await draggablePage.dragX(100, 100);

      const after = await draggablePage.dragXElement.boundingBox();

      expect(after!.x).toBeGreaterThan(before!.x);
      expect(after!.y).toBeCloseTo(before!.y, 0);
    });

    test("should move only along Y axis", async () => {
      const before = await draggablePage.dragYElement.boundingBox();

      await draggablePage.dragY(100, 100);

      const after = await draggablePage.dragYElement.boundingBox();

      expect(after!.y).toBeGreaterThan(before!.y);
      expect(after!.x).toBeCloseTo(before!.x, 0);
    });

    test("should not move along restricted axis", async () => {
      const before = await draggablePage.dragXElement.boundingBox();

      await draggablePage.dragX(0, 100);

      const after = await draggablePage.dragXElement.boundingBox();

      expect(after!.x).toBeCloseTo(before!.x, 0);
      expect(after!.y).toBeCloseTo(before!.y, 0);
    });
  });
});
