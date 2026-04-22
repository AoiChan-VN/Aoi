const state = {
  lang: 'vi',
  theme: 'dark'
};

const toggleSide = (id, e) => {
  e.stopPropagation();
  document.getElementById(id).classList.toggle('show');
};

const setupOptions = () => {
  // LANG
  document.querySelectorAll('#lang-options .option-card').forEach(el => {
    if (el.dataset.value === state.lang) el.classList.add('active');

    el.onclick = () => {
      document.querySelectorAll('#lang-options .option-card')
        .forEach(e => e.classList.remove('active'));

      el.classList.add('active');
      state.lang = el.dataset.value;
    };
  });

  // THEME
  document.querySelectorAll('#theme-options .option-card').forEach(el => {
    if (el.dataset.value === state.theme) el.classList.add('active');

    el.onclick = () => {
      document.querySelectorAll('#theme-options .option-card')
        .forEach(e => e.classList.remove('active'));

      el.classList.add('active');
      state.theme = el.dataset.value;

      document.body.className = 'theme-' + state.theme;
    };
  });
};

window.onload = setupOptions;
