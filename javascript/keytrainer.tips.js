function Tips() {
    let tips;
    return {
        set tips(data) { tips = data; },
        get tips() { return tips; },
        getTip(key) {
            if (tips) {
                const tip = tips[key];
                if (Array.isArray(tip)) return tip[Math.random() * tip.length | 0];
                return tip;
            }
            return '';
        },
    };
}
export { Tips as default };
