import { test, expect } from "@playwright/test";
import { DroppablePage } from "../pages/DroppablePage";

test.describe("Droppable Functionality — Simple Tab", () => {
  let droppablePage: DroppablePage;

  test.beforeEach(async ({ page }) => {
    droppablePage = new DroppablePage(page);
    await droppablePage.open();
    await droppablePage.openSimpleTab();
  });

  test("should drag and drop element successfully", async () => {
    await expect(droppablePage.dropZone).toHaveText("Drop Here");

    await droppablePage.dragAndDrop();

    await expect(droppablePage.dropZone).toHaveText("Dropped!");

    await expect(droppablePage.dropZone).toHaveCSS(
      "background-color",
      "rgb(70, 130, 180)",
    );
  });

  test("should not change status if dropped outside", async ({ page }) => {
    await droppablePage.dragElement.dragTo(page.locator("body"), {
      targetPosition: { x: 0, y: 0 },
    });

    await expect(droppablePage.dragElement).toHaveText("Drag Me");
    await expect(droppablePage.dropZone).toHaveText("Drop Here");
  });
});
