/* ========================================
   FORM-HANDLER.JS - Form Submission & Validation
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
  initializeFormHandling();
});

/**
 * Initialize form handling for all forms on page
 */
function initializeFormHandling() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', handleFormSubmit);
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', validateField);
      input.addEventListener('change', validateField);
    });
  });
}

/**
 * Handle form submission
 */
function handleFormSubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const formData = new FormData(form);
  
  // Validate all fields
  const isValid = validateForm(form);
  
  if (!isValid) {
    showFormError(form, 'Por favor, preencha todos os campos obrigatórios corretamente.');
    return;
  }
  
  // Show loading state
  const submitBtn = form.querySelector('input[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.classList.add('btn-loading');
    submitBtn.value = 'Enviando...';
  }
  
  // Submit form via Formspree
  submitFormViaFormspree(form, formData, submitBtn);
}

/**
 * Submit form via Formspree
 */
function submitFormViaFormspree(form, formData, submitBtn) {
  const formAction = 'https://formspree.io/f/xyzaabbcc'; // Replace with your Formspree ID
  
  fetch(formAction, {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  })
  .then(response => {
    if (response.ok) {
      showFormSuccess(form);
      form.reset();
      
      // Reset button state
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn-loading');
        submitBtn.value = 'Enviar Mensagem';
      }
    } else {
      showFormError(form, 'Erro ao enviar formulário. Tente novamente.');
      resetFormSubmitBtn(submitBtn);
    }
  })
  .catch(error => {
    console.error('Form submission error:', error);
    showFormError(form, 'Erro de conexão. Tente novamente mais tarde.');
    resetFormSubmitBtn(submitBtn);
  });
}

/**
 * Reset form submit button
 */
function resetFormSubmitBtn(submitBtn) {
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.classList.remove('btn-loading');
    submitBtn.value = 'Enviar Mensagem';
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
