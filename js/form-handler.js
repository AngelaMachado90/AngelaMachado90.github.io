// Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
});

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Validar formulário
    if (!validateForm(form)) {
        showFormError(form);
        return;
    }
    
    // Desabilitar botão
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    
    // Simular envio (substituir por API real)
    setTimeout(() => {
        showFormSuccess(form);
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar Mensagem';
    }, 1000);
}

function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = '#ef4444';
        } else {
            field.style.borderColor = '';
        }
    });
    
    return isValid;
}

function showFormSuccess(form) {
    const successMsg = form.querySelector('#formSuccess');
    const errorMsg = form.querySelector('#formError');
    
    if (errorMsg) errorMsg.classList.add('hidden');
    if (successMsg) {
        successMsg.classList.remove('hidden');
        successMsg.style.display = 'flex';
        
        setTimeout(() => {
            successMsg.classList.add('hidden');
            successMsg.style.display = 'none';
        }, 5000);
    }
}

function showFormError(form) {
    const errorMsg = form.querySelector('#formError');
    const successMsg = form.querySelector('#formSuccess');
    
    if (successMsg) successMsg.classList.add('hidden');
    if (errorMsg) {
        errorMsg.classList.remove('hidden');
        errorMsg.style.display = 'flex';
        
        setTimeout(() => {
            errorMsg.classList.add('hidden');
            errorMsg.style.display = 'none';
        }, 5000);
    }
}


/**
 * Validate entire form
 */
function validateForm(form) {
  const requiredFields = form.querySelectorAll('[required]');
  let isValid = true;
  
  requiredFields.forEach(field => {
    if (!isFieldValid(field)) {
      isValid = false;
      field.style.borderColor = 'var(--accent-color)';
    } else {
      field.style.borderColor = '';
    }
  });
  
  return isValid;
}

/**
 * Validate individual field
 */
function validateField(event) {
  const field = event.target;
  
  if (!field.required && field.value === '') {
    field.style.borderColor = '';
    return;
  }
  
  if (isFieldValid(field)) {
    field.style.borderColor = 'var(--success-color)';
  } else {
    field.style.borderColor = 'var(--accent-color)';
  }
}

/**
 * Check if field is valid
 */
function isFieldValid(field) {
  const value = field.value.trim();
  const type = field.type;
  
  // Check if required field is empty
  if (field.required && !value) {
    return false;
  }
  
  // Check email format
  if (type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }
  
  // Check phone format (optional)
  if (type === 'tel' && value) {
    const phoneRegex = /^[\d\s\-\(\)]+$/;
    return phoneRegex.test(value) && value.replace(/\D/g, '').length >= 10;
  }
  
  // Check minimum length
  if (value && field.hasAttribute('minlength')) {
    const minLength = parseInt(field.getAttribute('minlength'));
    return value.length >= minLength;
  }
  
  return true;
}

/**
 * Show form success message
 */
function showFormSuccess(form) {
  const successMsg = form.querySelector('.form-success');
  const errorMsg = form.querySelector('.form-error');
  
  if (errorMsg) {
    errorMsg.style.display = 'none';
  }
  
  if (successMsg) {
    successMsg.style.display = 'block';
    successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      successMsg.style.display = 'none';
    }, 5000);
  }
}

/**
 * Show form error message
 */
function showFormError(form, message) {
  const errorMsg = form.querySelector('.form-error');
  const successMsg = form.querySelector('.form-success');
  
  if (successMsg) {
    successMsg.style.display = 'none';
  }
  
  if (errorMsg) {
    errorMsg.textContent = message;
    errorMsg.style.display = 'block';
    errorMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

/**
 * Mask input field (e.g., phone, date)
 */
function maskInput(input, mask) {
  input.addEventListener('input', function() {
    let value = this.value.replace(/\D/g, '');
    let maskedValue = '';
    let maskIndex = 0;
    
    for (let i = 0; i < mask.length; i++) {
      if (maskIndex >= value.length) break;
      
      if (mask[i] === '#') {
        maskedValue += value[maskIndex];
        maskIndex++;
      } else {
        maskedValue += mask[i];
        if (value[maskIndex] === mask[i]) {
          maskIndex++;
        }
      }
    }
    
    this.value = maskedValue;
  });
}

/**
 * Initialize phone input masking
 */
function initializePhoneMasks() {
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  phoneInputs.forEach(input => {
    // Brazilian phone mask: (##) #####-####
    maskInput(input, '(##) #####-####');
  });
}

// Initialize phone masks
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePhoneMasks);
} else {
  initializePhoneMasks();
}

/**
 * Prevent form submission if any required field is empty
 */
document.addEventListener('submit', function(e) {
  const form = e.target;
  if (!form.classList.contains('no-validation')) {
    const requiredFields = form.querySelectorAll('[required]');
    let hasEmpty = false;
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        hasEmpty = true;
        field.style.borderColor = 'var(--accent-color)';
      }
    });
    
    if (hasEmpty) {
      e.preventDefault();
    }
  }
}, true);
