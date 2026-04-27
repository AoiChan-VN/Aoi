export const initRouter = (routes, rootElement) => {
  const handleRoute = () => {
    const path = window.location.pathname;
    const route = routes.find(r => r.path === path) || routes.find(r => r.path === "*");
    if (route) {
      rootElement.innerHTML = route.component();
    }
  };

  window.addEventListener("popstate", handleRoute);
  
  // Custom link handling
  document.body.addEventListener("click", e => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      history.pushState(null, null, e.target.href);
      handleRoute();
    }
  });

  handleRoute();
};
 
