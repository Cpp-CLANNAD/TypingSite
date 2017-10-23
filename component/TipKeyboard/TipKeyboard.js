class TipKeyboard {
    constructor(keyMap) {
        this._keyMap = keyMap;

        this._el = document.createElement('article');
        this._el.className = 'tip-keyboard';

        this._listenEvents();
        this._refreshView();
    }

    get keyMap() {
        return this._keyMap;
    }

    set keyMap(value) {
        this._keyMap = value;
        this._refreshView(); 
        return value;
    }

    get el() {
        return this._el;
    }

    _refreshView() {
        let html = '';

        for(let row of TipKeyboard.kbLayout) {

            html += '<div class="kb-row">';

            for(let key of row) {
                
                let sm    = this._keyMap[key][0] || '',
                    yms   = this._keyMap[key][1];

                let ymListHtml = yms.map(ym => 
                    `<div class="kb-ym-code" data-ym="${ym}">${ym}</div>`
                ).join('');

                html += `
                <div class="kb-key" data-key="${key}">
                    <span class="kb-key-code">${key}</span>

                    <span class="kb-sm-code" data-sm="${sm}">
                        ${sm}
                    </span>

                    <div class="kb-ym-list">
                        ${ymListHtml}
                    </div>
                </div>`;
            }

            html += '</div>';
        }

        this._el.innerHTML = html;
    }

    _listenEvents() {

        // 点击提示按键时触发keypress事件
        this._el.addEventListener('click', ev => {
            let target = ev.target;

            while(target != ev.currentTarget) {

                if(target.classList.contains('kb-key')) {
                    this.trigger('keypress', [target.dataset.key]);
                    break;
                }

                target = target.parentElement;
            }
        });
    }

    highlightKey(key, isHighlight = true) {
        let target = this._el.querySelector(`[data-key=${key}]`);
        target && target.classList[isHighlight ? 'add' : 'remove']('active');
        return this;
    }

    highlightShengmu(shengmu, isHighlight = true) {
        let target = this._el.querySelector(`[data-sm=${shengmu}]`);
        target && target.classList[isHighlight ? 'add' : 'remove']('active');
        return this;
    }

    highlightYunmu(yunmu, isHighlight = true) {
        let target = this._el.querySelector(`[data-ym=${yunmu}]`);
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