export class Popup {
    constructor(id) {
        this.el = document.getElementById(id);
        this.win = this.el.querySelector('.popup-window');
        this.header = this.el.querySelector('.popup-header');
        this.content = this.el.querySelector('.popup-content');
        this.title = this.el.querySelector('.popup-title');
        this.initDragging();
    }

    show(title, content, isHTML = true) {
        this.title.textContent = title;
        if (isHTML) this.content.innerHTML = content;
        else {
            this.content.innerHTML = '';
            this.content.appendChild(content);
        }
        
        // Reset vị trí trung tâm
        Object.assign(this.win.style, {
            left: '50%', top: '50%', transform: 'translate(-50%, -50%)'
        });
        this.el.classList.remove('hidden');
    }

    hide() {
        this.el.classList.add('hidden');
    }

    initDragging() {
        let dragging = false, x = 0, y = 0;
        const start = (e) => {
            if (e.target.closest('.close-btn')) return;
            dragging = true;
            const event = e.type.includes('touch') ? e.touches[0] : e;
            x = event.clientX - this.win.offsetLeft;
            y = event.clientY - this.win.offsetTop;
        };
        const move = (e) => {
            if (!dragging) return;
            const event = e.type.includes('touch') ? e.touches[0] : e;
            this.win.style.left = (event.clientX - x) + 'px';
            this.win.style.top = (event.clientY - y) + 'px';
            this.win.style.transform = 'none';
        };
        const stop = () => dragging = false;

        this.header.onmousedown = start;
        this.header.ontouchstart = start;
        document.onmousemove = move;
        document.ontouchmove = move;
        document.onmouseup = stop;
        document.ontouchend = stop;
    }
}
