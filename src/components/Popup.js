export class Popup {
    constructor(id) {
        this.dom = {
            wrapper: document.getElementById(id),
            window: document.querySelector(`#${id} .viewer-window`),
            header: document.querySelector(`#${id} .viewer-header`),
            content: document.querySelector(`#${id} .viewer-content`),
            title: document.querySelector(`#${id} .viewer-title`)
        };
        this.state = { isDragging: false, x: 0, y: 0 };
        this._initEvents();
    }

    open(title, content, isHTML = true) {
        this.dom.title.textContent = title || 'Notification';
        this.dom.content[isHTML ? 'innerHTML' : 'replaceChildren'](content);
        
        // Reset position chuẩn xác hơn
        this.dom.window.style.cssText = `left: 50%; top: 50%; transform: translate(-50%, -50%);`;
        this.dom.wrapper.classList.remove('hidden');
    }

    close() {
        this.dom.wrapper.classList.add('hidden');
        this.dom.content.innerHTML = ''; // Giải phóng bộ nhớ
    }

    _initEvents() {
        const { window: win, header } = this.dom;

        const onPointerDown = (e) => {
            if (e.target.closest('.close-btn-modal')) return;
            this.state.isDragging = true;
            this.state.x = e.clientX - win.offsetLeft;
            this.state.y = e.clientY - win.offsetTop;
            header.setPointerCapture(e.pointerId);
            header.style.cursor = 'grabbing';
        };

        const onPointerMove = (e) => {
            if (!this.state.isDragging) return;
            win.style.left = `${e.clientX - this.state.x}px`;
            win.style.top = `${e.clientY - this.state.y}px`;
            win.style.transform = 'none';
        };

        const onPointerUp = () => {
            this.state.isDragging = false;
            header.style.cursor = 'move';
        };

        header.addEventListener('pointerdown', onPointerDown);
        header.addEventListener('pointermove', onPointerMove);
        header.addEventListener('pointerup', onPointerUp);
    }
}
 
