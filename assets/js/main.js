// Portfolio navigation and email-enabled contact form (GitHub Pages compatible)
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');
if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const open = navigation.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  });
  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navigation.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation menu');
    });
  });
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
if (contactForm && formStatus) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton ? submitButton.textContent.trim() : 'Send Message';
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }
    formStatus.textContent = 'Sending your message securely...';
    formStatus.className = 'form-status is-sending';

    // FormSubmit's AJAX endpoint works with static hosting; no private API key needed.
    const payload = Object.fromEntries(new FormData(contactForm).entries());
    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (result.success === true || result.success === 'true') {
        contactForm.reset();
        formStatus.textContent = 'Thank you! Your message has been sent. I will get back to you soon.';
        formStatus.className = 'form-status is-success';
      } else {
        formStatus.textContent = result.message || 'Sorry, your message could not be sent. Please try again or email me directly.';
        formStatus.className = 'form-status is-error';
      }
    } catch (error) {
      formStatus.textContent = 'There was a connection problem. Please try again or email dariusthompson804@gmail.com directly.';
      formStatus.className = 'form-status is-error';
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    }
  });
}
