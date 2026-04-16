function toggleMenu() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("open");
}

/* ❗ Auto close khi click ngoài */
document.addEventListener("click", (e) => {
  const sidebar = document.getElementById("sidebar");
  const button = document.getElementById("menu-btn");

  if (!sidebar || !button) return;

  const isClickInside = sidebar.contains(e.target) || button.contains(e.target);

  if (!isClickInside) {
    sidebar.classList.remove("open");
  }
});

/* ❗ Auto close khi chọn post */
function closeMenu() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.remove("open");
}
