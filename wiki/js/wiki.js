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

    filtered.forEach(article => {
        const a = document.createElement('a');
        a.href = `#${article.id}`;
        a.className = `nav-item ${article.id === currentArticleId ? 'active' : ''}`;
        a.textContent = article.title;
        sidebar.appendChild(a);
    });
}

function handleHashChange() {
    const hash = window.location.hash.slice(1);
    const articleId = hash || (articles.length > 0 ? articles[0].id : null);
    
    if (articleId) {
        loadArticle(articleId);
    }
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
