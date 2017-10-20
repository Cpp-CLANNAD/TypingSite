class TypingPanel {
    constructor(keyMap, zero) {
        this._keyMap = keyMap;
        this._zero = zero;
        
        this.el = document.createElement('article');
        this.el.className = 'typing-panel';
    }

    init(article) {
        if(this._validateArticle(article) === false) return false;

        this.el.innerHTML = this._createArticleHtml(article);
        this._words = Array.from(this.el.querySelectorAll('.tp-word-box'));
        this._current = {
            position: 0,
            state: TypingPanel.wordState.initial
        }
        this._nextStep();
        return true;
    }

    enterKey(key) {
        if(this._current.state === TypingPanel.wordState.wordEnterFinish) return false;

        let word = this._words[this._current.position];
        if(this._current.state === TypingPanel.wordState.waitingEnterSm && word.querySelector('.tp-keys > .tp-sm').dataset.smk === key || 
            this._current.state === TypingPanel.wordState.waitingEnterYm && word.querySelector('.tp-keys > .tp-ym').dataset.ymk === key) {
                this._nextStep();
                this.trigger('hit');
                return true;
        }

        this.trigger('miss');
        return false;
    }

    _createArticleHtml(article) {
        var rvKeyMap = this._reverseShuangpinKeyMap();

        var html = article.map(val => {
            let{word, desc, dmap} = val;

            // 扩展零声母拼音数组
            if(desc && desc.length === 1) {
                desc = ['', ...desc];
                dmap = this._lingshengmuToShuangping(dmap[0], this._zero);
            }

            let smDesc = desc ? desc[0] : '',
                ymDesc = desc ? desc[1] : '',
                smKey  = dmap ? rvKeyMap[dmap[0]] : '',
                ymKey  = dmap ? rvKeyMap[dmap[1]] : '',
                sm     = dmap ? dmap[0] : '',
                ym     = dmap ? dmap[1] : '';

            return `
            <div class="${desc ? 'tp-word-box' : 'tp-symbol-box'}">
                <div class="tp-pinyin">
                    <span class="tp-sm">${smDesc}</span>
                    <span class="tp-ym">${ymDesc}</span>
                </div>
                <div class="tp-word">
                    <span class="tp-word-in" data-word="${word}">${word}</span>
                </div>
                <div class="tp-keys">
                    <span class="tp-sm" data-smk="${smKey}" data-sm="${sm}">${smKey}</span>
                    <span class="tp-ym" data-ymk="${ymKey}" data-ym="${ym}">${ymKey}</span>
                </div>
            </div>
            `;
        }).join('');

        return html;
    }

    _reverseShuangpinKeyMap() {
        var keyMap = this._keyMap, rv = {};

        for(let key in keyMap) {
            if(!keyMap.hasOwnProperty(key)) break;
            
            let val = keyMap[key];

            // 声母
            if(val[0]) {
                rv[val[0]] = key;
            }

            // 韵母
            for(let ym of val[1]) {
                rv[ym] = key;
            }
        }

        return rv;
    }
    
    // 零声母拼音转换为双拼形式
    _lingshengmuToShuangping(val ,type) {
        var vals = ['a', 'an', 'ai', 'ao', 'ang', 'e', 'en', 'ei', 'er', 'eng', 'o', 'ou'];

        if(vals.includes(val) === false) throw new Error();

        switch(type) {
            case 1:     // 非固定零声母方案
                return [val[0], val];
            case 2:     // 非固定零声母方案（双字母音节保留全拼方式
                if(val.length === 2)
                    return [val[0], val[1]];
                else
                    return [val[0], val];
            default:    // 固定零声母方案
                if(typeof type === 'string' && type.length === 1)
                    return [type, val];
                else
                    throw new Error();
        }
    }

    _validateArticle(article) {
        if(Array.isArray(article) === false || article.length === 0 || article[0].desc == null) return false;

        return article.every(({word, desc, dmap}) => {

            if( (desc == null && dmap == null && typeof word === 'string' && word.length === 1) || 
                (Array.isArray(desc) && Array.isArray(dmap) && desc.length === dmap.length && desc.length !== 0)) {
                return true;
            }

            return false;
        });
    }

    _nextStep() {
        
        // 当前文章已经键入完成
        if(this._current.position === this._words.length - 1 && this._current.state === TypingPanel.wordState.wordEnterFinish) return false;

        if(this._current.state === TypingPanel.wordState.initial) {
            if(this._current.position !== 0) throw new Error();
            this._current.state = TypingPanel.wordState.waitingEnterSm;
            
        } else if (this._current.state === TypingPanel.wordState.waitingEnterSm) {
            this._current.state = TypingPanel.wordState.waitingEnterYm;

        } else if (this._current.state === TypingPanel.wordState.waitingEnterYm) {
            this._current.state = TypingPanel.wordState.wordEnterFinish;

        } else if (this._current.state === TypingPanel.wordState.wordEnterFinish) {
            this._current.position++;
            this._current.state = TypingPanel.wordState.waitingEnterSm;
            
        } else {
            throw new Error();
        }

        this._handleState();

        return true;
    }

    _handleState() {
        let word = this._words[this._current.position],
            state = this._current.state;

        if(this._current.state === TypingPanel.wordState.waitingEnterSm) {
            word.classList.add('waiting-enter-sm');

            let sm = word.querySelector('.tp-keys > .tp-sm');
            this.trigger('need', [{
                type:'sm', 
                key: sm.dataset.smk, 
                py: sm.dataset.sm
            }]);

        } else if (this._current.state === TypingPanel.wordState.waitingEnterYm) {
            word.classList.remove('waiting-enter-sm');
            word.classList.add('waiting-enter-ym');

            let ym = word.querySelector('.tp-keys > .tp-ym');
            this.trigger('need', [{
                type:'ym', 
                key: ym.dataset.ymk, 
                py: ym.dataset.ym
            }]);

        } else if (this._current.state === TypingPanel.wordState.wordEnterFinish) {
            word.classList.remove('waiting-enter-ym');
            word.classList.add('word-enter-finish');
            this.trigger('pass', [{
                total: this._words.length,
                current: this._current.position + 1
            }]);
            
            if(this._nextStep() === false) {
                this.trigger('finish');
            }
        }    
    }
    
}

Object.assign(TypingPanel.prototype, EventEmitter.prototype);

TypingPanel.wordState = {
    initial: Symbol(),
    waitingEnterSm: Symbol(),
    waitingEnterYm: Symbol(),
    wordEnterFinish: Symbol()
}