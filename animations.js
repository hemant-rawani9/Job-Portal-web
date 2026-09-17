window.jobPortalAnimations = {
  init: function () {
    if (!window.gsap) {
      return;
    }

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    if (ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    const loader = document.querySelector('.loader');
    const loaderBar = document.querySelector('.loader-bar');
    const topbar = document.querySelector('.topbar');
    const heroCopy = document.querySelector('.hero-copy');
    const heroVisual = document.querySelector('.hero-visual');
    const heroImage = document.querySelector('.hero-image');
    const trustItems = document.querySelectorAll('.trust-list li');

    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

    timeline
      .to(loaderBar, { scaleX: 1, duration: 1.05 })
      .to(loader, { autoAlpha: 0, duration: 0.4 }, '-=0.15')
      .from(heroCopy, { opacity: 0, y: 24, duration: 0.8 }, '-=0.2')
      .from(heroVisual, { opacity: 0, y: 24, duration: 0.8 }, '-=0.55')
      .from(trustItems, { opacity: 0, y: 10, duration: 0.45, stagger: 0.08 }, '-=0.35');

    if (ScrollTrigger && topbar) {
      ScrollTrigger.create({
        start: 'top -40',
        end: 'top -80',
        toggleClass: { targets: '.topbar', className: 'scrolled' }
      });
    }

    gsap.to('.orb', {
      y: '+=10',
      repeat: -1,
      yoyo: true,
      duration: 3.2,
      ease: 'sine.inOut',
      stagger: 0.15
    });

    if (heroImage) {
      gsap.to(heroImage, {
        scale: 1.03,
        repeat: -1,
        yoyo: true,
        duration: 3.5,
        ease: 'sine.inOut'
      });
    }

    gsap.to('.hero-info-card', {
      y: '+=8',
      repeat: -1,
      yoyo: true,
      duration: 2.8,
      ease: 'sine.inOut'
    });
  }
};
