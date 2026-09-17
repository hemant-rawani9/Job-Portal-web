window.jobPortalRender = {
  createFeaturedHeader: function () {
    const header = document.createElement('div');
    header.className = 'featured-header';
    header.innerHTML = `
      <div>
        <span class="eyebrow">Featured jobs</span>
        <h2>Fresh startup roles worth applying to.</h2>
        <p>Handpicked openings from modern teams hiring across design, product, and engineering.</p>
      </div>
      <a class="button button-ghost" href="#join">View all</a>
    `;
    return header;
  },

  renderCategories: function (container, categories) {
    container.innerHTML = '';

    categories.forEach((category) => {
      const item = document.createElement('li');
      item.innerHTML = `<a href="#jobs">${category}</a>`;
      container.appendChild(item);
    });
  },

  initCategories: async function (containerId) {
    const container = document.getElementById(containerId || 'footer-categories');
    if (!container) {
      return;
    }

    try {
      const response = await window.jobPortalApi.getCategories();
      this.renderCategories(container, response.data);
    } catch (error) {
      container.innerHTML = '<li>Categories loading</li>';
    }
  },

  renderStatistics: function (container, stats) {
    container.innerHTML = '';

    stats.forEach((stat) => {
      const card = document.createElement('article');
      card.className = 'stat-card';
      card.innerHTML = `
        <strong class="stat-number" data-value="${stat.value}" data-unit="${stat.unit || ''}" data-prefix="${stat.prefix || ''}" data-suffix="${stat.suffix || ''}">0</strong>
        <span>${stat.label}</span>
      `;
      container.appendChild(card);
    });
  },

  initStatistics: async function (containerId) {
    const container = document.getElementById(containerId || 'stats-list');
    if (!container) {
      return;
    }

    try {
      const response = await window.jobPortalApi.getStatistics();
      this.renderStatistics(container, response.data);

      const cards = container.querySelectorAll('.stat-card');
      cards.forEach((card, index) => {
        const number = card.querySelector('.stat-number');
        const targetValue = Number(number.dataset.value);
        const unit = number.dataset.unit || '';
        const prefix = number.dataset.prefix || '';
        const suffix = number.dataset.suffix || '';

        const formatValue = (value) => `${prefix}${value}${unit}${suffix}`;

        if (window.gsap) {
          gsap.fromTo(
            card,
            { opacity: 0, y: 18 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              delay: index * 0.08,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 90%'
              }
            }
          );

          gsap.to(number, {
            duration: 1.4,
            textContent: targetValue,
            ease: 'power2.out',
            snap: { textContent: 1 },
            scrollTrigger: {
              trigger: card,
              start: 'top 90%'
            },
            onUpdate: function () {
              const current = Math.round(Number(this.targets()[0].textContent));
              this.targets()[0].textContent = formatValue(current);
            }
          });
        }
      });
    } catch (error) {
      container.innerHTML = '<div class="state-card"><h3>Statistics are loading.</h3></div>';
    }
  },

  renderTestimonials: function (container, testimonials) {
    container.innerHTML = '';

    testimonials.forEach((testimonial) => {
      const card = document.createElement('article');
      card.className = 'testimonial-card';
      const avatarMarkup = testimonial.image
        ? `<img src="${testimonial.image}" alt="${testimonial.name}" />`
        : `<span>${testimonial.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}</span>`;

      card.innerHTML = `
        <div class="testimonial-avatar">${avatarMarkup}</div>
        <p>“${testimonial.review}”</p>
        <div class="testimonial-meta">
          <strong>${testimonial.name}</strong>
          <span>${testimonial.role} · ${testimonial.company}</span>
        </div>
      `;
      container.appendChild(card);
    });
  },

  initTestimonials: async function (containerId) {
    const container = document.getElementById(containerId || 'testimonials-list');
    if (!container) {
      return;
    }

    try {
      const response = await window.jobPortalApi.getTestimonials();
      this.renderTestimonials(container, response.data);

      if (window.gsap) {
        gsap.fromTo(
          container.querySelectorAll('.testimonial-card'),
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: container,
              start: 'top 90%'
            }
          }
        );
      }
    } catch (error) {
      container.innerHTML = '<div class="state-card"><h3>Testimonials are loading.</h3></div>';
    }
  },

  renderFaq: function (container, faqItems) {
    container.innerHTML = '';

    faqItems.forEach((item, index) => {
      const faqItem = document.createElement('div');
      faqItem.className = 'faq-item';
      faqItem.innerHTML = `
        <button class="faq-question" type="button" aria-expanded="${index === 0}">
          <span>${item.question}</span>
          <span class="faq-toggle">+</span>
        </button>
        <div class="faq-answer" style="height:${index === 0 ? 'auto' : '0px'}; opacity:${index === 0 ? '1' : '0'}">
          <p>${item.answer}</p>
        </div>
      `;

      const button = faqItem.querySelector('.faq-question');
      const answer = faqItem.querySelector('.faq-answer');

      button.addEventListener('click', () => {
        const isOpen = faqItem.classList.contains('active');
        const items = container.querySelectorAll('.faq-item');

        items.forEach((entry) => {
          entry.classList.remove('active');
          const entryButton = entry.querySelector('.faq-question');
          const entryAnswer = entry.querySelector('.faq-answer');
          entryButton.setAttribute('aria-expanded', 'false');
          if (window.gsap) {
            gsap.to(entryAnswer, { height: 0, opacity: 0, duration: 0.3, ease: 'power2.out' });
          } else {
            entryAnswer.style.height = '0px';
            entryAnswer.style.opacity = '0';
          }
        });

        if (!isOpen) {
          faqItem.classList.add('active');
          button.setAttribute('aria-expanded', 'true');
          if (window.gsap) {
            gsap.to(answer, { height: answer.scrollHeight, opacity: 1, duration: 0.3, ease: 'power2.out' });
          } else {
            answer.style.height = `${answer.scrollHeight}px`;
            answer.style.opacity = '1';
          }
        }
      });

      container.appendChild(faqItem);
    });
  },

  initFaq: async function (containerId) {
    const container = document.getElementById(containerId || 'faq-list');
    if (!container) {
      return;
    }

    try {
      const response = await window.jobPortalApi.getFaq();
      this.renderFaq(container, response.data);

      if (window.gsap) {
        gsap.fromTo(
          container.querySelectorAll('.faq-item'),
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: container,
              start: 'top 90%'
            }
          }
        );
      }
    } catch (error) {
      container.innerHTML = '<div class="state-card"><h3>FAQ is loading.</h3></div>';
    }
  },

  renderCompanies: function (container, companies) {
    container.innerHTML = '';

    const shell = document.createElement('div');
    shell.className = 'companies-shell';

    shell.innerHTML = `
      <div class="companies-head">
        <div>
          <span class="eyebrow">Trusted by founders</span>
          <h3>Teams that value quality hires and fast momentum.</h3>
        </div>
        <p>From early-stage startups to fast-growth scaleups, the right opportunities are already here.</p>
      </div>
    `;

    const track = document.createElement('div');
    track.className = 'marquee-track';

    const content = [...companies, ...companies];
    content.forEach((company) => {
      const initials = (company.name || 'CO')
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

      const pill = document.createElement('div');
      pill.className = 'company-pill';
      const logoMarkup = company.image
        ? `<img src="${company.image}" alt="${company.name}" />`
        : `<div class="company-pill__logo">${initials}</div>`;

      pill.innerHTML = `
        <div class="company-pill__logo">${logoMarkup}</div>
        <div class="company-pill__copy">
          <strong>${company.name}</strong>
          <span>${company.tag || 'Hiring now'}</span>
        </div>
      `;
      track.appendChild(pill);
    });

    shell.appendChild(track);
    container.appendChild(shell);
  },

  initCompanies: async function (containerId) {
    const container = document.getElementById(containerId || 'companies-list');
    if (!container) {
      return;
    }

    try {
      const response = await window.jobPortalApi.getCompanies();
      this.renderCompanies(container, response.data);

      if (window.gsap && window.ScrollTrigger) {
        gsap.fromTo(
          container,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: container,
              start: 'top 85%'
            }
          }
        );
      }

      const track = container.querySelector('.marquee-track');
      if (track && window.gsap) {
        gsap.to(track, {
          x: '-50%',
          duration: 18,
          ease: 'none',
          repeat: -1
        });
      }
    } catch (error) {
      container.innerHTML = '<div class="state-card"><h3>Trusted companies are loading.</h3></div>';
    }
  },

  renderLoading: function (container) {
    container.innerHTML = '';
    container.appendChild(this.createFeaturedHeader());

    const skeletonGrid = document.createElement('div');
    skeletonGrid.className = 'jobs-grid';
    const skeletonCount = 3;

    for (let i = 0; i < skeletonCount; i += 1) {
      const skeleton = document.createElement('div');
      skeleton.className = 'skeleton-card';
      skeleton.innerHTML = `
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
      `;
      skeletonGrid.appendChild(skeleton);
    }

    container.appendChild(skeletonGrid);
  },

  renderError: function (container, retryFn) {
    container.innerHTML = '';
    container.appendChild(this.createFeaturedHeader());

    const state = document.createElement('div');
    state.className = 'state-card';
    state.innerHTML = `
      <h3>We couldn’t load featured jobs.</h3>
      <p>Please try again in a moment.</p>
      <button type="button">Retry</button>
    `;

    state.querySelector('button').addEventListener('click', retryFn);
    container.appendChild(state);
  },

  renderJobs: function (container, jobs) {
    container.innerHTML = '';
    container.appendChild(this.createFeaturedHeader());

    const grid = document.createElement('div');
    grid.className = 'jobs-grid';

    jobs.forEach((job) => {
      const card = document.createElement('article');
      card.className = 'job-card';
      card.innerHTML = `
        <div class="job-card__top">
          <div class="job-card__logo">
            <img src="${job.companyImage || ''}" alt="${job.company} logo" />
          </div>
          <div class="job-card__meta">
            <strong>${job.company}</strong>
            <span>${job.location}</span>
          </div>
        </div>
        <h3>${job.title}</h3>
        <div class="job-card__details">
          <div><span>Experience</span><strong>${job.experience}</strong></div>
          <div><span>Salary</span><strong>${job.salary}</strong></div>
        </div>
        <div class="job-card__skills">
          ${job.skills.map((skill) => `<span>${skill}</span>`).join('')}
        </div>
        <div class="job-card__actions">
          <span class="salary">${job.salary}</span>
          <button type="button">Apply</button>
        </div>
      `;
      grid.appendChild(card);
    });

    container.appendChild(grid);
  },

  init: async function (containerId) {
    const container = document.getElementById(containerId || 'jobs-list');
    if (!container) {
      return;
    }

    this.renderLoading(container);

    try {
      const response = await window.jobPortalApi.getJobs();
      this.renderJobs(container, response.data);
    } catch (error) {
      this.renderError(container, () => this.init(containerId));
    }
  }
};
