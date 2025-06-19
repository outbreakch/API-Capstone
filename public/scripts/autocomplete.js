// public/scripts/autocomplete.js

document.addEventListener("DOMContentLoaded", function () {
  const input = document.querySelector('input[name="city"]');
  const suggestionBox = document.createElement("div");
  suggestionBox.className = "suggestion-box";
  input.parentNode.appendChild(suggestionBox);

  let timeout;
  input.addEventListener("input", function () {
    clearTimeout(timeout);
    const value = input.value.trim();
    if (value.length < 2) {
      suggestionBox.innerHTML = "";
      return;
    }
    timeout = setTimeout(async () => {
      const res = await fetch(`/suggest?q=${encodeURIComponent(value)}`);
      const suggestions = await res.json();
      suggestionBox.innerHTML = "";
      suggestions.forEach((s) => {
        const div = document.createElement("div");
        div.className = "suggestion";
        div.textContent = `${s.name}, ${s.region || ""}, ${s.country_code}`;
        div.addEventListener("mousedown", () => {
          input.value = s.name;
          suggestionBox.innerHTML = "";
        });
        suggestionBox.appendChild(div);
      });
    }, 200);
  });

  // Hide suggestions when clicking outside
  document.addEventListener("click", (e) => {
    if (!suggestionBox.contains(e.target) && e.target !== input) {
      suggestionBox.innerHTML = "";
    }
  });
});
