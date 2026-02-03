/* ========================================
   PRICE-CALCULATOR.JS - Dynamic Price Calculator
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
  initializePriceCalculator();
});

// Base prices for different solution types
const basePrices = {
  institucional: 2500,
  ecommerce: 4800,
  industrial: 3800,
  servicos: 2800,
  sistemas_crm: 6500,
  sistemas_estoque: 5200,
  sistemas_completo: 8000
};

// Plus features and their prices
const plusFeatures = {
  area_restrita: 800,
  agendamento: 1200,
  multilingue: 1500,
  marketplaces: 1500,
  erp_integration: 2500,
  configurador: 2000,
  cotacao_complexa: 1500,
  dashboard_cliente: 1800,
  videoteca: 1200,
  medicao_online: 1500,
  agendamento_avancado: 1200,
  area_colaborativa: 1500,
  google_workspace: 800,
  questionarios: 600,
  propostas_automaticas: 900,
  integracao_redes: 300,
  chatbot: 800,
  gateway_adicional: 300,
  fidelidade: 900,
  comparador: 600,
  recomendacoes_ia: 1200
};

/**
 * Initialize price calculator
 */
function initializePriceCalculator() {
  // Check if calculator elements exist on page
  const calculatorForm = document.getElementById('priceCalculatorForm');
  
  if (calculatorForm) {
    setupCalculatorEventListeners();
  }
}

/**
 * Setup event listeners for calculator
 */
function setupCalculatorEventListeners() {
  const solutionSelect = document.getElementById('solutionType');
  const featureCheckboxes = document.querySelectorAll('.plus-feature-checkbox');
  
  if (solutionSelect) {
    solutionSelect.addEventListener('change', updatePrice);
  }
  
  featureCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updatePrice);
  });
}

/**
 * Update total price based on selections
 */
function updatePrice() {
  const solutionSelect = document.getElementById('solutionType');
  const totalElement = document.getElementById('totalPrice');
  const breakdown = document.getElementById('priceBreakdown');
  
  if (!solutionSelect || !totalElement) return;
  
  const selectedSolution = solutionSelect.value;
  
  // Get base price
  const basePrice = basePrices[selectedSolution] || 0;
  let total = basePrice;
  
  // Get selected plus features
  const selectedFeatures = [];
  const featureCheckboxes = document.querySelectorAll('.plus-feature-checkbox:checked');
  
  featureCheckboxes.forEach(checkbox => {
    const featureKey = checkbox.value;
    const featurePrice = plusFeatures[featureKey] || 0;
    total += featurePrice;
    selectedFeatures.push({
      name: checkbox.dataset.name || featureKey,
      price: featurePrice
    });
  });
  
  // Update display
  totalElement.textContent = formatCurrency(total);
  
  // Update breakdown if exists
  if (breakdown) {
    updatePriceBreakdown(basePrice, selectedFeatures, breakdown);
  }
}

/**
 * Update price breakdown display
 */
function updatePriceBreakdown(basePrice, selectedFeatures, breakdownElement) {
  let html = `
    <div class="price-breakdown-item">
      <span>Valor Base:</span>
      <strong>${formatCurrency(basePrice)}</strong>
    </div>
  `;
  
  if (selectedFeatures.length > 0) {
    html += `<div style="border-top: 1px solid #eee; padding-top: 10px; margin-top: 10px;">`;
    
    selectedFeatures.forEach(feature => {
      html += `
        <div class="price-breakdown-item">
          <span>${feature.name}:</span>
          <strong>+ ${formatCurrency(feature.price)}</strong>
        </div>
      `;
    });
    
    html += `</div>`;
  }
  
  breakdownElement.innerHTML = html;
}

/**
 * Format currency
 */
function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

/**
 * Get total price
 */
function getTotalPrice() {
  const solutionSelect = document.getElementById('solutionType');
  if (!solutionSelect) return 0;
  
  const selectedSolution = solutionSelect.value;
  let total = basePrices[selectedSolution] || 0;
  
  const featureCheckboxes = document.querySelectorAll('.plus-feature-checkbox:checked');
  featureCheckboxes.forEach(checkbox => {
    total += plusFeatures[checkbox.value] || 0;
  });
  
  return total;
}

/**
 * Reset calculator
 */
function resetCalculator() {
  const solutionSelect = document.getElementById('solutionType');
  const featureCheckboxes = document.querySelectorAll('.plus-feature-checkbox');
  
  if (solutionSelect) {
    solutionSelect.value = '';
  }
  
  featureCheckboxes.forEach(checkbox => {
    checkbox.checked = false;
  });
  
  updatePrice();
}

/**
 * Export price calculation for use in forms
 */
function addPriceToForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;
  
  // Add hidden input with total price
  const hiddenInput = document.createElement('input');
  hiddenInput.type = 'hidden';
  hiddenInput.name = 'estimated_price';
  hiddenInput.id = 'estimatedPrice';
  hiddenInput.value = getTotalPrice();
  
  // Update before form submission
  contactForm.addEventListener('submit', function() {
    const estimatedPrice = document.getElementById('estimatedPrice');
    if (estimatedPrice) {
      estimatedPrice.value = getTotalPrice();
    }
  });
  
  contactForm.appendChild(hiddenInput);
}

// Initialize price to form connection
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addPriceToForm);
} else {
  addPriceToForm();
}

/**
 * Create calculator widget (for embed on pages)
 */
function createPriceCalculatorWidget() {
  const widget = document.getElementById('priceCalculatorWidget');
  
  if (!widget) return;
  
  let html = `
    <div class="calculator-container">
      <h3>Calculadora de Preços</h3>
      
      <div class="form-group">
        <label for="widgetSolutionType">Selecione a Solução:</label>
        <select id="widgetSolutionType">
          <option value="">Selecione...</option>
          <option value="institucional">Site Institucional - R$ 2.500</option>
          <option value="ecommerce">E-commerce - R$ 4.800</option>
          <option value="industrial">Site Industrial - R$ 3.800</option>
          <option value="servicos">Site de Serviços - R$ 2.800</option>
        </select>
      </div>
      
      <div class="price-total">
        <span>Total Estimado:</span>
        <h2 id="widgetTotalPrice">R$ 0,00</h2>
      </div>
      
      <a href="#contato" class="btn btn-primary" style="width: 100%; text-align: center;">
        Solicitar Orçamento
      </a>
    </div>
  `;
  
  widget.innerHTML = html;
  
  // Add event listener
  const select = widget.querySelector('#widgetSolutionType');
  select.addEventListener('change', function() {
    const basePrice = basePrices[this.value] || 0;
    const totalElement = widget.querySelector('#widgetTotalPrice');
    totalElement.textContent = formatCurrency(basePrice);
  });
}

// Initialize widget if exists
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createPriceCalculatorWidget);
} else {
  createPriceCalculatorWidget();
}

// Export functions for external use
if (typeof window !== 'undefined') {
  window.PriceCalculator = {
    getTotalPrice,
    resetCalculator,
    formatCurrency,
    basePrices,
    plusFeatures
  };
}
