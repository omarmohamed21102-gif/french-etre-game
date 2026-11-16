// app.js - Main Application Controller, Navigation, Practice Drills & State Persistence

class EtreApp {
    constructor() {
        this.currentLang = localStorage.getItem('etre_lang') || 'fr';
        this.currentTab = 'lessons';
        this.activeTense = 'present';
        this.activeGame = 'balloon';

        // User persistent stats
        this.stats = this.loadStats();

        // Practice drill state
        this.practiceState = {
            currentIndex: 0,
            score: 0,
            answers: []
        };
    }

    loadStats() {
        const saved = localStorage.getItem('etre_user_stats');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {}
        }
        return {
            xp: 0,
            level: 1,
            highScores: {
                balloon: 0,
                speed: 0
            },
            trophies: []
        };
    }

    saveStats() {
        localStorage.setItem('etre_user_stats', JSON.stringify(this.stats));
    }

    addXP(amount) {
        this.stats.xp += amount;
        const newLevel = Math.floor(this.stats.xp / 100) + 1;
        if (newLevel > this.stats.level) {
            this.stats.level = newLevel;
            window.soundMgr.playVictory();
            window.confetti.fire({ count: 150 });
            this.showNotification(`🎉 Niveau supérieur ! Tu es maintenant Niveau ${newLevel} !`);
            this.checkTrophies();
        }
        this.saveStats();
        this.updateHeaderStats();
    }

    updateHighScore(game, score) {
        if (!this.stats.highScores[game] || score > this.stats.highScores[game]) {
            this.stats.highScores[game] = score;
            this.saveStats();
            this.checkTrophies();
        }
    }

    checkTrophies() {
        const awards = [];
        if (this.stats.xp >= 50 && !this.stats.trophies.includes('first_step')) {
            this.stats.trophies.push('first_step');
            awards.push('Premier Pas (50 XP)');
        }
        if (this.stats.level >= 3 && !this.stats.trophies.includes('level_3')) {
            this.stats.trophies.push('level_3');
            awards.push('Apprenti Confirmé (Niveau 3)');
        }
        if (this.stats.highScores.speed >= 100 && !this.stats.trophies.includes('speed_master')) {
            this.stats.trophies.push('speed_master');
            awards.push('Éclair du Chrono (100+ au Défi Chrono)');
        }
        if (this.stats.trophies.length >= 4 && !this.stats.trophies.includes('polyglot')) {
            this.stats.trophies.push('polyglot');
            awards.push('Maître du Verbe ÊTRE');
        }

        if (awards.length > 0) {
            this.saveStats();
            awards.forEach(a => this.showNotification(`🏆 Trophée débloqué : ${a} !`));
        }
    }

    showNotification(msg) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 50);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3500);
    }

    init() {
        this.setupEventListeners();
        this.updateHeaderStats();
        this.renderLessons();
        this.updateLanguageUI();
        this.checkTrophies();

        // Initialize mini-games
        window.miniGames = new MiniGames(this);
    }

    setupEventListeners() {
        // Navigation tabs
        document.querySelectorAll('.nav-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Language selector
        const langSelect = document.getElementById('lang-selector');
        if (langSelect) {
            langSelect.value = this.currentLang;
            langSelect.addEventListener('change', (e) => {
                this.setLanguage(e.target.value);
            });
        }

        // Sound toggle
        const soundBtn = document.getElementById('sound-toggle-btn');
        if (soundBtn) {
            soundBtn.addEventListener('click', () => {
                const muted = window.soundMgr.toggleMute();
                soundBtn.textContent = muted ? '🔇' : '🔊';
                soundBtn.title = muted ? 'Son désactivé' : 'Son activé';
            });
        }
    }

    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('etre_lang', lang);
        document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';
        this.updateLanguageUI();
        this.renderLessons();
        if (this.currentTab === 'games') {
            this.switchGame(this.activeGame);
        } else if (this.currentTab === 'practice') {
            this.renderPractice();
        } else if (this.currentTab === 'trophies') {
            this.renderTrophies();
        } else if (this.currentTab === 'portfolio') {
            this.renderPortfolio();
        }
    }

    updateLanguageUI() {
        const t = ETRE_DATA.translations[this.currentLang] || ETRE_DATA.translations.fr;
        document.getElementById('app-main-title').textContent = t.appTitle;
        document.getElementById('app-main-subtitle').textContent = t.appSubtitle;
        document.getElementById('tab-lessons-label').textContent = t.navLessons;
        document.getElementById('tab-games-label').textContent = t.navGames;
        document.getElementById('tab-practice-label').textContent = t.navPractice;
        document.getElementById('tab-trophies-label').textContent = t.navTrophies;
        const portLabel = document.getElementById('tab-portfolio-label');
        if (portLabel) portLabel.textContent = t.navPortfolio || '👨‍🏫 M. Mohamed Nafea';
        this.updateHeaderStats();
    }

    updateHeaderStats() {
        const t = ETRE_DATA.translations[this.currentLang] || ETRE_DATA.translations.fr;
        const levelEl = document.getElementById('user-level-badge');
        const xpEl = document.getElementById('user-xp-bar');
        const xpText = document.getElementById('user-xp-text');

        if (levelEl) levelEl.textContent = `${t.level} ${this.stats.level}`;
        const levelXP = this.stats.xp % 100;
        if (xpEl) xpEl.style.width = `${levelXP}%`;
        if (xpText) xpText.textContent = `${this.stats.xp} ${t.xp}`;
    }

    switchTab(tab) {
        this.currentTab = tab;
        document.querySelectorAll('.nav-tab-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.tab === tab);
        });

        document.querySelectorAll('.tab-content-panel').forEach(panel => {
            panel.classList.toggle('active', panel.id === `tab-${tab}`);
        });

        if (tab === 'lessons') {
            this.renderLessons();
        } else if (tab === 'games') {
            this.switchGame(this.activeGame);
        } else if (tab === 'practice') {
            this.renderPractice();
        } else if (tab === 'trophies') {
            this.renderTrophies();
        } else if (tab === 'portfolio') {
            this.renderPortfolio();
        }
    }

    /* ==========================================================================
       LESSONS & CONJUGATION TABLES
       ========================================================================== */
    renderLessons() {
        const tenseData = ETRE_DATA.tenses[this.activeTense];
        const lang = this.currentLang;

        // Render tense presentation banner (Present Tense Only)
        const tenseSelector = document.getElementById('tense-selector');
        if (tenseSelector) {
            tenseSelector.innerHTML = `
                <div class="single-tense-badge">
                    <span>🇫🇷 Verbe <strong>ÊTRE</strong> au Présent : <em>suis, es, est, sommes, êtes, sont</em></span>
                </div>
            `;
        }

        // Render active tense table
        const tableContainer = document.getElementById('conjugation-cards-container');
        if (tableContainer && tenseData) {
            tableContainer.innerHTML = `
                <div class="tense-description-banner">
                    <div class="tense-desc-text">${tenseData.desc[lang] || tenseData.desc.fr}</div>
                    <button class="listen-all-btn" onclick="window.app.listenAllConjugations('${this.activeTense}')">
                        🔊 Écouter toute la conjugaison
                    </button>
                </div>

                <div class="conjugation-grid">
                    ${tenseData.conjugations.map((item, idx) => {
                        const meaning = lang === 'ar' ? item.ar : item.en;
                        const exMeaning = lang === 'ar' ? item.exampleAr : item.exampleEn;
                        return `
                            <div class="conjugation-card" onclick="window.soundMgr.speakFrench('${item.subject} ${item.verb}')">
                                <div class="card-top">
                                    <span class="subject-tag">${item.subject}</span>
                                    <span class="card-sound-icon">🔊</span>
                                </div>
                                <div class="verb-highlight">${item.verb}</div>
                                ${item.phonetic ? `<div class="phonetic-tag">[${item.phonetic}]</div>` : ''}
                                <div class="meaning-tag">${meaning}</div>
                                ${item.example ? `
                                    <div class="example-box" onclick="event.stopPropagation(); window.soundMgr.speakFrench('${item.example}')">
                                        <div class="example-fr">💬 "${item.example}"</div>
                                        <div class="example-trans">${exMeaning}</div>
                                    </div>
                                ` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        }

        // Render Usages
        const usagesContainer = document.getElementById('rules-usage-container');
        if (usagesContainer) {
            usagesContainer.innerHTML = ETRE_DATA.usages.map(u => `
                <div class="usage-card">
                    <div class="usage-header">
                        <span class="usage-icon">${u.icon}</span>
                        <h3>${u.title[lang] || u.title.fr}</h3>
                    </div>
                    ${u.note ? `<div class="usage-note">${u.note[lang] || u.note.fr}</div>` : ''}
                    <div class="usage-examples">
                        ${u.examples.map(ex => `
                            <div class="usage-item" onclick="window.soundMgr.speakFrench('${ex.fr}')">
                                <span class="usage-fr">🔊 <strong>${ex.fr}</strong></span>
                                <span class="usage-trans">${lang === 'ar' ? ex.ar : ex.en}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('');
        }

        // Render Pitfalls
        const pitfallContainer = document.getElementById('rules-pitfalls-container');
        if (pitfallContainer) {
            pitfallContainer.innerHTML = ETRE_DATA.pitfalls.map(p => `
                <div class="pitfall-card">
                    <div class="pitfall-title">⚠️ ${p.topic[lang] || p.topic.fr}</div>
                    <div class="pitfall-comparison">
                        <div class="wrong-box">${p.wrong}</div>
                        <div class="correct-box">${p.correct}</div>
                    </div>
                    <div class="pitfall-expl">${p.explanation[lang] || p.explanation.fr}</div>
                </div>
            `).join('');
        }
    }

    switchTense(tenseKey) {
        this.activeTense = tenseKey;
        this.renderLessons();
    }

    listenAllConjugations(tenseKey) {
        const tenseData = ETRE_DATA.tenses[tenseKey];
        if (!tenseData) return;

        let delay = 0;
        tenseData.conjugations.forEach((item, index) => {
            setTimeout(() => {
                window.soundMgr.speakFrench(`${item.subject} ${item.verb}`);
            }, delay);
            delay += 1400;
        });
    }

    /* ==========================================================================
       GAMES ARCADE SWITCHER
       ========================================================================== */
    switchGame(gameKey) {
        this.activeGame = gameKey;

        document.querySelectorAll('.game-nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.game === gameKey);
        });

        document.querySelectorAll('.game-screen').forEach(screen => {
            screen.classList.toggle('active', screen.id === `game-screen-${gameKey}`);
        });

        if (gameKey === 'balloon') {
            window.miniGames.startBalloonGame();
        } else if (gameKey === 'memory') {
            window.miniGames.startMemoryGame();
        } else if (gameKey === 'sentence') {
            window.miniGames.startSentenceBuilder(0);
        } else if (gameKey === 'speed') {
            window.miniGames.startSpeedRun();
        } else if (gameKey === 'croissant') {
            window.miniGames.startMillionaire();
        }
    }

    /* ==========================================================================
       PRACTICE DRILLS SECTION
       ========================================================================== */
    renderPractice() {
        const container = document.getElementById('tab-practice');
        if (!container) return;

        const questions = [
            { prompt: "Je (être) ________ très heureux d'être ici.", answer: "suis", hint: "Présent avec Je" },
            { prompt: "Tu (être) ________ en avance aujourd'hui.", answer: "es", hint: "Présent avec Tu" },
            { prompt: "Il (être) ________ professeur de français.", answer: "est", hint: "Présent avec Il" },
            { prompt: "Elle (être) ________ très gentille.", answer: "est", hint: "Présent avec Elle" },
            { prompt: "On (être) ________ tous prêts.", answer: "est", hint: "Présent avec On" },
            { prompt: "Nous (être) ________ à Paris.", answer: "sommes", hint: "Présent avec Nous" },
            { prompt: "Vous (être) ________ les bienvenus chez nous.", answer: "êtes", hint: "Présent avec Vous" },
            { prompt: "Ils (être) ________ très sympathiques.", answer: "sont", hint: "Présent avec Ils" },
            { prompt: "Elles (être) ________ à l'école.", answer: "sont", hint: "Présent avec Elles" }
        ];

        container.innerHTML = `
            <div class="practice-hero">
                <h2>✏️ Entraînement Écrit & Dictée</h2>
                <p>Complète chaque phrase avec la bonne forme conjuguée du verbe <strong>ÊTRE</strong>.</p>
            </div>

            <div class="accent-keyboard-bar">
                <span class="accent-label">Accents français :</span>
                ${['é', 'è', 'ê', 'ë', 'à', 'â', 'î', 'ï', 'ô', 'û', 'ç'].map(acc => `
                    <button class="accent-key" onclick="window.app.insertAccent('${acc}')">${acc}</button>
                `).join('')}
            </div>

            <div class="drills-list">
                ${questions.map((q, idx) => `
                    <div class="drill-item" id="drill-item-${idx}">
                        <div class="drill-q-text">
                            <span class="drill-num">${idx + 1}.</span>
                            <span>${q.prompt.replace('________', `<input type="text" class="drill-input" id="drill-input-${idx}" placeholder="..." autocomplete="off" />`)}</span>
                        </div>
                        <div class="drill-controls">
                            <button class="btn btn-sm btn-secondary" onclick="window.app.checkDrill(${idx}, '${q.answer}')">Vérifier</button>
                            <span class="drill-feedback" id="drill-feedback-${idx}"></span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    insertAccent(char) {
        const activeInput = document.activeElement;
        if (activeInput && activeInput.classList.contains('drill-input')) {
            const start = activeInput.selectionStart;
            const end = activeInput.selectionEnd;
            const text = activeInput.value;
            activeInput.value = text.substring(0, start) + char + text.substring(end);
            activeInput.focus();
            activeInput.selectionStart = activeInput.selectionEnd = start + 1;
        }
    }

    checkDrill(idx, expected) {
        const input = document.getElementById(`drill-input-${idx}`);
        const fb = document.getElementById(`drill-feedback-${idx}`);
        if (!input || !fb) return;

        const val = input.value.trim().toLowerCase();
        if (val === expected.toLowerCase()) {
            input.classList.remove('drill-error');
            input.classList.add('drill-success');
            fb.innerHTML = `✅ Bravo ! Exactement !`;
            window.soundMgr.playSuccess();
            this.addXP(15);
        } else {
            input.classList.remove('drill-success');
            input.classList.add('drill-error');
            fb.innerHTML = `❌ Oups ! La bonne réponse est : <strong>${expected}</strong>`;
            window.soundMgr.playError();
        }
    }

    /* ==========================================================================
       TROPHIES & PROGRESS
       ========================================================================== */
    renderTrophies() {
        const container = document.getElementById('tab-trophies');
        if (!container) return;

        const trophiesList = [
            { id: 'first_step', icon: '🌱', title: 'Premier Pas', desc: 'Atteindre 50 XP dans l\'aventure' },
            { id: 'level_3', icon: '⭐', title: 'Apprenti Confirmé', desc: 'Atteindre le Niveau 3' },
            { id: 'speed_master', icon: '⚡', title: 'Éclair du Chrono', desc: 'Obtenir 100+ points dans le Défi Chrono 60s' },
            { id: 'polyglot', icon: '👑', title: 'Grand Maître ÊTRE', desc: 'Débloquer 4 trophées et maîtriser les conjugaisons' }
        ];

        container.innerHTML = `
            <div class="trophies-header">
                <h2>🏆 Salle des Trophées & Statistiques</h2>
                <p>Débloque tous les succès pour devenir un maître de la langue française !</p>
            </div>

            <div class="stats-overview-grid">
                <div class="stat-card">
                    <div class="stat-icon">🌟</div>
                    <div class="stat-value">${this.stats.xp}</div>
                    <div class="stat-name">Total XP</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">🎖️</div>
                    <div class="stat-value">Niveau ${this.stats.level}</div>
                    <div class="stat-name">Rang Actuel</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">🎈</div>
                    <div class="stat-value">${this.stats.highScores.balloon || 0}</div>
                    <div class="stat-name">Record Bulles</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">⏱️</div>
                    <div class="stat-value">${this.stats.highScores.speed || 0}</div>
                    <div class="stat-name">Record Chrono</div>
                </div>
            </div>

            <div class="trophies-grid">
                ${trophiesList.map(t => {
                    const unlocked = this.stats.trophies.includes(t.id);
                    return `
                        <div class="trophy-card ${unlocked ? 'unlocked' : 'locked'}">
                            <div class="trophy-icon">${t.icon}</div>
                            <div class="trophy-info">
                                <h4>${t.title}</h4>
                                <p>${t.desc}</p>
                                <span class="trophy-status">${unlocked ? '✅ Débloqué' : '🔒 Verrouillé'}</span>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            <div class="reset-data-area">
                <button class="btn btn-secondary btn-sm" onclick="window.app.resetProgress()">
                    🗑️ Réinitialiser la progression
                </button>
            </div>
        `;
    }

    /* ==========================================================================
       TEACHER PORTFOLIO - M. MOHAMED NAFEA
       ========================================================================== */
    renderPortfolio() {
        const container = document.getElementById('tab-portfolio');
        if (!container) return;

        const lang = this.currentLang;
        const welcomeFr = "Bienvenue chers élèves ! J'ai conçu cette plateforme pour vous permettre d'apprendre et de maîtriser le verbe ÊTRE au présent avec plaisir et facilité. Avec une pratique régulière, la réussite est garantie. Bon apprentissage !";
        const welcomeAr = "أهلاً بكم أعزائي الطلاب! صممت لكم هذه المنصة التفاعلية لمساعدتكم على إتقان تصريف فعل الكينونة ÊTRE في الحاضر بكل سهولة ومتعة عبر الشرح والألعاب التفاعلية. تمنياتي لكم بالتفوق الدائم!";
        const welcomeEn = "Welcome dear students! I designed this platform to help you learn and master the French verb ÊTRE at present tense easily and enjoyably. Practice regularly and achieve excellence!";

        const activeQuote = lang === 'ar' ? welcomeAr : (lang === 'en' ? welcomeEn : welcomeFr);

        container.innerHTML = `
            <div class="portfolio-container">
                <!-- Teacher Profile Hero -->
                <div class="teacher-profile-card">
                    <div class="teacher-avatar-frame">
                        <img src="img/mohamed_nafea.jpg?v=3" alt="M. Mohamed Nafea" class="teacher-profile-photo" />
                        <span class="online-indicator" title="Enseignant disponible">🟢</span>
                    </div>

                    <div class="teacher-info-block">
                        <div class="teacher-honorific">مسيو محمد نافع</div>
                        <h2 class="teacher-full-name">M. Mohamed Nafea</h2>
                        <div class="teacher-specialty">Professeur de Langue Française & Concepteur Pédagogique 🇫🇷</div>
                        
                        <div class="teacher-pills">
                            <span class="pill gold">⭐ Pédagogie Interactive</span>
                            <span class="pill blue">🇫🇷 Spécialiste FLE</span>
                            <span class="pill green">🎮 Méthode Gamifiée</span>
                        </div>

                        <div class="teacher-quote-box">
                            <div class="quote-icon">❝</div>
                            <p class="quote-text">${activeQuote}</p>
                            <button class="listen-teacher-btn" onclick="window.app.playTeacherGreeting()">
                                🔊 Écouter le message vocal de M. Mohamed Nafea
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Teaching Highlights Grid -->
                <div class="portfolio-sections-grid">
                    <div class="pillar-card">
                        <div class="pillar-icon">🎯</div>
                        <h3>Vision Pédagogique</h3>
                        <p>Rendre la grammaire française vivante et accessible en combinant rigueur académique et explications simplifiées.</p>
                    </div>

                    <div class="pillar-card">
                        <div class="pillar-icon">🕹️</div>
                        <h3>Gamification & Pratique</h3>
                        <p>5 jeux interactifs créés sur-mesure pour ancrer les 6 formes du présent (<em>suis, es, est, sommes, êtes, sont</em>).</p>
                    </div>

                    <div class="pillar-card">
                        <div class="pillar-icon">🗣️</div>
                        <h3>Immersion Vocale</h3>
                        <p>Entraînement de l'oreille grâce à la synthèse vocale française intégrée sur chaque mot et chaque phrase.</p>
                    </div>

                    <div class="pillar-card">
                        <div class="pillar-icon">🏆</div>
                        <h3>Excellence & Récompenses</h3>
                        <p>Suivi de la progression en temps réel avec des gains d'XP, des niveaux et des confettis festifs.</p>
                    </div>
                </div>

                <!-- Call to action button back to games -->
                <div class="portfolio-cta-banner">
                    <div class="cta-text">
                        <h3>Prêt à vous entraîner avec M. Mohamed Nafea ?</h3>
                        <p>Lancez les jeux du Verbe ÊTRE au présent et tentez de gagner les 1 000 Croissants !</p>
                    </div>
                    <button class="btn btn-primary" onclick="window.app.switchTab('games')">
                        🎮 Commencer les Jeux du Présent
                    </button>
                </div>
            </div>
        `;
    }

    playTeacherGreeting() {
        const greeting = "Bonjour et bienvenue sur ma plateforme d'apprentissage du français ! Je suis Monsieur Mohamed Nafea. Ensemble, nous allons apprendre et maîtriser le verbe être au présent dans la bonne humeur. Bon travail et bon jeu !";
        window.soundMgr.speakFrench(greeting, 0.88);
        window.confetti.fire({ count: 60 });
    }

    resetProgress() {
        if (confirm('Es-tu sûr de vouloir réinitialiser ta progression ?')) {
            localStorage.removeItem('etre_user_stats');
            this.stats = this.loadStats();
            this.updateHeaderStats();
            this.renderTrophies();
            this.showNotification('Progression réinitialisée.');
        }
    }
}

// Global Application Instance
window.addEventListener('DOMContentLoaded', () => {
    window.app = new EtreApp();
    window.app.init();
});
