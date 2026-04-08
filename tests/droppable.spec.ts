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

      await expect(droppablePage.acceptDropZone).toHaveText(DROP_TEXTS.success);

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
      );

      await droppablePage.acceptDragAndDrop();
      await expect(droppablePage.acceptDropZone).toHaveText(DROP_TEXTS.success);
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
});
