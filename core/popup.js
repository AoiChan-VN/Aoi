export class Popup {
    constructor(id) {
        this.dom = {
            wrapper: document.getElementById(id),
            window: document.querySelector(`#${id} .viewer-window`),
            header: document.querySelector(`#${id} .viewer-header`),
            content: document.querySelector(`#${id} .viewer-content`),
            title: document.querySelector(`#${id} .viewer-title`)
        };
        this.initDraggable();
    }

    open(title, content, isHTML = true) {
        this.dom.title.textContent = title || '︵»↾📖↿«︵';
        if (isHTML) {
            this.dom.content.innerHTML = content;
        } else {
            this.dom.content.innerHTML = '';
            this.dom.content.appendChild(content);
        }
        
        // Reset vị trí & hiện popup
        Object.assign(this.dom.window.style, {
            left: '50%', top: '50%', transform: 'translate(-50%, -50%)'
        });
        this.dom.wrapper.classList.remove('hidden');
    }

    close() {
        this.dom.wrapper.classList.add('hidden');
    }

    initDraggable() {
        let isDragging = false, offset = { x: 0, y: 0 };
        const { window: win, header } = this.dom;

        const start = (e) => {
            if (e.target.closest('.close-btn-modal')) return;
            isDragging = true;
            const cx = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const cy = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
            offset.x = cx - win.offsetLeft;
            offset.y = cy - win.offsetTop;
            header.style.cursor = 'grabbing';
        };

        const move = (e) => {
            if (!isDragging) return;
            const cx = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const cy = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
            win.style.left = `${cx - offset.x}px`;
            win.style.top = `${cy - offset.y}px`;
            win.style.transform = 'none';
        };

        const stop = () => { isDragging = false; header.style.cursor = 'move'; };

        header.onmousedown = start; document.onmousemove = move; document.onmouseup = stop;
        header.ontouchstart = start; document.ontouchmove = move; document.ontouchend = stop;
    }
}
