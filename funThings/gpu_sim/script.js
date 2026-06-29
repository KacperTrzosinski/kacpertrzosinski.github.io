// funThings/gpu_sim/script.js

document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const sGpus = document.getElementById('gpus-slider');
    const sSms = document.getElementById('sms-slider');
    const sCoreSpeed = document.getElementById('core-speed-slider');
    const sShaders = document.getElementById('shaders-slider');
    const sTensors = document.getElementById('tensors-slider');
    const sRt = document.getElementById('rt-slider');
    const sTmu = document.getElementById('tmu-slider');
    const sVramType = document.getElementById('vram-type');
    const sVramSize = document.getElementById('vram-size-slider');
    const sRop = document.getElementById('rop-slider');
    const sCache = document.getElementById('cache-slider');
    const presetGpu = document.getElementById('preset-gpu');

    const vGpus = document.getElementById('gpus-val');
    const vSms = document.getElementById('sms-val');
    const vCoreSpeed = document.getElementById('core-speed-val');
    const vShaders = document.getElementById('shaders-val');
    const vTensors = document.getElementById('tensors-val');
    const vRt = document.getElementById('rt-val');
    const vTmu = document.getElementById('tmu-val');
    const vVramSize = document.getElementById('vram-size-val');
    const vRop = document.getElementById('rop-val');
    const vCache = document.getElementById('cache-val');

    const uiVramLabel = document.getElementById('ui-vram-label');
    const busLabel = document.getElementById('bus-label');
    const uiL2Size = document.getElementById('ui-l2-size');

    const statThreads = document.getElementById('stat-threads');
    const statBw = document.getElementById('stat-bw');
    const statTensor = document.getElementById('stat-tensor');
    const statRt = document.getElementById('stat-rt');

    const btnStart = document.getElementById('btn-start');
    const btnReset = document.getElementById('btn-reset');

    const smGrid = document.getElementById('sm-grid');
    const ropCluster = document.getElementById('rop-cluster');

    let isRunning = false;
    let clockInterval = null;

    let config = {
        gpus: 1,
        sms: 4,
        speedMHz: 1000,
        shaders: 64,
        tensors: 4,
        rt: 1,
        tmu: 4,
        vramType: 'HBM3',
        vramSizeGB: 24,
        rops: 64,
        l2CacheMB: 16
    };

    const presets = {
        'gtx1060': { gpus: 1, sms: 10, speedMHz: 1500, shaders: 64, tensors: 0, rt: 0, tmu: 4, vramType: 'GDDR5', vramSizeGB: 6, rops: 48, l2CacheMB: 4 },
        'gtx1650': { gpus: 1, sms: 14, speedMHz: 1500, shaders: 64, tensors: 0, rt: 0, tmu: 4, vramType: 'GDDR5', vramSizeGB: 4, rops: 32, l2CacheMB: 4 },
        'rtx2060': { gpus: 1, sms: 30, speedMHz: 1600, shaders: 64, tensors: 4, rt: 1, tmu: 4, vramType: 'GDDR6', vramSizeGB: 6, rops: 48, l2CacheMB: 4 },
        'rtx3060': { gpus: 1, sms: 28, speedMHz: 1700, shaders: 128, tensors: 4, rt: 1, tmu: 4, vramType: 'GDDR6', vramSizeGB: 12, rops: 48, l2CacheMB: 4 },
        'rtx3080': { gpus: 1, sms: 68, speedMHz: 1700, shaders: 128, tensors: 4, rt: 1, tmu: 4, vramType: 'GDDR6X', vramSizeGB: 10, rops: 96, l2CacheMB: 8 },
        'rtx4060': { gpus: 1, sms: 24, speedMHz: 2400, shaders: 128, tensors: 4, rt: 1, tmu: 4, vramType: 'GDDR6', vramSizeGB: 8, rops: 48, l2CacheMB: 24 },
        'rtx4080': { gpus: 1, sms: 76, speedMHz: 2500, shaders: 128, tensors: 4, rt: 2, tmu: 4, vramType: 'GDDR6X', vramSizeGB: 16, rops: 112, l2CacheMB: 64 },
        'rtx4090': { gpus: 1, sms: 128, speedMHz: 2500, shaders: 128, tensors: 4, rt: 2, tmu: 4, vramType: 'GDDR6X', vramSizeGB: 24, rops: 176, l2CacheMB: 72 },
        'rx6600': { gpus: 1, sms: 28, speedMHz: 2400, shaders: 64, tensors: 0, rt: 1, tmu: 4, vramType: 'GDDR6', vramSizeGB: 8, rops: 64, l2CacheMB: 32 },
        'rx7900xtx': { gpus: 1, sms: 96, speedMHz: 2500, shaders: 64, tensors: 2, rt: 1, tmu: 4, vramType: 'GDDR6', vramSizeGB: 24, rops: 192, l2CacheMB: 96 },
        'rtx6000': { gpus: 1, sms: 142, speedMHz: 2500, shaders: 128, tensors: 4, rt: 2, tmu: 4, vramType: 'GDDR6', vramSizeGB: 48, rops: 160, l2CacheMB: 96 },
        'h100': { gpus: 1, sms: 132, speedMHz: 1750, shaders: 128, tensors: 4, rt: 0, tmu: 4, vramType: 'HBM3', vramSizeGB: 80, rops: 160, l2CacheMB: 50 },
        'mi300x': { gpus: 1, sms: 304, speedMHz: 2100, shaders: 64, tensors: 4, rt: 0, tmu: 4, vramType: 'HBM3', vramSizeGB: 192, rops: 256, l2CacheMB: 256 },
        'b200': { gpus: 1, sms: 192, speedMHz: 2200, shaders: 128, tensors: 8, rt: 2, tmu: 4, vramType: 'HBM3', vramSizeGB: 192, rops: 256, l2CacheMB: 256 },
        'dgx_h100': { gpus: 8, sms: 132, speedMHz: 1750, shaders: 128, tensors: 4, rt: 0, tmu: 4, vramType: 'HBM3', vramSizeGB: 80, rops: 160, l2CacheMB: 50 },
        'dgx_b200': { gpus: 8, sms: 192, speedMHz: 2200, shaders: 128, tensors: 8, rt: 2, tmu: 4, vramType: 'HBM3', vramSizeGB: 192, rops: 256, l2CacheMB: 256 },
        'crypto_rig': { gpus: 6, sms: 68, speedMHz: 1400, shaders: 128, tensors: 4, rt: 1, tmu: 4, vramType: 'GDDR6X', vramSizeGB: 10, rops: 96, l2CacheMB: 8 },
        'ps5': { gpus: 1, sms: 36, speedMHz: 2200, shaders: 64, tensors: 0, rt: 1, tmu: 4, vramType: 'GDDR6', vramSizeGB: 16, rops: 64, l2CacheMB: 8 },
        'steamdeck': { gpus: 1, sms: 8, speedMHz: 1600, shaders: 64, tensors: 0, rt: 1, tmu: 4, vramType: 'GDDR5', vramSizeGB: 16, rops: 32, l2CacheMB: 4 },
        'arc_a770': { gpus: 1, sms: 32, speedMHz: 2100, shaders: 128, tensors: 4, rt: 1, tmu: 4, vramType: 'GDDR6', vramSizeGB: 16, rops: 128, l2CacheMB: 16 }
    };

    if (presetGpu) {
        presetGpu.addEventListener('change', (e) => {
            const val = e.target.value;
            if (presets[val]) {
                const p = presets[val];
                sGpus.value = p.gpus;
                sSms.value = p.sms;
                sCoreSpeed.value = p.speedMHz;
                sShaders.value = p.shaders;
                sTensors.value = p.tensors;
                sRt.value = p.rt;
                sTmu.value = p.tmu;
                sVramType.value = p.vramType;
                sVramSize.value = p.vramSizeGB;
                sRop.value = p.rops;
                sCache.value = p.l2CacheMB;
                
                updateConfigFromUI();
                if (isRunning) {
                    stopClock();
                    startClock();
                }
            }
        });
    }

    // Stats
    let totalWarps = 0;
    let totalVramBytes = 0;
    let totalTflops = 0;
    let totalRays = 0;

    let lastTickTime = performance.now();

    function updateConfigFromUI() {
        config.gpus = parseInt(sGpus.value);
        config.sms = parseInt(sSms.value);
        config.speedMHz = parseInt(sCoreSpeed.value);
        config.shaders = parseInt(sShaders.value);
        config.tensors = parseInt(sTensors.value);
        config.rt = parseInt(sRt.value);
        config.tmu = parseInt(sTmu.value);
        config.vramType = sVramType.value;
        config.vramSizeGB = parseInt(sVramSize.value);
        config.rops = parseInt(sRop.value);
        config.l2CacheMB = parseInt(sCache.value);

        vGpus.innerText = config.gpus;
        vSms.innerText = config.sms;
        vCoreSpeed.innerText = config.speedMHz + ' MHz';
        vShaders.innerText = config.shaders;
        vTensors.innerText = config.tensors;
        vRt.innerText = config.rt;
        vTmu.innerText = config.tmu;
        vVramSize.innerText = config.vramSizeGB + ' GB';
        vRop.innerText = config.rops;
        vCache.innerText = config.l2CacheMB + ' MB';

        uiVramLabel.innerText = `${config.vramType} ${config.vramSizeGB}GB` + (config.gpus > 1 ? ` (x${config.gpus})` : '');
        uiL2Size.innerText = config.l2CacheMB + 'MB';
        
        let baseBw = 448;
        if(config.vramType === 'GDDR5') baseBw = 256;
        else if(config.vramType === 'GDDR5X') baseBw = 320;
        else if(config.vramType === 'GDDR6') baseBw = 448;
        else if(config.vramType === 'GDDR6X') baseBw = 760;
        else if(config.vramType === 'HBM2') baseBw = 512;
        else if(config.vramType === 'HBM2E') baseBw = 900;
        else if(config.vramType === 'HBM3') baseBw = 1500;
        
        busLabel.innerText = `Szyna pamięci: ~${baseBw * config.gpus} GB/s`;

        if (!isRunning) setupHardware();
    }

    [sGpus, sSms, sCoreSpeed, sShaders, sTensors, sRt, sTmu, sVramType, sVramSize, sRop, sCache].forEach(el => {
        el.addEventListener('input', () => {
            if(presetGpu) presetGpu.value = 'custom';
            updateConfigFromUI();
            if (isRunning) {
                stopClock();
                startClock();
            }
        });
    });

    function setupHardware() {
        smGrid.innerHTML = '';
        ropCluster.innerHTML = '';

        // Render ROPs (max 32 dots for UI sanity)
        let uiRops = Math.min(config.rops, 32);
        for(let i=0; i<uiRops; i++) {
            let r = document.createElement('div');
            r.className = 'rop-unit';
            r.id = `rop-${i}`;
            ropCluster.appendChild(r);
        }

        // Render SMs (max 8 for UI sanity)
        let uiSms = Math.min(config.sms, 8);
        for(let i=0; i<uiSms; i++) {
            let sm = document.createElement('div');
            sm.className = 'sm-block';
            sm.id = `sm-${i}`;
            
            let cudaDots = '';
            for(let j=0; j<Math.min(config.shaders, 64); j++) cudaDots += `<div class="core-dot dot-cuda" id="cuda-${i}-${j}"></div>`;
            
            let tensorDots = '';
            for(let j=0; j<config.tensors; j++) tensorDots += `<div class="core-dot dot-tensor" id="tensor-${i}-${j}"></div>`;

            let rtDots = '';
            for(let j=0; j<config.rt; j++) rtDots += `<div class="core-dot dot-rt" id="rt-${i}-${j}"></div>`;
            
            let tmuDots = '';
            for(let j=0; j<config.tmu; j++) tmuDots += `<div class="core-dot dot-tmu" id="tmu-${i}-${j}"></div>`;

            sm.innerHTML = `
                <div class="sm-title">Streaming Multiprocessor ${i}</div>
                <div class="sm-warp-scheduler" id="sched-${i}">Warp Scheduler: IDLE</div>
                <div class="sm-cores-grid">
                    <div class="core-section" data-tooltip="Rdzenie CUDA dla tego bloku SM">
                        <div class="core-section-title">CUDA</div>
                        <div class="core-dots">${cudaDots}</div>
                    </div>
                    <div class="core-section" data-tooltip="Rdzenie Tensor">
                        <div class="core-section-title">Tensor</div>
                        <div class="core-dots">${tensorDots}</div>
                    </div>
                    <div class="core-section" data-tooltip="Rdzenie RT">
                        <div class="core-section-title">RT</div>
                        <div class="core-dots">${rtDots}</div>
                    </div>
                    <div class="core-section" data-tooltip="Jednostki TMU">
                        <div class="core-section-title">TMU</div>
                        <div class="core-dots">${tmuDots}</div>
                    </div>
                </div>
            `;
            smGrid.appendChild(sm);
        }

        if (config.sms > 8 || config.gpus > 1) {
            let bgInfo = document.createElement('div');
            bgInfo.style.gridColumn = '1 / -1';
            bgInfo.style.background = 'rgba(16, 185, 129, 0.1)';
            bgInfo.style.border = '1px solid rgba(16, 185, 129, 0.3)';
            bgInfo.style.borderRadius = '8px';
            bgInfo.style.padding = '1rem';
            bgInfo.style.textAlign = 'center';
            
            let totalHidden = (config.sms * config.gpus) - uiSms;
            bgInfo.innerHTML = `
                <h4 style="color: #6ee7b7; margin-bottom: 0.5rem;">+ ${totalHidden} innych bloków SM symulowanych w tle</h4>
                <p style="font-size: 0.8rem; color: #94a3b8;">(Z klastra ${config.gpus} GPU). Pełna moc widoczna w statystykach.</p>
            `;
            smGrid.appendChild(bgInfo);
        }
    }

    btnStart.addEventListener('click', () => {
        if (isRunning) {
            isRunning = false;
            btnStart.innerText = 'Wznów Symulację';
            btnStart.classList.replace('btn-secondary', 'btn-primary');
            stopClock();
        } else {
            isRunning = true;
            btnStart.innerText = 'Wstrzymaj';
            btnStart.classList.replace('btn-primary', 'btn-secondary');
            startClock();
        }
    });

    btnReset.addEventListener('click', () => {
        isRunning = false;
        btnStart.innerText = 'Uruchom Symulację';
        btnStart.classList.replace('btn-secondary', 'btn-primary');
        stopClock();
        totalWarps = 0;
        totalVramBytes = 0;
        totalTflops = 0;
        totalRays = 0;
        updateDashboard(0,0,0,0);
        setupHardware();
    });

    function startClock() {
        if(clockInterval) clearInterval(clockInterval);
        lastTickTime = performance.now();
        // Wizualny tick co 50ms (20fps). Skala wartości zależy od dt.
        clockInterval = setInterval(tick, 50); 
    }

    function stopClock() {
        if(clockInterval) clearInterval(clockInterval);
        clockInterval = null;
    }

    function tick() {
        let now = performance.now();
        let dt = (now - lastTickTime) / 1000; // sekundy
        lastTickTime = now;

        // Obliczenia teoretyczne
        let totalSMs = config.sms * config.gpus;
        
        // Warpy: Załóżmy, że każdy SM uruchamia X warpów na MHz
        let warpsPerSec = totalSMs * (config.speedMHz / 100); 
        totalWarps += warpsPerSec * dt;

        // TFLOPS (FP32) = 2 * CudaCores * MHz * SMs * GPUs / 10^6
        let tflopsPerSec = (2 * config.shaders * config.speedMHz * totalSMs) / 1000000;
        
        // Dodatkowe z Tensora (mocne uproszczenie)
        let tensorFlops = (config.tensors * 64 * config.speedMHz * totalSMs) / 1000000; 
        totalTflops += (tflopsPerSec + tensorFlops) * dt;

        // RT Rays
        let raysPerSec = (config.rt * 200 * config.speedMHz * totalSMs) / 1000000; // MRays
        totalRays += raysPerSec * dt;

        // VRAM Bandwidth
        let baseBw = 448;
        if(config.vramType === 'GDDR5') baseBw = 256;
        else if(config.vramType === 'GDDR5X') baseBw = 320;
        else if(config.vramType === 'GDDR6') baseBw = 448;
        else if(config.vramType === 'GDDR6X') baseBw = 760;
        else if(config.vramType === 'HBM2') baseBw = 512;
        else if(config.vramType === 'HBM2E') baseBw = 900;
        else if(config.vramType === 'HBM3') baseBw = 1500;
        
        let actualBw = baseBw * config.gpus; // GB/s
        totalVramBytes += actualBw * dt;

        // Wizualizacja
        updateUIAnim();
        updateDashboard(actualBw, tflopsPerSec, tensorFlops, raysPerSec);
    }

    function formatFlops(tflops) {
        if (tflops >= 1000000) return (tflops / 1000000).toFixed(2) + ' EFLOPS';
        if (tflops >= 1000) return (tflops / 1000).toFixed(2) + ' PFLOPS';
        return tflops.toFixed(1) + ' TFLOPS';
    }

    function formatBandwidth(gbps) {
        if (gbps >= 1000000) return (gbps / 1000000).toFixed(2) + ' PB/s';
        if (gbps >= 1000) return (gbps / 1000).toFixed(2) + ' TB/s';
        return gbps.toFixed(1) + ' GB/s';
    }

    function formatHashrate(mhps) {
        if (mhps >= 1000000000000) return (mhps / 1000000000000).toFixed(2) + ' EH/s';
        if (mhps >= 1000000000) return (mhps / 1000000000).toFixed(2) + ' PH/s';
        if (mhps >= 1000000) return (mhps / 1000000).toFixed(2) + ' TH/s';
        if (mhps >= 1000) return (mhps / 1000).toFixed(2) + ' GH/s';
        return mhps.toFixed(0) + ' MH/s';
    }

    function updateDashboard(bwPerSec=0, baseTflops=0, tensorTflops=0, raysPerSec=0) {
        let totalFlops = baseTflops + tensorTflops;
        statThreads.innerText = Math.floor(totalWarps).toLocaleString();
        statBw.innerText = formatBandwidth(bwPerSec);
        statTensor.innerText = formatFlops(totalFlops);
        
        if (raysPerSec >= 1000) statRt.innerText = (raysPerSec / 1000).toFixed(2) + ' GRays/s';
        else statRt.innerText = raysPerSec.toFixed(1) + ' MRays/s';

        // Real world metrics bindings
        const elFps = document.getElementById('real-fps');
        const elAi = document.getElementById('real-ai');
        const elGpt = document.getElementById('real-gpt');
        const elCrypto = document.getElementById('real-crypto');
        const elBtc = document.getElementById('real-btc');
        const elPass = document.getElementById('real-pass');
        const elStars = document.getElementById('real-stars');
        const elMed = document.getElementById('real-med');
        const elCam = document.getElementById('real-cam');
        const elFilm = document.getElementById('real-film');
        const elFrac = document.getElementById('real-frac');
        const elWeather = document.getElementById('real-weather');
        const elWhisper = document.getElementById('real-whisper');

        if(elFps) {
            let fps = (totalFlops / 20) * 60;
            if (fps > 1000000) elFps.innerText = (fps / 1000000).toFixed(1) + 'M FPS';
            else elFps.innerText = Math.floor(fps).toLocaleString() + ' FPS';
        }

        if(elAi) {
            let images = tensorTflops / 8;
            if (images > 1000000) elAi.innerText = (images / 1000000).toFixed(1) + 'M obr./s';
            else elAi.innerText = images.toLocaleString(undefined, {maximumFractionDigits: 1}) + ' obr./s';
        }

        if(elGpt) {
            let yearsToTrain = 10000 / (totalFlops + 0.1); 
            if (yearsToTrain > 1000) elGpt.innerText = "> 1000 lat";
            else if (yearsToTrain < 1) elGpt.innerText = (yearsToTrain * 12).toFixed(1) + " mies.";
            else elGpt.innerText = yearsToTrain.toFixed(1) + ' lat';
        }

        if(elCrypto) {
            let mh = (bwPerSec / 936) * 120;
            elCrypto.innerText = formatHashrate(mh);
        }
        
        if (elBtc) {
            // BTC SHA256 is purely computational. Example: 3090 does ~1.5 GH/s (Giga Hashes).
            let btcGh = baseTflops * 0.05;
            if (btcGh > 1000000) elBtc.innerText = (btcGh / 1000000).toFixed(2) + ' PH/s';
            else if (btcGh > 1000) elBtc.innerText = (btcGh / 1000).toFixed(2) + ' TH/s';
            else elBtc.innerText = btcGh.toFixed(1) + ' GH/s';
        }

        if(elPass) {
            // MD5 brute force relies heavily on integer operations (close to baseTflops theoretically).
            // Example: RTX 4090 (~80 TFLOPS) does ~100 Billion MD5/s.
            let md5Bh = baseTflops * 1.25; 
            if (md5Bh > 1000) elPass.innerText = (md5Bh / 1000).toFixed(1) + ' TH/s (Tryliony)';
            else elPass.innerText = md5Bh.toFixed(1) + ' BH/s (Miliardy)';
        }

        if(elStars) {
            // N-Body relies heavily on raw compute TFLOPS. 40 TFLOPS can do ~1M stars real-time.
            let stars = (totalFlops / 40) * 1000000;
            if (stars > 1000000000) elStars.innerText = (stars / 1000000000).toFixed(1) + ' Miliardów';
            else if (stars > 1000000) elStars.innerText = (stars / 1000000).toFixed(1) + ' Milionów';
            else elStars.innerText = Math.floor(stars).toLocaleString();
        }

        if (elMed) {
            // Folding@Home performance (ns/day). A high-end GPU can do hundreds.
            let nsDay = baseTflops * 8;
            elMed.innerText = Math.floor(nsDay).toLocaleString() + ' ns/dzień';
        }

        if (elCam) {
            // Processing 1080p stream for faces takes roughly 0.1 TFLOPS (using efficient models).
            let streams = tensorTflops * 10;
            elCam.innerText = Math.floor(streams).toLocaleString() + ' kamer';
        }

        if(elFilm) {
            let frames = raysPerSec / 5000;
            if (frames < 1) {
                elFilm.innerText = (1 / frames).toFixed(1) + ' s / klatka';
            } else {
                elFilm.innerText = frames.toFixed(1) + ' klatek / s';
            }
        }

        if (elFrac) {
            // Fractals are pure compute. 1 TFLOP = ~1 GIter/s roughly.
            let giter = baseTflops * 1.5;
            if (giter > 1000) elFrac.innerText = (giter / 1000).toFixed(2) + ' TIter/s';
            else elFrac.innerText = giter.toFixed(1) + ' GIter/s';
        }

        if (elWeather) {
            // Weather fluid dynamics. 
            let weatherSqKm = (totalFlops / 5) * 1000;
            elWeather.innerText = Math.floor(weatherSqKm).toLocaleString() + ' km²';
        }

        if (elWhisper) {
            // Whisper transcription. A 4090 can transcribe ~1 hour audio in maybe 30 seconds.
            // So ~2 hours of audio per minute of processing time per ~80 TFLOPS Tensor.
            let hoursPerMin = (tensorTflops / 40);
            elWhisper.innerText = hoursPerMin.toFixed(1) + ' godz/min';
        }
    }

    function updateUIAnim() {
        // Migające kropeczki w SM (tylko widoczne)
        let uiSms = Math.min(config.sms, 8);
        for(let i=0; i<uiSms; i++) {
            let sched = document.getElementById(`sched-${i}`);
            sched.innerText = `Warp Scheduler: ${Math.floor(Math.random()*32)}/32 Active`;

            // Random CUDA dots
            for(let j=0; j<Math.min(config.shaders, 64); j++) {
                let d = document.getElementById(`cuda-${i}-${j}`);
                if(d) d.classList.toggle('active', Math.random() > 0.3);
            }
            // Tensor
            for(let j=0; j<config.tensors; j++) {
                let d = document.getElementById(`tensor-${i}-${j}`);
                if(d) d.classList.toggle('active', Math.random() > 0.6);
            }
            // RT
            for(let j=0; j<config.rt; j++) {
                let d = document.getElementById(`rt-${i}-${j}`);
                if(d) d.classList.toggle('active', Math.random() > 0.8);
            }
            // TMU
            for(let j=0; j<config.tmu; j++) {
                let d = document.getElementById(`tmu-${i}-${j}`);
                if(d) d.classList.toggle('active', Math.random() > 0.5);
            }
        }

        // ROPs
        let uiRops = Math.min(config.rops, 32);
        for(let i=0; i<uiRops; i++) {
            let r = document.getElementById(`rop-${i}`);
            if(r) r.classList.toggle('active', Math.random() > 0.5);
        }
    }

    updateConfigFromUI();
});
