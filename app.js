// Small Trades Evolution - Freedom Forecast Dashboard JavaScript
// Improved version with better user feedback

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
  addCustomStyles();
  
  // Add input listeners for vision completion
  const visionInputs = document.querySelectorAll('.vision-input');
  visionInputs.forEach(input => {
    input.addEventListener('input', checkVisionCompletion);
    input.addEventListener('change', checkVisionCompletion);
  });
  
  console.log('Freedom Forecast Dashboard initialized');
}

// Add custom styles for better visual feedback
function addCustomStyles() {
  const style = document.createElement('style');
  style.innerHTML = `
    /* Enhanced completion styles */
    .vision-card.completed {
      border: 3px solid #10b981 !important;
      background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%) !important;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1) !important;
      transform: scale(1.02);
      transition: all 0.3s ease;
    }
    
    .vision-card.completed::before {
      content: "✓";
      position: absolute;
      top: 10px;
      right: 10px;
      background: #10b981;
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 14px;
      z-index: 10;
    }
    
    .vision-card.incomplete {
      border: 2px solid #ef4444 !important;
      background: linear-gradient(135deg, #fef2f2 0%, #fefefe 100%) !important;
      animation: pulse-red 2s infinite;
    }
    
    @keyframes pulse-red {
      0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
      70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
      100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
    }
    
    .lead-form .form-group.completed input {
      border: 3px solid #10b981 !important;
      background: #ecfdf5 !important;
    }
    
    .lead-form .form-group.incomplete input {
      border: 2px solid #ef4444 !important;
      background: #fef2f2 !important;
    }
    
    .completion-status {
      position: sticky;
      top: 20px;
      background: white;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      padding: 20px;
      margin: 20px 0;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      z-index: 100;
    }
    
    .completion-status.ready {
      border-color: #10b981;
      background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%);
    }
    
    .status-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 15px;
    }
    
    .status-icon {
      font-size: 24px;
    }
    
    .status-title {
      font-size: 18px;
      font-weight: 600;
      margin: 0;
    }
    
    .progress-indicator {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 15px;
    }
    
    .progress-bar-mini {
      flex: 1;
      height: 8px;
      background: #e5e7eb;
      border-radius: 4px;
      overflow: hidden;
    }
    
    .progress-fill-mini {
      height: 100%;
      background: linear-gradient(90deg, #10b981, #059669);
      transition: width 0.3s ease;
    }
    
    .missing-fields {
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 8px;
      padding: 15px;
      margin-top: 15px;
    }
    
    .missing-fields h4 {
      color: #dc2626;
      margin: 0 0 10px 0;
      font-size: 14px;
      font-weight: 600;
    }
    
    .missing-fields ul {
      margin: 0;
      padding-left: 20px;
      color: #7f1d1d;
    }
    
    .missing-fields li {
      margin-bottom: 5px;
      cursor: pointer;
    }
    
    .missing-fields li:hover {
      color: #dc2626;
      font-weight: 600;
    }
  `;
  document.head.appendChild(style);
}

// Enhanced vision completion check with detailed feedback
function checkVisionCompletion() {
  const visionInputs = document.querySelectorAll('.vision-input');
  const leadInputs = [
    { element: document.getElementById('firstName'), label: 'First Name' },
    { element: document.getElementById('tradeType'), label: 'Trade/Business Type' }
  ];
  
  let completedVisionSections = 0;
  let completedLeadFields = 0;
  let missingFields = [];
  
  // Check vision board completion
  const visionLabels = [
    'Current Home Situation',
    'Dream Home',
    'Vehicle Dreams', 
    'Health & Fitness Goals',
    'Hobbies & Passions',
    'Travel Dreams',
    'Family Goals',
    'Recreational Investments',
    'Financial Security',
    'Giving Back'
  ];
  
  visionInputs.forEach((input, index) => {
    const card = input.closest('.vision-card');
    if (input.value.trim() !== '') {
      completedVisionSections++;
      if (card) {
        card.classList.add('completed');
        card.classList.remove('incomplete');
      }
    } else {
      if (card) {
        card.classList.remove('completed');
        card.classList.add('incomplete');
      }
      if (visionLabels[index]) {
        missingFields.push(visionLabels[index]);
      }
    }
  });
  
  // Check lead capture completion
  leadInputs.forEach(inputObj => {
    const input = inputObj.element;
    const formGroup = input?.closest('.form-group');
    
    if (input && input.value.trim() !== '') {
      completedLeadFields++;
      if (formGroup) {
        formGroup.classList.add('completed');
        formGroup.classList.remove('incomplete');
      }
    } else {
      if (formGroup) {
        formGroup.classList.remove('completed');
        formGroup.classList.add('incomplete');
      }
      missingFields.push(inputObj.label);
    }
  });
  
  // Update completion status display
  updateCompletionStatus(completedVisionSections, completedLeadFields, missingFields);
  
  // Update completion gate and navigation
  const isVisionComplete = completedVisionSections >= 8; // Reduced from 10 to 8
  const isLeadComplete = completedLeadFields >= 2;
  
  const completionGate = document.getElementById('completionGate');
  const nextBtn = document.getElementById('nextBtn');
  
  if (isVisionComplete && isLeadComplete) {
    if (completionGate) completionGate.style.display = 'block';
    if (nextBtn) {
      nextBtn.disabled = false;
      nextBtn.textContent = 'Continue to Business Expenses →';
      nextBtn.style.background = '#10b981';
    }
  } else {
    if (completionGate) completionGate.style.display = 'none';
    if (nextBtn) {
      nextBtn.disabled = true;
      nextBtn.textContent = `Complete Your Vision (${completedVisionSections + completedLeadFields}/12 fields)`;
      nextBtn.style.background = '#6b7280';
    }
  }
}

// Update completion status display
function updateCompletionStatus(visionComplete, leadComplete, missing) {
  const totalComplete = visionComplete + leadComplete;
  const totalRequired = 12; // 8 vision + 2 lead fields (reduced requirement)
  const percentage = Math.round((totalComplete / totalRequired) * 100);
  
  // Create or update status display
  let statusDiv = document.getElementById('completionStatus');
  if (!statusDiv) {
    statusDiv = document.createElement('div');
    statusDiv.id = 'completionStatus';
    statusDiv.className = 'completion-status';
    
    // Insert after the section divider
    const divider = document.querySelector('.section-divider');
    if (divider) {
      divider.parentNode.insertBefore(statusDiv, divider.nextSibling);
    }
  }
  
  const isReady = totalComplete >= 10; // Need at least 10 of 12 fields
  statusDiv.className = `completion-status ${isReady ? 'ready' : ''}`;
  
  statusDiv.innerHTML = `
    <div class="status-header">
      <span class="status-icon">${isReady ? '🎉' : '📋'}</span>
      <h3 class="status-title">
        ${isReady ? 'Ready to Continue!' : 'Vision Board Progress'}
      </h3>
    </div>
    
    <div class="progress-indicator">
      <div class="progress-bar-mini">
        <div class="progress-fill-mini" style="width: ${percentage}%"></div>
      </div>
      <span style="font-weight: 600; color: ${isReady ? '#059669' : '#6b7280'};">
        ${totalComplete}/${totalRequired} Complete (${percentage}%)
      </span>
    </div>
    
    ${!isReady ? `
      <div class="missing-fields">
        <h4>📝 Complete these fields to continue:</h4>
        <ul>
          ${missing.slice(0, 5).map(field => `
            <li onclick="scrollToField('${field}')">${field}</li>
          `).join('')}
          ${missing.length > 5 ? `<li><em>...and ${missing.length - 5} more</em></li>` : ''}
        </ul>
        <p style="margin: 10px 0 0 0; font-size: 14px; color: #7f1d1d;">
          💡 Tip: Click on any missing field above to jump to it!
        </p>
      </div>
    ` : `
      <div style="background: #ecfdf5; border: 1px solid #10b981; border-radius: 8px; padding: 15px; margin-top: 15px;">
        <p style="margin: 0; color: #059669; font-weight: 600;">
          ✅ Excellent! Your vision is clear and you're ready to build your financial freedom roadmap.
        </p>
      </div>
    `}
  `;
}

// Scroll to a specific field when clicked
function scrollToField(fieldLabel) {
  const fieldMap = {
    'First Name': 'firstName',
    'Trade/Business Type': 'tradeType'
  };
  
  // Try to find by ID first
  let targetElement = document.getElementById(fieldMap[fieldLabel]);
  
  // If not found, search by label text
  if (!targetElement) {
    const labels = document.querySelectorAll('.form-label');
    for (let label of labels) {
      if (label.textContent.includes(fieldLabel)) {
        targetElement = label.parentElement.querySelector('input, textarea');
        break;
      }
    }
  }
  
  if (targetElement) {
    targetElement.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
    targetElement.focus();
    
    // Add temporary highlight
    targetElement.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.5)';
    setTimeout(() => {
      targetElement.style.boxShadow = '';
    }, 2000);
  }
}

// Navigation functions (updated validation)
function navigate(direction) {
  const newStep = currentStep + direction;
  
  // Validate step 1 before moving forward
  if (currentStep === 1 && direction === 1) {
    const visionInputs = document.querySelectorAll('.vision-input');
    const leadInputs = [
      document.getElementById('firstName'),
      document.getElementById('tradeType')
    ];
    
    const completedVision = Array.from(visionInputs).filter(input => input.value.trim() !== '').length;
    const completedLead = leadInputs.filter(input => input && input.value.trim() !== '').length;
    const totalCompleted = completedVision + completedLead;
    
    if (totalCompleted < 10) {
      alert(`Please complete at least 10 fields to continue. You have ${totalCompleted}/12 fields completed. \n\nCheck the progress tracker above to see which fields are missing!`);
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
    
    // Scroll to top of the new step and focus first input
    setTimeout(() => {
      // Scroll to the step header
      const stepHeader = currentStepEl.querySelector('.step-header');
      if (stepHeader) {
        stepHeader.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
      
      // Focus on the first input field in this step
      const firstInput = currentStepEl.querySelector('input[type="text"], input[type="number"], textarea');
      if (firstInput) {
        setTimeout(() => {
          firstInput.focus();
          firstInput.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }, 300); // Small delay to ensure smooth scroll completes
      }
    }, 100); // Small delay to ensure DOM is updated
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
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  
  html2pdf().set(opt).from(element).save();
}