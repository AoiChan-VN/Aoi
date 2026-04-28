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
        this.dom.title.textContent = title || '📖';
        if (isHTML) {
            this.dom.content.innerHTML = content;
        } else {
            this.dom.content.replaceChildren(content);
        }
        
        this.dom.window.style.cssText = `left:50%; top:50%; transform:translate(-50%, -50%);`;
        this.dom.wrapper.classList.remove('hidden');
    }

    close() {
        this.dom.wrapper.classList.add('hidden');
    }

    _initEvents() {
        const { window: win, header } = this.dom;

        const start = (e) => {
            if (e.target.closest('.close-btn-modal')) return;
            this.state.isDragging = true;
            this.state.x = e.clientX - win.offsetLeft;
            this.state.y = e.clientY - win.offsetTop;
            header.setPointerCapture(e.pointerId);
        };

        const move = (e) => {
            if (!this.state.isDragging) return;
            win.style.left = `${e.clientX - this.state.x}px`;
            win.style.top = `${e.clientY - this.state.y}px`;
            win.style.transform = 'none';
        };

        const stop = () => { this.state.isDragging = false; };

        header.onpointerdown = start;
        header.onpointermove = move;
        header.onpointerup = stop;
    }
}
