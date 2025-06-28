// Small Trades Evolution - Freedom Forecast Dashboard JavaScript

// Global Variables
let currentStep = 1;
const totalSteps = 5;
let selectedTier = null;
let phoneVerified = false;

// Commission tier data based on your structure
const commissionTiers = {
  1: {
    name: "Starter Level",
    directReferrals: 100,
    eliteReferrals: 0,
    annualIncome: 12505.42,
    directBonus: 1.00,
    eliteBonus: 0
  },
  2: {
    name: "Active Level", 
    directReferrals: 200,
    eliteReferrals: 920,
    annualIncome: 60026.02,
    directBonus: 1.25,
    eliteBonus: 0.25
  },
  3: {
    name: "Elite Level",
    directReferrals: 300,
    eliteReferrals: 1380, 
    annualIncome: 300130.08,
    directBonus: 2.25,
    eliteBonus: 1.25
  }
};

// Initialize app when DOM loads
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

// Initialize the application
function initializeApp() {
  updateProgress();
  updateNavigation();
  
  // Add input listeners for vision completion
  const visionInputs = document.querySelectorAll('.vision-input');
  visionInputs.forEach(input => {
    input.addEventListener('input', checkVisionCompletion);
    input.addEventListener('change', checkVisionCompletion);
  });
  
  console.log('Freedom Forecast Dashboard initialized');
}

// Check vision board completion
function checkVisionCompletion() {
  const visionInputs = document.querySelectorAll('.vision-input');
  const leadInputs = [
    document.getElementById('firstName'),
    document.getElementById('tradeType')
  ];
  
  let completedVisionSections = 0;
  let completedLeadFields = 0;
  
  // Check vision board completion
  visionInputs.forEach((input) => {
    const card = input.closest('.vision-card');
    if (input.value.trim() !== '') {
      completedVisionSections++;
      if (card) card.classList.add('completed');
    } else {
      if (card) card.classList.remove('completed');
    }
  });
  
  // Check lead capture completion
  leadInputs.forEach(input => {
    if (input && input.value.trim() !== '') {
      completedLeadFields++;
    }
  });
  
  // Update completion gate
  const isVisionComplete = completedVisionSections >= 10; // All vision cards filled
  const isLeadComplete = completedLeadFields >= 2; // Name and trade filled
  
  const completionGate = document.getElementById('completionGate');
  const nextBtn = document.getElementById('nextBtn');
  
  if (isVisionComplete && isLeadComplete) {
    if (completionGate) completionGate.style.display = 'block';
    if (nextBtn) {
      nextBtn.disabled = false;
      nextBtn.textContent = 'Continue to Business Expenses →';
    }
  } else {
    if (completionGate) completionGate.style.display = 'none';
    if (nextBtn) {
      nextBtn.disabled = true;
      nextBtn.textContent = `Complete Vision Board to Continue (${completedVisionSections}/10)`;
    }
  }
}

// Navigation functions
function navigate(direction) {
  const newStep = currentStep + direction;
  
  // Validate step 1 before moving forward
  if (currentStep === 1 && direction === 1) {
    const visionInputs = document.querySelectorAll('.vision-input');
    const completedSections = Array.from(visionInputs).filter(input => input.value.trim() !== '').length;
    
    if (completedSections < 10) {
      alert('Please complete your entire vision board first. Having intention without a roadmap is just wishful thinking!');
      return;
    }
  }
  
  if (newStep >= 1 && newStep <= totalSteps) {
    currentStep = newStep;
    showStep(currentStep);
  }
}

function showStep(step) {
  // Hide all steps
  document.querySelectorAll('.step').forEach(stepEl => {
    stepEl.classList.remove('active');
  });
  
  // Show current step
  const currentStepEl = document.getElementById(`step-${step}`);
  if (currentStepEl) {
    currentStepEl.classList.add('active');
  }
  
  updateProgress();
  updateNavigation();
}

function updateProgress() {
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');
  const stepDots = document.querySelectorAll('.step-dot');
  
  // Update progress bar
  const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;
  if (progressFill) progressFill.style.width = `${progressPercent}%`;
  
  // Update progress text
  if (progressText) progressText.textContent = `Step ${currentStep} of ${totalSteps}`;
  
  // Update step dots
  stepDots.forEach((dot, index) => {
    dot.classList.remove('active', 'completed');
    if (index + 1 === currentStep) {
      dot.classList.add('active');
    } else if (index + 1 < currentStep) {
      dot.classList.add('completed');
    }
  });
}

function updateNavigation() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  // Update previous button
  if (prevBtn) {
    prevBtn.disabled = currentStep === 1;
  }
  
  // Update next button
  if (nextBtn) {
    if (currentStep === totalSteps) {
      nextBtn.textContent = 'Complete Forecast';
      nextBtn.onclick = function() { exportToPDF(); };
    } else {
      nextBtn.textContent = 'Next →';
      nextBtn.onclick = function() { navigate(1); };
    }
    
    // Special handling for step 1
    if (currentStep === 1) {
      checkVisionCompletion();
    } else {
      nextBtn.disabled = false;
    }
  }
}

// Business expense calculations
function calculateBusinessTotal() {
  const cogs = parseFloat(document.getElementById('cogs')?.value || 0);
  const tools = parseFloat(document.getElementById('tools')?.value || 0);
  const fleet = parseFloat(document.getElementById('fleet')?.value || 0);
  const merchant = parseFloat(document.getElementById('merchantFees')?.value || 0);
  const marketing = parseFloat(document.getElementById('marketing')?.value || 0);
  const insurance = parseFloat(document.getElementById('insurance')?.value || 0);
  
  const total = cogs + tools + fleet + merchant + marketing + insurance;
  
  // Update displays
  updateDisplay('cogsDisplay', cogs);
  updateDisplay('toolsDisplay', tools);
  updateDisplay('fleetDisplay', fleet);
  updateDisplay('merchantDisplay', merchant);
  updateDisplay('marketingDisplay', marketing);
  updateDisplay('insuranceDisplay', insurance);
  updateDisplay('businessTotal', total);
  
  // Update final summary
  updateFinalSummary();
}

// Personal expense calculations
function calculatePersonalTotal() {
  const housing = parseFloat(document.getElementById('housing')?.value || 0);
  const utilities = parseFloat(document.getElementById('utilities')?.value || 0);
  const food = parseFloat(document.getElementById('food')?.value || 0);
  const transportation = parseFloat(document.getElementById('transportation')?.value || 0);
  const healthcare = parseFloat(document.getElementById('healthcare')?.value || 0);
  const entertainment = parseFloat(document.getElementById('entertainment')?.value || 0);
  
  const total = housing + utilities + food + transportation + healthcare + entertainment;
  
  // Update displays
  updateDisplay('housingDisplay', housing);
  updateDisplay('utilitiesDisplay', utilities);
  updateDisplay('foodDisplay', food);
  updateDisplay('transportationDisplay', transportation);
  updateDisplay('healthcareDisplay', healthcare);
  updateDisplay('entertainmentDisplay', entertainment);
  updateDisplay('personalTotal', total);
  
  // Update final summary
  updateFinalSummary();
}

// Tier selection
function selectTier(tierNumber) {
  selectedTier = tierNumber;
  const tier = commissionTiers[tierNumber];
  
  // Update visual selection
  document.querySelectorAll('.result-item').forEach(item => {
    item.classList.remove('selected');
  });
  document.querySelector(`.tier-${tierNumber}`).classList.add('selected');
  
  // Show tier details
  const tierDetails = document.getElementById('tierDetails');
  if (tierDetails) {
    tierDetails.style.display = 'block';
    
    document.getElementById('selectedTierTitle').textContent = `${tier.name} Details`;
    document.getElementById('directReferrals').textContent = tier.directReferrals;
    document.getElementById('eliteReferrals').textContent = tier.eliteReferrals;
    document.getElementById('monthlyIncome').textContent = formatCurrency(tier.annualIncome / 12);
    document.getElementById('annualIncome').textContent = formatCurrency(tier.annualIncome);
  }
  
  // Update final summary
  updateFinalSummary();
}

// Update final summary calculations
function updateFinalSummary() {
  const businessTotal = parseFloat(document.getElementById('businessTotal')?.textContent.replace(/[$,]/g, '') || 0);
  const personalTotal = parseFloat(document.getElementById('personalTotal')?.textContent.replace(/[$,]/g, '') || 0);
  const totalExpenses = businessTotal + personalTotal;
  
  // Update summary cards
  updateDisplay('totalExpenses', totalExpenses);
  
  if (selectedTier) {
    const tier = commissionTiers[selectedTier];
    const monthlyIncome = tier.annualIncome / 12;
    const monthsToFreedom = totalExpenses > 0 ? Math.ceil(totalExpenses / monthlyIncome) : 0;
    
    updateDisplay('incomeGoal', monthlyIncome);
    document.getElementById('freedomMonths').textContent = monthsToFreedom;
    
    // Update vision achievement
    updateVisionAchievement(tier, totalExpenses, monthlyIncome);
  }
}

// Update vision achievement breakdown
function updateVisionAchievement(tier, expenses, income) {
  const visionContainer = document.getElementById('visionAchievement');
  if (!visionContainer) return;
  
  const firstName = document.getElementById('firstName')?.value || 'Your';
  const surplusIncome = Math.max(0, income - expenses);
  
  visionContainer.innerHTML = `
    <div class="achievement-summary">
      <h4>🎯 ${firstName}'s Path to Freedom</h4>
      <p><strong>Monthly Surplus:</strong> ${formatCurrency(surplusIncome)} after all expenses</p>
      <p><strong>Referrals Needed:</strong> ${tier.directReferrals} direct + ${tier.eliteReferrals} elite referrals</p>
      <p><strong>Weekly Goal:</strong> ~${Math.ceil((tier.directReferrals + tier.eliteReferrals) / 52)} referrals per week</p>
    </div>
    
    <div class="achievement-breakdown">
      <div class="achievement-item">
        <span class="achievement-icon">🏡</span>
        <span class="achievement-text">Dream home achievable with consistent referrals</span>
      </div>
      <div class="achievement-item">
        <span class="achievement-icon">🚗</span>
        <span class="achievement-text">Vehicle goals within reach in year 1</span>
      </div>
      <div class="achievement-item">
        <span class="achievement-icon">✈️</span>
        <span class="achievement-text">Travel dreams fully funded</span>
      </div>
      <div class="achievement-item">
        <span class="achievement-icon">💰</span>
        <span class="achievement-text">Financial security and legacy building</span>
      </div>
    </div>
  `;
}

// Utility functions
function updateDisplay(elementId, value) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = formatCurrency(value);
  }
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// Video placeholder functions
function playWelcomeVideo() {
  alert('Welcome video would play here. This is a placeholder for your actual video content.');
}

function playExplanationVideo() {
  alert('Explanation video would play here. This shows how the 5-step process works.');
}

// Hide intro banner
function hideIntro() {
  const introBanner = document.getElementById('introBanner');
  if (introBanner) {
    introBanner.style.display = 'none';
  }
}

// Export to PDF function
function exportToPDF() {
  const element = document.getElementById('reportContainer');
  const firstName = document.getElementById('firstName')?.value || 'Your';
  
  if (typeof html2pdf === 'undefined') {
    alert('PDF export is not available. Please save this page or take screenshots of your results.');
    return;
  }
  
  const opt = {
    margin: 1,
    filename: `${firstName}_Freedom_Forecast.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  
  html2pdf().set(opt).from(element).save();
}

// CSS for achievement styles (add to styles.css)
const additionalStyles = `
.result-item.selected {
  border-color: var(--gold) !important;
  background: rgba(212, 175, 55, 0.1) !important;
  transform: translateY(-4px);
}

.completion-gate {
  background: linear-gradient(135deg, var(--success), #059669);
  color: white;
  padding: 2rem;
  border-radius: var(--radius-lg);
  text-align: center;
  margin-top: 2rem;
  box-shadow: var(--shadow-lg);
}

.completion-message h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.achievement-summary {
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: var(--radius);
  margin-bottom: 1.5rem;
  backdrop-filter: blur(10px);
}

.achievement-breakdown {
  display: grid;
  gap: 1rem;
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius);
  transition: all 0.2s ease;
}

.achievement-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(5px);
}

.achievement-icon {
  font-size: 1.5rem;
  min-width: 40px;
  text-align: center;
}

.achievement-text {
  font-weight: 500;
}

.vision-card.completed {
  border-color: var(--success);
  background: rgba(16, 185, 129, 0.02);
}

.vision-card.completed::before {
  opacity: 1;
  background: linear-gradient(90deg, var(--success), var(--gold));
}
`;

// Add additional styles to head
function addAdditionalStyles() {
  const style = document.createElement('style');
  style.textContent = additionalStyles;
  document.head.appendChild(style);
}

// Initialize additional styles when DOM loads
document.addEventListener('DOMContentLoaded', addAdditionalStyles);