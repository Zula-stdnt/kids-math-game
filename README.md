<div align="center">

# 🎮 Kids Math Game

<p align="center">
  <strong>An interactive, child-friendly, mobile-first arithmetic learning web application built with modern modular JavaScript.</strong>
</p>

<!-- Unclickable / Non-interactable Badges -->
<p align="center">
  <img src="https://img.shields.io/badge/JavaScript-ES6%2B_Modules-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript ES6+ Modules" />
  <img src="https://img.shields.io/badge/HTML5-Semantic_Markup-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5 Semantic Markup" />
  <img src="https://img.shields.io/badge/CSS3-Mobile--First_Responsive-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3 Mobile First" />
  <img src="https://img.shields.io/badge/Web_Audio_API-Sound_Synthesizer-9B59B6?style=for-the-badge" alt="Web Audio API" />
  <img src="https://img.shields.io/badge/Storage-LocalStorage_API-FF6B6B?style=for-the-badge" alt="LocalStorage" />
  <img src="https://img.shields.io/badge/Architecture-ITE_387_Standard-4ECDC4?style=for-the-badge" alt="ITE 387 Architecture" />
  <img src="https://img.shields.io/badge/License-MIT-2ECC71?style=for-the-badge" alt="License MIT" />
</p>

</div>

---

## 📖 Overview

**Kids Math Game** is an engaging educational web application created to help young learners practice and master foundational arithmetic. Designed from the ground up with a bright, playful aesthetic, accessible touch controls, and immediate auditory/visual feedback, the game provides a supportive and rewarding learning environment for children on phones, tablets, and desktop computers.

This project was engineered following the **ITE 387: Advanced Programming** academic standards, deconstructing traditional single-file scripting into a clean, decoupled **ECMAScript Module (ESM)** architecture.

---

## ✨ Key Features

### 🎯 4 Core Arithmetic Modes
* ➕ **Addition:** Generates clean single-to-double digit addition problems ($1\text{--}10$).
* ➖ **Subtraction:** Algorithmically guarantees non-negative differences ($a \ge b$) so young kids never encounter confusing negative numbers.
* ✖️ **Multiplication:** Reinforces times tables from $1\text{ to }10$.
* ➗ **Division:** Generates problem sets where $dividend = divisor \times quotient$, strictly guaranteeing whole-integer quotients without fractions or division-by-zero errors.

### 📱 Hybrid Touch Numpad & Keyboard Input
* **Child-Friendly On-Screen Numpad:** Big, bouncy touch targets ($0\text{--}9$, $\text{⌫}$ Backspace, and $\text{✔}$ Submit) tailored for mobile and tablet touchscreens, keeping the problem clearly visible without relying on obstructive virtual keyboards.
* **Physical Keyboard Support:** Full support for desktop keyboard typing and `Enter` key submission.

### 🔊 Zero-Dependency Web Audio Synth
* Programmatic audio engine using the browser's native **Web Audio API** (`AudioContext`).
* Positive dual-frequency chimes for correct answers, a gentle thud for errors, and a victory fanfare upon quiz completion.
* Accessible top-bar **Mute Toggle** (`🔊 Sound On / 🔇 Muted`) with preference persistence.

### 🏆 Persistent Hall of Fame (Leaderboard)
* High scores and percentages are saved in `localStorage`.
* Ranks players by accuracy percentage, followed by total score.
* **Dual-View Responsive Presentation:** Renders as a semantic table on desktop viewports and dynamically adapts into stacked touch cards on mobile screens to prevent horizontal overflow.

### 📊 Visual Progress & Feedback
* Animated progress bar tracking session progress in real time.
* Defensive input validation preventing empty input submission or false zero evaluation.
* Canvas-based particle confetti explosions for high scores and perfect rounds.
* Dedicated Game Over flow with one-click **"Play Again"** and **"Back to Menu"** actions.

---

## 🏛️ Academic Architecture (ITE 387 Standards)

The project adheres to modern software engineering patterns established in the course:

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

## 🌐 Live Deployment (GitHub Pages)

To publish this game live on the web:
1. Go to your repository on GitHub: `https://github.com/Zula-stdnt/kids-math-game`
2. Navigate to **Settings** → **Pages**.
3. Under **Branch**, select `main` and root folder `/`, then click **Save**.
4. In a few minutes, your game will be live at:
   ```
   https://zula-stdnt.github.io/kids-math-game/
   ```

---

## 👨‍💻 Author

* **Zuriel Anthony Villaluna**
* Email: [zuriel.villaluna@gmail.com](mailto:zuriel.villaluna@gmail.com)
* GitHub: [@Zula-stdnt](https://github.com/Zula-stdnt)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
