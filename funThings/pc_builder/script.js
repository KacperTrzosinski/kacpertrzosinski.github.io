// PC Builder Simulator

// PC Builder Simulator

const PARTS_DB = {
    cpu: [
        // Intel
        { id: 'c1', name: 'Intel Celeron G6900', price: 250, socket: 'LGA1700', ramType: 'DDR4', cores: '2 / 2', clock: '3.4 GHz', tdp: 46, gameScore: 10, prodScore: 10 },
        { id: 'c2', name: 'Intel Core i3-12100F', price: 400, socket: 'LGA1700', ramType: 'DDR4', cores: '4 / 8', clock: '4.3 GHz', tdp: 58, gameScore: 40, prodScore: 30 },
        { id: 'c3', name: 'Intel Core i5-13400F', price: 950, socket: 'LGA1700', ramType: 'DDR5', cores: '10 / 16', clock: '4.6 GHz', tdp: 65, gameScore: 75, prodScore: 65 },
        { id: 'c4', name: 'Intel Core i5-13600K', price: 1350, socket: 'LGA1700', ramType: 'DDR5', cores: '14 / 20', clock: '5.1 GHz', tdp: 125, gameScore: 95, prodScore: 85 },
        { id: 'c5', name: 'Intel Core i7-14700K', price: 1850, socket: 'LGA1700', ramType: 'DDR5', cores: '20 / 28', clock: '5.6 GHz', tdp: 125, gameScore: 105, prodScore: 110 },
        { id: 'c6', name: 'Intel Core i9-14900K', price: 2800, socket: 'LGA1700', ramType: 'DDR5', cores: '24 / 32', clock: '6.0 GHz', tdp: 253, gameScore: 110, prodScore: 130 },
        // AMD AM4
        { id: 'c7', name: 'AMD Ryzen 5 3600', price: 350, socket: 'AM4', ramType: 'DDR4', cores: '6 / 12', clock: '4.2 GHz', tdp: 65, gameScore: 35, prodScore: 35 },
        { id: 'c8', name: 'AMD Ryzen 5 5600', price: 550, socket: 'AM4', ramType: 'DDR4', cores: '6 / 12', clock: '4.4 GHz', tdp: 65, gameScore: 60, prodScore: 50 },
        { id: 'c9', name: 'AMD Ryzen 7 5700X', price: 750, socket: 'AM4', ramType: 'DDR4', cores: '8 / 16', clock: '4.6 GHz', tdp: 65, gameScore: 70, prodScore: 65 },
        { id: 'c10', name: 'AMD Ryzen 7 5800X3D', price: 1350, socket: 'AM4', ramType: 'DDR4', cores: '8 / 16', clock: '4.5 GHz', tdp: 105, gameScore: 100, prodScore: 70 },
        // AMD AM5
        { id: 'c11', name: 'AMD Ryzen 5 7600', price: 950, socket: 'AM5', ramType: 'DDR5', cores: '6 / 12', clock: '5.1 GHz', tdp: 65, gameScore: 80, prodScore: 65 },
        { id: 'c12', name: 'AMD Ryzen 7 7700X', price: 1450, socket: 'AM5', ramType: 'DDR5', cores: '8 / 16', clock: '5.4 GHz', tdp: 105, gameScore: 90, prodScore: 80 },
        { id: 'c13', name: 'AMD Ryzen 7 7800X3D', price: 1700, socket: 'AM5', ramType: 'DDR5', cores: '8 / 16', clock: '5.0 GHz', tdp: 120, gameScore: 125, prodScore: 75 },
        { id: 'c14', name: 'AMD Ryzen 9 7900X', price: 1950, socket: 'AM5', ramType: 'DDR5', cores: '12 / 24', clock: '5.6 GHz', tdp: 170, gameScore: 100, prodScore: 110 },
        { id: 'c15', name: 'AMD Ryzen 9 7950X', price: 2500, socket: 'AM5', ramType: 'DDR5', cores: '16 / 32', clock: '5.7 GHz', tdp: 170, gameScore: 105, prodScore: 140 },
    ],
    mobo: [
        // LGA1700 DDR4
        { id: 'm1', name: 'MSI PRO H610M-G', price: 300, socket: 'LGA1700', ramType: 'DDR4', chipset: 'H610', form: 'mATX' },
        { id: 'm2', name: 'ASUS PRIME B660M-K D4', price: 450, socket: 'LGA1700', ramType: 'DDR4', chipset: 'B660', form: 'mATX' },
        // LGA1700 DDR5
        { id: 'm3', name: 'ASUS TUF GAMING B760-PLUS', price: 800, socket: 'LGA1700', ramType: 'DDR5', chipset: 'B760', form: 'ATX' },
        { id: 'm4', name: 'Gigabyte Z790 AORUS ELITE AX', price: 1200, socket: 'LGA1700', ramType: 'DDR5', chipset: 'Z790', form: 'ATX' },
        // AM4
        { id: 'm5', name: 'Gigabyte A520M K V2', price: 250, socket: 'AM4', ramType: 'DDR4', chipset: 'A520', form: 'mATX' },
        { id: 'm6', name: 'MSI B550-A PRO', price: 500, socket: 'AM4', ramType: 'DDR4', chipset: 'B550', form: 'ATX' },
        { id: 'm7', name: 'ASUS ROG STRIX B550-F GAMING', price: 750, socket: 'AM4', ramType: 'DDR4', chipset: 'B550', form: 'ATX' },
        // AM5
        { id: 'm8', name: 'ASRock A620M-HDV/M.2', price: 450, socket: 'AM5', ramType: 'DDR5', chipset: 'A620', form: 'mATX' },
        { id: 'm9', name: 'Gigabyte B650 GAMING X AX', price: 850, socket: 'AM5', ramType: 'DDR5', chipset: 'B650', form: 'ATX' },
        { id: 'm10', name: 'MSI MAG X670E TOMAHAWK WIFI', price: 1350, socket: 'AM5', ramType: 'DDR5', chipset: 'X670E', form: 'ATX' },
        { id: 'm11', name: 'ASUS ROG CROSSHAIR X670E', price: 2500, socket: 'AM5', ramType: 'DDR5', chipset: 'X670E', form: 'E-ATX' }
    ],
    ram: [
        // DDR4
        { id: 'r1', name: 'Crucial 8GB 2666MHz CL19', price: 80, type: 'DDR4', cap: 8, speed: '2666 MT/s', cl: 'CL19' },
        { id: 'r2', name: 'GoodRam IRDM X 16GB (2x8) 3200MHz', price: 180, type: 'DDR4', cap: 16, speed: '3200 MT/s', cl: 'CL16' },
        { id: 'r3', name: 'Corsair Vengeance LPX 32GB (2x16) 3600MHz', price: 350, type: 'DDR4', cap: 32, speed: '3600 MT/s', cl: 'CL18' },
        { id: 'r4', name: 'G.Skill Ripjaws V 64GB (2x32) 3600MHz', price: 700, type: 'DDR4', cap: 64, speed: '3600 MT/s', cl: 'CL18' },
        // DDR5
        { id: 'r5', name: 'Crucial 16GB (2x8) 4800MHz CL40', price: 280, type: 'DDR5', cap: 16, speed: '4800 MT/s', cl: 'CL40' },
        { id: 'r6', name: 'Kingston FURY Beast 32GB (2x16) 6000MHz', price: 500, type: 'DDR5', cap: 32, speed: '6000 MT/s', cl: 'CL36' },
        { id: 'r7', name: 'Lexar Ares RGB 32GB (2x16) 6400MHz', price: 550, type: 'DDR5', cap: 32, speed: '6400 MT/s', cl: 'CL32' },
        { id: 'r8', name: 'G.Skill Trident Z5 64GB (2x32) 6400MHz', price: 1100, type: 'DDR5', cap: 64, speed: '6400 MT/s', cl: 'CL32' },
        { id: 'r9', name: 'Corsair Dominator Titanium 96GB (2x48)', price: 1950, type: 'DDR5', cap: 96, speed: '6600 MT/s', cl: 'CL32' },
    ],
    gpu: [
        // Low End
        { id: 'g0', name: '[Brak Karcie / Tylko zintegrowana GPU]', price: 0, power: 0, vram: '0 GB', arch: 'Zintegrowana', gameScore: 10, prodScore: 10 },
        { id: 'g1', name: 'AMD Radeon RX 6400', price: 600, power: 53, vram: '4 GB', arch: 'RDNA2', gameScore: 25, prodScore: 15 },
        { id: 'g2', name: 'NVIDIA GeForce GTX 1650', price: 650, power: 75, vram: '4 GB', arch: 'Turing', gameScore: 30, prodScore: 20 },
        // Mid Range
        { id: 'g3', name: 'AMD Radeon RX 6600', price: 950, power: 132, vram: '8 GB', arch: 'RDNA2', gameScore: 50, prodScore: 30 },
        { id: 'g4', name: 'NVIDIA GeForce RTX 3060', price: 1250, power: 170, vram: '12 GB', arch: 'Ampere', gameScore: 60, prodScore: 55 },
        { id: 'g5', name: 'AMD Radeon RX 7600', price: 1250, power: 165, vram: '8 GB', arch: 'RDNA3', gameScore: 65, prodScore: 40 },
        { id: 'g6', name: 'NVIDIA GeForce RTX 4060', price: 1400, power: 115, vram: '8 GB', arch: 'Ada', gameScore: 70, prodScore: 60 },
        // High End
        { id: 'g7', name: 'AMD Radeon RX 7800 XT', price: 2350, power: 263, vram: '16 GB', arch: 'RDNA3', gameScore: 100, prodScore: 75 },
        { id: 'g8', name: 'NVIDIA GeForce RTX 4070 SUPER', price: 2800, power: 220, vram: '12 GB', arch: 'Ada', gameScore: 115, prodScore: 100 },
        { id: 'g9', name: 'AMD Radeon RX 7900 XT', price: 3450, power: 315, vram: '20 GB', arch: 'RDNA3', gameScore: 135, prodScore: 90 },
        { id: 'g10', name: 'NVIDIA GeForce RTX 4080 SUPER', price: 4600, power: 320, vram: '16 GB', arch: 'Ada', gameScore: 150, prodScore: 130 },
        // Enthusiast / Pro
        { id: 'g11', name: 'AMD Radeon RX 7900 XTX', price: 4500, power: 355, vram: '24 GB', arch: 'RDNA3', gameScore: 160, prodScore: 110 },
        { id: 'g12', name: 'NVIDIA GeForce RTX 4090', price: 8500, power: 450, vram: '24 GB', arch: 'Ada', gameScore: 190, prodScore: 180 },
        { id: 'g13', name: 'NVIDIA RTX 6000 Ada Gen', price: 34000, power: 300, vram: '48 GB', arch: 'Ada Pro', gameScore: 170, prodScore: 350 },
    ],
    storage: [
        { id: 's1', name: 'Lexar NM620 512GB (M.2 NVMe)', price: 150, cap: 512, speed: '3300 MB/s', pcie: 'Gen3', prodScore: 15 },
        { id: 's2', name: 'Lexar NM710 1TB (M.2 NVMe)', price: 280, cap: 1000, speed: '5000 MB/s', pcie: 'Gen4', prodScore: 25 },
        { id: 's3', name: 'Kingston KC3000 2TB (M.2 NVMe)', price: 650, cap: 2000, speed: '7000 MB/s', pcie: 'Gen4', prodScore: 45 },
        { id: 's4', name: 'Samsung 990 PRO 4TB (M.2 NVMe)', price: 1450, cap: 4000, speed: '7450 MB/s', pcie: 'Gen4', prodScore: 60 },
        { id: 's5', name: 'Crucial T700 2TB (M.2 NVMe)', price: 1150, cap: 2000, speed: '12400 MB/s', pcie: 'Gen5', prodScore: 80 },
        { id: 's6', name: 'Seagate BarraCuda 4TB (HDD)', price: 400, cap: 4000, speed: '190 MB/s', pcie: 'SATA3', prodScore: 5 },
    ],
    psu: [
        { id: 'p1', name: 'Endorfy Vero L5 500W', price: 200, watt: 500, cert: '80+ Bronze', mod: 'Brak' },
        { id: 'p2', name: 'be quiet! System Power 10 650W', price: 300, watt: 650, cert: '80+ Bronze', mod: 'Brak' },
        { id: 'p3', name: 'MSI MAG A750GL 750W', price: 450, watt: 750, cert: '80+ Gold', mod: 'W pełni modularny' },
        { id: 'p4', name: 'Corsair RM850e 850W', price: 550, watt: 850, cert: '80+ Gold', mod: 'W pełni modularny' },
        { id: 'p5', name: 'be quiet! Pure Power 12 M 1000W', price: 750, watt: 1000, cert: '80+ Gold', mod: 'W pełni modularny' },
        { id: 'p6', name: 'SeaSonic Vertex GX-1200 1200W', price: 1250, watt: 1200, cert: '80+ Gold', mod: 'W pełni modularny' },
        { id: 'p7', name: 'Corsair AX1600i 1600W', price: 2200, watt: 1600, cert: '80+ Titanium', mod: 'W pełni modularny' },
    ]
};

const MISSIONS = [
    {
        title: "Komputer Biurowy / Do Nauki",
        desc: "Złóż tani, zintegrowany komputer do przeglądania internetu i pracy biurowej.",
        budget: 1500,
        reqGame: 0,
        reqProd: 20
    },
    {
        title: "Tani Komputer E-Sportowy (CS2, LoL)",
        desc: "Budżetowy sprzęt, który uciągnie podstawowe gry sieciowe w 1080p.",
        budget: 3000,
        reqGame: 40,
        reqProd: 20
    },
    {
        title: "Złoty Środek Gamera (1440p)",
        desc: "Stwórz optymalną maszynę do nowych gier w rozdzielczości 1440p. Celuj w wydajne CPU i solidne GPU.",
        budget: 6500,
        reqGame: 90,
        reqProd: 50
    },
    {
        title: "Stacja Robocza (Blender, Premiere)",
        desc: "Priorytetem jest wielordzeniowy procesor, dużo szybkiego RAMu oraz dużo miejsca na dysku. Gry to sprawa drugorzędna.",
        budget: 8000,
        reqGame: 50,
        reqProd: 120
    },
    {
        title: "Potwór Bez Kompromisów (4K)",
        desc: "Złóż absolutnie najszybszy sprzęt dostępny na rynku do grania w 4K na maksymalnych detalach.",
        budget: 16000,
        reqGame: 140,
        reqProd: 100
    }
];

let currentMissionIndex = 0;
let cart = {
    cpu: null,
    mobo: null,
    ram: null,
    gpu: null,
    storage: null,
    psu: null
};

// UI Elements
const elTabs = document.querySelectorAll('.tab-btn');
const elGrid = document.getElementById('parts-grid');
const elCartList = document.getElementById('cart-list');
const elBudgetCurrent = document.getElementById('budget-current');
const elBudgetMax = document.getElementById('budget-max');
const elBudgetBar = document.getElementById('budget-bar');
const elMissionTitle = document.getElementById('mission-title');
const elMissionDesc = document.getElementById('mission-desc');
const elBtnSubmit = document.getElementById('btn-submit');
const elBtnNext = document.getElementById('btn-next-mission');

// Modal Elements
const modal = document.getElementById('result-modal');
const modTitle = document.getElementById('modal-title');
const modFeedback = document.getElementById('modal-feedback');
const scoreGame = document.getElementById('score-gaming');
const scoreProd = document.getElementById('score-prod');
const scoreCompat = document.getElementById('score-compat');
document.getElementById('btn-close-modal').addEventListener('click', () => modal.classList.remove('active'));

function init() {
    loadMission(currentMissionIndex);
    
    elTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            elTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderShop(tab.getAttribute('data-cat'));
        });
    });

    renderShop('cpu');
    updateCartUI();

    elBtnSubmit.addEventListener('click', evaluateBuild);
    elBtnNext.addEventListener('click', () => {
        currentMissionIndex = (currentMissionIndex + 1) % MISSIONS.length;
        resetCart();
        loadMission(currentMissionIndex);
        elBtnNext.style.display = 'none';
        elBtnSubmit.style.display = 'block';
    });
}

function loadMission(idx) {
    const m = MISSIONS[idx];
    elMissionTitle.innerText = `Misja ${idx+1}: ${m.title}`;
    elMissionDesc.innerText = m.desc;
    elBudgetMax.innerText = m.budget;
    updateCartUI();
}

const elGuideBox = document.getElementById('category-guide');

const EDUCATIONAL_GUIDES = {
    cpu: `<strong>Wybór Procesora (CPU) - Mózg Komputera:</strong><br>
    • <em>W grach:</em> Najważniejsza jest <strong>wydajność pojedynczego rdzenia</strong> (wysokie Taktowanie/GHz) oraz innowacyjna pamięć <strong>L3 Cache</strong> (szczególnie procesory AMD z dopiskiem "X3D"). Gry rzadko potrafią efektywnie wykorzystać więcej niż 6 do 8 rdzeni. Zbyt potężny procesor w stosunku do karty graficznej to wyrzucanie pieniędzy w błoto.<br>
    • <em>W profesjonalnej pracy (Renderowanie 3D, Montaż Wideo):</em> Tutaj królują <strong>wielowątkowość i ilość rdzeni</strong>. Programy takie jak Blender czy Premiere Pro idealnie skalują się z ilością rdzeni, więc procesory posiadające 16, 24 lub więcej rdzeni znacząco skracają czas eksportu.<br>
    • <em>TDP (Thermal Design Power):</em> Oznacza przybliżoną ilość ciepła, jaką procesor wydziela pod obciążeniem. Procesory z TDP powyżej 100W zazwyczaj wymagają zakupu drogiego i wydajnego chłodzenia (np. wodnego AiO).`,
    
    mobo: `<strong>Wybór Płyty Głównej - Kręgosłup Systemu:</strong><br>
    • <em>Socket (Gniazdo):</em> To absolutna podstawa. Procesor <strong>musi</strong> fizycznie pasować do gniazda na płycie (np. procesor AMD Ryzen serii 7000 wejdzie <u>tylko i wyłącznie</u> do gniazda AM5).<br>
    • <em>Chipset i Sekcja Zasilania (VRM):</em> Tanie płyty (chipsety H610, A520) są super do budżetowych komputerów, ale ich sekcja zasilania może się przegrzewać, jeśli zamontujesz na nich potężnego i9 lub Ryzena 9. Do flagowych procesorów celuj w płyty Z790 lub X670.<br>
    • <em>Format (Rozmiar):</em> <strong>ATX</strong> to standardowy, duży rozmiar. <strong>mATX (Micro-ATX)</strong> jest krótsza (mniej złącz), ale tańsza i pasuje do mniejszych obudów.`,
    
    ram: `<strong>Wybór Pamięci RAM (Pamięć Operacyjna):</strong><br>
    • <em>Generacja:</em> DDR4 odchodzi do lamusa, choć nadal jest świetne budżetowo. Nowe procesory i płyty główne (np. AMD AM5) <strong>wymagają</strong> już pamięci DDR5, która jest znacznie szybsza.<br>
    • <em>Pojemność:</em> 8GB to dzisiaj minimum do przeglądania internetu. <strong>16GB to rozsądny standard</strong>, ale w 2024/2025 roku <strong>32GB to "sweet spot"</strong> dla graczy, by uniknąć ścinek w nowych grach. Do ciężkiej pracy (maszyny wirtualne, wideo 4K) warto mieć 64GB+.<br>
    • <em>Szybkość i Opóźnienia:</em> Mierzone w MT/s (np. 6000 MT/s). Im wyżej, tym szybciej dane trafiają do procesora. Parametr <strong>CL (CAS Latency)</strong> oznacza opóźnienia – tutaj zasada jest odwrotna: <strong>im niższe CL, tym lepiej</strong>.`,
    
    gpu: `<strong>Wybór Karty Graficznej (GPU) - Silnik Graficzny:</strong><br>
    • <em>Komputer do Gier:</em> To najważniejszy element! Jeśli składasz PC do gier, karta powinna pożerać <strong>od 40% do 50% Twojego całkowitego budżetu</strong>. To od niej zależy ilość FPS (Klatek na sekundę).<br>
    • <em>Pamięć VRAM:</em> To dedykowana pamięć karty. Nowoczesne gry na wysokich detalach błyskawicznie zapełniają pamięć. <strong>8GB VRAM to dzisiaj totalne minimum</strong> w 1080p. Do rozdzielczości 1440p celuj w 12GB, a do 4K – 16GB lub więcej.<br>
    • <em>Architektura:</em> Karty NVIDIA (GeForce) zazwyczaj oferują lepszą jakość skalowania obrazu (DLSS) oraz wydajność w śledzeniu promieni (Ray Tracing). Karty AMD (Radeon) często oferują lepszy stosunek "surowej" wydajności i ilości VRAM do ceny.`,
    
    storage: `<strong>Wybór Dysku (Magazyn Danych):</strong><br>
    • <em>Dyski NVMe (M.2):</em> Są podłączane bezpośrednio do płyty głównej. Są niewyobrażalnie małe (jak paczka gumy do żucia) i superszybkie. Generacja <strong>PCIe Gen3</strong> osiąga do 3500 MB/s, <strong>Gen4</strong> do 7500 MB/s, a potężne (i gorące) <strong>Gen5</strong> przebijają 12000 MB/s!<br>
    • <em>Dysk do Gier:</em> W grach różnica między dyskiem z prędkością 3000 MB/s a 7000 MB/s jest ledwo zauważalna podczas ładowania ekranu. Nie warto przepłacać za Gen5 do samej rozrywki.<br>
    • <em>Dysk do Pracy:</em> Jeśli przesuwasz gigabajty surowego wideo w programach montażowych, ultra-szybki dysk Gen4 / Gen5 drastycznie usprawni Twoją pracę, likwidując zacinanie się osi czasu.`,
    
    psu: `<strong>Wybór Zasilacza (PSU) - Serce i Bezpieczeństwo:</strong><br>
    • <em>Zasada nr 1:</em> <strong>NIGDY NIE OSZCZĘDZAJ NA ZASILACZU.</strong> Tani, niemarkowy zasilacz typu "z czarnej listy" może dosłownie eksplodować lub spalić resztę podzespołów. Wybieraj renomowane marki (Seasonic, Corsair, be quiet!, MSI).<br>
    • <em>Zapas Mocy:</em> Policz pobór mocy procesora (TDP) oraz karty graficznej i dodaj ~100W na resztę systemu. Zasilacz kupuj tak, by miał przynajmniej <strong>20-30% zapasu mocy</strong>. Dzięki temu wentylator zasilacza nie będzie hałasował wniebogłosy.<br>
    • <em>Certyfikaty 80 Plus:</em> Określają sprawność prądową (mniej prądu ucieka w postaci ciepła z gniazdka). <strong>80+ Bronze</strong> to sensowne minimum. <strong>80+ Gold</strong> to standard w komputerach dla graczy. Titanium to luksus.<br>
    • <em>Modularność:</em> Modularny zasilacz pozwala odpiąć kable, których nie używasz, co drastycznie ułatwia utrzymanie porządku w obudowie komputera.`
};

function renderShop(category) {
    elGrid.innerHTML = '';
    
    // Inject Educational Guide
    if (elGuideBox) {
        elGuideBox.innerHTML = EDUCATIONAL_GUIDES[category] || '';
    }

    const parts = PARTS_DB[category];
    
    parts.forEach(p => {
        const card = document.createElement('div');
        card.className = 'part-card';
        
        let specsHTML = '';
        if (category === 'cpu') {
            specsHTML = `Socket: <span style="color:#cbd5e1">${p.socket}</span> | Rdzenie: <span style="color:#cbd5e1">${p.cores}</span><br>Taktowanie: <span style="color:#cbd5e1">${p.clock}</span> | TDP: <span style="color:#cbd5e1">${p.tdp}W</span>`;
        }
        if (category === 'mobo') {
            specsHTML = `Socket: <span style="color:#cbd5e1">${p.socket}</span> | Chipset: <span style="color:#cbd5e1">${p.chipset}</span><br>Format: <span style="color:#cbd5e1">${p.form}</span> | RAM: <span style="color:#cbd5e1">${p.ramType}</span>`;
        }
        if (category === 'ram') {
            specsHTML = `Pojemność: <span style="color:#cbd5e1">${p.cap} GB (${p.type})</span><br>Szybkość: <span style="color:#cbd5e1">${p.speed}</span> | Opóźnienie: <span style="color:#cbd5e1">${p.cl}</span>`;
        }
        if (category === 'gpu') {
            specsHTML = `VRAM: <span style="color:#cbd5e1">${p.vram}</span> | TDP: <span style="color:#cbd5e1">${p.power}W</span><br>Architektura: <span style="color:#cbd5e1">${p.arch}</span>`;
        }
        if (category === 'storage') {
            specsHTML = `Pojemność: <span style="color:#cbd5e1">${p.cap} GB</span> | Interfejs: <span style="color:#cbd5e1">${p.pcie}</span><br>Szybkość (Max): <span style="color:#cbd5e1">${p.speed}</span>`;
        }
        if (category === 'psu') {
            specsHTML = `Moc: <span style="color:#cbd5e1">${p.watt} W</span> | Certyfikat: <span style="color:#cbd5e1">${p.cert}</span><br>Kable: <span style="color:#cbd5e1">${p.mod}</span>`;
        }

        card.innerHTML = `
            <div>
                <div class="part-title">${p.name}</div>
                <div class="part-specs">${specsHTML}</div>
            </div>
            <div>
                <div class="part-price">${p.price} PLN</div>
                <button class="btn btn-add" onclick="addToCart('${category}', '${p.id}')">Wybierz</button>
            </div>
        `;
        elGrid.appendChild(card);
    });
}

window.addToCart = function(category, id) {
    const part = PARTS_DB[category].find(x => x.id === id);
    cart[category] = part;
    updateCartUI();
};

window.removeFromCart = function(category) {
    cart[category] = null;
    updateCartUI();
};

function updateCartUI() {
    elCartList.innerHTML = '';
    let totalCost = 0;
    
    const catNames = {cpu: 'CPU', mobo: 'Płyta', ram: 'RAM', gpu: 'Karta graf.', storage: 'Dysk', psu: 'Zasilacz'};

    for (const [cat, part] of Object.entries(cart)) {
        if (part) {
            totalCost += part.price;
            elCartList.innerHTML += `
                <li class="cart-item">
                    <div>
                        <span style="color:#64748b; font-size:0.7rem; display:block;">${catNames[cat]}</span>
                        <span class="cart-item-name">${part.name}</span>
                    </div>
                    <div style="display:flex; gap: 10px; align-items:center;">
                        <span class="cart-item-price">${part.price} zł</span>
                        <button class="cart-item-remove" onclick="removeFromCart('${cat}')">X</button>
                    </div>
                </li>
            `;
        } else {
            elCartList.innerHTML += `
                <li class="cart-item" style="border-style: dashed; opacity: 0.5;">
                    <span class="cart-item-name">Brak: ${catNames[cat]}</span>
                </li>
            `;
        }
    }

    const m = MISSIONS[currentMissionIndex];
    elBudgetCurrent.innerText = totalCost;
    
    let p = (totalCost / m.budget) * 100;
    elBudgetBar.style.width = Math.min(p, 100) + '%';
    
    if (totalCost > m.budget) {
        elBudgetCurrent.style.color = '#ef4444';
        elBudgetBar.style.backgroundColor = '#ef4444';
    } else {
        elBudgetCurrent.style.color = '#e2e8f0';
        elBudgetBar.style.backgroundColor = '#ec4899';
    }
}

function evaluateBuild() {
    let errors = [];
    let c = cart;
    const m = MISSIONS[currentMissionIndex];

    // Check complete
    if (!c.cpu || !c.mobo || !c.ram || !c.storage || !c.psu || !c.gpu) {
        alert("Brakuje wymaganych części w zestawie!");
        return;
    }

    let cost = Object.values(c).reduce((sum, p) => sum + p.price, 0);
    if (cost > m.budget) errors.push(`Przekroczono budżet o ${cost - m.budget} PLN!`);

    // Compat: Socket
    if (c.cpu.socket !== c.mobo.socket) errors.push(`Niekompatybilny procesor (${c.cpu.socket}) z płytą główną (${c.mobo.socket}).`);
    
    // Compat: RAM
    if (c.cpu.ramType !== c.ram.type || c.mobo.ramType !== c.ram.type) {
        errors.push(`RAM ${c.ram.type} nie pasuje do płyty/procesora.`);
    }

    // Compat: Power
    let requiredPower = (c.gpu.power || 0) + 150; // CPU + system approx
    if (c.psu.watt < requiredPower) errors.push(`Zasilacz (${c.psu.watt}W) jest zbyt słaby! System potrzebuje min. ${requiredPower}W.`);

    let gameS = c.cpu.gameScore + c.gpu.gameScore;
    let prodS = c.cpu.prodScore + c.gpu.prodScore + c.storage.prodScore + (c.ram.cap > 16 ? 20 : 0);

    scoreGame.innerText = gameS;
    scoreProd.innerText = prodS;

    modTitle.innerText = errors.length > 0 ? "Zestaw Niesprawny 💥" : "Sukces! 🚀";
    
    if (errors.length > 0) {
        modFeedback.innerHTML = `<span style="color:#ef4444;">Błędy w konfiguracji:</span><ul>` + errors.map(e => `<li>${e}</li>`).join('') + `</ul>`;
        scoreCompat.innerText = "BŁĄD";
        scoreCompat.style.color = "#ef4444";
    } else {
        scoreCompat.innerText = "W 100% OK!";
        scoreCompat.style.color = "#10b981";
        
        let feedback = "Komputer złożony poprawnie! Wszystkie części do siebie pasują. <br><br>";
        
        if (gameS < m.reqGame) {
            feedback += `<span style="color:#f59e0b;">Ale uwaga: Sprzęt jest zbyt słaby do gier (Zdobył ${gameS} pkt, wymaga ${m.reqGame} pkt).</span>`;
        } else if (prodS < m.reqProd) {
            feedback += `<span style="color:#f59e0b;">Ale uwaga: Sprzęt może sobie nie poradzić z wymaganymi programami (Zdobył ${prodS} pkt, wymaga ${m.reqProd} pkt).</span>`;
        } else {
            feedback += `<span style="color:#10b981;">Gratulacje! Zbudowałeś maszynę idealną do tego zadania!</span>`;
            elBtnSubmit.style.display = 'none';
            elBtnNext.style.display = 'block';
        }
        modFeedback.innerHTML = feedback;
    }

    modal.classList.add('active');
}

function resetCart() {
    cart = { cpu: null, mobo: null, ram: null, gpu: null, storage: null, psu: null };
    updateCartUI();
}

document.addEventListener('DOMContentLoaded', init);
