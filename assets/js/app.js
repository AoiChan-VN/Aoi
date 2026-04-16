(async () => {
  const lang = localStorage.getItem("lang") || "vi";

  await loadLang(lang);
  await loadTheme();
  await loadPosts();

  router();

  if (POSTS[0]) {
    loadPost(POSTS[0].slug);
  }

  // LANGUAGE
  const langSwitch = document.getElementById("lang-switch");

  ["vi", "en"].forEach(l => {
    const opt = document.createElement("option");
    opt.value = l;
    opt.textContent = l;
    langSwitch.appendChild(opt);
  });

  langSwitch.value = lang;

  langSwitch.onchange = async () => {
    await loadLang(langSwitch.value);
    router();
  };

  // SEARCH
  const search = document.getElementById("search");

  search.oninput = () => {
    if (!search.value) {
      renderPosts();
    } else {
      searchPosts(search.value);
    }
  };
})();
