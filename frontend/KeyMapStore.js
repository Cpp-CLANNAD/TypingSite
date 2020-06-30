class KeyMapStore {
    constructor() {

        if(localStorage.getItem("userKeyMap") === null) {
            localStorage.setItem("userKeyMap", JSON.stringify({}));
        }

        this.userKeyMap = JSON.parse(localStorage.getItem("userKeyMap"));
    }

    list() {

        return [
            ...Object.keys(KeyMapStore.defaultKeyMap),
            ...Object.keys(this.userKeyMap)
        ];
    }

    get(name) {

        if(name in KeyMapStore.defaultKeyMap === false && name in this.userKeyMap === false) return false;

        return KeyMapStore.defaultKeyMap[name] || this.userKeyMap[name];
    }

    set(name, scheme) {

        if(this.get(name) !== false) return false;

        if(KeyMapStore.validate(scheme).successful === false) return false;

        this.userKeyMap[name] = scheme;

        this._save();

        return true;
    }

    remove(name) {

        if(this.get(name) === false) return false;
        
        if(name in KeyMapStore.defaultKeyMap === true) return false;

        delete this.userKeyMap[name];

        this._save();

        return true;
    }

    _save() {
        localStorage.setItem("userKeyMap", JSON.stringify(this.userKeyMap));
    }

    static _reverseKeyMap(keyMap) {
        let initial2key = Object.create(null),
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

    static validate(scheme) {
        let zero = scheme['0'], zeroKey = zero, keyMap = scheme['keyMap'];
        let {initial2key, final2key} = this._reverseKeyMap(keyMap);
        let initials = [...KeyMapStore.initials], finals = [...KeyMapStore.finals];
        let messages = [];

        if(zero !== 1 && zero !== 2 && ['a', 'e', 'i', 'o', 'u', 'v', ';'].includes(zero) === false) throw new Error('zero vale = ' + zero);

        if(zero === 1) {
            // 

        } else if (zero === 2) {
            if(final2key['er'] !== undefined) {
                messages.push('当前零声母模式不允许设置韵母\'er\'的键位');
            }

            // 从声母数组去掉er
            finals = finals.filter(val => val !== 'er');

        } else {

            if(keyMap[zeroKey][0] !== null) {
                messages.push('零声母所在键位不能设置声母');
            }
        }

        let unsetInitial = [];
        for(let val of initials) {
            if(initial2key[val] === undefined) {
                unsetInitial.push(val);
            }
        }

        let unsetFinal = [];
        for(let val of finals) {
            if(final2key[val] === undefined) {
                unsetFinal.push(val);
            }
        }

        if(unsetInitial.length !== 0) {
            messages.push('以下声母未设置键位：' + unsetInitial.join(', '));
        }

        if(unsetFinal.length !== 0) {
            messages.push('以下韵母未设置键位：' + unsetFinal.join(', '));
        }

        return {
            successful  : messages.length ? false : true,
            errorMsg    : messages
        };
    }
}

KeyMapStore.initials = ["q", "w", "r", "t", "y", "sh", "ch", "p", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "zh", "b", "n", "m"];

KeyMapStore.finals   = ["iu", "ia", "ua", "e", "uan", "er", "ue", "uai", "v", "u", "i", "o", "uo", "un", "a", "ong", "iong", "iang", "uang", "en", "eng", "ang", "an", "ao", "ai", "ing", "ei", "ie", "iao", "ve", "ui", "ou", "in", "ian"];

KeyMapStore.defaultKeyMap = {
    "空模板": {
        "keyMap": {
            "q": [null, []],
            "w": [null, []],
            "e": [null, []],
            "r": [null, []],
            "t": [null, []],
            "y": [null, []],
            "u": [null, []],
            "i": [null, []],
            "o": [null, []],
            "p": [null, []],
            "a": [null, []],
            "s": [null, []],
            "d": [null, []],
            "f": [null, []],
            "g": [null, []],
            "h": [null, []],
            "j": [null, []],
            "k": [null, []],
            "l": [null, []],
            ";": [null, []],
            "z": [null, []],
            "x": [null, []],
            "c": [null, []],
            "v": [null, []],
            "b": [null, []],
            "n": [null, []],
            "m": [null, []]
        },
        "0": 1
    },
    "微软双拼": {
        "keyMap": {
            "q": ["q", ["iu"]],
            "w": ["w", ["ia", "ua"]],
            "e": [null, ["e"]],
            "r": ["r", ["uan", "er"]],
            "t": ["t", ["ue"]],
            "y": ["y", ["uai", "v"]],
            "u": ["sh", ["u"]],
            "i": ["ch", ["i"]],
            "o": [null, ["o", "uo"]],
            "p": ["p", ["un"]],
            "a": [null, ["a"]],
            "s": ["s", ["ong", "iong"]],
            "d": ["d", ["iang", "uang"]],
            "f": ["f", ["en"]],
            "g": ["g", ["eng"]],
            "h": ["h", ["ang"]],
            "j": ["j", ["an"]],
            "k": ["k", ["ao"]],
            "l": ["l", ["ai"]],
            ";": [null, ["ing"]],
            "z": ["z", ["ei"]],
            "x": ["x", ["ie"]],
            "c": ["c", ["iao"]],
            "v": ["zh", ["ve", "ui"]],
            "b": ["b", ["ou"]],
            "n": ["n", ["in"]],
            "m": ["m", ["ian"]]
        },
         "0": "o"
    }, 
    "小鹤双拼": {
        "keyMap": {
            "q": ["q", ["iu"]],
            "w": ["w", ["ei"]],
            "e": [null, ["e"]],
            "r": ["r", ["uan"]],
            "t": ["t", ["ve", "ue"]],
            "y": ["y", ["un"]],
            "u": ["sh", ["u"]],
            "i": ["ch", ["i"]],
            "o": [null, ["o", "uo"]],
            "p": ["p", ["ie"]],
            "a": [null, ["a"]],
            "s": ["s", ["ong", "iong"]],
            "d": ["d", ["ai"]],
            "f": ["f", ["en"]],
            "g": ["g", ["eng"]],
            "h": ["h", ["ang"]],
            "j": ["j", ["an"]],
            "k": ["k", ["uai", "ing"]],
            "l": ["l", ["iang", "uang"]],
            ";": [null, []],
            "z": ["z", ["ou"]],
            "x": ["x", ["ia", "ua"]],
            "c": ["c", ["ao"]],
            "v": ["zh", ["ui", "v"]],
            "b": ["b", ["in"]],
            "n": ["n", ["iao"]],
            "m": ["m", ["ian"]]
        },
        "0": 2
    },
    "自然码": {
        "keyMap": {
            "q": ["q", ["iu"]],
            "w": ["w", ["ia", "ua"]],
            "e": [null, ["e"]],
            "r": ["r", ["uan"]],
            "t": ["t", ["ve", "ue"]],
            "y": ["y", ["uai", "ing"]],
            "u": ["sh", ["u"]],
            "i": ["ch", ["i"]],
            "o": [null, ["o", "uo"]],
            "p": ["p", ["un"]],
            "a": [null, ["a"]],
            "s": ["s", ["ong", "iong"]],
            "d": ["d", ["iang", "uang"]],
            "f": ["f", ["en"]],
            "g": ["g", ["eng"]],
            "h": ["h", ["ang"]],
            "j": ["j", ["an"]],
            "k": ["k", ["ao"]],
            "l": ["l", ["ai"]],
            ";": [null, []],
            "z": ["z", ["ei"]],
            "x": ["x", ["ie"]],
            "c": ["c", ["iao"]],
            "v": ["zh", ["ui", "v"]],
            "b": ["b", ["ou"]],
            "n": ["n", ["in"]],
            "m": ["m", ["ian"]]
        },
        "0": 2
    }
}