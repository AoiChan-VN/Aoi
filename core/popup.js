export class Popup {
    constructor(id) {
        this.el = document.getElementById(id);
        this.win = this.el.querySelector('.popup-window');
        this.content = this.el.querySelector('.popup-content');
        this.title = this.el.querySelector('.popup-title');
        this.closeBtn = document.getElementById('close-popup-btn');
        
        if(this.closeBtn) this.closeBtn.onclick = () => this.hide();
        this.initDragging();
    }

    show(title, content, isHTML = true) {
        this.title.textContent = title || '📖';
        if (isHTML) this.content.innerHTML = content;
        else { this.content.innerHTML = ''; this.content.appendChild(content); }
        
        // Reset vị trí
        this.win.style.left = '50%';
        this.win.style.top = '50%';
        this.win.style.transform = 'translate(-50%, -50%)';
        
        this.el.classList.remove('hidden');
    }

    hide() { 
        this.el.classList.add('hidden'); 
    }

    initDragging() {
        let active = false, ox = 0, oy = 0;
        const header = this.el.querySelector('.popup-header');

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

        header.onmousedown = start;
        header.ontouchstart = start;
        document.addEventListener('mousemove', move);
        document.addEventListener('touchmove', move, { passive: false });
        document.addEventListener('mouseup', () => active = false);
        document.addEventListener('touchend', () => active = false);
    }
}
