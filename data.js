// data.js - STRICTLY VERBE ÊTRE AU PRÉSENT ONLY
// (Je suis, Tu es, Il est, Elle est, On est, Nous sommes, Vous êtes, Ils sont, Elles sont)

const ETRE_DATA = {
    // Only Present Tense
    tenses: {
        present: {
            id: 'present',
            name: { fr: 'Présent de l\'indicatif', en: 'Present Tense', ar: 'المضارع (Présent)' },
            desc: {
                fr: 'Toutes les formes du présent : Je suis, Tu es, Il/Elle/On est, Nous sommes, Vous êtes, Ils/Elles sont.',
                en: 'All present tense forms: Je suis, Tu es, Il/Elle/On est, Nous sommes, Vous êtes, Ils/Elles sont.',
                ar: 'جميع تصريفات الحاضر: Je suis, Tu es, Il/Elle/On est, Nous sommes, Vous êtes, Ils/Elles sont.'
            },
            conjugations: [
                {
                    subject: 'Je',
                    verb: 'suis',
                    phonetic: 'ʒə sɥi',
                    en: 'I am',
                    ar: 'أنا أكون',
                    example: 'Je suis prêt.',
                    exampleEn: 'I am ready.',
                    exampleAr: 'أنا جاهز.'
                },
                {
                    subject: 'Tu',
                    verb: 'es',
                    phonetic: 'ty ɛ',
                    en: 'You are (informal)',
                    ar: 'أنتَ / أنتِ تكون',
                    example: 'Tu es très gentil.',
                    exampleEn: 'You are very kind.',
                    exampleAr: 'أنت لطيف جداً.'
                },
                {
                    subject: 'Il',
                    verb: 'est',
                    phonetic: 'il ɛ',
                    en: 'He is',
                    ar: 'هو يكون',
                    example: 'Il est médecin.',
                    exampleEn: 'He is a doctor.',
                    exampleAr: 'هو طبيب.'
                },
                {
                    subject: 'Elle',
                    verb: 'est',
                    phonetic: 'ɛl ɛ',
                    en: 'She is',
                    ar: 'هي تكون',
                    example: 'Elle est contente.',
                    exampleEn: 'She is happy.',
                    exampleAr: 'هي سعيدة.'
                },
                {
                    subject: 'On',
                    verb: 'est',
                    phonetic: 'ɔ̃ n‿ɛ',
                    en: 'One is / We are (casual)',
                    ar: 'نحن نكون (عامية) / المرء يكون',
                    example: 'On est ensemble.',
                    exampleEn: 'We are together.',
                    exampleAr: 'نحن معاً.'
                },
                {
                    subject: 'Nous',
                    verb: 'sommes',
                    phonetic: 'nu sɔm',
                    en: 'We are',
                    ar: 'نحن نكون',
                    example: 'Nous sommes amis.',
                    exampleEn: 'We are friends.',
                    exampleAr: 'نحن أصدقاء.'
                },
                {
                    subject: 'Vous',
                    verb: 'êtes',
                    phonetic: 'vu z‿ɛt',
                    en: 'You are (formal / plural)',
                    ar: 'أنتم تكونون / حضرتك تكون',
                    example: 'Vous êtes bienvenus.',
                    exampleEn: 'You are welcome.',
                    exampleAr: 'أنتم مرحب بكم.'
                },
                {
                    subject: 'Ils',
                    verb: 'sont',
                    phonetic: 'il sɔ̃',
                    en: 'They are (masculine)',
                    ar: 'هم يكونون',
                    example: 'Ils sont à l\'école.',
                    exampleEn: 'They are at school.',
                    exampleAr: 'هم في المدرسة.'
                },
                {
                    subject: 'Elles',
                    verb: 'sont',
                    phonetic: 'ɛl sɔ̃',
                    en: 'They are (feminine)',
                    ar: 'هنّ يكنّ',
                    example: 'Elles sont studieuses.',
                    exampleEn: 'They are studious.',
                    exampleAr: 'هنّ مجتهدات.'
                }
            ]
        }
    },

    // Rules for Verb Être at Present Tense
    usages: [
        {
            title: { fr: '1. Identité & Nationalité au Présent', en: '1. Identity & Nationality (Present)', ar: '1. الهوية والجنسية في الحاضر' },
            examples: [
                { fr: 'Je suis français.', en: 'I am French.', ar: 'أنا فرنسي.' },
                { fr: 'Elle est égyptienne.', en: 'She is Egyptian.', ar: 'هي مصرية.' },
                { fr: 'Ils sont italiens.', en: 'They are Italian.', ar: 'هم إيطاليون.' }
            ],
            icon: '🌍'
        },
        {
            title: { fr: '2. Profession au Présent', en: '2. Profession (Present)', ar: '2. المهنة في الحاضر' },
            note: {
                fr: 'Règle : Pas d\'article ("un/une") devant le métier ! On dit "Je suis ingénieur", "Il est médecin".',
                en: 'Rule: No indefinite article before jobs! Say "Je suis ingénieur", "Il est médecin".',
                ar: 'قاعدة: لا نضع أداة تنكير قبل المهنة! نقول "Je suis ingénieur" وليس "un ingénieur".'
            },
            examples: [
                { fr: 'Il est médecin.', en: 'He is a doctor.', ar: 'هو طبيب.' },
                { fr: 'Nous sommes professeurs.', en: 'We are teachers.', ar: 'نحن معلمون.' },
                { fr: 'Vous êtes pilote.', en: 'You are a pilot.', ar: 'حضرتك طيار.' }
            ],
            icon: '💼'
        },
        {
            title: { fr: '3. Description & Émotions au Présent', en: '3. Description & Feelings (Present)', ar: '3. الوصف والمشاعر في الحاضر' },
            examples: [
                { fr: 'Tu es très intelligent.', en: 'You are very smart.', ar: 'أنت ذكي جداً.' },
                { fr: 'Nous sommes contents.', en: 'We are happy.', ar: 'نحن مسرورون.' },
                { fr: 'Elles sont calmes.', en: 'They are calm.', ar: 'هنّ هادئات.' }
            ],
            icon: '😊'
        },
        {
            title: { fr: '4. Localisation au Présent', en: '4. Location (Present)', ar: '4. المكان والتواجد في الحاضر' },
            examples: [
                { fr: 'Je suis à Paris.', en: 'I am in Paris.', ar: 'أنا في باريس.' },
                { fr: 'Nous sommes à la maison.', en: 'We are at home.', ar: 'نحن في المنزل.' },
                { fr: 'Ils sont au bureau.', en: 'They are at the office.', ar: 'هم في المكتب.' }
            ],
            icon: '📍'
        }
    ],

    // Grammatical Mastery of Verb Être at Present
    pitfalls: [
        {
            topic: { fr: 'La Négation au Présent (ne ... pas)', en: 'Present Negation (ne ... pas)', ar: 'النفي في الحاضر مع فعل ÊTRE' },
            wrong: 'Je pas suis prêt ❌',
            correct: 'Je ne suis pas prêt ✅ / Il n\'est pas là ✅',
            explanation: {
                fr: 'Le verbe Être au présent s\'encadre par "ne" (ou "n\'") et "pas".',
                en: 'At present, place "ne" (or "n\'") before the verb and "pas" after: Je ne suis pas.',
                ar: 'في الحاضر نضع ne قبل الفعل و pas بعده: Je ne suis pas.'
            }
        },
        {
            topic: { fr: 'L\'Interrogation au Présent (Inversion)', en: 'Present Questions (Inversion)', ar: 'السؤال بالتقديم في الحاضر' },
            wrong: 'Es tu prêt ? (sans tiret) ❌',
            correct: 'Es-tu prêt ? ✅ / Êtes-vous d\'accord ? ✅',
            explanation: {
                fr: 'Au présent, reliez toujours la forme du verbe Être et le pronom par un trait d\'union : Es-tu ? Êtes-vous ?',
                en: 'At present, always connect verb form and pronoun with a hyphen: Es-tu ? Êtes-vous ?',
                ar: 'في صيغة السؤال بالحاضر، نصل الفعل بالضمير بشرطة : Es-tu ؟ Êtes-vous ؟'
            }
        },
        {
            topic: { fr: 'L\'Accord de l\'Adjectif au Présent', en: 'Present Adjective Agreement', ar: 'تطابق الصفة في الحاضر' },
            wrong: 'Elles sont grand ❌',
            correct: 'Elles sont grandes ✅ (Féminin + Pluriel : -es)',
            explanation: {
                fr: 'L\'adjectif après le verbe Être au présent s\'accorde en genre (féminin: +e) et nombre (pluriel: +s).',
                en: 'Adjectives after verb Être always match subject gender and number.',
                ar: 'الصفة بعد فعل Être تطابق الفاعل دائماً في التذكير والتأنيث والجمع.'
            }
        }
    ],

    // Game 1: Balloon Pop (Present Tense Only)
    balloonChallenges: [
        { subject: 'Je', target: 'suis', options: ['suis', 'es', 'est', 'sommes'], promptEn: 'I am', promptAr: 'أنا أكون' },
        { subject: 'Tu', target: 'es', options: ['es', 'est', 'suis', 'êtes'], promptEn: 'You are (informal)', promptAr: 'أنتَ تكون' },
        { subject: 'Il', target: 'est', options: ['est', 'es', 'sont', 'sommes'], promptEn: 'He is', promptAr: 'هو يكون' },
        { subject: 'Elle', target: 'est', options: ['est', 'suis', 'es', 'sont'], promptEn: 'She is', promptAr: 'هي تكون' },
        { subject: 'On', target: 'est', options: ['est', 'sommes', 'sont', 'es'], promptEn: 'One is / We are', promptAr: 'نحن نكون / المرء يكون' },
        { subject: 'Nous', target: 'sommes', options: ['sommes', 'êtes', 'sont', 'suis'], promptEn: 'We are', promptAr: 'نحن نكون' },
        { subject: 'Vous', target: 'êtes', options: ['êtes', 'sommes', 'est', 'sont'], promptEn: 'You are (plural / polite)', promptAr: 'أنتم تكونون' },
        { subject: 'Ils', target: 'sont', options: ['sont', 'sommes', 'est', 'êtes'], promptEn: 'They are (m)', promptAr: 'هم يكونون' },
        { subject: 'Elles', target: 'sont', options: ['sont', 'êtes', 'es', 'suis'], promptEn: 'They are (f)', promptAr: 'هنّ يكنّ' },
        { subject: 'Marc et moi (Nous)', target: 'sommes', options: ['sommes', 'êtes', 'sont', 'est'], promptEn: 'Marc and I (We)', promptAr: 'مارك وأنا (نحن)' },
        { subject: 'Sarah et toi (Vous)', target: 'êtes', options: ['êtes', 'sommes', 'sont', 'es'], promptEn: 'Sarah and you (You all)', promptAr: 'سارة وأنت (أنتم)' },
        { subject: 'Les étudiants (Ils)', target: 'sont', options: ['sont', 'est', 'sommes', 'êtes'], promptEn: 'The students (They)', promptAr: 'الطلاب (هم)' },
        { subject: 'Mon amie (Elle)', target: 'est', options: ['est', 'suis', 'sont', 'êtes'], promptEn: 'My friend (She)', promptAr: 'صديقتي (هي)' }
    ],

    // Game 2: Memory Match (Present Tense Only)
    memoryPairs: [
        { id: 1, text1: 'Je', text2: 'suis', sound1: 'Je', sound2: 'suis' },
        { id: 2, text1: 'Tu', text2: 'es', sound1: 'Tu', sound2: 'es' },
        { id: 3, text1: 'Il / Elle', text2: 'est', sound1: 'Il est', sound2: 'est' },
        { id: 4, text1: 'Nous', text2: 'sommes', sound1: 'Nous', sound2: 'sommes' },
        { id: 5, text1: 'Vous', text2: 'êtes', sound1: 'Vous', sound2: 'êtes' },
        { id: 6, text1: 'Ils / Elles', text2: 'sont', sound1: 'Ils sont', sound2: 'sont' }
    ],

    // Game 3: Sentence Builder (Present Tense Only)
    sentenceBuilder: [
        {
            sentence: 'Je suis très heureux d\'être ici .',
            tokens: ['Je', 'suis', 'très', 'heureux', 'd\'être', 'ici', '.'],
            translationEn: 'I am very happy to be here.',
            translationAr: 'أنا سعيد جداً لوجودي هنا.',
            hint: 'Pronom "Je" + verbe être "suis"'
        },
        {
            sentence: 'Tu es un excellent élève .',
            tokens: ['Tu', 'es', 'un', 'excellent', 'élève', '.'],
            translationEn: 'You are an excellent student.',
            translationAr: 'أنت تلميذ ممتاز.',
            hint: 'Pronom "Tu" + verbe être "es"'
        },
        {
            sentence: 'Elle est très gentille avec tout le monde .',
            tokens: ['Elle', 'est', 'très', 'gentille', 'avec', 'tout', 'le', 'monde', '.'],
            translationEn: 'She is very kind to everyone.',
            translationAr: 'هي لطيفة جداً مع الجميع.',
            hint: 'Pronom "Elle" + verbe être "est"'
        },
        {
            sentence: 'Nous sommes tous prêts pour le départ .',
            tokens: ['Nous', 'sommes', 'tous', 'prêts', 'pour', 'le', 'départ', '.'],
            translationEn: 'We are all ready for departure.',
            translationAr: 'نحن جميعاً جاهزون للانطلاق.',
            hint: 'Pronom "Nous" + verbe être "sommes"'
        },
        {
            sentence: 'Vous êtes les bienvenus à Paris .',
            tokens: ['Vous', 'êtes', 'les', 'bienvenus', 'à', 'Paris', '.'],
            translationEn: 'You are welcome in Paris.',
            translationAr: 'أنتم مرحب بكم في باريس.',
            hint: 'Pronom "Vous" + verbe être "êtes"'
        },
        {
            sentence: 'Ils sont au restaurant ce soir .',
            tokens: ['Ils', 'sont', 'au', 'restaurant', 'ce', 'soir', '.'],
            translationEn: 'They are at the restaurant tonight.',
            translationAr: 'هم في المطعم هذا المساء.',
            hint: 'Pronom "Ils" + verbe être "sont"'
        },
        {
            sentence: 'Elles sont toujours très motivées .',
            tokens: ['Elles', 'sont', 'toujours', 'très', 'motivées', '.'],
            translationEn: 'They are always very motivated.',
            translationAr: 'هن دائماً متحمّسات جداً.',
            hint: 'Pronom "Elles" + verbe être "sont"'
        }
    ],

    // Game 4: Rapid Fire Quiz (Present Tense Only)
    quizBank: [
        {
            q: 'Au présent : "Je _____ étudiant."',
            choices: ['suis', 'es', 'est', 'sommes'],
            correct: 0,
            explanation: 'Au présent avec "Je", la forme est "suis" : Je suis étudiant.'
        },
        {
            q: 'Au présent : "Tu _____ très sympathique."',
            choices: ['es', 'est', 'suis', 'êtes'],
            correct: 0,
            explanation: 'Au présent avec "Tu", la forme est "es" : Tu es très sympathique.'
        },
        {
            q: 'Au présent : "Elle _____ à la maison."',
            choices: ['est', 'es', 'suis', 'sont'],
            correct: 0,
            explanation: 'Au présent avec "Elle", la forme est "est" : Elle est à la maison.'
        },
        {
            q: 'Au présent : "Nous _____ prêts."',
            choices: ['sommes', 'êtes', 'sont', 'suis'],
            correct: 0,
            explanation: 'Au présent avec "Nous", la forme est "sommes" : Nous sommes prêts.'
        },
        {
            q: 'Au présent : "Vous _____ formidables."',
            choices: ['êtes', 'sommes', 'est', 'sont'],
            correct: 0,
            explanation: 'Au présent avec "Vous", la forme est "êtes" : Vous êtes formidables.'
        },
        {
            q: 'Au présent : "Ils _____ dans le salon."',
            choices: ['sont', 'sommes', 'êtes', 'est'],
            correct: 0,
            explanation: 'Au présent avec "Ils", la forme est "sont" : Ils sont dans le salon.'
        },
        {
            q: 'Au présent : "Paul et moi (Nous) _____ ravis."',
            choices: ['sommes', 'êtes', 'sont', 'est'],
            correct: 0,
            explanation: 'Paul et moi = Nous -> "sommes".'
        },
        {
            q: 'Au présent : "Thomas et toi (Vous) _____ en avance."',
            choices: ['êtes', 'sommes', 'sont', 'es'],
            correct: 0,
            explanation: 'Thomas et toi = Vous -> "êtes".'
        },
        {
            q: 'Négation au présent : "Je _____ pas fatigué."',
            choices: ['ne suis', 'n\'es', 'ne est', 'ne sont'],
            correct: 0,
            explanation: 'Au présent avec Je : "Je ne suis pas fatigué".'
        },
        {
            q: 'Inversion au présent : "_____ -tu français ?"',
            choices: ['Es', 'Est', 'Suis', 'Êtes'],
            correct: 0,
            explanation: 'Au présent avec Tu en inversion : "Es-tu français ?".'
        }
    ],

    // Game 5: Croissant Millionaire (100% Present Tense of Être Only)
    millionaireStages: [
        {
            reward: '1 Croissant 🥐',
            question: 'Comment dit-on "I am" au présent avec ÊTRE ?',
            choices: ['Je suis', 'Tu es', 'Il est', 'Nous sommes'],
            correct: 0,
            hint: 'Pronom "Je" + verbe "suis".'
        },
        {
            reward: '2 Croissants 🥐🥐',
            question: 'Au présent, complétez : "Tu _____ prêt."',
            choices: ['es', 'suis', 'est', 'sont'],
            correct: 0,
            hint: 'Deux lettres seulement : E-S.'
        },
        {
            reward: '3 Croissants 🥐🥐🥐',
            question: 'Au présent, complétez : "Il _____ professeur."',
            choices: ['est', 'es', 'suis', 'sommes'],
            correct: 0,
            hint: 'Se termine par un T.'
        },
        {
            reward: '5 Croissants 🥖🥐',
            question: 'Au présent, quelle est la forme pour "Nous" ?',
            choices: ['sommes', 'êtes', 'sont', 'suis'],
            correct: 0,
            hint: 'Se termine par "-mes" (Nous sommes).'
        },
        {
            reward: '10 Croissants 🧺',
            question: 'Au présent, quelle est la forme pour "Vous" ?',
            choices: ['êtes', 'sommes', 'est', 'sont'],
            correct: 0,
            hint: 'Porte un accent circonflexe : ê.'
        },
        {
            reward: '20 Croissants 🧁',
            question: 'Au présent, quelle est la forme pour "Ils / Elles" ?',
            choices: ['sont', 'sommes', 'êtes', 'est'],
            correct: 0,
            hint: 'Se termine par "-ont" (Ils sont).'
        },
        {
            reward: '50 Croissants 🍰',
            question: 'Négation au présent : Complétez "Il _____ pas d\'accord."',
            choices: ['n\'est', 'ne est', 'ne suis', 'n\'es'],
            correct: 0,
            hint: '"ne" s\'élide en "n\'" devant la voyelle de "est".'
        },
        {
            reward: '100 Croissants 👑',
            question: 'Accord au présent : "Elles sont _____."',
            choices: ['grandes', 'grand', 'grande', 'grands'],
            correct: 0,
            hint: 'Féminin pluriel : terminaison -es.'
        },
        {
            reward: '250 Croissants 🏆',
            question: 'Au présent, complétez : "Mes amis et moi _____ très heureux."',
            choices: ['sommes', 'êtes', 'sont', 'est'],
            correct: 0,
            hint: 'Mes amis et moi équivaut au pronom "Nous".'
        },
        {
            reward: 'GRAND MAÎTRE DU VERBE ÊTRE (1000 Croissants 🥐✨)',
            question: 'Au présent, quelle question avec inversion est correcte ?',
            choices: ['Êtes-vous prêts ?', 'Es-vous prêts ?', 'Sont-vous prêts ?', 'Est-vous prêts ?'],
            correct: 0,
            hint: 'Avec le pronom "vous" au présent, on utilise "êtes" relié par un trait d\'union.'
        }
    ],

    // UI Translations
    translations: {
        fr: {
            appTitle: 'Verbe ÊTRE au Présent',
            appSubtitle: 'Avec M. Mohamed Nafea — Maîtrisez les 6 formes du présent : suis, es, est, sommes, êtes, sont !',
            navLessons: '📚 Leçons (Présent)',
            navGames: '🎮 Jeux (Présent)',
            navPractice: '✏️ Exercices (Présent)',
            navTrophies: '🏆 Trophées',
            navPortfolio: '👨‍🏫 M. Mohamed Nafea',
            listen: 'Écouter',
            level: 'Niveau',
            xp: 'XP',
            score: 'Score'
        },
        en: {
            appTitle: 'Verb ÊTRE (Present Tense Only)',
            appSubtitle: 'With M. Mohamed Nafea — Master the 6 present forms: suis, es, est, sommes, êtes, sont!',
            navLessons: '📚 Present Lessons',
            navGames: '🎮 Present Games',
            navPractice: '✏️ Present Drills',
            navTrophies: '🏆 Trophies',
            navPortfolio: '👨‍🏫 M. Mohamed Nafea',
            listen: 'Listen',
            level: 'Level',
            xp: 'XP',
            score: 'Score'
        },
        ar: {
            appTitle: 'فعل ÊTRE في المضارع فقط',
            appSubtitle: 'مع مسيو محمد نافع — احترف تصريف فعل الكينونة في الحاضر: suis, es, est, sommes, êtes, sont!',
            navLessons: '📚 دروس المضارع',
            navGames: '🎮 ألعاب المضارع',
            navPractice: '✏️ تدريبات المضارع',
            navTrophies: '🏆 الإنجازات',
            navPortfolio: '👨‍🏫 مسيو محمد نافع',
            listen: 'استمع',
            level: 'المستوى',
            xp: 'النقاط',
            score: 'النتيجة'
        }
    }
};
