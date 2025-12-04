// ====================================
        // GESTION DE L'APPLICATION
        // ====================================

        // État global de l'application
        const appState = {
            currentLevel: null,
            currentModule: 1,
            totalPoints: 0,
            levelScores: {}, // Stockage des scores par niveau
            answers: {}, // Réponses de l'utilisateur
            levelStartTime: null,
        };

        // Mappings des niveaux vers les labels
        const levelLabels = {
            elementary: '🎒 Primaire',
            middle: '📚 Collège',
            high: '🚀 Lycée'
        };

        // ====================================
        // SYSTÈME DE QUIZ
        // ====================================

        // Base de données de quiz adaptée par niveau
        const quizzes = {
            elementary: {
                1: [ // Module 1
                    {
                        question: "Qu'est-ce que Linux ?",
                        options: [
                            "Un antivirus",
                            "Un système d'exploitation libre et gratuit",
                            "Une souris d'ordinateur",
                            "Un langage de programmation"
                        ],
                        correct: 1,
                        explanation: "Linux est un système d'exploitation comme Windows, mais gratuit et modifiable par tous !"
                    },
                    {
                        question: "Quel est l'avantage principal de Linux pour les écoles ?",
                        options: [
                            "C'est très compliqué à utiliser",
                            "Ça coûte très cher",
                            "C'est gratuit et on peut réutiliser de vieux ordinateurs",
                            "Ça ne fonctionne que sur les super-ordinateurs"
                        ],
                        correct: 2,
                        explanation: "Linux permet de réutiliser du matériel ancien et c'est gratuit, ce qui économise des millions d'euros aux écoles !"
                    },
                    {
                        question: "Ubuntu est une version de Linux qu'on appelle...",
                        options: [
                            "Un virus",
                            "Une distribution",
                            "Un jeu vidéo",
                            "Un réseau social"
                        ],
                        correct: 1,
                        explanation: "Une distribution Linux est une version adaptée de Linux avec ses propres outils et interface."
                    }
                ],
                2: [ // Module 2
                    {
                        question: "À quoi sert le terminal Linux ?",
                        options: [
                            "À écrire des emails",
                            "À communiquer avec l'ordinateur en tapant du texte",
                            "À jouer à des jeux vidéo",
                            "À regarder des vidéos"
                        ],
                        correct: 1,
                        explanation: "Le terminal permet de donner des ordres à l'ordinateur via du texte, c'est très puissant !"
                    },
                    {
                        question: "Que fait la commande 'ls' ?",
                        options: [
                            "Éteint l'ordinateur",
                            "Liste les fichiers du dossier actuel",
                            "Crée un nouveau fichier",
                            "Ouvre Internet"
                        ],
                        correct: 1,
                        explanation: "'ls' signifie 'list' (liste). Ça affiche tous les fichiers du dossier où vous êtes."
                    },
                    {
                        question: "Que signifie 'pwd' ?",
                        options: [
                            "Password (mot de passe)",
                            "Print Working Directory (Affiche le dossier actuel)",
                            "Pretty Web Design",
                            "Power Windows Download"
                        ],
                        correct: 1,
                        explanation: "'pwd' affiche le chemin complet du dossier où vous êtes actuellement."
                    }
                ],
                3: [ // Module 3
                    {
                        question: "Comment créer un nouveau dossier en Linux ?",
                        options: [
                            "mkdir NomDuDossier",
                            "createfolder NomDuDossier",
                            "newfolder NomDuDossier",
                            "make folder NomDuDossier"
                        ],
                        correct: 0,
                        explanation: "'mkdir' signifie 'make directory'. C'est la commande pour créer un dossier !"
                    },
                    {
                        question: "Que permet la commande 'cd' ?",
                        options: [
                            "Copier des données",
                            "Changer de dossier",
                            "Supprimer des fichiers",
                            "Créer une sauvegarde"
                        ],
                        correct: 1,
                        explanation: "'cd' signifie 'change directory'. Ça vous permet de vous déplacer entre les dossiers !"
                    },
                    {
                        question: "Qu'est-ce que '..' signifie en Linux ?",
                        options: [
                            "Un fichier caché",
                            "Le dossier courant",
                            "Le dossier parent (celui au-dessus)",
                            "Un dossier temporaire"
                        ],
                        correct: 2,
                        explanation: "'..' vous permet de remonter d'un niveau dans l'arborescence des dossiers."
                    }
                ],
                4: [ // Module 4
                    {
                        question: "Que signifie NIRD ?",
                        options: [
                            "Numérique Interne Rapide Digital",
                            "Numérique Inclusif, Responsable et Durable",
                            "Nouvelle Interface de Réseau Distribué",
                            "Numérique Intelligent pour Réseaux Décentralisés"
                        ],
                        correct: 1,
                        explanation: "NIRD c'est le mouvement pour que les écoles se libèrent des Big Tech !"
                    },
                    {
                        question: "Quel est un avantage principal de NIRD pour l'environnement ?",
                        options: [
                            "Ça consomme plus d'électricité",
                            "Ça crée plus de e-déchets",
                            "Ça permet de réutiliser du vieux matériel et donc de réduire la pollution",
                            "Ça n'a aucun impact"
                        ],
                        correct: 2,
                        explanation: "En réutilisant du matériel ancien avec Linux, on réduit les déchets électroniques, c'est écologique !"
                    },
                    {
                        question: "Que remplace LibreOffice dans les écoles NIRD ?",
                        options: [
                            "Google Chrome",
                            "Microsoft Office (Word, Excel, PowerPoint)",
                            "Adobe Photoshop",
                            "Skype"
                        ],
                        correct: 1,
                        explanation: "LibreOffice est gratuit et open-source, c'est le remplaçant idéal de Microsoft Office !"
                    }
                ]
            },
            middle: {
                1: [
                    {
                        question: "Linux est conçu sur le modèle du code...",
                        options: [
                            "Fermé et propriétaire",
                            "Ouvert et collaboratif (open-source)",
                            "Crypté et sécurisé",
                            "Breveté par Microsoft"
                        ],
                        correct: 1,
                        explanation: "Linux est open-source : tout le monde peut voir et améliorer le code !"
                    },
                    {
                        question: "Quel est le noyau d'un système d'exploitation ?",
                        options: [
                            "Le navigateur web",
                            "Le cœur du système qui gère les ressources",
                            "L'interface graphique",
                            "Le stockage des données"
                        ],
                        correct: 1,
                        explanation: "Le noyau (kernel) est la partie centrale qui gère le processeur, la mémoire et les périphériques."
                    },
                    {
                        question: "Pourquoi les serveurs du monde utilisent massivement Linux ?",
                        options: [
                            "C'est imposé par la loi",
                            "Parce qu'il est gratuit, stable et fiable",
                            "Parce qu'il consomme plus d'énergie",
                            "Parce que c'est obligatoire"
                        ],
                        correct: 1,
                        explanation: "Linux est utilisé par 96% des serveurs cloud car il est fiable, sécurisé et gratuit !"
                    }
                ],
                2: [
                    {
                        question: "Quel est le rôle d'un shell (interpréteur de commandes) ?",
                        options: [
                            "Protéger l'ordinateur des hackers",
                            "Convertir les commandes texte en instructions pour le noyau",
                            "Télécharger des fichiers",
                            "Créer des sauvegardes"
                        ],
                        correct: 1,
                        explanation: "Le shell traduit vos commandes en langage que le système d'exploitation comprend."
                    },
                    {
                        question: "Quelle est la différence entre 'sudo' et 'su' ?",
                        options: [
                            "Aucune différence",
                            "'sudo' exécute une commande en admin temporairement, 'su' bascule complètement en root",
                            "C'est l'inverse",
                            "Ce sont des termes pour du jeu vidéo"
                        ],
                        correct: 1,
                        explanation: "'sudo' (Super User DO) c'est plus sûr que 'su' car les droits admin sont temporaires."
                    },
                    {
                        question: "Que fait 'find' en Linux ?",
                        options: [
                            "Répare les fichiers corrompus",
                            "Cherche des fichiers ou dossiers selon des critères",
                            "Crée des fichiers",
                            "Supprime les données inutiles"
                        ],
                        correct: 1,
                        explanation: "'find' est une commande puissante pour localiser des fichiers dans l'arborescence."
                    }
                ],
                3: [
                    {
                        question: "Qu'est-ce qu'un inode en Linux ?",
                        options: [
                            "Un type de malware",
                            "Une structure de données contenant les infos d'un fichier",
                            "Un disque dur externe",
                            "Un protocole de réseau"
                        ],
                        correct: 1,
                        explanation: "Un inode stocke les métadonnées (permissions, propriétaire, dates) d'un fichier."
                    },
                    {
                        question: "Quel est l'avantage du système de permissions UNIX ?",
                        options: [
                            "Il ralentit l'ordinateur",
                            "Il permet de contrôler qui peut accéder à chaque fichier",
                            "Il augmente la taille des fichiers",
                            "Il n'y a aucun avantage"
                        ],
                        correct: 1,
                        explanation: "Les permissions (rwx) permettent de sécuriser les données et gérer les accès."
                    },
                    {
                        question: "Que signifie '755' dans 'chmod 755 fichier' ?",
                        options: [
                            "Un mot de passe",
                            "L'année 755",
                            "Propriétaire:lecture+écriture+exécution, Groupe:lecture+exécution, Autres:lecture+exécution",
                            "La version du système"
                        ],
                        correct: 2,
                        explanation: "755 en octal = rwxr-xr-x. C'est une permission classique pour les scripts exécutables."
                    }
                ],
                4: [
                    {
                        question: "Quel est le vrai bénéfice de NIRD pour l'autonomie scolaire ?",
                        options: [
                            "Acheter plus de matériel",
                            "Dépendre des Big Tech",
                            "Reprendre le contrôle des données et de l'infrastructure informatique",
                            "Augmenter les dépenses informatiques"
                        ],
                        correct: 2,
                        explanation: "NIRD permet aux écoles d'être autonomes et de contrôler leurs données au lieu de les envoyer à des serveurs externes."
                    },
                    {
                        question: "Pourquoi la fin du support Windows 10 pose-t-elle un problème économique pour les écoles ?",
                        options: [
                            "Il n'y a aucun problème",
                            "Les écoles doivent acheter de nouveaux ordinateurs et des licences coûteuses",
                            "C'est une opportunity pour rester sur Windows 10",
                            "Microsoft baisse les prix"
                        ],
                        correct: 1,
                        explanation: "C'est l'obsolescence programmée : Microsoft force les écoles à acheter du nouveau matériel coûteux."
                    },
                    {
                        question: "Comment NIRD représente-t-il 'David contre Goliath' ?",
                        options: [
                            "Les écoles sont Goliath",
                            "Les écoles (David) utilisent Linux contre les Big Tech (Goliath)",
                            "C'est juste une histoire",
                            "Ça n'a pas de rapport"
                        ],
                        correct: 1,
                        explanation: "NIRD c'est les petites écoles qui s'unissent pour résister aux géants technologiques !"
                    }
                ]
            },
            high: {
                1: [
                    {
                        question: "Expliquez la relation entre le noyau Linux (kernel) et les systèmes de fichiers (ext4, btrfs) ?",
                        options: [
                            "Le noyau est inutile pour les fichiers",
                            "Le noyau abstrait l'accès au système de fichiers via une API VFS",
                            "Le système de fichiers remplace le noyau",
                            "Il n'y a pas de relation"
                        ],
                        correct: 1,
                        explanation: "Linux utilise une couche d'abstraction VFS (Virtual File System) qui permet au noyau de gérer différents FS."
                    },
                    {
                        question: "Quelle est l'importance de la philosophie Unix 'Do One Thing Well' pour NIRD ?",
                        options: [
                            "C'est un concept dépassé",
                            "Elle encourage la modularité et la composabilité, réduisant la complexité",
                            "Elle n'a aucun lien avec NIRD",
                            "Elle favorise les gros logiciels monolithiques"
                        ],
                        correct: 1,
                        explanation: "La philosophie Unix encourage des outils spécialisés et composables, idéale pour l'autonomie scolaire."
                    },
                    {
                        question: "Comment les conteneurs Docker et Linux cgroups réduisent-ils les dépendances ?",
                        options: [
                            "Ils augmentent les dépendances",
                            "Ils isolent les applications, éliminant les conflits de dépendances",
                            "Ils n'ont aucun impact",
                            "Ils ralentissent le système"
                        ],
                        correct: 1,
                        explanation: "Les conteneurs encapsulent les dépendances, rendant les apps portables et réduisant la complexité système."
                    }
                ],
                2: [
                    {
                        question: "Expliquez le processus de gestion de la mémoire virtuelle en Linux ?",
                        options: [
                            "C'est un concept théorique sans utilité",
                            "RAM + swap créent un espace d'adressage virtuel géré par le noyau",
                            "La mémoire virtuelle remplace la RAM",
                            "C'est une fonctionnalité uniquement pour les serveurs"
                        ],
                        correct: 1,
                        explanation: "La mémoire virtuelle (paging/swapping) permet aux processus d'utiliser plus que la RAM physique disponible."
                    },
                    {
                        question: "Qu'est-ce qu'un processus zombie et comment l'éviter en programmation système ?",
                        options: [
                            "Ce n'est qu'une légende urbaine",
                            "Un processus dont le parent n'a pas appelé wait(), évitable avec signal handlers",
                            "Un processus qui consomme trop de ressources",
                            "Un virus informatique"
                        ],
                        correct: 1,
                        explanation: "Un processus zombie reste en mémoire après sa mort car le parent n'a pas récupéré son statut de sortie."
                    },
                    {
                        question: "Expliquez la différence entre mutex et semaphore pour la synchronisation ?",
                        options: [
                            "C'est la même chose",
                            "Mutex = 1 ressource (binaire), Semaphore = N ressources (compteur)",
                            "Semaphore est toujours meilleur",
                            "Ils ne s'utilisent jamais ensemble"
                        ],
                        correct: 1,
                        explanation: "Mutex (mutual exclusion) = 1 seul accès, Semaphore = peut gérer N accès concurrents à une ressource."
                    }
                ],
                3: [
                    {
                        question: "Comment structureriez-vous un projet Linux modulaire pour maximiser la maintenabilité ?",
                        options: [
                            "Tous les fichiers dans un seul dossier",
                            "Séparation par couches (API, logique, stockage) avec interfaces claires",
                            "La structure n'a pas d'importance",
                            "Utiliser des monolithes pour la simplicité"
                        ],
                        correct: 1,
                        explanation: "L'architecture en couches avec APIs bien définies rend le code maintenable et testable."
                    },
                    {
                        question: "Quel rôle joue 'systemd' dans l'écosystème Linux moderne ?",
                        options: [
                            "C'est un simple gestionnaire de services",
                            "Gère l'init, les services, les journaux, les timers et la gestion de l'alimentation",
                            "C'est optionnel et peu utilisé",
                            "Ça ralentit le système"
                        ],
                        correct: 1,
                        explanation: "systemd est devenu central dans Linux : init system, service manager, journal, timers..."
                    },
                    {
                        question: "Comment implémenter une solution IaC (Infrastructure as Code) pour les écoles NIRD ?",
                        options: [
                            "C'est trop complexe pour les écoles",
                            "Ansible/Terraform pour provisionner et gérer l'infrastructure déclarativement",
                            "Faire tout manuellement",
                            "L'IaC n'existe que pour les mega-datacenters"
                        ],
                        correct: 1,
                        explanation: "L'IaC rend l'infrastructure reproductible et version-contrôlée, idéal pour les écoles NIRD."
                    }
                ],
                4: [
                    {
                        question: "Comment NIRD favorise-t-il la souveraineté numérique et l'indépendance technologique ?",
                        options: [
                            "Ce n'est pas un objectif de NIRD",
                            "En promouvant les logiciels libres, en garder les données en EU, et en formant à l'autonomie technique",
                            "En vendant des services propriétaires",
                            "En augmentant la dépendance aux Big Tech"
                        ],
                        correct: 1,
                        explanation: "NIRD vise l'autonomie : logiciels libres, données locales, compétences maison = indépendance."
                    },
                    {
                        question: "Proposez une stratégie d'intégration Linux pour une académie avec 1000 ordinateurs hétérogènes ?",
                        options: [
                            "C'est impossible",
                            "Migration progressive par étapes + IaC + formation des techos + support communautaire",
                            "Tout migrer en une semaine",
                            "Garder Windows"
                        ],
                        correct: 1,
                        explanation: "Une migration responsable : audit → planification → POC → déploiement progressif → formation continue."
                    },
                    {
                        question: "Quel modèle de gouvernance open-source recommanderiez-vous pour que les écoles contribuent à NIRD ?",
                        options: [
                            "Hiérarchie centralisée stricte",
                            "Modèle contributif ouvert avec mentorship et documentation pour baisser les barrières",
                            "Pas besoin de gouvernance",
                            "Seul le gouvernement peut contribuer"
                        ],
                        correct: 1,
                        explanation: "Un modèle inclusif avec docs excellentes et mentors permet aux écoles de contribuer progressivement."
                    }
                ]
            }
        };

        // ====================================
        // RENDU DES QUIZ
        // ====================================

        /**
         * Affiche les questions d'un quiz pour un module spécifique
         * @param {number} moduleNum - Numéro du module (1-4)
         */
        function renderQuiz(moduleNum) {
            const level = appState.currentLevel;
            const quizData = quizzes[level][moduleNum];
            const container = document.getElementById(`quiz${moduleNum}`);
            
            container.innerHTML = '';
            
            quizData.forEach((q, idx) => {
                const questionDiv = document.createElement('div');
                questionDiv.style.marginBottom = '2rem';
                
                const questionLabel = document.createElement('div');
                questionLabel.className = 'quiz-question';
                questionLabel.textContent = `${idx + 1}. ${q.question}`;
                questionDiv.appendChild(questionLabel);
                
                const optionsDiv = document.createElement('div');
                optionsDiv.className = 'quiz-options';
                
                q.options.forEach((option, optIdx) => {
                    const optionBtn = document.createElement('button');
                    optionBtn.className = 'quiz-option';
                    optionBtn.textContent = option;
                    optionBtn.onclick = () => selectAnswer(moduleNum, idx, optIdx);
                    
                    // Marquer comme sélectionné si déjà répondu
                    if (appState.answers[`${moduleNum}-${idx}`] === optIdx) {
                        optionBtn.classList.add('selected');
                    }
                    
                    optionsDiv.appendChild(optionBtn);
                });
                
                questionDiv.appendChild(optionsDiv);
                container.appendChild(questionDiv);
            });
        }

        /**
         * Enregistre la sélection de réponse de l'utilisateur
         * @param {number} moduleNum - Numéro du module
         * @param {number} questionIdx - Index de la question
         * @param {number} optionIdx - Index de l'option sélectionnée
         */
        function selectAnswer(moduleNum, questionIdx, optionIdx) {
            // Déselectionner les autres boutons
            document.querySelectorAll(`#quiz${moduleNum} .quiz-option`).forEach((btn, idx) => {
                if (idx % 4 === optionIdx) btn.classList.remove('selected');
                if (idx % 4 === optionIdx && Math.floor(idx / 4) === questionIdx) {
                    btn.classList.add('selected');
                }
            });
            
            // Enregistrer la réponse dans l'état
            appState.answers[`${moduleNum}-${questionIdx}`] = optionIdx;
            
            // Mise à jour du progress bar
            const totalQuestions = quizzes[appState.currentLevel][moduleNum].length;
            const answered = Object.keys(appState.answers).filter(k => k.startsWith(`${moduleNum}-`)).length;
            const progressPercent = (answered / totalQuestions) * 100;
            document.getElementById(`quiz${moduleNum}Progress`).style.width = progressPercent + '%';
        }

        /**
         * Soumet le quiz et affiche les résultats
         * @param {number} moduleNum - Numéro du module
         */
        function submitQuiz(moduleNum) {
            const level = appState.currentLevel;
            const quizData = quizzes[level][moduleNum];
            const feedback = document.getElementById(`quiz${moduleNum}Feedback`);
            
            let correctAnswers = 0;
            let totalQuestions = quizData.length;
            
            // Vérifier les réponses et afficher les résultats
            quizData.forEach((q, idx) => {
                const userAnswer = appState.answers[`${moduleNum}-${idx}`];
                const options = document.querySelectorAll(`#quiz${moduleNum} .quiz-option`);
                const questionOptions = Array.from(options).slice(idx * 4, (idx + 1) * 4);
                
                if (userAnswer !== undefined) {
                    if (userAnswer === q.correct) {
                        correctAnswers++;
                        questionOptions[userAnswer].classList.add('correct');
                    } else {
                        questionOptions[userAnswer].classList.add('incorrect');
                        questionOptions[q.correct].classList.add('correct');
                    }
                }
            });
            
            // Calculer le score
            const score = (correctAnswers / totalQuestions) * 100;
            const points = Math.round((correctAnswers / totalQuestions) * 100);
            
            // Afficher le feedback
            if (correctAnswers === totalQuestions) {
                feedback.className = 'feedback-message success';
                feedback.innerHTML = `✅ <strong>Parfait !</strong> ${correctAnswers}/${totalQuestions} bonnes réponses ! +${points} points`;
            } else if (score >= 70) {
                feedback.className = 'feedback-message success';
                feedback.innerHTML = `✅ <strong>Bravo !</strong> ${correctAnswers}/${totalQuestions} bonnes réponses ! +${points} points`;
            } else {
                feedback.className = 'feedback-message error';
                feedback.innerHTML = `❌ <strong>Essayez encore...</strong> ${correctAnswers}/${totalQuestions} bonnes réponses. Relisez le tutoriel !`;
            }
            
            // Ajouter les points au total
            appState.totalPoints += points;
            updatePoints();
            
            // Désactiver les boutons d'option après soumission
            document.querySelectorAll(`#quiz${moduleNum} .quiz-option`).forEach(btn => {
                btn.style.pointerEvents = 'none';
            });
        }

        // ====================================
        // GESTION DE L'APPLICATION
        // ====================================

        /**
         * Sélectionne un niveau de difficulté et lance l'apprentissage
         * @param {string} level - Le niveau choisi (elementary, middle, high)
         */
        function selectLevel(level) {
            appState.currentLevel = level;
            appState.currentModule = 1;
            appState.totalPoints = 0;
            appState.answers = {};
            appState.levelStartTime = new Date();
            
            // Réinitialiser l'interface
            document.getElementById('welcome-screen').classList.remove('active');
            document.getElementById('app-screen').classList.add('active');
            
            // Afficher le premier module
            showModule(1);
            updateProgress();
        }

        /**
         * Affiche un module spécifique
         * @param {number} moduleNum - Numéro du module
         */
        function showModule(moduleNum) {
            // Masquer tous les modules
            document.querySelectorAll('.module-content').forEach(m => m.classList.remove('active'));
            
            // Afficher le module demandé
            const moduleElement = document.getElementById(`module-${moduleNum}`);
            if (moduleElement) {
                moduleElement.classList.add('active');
                renderQuiz(moduleNum);
                appState.currentModule = moduleNum;
                updateProgress();
            }
        }

        /**
         * Met à jour l'affichage de la progression
         */
        function updateProgress() {
            const level = appState.currentLevel;
            const levelName = levelLabels[level] || 'Inconnu';
            
            document.getElementById('levelDisplay').textContent = levelName;
            document.getElementById('moduleDisplay').textContent = `${appState.currentModule}/4`;
            updatePoints();
        }

        /**
         * Met à jour l'affichage des points
         */
        function updatePoints() {
            document.getElementById('pointsDisplay').textContent = `${appState.totalPoints} pts`;
            // TODO: API - Sauvegarde les points en base de données
            // API.savePoints(appState.currentLevel, appState.totalPoints);
            saveToLocalStorage();
        }

        /**
         * Passe au module suivant
         */
        function nextModule() {
            if (appState.currentModule < 4) {
                showModule(appState.currentModule + 1);
                window.scrollTo(0, 0);
            }
        }

        /**
         * Termine le niveau actuel
         */
        function completeLevel() {
            const level = appState.currentLevel;
            const time = new Date() - appState.levelStartTime;
            const timeMinutes = Math.round(time / 60000);
            
            // Sauvegarde le score
            appState.levelScores[level] = appState.totalPoints;
            saveToLocalStorage();
            
            // Affiche le modal de résultats
            showResultsModal(true);
        }

        /**
         * Affiche le modal de résultats
         * @param {boolean} success - Succès ou échec du niveau
         */
        function showResultsModal(success = true) {
            const modal = document.getElementById('resultsModal');
            const level = appState.currentLevel;
            const levelName = levelLabels[level];
            
            if (success) {
                document.getElementById('modalIcon').textContent = '🎉';
                document.getElementById('modalTitle').textContent = 'Niveau terminé !';
                document.getElementById('modalText').textContent = `Excellent travail sur le niveau ${levelName} !`;
                document.getElementById('modalStats').innerHTML = `
                    <p><strong>Points totaux :</strong> ${appState.totalPoints} pts</p>
                    <p><strong>Modules complétés :</strong> 4/4 ✅</p>
                    <p><strong>Statut :</strong> Déverrouille le prochain niveau</p>
                `;
            }
            
            modal.classList.add('active');
        }

        /**
         * Revient à l'écran d'accueil
         */
        function backToHome() {
            document.getElementById('app-screen').classList.remove('active');
            document.getElementById('welcome-screen').classList.add('active');
            document.getElementById('resultsModal').classList.remove('active');
        }

        // ====================================
        // STOCKAGE LOCAL
        // ====================================

        /**
         * Sauvegarde l'état de l'application dans localStorage
         * Points d'intégration API :
         * - TODO: Envoyer vers serveur à chaque mise à jour
         * - TODO: Synchroniser offline-first avec service worker
         * - TODO: Stocker l'historique complet des quiz
         */
        function saveToLocalStorage() {
            const data = {
                totalPoints: appState.totalPoints,
                levelScores: appState.levelScores,
                lastUpdate: new Date().toISOString(),
                theme: document.body.classList.contains('dark-mode') ? 'dark' : 'light'
            };
            localStorage.setItem('nirdAcademy', JSON.stringify(data));
        }

        /**
         * Charge l'état depuis localStorage
         */
        function loadFromLocalStorage() {
            const data = localStorage.getItem('nirdAcademy');
            if (data) {
                const parsed = JSON.parse(data);
                appState.totalPoints = parsed.totalPoints || 0;
                appState.levelScores = parsed.levelScores || {};
                
                // Restaurer le thème
                if (parsed.theme === 'dark') {
                    document.body.classList.add('dark-mode');
                    document.getElementById('themeToggle').checked = true;
                }
            }
        }

        // ====================================
        // GESTION DU THÈME
        // ====================================

        document.getElementById('themeToggle').addEventListener('change', function() {
            document.body.classList.toggle('dark-mode');
            saveToLocalStorage();
        });

        // ====================================
        // INITIALISATION
        // ====================================

        // Charger les données au démarrage
        loadFromLocalStorage();