const tipskeys = { newphrase: 'newphrase', missprint: 'missprint', random: 'random' };

function Tips() {
    let tips;
    let tip;
    return {
        set tips(data) { tips = data; },
        get tips() { return tips; },
        set tip(o) { tip = o; },
        get tip() { return tip; },
        renderTip(key) {
            if (this.tip) {
                this.tip.html(this.getTip(key));
            }
        },
        getTip(key) {
            if (tips) {
                const t = tips[key];
                if (Array.isArray(t)) return t[Math.random() * t.length | 0];
                return t;
            }
            return '';
        },
    };
}
export { Tips as default, tipskeys };
