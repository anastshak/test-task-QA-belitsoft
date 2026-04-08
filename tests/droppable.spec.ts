import { test, expect } from "@playwright/test";
import { DroppablePage } from "../pages/Droppable.page";

test.describe("Droppable Functionality", () => {
  let droppablePage: DroppablePage;

  test.beforeEach(async ({ page }) => {
    droppablePage = new DroppablePage(page);
    await droppablePage.open();
  });

  test.describe("Simple Tab", () => {
    test.beforeEach(async ({}) => {
      await droppablePage.openSimpleTab();
    });
    test("should drag and drop element successfully", async () => {
      await expect(droppablePage.simpleDropZone).toHaveText("Drop Here");

      await droppablePage.simpleDragAndDrop();

      await expect(droppablePage.simpleDropZone).toHaveText("Dropped!");

      await expect(droppablePage.simpleDropZone).toHaveCSS(
        "background-color",
        "rgb(70, 130, 180)",
      );
    });

    test("should not change status if dropped outside", async ({ page }) => {
      await droppablePage.simpleDragElement.dragTo(page.locator("body"), {
        targetPosition: { x: 0, y: 0 },
      });

      await expect(droppablePage.simpleDragElement).toHaveText("Drag Me");
      await expect(droppablePage.simpleDropZone).toHaveText("Drop Here");
    });
  });
});
