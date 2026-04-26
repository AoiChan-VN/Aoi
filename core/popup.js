export class Popup {
    constructor(id) {
        this.el = document.getElementById(id);
        this.win = this.el.querySelector('.popup-window');
        this.header = this.el.querySelector('.popup-header');
        this.content = this.el.querySelector('.popup-content');
        this.title = this.el.querySelector('.popup-title');
        this.closeBtn = this.el.querySelector('.close-btn-modal');
        
        this.closeBtn.onclick = () => this.hide();
        this.initDragging();
    }

    show(title, content, isHTML = true) {
        this.title.textContent = title || '📖';
        if (isHTML) this.content.innerHTML = content;
        else { this.content.innerHTML = ''; this.content.appendChild(content); }
        
        Object.assign(this.win.style, { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' });
        this.el.classList.remove('hidden');
    }

    hide() { this.el.classList.add('hidden'); }

    initDragging() {
        let active = false, ox = 0, oy = 0;
        const start = (e) => {
            if (e.target.closest('.close-btn-modal')) return;
            active = true;
            const ev = e.type.includes('touch') ? e.touches[0] : e;
            ox = ev.clientX - this.win.offsetLeft;
            oy = ev.clientY - this.win.offsetTop;
        };
        const move = (e) => {
            if (!active) return;
            const ev = e.type.includes('touch') ? e.touches[0] : e;
            this.win.style.left = `${ev.clientX - ox}px`;
            this.win.style.top = `${ev.clientY - oy}px`;
            this.win.style.transform = 'none';
        };
        const stop = () => active = false;

        this.header.onmousedown = start; this.header.ontouchstart = start;
        document.onmousemove = move; document.ontouchmove = move;
        document.onmouseup = stop; document.ontouchend = stop;
    }
}
