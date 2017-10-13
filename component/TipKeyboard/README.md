# TipKeyboard

用于双拼练习时作提示键盘，可以高亮按键、声母、韵母

## 用法

```js
var tipkb = new TipKeyboard(keyMap);
document.body.appendChild(tipkb.el);
```

## API

### TipKeyboard.constructor(keyMap)

#### 参数

`keyMap`：请参见 XXXXX

### TipKeyboard.prototype.el

当前TipKeyboard实例的视图元素

### TipKeyboard.prototype.highlightKey(key: Srting, isHighlight: Boolean)

高亮/取消高亮按键

#### 参数

`key`：目标按键，值为`'a'`-`'z'`或`';'`

`isHighlight`：行为，`true`为高亮，`false`为取消高亮

### TipKeyboard.prototype.highlightShengmu(shengmu: Srting, isHighlight: Boolean)

高亮/取消高亮声母

#### 参数

`shengmu`：目标声母，值为`b`、`p`、`m`、`f`...

`isHighlight`：行为，`true`为高亮，`false`为取消高亮

### TipKeyboard.prototype.highlightYunmu(yunmu: Srting, isHighlight: Boolean)

高亮/取消高亮韵母

#### 参数

`yunmu`：目标韵母，值为`a`、`o`、`e`、`ang`...

`isHighlight`：行为，`true`为高亮，`false`为取消高亮