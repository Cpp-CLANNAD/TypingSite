/*
 * @Author: Chocolatl 
 * @Date: 2017-10-13 19:50:40 
 */

class TypingPanel {
    constructor(keyMap, zero) {
        this._keyMap = keyMap;
        this._zero = zero;
        
        this._el = document.createElement('article');
        this._el.className = 'typing-panel';
    }

    get el() {
        return this._el;
    }

    init(article) {
        if(Array.isArray(article) === false || article.length === 0) throw new Error('Argument must be a array with a length greater than zero');

        this._el.innerHTML = this._innerHTML(article);
        this._words = Array.from(this._el.querySelectorAll('.tp-word-box'));
        this._current = {
            position: 0,
            state: TypingPanel.wordState.initial
        }
        this._nextStep();
        return true;
    }

    enterKey(key) {

        let {initial, waitingEnterSm, waitingEnterYm, wordEnterFinish} = TypingPanel.wordState;

        if(this._current == null || this._current.state === wordEnterFinish) return false;

        let word = this._words[this._current.position];
        if(this._current.state === waitingEnterSm && word.querySelector('.tp-keys > .tp-sm').dataset.smk === key || 
           this._current.state === waitingEnterYm && word.querySelector('.tp-keys > .tp-ym').dataset.ymk === key) {
                this._nextStep();
                this.trigger('hit');
                return true;
        }

        this.trigger('miss');
        return false;
    }

    _innerHTML(article) {
        var rvKeyMap = this._reverseKeyMap();

        var html = article.map(val => {
            let{word, desc, dmap} = val;

            // 扩展零声母拼音数组
            if(desc && desc.length === 1) {
                desc = ['', ...desc];
                dmap = this._normalizeZeroInitial(dmap[0], this._zero);
            }

            let smDesc = desc ? desc[0] : '',
                ymDesc = desc ? desc[1] : '',
                smKey  = dmap ? rvKeyMap[dmap[0]] : '',
                ymKey  = dmap ? rvKeyMap[dmap[1]] : '',
                sm     = dmap ? dmap[0] : '',
                ym     = dmap ? dmap[1] : '',
                boxType = desc ? 'tp-word-box' : 'tp-symbol-box';

            return `
            <div class="${boxType}">
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

    _reverseKeyMap() {
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
    _normalizeZeroInitial(val ,type) {
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

    _nextStep() {

        let {initial, waitingEnterSm, waitingEnterYm, wordEnterFinish} = TypingPanel.wordState;
        
        // 当前文章已经键入完成
        if(this._current.position === this._words.length - 1 && this._current.state === wordEnterFinish) return false;

        if(this._current.state === TypingPanel.wordState.initial) {
            if(this._current.position !== 0) throw new Error();
            this._current.state = waitingEnterSm;
            
        } else if (this._current.state === waitingEnterSm) {
            this._current.state = waitingEnterYm;

        } else if (this._current.state === waitingEnterYm) {
            this._current.state = wordEnterFinish;

        } else if (this._current.state === wordEnterFinish) {
            this._current.position++;
            this._current.state = waitingEnterSm;
            
        } else {
            throw new Error();
        }

        this._handleState();

        return true;
    }

    _handleState() {
        let word = this._words[this._current.position],
            state = this._current.state;
            
        let {initial, waitingEnterSm, waitingEnterYm, wordEnterFinish} = TypingPanel.wordState;

        if(this._current.state === waitingEnterSm) {
            word.classList.add('waiting-enter-sm');

            let sm = word.querySelector('.tp-keys > .tp-sm');
            this.trigger('need', [{
                type:'sm', 
                key: sm.dataset.smk, 
                py: sm.dataset.sm
            }]);

        } else if (this._current.state === waitingEnterYm) {
            word.classList.remove('waiting-enter-sm');
            word.classList.add('waiting-enter-ym');

            let ym = word.querySelector('.tp-keys > .tp-ym');
            this.trigger('need', [{
                type:'ym', 
                key: ym.dataset.ymk, 
                py: ym.dataset.ym
            }]);

        } else if (this._current.state === wordEnterFinish) {
            word.classList.remove('waiting-enter-ym');
            word.classList.add('word-enter-finish');
            
            // 标记当前键入完成文字后面的标点符号为已完成
            let sibling = word.nextElementSibling;
            while(sibling != null && sibling.classList.contains('tp-symbol-box')) {
                sibling.classList.add('word-enter-finish');
                sibling = sibling.nextElementSibling;
            }
            
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