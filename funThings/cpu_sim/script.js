// funThings/cpu_sim/script.js

document.addEventListener('DOMContentLoaded', () => {
    const coresSlider = document.getElementById('cores-slider');
    const coresVal = document.getElementById('cores-val');
    const speedSlider = document.getElementById('speed-slider');
    const speedVal = document.getElementById('speed-val');
    const cacheSlider = document.getElementById('cache-slider');
    const cacheVal = document.getElementById('cache-val');

    const btnStart = document.getElementById('btn-start');
    const btnReset = document.getElementById('btn-reset');
    
    const ramBlocks = document.getElementById('ram-blocks');
    const cpuCoresContainer = document.getElementById('cpu-cores');
    
    const statCompleted = document.getElementById('stat-completed');
    const statPending = document.getElementById('stat-pending');

    const ISA = {
        INT: ['ADD', 'SUB', 'MUL', 'DIV', 'AND', 'OR', 'XOR'],
        FLOAT: ['FADD', 'FSUB', 'FMUL', 'FDIV'],
        MEM: ['LOAD', 'STOR'],
        BRANCH: ['JMP', 'JZ', 'JNZ', 'CALL', 'RET']
    };

    let isRunning = false;
    let config = {
        cores: 1,
        speedHz: 1,
        cacheSizeKB: 64,
        cacheSize: 4,
        robSize: 4
    };
    
    let ram = []; 
    let completedInstructions = 0;
    let instructionCounter = 0;
    let clockInterval = null;
    
    let systemState = {
        cores: []
    };

    function initUI() {
        const presetCpu = document.getElementById('preset-cpu');

        const presets = {
            'i3_10100': { cores: 4, speedHz: 15, cacheSizeKB: 64, robSize: 8 },
            'i5_13600k': { cores: 14, speedHz: 35, cacheSizeKB: 128, robSize: 12 },
            'i9_14900k': { cores: 24, speedHz: 80, cacheSizeKB: 512, robSize: 32 },
            'r5_7600x': { cores: 6, speedHz: 30, cacheSizeKB: 128, robSize: 12 },
            'r7_7800x3d': { cores: 8, speedHz: 40, cacheSizeKB: 1024, robSize: 16 },
            'r9_7950x': { cores: 16, speedHz: 75, cacheSizeKB: 256, robSize: 24 },
            'tr_7995wx': { cores: 96, speedHz: 60, cacheSizeKB: 1024, robSize: 32 },
            'epyc_9754': { cores: 128, speedHz: 45, cacheSizeKB: 1024, robSize: 32 },
            'xeon_8490h': { cores: 60, speedHz: 50, cacheSizeKB: 1024, robSize: 32 },
            'xeon_w3495x': { cores: 56, speedHz: 55, cacheSizeKB: 1024, robSize: 32 },
            'steamdeck': { cores: 4, speedHz: 10, cacheSizeKB: 64, robSize: 8 },
            'switch': { cores: 4, speedHz: 5, cacheSizeKB: 16, robSize: 4 },
            'rpi4': { cores: 4, speedHz: 5, cacheSizeKB: 32, robSize: 4 },
            'apple_m1': { cores: 8, speedHz: 20, cacheSizeKB: 128, robSize: 16 },
            'apple_m3max': { cores: 16, speedHz: 70, cacheSizeKB: 256, robSize: 32 },
            'frontier': { cores: 192, speedHz: 100, cacheSizeKB: 1024, robSize: 32 },
            'pentium4': { cores: 1, speedHz: 5, cacheSizeKB: 32, robSize: 4 },
            'core2duo': { cores: 2, speedHz: 10, cacheSizeKB: 64, robSize: 8 }
        };

        if (presetCpu) {
            presetCpu.addEventListener('change', (e) => {
                const val = e.target.value;
                if (presets[val]) {
                    coresSlider.value = presets[val].cores;
                    speedSlider.value = presets[val].speedHz;
                    cacheSlider.value = presets[val].cacheSizeKB;
                    
                    config.cores = presets[val].cores;
                    config.speedHz = presets[val].speedHz;
                    config.cacheSizeKB = presets[val].cacheSizeKB;
                    config.cacheSize = Math.min(32, Math.max(4, Math.floor(config.cacheSizeKB / 32)));
                    
                    coresVal.innerText = config.cores;
                    speedVal.innerText = config.speedHz + ' Hz';
                    cacheVal.innerText = config.cacheSizeKB + ' kB';
                    
                    if (!isRunning) setupHardware();
                }
            });
        }

        coresSlider.addEventListener('input', (e) => {
            if(presetCpu) presetCpu.value = 'custom';
            config.cores = parseInt(e.target.value);
            coresVal.innerText = config.cores;
            if (!isRunning) setupHardware();
        });

        speedSlider.addEventListener('input', (e) => {
            if(presetCpu) presetCpu.value = 'custom';
            config.speedHz = parseInt(e.target.value);
            speedVal.innerText = config.speedHz + ' Hz';
            if (isRunning) {
                stopClock();
                startClock();
            }
        });

        cacheSlider.addEventListener('input', (e) => {
            if(presetCpu) presetCpu.value = 'custom';
            config.cacheSizeKB = parseInt(e.target.value);
            config.cacheSize = Math.min(32, Math.max(4, Math.floor(config.cacheSizeKB / 32)));
            cacheVal.innerText = config.cacheSizeKB + ' kB';
            if (!isRunning) setupHardware();
        });

        btnStart.addEventListener('click', () => {
            if (isRunning) pauseSimulation();
            else startSimulation();
        });

        btnReset.addEventListener('click', resetSimulation);

        setupHardware();
        generateRAM(200);
    }

    function setupHardware() {
        systemState.cores = [];
        cpuCoresContainer.innerHTML = '';
        
        for (let c = 0; c < config.cores; c++) {
            let core = {
                id: c,
                cache: [],
                executionUnits: {
                    ALU: { busyFor: 0, inst: null },
                    FPU: { busyFor: 0, inst: null },
                    LSU: { busyFor: 0, inst: null },
                    BRU: { busyFor: 0, inst: null }
                },
                threads: [
                    {
                        id: 0,
                        instructionQueue: [],
                        decodeUnit: null,
                        rob: [],
                        registers: [0, 0, 0, 0],
                        branchPredictor: { state: 'IDLE', mispredictChance: 0.15 }
                    },
                    {
                        id: 1,
                        instructionQueue: [],
                        decodeUnit: null,
                        rob: [],
                        registers: [0, 0, 0, 0],
                        branchPredictor: { state: 'IDLE', mispredictChance: 0.15 }
                    }
                ],
                activeThreadFetch: 0
            };

            systemState.cores.push(core);

            // TWORZENIE DOM TYLKO DLA RDZENIA 0
            if (c === 0) {
                let coreEl = document.createElement('div');
                coreEl.className = 'core';
                coreEl.id = `core-${c}`;
                
                let threadsHTML = '';
                for (let t = 0; t < 2; t++) {
                    threadsHTML += `
                        <div class="thread-frontend-box">
                            <div class="thread-title">Hardware Thread ${t} (SMT)</div>
                            
                            <div class="pipeline-stage" data-tooltip="Kolejka (IFQ) Wątku ${t}">
                                <div class="unit-title">IFQ / Branch Predictor</div>
                                <div class="queue-blocks" id="ifq-${c}-${t}"></div>
                                <div class="bp-status" id="bp-${c}-${t}">PREDICTING</div>
                            </div>

                        <div class="pipeline-stage decode-stage" data-tooltip="Decode / Dispatch Wątku ${t}: Dekoduje instrukcję i przydziela ją do odpowiedniej jednostki wykonawczej.">
                                <div class="unit-title">Decode / Dispatch Unit</div>
                                <div class="dispatch-block" id="decode-${c}-${t}">--</div>
                            </div>

                            <div class="pipeline-stage" data-tooltip="Reorder Buffer (ROB) Wątku ${t}: Zapewnia zapis wyników z powrotem do rejestrów w oryginalnej kolejności.">
                                <div class="unit-title">Reorder Buffer (ROB)</div>
                                <div class="rob-blocks" id="rob-${c}-${t}"></div>
                            </div>

                            <div class="register-file" data-tooltip="Rejestry GPR Wątku ${t}: Lokalna, najszybsza pamięć robocza dla tego wątku.">
                                <div class="unit-title">Register File T${t}</div>
                                <div class="registers-grid" id="regs-${c}-${t}">
                                    <div class="reg">R0: <span id="r0-${c}-${t}">0x00</span></div>
                                    <div class="reg">R1: <span id="r1-${c}-${t}">0x00</span></div>
                                    <div class="reg">R2: <span id="r2-${c}-${t}">0x00</span></div>
                                    <div class="reg">R3: <span id="r3-${c}-${t}">0x00</span></div>
                                </div>
                            </div>
                        </div>
                    `;
                }

                coreEl.innerHTML = `
                    <div class="core-header">
                        <div class="core-title">Core ${c} <span class="core-arch-label">SMT / OoO</span></div>
                        <div class="core-status">IDLE</div>
                    </div>
                    <div class="core-internals">
                        <div class="core-cache" data-tooltip="Shared L1 Cache: Współdzielona pamięć podręczna dla obu wątków.">
                            <div class="unit-title">Shared L1 Cache (${config.cacheSizeKB} kB)</div>
                            <div class="cache-blocks" id="cache-${c}"></div>
                        </div>
                        
                        <div class="smt-threads-container">
                            ${threadsHTML}
                        </div>

                        <div class="execution-units-title">Shared Execution Units (Backend)</div>
                        <div class="execution-units">
                            <div class="exec-unit alu" id="alu-${c}" data-tooltip="ALU: Obliczenia stałoprzecinkowe i logiczne.">
                                <div class="unit-title">ALU</div>
                                <div class="exec-inst" id="alu-inst-${c}">IDLE</div>
                                <div class="exec-progress"><div id="alu-prog-${c}"></div></div>
                            </div>
                            <div class="exec-unit fpu" id="fpu-${c}" data-tooltip="FPU: Zaawansowane obliczenia zmiennoprzecinkowe (najwolniejsza jednostka).">
                                <div class="unit-title">FPU</div>
                                <div class="exec-inst" id="fpu-inst-${c}">IDLE</div>
                                <div class="exec-progress"><div id="fpu-prog-${c}"></div></div>
                            </div>
                            <div class="exec-unit lsu" id="lsu-${c}" data-tooltip="LSU (Load/Store Unit): Odpowiada za operacje odczytu i zapisu do pamięci.">
                                <div class="unit-title">LSU</div>
                                <div class="exec-inst" id="lsu-inst-${c}">IDLE</div>
                                <div class="exec-progress"><div id="lsu-prog-${c}"></div></div>
                            </div>
                            <div class="exec-unit bru" id="bru-${c}" data-tooltip="BRU (Branch Resolution): Weryfikuje czy Branch Predictor poprawnie przewidział skok.">
                                <div class="unit-title">BRU</div>
                                <div class="exec-inst" id="bru-inst-${c}">IDLE</div>
                                <div class="exec-progress"><div id="bru-prog-${c}"></div></div>
                            </div>
                        </div>
                    </div>
                `;
                cpuCoresContainer.appendChild(coreEl);
            }
        }
        
        // Dodaj informacje o rdzeniach w tle
        if (config.cores > 1) {
            let bgInfo = document.createElement('div');
            bgInfo.style.background = 'rgba(168, 85, 247, 0.1)';
            bgInfo.style.border = '1px solid rgba(168, 85, 247, 0.3)';
            bgInfo.style.borderRadius = '8px';
            bgInfo.style.padding = '0.5rem 1rem';
            bgInfo.style.marginTop = '1rem';
            bgInfo.style.display = 'flex';
            bgInfo.style.alignItems = 'center';
            bgInfo.style.gap = '1rem';
            bgInfo.style.justifyContent = 'center';
            bgInfo.innerHTML = `
                <div style="font-size: 1.5rem;">⚙️</div>
                <div>
                    <strong style="color: #d8b4fe; font-size: 0.95rem;">${config.cores - 1} rdzeni pracuje w tle</strong>
                    <span style="color: #94a3b8; font-size: 0.8rem; margin-left: 0.5rem;">(Ukryte dla płynności przeglądarki)</span>
                </div>
            `;
            cpuCoresContainer.appendChild(bgInfo);
        }
    }

    function generateInstruction() {
        instructionCounter++;
        const rnd = Math.random();
        let family = 'INT';
        if (rnd > 0.5) family = 'FLOAT';
        if (rnd > 0.75) family = 'MEM';
        if (rnd > 0.9) family = 'BRANCH';

        const opcode = ISA[family][Math.floor(Math.random() * ISA[family].length)];
        const reg1 = 'R' + Math.floor(Math.random() * 4);
        const reg2 = 'R' + Math.floor(Math.random() * 4);
        
        let text = `${opcode} ${reg1},${reg2}`;
        if (family === 'MEM') text = `${opcode} ${reg1},[ADDR]`;
        if (family === 'BRANCH') text = `${opcode} ADDR`;

        return {
            id: instructionCounter,
            family: family,
            text: text,
            cyclesTotal: family === 'FLOAT' ? 4 : (family === 'MEM' ? 3 : (family === 'BRANCH' ? 2 : 2)),
            targetReg: family === 'BRANCH' ? null : Math.floor(Math.random() * 4),
            status: 'PENDING',
            threadId: null
        };
    }

    function generateRAM(count) {
        for (let i = 0; i < count; i++) ram.push(generateInstruction());
        renderRAM();
        updateStats();
    }

    function renderRAM() {
        ramBlocks.innerHTML = '';
        for (let i = 0; i < Math.min(ram.length, 60); i++) {
            let el = document.createElement('div');
            el.className = `instruction inst-${ram[i].family.toLowerCase()}`;
            el.innerText = ram[i].text;
            ramBlocks.appendChild(el);
        }
    }

    function renderCache(coreId) {
        if (coreId !== 0) return;
        const cacheEl = document.getElementById(`cache-${coreId}`);
        cacheEl.innerHTML = '';
        
        let visibleMax = 8;
        let renderedCount = 0;
        
        systemState.cores[coreId].cache.forEach(inst => {
            if (renderedCount < visibleMax) {
                let el = document.createElement('div');
                el.className = `instruction inst-${inst.family.toLowerCase()} in-cache`;
                el.innerText = inst.text;
                cacheEl.appendChild(el);
            }
            renderedCount++;
        });

        // Zakładamy ~256 instrukcji (po 4 bajty) na każdy 1 kB
        let totalSimulatedCapacity = config.cacheSizeKB * 256;
        let remainingHidden = totalSimulatedCapacity - renderedCount;
        
        if (remainingHidden > 0) {
            let el = document.createElement('div');
            el.style.textAlign = 'center';
            el.style.fontSize = '0.8rem';
            el.style.color = '#94a3b8';
            el.style.marginTop = '0.5rem';
            el.style.fontWeight = 'bold';
            el.style.fontFamily = "'JetBrains Mono', monospace";
            el.innerText = `+ ${remainingHidden.toLocaleString()} instrukcji...`;
            cacheEl.appendChild(el);
        }
    }

    function renderQueue(coreId, threadId) {
        if (coreId !== 0) return;
        const qEl = document.getElementById(`ifq-${coreId}-${threadId}`);
        qEl.innerHTML = '';
        systemState.cores[coreId].threads[threadId].instructionQueue.forEach(inst => {
            let el = document.createElement('div');
            el.className = `instruction inst-${inst.family.toLowerCase()} in-queue`;
            el.innerText = inst.text;
            qEl.appendChild(el);
        });
    }

    function renderROB(coreId, threadId) {
        if (coreId !== 0) return;
        const robEl = document.getElementById(`rob-${coreId}-${threadId}`);
        robEl.innerHTML = '';
        systemState.cores[coreId].threads[threadId].rob.forEach(inst => {
            let el = document.createElement('div');
            let statusClass = inst.status === 'DONE' ? 'rob-done' : 'rob-pending';
            el.className = `instruction inst-${inst.family.toLowerCase()} ${statusClass}`;
            el.innerText = inst.text;
            robEl.appendChild(el);
        });
    }

    function updateRegisters(coreId, threadId) {
        if (coreId !== 0) return;
        const thread = systemState.cores[coreId].threads[threadId];
        for (let i = 0; i < 4; i++) {
            document.getElementById(`r${i}-${coreId}-${threadId}`).innerText = '0x' + thread.registers[i].toString(16).padStart(2, '0').toUpperCase();
        }
    }

    function updateStats() {
        statCompleted.innerText = completedInstructions;
        statPending.innerText = ram.length;

        // Rzeczywiste metryki CPU
        const elFps = document.getElementById('real-fps');
        const elBoot = document.getElementById('real-boot');
        const elCode = document.getElementById('real-code');

        const elZip = document.getElementById('real-zip');
        const elPi = document.getElementById('real-pi');
        const elChess = document.getElementById('real-chess');
        const elFace = document.getElementById('real-face');
        const elLinux = document.getElementById('real-linux');
        const elAes = document.getElementById('real-aes');
        const elStock = document.getElementById('real-stock');

        // Szacowana wydajność w skali sekundy na podstawie Hz i rdzeni
        let instructionsPerSec = config.cores * config.speedHz * 1.5; // OoO & SMT factor

        if(elFps) {
            // Software rendering is extremely slow. E.g. millions of instructions per frame.
            let fps = instructionsPerSec / 50000;
            if(fps < 1) {
                elFps.innerText = (1/fps).toFixed(1) + ' s / klatka';
            } else {
                elFps.innerText = fps.toFixed(1) + ' FPS';
            }
        }

        if(elBoot) {
            // Booting windows takes billions of instructions.
            let bootTime = 1000000 / instructionsPerSec;
            if (bootTime > 3600) elBoot.innerText = (bootTime / 3600).toFixed(1) + ' godzin';
            else if (bootTime > 60) elBoot.innerText = (bootTime / 60).toFixed(1) + ' minut';
            else elBoot.innerText = bootTime.toFixed(1) + ' sekund';
        }

        if(elCode) {
            // ~3 asm instructions per line of code
            let lines = instructionsPerSec / 3;
            elCode.innerText = Math.floor(lines) + ' linii / s';
        }

        if (elZip) {
            // ZIP compression uses cores well and cache. Say 1 MB/s takes 500000 IPS.
            let mbps = instructionsPerSec / 500000 * (config.cacheSizeKB / 64);
            if (mbps < 1) {
                elZip.innerText = mbps.toFixed(2) + ' MB/s';
            } else {
                elZip.innerText = Math.floor(mbps) + ' MB/s';
            }
        }

        if (elPi) {
            // Pi calculation is mostly single threaded. Speed depends on MHz.
            // Say 1 GHz (1000 MHz) takes 10 seconds.
            let piTime = 10000 / config.speedHz;
            if (piTime > 3600) elPi.innerText = (piTime / 3600).toFixed(1) + ' godzin';
            else if (piTime > 60) elPi.innerText = (piTime / 60).toFixed(1) + ' minut';
            else elPi.innerText = piTime.toFixed(1) + ' sekund';
        }

        if (elChess) {
            // Chess (Stockfish) scales beautifully with cores.
            // Say 1 GHz single core = ~500 KN/s.
            let knps = (instructionsPerSec / 2000); 
            if (knps > 1000) elChess.innerText = (knps / 1000).toFixed(1) + ' MN/s';
            else elChess.innerText = Math.floor(knps) + ' KN/s';
        }

        if (elFace) {
            // FaceID / biometrics takes maybe 10M instructions.
            let faceMs = (10000 / instructionsPerSec) * 1000;
            if (faceMs > 1000) elFace.innerText = (faceMs / 1000).toFixed(1) + ' s';
            else elFace.innerText = faceMs.toFixed(1) + ' ms';
        }

        if (elLinux) {
            // Compiling Linux Kernel takes roughly 200B instructions. 
            let linuxSecs = 200000000 / (instructionsPerSec + 0.1); // Scaled down for game scale
            linuxSecs = linuxSecs / 10; // Making it a bit faster for satisfaction
            if (linuxSecs > 3600) elLinux.innerText = (linuxSecs / 3600).toFixed(1) + ' godzin';
            else if (linuxSecs > 60) elLinux.innerText = (linuxSecs / 60).toFixed(1) + ' minut';
            else elLinux.innerText = linuxSecs.toFixed(1) + ' sekund';
        }

        if (elAes) {
            // AES encryption speed (hardware accelerated). 
            let aesGb = (instructionsPerSec * config.cacheSizeKB) / 200000000; 
            if (aesGb < 1) elAes.innerText = (aesGb * 1000).toFixed(0) + ' MB/s';
            else elAes.innerText = aesGb.toFixed(1) + ' GB/s';
        }

        if (elStock) {
            // Monte carlo simulation
            let mc = instructionsPerSec / 15000;
            if (mc > 1000) elStock.innerText = (mc / 1000).toFixed(1) + ' M/s'; // Millions
            else elStock.innerText = Math.floor(mc) + ' k/s'; // Thousands
        }
    }

    function flushPipeline(core, threadId) {
        const thread = core.threads[threadId];
        thread.instructionQueue = [];
        thread.decodeUnit = null;
        thread.rob = []; 
        
        // Logika flusza
        const units = ['ALU', 'FPU', 'LSU', 'BRU'];
        units.forEach(u => {
            if (core.executionUnits[u].inst && core.executionUnits[u].inst.threadId === threadId) {
                core.executionUnits[u].busyFor = 0;
                core.executionUnits[u].inst = null;
                
                // UI flusza
                if (core.id === 0) {
                    document.getElementById(`${u.toLowerCase()}-inst-${core.id}`).innerText = 'IDLE';
                    document.getElementById(`${u.toLowerCase()}-prog-${core.id}`).style.width = '0%';
                    document.getElementById(`${u.toLowerCase()}-${core.id}`).classList.remove('active-unit');
                }
            }
        });
        
        if (core.id === 0) {
            document.getElementById(`decode-${core.id}-${threadId}`).innerText = '--';
            document.getElementById(`bp-${core.id}-${threadId}`).innerText = 'MISPREDICT (FLUSH!)';
            document.getElementById(`bp-${core.id}-${threadId}`).style.color = '#f43f5e';
            
            setTimeout(() => {
                let el = document.getElementById(`bp-${core.id}-${threadId}`);
                if (el) {
                    el.innerText = 'PREDICTING';
                    el.style.color = '';
                }
            }, 1000);
            
            renderQueue(core.id, threadId);
            renderROB(core.id, threadId);
        }
    }

    function startSimulation() {
        if (ram.length === 0) generateRAM(200);
        isRunning = true;
        btnStart.innerText = "Wstrzymaj";
        btnStart.classList.replace('btn-primary', 'btn-secondary');
        coresSlider.disabled = true;
        cacheSlider.disabled = true;
        startClock();
    }

    function pauseSimulation() {
        isRunning = false;
        btnStart.innerText = "Wznów Symulację";
        btnStart.classList.replace('btn-secondary', 'btn-primary');
        stopClock();
    }

    function resetSimulation() {
        pauseSimulation();
        btnStart.innerText = "Uruchom Symulację";
        coresSlider.disabled = false;
        cacheSlider.disabled = false;
        ram = [];
        completedInstructions = 0;
        instructionCounter = 0;
        setupHardware();
        generateRAM(200);
    }

    function startClock() {
        if (clockInterval) clearInterval(clockInterval);
        const tickMs = 1000 / config.speedHz;
        clockInterval = setInterval(tick, tickMs);
    }

    function stopClock() {
        if (clockInterval) clearInterval(clockInterval);
        clockInterval = null;
    }

    // MAIN PIPELINE
    function tick() {
        // Generuj instrukcje dynamicznie, zeby nadazyc za 192 rdzeniami
        let neededInst = config.cores * 4;
        if (ram.length < neededInst) generateRAM(neededInst * 2);
        
        systemState.cores.forEach(core => {
            let isCoreActive = false;
            
            // --- DLA KAŻDEGO WĄTKU (FRONTEND + ROB COMMIT) ---
            core.threads.forEach(thread => {
                // 1. ROB COMMIT (In-Order Commit)
                if (thread.rob.length > 0 && thread.rob[0].status === 'DONE') {
                    let inst = thread.rob.shift(); 
                    if (inst.targetReg !== null) {
                        thread.registers[inst.targetReg] = Math.floor(Math.random() * 255);
                        updateRegisters(core.id, thread.id);
                    }
                    completedInstructions++;
                    isCoreActive = true;
                    renderROB(core.id, thread.id);

                    if (inst.family === 'BRANCH' && inst.mispredicted) {
                        flushPipeline(core, thread.id);
                    }
                }

                // 3. DECODE & DISPATCH
                if (thread.decodeUnit) {
                    let inst = thread.decodeUnit;
                    
                    let targetUnit = 'ALU';
                    if (inst.family === 'FLOAT') targetUnit = 'FPU';
                    else if (inst.family === 'MEM') targetUnit = 'LSU';
                    else if (inst.family === 'BRANCH') targetUnit = 'BRU';

                    if (core.executionUnits[targetUnit].busyFor === 0 && thread.rob.length < config.robSize) {
                        inst.threadId = thread.id;
                        core.executionUnits[targetUnit].inst = inst;
                        core.executionUnits[targetUnit].busyFor = inst.cyclesTotal;
                        thread.rob.push(inst);
                        
                        thread.decodeUnit = null;
                        
                        // UI
                        if (core.id === 0) {
                            document.getElementById(`${targetUnit.toLowerCase()}-inst-${core.id}`).innerText = `[T${thread.id}] ` + inst.text;
                            document.getElementById(`${targetUnit.toLowerCase()}-inst-${core.id}`).className = `exec-inst inst-${inst.family.toLowerCase()}`;
                            document.getElementById(`decode-${core.id}-${thread.id}`).innerText = '--';
                            document.getElementById(`decode-${core.id}-${thread.id}`).className = 'dispatch-block';
                        }
                        
                        renderROB(core.id, thread.id);
                    }
                }

                // 4. FETCH z IFQ do Decode
                if (thread.instructionQueue.length > 0 && !thread.decodeUnit) {
                    thread.decodeUnit = thread.instructionQueue.shift();
                    isCoreActive = true;
                    
                    // UI
                    if (core.id === 0) {
                        const decodeDom = document.getElementById(`decode-${core.id}-${thread.id}`);
                        const bpDom = document.getElementById(`bp-${core.id}-${thread.id}`);
                        
                        decodeDom.innerText = thread.decodeUnit.text;
                        decodeDom.className = `dispatch-block inst-${thread.decodeUnit.family.toLowerCase()}`;
                        
                        if (thread.decodeUnit.family === 'BRANCH') bpDom.innerText = 'PREDICT: TAKEN';
                        else bpDom.innerText = 'IDLE';
                    }
                    
                    renderQueue(core.id, thread.id);
                }
            });

            // 2. WSPÓŁDZIELONE EXECUTION UNITS (BACKEND)
            const units = ['ALU', 'FPU', 'LSU', 'BRU'];
            units.forEach(unitName => {
                let unit = core.executionUnits[unitName];
                if (unit.busyFor > 0) {
                    unit.busyFor--;
                    isCoreActive = true;
                    
                    if (core.id === 0) {
                        let uEl = document.getElementById(`${unitName.toLowerCase()}-${core.id}`);
                        let pEl = document.getElementById(`${unitName.toLowerCase()}-prog-${core.id}`);
                        uEl.classList.add('active-unit');
                        pEl.style.width = `${((unit.inst.cyclesTotal - unit.busyFor) / unit.inst.cyclesTotal) * 100}%`;
                    }

                    if (unit.busyFor === 0) {
                        unit.inst.status = 'DONE';
                        if (unitName === 'BRU') {
                            if (Math.random() < core.threads[unit.inst.threadId].branchPredictor.mispredictChance) {
                                unit.inst.mispredicted = true;
                            }
                        }
                        
                        const threadId = unit.inst.threadId;
                        unit.inst = null;
                        
                        if (core.id === 0) {
                            document.getElementById(`${unitName.toLowerCase()}-inst-${core.id}`).innerText = 'IDLE';
                            document.getElementById(`${unitName.toLowerCase()}-prog-${core.id}`).style.width = '0%';
                            document.getElementById(`${unitName.toLowerCase()}-${core.id}`).classList.remove('active-unit');
                        }
                        
                        renderROB(core.id, threadId);
                    }
                }
            });

            // 5. CACHE FETCHING 
            let threadToFetch = core.threads[core.activeThreadFetch];
            if (threadToFetch.instructionQueue.length < 4 && core.cache.length > 0) {
                threadToFetch.instructionQueue.push(core.cache.shift());
                renderCache(core.id);
                renderQueue(core.id, threadToFetch.id);
                isCoreActive = true;
            }
            core.activeThreadFetch = (core.activeThreadFetch + 1) % 2;

            // 6. MAIN MEMORY TO CACHE
            let logicalCacheLimit = config.cacheSizeKB * 4; // Pojemność tablicy logicznej proporcjonalna do KB
            if (core.cache.length < logicalCacheLimit && ram.length > 0) {
                core.cache.push(ram.shift());
                renderCache(core.id);
            }
            
            if (core.id === 0) {
                const coreDom = document.getElementById(`core-${core.id}`);
                const statusDom = coreDom.querySelector('.core-status');
                if (isCoreActive) {
                    coreDom.classList.add('active');
                    statusDom.innerText = 'ACTIVE';
                } else {
                    coreDom.classList.remove('active');
                    statusDom.innerText = 'IDLE';
                }
            }
        });
        
        renderRAM();
        updateStats();
    }

    initUI();
});
