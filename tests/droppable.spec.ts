import { test, expect } from "@playwright/test";
import {
  DROP_COLORS,
  DROP_TEXTS,
  DroppablePage,
} from "../pages/Droppable.page";

test.describe("Droppable Functionality", () => {
  let droppablePage: DroppablePage;

  test.beforeEach(async ({ page }) => {
    droppablePage = new DroppablePage(page);
    await droppablePage.open();
  });

  test.describe("Simple Tab", () => {
    test.beforeEach(async () => {
      await droppablePage.openSimpleTab();
    });

    test("should drag and drop element successfully", async () => {
      await expect(droppablePage.simpleDropZone).toHaveText(
        DROP_TEXTS.defaultSimple,
      );

      await droppablePage.simpleDragAndDrop();

      await expect(droppablePage.simpleDropZone).toHaveText(DROP_TEXTS.success);

      await expect(droppablePage.simpleDropZone).toHaveCSS(
        "background-color",
        DROP_COLORS.dropped,
      );
    });

    test("should not change status if dropped outside", async ({ page }) => {
      await droppablePage.simpleDragElement.dragTo(page.locator("body"), {
        targetPosition: { x: 0, y: 0 },
      });

      await expect(droppablePage.simpleDragElement).toHaveText("Drag Me");
      await expect(droppablePage.simpleDropZone).toHaveText(
        DROP_TEXTS.defaultSimple,
      );
    });
  });

  test.describe("Accept Tab", () => {
    test.beforeEach(async () => {
      await droppablePage.openAcceptTab();
    });

    test("should accept only valid draggable element", async () => {
      await expect(droppablePage.acceptDropZone).toHaveText(
        DROP_TEXTS.defaultAccept,
      );

      await droppablePage.acceptDragAndDrop();

      await expect(droppablePage.acceptDropZone).toHaveText(
        DROP_TEXTS.success,
        { timeout: 5000 },
      );

      await expect(droppablePage.acceptDropZone).toHaveCSS(
        "background-color",
        DROP_COLORS.dropped,
      );
    });

    test("should NOT accept invalid draggable element", async () => {
      await droppablePage.notAcceptDragAndDrop();

      await expect(droppablePage.acceptDropZone).toHaveText(
        DROP_TEXTS.defaultAccept,
      );
    });

    test("should accept valid element after invalid attempt", async () => {
      await droppablePage.notAcceptDragAndDrop();
      await expect(droppablePage.acceptDropZone).toHaveText(
        DROP_TEXTS.defaultAccept,
        { timeout: 5000 },
      );

      await droppablePage.acceptDragAndDrop();
      await expect(droppablePage.acceptDropZone).toHaveText(
        DROP_TEXTS.success,
        { timeout: 5000 },
      );
    });

    test("should change color to green on hover and blue on drop", async ({
      page,
    }) => {
      await droppablePage.acceptDragElement.hover();
      await page.mouse.down();
      await droppablePage.acceptDropZone.hover();
      await expect(droppablePage.acceptDropZone).toHaveCSS(
        "background-color",
        DROP_COLORS.hoverAccept,
      );
      await page.mouse.up();
      await expect(droppablePage.acceptDropZone).toHaveCSS(
        "background-color",
        DROP_COLORS.dropped,
      );
      await expect(droppablePage.acceptDropZone).toHaveText(DROP_TEXTS.success);
    });
  });

  test.describe("Prevent Propagation Tab", () => {
    test.beforeEach(async () => {
      await droppablePage.openPreventTab();
    });

    test("Not Greedy (drop - outer): only outer box should register drop", async () => {
      await droppablePage.outerNotGreedyDragAndDrop();

      await expect(droppablePage.outerNotGreedyDropZone).toContainText(
        DROP_TEXTS.success,
      );

      await expect(droppablePage.innerNotGreedyDropZone).toContainText(
        DROP_TEXTS.innerNotGreedyDefault,
      );
    });

    test("Not Greedy (drop - inner): both boxes should register drop", async () => {
      await droppablePage.innerNotGreedyDragAndDrop();

      await expect(droppablePage.innerNotGreedyDropZone).toContainText(
        DROP_TEXTS.success,
      );

      await expect(droppablePage.outerNotGreedyDropZone).toContainText(
        DROP_TEXTS.success,
      );
    });

    test("Greedy (drop - outer): only outer box should register drop", async () => {
      await droppablePage.outerGreedyDragAndDrop();

      await expect(droppablePage.outerGreedyDropZone).toContainText(
        DROP_TEXTS.success,
      );

      await expect(droppablePage.innerGreedyDropZone).toContainText(
        DROP_TEXTS.innerGreedyDefault,
      );
    });

    test("Greedy (drop - inner): only inner box should register drop", async () => {
      await droppablePage.innerGreedyDragAndDrop();

      await expect(droppablePage.innerGreedyDropZone).toContainText(
        DROP_TEXTS.success,
      );

      await expect(droppablePage.outerGreedyDropZone).toContainText(
        DROP_TEXTS.outerDefault,
      );
    });

    test("should change color only of the target box when hovering in greedy mode", async ({
      page,
    }) => {
      await droppablePage.preventDragElement.hover();
      await page.mouse.down();

      await droppablePage.innerGreedyDropZone.hover();

      await expect(droppablePage.innerGreedyDropZone).toHaveCSS(
        "background-color",
        DROP_COLORS.hoverPrevent,
      );

      await expect(
        droppablePage.outerGreedyDropZone.locator("p").first(),
      ).not.toHaveCSS("background-color", DROP_COLORS.activePrevent);

      await page.mouse.up();
    });
  });

  test.describe("Revert Draggable Tab", () => {
    test.beforeEach(async () => {
      await droppablePage.openRevertTab();
    });

    test("should revert back after drop", async () => {
      const initialBox = await droppablePage.revertDragElement.boundingBox();
      if (!initialBox) throw new Error("Element not found");

      await droppablePage.revertDragAndDrop();

      await droppablePage.page.waitForTimeout(1000);

      const finalBox = await droppablePage.revertDragElement.boundingBox();
      if (!finalBox) throw new Error("Element not found");

      expect(finalBox.x).toBeCloseTo(initialBox.x, 0);
      expect(finalBox.y).toBeCloseTo(initialBox.y, 0);
    });

    test("should stay in drop zone after drop", async () => {
      await droppablePage.notRevertDragAndDrop();

      const dropBox = await droppablePage.revertDropZone.boundingBox();
      const elementBox = await droppablePage.notRevertDragElement.boundingBox();

      if (!dropBox || !elementBox) throw new Error("Elements not found");

      expect(elementBox.x).toBeGreaterThanOrEqual(dropBox.x);
      expect(elementBox.y).toBeGreaterThanOrEqual(dropBox.y);
    });
  });
});
