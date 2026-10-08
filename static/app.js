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
