# 暂时叫做MateKbd

## 简介
一个支持多种双拼方案的在线双拼练习网站。

## 服务器
### 接口文档
+ 见`backend/manual.md`文档。

## 前端
略

## 通用设定
### 文章结构

`tone`：带音调的拼音，对于零声母拼音是一个长度为1的数组，[0]为韵母；对于普通拼音是一个长度为2的数组，[0]为声母，[1]为韵母。该字段用于对文字注音显示

`spell`：不带音调的拼音，数组格式说明与`tone`字段相同

`canInput`：对于文字此项值为`true`；对于其他字符，此项为`false`。当此项为`false`时，`tone`和`spell`字段不存在

示例：

```json
{
    "article": [
        {
            "word": "偶",
            "tone": ["ǒu"],
            "spell": ["ou"],
            "canInput": true
        },
        {
            "word": "昂",
            "tone": ["áng"],
            "spell": ["ang"],
            "canInput": true
        },
        {
            "word": "天",
            "tone": ["t", "iān"],
            "spell": ["t", "ian"],
            "canInput": true
        },
        {
            "word": "只",
            "tone": ["zh", "ǐ"],
            "spell": ["zh", "i"],
            "canInput": true
        },
        {
            "word": "啊",
            "tone": ["a"],
            "spell": ["a"],
            "canInput": true
        },
        {
            "word": "！",
            "canInput": false
        }
    ]
}
```

### 键位映射

// 键位根据【微软拼音输入法】双拼方案选择界面，键位分布图录入
// `vn`、`van`与`un`、`uan`合并为`un`、`uan`
// 每个键位数组两项，第一项表声母，无则为null，第二项为韵母数组  
// `"0"`表示零声母方案  
> 为1表示非固定零声母，韵母首字母零声母模式  
> 为2表示非固定零声母，韵母首字母零声母，但双字母韵母同全拼模式  
> 其他字符表示该字符所在键为固定零声母模式  

// 零声母方案2为23个韵母，其他零声母方案为24个韵母。因为方案2不需要韵母`er`

// 此处仅仅列出两项方案，详情阅`keymap.json`

```json
{
    "微软双拼": {
        "key_map": {
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
        "key_map": {
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
    }
}
```
