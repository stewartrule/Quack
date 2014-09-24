


### Api

* isArray(parent, path)
* isBoolean(parent, path)
* isDate(parent, path)
* isElement(parent, path)
* isEmail(parent, path)
* isFunction(parent, path)
* isHex(parent, path)
* isIp(parent, path)
* isNumber(parent, path)
* isObject(parent, path)
* isRegExp(parent, path)
* isSlug(parent, path)
* isString(parent, path)
* isZipcode(parent, path)
* test(parent, path, regExp)
* validate(parent, path, map)
* hasApi(parent, path, methods)
* set(parent, path, val)
* get(parent, path)
* clone(parent, src, dest)

### Example

```js
var match = quack.test(config, 'resources.css.files.1', /^app([a-z0-9\._\-]+)css$/);
```

```js
var valid = quack.isEmail(config, 'user.email');
```

```js
var hasApi = quack.hasApi(config, 'api.book', ['getCosts', 'getTitle', 'getEan']);
```

