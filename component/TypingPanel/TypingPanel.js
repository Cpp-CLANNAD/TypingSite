class TypingPanel {
    constructor(keyMap, zero) {
        this.keyMap = keyMap;
        this.zero = zero;
        this.el = document.createElement('article');
        this.el.className = 'typing-panel';
    }

    createArticleHtml(article) {
        var rvKeyMap = this.reverseShuangpinKeyMap();

        var html = article.map(val => {
            let{word, desc, dmap} = val;

            // 扩展零声母拼音数组
            if(desc && desc.length === 1) {
                desc = ['', ...desc];
                dmap = this.lingshengmuToShuangping(dmap[0], this.zero);
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
                <span class="tp-word" data-word="${word}">${word}</span>
                <div class="tp-keys">
                    <span class="tp-sm" data-smk="${smKey}" data-sm="${sm}">${smKey}</span>
                    <span class="tp-ym" data-ymk="${ymKey}" data-ym="${ym}">${ymKey}</span>
                </div>
            </div>
            `;
        }).join('');

        return html;
    }

    reverseShuangpinKeyMap() {
        var keyMap = this.keyMap, rv = {};

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
    lingshengmuToShuangping(val ,type) {
        var vals = ['a', 'an', 'ai', 'ao', 'ang', 'e', 'en', 'ei', 'er', 'eng', 'o', 'ou'];

        if(vals.includes(val) === false) throw new Error();

        switch(type) {
            case 1:
                return [val[0], val];
            case 2:
                if(val.length === 2)
                    return [val[0], val[1]];
                else
                    return [val[0], val];
            default:
                if(typeof type === 'string' && type.length === 1)
                    return [type, val];
                else
                    throw new Error();
        }
    }

    init(article) {
        this.el.innerHTML = this.createArticleHtml(article);
        this.words = Array.from(this.el.querySelectorAll('.tp-word-box'));
        this.length = this.words.length;
        this.current = {
            position: 0,
            state: TypingPanel.wordState.initial
        }
        this.nextStep();
    }

    nextStep() {
        
        // 当前文章已经键入完成
        if(this.current.position === this.words.length - 1 && this.current.state === TypingPanel.wordState.wordEnterFinish) return false;

        if(this.current.state === TypingPanel.wordState.initial) {
            if(this.current.position !== 0) throw new Error();
            this.current.state = TypingPanel.wordState.waitingEnterSm;
            
        } else if (this.current.state === TypingPanel.wordState.waitingEnterSm) {
            this.current.state = TypingPanel.wordState.waitingEnterYm;

        } else if (this.current.state === TypingPanel.wordState.waitingEnterYm) {
            this.current.state = TypingPanel.wordState.wordEnterFinish;

        } else if (this.current.state === TypingPanel.wordState.wordEnterFinish) {
            this.current.position++;
            this.current.state = TypingPanel.wordState.waitingEnterSm;
            
        } else {
            throw new Error();
        }

        let word = this.words[this.current.position],
            state = this.current.state;

        if(this.current.state === TypingPanel.wordState.waitingEnterSm) {
            word.classList.add('waiting-enter-sm');
            this.trigger('needkey', [{
                type: 'sm',
                key : word.querySelector('.tp-keys > .tp-sm').dataset.smk,
                py  : word.querySelector('.tp-keys > .tp-sm').dataset.sm,
            }]);
        } else if (this.current.state === TypingPanel.wordState.waitingEnterYm) {
            word.classList.remove('waiting-enter-sm');
            word.classList.add('waiting-enter-ym');
            this.trigger('needkey', [{
                type: 'ym',
                key : word.querySelector('.tp-keys > .tp-ym').dataset.ymk,
                py  : word.querySelector('.tp-keys > .tp-ym').dataset.ym,
            }]);
        } else if (this.current.state === TypingPanel.wordState.wordEnterFinish) {
            word.classList.remove('waiting-enter-ym');
            word.classList.add('word-enter-finish');
            if(this.nextStep() === false) {
                this.trigger('typingover');
            }
        }

        return true;
    }

    enterKey(key) {
        let word = this.words[this.current.position];
        let needKey;
        if(this.current.state === TypingPanel.wordState.waitingEnterSm && word.querySelector('.tp-keys > .tp-sm').dataset.smk === key) {
                this.nextStep();
                return true;
        } else if (this.current.state === TypingPanel.wordState.waitingEnterYm && word.querySelector('.tp-keys > .tp-ym').dataset.ymk === key) {
                this.nextStep();
                return true;
        }
        return false;
    }
}

Object.assign(TypingPanel.prototype, EventEmitter.prototype);

TypingPanel.wordState = {
    initial: Symbol(),
    waitingEnterSm: Symbol(),
    waitingEnterYm: Symbol(),
    wordEnterFinish: Symbol()
}