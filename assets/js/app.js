(async () => {
  await loadTheme();
  await loadPosts();

  router();

  const search = document.getElementById("search");

  search.oninput = () => {
    searchPosts(search.value);
  };
})();
