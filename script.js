document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const topNav = document.querySelector('.topnav');

  if (menuToggle && topNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = topNav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  if (window.jobPortalAnimations) {
    window.jobPortalAnimations.init();
  }

  if (window.jobPortalRender) {
    window.jobPortalRender.init('jobs-list');
    window.jobPortalRender.initCompanies('companies-list');
    window.jobPortalRender.initStatistics('stats-list');
    window.jobPortalRender.initTestimonials('testimonials-list');
    window.jobPortalRender.initFaq('faq-list');
    window.jobPortalRender.initCategories('footer-categories');
  }
});
