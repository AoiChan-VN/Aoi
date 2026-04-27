/**
 * 🌊 AoiPopup Module
 * Xử lý cửa sổ nổi với khả năng tương tác cao
 */
export class Popup {
    constructor(id) {
        this.el = document.getElementById(id);
        this.win = this.el.querySelector('.viewer-window');
        this.header = this.el.querySelector('.viewer-header');
        this.content = this.el.querySelector('.viewer-content');
        this.title = this.el.querySelector('.viewer-title');
        
        this.initDraggable();
    }

    /**
     * Mở popup với nội dung linh hoạt
     * @param {string} title - Tiêu đề cửa sổ
     * @param {string|HTMLElement} data - Nội dung (HTML hoặc Node)
     */
    open(title, data) {
        this.title.textContent = title || '📖';
        
        if (data instanceof HTMLElement) {
            this.content.innerHTML = '';
            this.content.appendChild(data);
        } else {
            this.content.innerHTML = data;
        }

        // Reset vị trí về trung tâm khi mở
        Object.assign(this.win.style, {
            left: '50%', top: '50%', transform: 'translate(-50%, -50%)'
        });
        
        this.el.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Chặn cuộn trang chính
    }

    close() {
        this.el.classList.add('hidden');
        document.body.style.overflow = '';
    }

    initDraggable() {
        let isDragging = false;
        let startPos = { x: 0, y: 0 };

        const onStart = (e) => {
            if (e.target.closest('.close-btn-modal')) return;
            isDragging = true;
            const pointer = e.type.includes('touch') ? e.touches[0] : e;
            startPos = {
                x: pointer.clientX - this.win.offsetLeft,
                y: pointer.clientY - this.win.offsetTop
            };
            this.header.style.cursor = 'grabbing';
        };

        const onMove = (e) => {
            if (!isDragging) return;
            const pointer = e.type.includes('touch') ? e.touches[0] : e;
            
            // Cập nhật vị trí và xóa transform translate để tránh xung đột
            this.win.style.transform = 'none';
            this.win.style.left = `${pointer.clientX - startPos.x}px`;
            this.win.style.top = `${pointer.clientY - startPos.y}px`;
        };

        const onEnd = () => {
            isDragging = false;
            this.header.style.cursor = 'move';
        };

        this.header.addEventListener('mousedown', onStart);
        this.header.addEventListener('touchstart', onStart, { passive: true });
        window.addEventListener('mousemove', onMove);
        window.addEventListener('touchmove', onMove, { passive: false });
        window.addEventListener('mouseup', onEnd);
        window.addEventListener('touchend', onEnd);
    }
}
 
