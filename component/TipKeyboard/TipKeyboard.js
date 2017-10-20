class TipKeyboard {
    constructor(keyMap) {
        this.keyMap = keyMap;
        this.el = this._createView();

        // 点击提示按键时触发事件
        Array.from(this.el.querySelectorAll('.kb-key')).forEach(el => {
            el.addEventListener('click', ev => {
                this.trigger('keypress', [ev.currentTarget.dataset.key]);
            });
        })
    }

    _createView() {
        let html = '<article class="tip-keyboard">';

        for(let row of TipKeyboard.kbLayout) {

            html += '<div class="kb-row">';

            for(let key of row) {
                let sm = this.keyMap[key][0] || '',
                    yms = this.keyMap[key][1];

                html += `
                    <div class="kb-key" data-key="${key}">
                        <span class="kb-key-code">${key}</span>
                        <span class="kb-sm-code" data-sm="${sm}">${sm}</span>
                        <div class="kb-ym-list">
                            ${yms.map(ym => {
                                return '<div class="kb-ym-code" data-ym=' + ym + '>' + ym + '</div>'
                            }).join('')}
                        </div>
                    </div>
                `;
            }

            html += '</div>';
        }

        html += '</article>';

        let parser = new DOMParser();
        return parser.parseFromString(html, 'text/html').body.firstChild;
    }

    highlightKey(key, isHighlight = true) {
        var target = this.el.querySelector(`[data-key=${key}]`);
        target && target.classList[isHighlight ? 'add' : 'remove']('active');
        return this;
    }

    highlightShengmu(shengmu, isHighlight = true) {
        var target = this.el.querySelector(`[data-sm=${shengmu}]`);
        target && target.classList[isHighlight ? 'add' : 'remove']('active');
        return this;
    }

    highlightYunmu(yunmu, isHighlight = true) {
        var target = this.el.querySelector(`[data-ym=${yunmu}]`);
        target && target.classList[isHighlight ? 'add' : 'remove']('active');
        return this;
    }

}

Object.assign(TipKeyboard.prototype, EventEmitter.prototype);

TipKeyboard.kbLayout = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
];