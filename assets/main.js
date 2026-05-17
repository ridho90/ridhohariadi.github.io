const revealNodes = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealNodes.forEach((node) => revealObserver.observe(node));
} else {
  revealNodes.forEach((node) => node.classList.add("is-visible"));
}

const yearNode = document.querySelector("[data-current-year]");
if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

const tabButtons = document.querySelectorAll("[data-device-tab]");
const devices = document.querySelectorAll("[data-device]");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.getAttribute("data-device-tab");

    tabButtons.forEach((tab) => {
      const isActive = tab === button;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });

    devices.forEach((device) => {
      device.classList.toggle("is-active", device.getAttribute("data-device") === target);
    });
  });
});

const projectSlides = [
  {
    name: "Harbour Lane Cafe",
    type: "Cafe demo",
    modifier: "",
    title: "Harbour Lane Cafe",
    body: "Fresh brunch, local coffee, opening hours, menu and directions visible without hunting."
  },
  {
    name: "North Shore Noodles",
    type: "Takeaway demo",
    modifier: "takeaway",
    title: "North Shore Noodles",
    body: "A direct mobile-first menu site for quick orders, phone calls, hours and location checks."
  }
];

let currentSlide = 0;
const slideLabel = document.querySelector("[data-slide-label]");
const slideType = document.querySelector("[data-slide-type]");
const mockHeroes = document.querySelectorAll("[data-mock-hero]");

function renderSlide() {
  const slide = projectSlides[currentSlide];

  if (slideLabel) slideLabel.textContent = slide.name;
  if (slideType) slideType.textContent = slide.type;

  mockHeroes.forEach((hero) => {
    hero.classList.toggle("takeaway", slide.modifier === "takeaway");
    const title = hero.querySelector("[data-mock-title]");
    const body = hero.querySelector("[data-mock-body]");
    if (title) title.textContent = slide.title;
    if (body) body.textContent = slide.body;
  });
}

document.querySelectorAll("[data-slide-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.getAttribute("data-slide-action");
    currentSlide = action === "next"
      ? (currentSlide + 1) % projectSlides.length
      : (currentSlide - 1 + projectSlides.length) % projectSlides.length;
    renderSlide();
  });
});

renderSlide();
