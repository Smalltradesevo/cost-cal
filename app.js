// 
// Save this file as: app.js
// Small Trades Evolution - Freedom Forecast Dashboard JavaScript
//

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
    const freedomElement = document.getElementById('freedomMonths');
    if (freedomElement) {
      freedomElement.textContent = monthsToFreedom;
    }
    
    // Update vision achievement
    updateVisionAchievement(tier, totalExpenses, monthlyIncome);
  }
}

// Update vision achievement breakdown with timeline
function updateVisionAchievement(tier, expenses, income) {
  const visionContainer = document.getElementById('visionAchievement');
  if (!visionContainer) return;
  
  const firstName = document.getElementById('firstName')?.value || 'Your';
  const surplusIncome = Math.max(0, income - expenses);
  const totalReferrals = tier.directReferrals + tier.eliteReferrals;
  const weeklyGoal = Math.ceil(totalReferrals / 52);
  
  // Calculate timeline milestones
  const timelineData = calculateTimeline(tier, expenses);
  
  visionContainer.innerHTML = `
    <div class="achievement-summary">
      <h4>🎯 ${firstName}'s Path to Freedom</h4>
      <p><strong>Monthly Surplus:</strong> ${formatCurrency(surplusIncome)} after all expenses</p>
      <p><strong>Referrals Needed:</strong> ${tier.directReferrals} direct + ${tier.eliteReferrals} elite referrals</p>
      <p><strong>Weekly Goal:</strong> ~${weeklyGoal} referrals per week</p>
    </div>
    
    <div class="timeline-section">
      <h4>📅 Your Timeline to Freedom</h4>
      <div class="timeline-grid">
        <div class="timeline-milestone">
          <div class="milestone-time">Month 6</div>
          <div class="milestone-income">${formatCurrency(timelineData.month6)}</div>
          <div class="milestone-desc">Annual income pace</div>
        </div>
        <div class="timeline-milestone">
          <div class="milestone-time">Month 12</div>
          <div class="milestone-income">${formatCurrency(timelineData.month12)}</div>
          <div class="milestone-desc">First year total</div>
        </div>
        <div class="timeline-milestone">
          <div class="milestone-time">Month 18</div>
          <div class="milestone-income">${formatCurrency(timelineData.month18)}</div>
          <div class="milestone-desc">With residuals</div>
        </div>
        <div class="timeline-milestone">
          <div class="milestone-time">Month 24</div>
          <div class="milestone-income">${formatCurrency(timelineData.month24)}</div>
          <div class="milestone-desc">Full potential</div>
        </div>
      </div>
    </div>
    
    <div class="vision-timeline">
      <h4>🌟 Vision Achievement Schedule</h4>
      <div class="achievement-breakdown">
        <div class="achievement-item">
          <span class="achievement-icon">🚗</span>
          <span class="achievement-text">Vehicle goals: Month 8-12</span>
          <span class="achievement-timing">First year earnings</span>
        </div>
        <div class="achievement-item">
          <span class="achievement-icon">✈️</span>
          <span class="achievement-text">Travel dreams: Month 6+</span>
          <span class="achievement-timing">Ongoing funding</span>
        </div>
        <div class="achievement-item">
          <span class="achievement-icon">🏡</span>
          <span class="achievement-text">Dream home: Month 18-24</span>
          <span class="achievement-timing">Residual income phase</span>
        </div>
        <div class="achievement-item">
          <span class="achievement-icon">💰</span>
          <span class="achievement-text">Financial security: Month 24+</span>
          <span class="achievement-timing">True freedom achieved</span>
        </div>
      </div>
    </div>
    
    <div class="realistic-expectations">
      <h4>📊 Year-by-Year Breakdown</h4>
      <div class="year-breakdown">
        <div class="year-item">
          <span class="year-label">Year 1:</span>
          <span class="year-desc">Building network, earning ${formatCurrency(timelineData.year1)} (partial income)</span>
        </div>
        <div class="year-item">
          <span class="year-label">Year 2:</span>
          <span class="year-desc">Residuals activate, earning ${formatCurrency(timelineData.year2)} (full potential)</span>
        </div>
        <div class="year-item">
          <span class="year-label">Year 3+:</span>
          <span class="year-desc">Compound growth, earning ${formatCurrency(timelineData.year3)}+ (financial freedom)</span>
        </div>
      </div>
    </div>
  `;
}

// Calculate realistic timeline milestones
function calculateTimeline(tier, expenses) {
  // Based on the residual income model from your spreadsheet
  const year1Income = tier.annualIncome * 0.6; // 60% of potential in year 1 (time decay)
  const year2Income = tier.annualIncome * 1.8; // Residuals kick in
  const year3Income = tier.annualIncome * 2.5; // Full compound effect
  
  return {
    month6: year1Income * 0.4, // 40% of year 1 by month 6
    month12: year1Income, // Full year 1 potential
    month18: year2Income * 0.5, // Building into year 2
    month24: year2Income, // Full year 2 potential
    year1: year1Income,
    year2: year2Income,
    year3: year3Income
  };
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
    jsPDF: { unit: 'in', format: '// 
// Save this file as: app.js
// Small Trades Evolution - Freedom Forecast Dashboard JavaScript
//

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
    const freedomElement = document.getElementById('freedomMonths');
    if (freedomElement) {
      freedomElement.textContent = monthsToFreedom;
    }
    
    // Update vision achievement
    updateVisionAchievement(tier, totalExpenses, monthlyIncome);
  }
}

// Update vision achievement breakdown with timeline
function updateVisionAchievement(tier, expenses, income) {
  const visionContainer = document.getElementById('visionAchievement');
  if (!visionContainer) return;
  
  const firstName = document.getElementById('firstName')?.value || 'Your';
  const surplusIncome = Math.max(0, income - expenses);
  const totalReferrals = tier.directReferrals + tier.eliteReferrals;
  const weeklyGoal = Math.ceil(totalReferrals / 52);
  
  // Calculate timeline milestones
  const timelineData = calculateTimeline(tier, expenses);
  
  visionContainer.innerHTML = `
    <div class="achievement-summary">
      <h4>🎯 ${firstName}'s Path to Freedom</h4>
      <p><strong>Monthly Surplus:</strong> ${formatCurrency(surplusIncome)} after all expenses</p>
      <p><strong>Referrals Needed:</strong> ${tier.directReferrals} direct + ${tier.eliteReferrals} elite referrals</p>
      <p><strong>Weekly Goal:</strong> ~${weeklyGoal} referrals per week</p>
    </div>
    
    <div class="timeline-section">
      <h4>📅 Your Timeline to Freedom</h4>
      <div class="timeline-grid">
        <div class="timeline-milestone">
          <div class="milestone-time">Month 6</div>
          <div class="milestone-income">${formatCurrency(timelineData.month6)}</div>
          <div class="milestone-desc">Annual income pace</div>
        </div>
        <div class="timeline-milestone">
          <div class="milestone-time">Month 12</div>
          <div class="milestone-income">${formatCurrency(timelineData.month12)}</div>
          <div class="milestone-desc">First year total</div>
        </div>
        <div class="timeline-milestone">
          <div class="milestone-time">Month 18</div>
          <div class="milestone-income">${formatCurrency(timelineData.month18)}</div>
          <div class="milestone-desc">With residuals</div>
        </div>
        <div class="timeline-milestone">
          <div class="milestone-time">Month 24</div>
          <div class="milestone-income">${formatCurrency(timelineData.month24)}</div>
          <div class="milestone-desc">Full potential</div>
        </div>
      </div>
    </div>
    
    <div class="vision-timeline">
      <h4>🌟 Vision Achievement Schedule</h4>
      <div class="achievement-breakdown">
        <div class="achievement-item">
          <span class="achievement-icon">🚗</span>
          <span class="achievement-text">Vehicle goals: Month 8-12</span>
          <span class="achievement-timing">First year earnings</span>
        </div>
        <div class="achievement-item">
          <span class="achievement-icon">✈️</span>
          <span class="achievement-text">Travel dreams: Month 6+</span>
          <span class="achievement-timing">Ongoing funding</span>
        </div>
        <div class="achievement-item">
          <span class="achievement-icon">🏡</span>
          <span class="achievement-text">Dream home: Month 18-24</span>
          <span class="achievement-timing">Residual income phase</span>
        </div>
        <div class="achievement-item">
          <span class="achievement-icon">💰</span>
          <span class="achievement-text">Financial security: Month 24+</span>
          <span class="achievement-timing">True freedom achieved</span>
        </div>
      </div>
    </div>
    
    <div class="realistic-expectations">
      <h4>📊 Year-by-Year Breakdown</h4>
      <div class="year-breakdown">
        <div class="year-item">
          <span class="year-label">Year 1:</span>
          <span class="year-desc">Building network, earning ${formatCurrency(timelineData.year1)} (partial income)</span>
        </div>
        <div class="year-item">
          <span class="year-label">Year 2:</span>
          <span class="year-desc">Residuals activate, earning ${formatCurrency(timelineData.year2)} (full potential)</span>
        </div>
        <div class="year-item">
          <span class="year-label">Year 3+:</span>
          <span class="year-desc">Compound growth, earning ${formatCurrency(timelineData.year3)}+ (financial freedom)</span>
        </div>
      </div>
    </div>
  `;
}

// Calculate realistic timeline milestones
function calculateTimeline(tier, expenses) {
  // Based on the residual income model from your spreadsheet
  const year1Income = tier.annualIncome * 0.6; // 60% of potential in year 1 (time decay)
  const year2Income = tier.annualIncome * 1.8; // Residuals kick in
  const year3Income = tier.annualIncome * 2.5; // Full compound effect
  
  return {
    month6: year1Income * 0.4, // 40% of year 1 by month 6
    month12: year1Income, // Full year 1 potential
    month18: year2Income * 0.5, // Building into year 2
    month24: year2Income, // Full year 2 potential
    year1: year1Income,
    year2: year2Income,
    year3: year3Income
  };
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

// Export to PDF function with fallback options
function exportToPDF() {
  const firstName = document.getElementById('firstName')?.value || 'Your';
  
  // Option 1: Try html2pdf if available
  if (typeof html2pdf !== 'undefined') {
    const element = document.getElementById('reportContainer');
    const opt = {
      margin: 1,
      filename: `${firstName}_Freedom_Forecast.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
    return;
  }
  
  // Option 2: Screenshot method
  if (navigator.share) {
    // Mobile share
    takeScreenshot();
  } else {
    // Desktop alternatives
    showPDFAlternatives();
  }
}

// Alternative PDF solutions
function showPDFAlternatives() {
  const firstName = document.getElementById('firstName')?.value || 'Your';
  
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  `;
  
  modal.innerHTML = `
    <div style="background: white; padding: 2rem; border-radius: 12px; max-width: 500px; text-align: center;">
      <h3 style="margin-bottom: 1rem; color: #374151;">Save Your Freedom Forecast</h3>
      <p style="margin-bottom: 2rem; color: #6b7280;">Choose your preferred method to save your results:</p>
      
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <button onclick="printPage()" style="padding: 1rem; background: #1e3a8a; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
          🖨️ Print to PDF
        </button>
        
        <button onclick="emailResults()" style="padding: 1rem; background: #059669; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
          📧 Email Results
        </button>
        
        <button onclick="copyResults()" style="padding: 1rem; background: #d4af37; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
          📋 Copy Summary
        </button>
        
        <button onclick="takeScreenshot()" style="padding: 1rem; background: #6b7280; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
          📱 Take Screenshot
        </button>
      </div>
      
      <button onclick="closeModal()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #f3f4f6; color: #374151; border: none; border-radius: 6px; cursor: pointer;">
        Close
      </button>
    </div>
  `;
  
  document.body.appendChild(modal);
  window.currentModal = modal;
}

// Print to PDF (works in all browsers)
function printPage() {
  // Hide navigation and other elements
  const nav = document.querySelector('.navigation');
  const introBanner = document.getElementById('introBanner');
  
  if (nav) nav.style.display = 'none';
  if (introBanner) introBanner.style.display = 'none';
  
  // Add print styles
  const printStyles = document.createElement('style');
  printStyles.innerHTML = `
    @media print {
      body { margin: 0; padding: 20px; }
      .main-container { max-width: none; }
      .step:not(.active) { display: none !important; }
      .progress-container { display: none; }
      .video-placeholder { display: none; }
      .btn { display: none; }
    }
  `;
  document.head.appendChild(printStyles);
  
  // Print
  window.print();
  
  // Restore elements
  setTimeout(() => {
    if (nav) nav.style.display = '';
    if (introBanner) introBanner.style.display = '';
    document.head.removeChild(printStyles);
    closeModal();
  }, 100);
}

// Email results
function emailResults() {
  const firstName = document.getElementById('firstName')?.value || 'Your';
  const selectedTier = window.selectedTier;
  const tier = selectedTier ? commissionTiers[selectedTier] : null;
  
  if (!tier) {
    alert('Please complete the calculator first');
    return;
  }
  
  const subject = `${firstName} Freedom Forecast Results`;
  const body = `
My Freedom Forecast Results:

Selected Level: ${tier.name}
Annual Income Potential: ${tier.annualIncome.toLocaleString()}
Referrals Needed: ${tier.directReferrals} direct + ${tier.eliteReferrals} elite

Timeline:
- Month 6: Building momentum
- Month 12: ${Math.round(tier.annualIncome * 0.6).toLocaleString()} first year
- Month 18: Residuals activating  
- Month 24: ${Math.round(tier.annualIncome * 1.8).toLocaleString()} full potential

Generated by: Small Trades Evolution Freedom Forecast
Visit: [Your Website URL]
  `.trim();
  
  const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoLink;
  
  closeModal();
}

// Copy results to clipboard
function copyResults() {
  const firstName = document.getElementById('firstName')?.value || 'Your';
  const selectedTier = window.selectedTier;
  const tier = selectedTier ? commissionTiers[selectedTier] : null;
  
  if (!tier) {
    alert('Please complete the calculator first');
    return;
  }
  
  const results = `
${firstName}'s Freedom Forecast:

🎯 Selected Level: ${tier.name}
💰 Annual Income Potential: ${tier.annualIncome.toLocaleString()}
📊 Referrals Needed: ${tier.directReferrals} direct + ${tier.eliteReferrals} elite

📅 Timeline:
Month 6: Building momentum
Month 12: ${Math.round(tier.annualIncome * 0.6).toLocaleString()} first year
Month 18: Residuals activating
Month 24: ${Math.round(tier.annualIncome * 1.8).toLocaleString()} full potential

🌟 Vision Achievement:
- Vehicle goals: Month 8-12
- Travel dreams: Month 6+
- Dream home: Month 18-24
- Financial security: Month 24+

Generated by Small Trades Evolution Freedom Forecast
  `.trim();
  
  navigator.clipboard.writeText(results).then(() => {
    alert('Results copied to clipboard!');
    closeModal();
  }).catch(() => {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = results;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    alert('Results copied to clipboard!');
    closeModal();
  });
}

// Screenshot instructions
function takeScreenshot() {
  const instructions = `
To take a screenshot of your results:

📱 Mobile:
• iPhone: Press Side Button + Volume Up
• Android: Press Power + Volume Down

💻 Desktop:
• Windows: Press Windows Key + Shift + S
• Mac: Press Cmd + Shift + 4
• Chrome: Right-click → "Capture screenshot"

Then save or share your Freedom Forecast results!
  `;
  
  alert(instructions);
  closeModal();
}

// Close modal
function closeModal() {
  if (window.currentModal) {
    document.body.removeChild(window.currentModal);
    window.currentModal = null;
  }
}letter', orientation: 'portrait' }
  };
  
  html2pdf().set(opt).from(element).save();
}