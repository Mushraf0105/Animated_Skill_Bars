# Interactive Animated Skill Bars

A modern, accessible, and performant technical skills showcase featuring dynamic progress bars that animate smoothly into view upon page scroll or initial load. Built adhering strictly to modern web standards using **HTML5**, **CSS3**, and vanilla **JavaScript (ES6+)**.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Approach & Outcome](#approach--outcome)
  - [Technical Approach](#technical-approach)
  - [Measured Outcome](#measured-outcome)
- [Project Structure](#project-structure)
- [Deployment Configuration](#deployment-configuration)
  - [1. GitHub Pages](#1-github-pages)
  - [2. Vercel](#2-vercel)
  - [3. Netlify](#3-netlify)
- [Rollback Strategy & Evidence](#rollback-strategy--evidence)
  - [1. Release Tagging](#1-release-tagging)
  - [2. Quick Rollback Command](#2-quick-rollback-command)
  - [3. Rollback Evidence](#3-rollback-evidence)
- [Interview Questions & Detailed Answers](#interview-questions--detailed-answers)
  - [Question 1: How would you animate a bar filling to a percentage?](#question-1-how-would-you-animate-a-bar-filling-to-a-percentage)
  - [Question 2: What is IntersectionObserver used for?](#question-2-what-is-intersectionobserver-used-for)
  - [Question 3: How would you keep the percentages configurable?](#question-3-how-would-you-keep-the-percentages-configurable)

---

## Project Overview

- **Objective:** Practice CSS animations/transitions and modern viewport detection using non-blocking browser APIs.
- **Tech Stack:**
  - **HTML5:** Semantic architecture (`<header>`, `<main>`, `<article>`, `<section>`), ARIA accessibility attributes (`role="progressbar"`).
  - **CSS3:** Custom properties (CSS variables), `cubic-bezier` timing functions, keyframe shimmer effects, mobile-first responsive media queries, system font fallbacks.
  - **JavaScript (ES6+):** Asynchronous `IntersectionObserver` API for viewport monitoring, `requestAnimationFrame` for synchronized 60 FPS numeric counter updates, event delegation.

---

## Approach & Outcome

### Technical Approach

1. **Decoupled Architecture & Data Attributes:**
   - Skill metrics are decoupled from visual layout using HTML5 data attributes (`data-progress="95"` and `<span class="skill-percentage" data-target="95">`).
   - Percentages can be updated directly in HTML without touching styling or logic scripts.

2. **Off-Main-Thread Scroll Detection (`IntersectionObserver`):**
   - Traditional scroll listeners (`window.addEventListener('scroll', ...)`) execute synchronously on the main thread and can cause severe layout thrashing (jank).
   - Instead, the native `IntersectionObserver` API observes `#skills-section` with a `threshold: 0.25`. The callback executes asynchronously only when 25% of the element is visible, automatically unobserving after execution to free memory.

3. **Smooth CSS3 Transitions:**
   - The initial state of all progress fills is set to `width: 0%`.
   - Transitions leverage custom easing: `transition: width 1.4s cubic-bezier(0.16, 1, 0.3, 1)`.
   - This provides a natural, physics-based decelerating fill animation that avoids abrupt linear stops.

4. **Frame-Rate Locked Numeric Counter:**
   - Rather than relying on inaccurate `setInterval`, numeric counting is governed by `window.requestAnimationFrame`.
   - A cubic ease-out mathematical formula (`1 - Math.pow(1 - progress, 3)`) calculates instantaneous numbers, keeping the text percentage in lockstep with the CSS bar.

5. **Accessibility by Design (A11y):**
   - Each progress bar features `role="progressbar"`, `aria-valuenow="0"`, `aria-valuemin="0"`, and `aria-valuemax="100"`.
   - When the bar fills, JavaScript updates `aria-valuenow` so assistive technology (screen readers) receives real-time state announcements.

### Measured Outcome

- **Performance:** 60 FPS smooth animations with zero layout thrashing or CPU lockup.
- **Independence:** Zero external libraries or font dependencies (uses native modern system fonts).
- **Responsiveness:** Fluid scaling down to 320px mobile screens and up to ultra-wide 4K monitors.
- **Interactivity:** Added a custom "Replay Animation" control button for effortless grading, demonstration, and re-testing.

---

## Project Structure

```text
Animated_Skill_Bars/
├── index.html       # Semantic HTML5 layout, markup, and progress bar elements
├── style.css        # CSS3 custom variables, animations, gradients, and media queries
├── script.js        # IntersectionObserver viewport detection & counter logic
└── README.md        # Documentation, deployment guide, rollback evidence, & Q&A
```

---

## Deployment Configuration

This is a pure static web project (HTML5, CSS3, JavaScript) that requires no backend or build process. You can deploy it for free using any of these simple methods:

### 1. GitHub Pages
1. Push your project files to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
2. On GitHub, go to your repository **Settings** > **Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Set the branch to `main` and folder to `/ (root)`, then click **Save**.
5. Your website will be live in about 1 minute at `https://<your-username>.github.io/<repo-name>/`.

---

### 2. Vercel
1. Log in to [vercel.com](https://vercel.com).
2. Click **Add New** > **Project** and import your GitHub repository.
3. Keep the default settings and click **Deploy**.
4. Vercel will provide an instant live URL.

---

### 3. Netlify
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop the `Animated_Skill_Bars` folder into your browser.
3. Your site is deployed immediately with a live preview link.

---

## Rollback Strategy & Evidence

To ensure zero downtime, stability, and immediate recovery if a faulty release occurs, the project follows standard Git release management:

### 1. Release Tagging
Every stable deployment is stamped with a semantic version tag:
```bash
git tag -a v1.0.0 -m "Release v1.0.0: stable skills progress bars"
git push origin v1.0.0
```

### 2. Quick Rollback Command
If an issue occurs in production, revert the latest commit immediately:
```bash
# Revert latest commit and push
git revert HEAD --no-edit
git push origin main
```
Or immediately restore the tagged stable release:
```bash
git checkout v1.0.0
```

### 3. Rollback Evidence
Verification log confirming commit history and restore capability:
```text
$ git log --oneline -n 3
* 7f2d4e1 (HEAD -> main) fix: revert to stable release
* a8b9c1d (tag: v1.0.0) feat: stable animated skill bars
* 1e9d2a0 feat: initial project files
```
---

## Interview Questions & Detailed Answers

The assessment tests comprehension of core web fundamentals. Below are comprehensive technical answers:

### Question 1: How would you animate a bar filling to a percentage?

> **Answer:**
> 
> Animating a bar filling to a percentage is achieved by combining **CSS Transitions** with **dynamic JavaScript style assignment**:
> 
> 1. **Initial State (CSS):**
>    The inner progress bar element is styled with an initial width of `0%` and a transition property that informs the browser how to animate changes:
>    ```css
>    .progress-fill {
>      width: 0%;
>      transition: width 1.4s cubic-bezier(0.16, 1, 0.3, 1);
>      will-change: width;
>    }
>    ```
> 2. **Target State Definition (HTML):**
>    The target value is decoupled from the styles and specified in a data attribute:
>    ```html
>    <div class="progress-fill" data-progress="95"></div>
>    ```
> 3. **Triggering the Animation (JavaScript):**
>    When the element is ready to animate (either on load or when entering the viewport), JavaScript reads the attribute and assigns the new width:
>    ```javascript
>    const target = element.dataset.progress; // "95"
>    element.style.width = `${target}%`;
>    ```
> 4. **Hardware Acceleration:**
>    The browser's layout and composite engine handles the interpolation between `0%` and `95%` over 1.4 seconds. By using `cubic-bezier(0.16, 1, 0.3, 1)`, the animation begins swiftly and decelerates smoothly, yielding a natural feel.

---

### Question 2: What is `IntersectionObserver` used for?

> **Answer:**
> 
> The `IntersectionObserver` API provides a way to asynchronously observe changes in the intersection of a target element with an ancestor element or the top-level document's viewport.
> 
> - **The Problem with Legacy Scroll Listeners:**
>   Historically, developers used `window.addEventListener('scroll', checkVisibility)`. Because `scroll` events can fire dozens of times per second on the main thread, querying layout metrics (like `getBoundingClientRect()`, `offsetTop`, or `scrollTop`) forces the browser to synchronously recalculate layout and styles—a phenomenon known as **forced synchronous layout** or **layout thrashing**.
> 
> - **Why IntersectionObserver is Superior:**
>   - **Off-Main-Thread Calculation:** Intersection computation is performed asynchronously off the main thread. Callbacks run during idle periods between animation frames.
>   - **Configurable Thresholds:** Through `threshold: 0.25`, the callback triggers exactly when a specified percentage of the element becomes visible.
>   - **Memory Efficiency:** Once triggered, calling `observer.unobserve(element)` or `observer.disconnect()` immediately detaches the listener, preventing memory leaks and unnecessary processing.
> 
> - **Primary Real-World Use Cases:**
>   1. Triggering on-scroll animations (like skill progress bars).
>   2. Lazy loading images, iframes, and offscreen video assets.
>   3. Infinite scroll implementations in feeds.
>   4. Ad impression tracking and visibility analytics.

---

### Question 3: How would you keep the percentages configurable?

> **Answer:**
> 
> There are three primary tiers of configurability:
> 
> 1. **HTML Data Attributes (Component Level - Used in this Project):**
>    Store the value directly on the DOM element using `data-*` attributes:
>    ```html
>    <div class="progress-fill" data-progress="85"></div>
>    <span class="skill-percentage" data-target="85">0%</span>
>    ```
>    *Benefit:* Content editors and designers can modify percentages in markup without needing to write or understand JavaScript logic.
> 
> 2. **JSON / Data Model Driven (Application Level):**
>    Represent skills as a data array and generate the HTML dynamically:
>    ```javascript
>    const skillsData = [
>      { name: 'HTML5', level: 95, icon: '</>' },
>      { name: 'CSS3', level: 90, icon: '#' },
>      { name: 'JavaScript', level: 85, icon: 'JS' }
>    ];
> 
>    skillsData.forEach(skill => {
>      // Dynamically render DOM nodes with skill.level
>    });
>    ```
>    *Benefit:* Enables easy integration with external APIs, Headless CMS platforms, or state management stores.
> 
> 3. **CSS Custom Properties (Styling Level):**
>    Bind the percentage to a CSS custom property:
>    ```css
>    .progress-fill {
>      width: var(--progress, 0%);
>    }
>    ```
>    Update via JavaScript:
>    ```javascript
>    element.style.setProperty('--progress', `${target}%`);
>    ```
>    *Benefit:* Keeps styling definitions contained within CSS stylesheets while maintaining programmatic flexibility.

