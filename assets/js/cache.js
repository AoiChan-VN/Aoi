const Cache = {
  async get(key, fetcher) {
    const cached = localStorage.getItem(key);
    if (cached) return JSON.parse(cached);

    const data = await fetcher();
    localStorage.setItem(key, JSON.stringify(data));
    return data;
  }
}; 
