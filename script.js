const state = {
  theme: 'dark',
  lang: 'vi'
};

const overlay = document.getElementById('overlay');

function toggleSide(id,e){
  e.stopPropagation();
  closeAll();
  document.getElementById(id).classList.add('show');
  overlay.classList.add('show');
}

function closeAll(){
  document.querySelectorAll('.side')
    .forEach(e=>e.classList.remove('show'));
  overlay.classList.remove('show');
}

/* GROUP */
document.querySelectorAll('.group-header').forEach(h=>{
  h.onclick=()=>h.parentElement.classList.toggle('open');
});

/* OPTIONS */
document.querySelectorAll('.opt').forEach(el=>{
  el.onclick=()=>{
    const parent=el.parentElement;
    parent.querySelectorAll('.opt').forEach(e=>e.classList.remove('active'));
    el.classList.add('active');
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
