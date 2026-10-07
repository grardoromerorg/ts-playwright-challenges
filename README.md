# Playwright TS Test Framework

This automated test suite covers the SauceDemo checkout UI flow and theRestful-Booker API booking lifecycle. The framework is built with Playwright and TypeScript.

## Prerequisites

- Node.js `v22.15.0` (or later)
- npm `v10.9.2` (or later)

## Installation

```bash
npm install
npx playwright install
```

## Project Structure / Architecture

We use a basic Page Object Model (POM) structure: one class per UI screen, one API client class for the booking endpoints, and shared fixtures for test credentials. Specs only call these classes and assert — keeping things organized and easy to maintain.

## Execution Commands

### Run all tests

```bash
npm test
```

### UI tests only

```bash
npm run test:ui
```

### API tests only

```bash
npm run test:api
```

### Headless vs headed

Tests run **headless** by default. To run **headed** (visible browser):

```bash
npm run test:headed
```
## Reporting

### Playwright HTML report

```bash
npm run test:report
```

### Allure report

```bash
npm run allure:generate
npm run allure:open
```

Or generate and serve in one step:

```bash
npm run allure:serve
```

---

## Manual QA Bug Report (`problem_user`)

**Title:** [Checkout - problem_user] Keystrokes typed into the Last Name field are inserted into the First Name field instead

**Environment:** SauceDemo (`https://www.saucedemo.com/`)

**Description:** On the checkout information step, characters typed into the Last Name field are inserted into the First Name field instead, so the last name can't be entered.

**Preconditions:** Logged in as `problem_user` with an item already in the cart.

**Steps to Reproduce:**
1. Log in with credentials `problem_user` / `secret_sauce`.
2. Add an item to the cart.
3. Click the cart icon in the header.
4. Click the "Checkout" button to proceed to checkout.
5. Fill in the First Name field (e.g. "Jane").
6. Click into the Last Name field and type a value (e.g. "Doe").

**Expected Result:** The user is able to fill in First Name and Last Name independently, and each field retains only the text typed into it.

**Actual Result:** Each keystroke is inserted into the First Name field instead, overwriting its value. The Last Name field stays empty, blocking checkout.

**Severity:** Critical

**Priority:** High

**Attachments:** _(add screenshot/screen recording of )_
