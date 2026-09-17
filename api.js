window.jobPortalApi = {
  // Fetch jobs from RemoteOK API
  getJobs: function () {
    return fetch('https://remoteok.io/api')
      .then(response => response.json())
      .then(data => {
        // Transform RemoteOK data to match our structure
        const jobs = data.slice(1, 10).map((job, index) => ({
          id: index + 1,
          company: job.company || 'Unknown Company',
          title: job.title || 'Job Position',
          experience: job.experience || '2-5 years',
          salary: job.salary_max ? `$${job.salary_min || 0}k - $${job.salary_max}k` : 'Competitive',
          location: job.location || 'Remote',
          skills: (job.tag ? job.tag.split(', ') : ['Development']).slice(0, 3),
          logo: (job.company || 'Company').substring(0, 2).toUpperCase(),
          companyImage: `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(job.company || 'Company')}`
        }));
        return { success: true, data: jobs };
      })
      .catch(error => {
        console.error('Error fetching jobs:', error);
        // Fallback to local data if API fails
        return { success: true, data: window.jobPortalData.jobs };
      });
  },

  // Generate companies from fetched jobs
  getCompanies: function () {
    return this.getJobs().then(response => {
      if (response.data && response.data.length > 0) {
        const companies = [...new Map(
          response.data.map(job => [
            job.company,
            {
              id: Math.random(),
              name: job.company.split(' ')[0],
              tag: `${job.title.split(' ')[0]} roles`,
              image: job.companyImage
            }
          ])
        ).values()].slice(0, 6);
        
        return { success: true, data: companies.length > 0 ? companies : window.jobPortalData.companies };
      }
      return { success: true, data: window.jobPortalData.companies };
    });
  },

  // Fallback statistics based on remote job market
  getStatistics: function () {
    return new Promise((resolve) => {
      resolve({
        success: true,
        data: [
          { id: 1, value: 50, unit: 'K', suffix: '+', label: 'Jobs Available' },
          { id: 2, value: 10, unit: 'K', suffix: '+', label: 'Companies' },
          { id: 3, value: 100, unit: 'K', suffix: '+', label: 'Candidates' },
          { id: 4, value: 95, unit: '%', label: 'Success Rate' }
        ]
      });
    });
  },

  // Fetch testimonials from JSONPlaceholder
  getTestimonials: function () {
    return fetch('https://jsonplaceholder.typicode.com/comments?_limit=3')
      .then(response => response.json())
      .then(comments => {
        const testimonials = comments.map((comment, index) => ({
          id: index + 1,
          name: comment.name.split(' ')[0] || 'User',
          role: ['Head of Talent', 'Founder', 'People Operations'][index % 3],
          company: ['Northstar Labs', 'Vertex AI', 'Harbor Cloud'][index % 3],
          image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.id}`,
          review: comment.body.substring(0, 120) + '...'
        }));
        return { success: true, data: testimonials };
      })
      .catch(error => {
        console.error('Error fetching testimonials:', error);
        return { success: true, data: window.jobPortalData.testimonials };
      });
  },

  // Fetch FAQ from local data (can be extended with API)
  getFaq: function () {
    return new Promise((resolve) => {
      resolve({
        success: true,
        data: window.jobPortalData.faq
      });
    });
  },

  // Fetch categories (can be extended with real API)
  getCategories: function () {
    return new Promise((resolve) => {
      resolve({
        success: true,
        data: window.jobPortalData.categories
      });
    });
  }
};
