function initTheme(){
  const current = localStorage.getItem('theme');
  if(current === 'light') document.body.classList.add('light');

  document.getElementById('theme-toggle').onclick = ()=>{
    document.body.classList.toggle('light');
    localStorage.setItem('theme', document.body.classList.contains('light')?'light':'dark');
  };
}
