# TypingPanel

双拼练习的文章显示面板

## 用法

需要首先引入EventEmitter：

```js
<script src="https://cdn.bootcss.com/EventEmitter/5.2.3/EventEmitter.min.js"></script>
```

```js
tppanel = new TypingPanel(keyMap, zero);

// 监听typingPanel发出的事件
tppanel.on('needkey', info => console.log(info));
tppanel.on('typingover', _ => alert('敲完了'));

// 使用新文章初始化
tppanel.init(article);

document.body.appendChild(tppanel.el);

// 监听页面上的输入事件
window.addEventListener('keypress', ev => {
    tppanel.enterKey(ev.key);
});
```

## API

### TypingPanel.constructor(keyMap, zero)

构造一个双拼练习面板

#### 参数

`keyMap`：键位布局，参见 XXXX

`zero`：零声母，参见 XXXX


### TypingPanel.prototype.init(article)

使用一篇文章来初始化typingPanel的内容

#### 参数

`article`：文章，参加 XXXX


### TypingPanel.prototype.el

TypingPanel实例的视图元素


### TypingPanel.prototype.on(eventName: String, callback: Function)

监听事件


### TypingPanel.prototype.off(eventName: String)

取消监听事件


### TypingPanel.prototype.enterKey(key: String)

输入一个键

#### 参数

`key`：需要输入的按键键名，可以为任意字符串，但仅当按键为`'a'`-`'z'`或`';'`时可能返回真

#### 返回值

如果输入的按键键名为期望的按键键名则返回`true`，否则返回`false`


## 事件