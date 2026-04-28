export const Logger = {
    error: (msg, detail = '') => {
        console.error(`[AoiApp Error]: ${msg}`, detail);
        // Có thể mở rộng để gửi log về server
    },
    info: (msg) => {
        console.log(`%c[AoiApp]: ${msg}`, 'color: #7c7cff; font-weight: bold');
    }
};
