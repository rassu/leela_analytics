const form = document.querySelector('#contact-form');
if (form) {
  const status = document.querySelector('#form-status');
  const button = form.querySelector('button[type="submit"]');
  const buttonText = button.querySelector('span');
  let pending = false;
  let previousPayload = '';
  let idempotencyKey = '';
  const setStatus = (message, state) => {
    status.textContent = message;
    status.dataset.state = state;
  };
  const clearErrors = () => {
    for (const field of form.querySelectorAll('[aria-invalid]')) {
      field.removeAttribute('aria-invalid');
      field.removeAttribute('aria-describedby');
    }
    for (const error of form.querySelectorAll('.field-error')) error.textContent = '';
  };
  form.addEventListener('input', event => {
    const field = event.target;
    if (field.hasAttribute('aria-invalid')) {
      field.removeAttribute('aria-invalid');
      field.removeAttribute('aria-describedby');
      const error = document.getElementById(field.id + '-error');
      if (error) error.textContent = '';
    }
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (pending || !form.reportValidity()) return;
    clearErrors();
    const payload = Object.fromEntries(['name','email','company','message','website'].map(name => [name,form.elements.namedItem(name).value.trim()]));
    const body = JSON.stringify(payload);
    if (body !== previousPayload || !idempotencyKey) {
      idempotencyKey = crypto.randomUUID();
      previousPayload = body;
    }
    pending = true;
    for (const field of form.querySelectorAll('input,textarea')) field.readOnly = true;
    button.disabled = true;
    buttonText.textContent = 'Sending…';
    form.setAttribute('aria-busy','true');
    setStatus('Sending your enquiry…','pending');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(),20000);
    try {
      const response = await fetch('/api/contact', {
        method:'POST',
        headers:{'Content-Type':'application/json','Idempotency-Key':idempotencyKey},
        body,
        signal:controller.signal
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) {
        if (response.status === 409) idempotencyKey = '';
        const fields = result.error?.fields || {};
        let firstInvalid = null;
        for (const [name,message] of Object.entries(fields)) {
          const field = form.elements.namedItem(name);
          const error = document.getElementById(name+'-error');
          if (field && error) {
            field.setAttribute('aria-invalid','true');
            field.setAttribute('aria-describedby',name+'-error');
            error.textContent = Array.isArray(message) ? message.join(' ') : String(message);
            firstInvalid ||= field;
          }
        }
        setStatus(result.error?.message || 'We couldn’t send your enquiry. Please try again or email hello@leelaanalytics.com.','error');
        (firstInvalid || status).focus();
        return;
      }
      form.reset();
      idempotencyKey = '';
      previousPayload = '';
      setStatus('Thank you. Your enquiry has been sent. We’ll reply to the email address you provided.','success');
      status.focus();
    } catch(error) {
      setStatus(error.name === 'AbortError'
        ? 'Delivery is taking longer than expected. Please retry with the same details, or email hello@leelaanalytics.com.'
        : 'We couldn’t confirm delivery. Check your connection and retry, or email hello@leelaanalytics.com.','error');
      status.focus();
    } finally {
      clearTimeout(timeout);
      pending = false;
      for (const field of form.querySelectorAll('input,textarea')) field.readOnly = false;
      button.disabled = false;
      buttonText.textContent = 'Send enquiry';
      form.removeAttribute('aria-busy');
    }
  });
}
