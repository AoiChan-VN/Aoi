export async function renderProducts() {
    const products = [
        { id: 1, name: "Aoi Plugin", type: "System" },
        { id: 2, name: "Star Game", type: "RPG" }
    ];

    const container = document.getElementById('product-grid');
    container.innerHTML = products.map(p => `
        <div class="card">
            <h3>${p.name}</h3>
            <span>${p.type}</span>
        </div>
    `).join('');
}
 
