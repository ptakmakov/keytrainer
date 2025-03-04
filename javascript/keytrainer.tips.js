const tipskeys = { newphrase: 'newphrase', missprint: 'missprint', random: 'random' };

function Tips() {
    let tips;
    let tip;
    return {
        init(data) {
            return new Promise((resolve) => { tips = data; resolve(); });
        },
        set tip(o) { tip = o; },
        get tip() { return tip; },
        renderTip(key) {
            if (this.tip) {
                this.tip.innerHTML = this.getTip(key);
            }
        },
        getTip(key) {
            if (tips) {
                const t = tips[key];
                if (Array.isArray(t)) return t[Math.floor(Math.random() * t.length)];
                return t;
            }
            return '';
        },
    };
}
export { Tips as default, tipskeys };
