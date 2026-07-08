document.addEventListener('DOMContentLoaded', () => {

  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

  // Add a click event on each of them
  $navbarBurgers.forEach( el => {
    el.addEventListener('click', () => {

      // Get the target from the "data-target" attribute
      const target = el.dataset.target;
      const $target = document.getElementById(target);

      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      el.classList.toggle('is-active');
      $target.classList.toggle('is-active');

    });
  });

});

document.addEventListener("DOMContentLoaded", () => {
  const lightbox = document.getElementById("gallery-lightbox");
  const lightboxImg = document.getElementById("lightbox-target-img");
  const prevBtn = document.getElementById("lightbox-prev");
  const nextBtn = document.getElementById("lightbox-next");

  // Create a true array of all processed images to track indices
  const allImages = Array.from(document.querySelectorAll(".gallery-img"));
  let currentIndex = -1;

  const isTabletOrLarger = () => window.matchMedia("(min-width: 769px)").matches;

  // Central function to update the lightbox state
  const updateLightbox = (index) => {
    if (index < 0 || index >= allImages.length) return;
    
    currentIndex = index;
    const targetImg = allImages[currentIndex];
    
    lightboxImg.src = targetImg.getAttribute("data-lightbox-src");
    lightboxImg.alt = targetImg.getAttribute("data-lightbox-alt") || "";
  };

  // 1. Map initial trigger clicks
  allImages.forEach((img, index) => {
    if (isTabletOrLarger()) {
      img.style.cursor = "pointer";
    }

    img.addEventListener("click", () => {
      if (!isTabletOrLarger()) return;

      updateLightbox(index);
      lightbox.classList.add("is-active");
      document.documentElement.classList.add("is-clipped");
    });
  });

  // 2. Cyclic Navigation Engine (Loops around at start/end)
  const navigate = (direction) => {
    let newIndex = currentIndex + direction;
    if (newIndex < 0) newIndex = allImages.length - 1;
    if (newIndex >= allImages.length) newIndex = 0;
    
    updateLightbox(newIndex);
  };

  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Stops the modal from instantly closing
    navigate(-1);
  });

  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    navigate(1);
  });

  // 3. Clean Close Mechanism
  const closeModal = () => {
    lightbox.classList.remove("is-active");
    document.documentElement.classList.remove("is-clipped");
    lightboxImg.src = ""; 
    lightboxImg.alt = ""; 
    currentIndex = -1;
  };

  lightbox.addEventListener("click", (e) => {
    // Only close if clicking outside the image asset AND not clicking navigation arrows
    if (
      e.target.id !== "lightbox-target-img" && 
      !e.target.classList.contains("lightbox-nav-btn")
    ) {
      closeModal();
    }
  });

  // 4. Keyboard Listener for Power Users
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-active")) return;

    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowLeft") navigate(-1);
    if (e.key === "ArrowRight") navigate(1);
  });
});