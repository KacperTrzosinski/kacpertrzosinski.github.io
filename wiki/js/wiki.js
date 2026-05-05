// Wiki System Logic

const ARTICLES_LIST_URL = 'data/articles.json';
const ARTICLES_DIR = 'articles/';

let articles = [];
let currentArticleId = null;

// Configure marked to use highlight.js
marked.setOptions({
    highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
            return hljs.highlight(code, { language: lang }).value;
        }
        return hljs.highlightAuto(code).value;
    },
    breaks: true
});

document.addEventListener('DOMContentLoaded', () => {
    initWiki();
    
    // Search functionality
    document.getElementById('search-input').addEventListener('input', (e) => {
        renderSidebar(e.target.value);
    });

    // Global mouse tracking for spotlight effects
    document.addEventListener('mousemove', e => {
        // Track cards
        const cards = document.getElementsByClassName("card");
        for (const card of cards) {
            const rect = card.getBoundingClientRect();
            card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
            card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
        }
        
        // Track markdown body
        const markdownBody = document.querySelector('.markdown-body');
        if (markdownBody) {
            const rect = markdownBody.getBoundingClientRect();
            markdownBody.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
            markdownBody.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
        }
    });
});

async function initWiki() {
    try {
        const response = await fetch(ARTICLES_LIST_URL);
        articles = await response.json();
        
        renderSidebar();
        
        // Handle initial routing based on hash
        handleHashChange();
        window.addEventListener('hashchange', handleHashChange);
    } catch (error) {
        console.error('Error loading articles list:', error);
        document.getElementById('markdown-container').innerHTML = `
            <div style="color: var(--c-red); padding: 2rem;">
                <h2>Błąd ładowania bazy wiedzy</h2>
                <p>Nie udało się załadować listy artykułów. Sprawdź, czy uruchamiasz stronę przez serwer HTTP (np. Live Server), ponieważ przeglądarki mogą blokować żądania fetch z lokalnego systemu plików (CORS).</p>
            </div>
        `;
    }
}

function renderSidebar(searchQuery = '') {
    const sidebar = document.getElementById('article-list');
    sidebar.innerHTML = '';
    
    const filtered = articles.filter(a => 
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (a.tags && a.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
    );
    
    if (filtered.length === 0) {
        sidebar.innerHTML = '<div style="padding: 16px; color: var(--text-muted); font-size: 0.9rem;">Brak wyników</div>';
        return;
    }

    // Group articles by category
    const grouped = {};
    filtered.forEach(article => {
        const cat = article.category || 'Inne';
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(article);
    });

    // Render category folders
    for (const [category, items] of Object.entries(grouped)) {
        const folderDiv = document.createElement('div');
        folderDiv.className = 'category-folder';
        
        // If there's an active search query, we want folders expanded.
        // Actually, they are expanded by default unless we add 'collapsed' class.
        
        const folderHeader = document.createElement('div');
        folderHeader.className = 'category-header';
        folderHeader.innerHTML = `<span class="folder-icon">▼</span> ${category}`;
        folderHeader.onclick = () => {
            folderDiv.classList.toggle('collapsed');
        };
        
        folderDiv.appendChild(folderHeader);

        const folderContent = document.createElement('div');
        folderContent.className = 'category-content';

        items.forEach(article => {
            const a = document.createElement('a');
            a.href = `#${article.id}`;
            a.className = `nav-item ${article.id === currentArticleId ? 'active' : ''}`;
            a.textContent = article.title;
            folderContent.appendChild(a);
        });

        folderDiv.appendChild(folderContent);
        sidebar.appendChild(folderDiv);
    }
}

function handleHashChange() {
    const hash = window.location.hash.slice(1);
    
    if (!hash || hash === 'home') {
        loadHome();
    } else {
        loadArticle(hash);
    }
}

function loadHome() {
    currentArticleId = null;
    
    // Update active state in sidebar
    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.remove('active');
    });

    const container = document.getElementById('markdown-container');
    
    // Group articles by category
    const grouped = {};
    articles.forEach(article => {
        const cat = article.category || 'Inne';
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(article);
    });
    
    let html = `
        <div style="margin-bottom: 40px; animation: fadeDown 0.8s ease-out;">
            <h1 style="font-size: 2.5rem; color: #fff; margin-top: 0; margin-bottom: 8px;">Baza Wiedzy</h1>
            <p style="color: var(--text-muted); font-size: 1.1rem;">Wybierz kategorię lub artykuł, aby rozpocząć czytanie.</p>
        </div>
    `;

    const colors = ['card-purple', 'card-blue', 'card-pink', 'card-emerald', 'card-gold', 'card-red'];
    let colorIndex = 0;

    for (const [category, items] of Object.entries(grouped)) {
        html += `
            <section class="category" style="margin-bottom: 48px;">
                <h2 class="category-title" style="cursor: pointer; user-select: none;" onclick="this.nextElementSibling.classList.toggle('collapsed-grid'); this.classList.toggle('collapsed')">
                    <span class="category-icon" style="font-size: 0.8em; margin-right: 8px;">▼</span> ${category}
                </h2>
                <div class="grid category-grid">
        `;
        
        items.forEach(article => {
            const cardColor = colors[colorIndex % colors.length];
            html += `
                    <a href="#${article.id}" class="card ${cardColor}" style="text-decoration: none; padding: 24px;">
                        <div class="card-content">
                            <h3 style="margin-top: 0;">${article.title}</h3>
                            <p style="margin-bottom: 0;">${article.tags ? article.tags.map(t => `#${t}`).join(' ') : ''}</p>
                        </div>
                    </a>
            `;
            colorIndex++;
        });
        
        html += `
                </div>
            </section>
        `;
    }

    container.innerHTML = html;

    document.getElementById('wiki-content').scrollTop = 0;
}

async function loadArticle(id) {
    currentArticleId = id;
    
    // Update active state in sidebar
    document.querySelectorAll('.nav-item').forEach(el => {
        if (el.getAttribute('href') === `#${id}`) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    });

    const container = document.getElementById('markdown-container');
    container.innerHTML = '<div class="loading" style="color: var(--text-muted); padding: 2rem;">Wczytywanie...</div>';
    
    const article = articles.find(a => a.id === id);
    if (!article) {
        container.innerHTML = '<h2>Nie znaleziono artykułu</h2>';
        return;
    }
    
    try {
        const response = await fetch(`${ARTICLES_DIR}${article.file}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const markdown = await response.text();
        
        container.innerHTML = marked.parse(markdown);
        
        // Ensure code blocks are highlighted
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });

        // Scroll to top
        document.getElementById('wiki-content').scrollTop = 0;
        
    } catch (error) {
        console.error('Error loading article:', error);
        container.innerHTML = `
            <h2>Błąd</h2>
            <p style="color: var(--text-muted)">Nie udało się załadować treści artykułu.</p>
        `;
    }
}
