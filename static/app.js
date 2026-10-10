const movieForm = document.querySelector("#movie-form");

movieForm?.addEventListener("submit", (event) => {
  if (!movieForm.reportValidity()) {
    event.preventDefault();
    return;
  }

  const button = movieForm.querySelector('button[type="submit"]');
  if (!button) return;

  button.disabled = true;
  button.setAttribute("aria-busy", "true");
  const label = button.querySelector(".button-label");
  if (label) label.textContent = "Finding your next six…";
});

// Progressive enhancement: Style and manage the custom datalist dropdown
const movieInput = document.querySelector("#movie");
const datalist = document.querySelector("#movie-list");
const dropdown = document.querySelector("#movie-dropdown");

if (movieInput && datalist && dropdown) {
  // Extract titles from datalist options once, deduplicated
  const titles = [...new Set(
    Array.from(datalist.options)
      .map((opt) => opt.value.trim())
      .filter(Boolean)
  )];

  // Disable native OS popup so it doesn't fight the custom styled list
  movieInput.removeAttribute("list");

  let activeIndex = -1;
  let currentMatches = [];
  let debounceTimer = null;

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function renderDropdown(matches, query) {
    currentMatches = matches;
    activeIndex = -1;

    if (matches.length === 0) {
      if (query.length > 0) {
        dropdown.innerHTML = `<li class="movie-dropdown-empty">No films found matching "${escapeHtml(query)}"</li>`;
        dropdown.hidden = false;
      } else {
        dropdown.hidden = true;
      }
      return;
    }

    const regex = new RegExp(`(${escapeRegExp(query)})`, "gi");
    dropdown.innerHTML = matches
      .map((title, idx) => {
        const highlighted = escapeHtml(title).replace(regex, "<mark>$1</mark>");
        return `<li class="movie-dropdown-item" role="option" id="movie-opt-${idx}" data-index="${idx}" aria-selected="false">${highlighted}</li>`;
      })
      .join("");

    dropdown.hidden = false;
  }

  function updateActiveOption() {
    const items = dropdown.querySelectorAll(".movie-dropdown-item");
    items.forEach((item, idx) => {
      const isSelected = idx === activeIndex;
      item.classList.toggle("is-active", isSelected);
      item.setAttribute("aria-selected", isSelected ? "true" : "false");
      if (isSelected) {
        item.scrollIntoView({ block: "nearest" });
      }
    });
  }

  function selectTitle(title) {
    movieInput.value = title;
    dropdown.hidden = true;
    currentMatches = [];
    activeIndex = -1;
    movieInput.focus();
  }

  movieInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const query = movieInput.value.trim();
      if (query.length === 0) {
        dropdown.hidden = true;
        currentMatches = [];
        return;
      }

      const lowerQuery = query.toLowerCase();
      const startsWith = [];
      const contains = [];

      for (let i = 0; i < titles.length; i++) {
        const t = titles[i];
        const lowerT = t.toLowerCase();
        if (lowerT.startsWith(lowerQuery)) {
          startsWith.push(t);
          if (startsWith.length >= 8) break;
        } else if (lowerT.includes(lowerQuery)) {
          contains.push(t);
        }
      }

      const matches = [...startsWith, ...contains].slice(0, 4);
      renderDropdown(matches, query);
    }, 150);
  });

  movieInput.addEventListener("keydown", (event) => {
    if (dropdown.hidden || currentMatches.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      activeIndex = (activeIndex + 1) % currentMatches.length;
      updateActiveOption();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      activeIndex = (activeIndex - 1 + currentMatches.length) % currentMatches.length;
      updateActiveOption();
    } else if (event.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < currentMatches.length) {
        event.preventDefault();
        selectTitle(currentMatches[activeIndex]);
      }
    } else if (event.key === "Escape") {
      dropdown.hidden = true;
    }
  });

  // Prevent mousedown on dropdown from blurring the input,
  // which would hide the dropdown before click fires.
  dropdown.addEventListener("mousedown", (event) => {
    event.preventDefault();
  });

  // Select item on click (not pointerdown) so mobile touch works.
  dropdown.addEventListener("click", (event) => {
    const item = event.target.closest(".movie-dropdown-item");
    if (item && item.dataset.index !== undefined) {
      const idx = parseInt(item.dataset.index, 10);
      if (currentMatches[idx]) {
        selectTitle(currentMatches[idx]);
      }
    }
  });

  // Dismiss on click outside (not pointerdown) so mobile touch-start
  // doesn't race with the dropdown item handler.
  document.addEventListener("click", (event) => {
    if (!movieInput.contains(event.target) && !dropdown.contains(event.target)) {
      dropdown.hidden = true;
    }
  });
}
