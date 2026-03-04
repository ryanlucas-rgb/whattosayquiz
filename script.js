// script.js
const quizData = [
    {
        type: 'intro',
        headline: 'Are You <span style="color: #2b51ff;">Losing Job Offers</span> Because of Weak Interview Communication?',
        subheadline: 'Find out how you really perform under pressure.',
        buttonText: 'Start Quiz Now'
    },
    {
        type: 'question',
        question: '1. What is your gender?',
        options: [
            'Male',
            'Female',
            'Other'
        ]
    },
    {
        type: 'question',
        question: '2. Where are you in your professional journey right now?',
        options: [
            'Student or recent graduate looking for a first role.',
            'Early-career professional trying to grow.',
            'Mid-level professional aiming for better opportunities.',
            'Transitioning to a new career path.',
            'Experienced professional seeking more strategic roles.'
        ]
    },
    {
        type: 'question',
        question: '3. When answering behavioral questions (\u201CTell me about a challenge\u2026\u201D), your response usually:',
        options: [
            'Feels longer than necessary without clear structure.',
            'Explains the problem but doesn\u2019t highlight your impact.',
            'Sounds generic \u2014 like many candidates could say the same thing.',
            'Mentions results without measurable context.',
            'Follows a clear and structured format.'
        ]
    },
    {
        type: 'question',
        question: '4. When you\u2019re asked an unexpected or complex question, you:',
        options: [
            'Start speaking quickly to avoid seeming unprepared.',
            'Think while talking and hope it sounds coherent.',
            'Give a decent answer but later realize it lacked strategy.',
            'Feel tense and overly focused on not making mistakes.',
            'Pause briefly, structure your thoughts, then respond clearly.'
        ]
    },
    {
        type: 'question',
        question: '5. After interviews, your most common thought is:',
        options: [
            '\u201CI knew more than I was able to show.\u201D',
            '\u201CI could have structured that better.\u201D',
            '\u201CI didn\u2019t project the confidence I wanted.\u201D',
            '\u201CI didn\u2019t clearly communicate my impact.\u201D',
            '\u201CI delivered exactly what I intended.\u201D'
        ]
    },
    // Loading / Transition screen
    {
        type: 'loading'
    },
    // Post-Quiz Page - CTA
    {
        type: 'postquiz-cta',
        buttonText: 'Get Instant Access Now'
    }
];

let currentStep = 0;
const answers = [];
let timerInterval;

const cardContainer = document.getElementById('card-container');
const header = document.getElementById('quiz-header');
const progressBar = document.getElementById('progress-bar');

function renderStep() {
    const stepData = quizData[currentStep];

    const oldCard = cardContainer.querySelector('.card');
    if (oldCard) {
        oldCard.classList.remove('fade-enter-active');
        oldCard.classList.add('fade-exit-active');

        setTimeout(() => {
            oldCard.remove();
            buildAndAppendNewCard(stepData);
            updateProgress();
        }, 300);
    } else {
        buildAndAppendNewCard(stepData);
        updateProgress();
    }
}

function buildAndAppendNewCard(stepData) {
    const card = document.createElement('div');
    card.className = 'card fade-enter';

    if (stepData.type === 'intro') {
        card.innerHTML = `
            <h1 class="headline">${stepData.headline}</h1>
            <p class="headline-subtext">Maybe it's not your experience, Maybe it's your communication.</p>
            <div id="progress-mount"></div>
            <div style="width: 100%; display: flex; justify-content: center; margin-top: 10px; margin-bottom: 24px;">
                <img src="./Capa .png" alt="Capa do Quiz" style="width: 100%; max-width: 100%; height: auto; border-radius: 12px; box-shadow: var(--shadow-md); display: block;">
            </div>
            <p class="sub-headline">${stepData.subheadline}</p>
            <button class="btn-primary" style="background-color: #2b51ff; box-shadow: 0 4px 14px 0 rgba(43, 81, 255, 0.4);" onclick="nextStep()">${stepData.buttonText}</button>
        `;
    } else if (stepData.type === 'question') {
        const totalQuestions = quizData.filter(q => q.type === 'question').length;
        const currentQuestionNumber = currentStep;

        // ---- GENDER QUESTION (step 1): photo card layout ----
        if (currentQuestionNumber === 1) {
            const genderImages = [
                './assets/gender-male.png',
                './assets/gender-female.png',
                './assets/gender-other.png'
            ];

            const optionsHtml = stepData.options.map((opt, index) => `
                <button class="gender-card" onclick="handleGenderSelect(${index}, this)" data-index="${index}">
                    <img src="${genderImages[index]}" alt="${opt}" class="gender-card-img">
                    <div class="gender-card-overlay"></div>
                    <span class="gender-card-label">${opt}</span>
                    <div class="gender-card-check">✓</div>
                </button>
            `).join('');

            card.innerHTML = `
                <div class="question-counter">${currentQuestionNumber} <span class="total">/ ${totalQuestions}</span></div>
                <h2 class="headline">${stepData.question}</h2>
                <div id="progress-mount"></div>
                <div class="gender-grid">
                    ${optionsHtml}
                </div>
            `;
        } else {
            // ---- Other questions: standard modern button layout ----
            const iconMap = {
                2: [
                    './assets/recem-formado.png',
                    './assets/plantar.png',
                    './assets/mala-de-viagem.png',
                    './assets/transicao.png',
                    './assets/sabedoria.png'
                ],
                3: ['\uD83D\uDDE3\uFE0F', '\uD83E\uDDE9', '\uD83C\uDFAD', '\uD83D\uDCCA', '\u2728'],
                4: ['\uD83C\uDFC3', '\uD83E\uDDE0', '\uD83D\uDCC9', '\uD83D\uDE30', '\uD83C\uDFAF'],
                5: ['\uD83D\uDCA1', '\uD83E\uDDF1', '\uD83D\uDCAA', '\uD83D\uDCC8', '\u2705']
            };

            const icons = iconMap[currentQuestionNumber] || [];

            const optionsHtml = stepData.options.map((opt, index) => {
                const icon = icons[index] || '\uD83D\uDD39';
                const isImage = icon.includes('.svg') || icon.includes('.png');
                const iconHtml = isImage ? `<img src="${icon}" alt="">` : icon;

                return `
                <button class="btn-option-modern" onclick="handleSelect('${index}')">
                    <div class="option-content-left">
                        <span class="option-icon-modern">${iconHtml}</span>
                        <span>${opt}</span>
                    </div>
                    <div class="option-radio-circle"></div>
                </button>
            `}).join('');

            card.innerHTML = `
                <div class="question-counter">${currentQuestionNumber} <span class="total">/ ${totalQuestions}</span></div>
                <h2 class="headline">${stepData.question}</h2>
                <div id="progress-mount"></div>
                <div class="options-grid">
                    ${optionsHtml}
                </div>
            `;
        }
    } else if (stepData.type === 'loading') {
        // Transition / loading screen
        card.classList.add('loading-card');
        card.innerHTML = `
            <div id="progress-mount" style="width:100%;"></div>
            <div class="loading-content">
                <p class="loading-text">Analyzing Your Responses...</p>
            </div>
        `;

        // Auto-advance to CTA after 3 seconds
        setTimeout(() => {
            nextStep();
        }, 3000);

    } else if (stepData.type === 'postquiz-cta') {
        // Override card styles for dark CTA
        card.classList.add('cta-card-dark');

        card.innerHTML = `
            <div class="cta-dark-container">
                <!-- Headline -->
                <h2 class="cta-headline"><span style="color: #ef4444;">You Don\u2019t Have</span> a Qualification Problem.</h2>
                <p class="cta-subtitle">Your assessment confirms it. The gap is in <strong>structure</strong> and <strong>delivery</strong> \u2014 not experience.</p>

                <div class="cta-divider"></div>

                <!-- Price Justification -->
                <p class="cta-justify-text" style="margin-bottom: 2px;">
                    Normally, a structured interview coaching system like this would cost&nbsp;<span class="cta-price-crossed">$97</span>
                </p>
                <p class="cta-justify-text">
                    But today, based on your assessment\u2026
                </p>

                <div class="cta-divider-thin"></div>

                <!-- What They Get -->
                <p class="cta-section-label">EVERYTHING YOU GET INSIDE:</p>
                <ul class="cta-checklist">
                    <li><div class="cta-check"></div> Lifetime access to the full system</li>
                    <li><div class="cta-check"></div> Structured answer frameworks (STAR+)</li>
                    <li><div class="cta-check"></div> Behavioral question response systems</li>
                    <li><div class="cta-check"></div> Pressure-response structure method</li>
                    <li><div class="cta-check"></div> Authority language training</li>
                    <li><div class="cta-check"></div> Real interview examples &amp; breakdowns</li>
                    <li><div class="cta-check"></div> Instant downloadable PDF</li>
                    <li><div class="cta-check"></div> 7-day money-back guarantee</li>
                </ul>

                <div class="cta-divider-thin"></div>

                <!-- Product Mockup Image -->
                <div class="cta-mockup-wrapper">
                    <img src="./assets/mockup-bundle.png" alt="Unlocking Interview Mastery Bundle" class="cta-mockup-img">
                </div>

                <!-- Value Stack -->
                <div class="cta-value-stack">
                    <p>Small gaps in clarity cost job offers.</p>
                    <p><strong>This system closes that gap.</strong></p>
                </div>

                <!-- Price Section -->
                <div class="cta-price-section">
                    <p class="cta-from-text">From&nbsp;<span class="cta-price-crossed">$97</span>&nbsp;for only</p>
                    <div class="cta-price-main">$7</div>
                    <p class="cta-price-note">One-time payment. Instant access.</p>
                </div>

                <!-- Emotional Close -->
                <div class="cta-emotional-close">
                    <p>In competitive U.S. and Canadian markets, <strong>clarity wins.</strong></p>
                    <p>Structure beats improvisation.</p>
                    <p class="cta-install-line">Install the system.</p>
                </div>

                <!-- CTA Button -->
                <button class="cta-button-main" onclick="submitOffer()">
                    Get Instant Access Now
                </button>

                <!-- Trust Badges -->
                <div class="cta-trust-badges">
                    <span>5,000+ professionals use What To Say.</span>
                    <div class="cta-stars">
                        <svg xmlns="http://www.w3.org/2000/svg" width="85" height="15" viewBox="0 0 110 20">
                            <g fill="#ffa41c">
                                <path d="M10 1L12.7 6.4L18.7 7.2L14.3 11.4L15.3 17.4L10 14.6L4.7 17.4L5.7 11.4L1.3 7.2L7.3 6.4L10 1Z"/>
                                <path d="M32 1L34.7 6.4L40.7 7.2L36.3 11.4L37.3 17.4L32 14.6L26.7 17.4L27.7 11.4L23.3 7.2L29.3 6.4L32 1Z"/>
                                <path d="M54 1L56.7 6.4L62.7 7.2L58.3 11.4L59.3 17.4L54 14.6L48.7 17.4L49.7 11.4L45.3 7.2L51.3 6.4L54 1Z"/>
                                <path d="M76 1L78.7 6.4L84.7 7.2L80.3 11.4L81.3 17.4L76 14.6L70.7 17.4L71.7 11.4L67.3 7.2L73.3 6.4L76 1Z"/>
                                <path d="M98 1L100.7 6.4L106.7 7.2L102.3 11.4L103.3 17.4L98 14.6L92.7 17.4L93.7 11.4L89.3 7.2L95.3 6.4L98 1Z"/>
                            </g>
                        </svg>
                    </div>
                </div>
            </div>
        `;
    }

    cardContainer.appendChild(card);

    const progressMount = card.querySelector('#progress-mount');
    if (progressMount && header) {
        progressMount.appendChild(header);
    }

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            card.classList.add('fade-enter-active');
        });
    });
}

function updateProgress() {
    const totalSteps = quizData.length;
    const progressText = document.getElementById('progress-text');

    // Make sure the header is visible
    header.style.display = 'block';
    setTimeout(() => header.style.opacity = '1', 10);

    // Calculate percentage
    const progressPercentage = (currentStep / (totalSteps - 1)) * 100;
    progressBar.style.width = `${progressPercentage}%`;

    if (quizData[currentStep].type === 'intro') {
        if (progressText) progressText.textContent = "";
    } else if (quizData[currentStep].type === 'question') {
        const totalQuestions = quizData.filter(q => q.type === 'question').length;
        if (progressText) progressText.textContent = `Question ${currentStep} of ${totalQuestions}`;
    } else if (quizData[currentStep].type === 'loading') {
        // Hide the progress text — the card has its own styled text
        if (progressText) progressText.textContent = '';
        // Animate to 100%
        progressBar.style.width = '100%';
    } else if (quizData[currentStep].type === 'postquiz-cta') {
        // Hide the header immediately on CTA page
        header.style.opacity = '0';
        header.style.display = 'none';
    }
}

function nextStep() {
    if (currentStep < quizData.length - 1) {
        currentStep++;
        renderStep();
    }
}

function handleSelect(optionIndex) {
    const stepData = quizData[currentStep];
    answers.push({
        question: stepData.question,
        answer: stepData.options[optionIndex]
    });

    // Visual selection animation
    const allButtons = document.querySelectorAll('.btn-option-modern');
    const optionsGrid = document.querySelector('.options-grid');

    if (allButtons[optionIndex]) {
        allButtons[optionIndex].classList.add('selected');
    }
    if (optionsGrid) {
        optionsGrid.classList.add('has-selection');
    }

    // Wait for the animation to play before advancing
    setTimeout(nextStep, 700);
}

function handleGenderSelect(optionIndex, clickedCard) {
    const stepData = quizData[currentStep];
    answers.push({
        question: stepData.question,
        answer: stepData.options[optionIndex]
    });

    // Disable all cards and mark selected
    const allCards = document.querySelectorAll('.gender-card');
    allCards.forEach((card, i) => {
        card.style.pointerEvents = 'none';
        if (i !== optionIndex) {
            card.classList.add('gender-card-dimmed');
        }
    });
    clickedCard.classList.add('gender-card-selected');

    setTimeout(nextStep, 700);
}

function startTimer() {
    let timeLeft = 15 * 60; // 15 mins
    const timerEl = document.getElementById('offer-timer');

    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerEl.textContent = "00:00";
            return;
        }
        timeLeft--;
        const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
        const s = (timeLeft % 60).toString().padStart(2, '0');
        timerEl.textContent = `${m}:${s}`;
    }, 1000);
}

function submitOffer() {
    const submitBtn = document.querySelector('.cta-button-main') || document.querySelector('.btn-primary');
    if (!submitBtn) return;

    submitBtn.textContent = 'Redirecting...';
    submitBtn.disabled = true;

    // Direct redirection to the checkout link
    setTimeout(() => {
        window.location.href = "https://ggcheckout.com.br/checkout/v4/SmHqADkYWc3F42vEE3GC";
    }, 800);
}

document.addEventListener('DOMContentLoaded', () => {
    renderStep();
});
