const state = {
  theme: 'dark',
  lang: 'vi'
};

const overlay = document.getElementById('overlay');

const toggleSide = (id, e) => {
  e.stopPropagation();
  closeAll();
  document.getElementById(id).classList.add('show');
  overlay.classList.add('show');
};

const closeAll = () => {
  document.querySelectorAll('.side-drawer')
    .forEach(el => el.classList.remove('show'));
  overlay.classList.remove('show');
};

/* GROUP TOGGLE */
document.querySelectorAll('.group-header').forEach(header => {
  header.onclick = () => {
    const group = header.parentElement;
    group.classList.toggle('open');
  };
});

/* OPTIONS */
const setupOptions = () => {
  document.querySelectorAll('#theme-options .option-card').forEach(el => {
    el.onclick = () => {
      document.querySelectorAll('#theme-options .option-card')
        .forEach(e => e.classList.remove('active'));
      el.classList.add('active');
      state.theme = el.dataset.value;
      document.body.className = 'theme-' + state.theme;
    };
  });

  document.querySelectorAll('#lang-options .option-card').forEach(el => {
    el.onclick = () => {
      document.querySelectorAll('#lang-options .option-card')
        .forEach(e => e.classList.remove('active'));
      el.classList.add('active');
      state.lang = el.dataset.value;
    };
  });
};

window.onload = setupOptions;
