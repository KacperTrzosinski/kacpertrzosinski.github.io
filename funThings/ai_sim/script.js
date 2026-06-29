const presets = {
    'gpt2': { p: 1.5, l: 48, d: 1600, ctx: 1024 },
    'gpt3': { p: 175, l: 96, d: 12288, ctx: 2048 },
    'gpt4': { p: 1760, l: 120, d: 16384, ctx: 32000 },
    'gpt4o': { p: 1400, l: 120, d: 16384, ctx: 128000 },
    
    'gemini_pro': { p: 600, l: 104, d: 12288, ctx: 1000000 },
    'gemma_7b': { p: 7, l: 28, d: 3072, ctx: 8192 },
    
    'claude3_opus': { p: 2000, l: 120, d: 16384, ctx: 200000 },
    'claude3_sonnet': { p: 500, l: 96, d: 12288, ctx: 200000 },
    
    'llama2_70b': { p: 70, l: 80, d: 8192, ctx: 4096 },
    'llama3_8b': { p: 8, l: 32, d: 4096, ctx: 8192 },
    'llama3_400b': { p: 405, l: 126, d: 16384, ctx: 8192 },
    
    'grok1': { p: 314, l: 64, d: 6144, ctx: 8192 },
    'qwen1_5_72b': { p: 72, l: 80, d: 8192, ctx: 32000 },
    'deepseek_v2': { p: 236, l: 60, d: 5120, ctx: 128000 },
    'mistral_large': { p: 123, l: 80, d: 8192, ctx: 32000 },
};

// UI Inputs
const elPreset = document.getElementById('preset-ai');
const sParams = document.getElementById('params-slider');
const sLayers = document.getElementById('layers-slider');
const sDim = document.getElementById('dim-slider');
const sCtx = document.getElementById('ctx-slider');

// Value Labels
const vParams = document.getElementById('params-val');
const vLayers = document.getElementById('layers-val');
const vDim = document.getElementById('dim-val');
const vCtx = document.getElementById('ctx-val');

// Viz Elements
const vVizLayers = document.getElementById('viz-layers-count');

// Outputs
const outVramModel = document.getElementById('vram-model');
const outVramKv = document.getElementById('vram-kv');
const outCost = document.getElementById('gpu-cost');

function updateUI() {
    vParams.innerText = sParams.value;
    vLayers.innerText = sLayers.value;
    vDim.innerText = sDim.value;
    vCtx.innerText = sCtx.value;
    vVizLayers.innerText = sLayers.value;

    calculateHardwareReqs();
}

function calculateHardwareReqs() {
    let p = parseFloat(sParams.value); // billions
    let ctx = parseInt(sCtx.value);
    let l = parseInt(sLayers.value);
    let dim = parseInt(sDim.value);

    // FP16 requires 2 bytes per parameter
    let modelVramGB = p * 2;
    
    // KV Cache estimation (simplified formula for attention context memory)
    // Roughly: 2 (K&V) * 2 (bytes FP16) * Layers * Heads(approx dim/128) * HeadDim(128) * Ctx
    // Simplifies to: 4 * Layers * Dim * Ctx bytes
    let kvVramBytes = 4 * l * dim * ctx;
    let kvVramGB = kvVramBytes / (1024 * 1024 * 1024);

    outVramModel.innerText = modelVramGB.toFixed(1) + " GB";
    outVramKv.innerText = kvVramGB.toFixed(1) + " GB";

    let totalVram = modelVramGB + kvVramGB;
    
    // Cost estimation based on H100 80GB nodes (approx $30,000 / ~120,000 PLN per GPU)
    let gpusNeeded = Math.ceil(totalVram / 80);
    if (gpusNeeded === 0) gpusNeeded = 1;
    let costPln = gpusNeeded * 120000;
    
    if (totalVram < 16) {
        outCost.innerText = "Karta domowa (~3 000 PLN)";
    } else if (totalVram < 24) {
        outCost.innerText = "RTX 4090 (~8 500 PLN)";
    } else {
        outCost.innerText = `${gpusNeeded}x H100 (~${costPln.toLocaleString()} PLN)`;
    }

    // New AI Human Metrics
    const elA4 = document.getElementById('real-a4');
    const elTrain = document.getElementById('real-train-cost');
    const elBooks = document.getElementById('real-books');

    if (elA4) {
        // Generation speed is roughly inversely proportional to parameter count. 
        // A single A100 can do ~50 tokens/s on a 7B model. 1 A4 page = 500 words ~ 666 tokens.
        // Assuming we always use the hardware we calculated above (so scaling compute with model size).
        // Let's say baseline 666 tokens takes 5 seconds on optimally distributed hardware.
        let tokens = 666; 
        let speedMult = 1 + (p / 100); // larger models are still slower even with more GPUs due to network overhead
        let timeSecs = (tokens / 100) * speedMult;
        
        if (timeSecs < 1) elA4.innerText = "Ułamek sekundy";
        else if (timeSecs > 60) elA4.innerText = (timeSecs / 60).toFixed(1) + " minut";
        else elA4.innerText = timeSecs.toFixed(1) + " sekund";
    }

    if (elTrain) {
        // Training cost estimation: ~ $2M per 100B params for a decent run, but highly variable.
        // Let's say 1B params costs ~20,000 PLN to train well.
        let trainCostPln = p * 20000; 
        if (trainCostPln >= 1000000000) elTrain.innerText = (trainCostPln / 1000000000).toFixed(1) + " Mld PLN";
        else if (trainCostPln >= 1000000) elTrain.innerText = (trainCostPln / 1000000).toFixed(1) + " Mln PLN";
        else elTrain.innerText = trainCostPln.toLocaleString() + " PLN";
    }

    if (elBooks) {
        // 1B params can roughly compress ~1000 books worth of semantic knowledge.
        let books = p * 1250;
        if (books > 1000000) elBooks.innerText = (books / 1000000).toFixed(1) + " Milionów książek";
        else elBooks.innerText = books.toLocaleString() + " książek";
    }

    const elShelf = document.getElementById('real-shelf');
    const elDataset = document.getElementById('real-dataset');
    const elLives = document.getElementById('real-lives');
    
    if (elShelf) {
        // One book ~ 3cm thick. 1000 books = 30 meters.
        let shelfMeters = (p * 1250) * 0.03;
        if (shelfMeters > 1000) elShelf.innerText = (shelfMeters / 1000).toFixed(1) + " KM (Kilometrów)";
        else elShelf.innerText = shelfMeters.toFixed(0) + " Metrów";
    }

    if (elDataset) {
        // Roughly 20 GB of text per 1B parameters for a well trained model (Chinchilla scaling).
        let textGb = p * 20; 
        if (textGb >= 1000) elDataset.innerText = (textGb / 1000).toFixed(1) + " TB";
        else elDataset.innerText = Math.floor(textGb) + " GB";
    }

    if (elLives) {
        // 1 TB of raw text is roughly 1 Billion pages (assume 1000 words per page).
        // 1 page takes 2 minutes to read. So 1 TB = 2 Billion minutes = 33 Million hours = 3800 years.
        // Assuming 1 human life = 80 years of waking hours = 3800 / 80 = 47 lifetimes per TB.
        let textGb = p * 20; 
        let lifetimes = (textGb / 1000) * 47.5;
        if (lifetimes < 1) elLives.innerText = (lifetimes * 80).toFixed(0) + " Lat czytania";
        else elLives.innerText = Math.floor(lifetimes).toLocaleString() + " Wcieleń";
    }

    const elPower = document.getElementById('real-power');
    const elBrain = document.getElementById('real-brain');
    const elIq = document.getElementById('real-iq');

    if (elPower) {
        // Power per inference. 1 GPU = ~300W under load.
        let wattsRunning = gpusNeeded * 350; 
        // Energy in Joules = Watts * Seconds. Assume average response takes 3 seconds.
        let energyJoules = wattsRunning * 3; 
        if (energyJoules >= 1000) elPower.innerText = (energyJoules / 1000).toFixed(1) + " kJ";
        else elPower.innerText = energyJoules.toFixed(0) + " J";
    }

    if (elBrain) {
        // Human brain has ~100 Trillion synapses. 1 Trillion params = 1000 Billions.
        // So 100 Trillion = 100,000 Billions.
        let percentBrain = (p / 100000) * 100;
        if (percentBrain >= 1) elBrain.innerText = percentBrain.toFixed(2) + " %";
        else if (percentBrain >= 0.01) elBrain.innerText = percentBrain.toFixed(3) + " %";
        else elBrain.innerText = "< 0.01 %";
    }

    if (elIq) {
        // Fun hypothetical calculation. 7B ~ 85 IQ, 70B ~ 100 IQ, 1.7T ~ 125 IQ.
        let calcIq = 60 + (Math.log10(p) * 20);
        if (calcIq > 150) elIq.innerText = "150+ (Geniusz)";
        else if (calcIq < 60) elIq.innerText = "< 60";
        else elIq.innerText = Math.round(calcIq);
    }
}

elPreset.addEventListener('change', (e) => {
    let v = e.target.value;
    if (v !== 'custom' && presets[v]) {
        let p = presets[v];
        sParams.value = p.p;
        sLayers.value = p.l;
        sDim.value = p.d;
        sCtx.value = p.ctx;
        updateUI();
    }
});

[sParams, sLayers, sDim, sCtx].forEach(el => {
    el.addEventListener('input', () => {
        elPreset.value = 'custom';
        updateUI();
    });
});

// Animation Logic
const btnGen = document.getElementById('btn-generate');
const sTok = document.getElementById('stage-tok');
const sEmb = document.getElementById('stage-emb');
const sTrans = document.getElementById('stage-trans');
const sAttn = document.getElementById('stage-attn');
const sFfn = document.getElementById('stage-ffn');
const sOut = document.getElementById('stage-out');

const fTok = document.getElementById('flow-tok');
const fEmb = document.getElementById('flow-emb');
const fTrans = document.getElementById('flow-trans');
const fOut = document.getElementById('flow-out');
const consoleOut = document.getElementById('generation-output');

const sampleWords = ["Sztuczna", "inteligencja", "to", "niezwykła", "technologia", "zmieniająca", "świat", "i", "przyszłość."];
let genInterval = null;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function simulateGeneration() {
    if (btnGen.disabled) return;
    btnGen.disabled = true;
    btnGen.innerText = "Generowanie...";
    
    consoleOut.innerHTML = "> Rozpoczęto inferencję...<br><span style='color:white' id='text-stream'></span>";
    let textStream = document.getElementById('text-stream');

    for (let i = 0; i < sampleWords.length; i++) {
        let word = sampleWords[i];
        
        // 1. Tokenizacja
        sTok.classList.add('active');
        fTok.innerText = `Przetwarzanie poprzednich tokenów + predykcja...`;
        await sleep(200);
        sTok.classList.remove('active');

        // 2. Embedding
        sEmb.classList.add('active');
        fEmb.innerText = `Nakładanie pozycjonowania (wektor dim: ${sDim.value})`;
        await sleep(200);
        sEmb.classList.remove('active');

        // 3. Transformer
        sTrans.classList.add('active');
        
        // Symulacja przechodzenia przez warstwy
        let layers = parseInt(sLayers.value);
        let speed = Math.max(10, 500 / layers); // faster for huge layers
        
        for (let l = 1; l <= Math.min(layers, 10); l++) { // animate max 10 to save time
            let actL = Math.round(l * (layers/Math.min(layers, 10)));
            fTrans.innerText = `Warstwa ${actL}/${layers}: Obliczanie relacji...`;
            sAttn.classList.add('active');
            await sleep(speed);
            sAttn.classList.remove('active');
            
            fTrans.innerText = `Warstwa ${actL}/${layers}: Logika (Wagi FFN)...`;
            sFfn.classList.add('active');
            await sleep(speed);
            sFfn.classList.remove('active');
        }
        sTrans.classList.remove('active');

        // 4. Output
        sOut.classList.add('active');
        fOut.innerText = `Prawdopodobieństwo: "${word}" (92%)`;
        await sleep(200);
        sOut.classList.remove('active');
        
        // Dodaj słowo do konsoli
        textStream.innerHTML += word + " ";
        await sleep(100);
    }

    fTok.innerText = `Zakończono.`;
    fEmb.innerText = `-`;
    fTrans.innerText = `Czekam na zapytanie...`;
    fOut.innerText = `-`;
    
    consoleOut.innerHTML += "<br>> Generowanie zakończone (Token [EOS] wykryty).";
    
    btnGen.innerText = "Symuluj Generowanie (Inference)";
    btnGen.disabled = false;
}

btnGen.addEventListener('click', simulateGeneration);
updateUI();
