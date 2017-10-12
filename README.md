## 文章结构

`desc`：对于零声母拼音是一个长度为1的数组，[0]为韵母读音；对于普通拼音是一个长度为2的数组，[0]为声母读音，[1]为韵母读音。该字段用于对文字注音显示，对标点符号这类无需注音的字符，省略此键

`dmap`：和`desc`中的拼音对应，但是不应该有注音

注：`desc`和`dmap`字段的数组长度应该相同，当`desc`字段被省略时，同时省略`dmap`字段。

示例：

```json
{
    "article": [
        {
            "word": "偶",
            "desc": ["ǒu"],
            "dmap": ["ou"]
        },
        {
            "word": "昂",
            "desc": ["áng"],
            "dmap": ["ang"]
        },
        {
            "word": "天",
            "desc": ["t", "iān"],
            "dmap": ["t", "ian"]
        },
        {
            "word": "只",
            "desc": ["zh", "ǐ"],
            "dmap": ["zh", "i"]
        },
        {
            "word": "啊",
            "desc": ["a"],
            "dmap": ["a"]
        },
        {
            "word": "！"
        }
    ]
}
```

## 键位映射

// 键位根据【搜狗拼音输入法】双拼方案选择界面，键位分布图录入  
// `keymap.js`中存储了键位到声母韵母的映射，包含零声母方案参数`"0"`  
// 每个键位数组两项，第一项表声母，无则为null，第二项为韵母数组  
// `strmap.js`中存储了声母韵母到键位的映射  
// `"0"`表示零声母方案  
> 为1表示非固定零声母，韵母首字母零声母模式
> 为2表示非固定零声母，韵母首字母零声母，但双字母韵母同全拼模式
> 其他字符表示该字符所在键为固定零声母模式

// 此处仅仅列出两项方案，详情阅`keymap.js`

```json
{
    "微软双拼": {
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
        "m": ["m", ["ian"]],
        "0": "o"
    },
    "小鹤双拼": {
        "q": ["q", ["iu"]],
        "w": ["w", ["ei"]],
        "e": [null, ["e"]],
        "r": ["r", ["uan", "van"]],
        "t": ["t", ["ve", "ue"]],
        "y": ["y", ["vn", "un"]],
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
        "m": ["m", ["ian"]],
        "0": "2"
    }
}
```
