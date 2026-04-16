export async function initI18n() {
    const lang = localStorage.getItem('aoi-lang') || 'vi';
    document.getElementById('langSwitcher').value = lang;

    try {
        const res = await fetch(`./assets/lang/${lang}.json`);
        const data = await res.json();

        document.querySelectorAll('[data-key]').forEach(el => {
            const key = el.getAttribute('data-key');
            if (data[key]) el.innerText = data[key];
        });
    } catch (e) { console.error("I18n Error:", e); }

    document.getElementById('langSwitcher').onchange = (e) => {
        localStorage.setItem('aoi-lang', e.target.value);
        window.location.reload();
    };
}
