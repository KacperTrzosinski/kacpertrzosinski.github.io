const fs = require('fs');
const path = require('path');

const ARTICLES_DIR = path.join(__dirname, 'articles');
const OUTPUT_FILE = path.join(__dirname, 'data', 'articles.json');

function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9/]/g, '-')
        .replace(/\/+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function cleanTitle(filename) {
    const base = path.basename(filename, '.md');
    return base
        .split(/[_-]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function getFilesRecursively(dir, fileList = []) {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            getFilesRecursively(filePath, fileList);
        } else if (file.endsWith('.md')) {
            fileList.push(filePath);
        }
    });
    return fileList;
}

function parseMarkdownFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(ARTICLES_DIR, filePath).replace(/\\/g, '/');
    const fileId = slugify(relativePath.slice(0, -3)); // remove .md

    // Parse folder structure for categories
    const dirParts = path.dirname(relativePath).split('/').filter(p => p && p !== '.');
    const categoryPath = dirParts;
    const category = categoryPath.length > 0 ? categoryPath[categoryPath.length - 1] : 'Inne';

    let title = '';
    let description = '';
    let tags = [];

    // Simple Front Matter Parser
    const frontMatterMatch = content.match(/^---\r?\n([\s\S]+?)\r?\n---\r?\n/);
    let mainContent = content;

    if (frontMatterMatch) {
        const fmText = frontMatterMatch[1];
        mainContent = content.slice(frontMatterMatch[0].length);
        
        const fmLines = fmText.split('\n');
        fmLines.forEach(line => {
            const parts = line.split(':');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                const value = parts.slice(1).join(':').trim();
                if (key === 'title') title = value.replace(/^['"]|['"]$/g, '');
                if (key === 'description') description = value.replace(/^['"]|['"]$/g, '');
                if (key === 'tags') {
                    // Try parsing as array e.g. [tag1, tag2] or comma separated
                    if (value.startsWith('[') && value.endsWith(']')) {
                        tags = value.slice(1, -1).split(',').map(t => t.trim().replace(/^['"]|['"]$/g, ''));
                    } else {
                        tags = value.split(',').map(t => t.trim().replace(/^['"]|['"]$/g, ''));
                    }
                }
            }
        });
    }

    // Fallbacks if no front matter or fields missing
    if (!title) {
        const titleMatch = mainContent.match(/^#\s+(.+)$/m);
        if (titleMatch) {
            title = titleMatch[1].trim();
        } else {
            title = cleanTitle(relativePath);
        }
    }

    // Clean emojis and tags from title if they exist at the start/end
    title = title.replace(/^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]\s+/u, '').trim();

    if (!description) {
        // Strip markdown syntax from content and grab first paragraph
        const textOnly = mainContent
            .replace(/^#+\s+.+$/gm, '') // remove headings
            .replace(/```[\s\S]*?```/g, '') // remove code blocks
            .replace(/`([^`]+)`/g, '$1') // inline code
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
            .replace(/[*_~]+/g, '') // bold/italic/strikethrough
            .trim();

        const paragraphs = textOnly.split(/\r?\n\r?\n/).filter(p => p.trim().length > 0);
        if (paragraphs.length > 0) {
            description = paragraphs[0];
            if (description.length > 180) {
                description = description.slice(0, 177) + '...';
            }
        } else {
            description = 'Brak opisu dla tego artykułu.';
        }
    }

    return {
        id: fileId,
        title,
        file: relativePath,
        category,
        categoryPath,
        tags,
        description
    };
}

function main() {
    console.log('Scanning articles in:', ARTICLES_DIR);
    if (!fs.existsSync(ARTICLES_DIR)) {
        console.error('Articles directory does not exist!');
        process.exit(1);
    }

    const files = getFilesRecursively(ARTICLES_DIR);
    const articles = files.map(file => parseMarkdownFile(file));

    // Ensure output directory exists
    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(articles, null, 2), 'utf8');
    console.log(`Successfully generated index with ${articles.length} articles at: ${OUTPUT_FILE}`);
}

if (require.main === module) {
    main();
}
