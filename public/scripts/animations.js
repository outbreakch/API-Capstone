document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".weather-card");
  cards.forEach((card, i) => {
    setTimeout(() => {
      card.classList.add("reveal");
    }, i * 120); // 120ms stagger
  });
});
