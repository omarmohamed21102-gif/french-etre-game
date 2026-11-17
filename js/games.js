// games.js - Game logic for all 5 interactive French learning games

class MiniGames {
    constructor(app) {
        this.app = app;

        // Balloon Pop State
        this.balloonState = {
            active: false,
            score: 0,
            lives: 3,
            streak: 0,
            currentQuestion: null,
            timerId: null,
            spawnInterval: null
        };

        // Memory Match State
        this.memoryState = {
            cards: [],
            flipped: [],
            matchedPairs: 0,
            moves: 0,
            timer: 0,
            timerInterval: null,
            isLocked: false
        };

        // Sentence Builder State
        this.sentenceState = {
            index: 0,
            current: null,
            placedTokens: [],
            availableTokens: []
        };

        // Speed Run State
        this.speedState = {
            active: false,
            timeLeft: 60,
            score: 0,
            streak: 0,
            correctCount: 0,
            totalAnswered: 0,
            interval: null,
            currentQ: null
        };

        // Millionaire Quiz State
        this.millionaireState = {
            level: 0,
            croissants: 0,
            lifelines: {
                fiftyFifty: true,
                hint: true,
                skip: true
            }
        };
    }

    /* ==========================================================================
       GAME 1: LA BULLE MAGIQUE (BALLOON POP)
       ========================================================================== */
    startBalloonGame() {
        const container = document.getElementById('balloon-game-container');
        if (!container) return;

        this.balloonState.active = true;
        this.balloonState.score = 0;
        this.balloonState.lives = 3;
        this.balloonState.streak = 0;

        this.renderBalloonUI();
        this.nextBalloonQuestion();
    }

    renderBalloonUI() {
        const container = document.getElementById('balloon-game-container');
        const lang = this.app.currentLang;

        container.innerHTML = `
            <div class="game-hud">
                <div class="hud-item hearts-box" id="balloon-hearts">❤️❤️❤️</div>
                <div class="hud-item score-box">
                    <span class="hud-label">Score</span>
                    <span class="hud-value" id="balloon-score">0</span>
                </div>
                <div class="hud-item streak-box">
                    <span class="hud-label">Série 🔥</span>
                    <span class="hud-value" id="balloon-streak">0</span>
                </div>
            </div>

            <div class="balloon-prompt-area" id="balloon-prompt">
                <!-- Prompt goes here -->
            </div>

            <div class="balloon-sky" id="balloon-sky">
                <!-- Floating balloons spawn here -->
            </div>
        `;
    }

    nextBalloonQuestion() {
        if (!this.balloonState.active) return;

        const challenges = ETRE_DATA.balloonChallenges;
        const q = challenges[Math.floor(Math.random() * challenges.length)];
        this.balloonState.currentQuestion = q;

        const promptArea = document.getElementById('balloon-prompt');
        const sky = document.getElementById('balloon-sky');
        if (!promptArea || !sky) return;

        sky.innerHTML = ''; // Clear previous balloons

        const lang = this.app.currentLang;
        const subHint = lang === 'ar' ? q.promptAr : q.promptEn;

        promptArea.innerHTML = `
            <div class="prompt-subject">${q.subject} <span class="blank-line">______</span> ?</div>
            <div class="prompt-subhint">${subHint}</div>
            <button class="pronounce-btn mini" onclick="window.soundMgr.speakFrench('${q.subject}')" title="Écouter">🔊</button>
        `;

        // Shuffle options
        const shuffled = [...q.options].sort(() => Math.random() - 0.5);

        // Spawn balloons with slight delays and random horizontal positions
        const colors = ['balloon-blue', 'balloon-red', 'balloon-yellow', 'balloon-purple'];
        shuffled.forEach((opt, idx) => {
            const balloon = document.createElement('div');
            balloon.className = `balloon-bubble ${colors[idx % colors.length]}`;
            balloon.textContent = opt;

            // Positioning
            const leftPercent = 15 + idx * 22 + (Math.random() * 8 - 4);
            balloon.style.left = `${Math.min(80, Math.max(10, leftPercent))}%`;
            balloon.style.animationDelay = `${idx * 0.15}s`;

            balloon.onclick = () => this.handleBalloonChoice(opt, balloon);
            sky.appendChild(balloon);
        });
    }

    handleBalloonChoice(choice, balloonEl) {
        if (!this.balloonState.active) return;
        const q = this.balloonState.currentQuestion;

        if (choice === q.target) {
            // Correct!
            window.soundMgr.playPop();
            window.soundMgr.playSuccess();
            window.soundMgr.speakFrench(`${q.subject} ${choice}`);

            balloonEl.classList.add('pop-animation');
            this.balloonState.streak++;
            const points = 10 + (this.balloonState.streak > 2 ? 10 : 0);
            this.balloonState.score += points;
            this.app.addXP(points);

            document.getElementById('balloon-score').textContent = this.balloonState.score;
            document.getElementById('balloon-streak').textContent = this.balloonState.streak;

            // Confetti small burst
            if (this.balloonState.streak % 3 === 0) {
                window.confetti.fire({ count: 40 });
            }

            setTimeout(() => this.nextBalloonQuestion(), 600);
        } else {
            // Wrong
            window.soundMgr.playError();
            balloonEl.classList.add('shake-animation');
            this.balloonState.streak = 0;
            this.balloonState.lives--;

            document.getElementById('balloon-streak').textContent = 0;
            const hearts = '❤️'.repeat(Math.max(0, this.balloonState.lives)) + '🖤'.repeat(3 - Math.max(0, this.balloonState.lives));
            document.getElementById('balloon-hearts').textContent = hearts;

            if (this.balloonState.lives <= 0) {
                this.endBalloonGame();
            }
        }
    }

    endBalloonGame() {
        this.balloonState.active = false;
        const container = document.getElementById('balloon-game-container');
        if (!container) return;

        window.soundMgr.playVictory();
        window.confetti.fire({ count: 100 });

        const score = this.balloonState.score;
        this.app.updateHighScore('balloon', score);

        container.innerHTML = `
            <div class="game-over-card">
                <div class="game-over-icon">🎈💥</div>
                <h2>Partie terminée !</h2>
                <p>Ton score final : <strong>${score} points</strong></p>
                <div class="game-over-actions">
                    <button class="btn btn-primary" onclick="window.miniGames.startBalloonGame()">🔄 Rejouer</button>
                </div>
            </div>
        `;
    }

    /* ==========================================================================
       GAME 2: JEU DE MÉMOIRE (MEMORY PAIRS MATCH)
       ========================================================================== */
    startMemoryGame() {
        const container = document.getElementById('memory-game-container');
        if (!container) return;

        this.memoryState.cards = [];
        this.memoryState.flipped = [];
        this.memoryState.matchedPairs = 0;
        this.memoryState.moves = 0;
        this.memoryState.timer = 0;
        this.memoryState.isLocked = false;

        clearInterval(this.memoryState.timerInterval);
        this.memoryState.timerInterval = setInterval(() => {
            this.memoryState.timer++;
            const timerEl = document.getElementById('memory-timer');
            if (timerEl) {
                const mins = String(Math.floor(this.memoryState.timer / 60)).padStart(2, '0');
                const secs = String(this.memoryState.timer % 60).padStart(2, '0');
                timerEl.textContent = `${mins}:${secs}`;
            }
        }, 1000);

        // Build deck from pairs
        const pairs = ETRE_DATA.memoryPairs;
        let deck = [];
        pairs.forEach(pair => {
            deck.push({ pairId: pair.id, type: 'subject', text: pair.text1, sound: pair.sound1 });
            deck.push({ pairId: pair.id, type: 'verb', text: pair.text2, sound: pair.sound2 });
        });

        // Shuffle deck
        deck = deck.sort(() => Math.random() - 0.5);
        this.memoryState.cards = deck;

        this.renderMemoryUI();
    }

    renderMemoryUI() {
        const container = document.getElementById('memory-game-container');
        container.innerHTML = `
            <div class="game-hud">
                <div class="hud-item">
                    <span class="hud-label">Coups</span>
                    <span class="hud-value" id="memory-moves">0</span>
                </div>
                <div class="hud-item">
                    <span class="hud-label">Temps</span>
                    <span class="hud-value" id="memory-timer">00:00</span>
                </div>
                <div class="hud-item">
                    <span class="hud-label">Paires</span>
                    <span class="hud-value" id="memory-pairs">0 / 6</span>
                </div>
                <button class="btn btn-secondary btn-sm" onclick="window.miniGames.startMemoryGame()">🔄 Recommencer</button>
            </div>

            <div class="memory-grid" id="memory-grid">
                ${this.memoryState.cards.map((c, idx) => `
                    <div class="memory-card" data-index="${idx}" onclick="window.miniGames.flipCard(${idx})">
                        <div class="memory-card-inner">
                            <div class="memory-card-front">
                                <span class="card-french-symbol">🇫🇷</span>
                            </div>
                            <div class="memory-card-back ${c.type === 'subject' ? 'card-subject' : 'card-verb'}">
                                <span class="card-text">${c.text}</span>
                                <span class="card-badge">${c.type === 'subject' ? 'Pronom' : 'Verbe'}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    flipCard(index) {
        if (this.memoryState.isLocked) return;
        const cardEl = document.querySelector(`.memory-card[data-index="${index}"]`);
        if (!cardEl || cardEl.classList.contains('flipped') || cardEl.classList.contains('matched')) return;

        window.soundMgr.playFlip();
        cardEl.classList.add('flipped');

        const cardData = this.memoryState.cards[index];
        window.soundMgr.speakFrench(cardData.sound);

        this.memoryState.flipped.push({ index, data: cardData, el: cardEl });

        if (this.memoryState.flipped.length === 2) {
            this.memoryState.moves++;
            document.getElementById('memory-moves').textContent = this.memoryState.moves;
            this.checkMemoryMatch();
        }
    }

    checkMemoryMatch() {
        this.memoryState.isLocked = true;
        const [c1, c2] = this.memoryState.flipped;

        if (c1.data.pairId === c2.data.pairId && c1.data.type !== c2.data.type) {
            // Match found!
            setTimeout(() => {
                window.soundMgr.playSuccess();
                c1.el.classList.add('matched');
                c2.el.classList.add('matched');

                // Read full combined phrase
                const subject = c1.data.type === 'subject' ? c1.data.text : c2.data.text;
                const verb = c1.data.type === 'verb' ? c1.data.text : c2.data.text;
                window.soundMgr.speakFrench(`${subject} ${verb}`);

                this.memoryState.matchedPairs++;
                document.getElementById('memory-pairs').textContent = `${this.memoryState.matchedPairs} / 6`;
                this.app.addXP(20);

                this.memoryState.flipped = [];
                this.memoryState.isLocked = false;

                if (this.memoryState.matchedPairs === 6) {
                    this.endMemoryGame();
                }
            }, 500);
        } else {
            // No match
            setTimeout(() => {
                window.soundMgr.playError();
                c1.el.classList.remove('flipped');
                c2.el.classList.remove('flipped');
                this.memoryState.flipped = [];
                this.memoryState.isLocked = false;
            }, 900);
        }
    }

    endMemoryGame() {
        clearInterval(this.memoryState.timerInterval);
        window.soundMgr.playVictory();
        window.confetti.fire({ count: 120 });

        const time = this.memoryState.timer;
        const moves = this.memoryState.moves;
        this.app.addXP(50);

        const container = document.getElementById('memory-game-container');
        container.innerHTML = `
            <div class="game-over-card">
                <div class="game-over-icon">🏆✨</div>
                <h2>Toutes les paires trouvées !</h2>
                <p>Terminé en <strong>${moves} coups</strong> et <strong>${time} secondes</strong> !</p>
                <div class="stars-rating">⭐⭐⭐</div>
                <div class="game-over-actions">
                    <button class="btn btn-primary" onclick="window.miniGames.startMemoryGame()">🔄 Rejouer</button>
                </div>
            </div>
        `;
    }

    /* ==========================================================================
       GAME 3: LE CONSTRUCTEUR DE PHRASES (SENTENCE BUILDER)
       ========================================================================== */
    startSentenceBuilder(index = 0) {
        this.sentenceState.index = index % ETRE_DATA.sentenceBuilder.length;
        const item = ETRE_DATA.sentenceBuilder[this.sentenceState.index];
        this.sentenceState.current = item;
        this.sentenceState.placedTokens = [];
        this.sentenceState.availableTokens = [...item.tokens].sort(() => Math.random() - 0.5);

        this.renderSentenceBuilderUI();
    }

    renderSentenceBuilderUI() {
        const container = document.getElementById('sentence-game-container');
        if (!container) return;

        const item = this.sentenceState.current;
        const lang = this.app.currentLang;
        const trans = lang === 'ar' ? item.translationAr : item.translationEn;

        container.innerHTML = `
            <div class="sentence-builder-card">
                <div class="sentence-progress">Phrase ${this.sentenceState.index + 1} / ${ETRE_DATA.sentenceBuilder.length}</div>
                <div class="sentence-target-translation">
                    <span class="flag-indicator">🎯</span>
                    <strong>${trans}</strong>
                </div>
                <div class="sentence-hint">💡 Indice : ${item.hint}</div>

                <div class="drop-zone" id="sentence-dropzone" onclick="window.miniGames.handleDropzoneClick(event)">
                    <span class="dropzone-placeholder" id="drop-placeholder">Touchez les mots pour composer la phrase...</span>
                </div>

                <div class="token-bank" id="sentence-token-bank">
                    ${this.sentenceState.availableTokens.map((token, i) => `
                        <button class="word-token" data-token="${token}" data-index="${i}" onclick="window.miniGames.placeWordToken(${i})">
                            ${token}
                        </button>
                    `).join('')}
                </div>

                <div class="sentence-actions">
                    <button class="btn btn-secondary" onclick="window.miniGames.resetCurrentSentence()">↺ Réinitialiser</button>
                    <button class="btn btn-primary" id="sentence-verify-btn" onclick="window.miniGames.verifySentence()">Vérifier ✅</button>
                </div>

                <div id="sentence-feedback" class="sentence-feedback"></div>
            </div>
        `;
    }

    placeWordToken(index) {
        const token = this.sentenceState.availableTokens[index];
        if (!token) return;

        window.soundMgr.playFlip();
        window.soundMgr.speakFrench(token);

        this.sentenceState.placedTokens.push(token);
        this.sentenceState.availableTokens.splice(index, 1);

        this.updateSentenceTokensView();
    }

    removePlacedToken(index) {
        const token = this.sentenceState.placedTokens[index];
        if (!token) return;

        window.soundMgr.playFlip();
        this.sentenceState.placedTokens.splice(index, 1);
        this.sentenceState.availableTokens.push(token);

        this.updateSentenceTokensView();
    }

    updateSentenceTokensView() {
        const dropzone = document.getElementById('sentence-dropzone');
        const tokenBank = document.getElementById('sentence-token-bank');

        if (this.sentenceState.placedTokens.length === 0) {
            dropzone.innerHTML = `<span class="dropzone-placeholder">Touchez les mots pour composer la phrase...</span>`;
        } else {
            dropzone.innerHTML = this.sentenceState.placedTokens.map((token, i) => `
                <button class="word-token placed" onclick="window.miniGames.removePlacedToken(${i})">
                    ${token}
                </button>
            `).join('');
        }

        tokenBank.innerHTML = this.sentenceState.availableTokens.map((token, i) => `
            <button class="word-token" onclick="window.miniGames.placeWordToken(${i})">
                ${token}
            </button>
        `).join('');

        // Clear feedback
        const fb = document.getElementById('sentence-feedback');
        if (fb) fb.innerHTML = '';
    }

    resetCurrentSentence() {
        this.sentenceState.placedTokens = [];
        this.sentenceState.availableTokens = [...this.sentenceState.current.tokens].sort(() => Math.random() - 0.5);
        this.updateSentenceTokensView();
    }

    verifySentence() {
        const assembled = this.sentenceState.placedTokens.join(' ').trim();
        const expected = this.sentenceState.current.sentence.trim();
        const fb = document.getElementById('sentence-feedback');

        if (assembled === expected) {
            window.soundMgr.playSuccess();
            window.soundMgr.speakFrench(assembled);
            window.confetti.fire({ count: 60 });
            this.app.addXP(25);

            fb.innerHTML = `
                <div class="feedback-box success">
                    <span>🎉 Parfait ! Phrase correcte !</span>
                    <button class="btn btn-sm btn-primary" onclick="window.miniGames.startSentenceBuilder(${this.sentenceState.index + 1})">
                        Phrase suivante ➡️
                    </button>
                </div>
            `;
        } else {
            window.soundMgr.playError();
            fb.innerHTML = `
                <div class="feedback-box error">
                    <span>❌ Ce n'est pas tout à fait ça. Regarde bien l'ordre des mots et réessaie !</span>
                </div>
            `;
        }
    }

    /* ==========================================================================
       GAME 4: DÉFI CHRONO 60s (SPEED RUN)
       ========================================================================== */
    startSpeedRun() {
        const container = document.getElementById('speed-game-container');
        if (!container) return;

        this.speedState.active = true;
        this.speedState.timeLeft = 60;
        this.speedState.score = 0;
        this.speedState.streak = 0;
        this.speedState.correctCount = 0;
        this.speedState.totalAnswered = 0;

        clearInterval(this.speedState.interval);
        this.renderSpeedRunUI();
        this.nextSpeedQuestion();

        this.speedState.interval = setInterval(() => {
            this.speedState.timeLeft--;
            const timerEl = document.getElementById('speed-timer');
            const barEl = document.getElementById('speed-timer-bar');

            if (timerEl) timerEl.textContent = `${this.speedState.timeLeft}s`;
            if (barEl) barEl.style.width = `${(this.speedState.timeLeft / 60) * 100}%`;

            if (this.speedState.timeLeft <= 5 && this.speedState.timeLeft > 0) {
                window.soundMgr.playTick();
            }

            if (this.speedState.timeLeft <= 0) {
                this.endSpeedRun();
            }
        }, 1000);
    }

    renderSpeedRunUI() {
        const container = document.getElementById('speed-game-container');
        container.innerHTML = `
            <div class="game-hud">
                <div class="hud-item timer-box">
                    <span class="hud-label">Chrono ⏱️</span>
                    <span class="hud-value" id="speed-timer">60s</span>
                </div>
                <div class="hud-item score-box">
                    <span class="hud-label">Score ⚡</span>
                    <span class="hud-value" id="speed-score">0</span>
                </div>
                <div class="hud-item streak-box">
                    <span class="hud-label">Combo 🔥</span>
                    <span class="hud-value" id="speed-streak">0x</span>
                </div>
            </div>
            <div class="speed-progress-wrapper">
                <div class="speed-progress-bar" id="speed-timer-bar" style="width: 100%;"></div>
            </div>

            <div class="speed-question-card" id="speed-card">
                <!-- Speed question loads here -->
            </div>
        `;
    }

    nextSpeedQuestion() {
        if (!this.speedState.active) return;
        const card = document.getElementById('speed-card');
        if (!card) return;

        const bank = ETRE_DATA.quizBank;
        const q = bank[Math.floor(Math.random() * bank.length)];
        this.speedState.currentQ = q;

        card.innerHTML = `
            <div class="speed-question-text">${q.q}</div>
            <div class="speed-choices-grid">
                ${q.choices.map((choice, i) => `
                    <button class="speed-choice-btn" onclick="window.miniGames.answerSpeedQuestion(${i})">
                        ${choice}
                    </button>
                `).join('')}
            </div>
        `;
    }

    answerSpeedQuestion(index) {
        if (!this.speedState.active) return;
        this.speedState.totalAnswered++;
        const q = this.speedState.currentQ;

        if (index === q.correct) {
            window.soundMgr.playSuccess();
            this.speedState.correctCount++;
            this.speedState.streak++;

            const multiplier = Math.min(4, 1 + Math.floor(this.speedState.streak / 3));
            const points = 15 * multiplier;
            this.speedState.score += points;

            document.getElementById('speed-score').textContent = this.speedState.score;
            document.getElementById('speed-streak').textContent = `${multiplier}x`;
            this.nextSpeedQuestion();
        } else {
            window.soundMgr.playError();
            this.speedState.streak = 0;
            document.getElementById('speed-streak').textContent = '0x';
            this.nextSpeedQuestion();
        }
    }

    endSpeedRun() {
        this.speedState.active = false;
        clearInterval(this.speedState.interval);

        window.soundMgr.playVictory();
        window.confetti.fire({ count: 120 });

        const score = this.speedState.score;
        const accuracy = this.speedState.totalAnswered > 0 
            ? Math.round((this.speedState.correctCount / this.speedState.totalAnswered) * 100)
            : 0;

        this.app.addXP(score);
        this.app.updateHighScore('speed', score);

        const container = document.getElementById('speed-game-container');
        container.innerHTML = `
            <div class="game-over-card">
                <div class="game-over-icon">⚡⏱️</div>
                <h2>Temps écoulé !</h2>
                <div class="stat-bubble-group">
                    <div class="stat-bubble">
                        <span class="bubble-num">${score}</span>
                        <span class="bubble-label">Score</span>
                    </div>
                    <div class="stat-bubble">
                        <span class="bubble-num">${this.speedState.correctCount}</span>
                        <span class="bubble-label">Bonnes réponses</span>
                    </div>
                    <div class="stat-bubble">
                        <span class="bubble-num">${accuracy}%</span>
                        <span class="bubble-label">Précision</span>
                    </div>
                </div>
                <div class="game-over-actions">
                    <button class="btn btn-primary" onclick="window.miniGames.startSpeedRun()">⚡ Rejouer (60s)</button>
                </div>
            </div>
        `;
    }

    /* ==========================================================================
       GAME 5: QUI VEUT GAGNER DES CROISSANTS ? (MILLIONAIRE TRIVIA)
       ========================================================================== */
    startMillionaire() {
        this.millionaireState.level = 0;
        this.millionaireState.croissants = 0;
        this.millionaireState.lifelines = {
            fiftyFifty: true,
            hint: true,
            skip: true
        };

        this.renderMillionaireUI();
    }

    renderMillionaireUI() {
        const container = document.getElementById('croissant-game-container');
        if (!container) return;

        const stages = ETRE_DATA.millionaireStages;
        const current = stages[this.millionaireState.level];

        container.innerHTML = `
            <div class="millionaire-wrapper">
                <div class="millionaire-header">
                    <div class="millionaire-title">🥐 Qui Veut Gagner des Croissants ?</div>
                    <div class="millionaire-current-reward">${current.reward}</div>
                </div>

                <div class="millionaire-lifelines">
                    <button class="lifeline-btn ${!this.millionaireState.lifelines.fiftyFifty ? 'used' : ''}" 
                            id="ll-5050" onclick="window.miniGames.useFiftyFifty()">
                        50:50
                    </button>
                    <button class="lifeline-btn ${!this.millionaireState.lifelines.hint ? 'used' : ''}" 
                            id="ll-hint" onclick="window.miniGames.useCroissantHint()">
                        💡 Conseil de M. Nafea
                    </button>
                    <button class="lifeline-btn ${!this.millionaireState.lifelines.skip ? 'used' : ''}" 
                            id="ll-skip" onclick="window.miniGames.useCroissantSkip()">
                        ⏭️ Passer
                    </button>
                </div>

                <div class="millionaire-q-card">
                    <div class="millionaire-q-num">Question ${this.millionaireState.level + 1} / 10</div>
                    <div class="millionaire-q-text">${current.question}</div>
                    <div id="millionaire-hint-box" class="millionaire-hint-box"></div>
                </div>

                <div class="millionaire-choices" id="millionaire-choices">
                    ${current.choices.map((choice, i) => `
                        <button class="m-choice-btn" id="m-choice-${i}" onclick="window.miniGames.answerMillionaire(${i})">
                            <span class="m-letter">${['A', 'B', 'C', 'D'][i]}</span>
                            <span class="m-text">${choice}</span>
                        </button>
                    `).join('')}
                </div>

                <div class="croissant-ladder">
                    ${stages.map((stg, i) => `
                        <div class="ladder-step ${i === this.millionaireState.level ? 'current' : ''} ${i < this.millionaireState.level ? 'passed' : ''}">
                            <span class="step-num">${i + 1}</span>
                            <span class="step-val">${stg.reward}</span>
                        </div>
                    `).reverse().join('')}
                </div>
            </div>
        `;
    }

    useFiftyFifty() {
        if (!this.millionaireState.lifelines.fiftyFifty) return;
        this.millionaireState.lifelines.fiftyFifty = false;
        document.getElementById('ll-5050').classList.add('used');

        const current = ETRE_DATA.millionaireStages[this.millionaireState.level];
        const correct = current.correct;

        const wrongIndices = [0, 1, 2, 3].filter(i => i !== correct);
        // Pick 2 wrong indices to hide
        wrongIndices.sort(() => Math.random() - 0.5);
        const toHide = wrongIndices.slice(0, 2);

        toHide.forEach(idx => {
            const btn = document.getElementById(`m-choice-${idx}`);
            if (btn) {
                btn.style.visibility = 'hidden';
            }
        });

        window.soundMgr.playPop();
    }

    useCroissantHint() {
        if (!this.millionaireState.lifelines.hint) return;
        this.millionaireState.lifelines.hint = false;
        document.getElementById('ll-hint').classList.add('used');

        const current = ETRE_DATA.millionaireStages[this.millionaireState.level];
        const box = document.getElementById('millionaire-hint-box');
        if (box) {
            box.innerHTML = `
                <div class="hint-teacher-header">
                    <img src="img/mohamed_nafea.jpg?v=3" alt="M. Mohamed Nafea" class="hint-teacher-avatar" />
                    <span>💡 <strong>Conseil de M. Mohamed Nafea :</strong></span>
                </div>
                <div class="hint-teacher-body">${current.hint}</div>
            `;
            box.style.display = 'block';
        }
        window.soundMgr.playPop();
        window.soundMgr.speakFrench(current.hint);
    }

    useCroissantSkip() {
        if (!this.millionaireState.lifelines.skip) return;
        this.millionaireState.lifelines.skip = false;
        document.getElementById('ll-skip').classList.add('used');

        window.soundMgr.playSuccess();
        this.millionaireState.level++;
        if (this.millionaireState.level >= ETRE_DATA.millionaireStages.length) {
            this.winMillionaire();
        } else {
            this.renderMillionaireUI();
        }
    }

    answerMillionaire(index) {
        const current = ETRE_DATA.millionaireStages[this.millionaireState.level];
        const btn = document.getElementById(`m-choice-${index}`);

        if (index === current.correct) {
            btn.classList.add('m-correct');
            window.soundMgr.playSuccess();
            this.app.addXP(30);

            setTimeout(() => {
                this.millionaireState.level++;
                if (this.millionaireState.level >= ETRE_DATA.millionaireStages.length) {
                    this.winMillionaire();
                } else {
                    this.renderMillionaireUI();
                }
            }, 1000);
        } else {
            btn.classList.add('m-wrong');
            const correctBtn = document.getElementById(`m-choice-${current.correct}`);
            if (correctBtn) correctBtn.classList.add('m-correct');

            window.soundMgr.playError();

            setTimeout(() => {
                this.endMillionaire();
            }, 1200);
        }
    }

    winMillionaire() {
        window.soundMgr.playVictory();
        window.confetti.fire({ count: 200 });
        this.app.addXP(200);

        const container = document.getElementById('croissant-game-container');
        container.innerHTML = `
            <div class="game-over-card millionaire-win">
                <div class="game-over-icon">🥐👑🥐</div>
                <h2>FÉLICITATIONS !</h2>
                <h3>Tu es le GRAND MAÎTRE du Verbe ÊTRE !</h3>
                <p>Tu as remporté les <strong>1 000 Croissants Dorés</strong> et conquis la langue française !</p>
                <div class="game-over-actions">
                    <button class="btn btn-primary" onclick="window.miniGames.startMillionaire()">🥐 Rejouer</button>
                </div>
            </div>
        `;
    }

    endMillionaire() {
        const container = document.getElementById('croissant-game-container');
        const reached = this.millionaireState.level;
        const stage = ETRE_DATA.millionaireStages[Math.max(0, reached - 1)];

        container.innerHTML = `
            <div class="game-over-card">
                <div class="game-over-icon">🥐😢</div>
                <h2>Dommage !</h2>
                <p>Tu t'es arrêté au palier ${reached + 1} / 10.</p>
                <p>Butin récolté : <strong>${reached > 0 ? stage.reward : '0 Croissant'}</strong></p>
                <div class="game-over-actions">
                    <button class="btn btn-primary" onclick="window.miniGames.startMillionaire()">🔄 Réessayer</button>
                </div>
            </div>
        `;
    }
}
