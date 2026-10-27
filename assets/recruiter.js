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
      tab.setAttribute("aria-pressed", String(isActive));
    });

    devices.forEach((device) => {
      device.classList.toggle("is-active", device.getAttribute("data-device") === target);
    });
  });
});

const projectSlides = [
  {
    name: "Fresh Soy Tempeh",
    type: "Product landing page",
    desktopImage: "images/work/fresh-soy-tempeh.png",
    phoneImage: "images/work/fresh-soy-tempeh-phone.png",
    desktopAlt: "Fresh Soy Tempeh desktop landing page preview",
    phoneAlt: "Fresh Soy Tempeh mobile landing page preview"
  },
  {
    name: "Mulan",
    type: "Restaurant website",
    desktopImage: "images/work/mulan.png",
    phoneImage: "images/work/mulan-phone.png",
    desktopAlt: "Mulan desktop restaurant website preview",
    phoneAlt: "Mulan mobile restaurant website preview"
  },
  {
    name: "Takapuna Beach Cafe",
    type: "Hospitality rebuild",
    desktopImage: "images/work/tbc.png",
    phoneImage: "images/work/tbc-phone.png",
    desktopAlt: "Takapuna Beach Cafe desktop website preview",
    phoneAlt: "Takapuna Beach Cafe mobile website preview"
  }
];

let currentSlide = 0;
const slideLabel = document.querySelector("[data-slide-label]");
const slideType = document.querySelector("[data-slide-type]");
const desktopSlideImage = document.querySelector("[data-slide-desktop-image]");
const phoneSlideImage = document.querySelector("[data-slide-phone-image]");

function renderSlide() {
  const slide = projectSlides[currentSlide];

  if (slideLabel) slideLabel.textContent = slide.name;
  if (slideType) slideType.textContent = slide.type;

  if (desktopSlideImage) {
    desktopSlideImage.src = slide.desktopImage;
    desktopSlideImage.alt = slide.desktopAlt;
  }

  if (phoneSlideImage) {
    phoneSlideImage.src = slide.phoneImage;
    phoneSlideImage.alt = slide.phoneAlt;
  }
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

const briefForm = document.querySelector("[data-brief-form]");

if (briefForm) {
  briefForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(briefForm);
    const fields = [
      ["Name", formData.get("name")],
      ["Email", formData.get("email")],
      ["Current website or profile", formData.get("website")],
      ["Project goal", formData.get("goal")],
      ["Target audience", formData.get("audience")],
      ["Timeline", formData.get("timeline")],
      ["Reference sites", formData.get("references")],
      ["Public case study", formData.get("public_case")]
    ];

    const body = fields
      .map(([label, value]) => `${label}:\n${String(value || "").trim() || "-"}`)
      .join("\n\n");

    const subject = encodeURIComponent("Website project brief");
    const encodedBody = encodeURIComponent(body);
    window.location.href = `mailto:ridho90@gmail.com?subject=${subject}&body=${encodedBody}`;
  });
}
