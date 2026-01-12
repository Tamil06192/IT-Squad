document.addEventListener('DOMContentLoaded', () => {
    const rtlBtn = document.getElementById('rtl-toggle');
    const html = document.documentElement;

    // Check saved direction
    const savedDir = localStorage.getItem('dir') || 'ltr';
    html.setAttribute('dir', savedDir);
    updateRtlButton(savedDir);

    if (rtlBtn) {
        rtlBtn.addEventListener('click', () => {
            const currentDir = html.getAttribute('dir');
            const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';

            html.setAttribute('dir', newDir);
            localStorage.setItem('dir', newDir);
            updateRtlButton(newDir);
        });
    }

    function updateRtlButton(dir) {
        if (!rtlBtn) return;
        rtlBtn.innerHTML = dir === 'ltr' ? '🌐' : '🌐';
    }
});
