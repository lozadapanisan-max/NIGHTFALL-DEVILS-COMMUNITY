/* =========================================================
   NIGHTFALL DEVILS COMMUNITY
   MAIN JAVASCRIPT
========================================================= */


/* =========================
   MOBILE MENU
========================= */

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

if (menuBtn && navLinks) {

  menuBtn.addEventListener("click", () => {

    navLinks.classList.toggle("active");

    if (navLinks.classList.contains("active")) {
      menuBtn.textContent = "✕";
    } else {
      menuBtn.textContent = "☰";
    }

  });


  /* Close menu when clicking a link */

  const links = navLinks.querySelectorAll("a");

  links.forEach(link => {

    link.addEventListener("click", () => {

      navLinks.classList.remove("active");

      menuBtn.textContent = "☰";

    });

  });

}


/* =========================
   JOIN REQUEST FORM
========================= */

const joinForm = document.getElementById("joinForm");
const result = document.getElementById("result");

if (joinForm) {

  joinForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const username =
      document.getElementById("username").value.trim();

    const referrer =
      document.getElementById("referrer").value.trim();

    const message =
      document.getElementById("message").value.trim();


    if (!username || !referrer) {

      if (result) {

        result.textContent =
          "⚠️ Please complete the required fields.";

        result.style.color = "#ff5b60";

      }

      return;

    }


    /*
      CURRENTLY DEMO ONLY

      The request is not yet connected
      to Firebase or a database.
    */

    console.log("NIGHTFALL DEVILS JOIN REQUEST");

    console.log({
      username: username,
      referrer: referrer,
      message: message,
      date: new Date().toISOString()
    });


    if (result) {

      result.textContent =
        "✅ Request received! Please wait for Admin approval.";

      result.style.color = "#5cff91";

    }


    joinForm.reset();

  });

}


/* =========================
   SMOOTH SCROLL
========================= */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

  anchor.addEventListener("click", function (event) {

    const targetId = this.getAttribute("href");

    if (!targetId || targetId === "#") {
      return;
    }

    const target =
      document.querySelector(targetId);

    if (!target) {
      return;
    }

    event.preventDefault();

    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  });

});


/* =========================
   HEADER SCROLL EFFECT
========================= */

const header =
  document.querySelector(".site-header");

if (header) {

  window.addEventListener("scroll", () => {

    if (window.scrollY > 20) {

      header.style.boxShadow =
        "0 8px 30px rgba(0, 0, 0, 0.35)";

    } else {

      header.style.boxShadow = "none";

    }

  });

}


/* =========================
   CURRENT YEAR
========================= */

const currentYear =
  new Date().getFullYear();

console.log(
  `NIGHTFALL DEVILS © ${currentYear}`
);


/* =========================
   PAGE LOADED
========================= */

document.addEventListener("DOMContentLoaded", () => {

  console.log(
    "👿 NIGHTFALL DEVILS website loaded."
  );

});
