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
        if(Array.isArray(article) === false || article.length === 0) {
            throw new Error('Argument must be a array with a length greater than zero');
        }

        // article = this._normalizeArticle(article);

        this._el.innerHTML = this._wordsHTML(article);

        this._words = this._getWordsControlArray(this._el);

        this._current = {
            position: 0,
            state: TypingPanel.wordState.initial
        }

        this._nextStep();
    }

    enterKey(key) {

        let {initial, waitingEnterSm, waitingEnterYm, wordEnterFinish} = TypingPanel.wordState;

        if(this._current == null || this._current.state === wordEnterFinish) return;


        let word = this._words[this._current.position];

        if(this._current.state === waitingEnterSm && word.initialKey === key || 
            this._current.state === waitingEnterYm && word.finalKey === key) {

            this._nextStep();
            this.trigger('hit');
        } else {

            this.trigger('miss');
        }

    }

    _normalizeArticle(article) {

    }

    _getWordsControlArray(el) {
        return Array.from(el.querySelectorAll('.tp-word-box')).map(this._wordController);
    }

    _wordController(word) {
        let {sm, smk}   = word.querySelector('.tp-keys > .tp-sm').dataset,
            {ym, ymk}   = word.querySelector('.tp-keys > .tp-ym').dataset;

        return {
            el          : word,
            initial     : sm,
            final       : ym,
            initialKey  : smk,
            finalKey    : ymk,

            waitingEnterInitial() {
                word.classList.add('waiting-enter-sm');
            },
            waitingEnterFinal() {
                word.classList.remove('waiting-enter-sm');
                word.classList.add('waiting-enter-ym');
            },
            wordEnterFinish() {
                word.classList.remove('waiting-enter-ym');
                word.classList.add('word-enter-finish');

                // 标记当前键入完成文字后面的标点符号为已完成
                let sibling = word.nextElementSibling;
                while(sibling != null && sibling.classList.contains('tp-symbol-box')) {
                    sibling.classList.add('word-enter-finish');
                    sibling = sibling.nextElementSibling;
                }
            }
        }
    }

    _wordsHTML(article) {
        let {initial2key, final2key} = this._reverseKeyMap();
        let initialFinal2key = Object.assign({}, initial2key, final2key);

        let html = article.map(wordInfo => {

            let {canInput, word, tone, spell} = wordInfo;
            let isZeroInitial = false;

            // 扩展零声母拼音数组
            if(canInput && spell.length === 1) {
                isZeroInitial = true;
                tone    = ['', tone[0]];
                spell   = this._normalizeZeroInitial(spell[0], this._zero);
            }

            if(canInput === false) {
                tone = spell = ['', ''];
            }

            let initialKey = canInput ? initialFinal2key[spell[0]] : '',
                finalKey   = canInput ? initialFinal2key[spell[1]] : '',
                boxType    = canInput ? 'tp-word-box' : 'tp-symbol-box';


            return `
            <div class="${boxType}">
                <div class="tp-pinyin">
                    <span class="tp-sm">${tone[0]}</span>
                    <span class="tp-ym">${tone[1]}</span>
                </div>

                <div class="tp-word">
                    <span class="tp-word-in" data-word="${word}">
                        ${word}
                    </span>
                </div>

                <div class="tp-keys">
                    <span class="tp-sm" data-smk="${initialKey}" data-sm="${spell[0]}">
                        ${initialKey}
                    </span>

                    <span class="tp-ym" data-ymk="${finalKey}" data-ym="${spell[1]}">
                        ${finalKey}
                    </span>
                </div>

            </div>
            `;

        }).join('');

        return html;
    }

    _reverseKeyMap() {
        let keyMap      = this._keyMap,
            initial2key = Object.create(null),
            final2key   = Object.create(null);

        for(let key in keyMap) {
            if(keyMap.hasOwnProperty(key) === false) break;
            
            let val = keyMap[key];

            // 声母
            if(val[0])
                initial2key[val[0]] = key;

            // 韵母
            for(let ym of val[1])
                final2key[ym] = key;
        }

        return {initial2key, final2key};
    }
    
    // 零声母拼音转换为双拼形式
    _normalizeZeroInitial(val ,type) {
        let vals = ['a', 'an', 'ai', 'ao', 'ang', 'e', 'en', 'ei', 'er', 'eng', 'o', 'ou'];

        if(vals.includes(val) === false) throw new Error();

        switch(type) {
            case 1: return [val[0], val];     // 非固定零声母方案

            case 2:
                if(val.length === 2)          // 非固定零声母方案（双字母音节保留全拼方式
                    return [val[0], val[1]];
                else
                    return [val[0], val];

            default:
                if(typeof type === 'string' && type.length === 1)    // 固定零声母方案
                    return [type, val];

                else throw new Error();
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
        let word    = this._words[this._current.position],
            state   = this._current.state;
            
        let {initial, waitingEnterSm, waitingEnterYm, wordEnterFinish} = TypingPanel.wordState;

        if(this._current.state === waitingEnterSm) {
            word.waitingEnterInitial();

            this.trigger('need', [{
                type    : 'sm',
                key     : word.initialKey,
                py      : word.initial
            }]);

        } else if (this._current.state === waitingEnterYm) {
            word.waitingEnterFinal();

            this.trigger('need', [{
                type    : 'ym',
                key     : word.finalKey,
                py      : word.final
            }]);

        } else if (this._current.state === wordEnterFinish) {
            word.wordEnterFinish();
            
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
    initial         : Symbol(),
    waitingEnterSm  : Symbol(),
    waitingEnterYm  : Symbol(),
    wordEnterFinish : Symbol()
}