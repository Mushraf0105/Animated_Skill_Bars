document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const skillsSection = document.getElementById('skills-section');
  const skillItems = document.querySelectorAll('.skill-item');
  const replayButton = document.getElementById('replay-btn');

  // Animation flag to prevent duplicate triggers
  let hasAnimated = false;

  /**
   * Animates a single skill item:
   * 1. Reads the target percentage from the `data-progress` attribute.
   * 2. Sets the CSS width property (triggering CSS transition).
   * 3. Animates the numeric counter smoothly from 0 to target.
   * 4. Updates ARIA accessibility attributes.
   *
   * @param {HTMLElement} item - The .skill-item container element
   */
  function animateSkill(item) {
    const progressFill = item.querySelector('.progress-fill');
    const percentageSpan = item.querySelector('.skill-percentage');
    const progressTrack = item.querySelector('.progress-track');

    if (!progressFill || !percentageSpan) return;

    // Read target percentage from HTML data attribute (configurable)
    const targetProgress = parseInt(progressFill.dataset.progress, 10) || 0;

    // 1. Trigger CSS transition on width
    progressFill.style.width = `${targetProgress}%`;

    // 2. Update accessibility attributes
    if (progressTrack) {
      progressTrack.setAttribute('aria-valuenow', targetProgress);
    }

    // 3. Animate percentage counter in sync with progress bar
    animateCounter(percentageSpan, targetProgress, 1400);
  }

  /**
   * Smoothly animates a numeric counter from 0 to target using requestAnimationFrame.
   *
   * @param {HTMLElement} element - The text element displaying the percentage
   * @param {number} target - The final target number (e.g., 90)
   * @param {number} duration - Animation duration in milliseconds
   */
  function animateCounter(element, target, duration = 1400) {
    let startTimestamp = null;
    const startValue = 0;

    function step(timestamp) {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      // Ease-out cubic timing function: 1 - pow(1 - x, 3)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(easeProgress * (target - startValue) + startValue);

      element.textContent = `${currentValue}%`;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element.textContent = `${target}%`;
      }
    }

    window.requestAnimationFrame(step);
  }

  /**
   * Triggers animation for all skill bars on the page.
   */
  function animateAllSkills() {
    skillItems.forEach((item, index) => {
      // Add slight staggered delay for a professional cascading visual effect
      setTimeout(() => {
        animateSkill(item);
      }, index * 80);
    });
    hasAnimated = true;
  }

  /**
   * Resets all skill bars and counters back to 0%.
   */
  function resetAllSkills() {
    skillItems.forEach((item) => {
      const progressFill = item.querySelector('.progress-fill');
      const percentageSpan = item.querySelector('.skill-percentage');
      const progressTrack = item.querySelector('.progress-track');

      if (progressFill) progressFill.style.width = '0%';
      if (percentageSpan) percentageSpan.textContent = '0%';
      if (progressTrack) progressTrack.setAttribute('aria-valuenow', '0');
    });
    hasAnimated = false;
  }

  /* ------------------------------------------------------------------------
     Scroll Detection via IntersectionObserver API
     ------------------------------------------------------------------------ */
  if ('IntersectionObserver' in window && skillsSection) {
    // Observer options: triggers when 25% of the skills section enters the viewport
    const observerOptions = {
      root: null, // viewport
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.25
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          animateAllSkills();
          // Unobserve after initial trigger so it doesn't repeatedly animate while browsing
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    observer.observe(skillsSection);
  } else {
    // Fallback for older browsers or immediate load: trigger with slight delay
    setTimeout(() => {
      animateAllSkills();
    }, 300);
  }

  /* ------------------------------------------------------------------------
     Replay Button Handler
     ------------------------------------------------------------------------ */
  if (replayButton) {
    replayButton.addEventListener('click', () => {
      replayButton.classList.add('animating');

      // Reset immediately
      resetAllSkills();

      // Trigger animation again after a micro-delay so DOM registers 0% first
      setTimeout(() => {
        animateAllSkills();
        setTimeout(() => {
          replayButton.classList.remove('animating');
        }, 800);
      }, 100);
    });
  }
});

