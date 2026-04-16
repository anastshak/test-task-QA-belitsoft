# QA Automation Test Task (Playwright)

Belitsoft QA Test Task

## Overview

This project contains automated tests for UI components from [demoqa.com](https://demoqa.com), focusing on drag-and-drop functionality.

---

## Tech Stack

- Playwright
- TypeScript
- Page Object Model (POM)

---

## 📂 Project Structure

```

├── pages/
│   ├── Droppable.page.ts
│   └── Draggable.page.ts
│
├── tests/
│   ├── droppable.spec.ts
│   └── draggable.spec.ts

```

---

## Setup & Run & Useful Scripts

### 1. Install dependencies

```bash
npm install
```

### 2. Install Playwright browsers

```bash
npx playwright install
```

### 3. Run tests

```bash
npm run test
```

### 4. Run in UI mode

```bash
npm run test-ui
```

### 5. Show reports

```bash
npm run report
```

---

## Test Coverage

### Droppable

Tested scenarios:

- Basic drag and drop (Simple)
- Accept / Not Accept logic
- Prevent Propagation (greedy vs non-greedy behavior)
- Revert draggable elements

---

### Draggable

Tested scenarios:

- Free movement (Simple)
- Axis restriction (X / Y only)
- Container restriction
- Cursor style behavior
