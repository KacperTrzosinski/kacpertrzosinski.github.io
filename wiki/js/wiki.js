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
        const response = await fetch(ARTICLES_LIST_URL + '?v=' + new Date().getTime());
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

function buildTree(articlesList) {
    const root = {
        name: 'root',
        type: 'folder',
        children: {},
        articles: []
    };

    articlesList.forEach(article => {
        let pathParts = [];
        if (article.categoryPath && Array.isArray(article.categoryPath)) {
            pathParts = article.categoryPath;
        } else if (article.file && article.file.includes('/')) {
            const parts = article.file.split('/');
            parts.pop(); // remove file name
            pathParts = parts;
        } else if (article.category) {
            pathParts = [article.category];
        }

        let currentNode = root;
        pathParts.forEach(part => {
            if (!currentNode.children[part]) {
                currentNode.children[part] = {
                    name: part,
                    type: 'folder',
                    children: {},
                    articles: []
                };
            }
            currentNode = currentNode.children[part];
        });

        currentNode.articles.push(article);
    });

    return root;
}

function hasMatchingContent(node, searchQuery) {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    
    // Check if any direct article matches
    const articleMatches = node.articles.some(article => 
        article.title.toLowerCase().includes(query) || 
        (article.tags && article.tags.some(t => t.toLowerCase().includes(query)))
    );
    if (articleMatches) return true;
    
    // Check if any subfolder matches
    for (const folderName in node.children) {
        if (hasMatchingContent(node.children[folderName], searchQuery)) {
            return true;
        }
    }
    
    return false;
}

function renderTree(node, container, searchQuery = '') {
    // Render folders in this node sorted alphabetically
    const folderNames = Object.keys(node.children).sort((a, b) => a.localeCompare(b, 'pl'));
    for (const folderName of folderNames) {
        const folder = node.children[folderName];
        
        if (!hasMatchingContent(folder, searchQuery)) continue;

        const folderDiv = document.createElement('div');
        folderDiv.className = 'category-folder';
        if (!searchQuery) {
            folderDiv.classList.add('collapsed');
        }
        
        const folderHeader = document.createElement('div');
        folderHeader.className = 'category-header';
        folderHeader.innerHTML = `<span class="folder-icon">▼</span> ${folderName}`;
        
        const folderContent = document.createElement('div');
        folderContent.className = 'category-content';

        folderHeader.onclick = (e) => {
            e.stopPropagation();
            folderDiv.classList.toggle('collapsed');
        };
        
        folderDiv.appendChild(folderHeader);
        renderTree(folder, folderContent, searchQuery);
        folderDiv.appendChild(folderContent);
        container.appendChild(folderDiv);
    }

    // Render articles in this node sorted alphabetically
    const sortedArticles = [...node.articles].sort((a, b) => a.title.localeCompare(b.title, 'pl'));
    sortedArticles.forEach(article => {
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matches = article.title.toLowerCase().includes(query) || 
                            (article.tags && article.tags.some(t => t.toLowerCase().includes(query)));
            if (!matches) return;
        }

        const a = document.createElement('a');
        a.href = `#${article.id}`;
        a.className = `nav-item ${article.id === currentArticleId ? 'active' : ''}`;
        a.textContent = article.title;
        container.appendChild(a);
    });
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

    const tree = buildTree(filtered);
    renderTree(tree, sidebar, searchQuery);

    // If we have an active article, expand its parent folders
    if (currentArticleId) {
        expandParentFolders(sidebar, currentArticleId);
    }
}

function expandParentFolders(sidebar, articleId) {
    const activeItem = sidebar.querySelector(`.nav-item[href="#${articleId}"]`);
    if (activeItem) {
        let parent = activeItem.parentElement;
        while (parent && parent !== sidebar) {
            if (parent.classList.contains('category-content')) {
                const folder = parent.parentElement;
                if (folder && folder.classList.contains('category-folder')) {
                    folder.classList.remove('collapsed');
                }
            }
            parent = parent.parentElement;
        }
    }
}

function handleHashChange() {
    const hash = window.location.hash.slice(1);
    
    if (!hash || hash === 'home') {
        loadHome();
    } else {
        const [id, anchor] = hash.split('#');
        loadArticle(id, anchor);
    }
}

function loadHome() {
    currentArticleId = null;
    
    // Update active state in sidebar
    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.remove('active');
    });

    const container = document.getElementById('markdown-container');
    
    // Group articles by category path
    const grouped = {};
    articles.forEach(article => {
        let pathParts = [];
        if (article.categoryPath && Array.isArray(article.categoryPath)) {
            pathParts = article.categoryPath;
        } else if (article.file && article.file.includes('/')) {
            const parts = article.file.split('/');
            parts.pop(); // remove file name
            pathParts = parts;
        } else if (article.category) {
            pathParts = [article.category];
        }
        
        const pathStr = pathParts.length > 0 ? pathParts.join(' → ') : 'Inne';
        if (!grouped[pathStr]) grouped[pathStr] = [];
        grouped[pathStr].push(article);
    });
    
    let html = `
        <div style="margin-bottom: 40px; animation: fadeDown 0.8s ease-out;">
            <h1 style="font-size: 2.5rem; color: #fff; margin-top: 0; margin-bottom: 8px;">Baza Wiedzy</h1>
            <p style="color: var(--text-muted); font-size: 1.1rem;">Wybierz kategorię lub artykuł, aby rozpocząć czytanie.</p>
        </div>
    `;

    const colors = ['card-purple', 'card-blue', 'card-pink', 'card-emerald', 'card-gold', 'card-red'];
    let colorIndex = 0;

    // Sort categories alphabetically
    const sortedCategories = Object.keys(grouped).sort((a, b) => a.localeCompare(b, 'pl'));

    for (const category of sortedCategories) {
        const items = grouped[category];
        // Sort items in category alphabetically
        items.sort((a, b) => a.title.localeCompare(b.title, 'pl'));

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
                            <p style="margin-bottom: 0; font-size: 0.95rem; line-height: 1.5;">${article.description || 'Brak opisu dla tego artykułu.'}</p>
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

async function loadArticle(id, anchor = null) {
    currentArticleId = id;
    
    // Update active state in sidebar
    document.querySelectorAll('.nav-item').forEach(el => {
        if (el.getAttribute('href') === `#${id}`) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    });

    const sidebar = document.getElementById('article-list');
    expandParentFolders(sidebar, id);

    const container = document.getElementById('markdown-container');
    container.innerHTML = '<div class="loading" style="color: var(--text-muted); padding: 2rem;">Wczytywanie...</div>';
    
    const article = articles.find(a => a.id === id);
    if (!article) {
        container.innerHTML = '<h2>Nie znaleziono artykułu</h2>';
        return;
    }
    
    try {
        const response = await fetch(`${ARTICLES_DIR}${article.file}?v=` + new Date().getTime());
        if (!response.ok) throw new Error('Network response was not ok');
        const markdown = await response.text();
        
        container.innerHTML = marked.parse(markdown);
        
        // Ensure code blocks are highlighted
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });

        // Scroll to anchor if specified, otherwise scroll to top
        if (anchor) {
            const decodedAnchor = decodeURIComponent(anchor);
            const element = document.getElementById(decodedAnchor) || 
                            document.getElementsByName(decodedAnchor)[0] || 
                            document.querySelector(`[id*="${decodedAnchor}"]`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            } else {
                document.getElementById('wiki-content').scrollTop = 0;
            }
        } else {
            document.getElementById('wiki-content').scrollTop = 0;
        }
        
    } catch (error) {
        console.error('Error loading article:', error);
        container.innerHTML = `
            <h2>Błąd</h2>
            <p style="color: var(--text-muted)">Nie udało się załadować treści artykułu.</p>
        `;
    }
}

function resolveRelativePath(basePath, relativePath) {
    const normalizedBase = basePath.replace(/\\/g, '/');
    const normalizedRel = relativePath.replace(/\\/g, '/');
    
    const baseDirParts = normalizedBase.split('/');
    baseDirParts.pop(); // remove filename
    
    const relParts = normalizedRel.split('/');
    for (const part of relParts) {
        if (part === '.' || part === '') {
            continue;
        } else if (part === '..') {
            if (baseDirParts.length > 0) baseDirParts.pop();
        } else {
            baseDirParts.push(part);
        }
    }
    
    return baseDirParts.join('/');
}

// Intercept clicks on links inside markdown body to handle relative .md file navigation
document.addEventListener('click', (e) => {
    const a = e.target.closest('.markdown-body a');
    if (!a) return;
    
    const href = a.getAttribute('href');
    if (!href) return;
    
    // Ignore absolute and normal hash links
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('#') || href.startsWith('//')) {
        return;
    }
    
    const decodedHref = decodeURIComponent(href);
    const [pathPart, anchorPart] = decodedHref.split('#');
    
    if (pathPart.endsWith('.md')) {
        const currentArticle = articles.find(art => art.id === currentArticleId);
        let targetFile = pathPart;
        
        if (currentArticle && !pathPart.startsWith('file:///')) {
            targetFile = resolveRelativePath(currentArticle.file, pathPart);
        }
        
        // Match the resolved relative path, or match via endsWith suffix for absolute/file links
        let targetArticle = articles.find(art => art.file.toLowerCase() === targetFile.toLowerCase());
        
        if (!targetArticle) {
            targetArticle = articles.find(art => {
                const cleanPathPart = pathPart.replace(/\\/g, '/');
                const cleanArtFile = art.file.replace(/\\/g, '/');
                return cleanPathPart.toLowerCase().endsWith(cleanArtFile.toLowerCase());
            });
        }
        
        if (targetArticle) {
            e.preventDefault();
            // Change hash to trigger SPA navigation
            window.location.hash = targetArticle.id + (anchorPart ? `#${anchorPart}` : '');
        } else {
            console.warn(`Could not resolve article link for: ${href}`);
        }
    }
});
