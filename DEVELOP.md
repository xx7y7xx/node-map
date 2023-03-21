# Develop

## Remove react v18 warn

```
$ vim node_modules/react-dom/cjs/react-dom.development.js
```

Search for "ReactDOM.render is no longer supported in React 18", and comment this line.

```
$ mv node_modules/.cache/default-development /tmp
```

## How to create FAQ

* Write markdow in `src/NodeEditor/FooBarFaq.md` for `FooBarComponent.js` node
* Register this markdow in `src/NodeEditor/Faq.jsx`
* Use it in retejs component `.addControl(new FaqControl(this.editor, 'faq', node, {path: 'FooBarFaq'}))`

## See also

* [https://maputnik.github.io/](https://maputnik.github.io/)