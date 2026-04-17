const routes = {
  "/": homePage,
  "/post": postPage
};

function navigate(path, data) {
  history.pushState(data, "", path);
  renderRoute();
}

window.onpopstate = renderRoute;

function renderRoute() {
  const path = location.pathname;
  const view = routes[path] || homePage;
  view();
}
