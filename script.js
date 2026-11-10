const menuButton = document.getElementById("menu-toggle");
const navigation = document.getElementById("main-menu");

function closeMenu() {
  navigation.classList.remove("open");
  menuButton.classList.remove("active");

  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute(
    "aria-label",
    "Open navigation menu"
  );
}

function toggleMenu() {
  navigation.classList.toggle("open");
  menuButton.classList.toggle("active");

  const isOpen = navigation.classList.contains("open");

  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu"
  );
}

menuButton.addEventListener("click", toggleMenu);

const navigationLinks = navigation.querySelectorAll("a");

navigationLinks.forEach(function(link) {
  link.addEventListener("click", closeMenu);
});


const themeButton = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const themeLabel = document.getElementById("theme-label");

function setTheme(isDark) {
  document.body.classList.toggle("dark-mode", isDark);

  if (isDark) {
    themeIcon.textContent = "☀";
    themeLabel.textContent = "Light";
    themeButton.setAttribute(
      "aria-label",
      "Switch to light mode"
    );
  } else {
    themeIcon.textContent = "☾";
    themeLabel.textContent = "Dark";
    themeButton.setAttribute(
      "aria-label",
      "Switch to dark mode"
    );
  }

  themeButton.setAttribute("aria-pressed", String(isDark));
}

themeButton.addEventListener("click", function() {
  const isDark = !document.body.classList.contains("dark-mode");

  setTheme(isDark);

  try {
    localStorage.setItem(
      "portfolio-theme",
      isDark ? "dark" : "light"
    );
  } catch (error) {
    // Theme works without storage
  }
});

let savedTheme = null;

try {
  savedTheme = localStorage.getItem("portfolio-theme");
} catch (error) {
  // Default to light mode
}

setTheme(savedTheme === "dark");

const form = document.getElementById("contact-form");
const sendButton = document.getElementById("send-button");
const formStatus = document.getElementById("form-status");

const formEndpoint = "https://formspree.io/f/mdeeqglg";

form.addEventListener("submit", async function(event) {
  event.preventDefault();

  formStatus.textContent = "";
  formStatus.className = "";

  if (formEndpoint.includes("YOUR_FORM_ID")) {
    formStatus.textContent =
      "Please connect your Formspree form first.";
    formStatus.className = "error";
    return;
  }

  sendButton.disabled = true;
  sendButton.textContent = "Sending...";

  try {
    const formData = new FormData(form);

    const response = await fetch(formEndpoint, {
      method: "POST",
      body: formData,
      headers: {
        "Accept": "application/json"
      }
    });

    if (response.ok) {
      formStatus.textContent =
        "Your message was submitted successfully!";
      formStatus.className = "success";
      form.reset();
    } else {
      formStatus.textContent =
        "The message could not be sent. Please try again.";
      formStatus.className = "error";
    }
  } catch (error) {
    formStatus.textContent =
      "Connection error. Please check your internet and try again.";
    formStatus.className = "error";
  } finally {
    sendButton.disabled = false;
    sendButton.textContent = "Send Message";
  }
});


// Lesson 19: accessible subject tabs
const subjectTabs = [...document.querySelectorAll('.subject-tab')];
const subjectPanels = [...document.querySelectorAll('.subject-panel')];
function selectSubject(index) {
  subjectTabs.forEach((tab, i) => {
    tab.setAttribute('aria-selected', String(i === index));
    tab.tabIndex = i === index ? 0 : -1;
    subjectPanels[i].hidden = i !== index;
  });
}
subjectTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectSubject(index));
  tab.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const next = (index + direction + subjectTabs.length) % subjectTabs.length;
    selectSubject(next);
    subjectTabs[next].focus();
  });
});

// Lesson 19: project filters
const projectFilters = [...document.querySelectorAll('.project-filter')];
const projectCards = [...document.querySelectorAll('.project-card')];
projectFilters.forEach(button => {
  button.addEventListener('click', () => {
    const category = button.dataset.filter;
    projectFilters.forEach(filter => {
      const active = filter === button;
      filter.classList.toggle('active', active);
      filter.setAttribute('aria-pressed', String(active));
    });
    projectCards.forEach(card => {
      card.hidden = category !== 'all' && card.dataset.category !== category;
    });
  });
});

// Lesson 19: count-up statistics on first scroll into view
const stats = document.querySelector('.stats');
if (stats) {
  const counters = [...stats.querySelectorAll('[data-count]')];
  function animateStats() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      counters.forEach(counter => counter.textContent = counter.dataset.count);
      return;
    }
    counters.forEach(counter => {
      const target = Number(counter.dataset.count);
      let start = null;
      function frame(timestamp) {
        if (start === null) start = timestamp;
        const progress = Math.min((timestamp - start) / 1000, 1);
        counter.textContent = String(Math.round(target * progress));
        if (progress < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    });
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        animateStats();
        observer.disconnect();
      }
    }, { threshold: 0.15 });
    observer.observe(stats);
  } else {
    animateStats();
  }
}
