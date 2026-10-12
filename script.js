// ========================================
// SIMASA'S DEVELOPER PORTFOLIO
// ========================================

// Mobile navigation

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.textContent = isOpen ? "✕" : "☰";
    });
}

// Close the mobile menu after clicking a link

if (navLinks) {
    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
            if (menuToggle) {
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.textContent = "☰";
            }
        });
    });
}

// Animated network background

const canvas = document.getElementById("network-canvas");
const ctx = canvas.getContext("2d");

let width = 0;
let height = 0;
let nodes = [];
let animationFrame;
let lastFrameTime = 0;

const motionPreference = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
);

const mobileScreen = window.matchMedia("(max-width: 760px)");

function createNodes() {
    const spacing = mobileScreen.matches ? 115 : 145;

    const columns = Math.ceil(width / spacing);
    const rows = Math.ceil(height / spacing);

    nodes = [];

    for (let row = 0; row <= rows; row++) {
        for (let col = 0; col <= columns; col++) {
            nodes.push({
                x: col * spacing + (Math.random() - 0.5) * 45,
                y: row * spacing + (Math.random() - 0.5) * 45,
                originX: col * spacing,
                originY: row * spacing,
                phase: Math.random() * Math.PI * 2,
                radius: Math.random() > 0.7 ? 2 : 1.2
            });
        }
    }
}

function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    createNodes();
    drawNetwork(0);
}

function drawNetwork(time) {
    ctx.clearRect(0, 0, width, height);

    const reducedMotion = motionPreference.matches;

    nodes.forEach((node) => {
        if (!reducedMotion) {
            node.x = node.originX +
                Math.sin(time * 0.00035 + node.phase) * 10;

            node.y = node.originY +
                Math.cos(time * 0.0003 + node.phase) * 10;
        } else {
            node.x = node.originX;
            node.y = node.originY;
        }
    });

    // Draw connections between nearby nodes.

    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const a = nodes[i];
            const b = nodes[j];

            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 165) {
                const opacity = (1 - distance / 165) * 0.18;

                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);

                ctx.strokeStyle = `rgba(200, 255, 101, ${opacity})`;
                ctx.lineWidth = 0.7;
                ctx.stroke();
            }
        }
    }

    // Draw the network nodes.

    nodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);

        ctx.fillStyle = "rgba(200, 255, 101, 0.65)";
        ctx.fill();
    });
}

function animate(time) {
    if (time - lastFrameTime >= 40) {
        drawNetwork(time);
        lastFrameTime = time;
    }

    if (!motionPreference.matches) {
        animationFrame = requestAnimationFrame(animate);
    }
}

function startAnimation() {
    cancelAnimationFrame(animationFrame);

    if (motionPreference.matches) {
        drawNetwork(0);
        return;
    }

    animationFrame = requestAnimationFrame(animate);
}

window.addEventListener("resize", resizeCanvas);

motionPreference.addEventListener("change", startAnimation);

resizeCanvas();
startAnimation();

console.log("Welcome to Simasa's portfolio!");

// ========================================
// SCROLL REVEALS FOR ALL MAIN SECTIONS
// ========================================

// Keep existing .reveal markup and gently reveal key section content too.
const autoRevealSelectors = [
    ".about-section .section-label",
    ".about-section h2",
    ".about-layout > *",
    ".projects-heading > *",
    ".featured-projects > .project-card",
    ".small-projects-grid > *",
    ".skills-section .section-label",
    ".skills-section h2",
    ".skills-grid > *",
    ".contact-topline > *",
    ".contact-main > *",
    ".contact-details > *",
    ".contact-closing > *"
];

autoRevealSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element) => {
        if (!element.classList.contains("reveal") && !element.closest(".hero")) {
            element.classList.add("reveal");
        }
    });
});

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.10, rootMargin: "0px 0px -35px 0px" });

    revealElements.forEach((element, index) => {
        // Small stagger for adjacent cards, capped to keep the page snappy.
        if (element.matches(".project-card, .small-project-card, .skills-grid > *, .about-layout > *")) {
            element.style.transitionDelay = `${Math.min(index % 5, 4) * 75}ms`;
        }
        revealObserver.observe(element);
    });
} else {
    revealElements.forEach((element) => element.classList.add("visible"));
}

// ========================================
// ANIMATED HERO ROLE TEXT
// ========================================

const heroRole = document.getElementById("hero-role");
const roles = [
    "Building ideas",
    "Exploring AI",
    "Designing systems",
    "Creating impact"
];

if (heroRole && !motionPreference.matches) {
    let roleIndex = 0;
    window.setInterval(() => {
        heroRole.classList.add("role-changing");
        window.setTimeout(() => {
            roleIndex = (roleIndex + 1) % roles.length;
            heroRole.textContent = roles[roleIndex];
            heroRole.classList.remove("role-changing");
        }, 190);
    }, 2800);
}

// ========================================
// ACTIVE NAVIGATION + BACK TO TOP
// ========================================

const sectionLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const pageSections = sectionLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

function setActiveNavigation(sectionId) {
    sectionLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${sectionId}`;
        link.classList.toggle("active", isActive);
        if (isActive) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
    });
}

if ("IntersectionObserver" in window && pageSections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
        const visibleEntries = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visibleEntries.length) setActiveNavigation(visibleEntries[0].target.id);
    }, { rootMargin: "-22% 0px -58% 0px", threshold: [0, 0.1, 0.25, 0.5] });
    pageSections.forEach((section) => sectionObserver.observe(section));
}

const backToTop = document.getElementById("back-to-top");
function updateBackToTop() {
    if (backToTop) backToTop.classList.toggle("visible", window.scrollY > 500);
}
window.addEventListener("scroll", updateBackToTop, { passive: true });
updateBackToTop();

if (backToTop) {
    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: motionPreference.matches ? "auto" : "smooth" });
    });
}

const yearElement = document.getElementById("current-year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}