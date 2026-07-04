# Kacper's Laboratory 🧪 (kacpertrzosinski.github.io)

Welcome to my personal project laboratory, algorithm visualizer, and knowledge base. This repository hosts a collection of interactive web applications, high school final exam (Matura) preparation tools, and physical simulations.

> **🤖 Note:** The majority of the code, UI design (Glassmorphism), and architecture of this repository was created with the assistance of Advanced Agentic AI.

## 🌟 Features & Modules

- **Algorithm Visualizations**
  - 🧭 Graph Pathfinding (A*, Dijkstra, etc.)
  - 🥧 PI Number Generation/Approximation
  - 📊 Sorting Algorithms Visualizer
- **Matura (High School Exam) Apps**
  - 📖 Polish Language (Speaking exam topics randomizer)
  - 📐 Mathematics (Interactive problem base)
  - 💻 Computer Science / IT (Algorithms, SQL, Pseudocode)
- **Physics & Experiments**
  - 🔬 Interactive 2D Physics Simulator using `Matter.js`
- **Personal Wiki / Knowledge Base**
  - 📚 A fully client-side rendered Markdown Wiki supporting nested categories and subcategories based on folder structure.
  - Automatically indexed using the script: `node wiki/generate_index.js`.
  - Features real-time syntax highlighting (`highlight.js`) and collapsible category trees.
  - Implements an advanced "spotlight" mouse-tracking hover effect.

## 🎨 UI & Design

The entire website is built around a modern **Glassmorphism** aesthetic:
- Deep dark background with colorful floating ambient glows.
- Frosted glass panels (`backdrop-filter: blur()`).
- Dynamic spotlight effects that track mouse movements over cards and articles.
- 3D tilt interactions (powered by `vanilla-tilt.js`).
- Fully responsive (Mobile-First) layout adapted for all devices.

## 🚀 Running Locally

Because the Wiki module fetches `.md` and `.json` files dynamically, running the `index.html` directly from your file system (using the `file://` protocol) will cause CORS errors in modern browsers.

To run this project locally, please use a local HTTP server:
- **VS Code:** Install the "Live Server" extension and click "Go Live".
- **Python:** Run `python -m http.server 8000` in the root directory.
- **Node.js:** Run `npx serve .`

## 📄 License

All rights reserved &copy; Kacper Trzosiński.