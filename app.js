// MindGuard - Privacy-First Mental Health App for Teens
// JavaScript functionality

// Application State
let appState = {
    currentPage: 'welcome-page',
    user: {
        id: 'user_demo',
        age: 16,
        streakDays: 7,
        totalPoints: 285,
        level: 3,
        currentBadges: ['Daily Check-in Champion', 'Self-Care Star', 'Journal Journey'],
        recentMoods: [
            {date: '2025-07-30', mood: 'Happy', score: 7},
            {date: '2025-07-29', mood: 'Neutral', score: 6},
            {date: '2025-07-28', mood: 'Anxious', score: 4},
            {date: '2025-07-27', mood: 'Sad', score: 3},
            {date: '2025-07-26', mood: 'Happy', score: 8}
        ]
    },
    onboarding: {
        currentStep: 1,
        completed: false
    },
    settings: {
        theme: 'light',
        highContrast: false,
        largeText: false,
        reducedMotion: false,
        screenReader: false
    },
    todaysMood: null,
    todaysJournal: '',
    selfCareData: {}
};

// Mood Options Data
const moodOptions = [
    {name: 'Very Happy', emoji: '😄', score: 9, color: '#4CAF50'},
    {name: 'Happy', emoji: '😊', score: 7, color: '#8BC34A'},
    {name: 'Excited', emoji: '🤩', score: 8, color: '#FF9800'},
    {name: 'Neutral', emoji: '😐', score: 5, color: '#9E9E9E'},
    {name: 'Anxious', emoji: '😰', score: 4, color: '#FF5722'},
    {name: 'Sad', emoji: '😢', score: 3, color: '#2196F3'},
    {name: 'Frustrated', emoji: '😤', score: 2, color: '#E91E63'},
    {name: 'Very Sad', emoji: '😭', score: 1, color: '#9C27B0'}
];

// Badges Data
const badges = [
    {name: 'Daily Check-in Champion', icon: '🏆', description: '7 consecutive days of mood logging'},
    {name: 'Self-Care Star', icon: '⭐', description: 'Completed 10 self-care activities'},
    {name: 'Journal Journey', icon: '📝', description: 'Written 10 journal entries'},
    {name: 'Mindfulness Master', icon: '🧘', description: '5 meditation sessions completed'},
    {name: 'Sleep Supporter', icon: '💤', description: 'Healthy sleep schedule for a week'},
    {name: 'Exercise Explorer', icon: '🏃', description: 'Physical activity logged for 5 days'}
];

// Coping Strategies Data
const copingStrategies = {
    breathing: {
        title: '🫁 Deep Breathing Exercise',
        content: `
            <div class="coping-exercise">
                <h4>4-7-8 Breathing Technique</h4>
                <ol>
                    <li>Exhale completely through your mouth</li>
                    <li>Close your mouth and inhale through your nose for 4 counts</li>
                    <li>Hold your breath for 7 counts</li>
                    <li>Exhale through your mouth for 8 counts</li>
                    <li>Repeat 3-4 times</li>
                </ol>
                <div class="breathing-timer">
                    <button class="btn btn--primary" onclick="startBreathingTimer()">Start Guided Breathing</button>
                    <div id="breathing-guide" style="display:none;">
                        <div class="breath-circle"></div>
                        <p id="breath-instruction">Breathe in...</p>
                    </div>
                </div>
            </div>
        `
    },
    muscle: {
        title: '💪 Progressive Muscle Relaxation',
        content: `
            <div class="coping-exercise">
                <h4>Tense and Release Technique</h4>
                <ol>
                    <li>Start with your toes - tense for 5 seconds, then release</li>
                    <li>Move to your calves - tense and release</li>
                    <li>Continue with thighs, buttocks, abdomen</li>
                    <li>Tense your hands, arms, shoulders</li>
                    <li>Finally, tense and release your face muscles</li>
                    <li>Notice the difference between tension and relaxation</li>
                </ol>
                <p><strong>Duration:</strong> 10-15 minutes</p>
            </div>
        `
    },
    walking: {
        title: '🚶 Mindful Walking',
        content: `
            <div class="coping-exercise">
                <h4>Focus on Each Step</h4>
                <ol>
                    <li>Start walking at a comfortable pace</li>
                    <li>Focus on the sensation of your feet touching the ground</li>
                    <li>Notice your surroundings - colors, sounds, smells</li>
                    <li>When your mind wanders, gently return focus to walking</li>
                    <li>Pay attention to your breathing as you walk</li>
                </ol>
                <p><strong>Duration:</strong> 5-20 minutes</p>
                <p><strong>Tip:</strong> This can be done indoors or outdoors!</p>
            </div>
        `
    },
    gratitude: {
        title: '📝 Gratitude Journaling',
        content: `
            <div class="coping-exercise">
                <h4>Write 3 Things You're Grateful For</h4>
                <ol>
                    <li>Find a quiet space and get comfortable</li>
                    <li>Think about your day or week</li>
                    <li>Write down 3 specific things you're grateful for</li>
                    <li>For each item, write why you're grateful for it</li>
                    <li>Take a moment to feel the positive emotions</li>
                </ol>
                <div class="gratitude-prompts">
                    <h5>Prompts to get started:</h5>
                    <ul>
                        <li>A person who made you smile today</li>
                        <li>Something beautiful you noticed</li>
                        <li>A small victory or accomplishment</li>
                        <li>A comfort you enjoyed (food, music, etc.)</li>
                    </ul>
                </div>
            </div>
        `
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    checkForEarlyWarnings();
    updateDashboard();
    createMoodWheel();
    setupEventListeners();
    loadUserSettings();
});

function initializeApp() {
    // Check if user has completed onboarding
    const onboardingComplete = localStorage.getItem('mindguard_onboarding_complete');
    if (onboardingComplete) {
        showPage('dashboard-page');
    } else {
        showPage('welcome-page');
    }
    
    // Load user data from localStorage for demo
    const savedUserData = localStorage.getItem('mindguard_user_data');
    if (savedUserData) {
        appState.user = {...appState.user, ...JSON.parse(savedUserData)};
    }
}

function setupEventListeners() {
    // Journal character counter
    const journalInput = document.getElementById('journal-entry');
    if (journalInput) {
        journalInput.addEventListener('input', function() {
            const charCount = this.value.length;
            document.getElementById('char-count').textContent = charCount;
            
            if (charCount > 450) {
                document.getElementById('char-count').style.color = 'var(--color-warning)';
            } else {
                document.getElementById('char-count').style.color = 'var(--color-text-secondary)';
            }
        });
    }

    // Age selection in onboarding
    document.querySelectorAll('.age-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.age-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            
            const age = this.dataset.age;
            const parentalConsent = document.getElementById('parental-consent');
            const continueBtn = document.getElementById('continue-age');
            
            if (age === '13-15') {
                parentalConsent.style.display = 'block';
                continueBtn.disabled = true;
                
                // Enable continue button when email is entered
                const emailInput = document.getElementById('parent-email');
                emailInput.addEventListener('input', function() {
                    continueBtn.disabled = this.value.length === 0;
                });
            } else {
                parentalConsent.style.display = 'none';
                continueBtn.disabled = false;
            }
        });
    });

    // Accessibility preferences
    document.getElementById('high-contrast')?.addEventListener('change', function() {
        toggleHighContrast(this.checked);
    });
    
    document.getElementById('large-text')?.addEventListener('change', function() {
        toggleLargeText(this.checked);
    });
    
    document.getElementById('reduced-motion')?.addEventListener('change', function() {
        toggleReducedMotion(this.checked);
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

// Page Navigation
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        appState.currentPage = pageId;
        
        // Update navigation active state
        updateNavigation(pageId);
        
        // Announce page change for screen readers
        announceForScreenReader(`Navigated to ${pageId.replace('-page', '').replace('-', ' ')} page`);
    }
}

function updateNavigation(activePageId) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === activePageId) {
            item.classList.add('active');
        }
    });
}

// Onboarding Flow
function startOnboarding() {
    showPage('onboarding-page');
    updateOnboardingProgress();
}

function nextOnboardingStep() {
    const currentStep = appState.onboarding.currentStep;
    const currentStepEl = document.getElementById(`step-${currentStep}`);
    const nextStepEl = document.getElementById(`step-${currentStep + 1}`);
    
    if (nextStepEl) {
        currentStepEl.classList.remove('active');
        nextStepEl.classList.add('active');
        appState.onboarding.currentStep++;
        updateOnboardingProgress();
    }
}

function updateOnboardingProgress() {
    const progress = (appState.onboarding.currentStep / 3) * 100;
    document.getElementById('onboarding-progress').style.width = `${progress}%`;
}

function completeOnboarding() {
    appState.onboarding.completed = true;
    localStorage.setItem('mindguard_onboarding_complete', 'true');
    
    // Apply selected accessibility settings
    if (document.getElementById('high-contrast').checked) {
        toggleHighContrast(true);
    }
    if (document.getElementById('large-text').checked) {
        toggleLargeText(true);
    }
    if (document.getElementById('reduced-motion').checked) {
        toggleReducedMotion(true);
    }
    
    showPage('dashboard-page');
    showSuccessModal('Welcome to MindGuard! 🎉', 'You\'ve earned 25 points for completing onboarding!');
    
    // Award onboarding badge
    awardBadge('Onboarding Complete');
}

// Dashboard Updates
function updateDashboard() {
    // Update streak
    document.getElementById('streak-days').textContent = appState.user.streakDays;
    
    // Update total points
    document.getElementById('total-points').textContent = appState.user.totalPoints;
    
    // Update level
    document.getElementById('user-level').textContent = appState.user.level;
    
    // Update average mood
    const avgMood = calculateAverageMood();
    document.getElementById('avg-mood-emoji').textContent = avgMood.emoji;
    document.getElementById('avg-mood-text').textContent = avgMood.name;
    
    // Update recent badges
    updateRecentBadges();
}

function calculateAverageMood() {
    const recentMoods = appState.user.recentMoods.slice(-7); // Last 7 days
    const avgScore = recentMoods.reduce((sum, mood) => sum + mood.score, 0) / recentMoods.length;
    
    // Find closest mood option
    return moodOptions.reduce((prev, current) => {
        return Math.abs(current.score - avgScore) < Math.abs(prev.score - avgScore) ? current : prev;
    });
}

function updateRecentBadges() {
    const badgesList = document.getElementById('recent-badges');
    if (badgesList) {
        badgesList.innerHTML = appState.user.currentBadges
            .slice(-3)
            .map(badgeName => {
                const badge = badges.find(b => b.name === badgeName);
                return `<div class="badge-item">${badge?.icon || '🏆'} ${badgeName}</div>`;
            })
            .join('');
    }
}

// Mood Logging
function createMoodWheel() {
    const moodWheel = document.getElementById('mood-wheel');
    if (!moodWheel) return;
    
    moodWheel.innerHTML = moodOptions.map(mood => `
        <div class="mood-option" data-mood="${mood.name}" data-score="${mood.score}" onclick="selectMood('${mood.name}', '${mood.emoji}', ${mood.score})">
            <div class="mood-emoji">${mood.emoji}</div>
            <div class="mood-name">${mood.name}</div>
        </div>
    `).join('');
}

function selectMood(name, emoji, score) {
    // Remove previous selection
    document.querySelectorAll('.mood-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Select current mood
    const selectedOption = document.querySelector(`[data-mood="${name}"]`);
    selectedOption.classList.add('selected');
    
    // Update selected mood display
    const selectedMoodEl = document.getElementById('selected-mood');
    document.getElementById('selected-mood-emoji').textContent = emoji;
    document.getElementById('selected-mood-text').textContent = name;
    selectedMoodEl.style.display = 'flex';
    
    // Store selection
    appState.todaysMood = {name, emoji, score, date: new Date().toISOString().split('T')[0]};
    
    // Enable submit button
    document.getElementById('submit-mood').disabled = false;
    
    announceForScreenReader(`Selected mood: ${name}`);
}

function submitMoodLog() {
    if (!appState.todaysMood) {
        alert('Please select a mood first!');
        return;
    }
    
    // Get additional data
    const journalEntry = document.getElementById('journal-entry').value;
    const sleepHours = document.getElementById('sleep-hours').value;
    const exerciseMinutes = document.getElementById('exercise-minutes').value;
    const socialLevel = document.getElementById('social-level').value;
    
    // Store today's data
    appState.todaysJournal = journalEntry;
    appState.selfCareData = {
        sleep: sleepHours,
        exercise: exerciseMinutes,
        social: socialLevel
    };
    
    // Add to recent moods
    appState.user.recentMoods.push(appState.todaysMood);
    if (appState.user.recentMoods.length > 30) {
        appState.user.recentMoods.shift(); // Keep only last 30 days
    }
    
    // Calculate points
    let points = 10; // Base points for mood logging
    if (journalEntry.length > 0) points += 15;
    if (sleepHours > 0) points += 5;
    if (exerciseMinutes > 0) points += 10;
    if (socialLevel) points += 5;
    
    appState.user.totalPoints += points;
    
    // Update streak
    appState.user.streakDays++;
    
    // Check for new badges
    checkForNewBadges();
    
    // Save data
    saveUserData();
    
    // Show success modal
    showSuccessModal(`Great job logging your mood! 🎉`, `You earned ${points} points today!`);
    
    // Check for early warning patterns
    setTimeout(() => {
        checkForEarlyWarnings();
    }, 2000);
    
    // Reset form
    resetMoodLogForm();
}

function resetMoodLogForm() {
    document.querySelectorAll('.mood-option').forEach(option => {
        option.classList.remove('selected');
    });
    document.getElementById('selected-mood').style.display = 'none';
    document.getElementById('journal-entry').value = '';
    document.getElementById('sleep-hours').value = '';
    document.getElementById('exercise-minutes').value = '';
    document.getElementById('social-level').value = '';
    document.getElementById('char-count').textContent = '0';
    document.getElementById('submit-mood').disabled = true;
    appState.todaysMood = null;
}

// Early Warning System
function checkForEarlyWarnings() {
    const recentMoods = appState.user.recentMoods.slice(-5); // Last 5 days
    
    if (recentMoods.length < 3) return; // Need at least 3 days of data
    
    // Pattern 1: Declining mood trend
    const avgRecentScore = recentMoods.slice(-3).reduce((sum, mood) => sum + mood.score, 0) / 3;
    const avgPreviousScore = recentMoods.slice(0, -3).reduce((sum, mood) => sum + mood.score, 0) / Math.max(1, recentMoods.length - 3);
    
    if (avgRecentScore < 4 && avgRecentScore < avgPreviousScore - 1) {
        setTimeout(() => {
            showEarlyWarning(
                'Your mood has been lower than usual for the past few days. This might be due to stress, changes in routine, or other factors.',
                [
                    'Try a 5-minute breathing exercise',
                    'Reach out to a trusted friend or family member',
                    'Consider talking to a counselor or therapist',
                    'Make sure you\'re getting enough sleep and exercise'
                ]
            );
        }, 3000);
        return;
    }
    
    // Pattern 2: High anxiety levels
    const anxiousDays = recentMoods.filter(mood => mood.name === 'Anxious').length;
    if (anxiousDays >= 2) {
        setTimeout(() => {
            showEarlyWarning(
                'We noticed you\'ve been feeling anxious lately. Anxiety is very common and there are effective ways to manage it.',
                [
                    'Practice deep breathing or meditation',
                    'Try progressive muscle relaxation',
                    'Talk to someone you trust about what\'s worrying you',
                    'Consider professional support if anxiety persists'
                ]
            );
        }, 3000);
        return;
    }
    
    // Pattern 3: Very low mood
    const veryLowMoods = recentMoods.filter(mood => mood.score <= 2).length;
    if (veryLowMoods >= 2) {
        setTimeout(() => {
            showEarlyWarning(
                'We\'ve noticed some very difficult days recently. Remember that you\'re not alone, and things can get better.',
                [
                    'Please consider talking to a trusted adult',
                    'Contact a crisis helpline if you need immediate support',
                    'Try engaging in activities you usually enjoy',
                    'Professional help can make a real difference'
                ]
            );
        }, 3000);
        return;
    }
}

function showEarlyWarning(pattern, suggestions) {
    document.getElementById('warning-pattern').textContent = pattern;
    
    const suggestionsList = document.getElementById('warning-suggestions');
    suggestionsList.innerHTML = suggestions.map(suggestion => `<li>${suggestion}</li>`).join('');
    
    document.getElementById('warning-modal').classList.remove('hidden');
    
    announceForScreenReader('Early warning alert: Please review the suggested support options');
}

function closeWarningModal() {
    document.getElementById('warning-modal').classList.add('hidden');
}

// Gamification
function checkForNewBadges() {
    const newBadges = [];
    
    // Check for various badge conditions
    if (appState.user.streakDays >= 7 && !appState.user.currentBadges.includes('Weekly Warrior')) {
        newBadges.push('Weekly Warrior');
    }
    
    if (appState.user.totalPoints >= 300 && !appState.user.currentBadges.includes('Point Master')) {
        newBadges.push('Point Master');
    }
    
    const journalEntries = appState.user.recentMoods.filter(entry => appState.todaysJournal?.length > 0).length;
    if (journalEntries >= 5 && !appState.user.currentBadges.includes('Journal Journey')) {
        newBadges.push('Journal Journey');
    }
    
    // Award new badges
    newBadges.forEach(badge => awardBadge(badge));
}

function awardBadge(badgeName) {
    if (!appState.user.currentBadges.includes(badgeName)) {
        appState.user.currentBadges.push(badgeName);
        
        // Show badge in success modal
        const badgeHtml = `<div class="new-badge">🏆 ${badgeName}</div>`;
        const badgesContainer = document.getElementById('earned-badges');
        if (badgesContainer) {
            badgesContainer.innerHTML += badgeHtml;
        }
        
        announceForScreenReader(`Congratulations! You earned the ${badgeName} badge!`);
    }
}

// Coping Strategies
function showCopingDetails(strategyKey) {
    const strategy = copingStrategies[strategyKey];
    if (!strategy) return;
    
    document.getElementById('coping-title').textContent = strategy.title;
    document.getElementById('coping-content').innerHTML = strategy.content;
    document.getElementById('coping-modal').classList.remove('hidden');
}

function closeCopingModal() {
    document.getElementById('coping-modal').classList.add('hidden');
}

function startBreathingTimer() {
    const guide = document.getElementById('breathing-guide');
    const instruction = document.getElementById('breath-instruction');
    guide.style.display = 'block';
    
    const breathingCycle = [
        {text: 'Breathe in...', duration: 4000},
        {text: 'Hold...', duration: 7000},
        {text: 'Breathe out...', duration: 8000},
        {text: 'Rest...', duration: 2000}
    ];
    
    let cycleIndex = 0;
    let cycleCount = 0;
    
    function nextStep() {
        if (cycleCount >= 4) { // 4 complete cycles
            instruction.textContent = 'Great job! How do you feel?';
            return;
        }
        
        const step = breathingCycle[cycleIndex];
        instruction.textContent = step.text;
        
        setTimeout(() => {
            cycleIndex++;
            if (cycleIndex >= breathingCycle.length) {
                cycleIndex = 0;
                cycleCount++;
            }
            nextStep();
        }, step.duration);
    }
    
    nextStep();
}

// Accessibility Functions
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-color-scheme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-color-scheme', newTheme);
    document.getElementById('theme-toggle').textContent = newTheme === 'light' ? '🌙' : '☀️';
    
    appState.settings.theme = newTheme;
    saveUserSettings();
    
    announceForScreenReader(`Switched to ${newTheme} mode`);
}

function toggleHighContrast(enabled) {
    if (enabled) {
        document.body.classList.add('high-contrast');
    } else {
        document.body.classList.remove('high-contrast');
    }
    appState.settings.highContrast = enabled;
    saveUserSettings();
}

function toggleLargeText(enabled) {
    if (enabled) {
        document.body.classList.add('large-text');
    } else {
        document.body.classList.remove('large-text');
    }
    appState.settings.largeText = enabled;
    saveUserSettings();
}

function toggleReducedMotion(enabled) {
    if (enabled) {
        document.body.style.setProperty('--duration-fast', '0.01ms');
        document.body.style.setProperty('--duration-normal', '0.01ms');
    } else {
        document.body.style.removeProperty('--duration-fast');
        document.body.style.removeProperty('--duration-normal');
    }
    appState.settings.reducedMotion = enabled;
    saveUserSettings();
}

function announceForScreenReader(message) {
    // Create temporary element for screen reader announcement
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Modal Management
function showSuccessModal(title, message) {
    document.querySelector('#success-modal h3').textContent = title;
    document.getElementById('success-message').textContent = message;
    document.getElementById('success-modal').classList.remove('hidden');
}

function closeSuccessModal() {
    document.getElementById('success-modal').classList.add('hidden');
    document.getElementById('earned-badges').innerHTML = '';
    
    // Return to dashboard
    showPage('dashboard-page');
    updateDashboard();
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.add('hidden');
    });
}

// Data Persistence (Demo Implementation)
function saveUserData() {
    localStorage.setItem('mindguard_user_data', JSON.stringify(appState.user));
}

function saveUserSettings() {
    localStorage.setItem('mindguard_user_settings', JSON.stringify(appState.settings));
}

function loadUserSettings() {
    const savedSettings = localStorage.getItem('mindguard_user_settings');
    if (savedSettings) {
        appState.settings = {...appState.settings, ...JSON.parse(savedSettings)};
        
        // Apply saved settings
        if (appState.settings.theme === 'dark') {
            document.documentElement.setAttribute('data-color-scheme', 'dark');
            document.getElementById('theme-toggle').textContent = '☀️';
        }
        
        if (appState.settings.highContrast) {
            document.body.classList.add('high-contrast');
        }
        
        if (appState.settings.largeText) {
            document.body.classList.add('large-text');
        }
        
        if (appState.settings.reducedMotion) {
            toggleReducedMotion(true);
        }
    }
}

// Demo Data Population
function populateDemoData() {
    // This would typically load from secure backend
    // For demo, we'll use the provided JSON data structure
    
    // Simulate loading mood trends
    console.log('Demo: Loading privacy-preserved mood analytics...');
    
    // Simulate federated learning insights
    setTimeout(() => {
        console.log('Demo: Federated learning complete - no personal data transmitted');
    }, 2000);
}

// Initialize demo data on first load
if (!localStorage.getItem('mindguard_demo_initialized')) {
    populateDemoData();
    localStorage.setItem('mindguard_demo_initialized', 'true');
}

// Export functions for testing (would be removed in production)
window.MindGuardApp = {
    showPage,
    selectMood,
    submitMoodLog,
    showEarlyWarning,
    toggleTheme,
    startOnboarding,
    completeOnboarding,
    awardBadge,
    checkForEarlyWarnings
};