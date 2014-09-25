// Generated by CoffeeScript 1.3.3
(function() {

  window.quack = (function() {
    var api, clone, dot, get, has, hasApi, hasDot, hasObject, set, test, types, validate, validator;
    validator = (function() {
      var api, delegate, regexp;
      api = {};
      delegate = ['Function', 'Object', 'Array', 'Number', 'String', 'Boolean', 'Date', 'RegExp', 'Element'];
      _.each(delegate, function(type) {
        var fn;
        fn = 'is' + type;
        return api[fn] = _[fn];
      });
      regexp = {
        Email: /^.+@.+\..+$/,
        Zipcode: /^[0-9]{4}[A-Z]{2}$/,
        Hex: /^#?([a-f0-9]{6}|[a-f0-9]{3})$/,
        Ip: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
        Slug: /^[a-z0-9\-\_]+$/
      };
      api.regexp = regexp;
      _.each(regexp, function(rgxp, type) {
        var fn;
        fn = 'is' + type;
        return api[fn] = function(val) {
          return val && rgxp.test(val);
        };
      });
      api.types = delegate.concat(_.keys(regexp));
      return api;
    })();
    types = validator.types;
    hasApi = function(obj, methods) {
      return _.all(methods, function(method) {
        return _.has(obj, method) && _.isFunction(obj[method]);
      });
    };
    hasObject = function(parent, key) {
      return _.has(parent, key) && _.isObject(parent[key]);
    };
    dot = '.';
    hasDot = function(str) {
      return str && str.indexOf(dot) > -1;
    };
    get = function(parent, path) {
      var initial, key, last, _i, _len;
      if (!path) {
        return null;
      }
      if (hasDot(path)) {
        path = path.split(dot);
        initial = _.initial(path);
        last = _.last(path);
        for (_i = 0, _len = initial.length; _i < _len; _i++) {
          key = initial[_i];
          if (!hasObject(parent, key)) {
            return null;
          }
          parent = parent[key];
        }
        if (_.has(parent, last)) {
          return parent[last];
        }
        return null;
      }
      if (_.has(parent, path)) {
        return parent[path];
      }
      return null;
    };
    set = function(parent, path, val) {
      var initial, key, last, _i, _len;
      if (hasDot(path)) {
        path = path.split(dot);
        initial = _.initial(path);
        last = _.last(path);
        for (_i = 0, _len = initial.length; _i < _len; _i++) {
          key = initial[_i];
          if (hasObject(parent, key)) {
            parent = parent[key];
          } else {
            parent[key] = {};
            parent = parent[key];
          }
        }
        return parent[last] = val;
      } else {
        return parent[path] = val;
      }
    };
    has = function(parent, path, fn) {
      var nested;
      nested = get(parent, path);
      return (nested != null) && validator[fn](nested);
    };
    test = function(parent, path, regExp) {
      var str;
      if (!api.isString(parent, path)) {
        return false;
      }
      str = get(parent, path);
      return regExp.test(str);
    };
    clone = function(parent, src) {
      var nested;
      nested = get(parent, src);
      if (nested == null) {
        return null;
      }
      if (_.isObject(nested)) {
        return _.clone(nested);
      }
      return nested;
    };
    api = {
      get: get,
      set: set,
      test: test,
      clone: clone
    };
    _.each(types, function(type) {
      var fn;
      fn = 'is' + type;
      return api[fn] = function(parent, path) {
        return has(parent, path, fn);
      };
    });
    api.hasApi = function(parent, path, methods) {
      var obj;
      if (_.isArray(path)) {
        return hasApi(parent, path);
      }
      if (api.isObject(parent, path)) {
        obj = api.get(parent, path);
        return hasApi(obj, methods);
      }
      return false;
    };
    api.validator = validator;
    _.each(types, function(type) {
      return api[type.toUpperCase()] = type;
    });
    validate = function(obj, map) {
      if (_.isObject(map) && !_.isRegExp(map)) {
        return _.all(map, function(type, key) {
          var fn, nested;
          if (_.isObject(type)) {
            if (_.isRegExp(type)) {
              return test(obj, key, type);
            }
            nested = get(obj, key);
            return nested && validate(nested, type);
          }
          if (!_.contains(types, type)) {
            throw new Error('Unknown validation type');
          }
          fn = 'is' + type;
          return has(obj, key, fn);
        });
      }
      return false;
    };
    api.validate = function(parent, path, map) {
      var nested;
      if (_.isObject(path)) {
        return validate(parent, path);
      }
      nested = get(parent, path);
      return nested && validate(nested, map);
    };
    return api;
  })();

}).call(this);
