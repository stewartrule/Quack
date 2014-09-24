


### Type checking

* isArray(parent, path)
* isBoolean(parent, path)
* isDate(parent, path)
* isElement(parent, path)
* isFunction(parent, path)
* isNumber(parent, path)
* isObject(parent, path)
* isRegExp(parent, path)

### Pattern checking
* isEmail(parent, path)

```js
var valid = quack.isEmail(config, 'user.email');
```

* isHex(parent, path)
* isIp(parent, path)
* isSlug(parent, path)
* isString(parent, path)
* isZipcode(parent, path)


### Multiple fields
* validate(parent, path, map)

```js
var valid = quack.validate(config, 'media', {
    align: quack.OBJECT,
    src: quack.STRING,
    ratios: quack.ARRAY
});
```
### Custom regexp

* test(parent, path, regExp)

```js
var match = quack.test(config, 'resources.css.files.1', /^app([a-z0-9\._\-]+)css$/);
```

### Api check

* hasApi(parent, path, methods)

```js
var hasApi = quack.hasApi(config, 'api.book', ['getCosts', 'getTitle', 'getEan']);
```

### Get nested property

* get(parent, path)


### Manipulate

* set(parent, path, val)
* clone(parent, src, dest)


### Example







