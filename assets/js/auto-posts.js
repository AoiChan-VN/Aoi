async function loadPostsAuto() {
  return Cache.get("posts", async () => {
    const res = await fetch("assets/data/posts.json");
    return await res.json();
  });
} 
