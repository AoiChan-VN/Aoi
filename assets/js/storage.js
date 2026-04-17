function setCache(key, value){
  localStorage.setItem('cache_'+key, value);
}

function getCache(key){
  return localStorage.getItem('cache_'+key);
}
