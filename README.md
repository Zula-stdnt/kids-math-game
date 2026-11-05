<div align="center">

# 🎮 Kids Math Game

### 🎓 Mini Project for ITE 387: Advanced Programming

<p align="center">
  <strong>An interactive, child-friendly, mobile-first arithmetic learning web application built with modern modular JavaScript (ES6+).</strong>
</p>

<p align="center">
  🚀 <strong>Live Demo:</strong> <a href="https://zula-stdnt.github.io/kids-math-game/">https://zula-stdnt.github.io/kids-math-game/</a>
</p>

<!-- Static Non-Interactive / Unclickable Badges -->
<div align="center" style="pointer-events: none; user-select: none;">
  <img src="https://img.shields.io/badge/JavaScript-ES6%2B_Modules-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" draggable="false" style="pointer-events: none; cursor: default;" />
  <img src="https://img.shields.io/badge/HTML5-Semantic_Markup-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" draggable="false" style="pointer-events: none; cursor: default;" />
  <img src="https://img.shields.io/badge/CSS3-Mobile--First_Responsive-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" draggable="false" style="pointer-events: none; cursor: default;" />
  <img src="https://img.shields.io/badge/Web_Audio_API-Sound_Synthesizer-9B59B6?style=for-the-badge" alt="Web Audio API" draggable="false" style="pointer-events: none; cursor: default;" />
  <img src="https://img.shields.io/badge/Storage-LocalStorage_API-FF6B6B?style=for-the-badge" alt="LocalStorage" draggable="false" style="pointer-events: none; cursor: default;" />
  <img src="https://img.shields.io/badge/Academic-ITE_387_Mini_Project-4ECDC4?style=for-the-badge" alt="ITE 387 Mini Project" draggable="false" style="pointer-events: none; cursor: default;" />
  <img src="https://img.shields.io/badge/License-MIT-2ECC71?style=for-the-badge" alt="License MIT" draggable="false" style="pointer-events: none; cursor: default;" />
</div>

</div>

---

## 🌐 Live Web Game

You can play the live game online directly in your browser without any installation:
👉 **[https://zula-stdnt.github.io/kids-math-game/](https://zula-stdnt.github.io/kids-math-game/)**

---

## 📖 Overview

**Kids Math Game** is an educational web application developed as a coursework **Mini Project for ITE 387: Advanced Programming**. It is designed to assist elementary school students in practicing fundamental arithmetic skills through colorful, randomized quizzes, audio feedback, and high score tracking.

The application adheres strictly to the academic standards of **ITE 387**, utilizing an **ECMAScript Module (ESM)** architecture, the 4-step abstracted DOM creation pattern, pure math generation functions, and functional array pipelines (`.map()`, `.filter()`, `.reduce()`, `.sort()`).

---

## ✨ Key Features

### 🎯 4 Core Arithmetic Modes
* ➕ **Addition:** Clean single-to-double digit addition problems ($1\text{--}10$).
* ➖ **Subtraction:** Non-negative integer results guaranteed ($a \ge b$) so young learners never face confusing negative numbers.
* ✖️ **Multiplication:** Age-appropriate multiplication tables from $1\text{ to }10$.
* ➗ **Division:** Generates problem sets where $dividend = divisor \times quotient$, strictly guaranteeing whole-integer quotients without fractions or division-by-zero errors.

### 📱 Hybrid Touch Numpad & Keyboard Input
* **Child-Friendly On-Screen Numpad:** Big, bouncy touch buttons ($0\text{--}9$, $\text{⌫}$ Backspace, and $\text{✔}$ Submit) tailored for mobile and tablet touchscreens, preventing the on-screen mobile keyboard from covering the math problem.
* **Physical Keyboard Support:** Full support for desktop keyboard typing and `Enter` key submission.

### 🔊 Zero-Dependency Web Audio Synth
* Programmatic audio engine using the browser's native **Web Audio API** (`AudioContext`).
* Positive dual-frequency chimes for correct answers, a gentle thud for errors, and a victory fanfare upon quiz completion.
* Accessible top-bar **Mute Toggle** (`🔊 Sound On / 🔇 Muted`) with preference persistence.

### 🏆 Persistent Hall of Fame (Leaderboard)
* High scores and percentages are saved client-side in `localStorage`.
* Ranks players by accuracy percentage, followed by total score.
* **Dual-View Responsive Presentation:** Renders as a semantic table on desktop viewports and dynamically adapts into stacked touch cards on mobile screens to prevent horizontal overflow.

### 📊 Visual Progress & Scale Stability
* Animated progress bar tracking session progress in real time.
* Defensive input validation preventing empty input submission or false zero evaluation.
* Canvas-based particle confetti explosions for high scores and perfect rounds.
* Dedicated Game Over flow with one-click **"Play Again"** and **"Back to Menu"** actions.
* Full-height viewport-stable layout that remains centered and anchored at all browser zoom scales ($50\%\text{--}150\%$).

---

## 🏛️ Academic Architecture (ITE 387 Standards)

The project adheres to modern software engineering patterns established in **ITE 387: Advanced Programming**:

* **ECMAScript Modules (ESM):** Full modular separation with explicit imports and exports.
* **Abstracted DOM Helper Pattern:** Custom `create()` utility following the 4-step DOM lifecycle (*Create → Configure → Listen → Append*).
* **Single Source of Truth:** Centralized `localStorage` management abstracted inside `storage.js`.
* **Functional Programming:** Data transformation pipelines utilize immutable methods (`.map()`, `.filter()`, `.reduce()`, `.sort()`) rather than manual loops.
* **Defensive State Management:** Submissions are locked during answer transitions to eliminate spam-click score duplication.

---

## 📂 Project Structure

```
kids-math-game/
├── index.html              # Semantic HTML5 application entry point
├── README.md               # Repository documentation
├── LICENSE                 # MIT License file
├── .gitignore              # Repository git ignore rules
├── css/
│   └── style.css           # Mobile-first stylesheet (variables, grid, animations)
└── js/
    ├── app.js              # DOMContentLoaded entry & event orchestration
    ├── config.js           # Mode definitions, operation symbols, constants
    ├── game.js             # Problem generators, answer validation, session state
    ├── storage.js          # LocalStorage CRUD, factory functions, leaderboard pipeline
    ├── ui.js               # Screen router, hybrid DOM creation, numpad builder
    └── utils.js            # Abstracted create() helper, Web Audio synth, confetti FX
```

---

## 🚀 Running the Project Locally

Because this project utilizes modern **ECMAScript Modules (`<script type="module">`)**, browsers require the files to be served through an HTTP/HTTPS server due to CORS security policies on `file:///` URLs.

### Option 1: Using XAMPP / Apache (Recommended)
1. Ensure the project folder is placed inside your `xampp/htdocs/` directory.
2. Open the **XAMPP Control Panel** and start **Apache**.
3. Open your browser and navigate to:
   ```
   http://localhost/kids-math-game/
   ```
   *(or the corresponding subfolder path in your `htdocs`)*

### Option 2: Using VS Code Live Server
1. Open this repository in **Visual Studio Code**.
2. Install the **Live Server** extension.
3. Right-click `index.html` and click **"Open with Live Server"**.

---

## 👨‍💻 Author & Coursework

* **Course:** ITE 387: Advanced Programming (Mini Project)
* **Author:** Zuriel Anthony Villaluna
* **Email:** [zuriel.villaluna@gmail.com](mailto:zuriel.villaluna@gmail.com)
* **GitHub:** [@Zula-stdnt](https://github.com/Zula-stdnt)
* **Live Demo:** [https://zula-stdnt.github.io/kids-math-game/](https://zula-stdnt.github.io/kids-math-game/)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
