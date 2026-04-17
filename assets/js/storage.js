function setCache(key, value){
  localStorage.setItem("cache_" + key, value);
}

function getCache(key){
  return localStorage.getItem("cache_" + key);
}

function saveSetting(key, value){
  localStorage.setItem("setting_" + key, JSON.stringify(value));
}

function getSetting(key, def=null){
  const v = localStorage.getItem("setting_" + key);
  return v ? JSON.parse(v) : def;
}
