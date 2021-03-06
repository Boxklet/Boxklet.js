##<span style="color:#5AB0EE;">B</span>oxklet
[Boxklet](https://github.com/Boxklet) 是一个静态的文档程序，整个程序均为 `HTML`、 `CSS` 和 `JavaScript` 构成，利用 `json` 作为数据索引，支持 Markdown。适合文档内容较少的项目。因为所有操作都是使用 `JavaScript` 完成，所以速度取决于访客的电脑和所使用的浏览器而定。

>制作本程序的主要初衷是想整理一些游戏 Wiki 的中文档，并且需要方便查找文档内容。还能离线浏览并且不需要依附其他动态语言，可以托管到 Github Pages。

数据结构：
```json
{
  "doc_version": "1.0",
  "doc_title": "Simple Doc",
  "doc_time": "",
  "doc_folder": "docs",
  "doc_home_page": "about_boxklet.md",
  "doc_items": [
    {
      "title": "About Boxklet",
      "titlezh": "关于 Boxklet",
      "category": "",
      "doc": "about_boxklet.md"
    }
  ],
  "doc_menu": [
  ]
}
```
所使用的开源项目：
*	[jQuery](https://jquery.com)
*	[highlight.js](https://highlightjs.org) 
*	[marked](https://github.com/chjj/marked)	 

-----------

未来打算开发一款跨平台的文档查询软件，用户可以自己制作文档内容打包成一个文件分发。而且作者可以自定义文档升级地址。