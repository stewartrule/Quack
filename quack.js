// Generated by CoffeeScript 1.8.0
(function() {
  var Lib;

  Lib = (function() {
    var api, clone, dot, get, getCollectionValidator, getTypeOf, has, hasDot, hasObject, hasPath, isObjectSubType, isPlainObject, primaryTypes, set, test, validate, validators;
    primaryTypes = ['Function', 'Array', 'Number', 'String', 'Boolean', 'Date', 'RegExp', 'Element', 'Null', 'Undefined', 'NaN', 'Object'];
    getTypeOf = function(value) {
      return _.find(primaryTypes, function(type) {
        var fn;
        fn = 'is' + type;
        return _[fn](value);
      });
    };
    isObjectSubType = function(value) {
      return _.isFunction(value) || _.isArray(value) || _.isDate(value) || _.isRegExp(value) || _.isElement(value);
    };
    isPlainObject = function(value) {
      return _.isObject(value) && !isObjectSubType(value);
    };
    validators = (function() {
      var createResponse;
      createResponse = function(value, expected) {
        return {
          valid: true,
          value: value,
          expected: expected,
          detected: getTypeOf(value),
          constraints: {},
          pattern: false
        };
      };
      return {
        plainObject: function(options) {
          options || (options = {});
          return function(value) {
            var response;
            response = createResponse(value, 'Plain Object');
            if (!isPlainObject(value)) {
              response.valid = false;
              return response;
            }
            if (_.isNumber(options.length)) {
              if (_.keys(value).length !== options.length) {
                response.valid = false;
                response.constraints.length = false;
              }
            }
            return response;
          };
        },
        object: function(options) {
          options || (options = {});
          return function(value) {
            var response;
            response = createResponse(value, 'Object');
            if (!_.isObject(value)) {
              response.valid = false;
              return response;
            }
            return response;
          };
        },
        number: function(options) {
          options || (options = {});
          return function(value) {
            var response;
            response = createResponse(value, 'Number');
            if (!_.isNumber(value)) {
              response.valid = false;
              return response;
            }
            if (_.isNumber(options.min) && value < options.min) {
              response.valid = false;
              response.constraints.min = options.min;
            }
            if (_.isNumber(options.max) && value > options.max) {
              response.valid = false;
              response.constraints.max = options.max;
            }
            return response;
          };
        },
        integer: function(options) {
          options || (options = {});
          return function(value) {
            var isInt, response;
            response = createResponse(value, 'Integer');
            isInt = _.isNumber(value) && parseInt(value, 10) === value;
            if (!isInt) {
              response.valid = false;
              return response;
            }
            if (_.isNumber(options.min) && value < options.min) {
              response.valid = false;
              response.constraints.min = options.min;
            }
            if (_.isNumber(options.max) && value > options.max) {
              response.valid = false;
              response.constraints.max = options.max;
            }
            return response;
          };
        },
        nan: function() {
          return function(value) {
            var response;
            response = createResponse(value, 'NaN');
            if (!_.isNaN(value)) {
              response.valid = false;
            }
            return response;
          };
        },
        nil: function() {
          return function(value) {
            var response;
            response = createResponse(value, 'Null');
            if (!_.isNull(value)) {
              response.valid = false;
            }
            return response;
          };
        },
        undef: function() {
          return function(value) {
            var response;
            response = createResponse(value, 'Undefined');
            if (!_.isUndefined(value)) {
              response.valid = false;
            }
            return response;
          };
        },
        bool: function() {
          return function(value) {
            var response;
            response = createResponse(value, 'Boolean');
            if (!_.isBoolean(value)) {
              response.valid = false;
            }
            return response;
          };
        },
        regExp: function(options) {
          options || (options = {});
          return function(value) {
            var response;
            response = createResponse(value, 'RegExp');
            response.difference = {};
            if (!_.isRegExp(value)) {
              response.valid = false;
              return response;
            }
            _.each(['global', 'multiline', 'ignoreCase', 'lastIndex'], function(param) {
              if (_.has(options, param)) {
                if (value[param] !== options[param]) {
                  return response.difference[param] = {
                    detected: value[param],
                    expected: options[param]
                  };
                }
              }
            });
            response.valid = _.keys(response.difference).length === 0;
            return response;
          };
        },
        array: function(options) {
          options || (options = {});
          return function(value) {
            var response;
            response = createResponse(value, 'Array');
            if (!_.isArray(value)) {
              response.valid = false;
            }
            return response;
          };
        },
        func: function(options) {
          options || (options = {});
          return function(value) {
            var response;
            response = createResponse(value, 'Function');
            if (!_.isFunction(value)) {
              response.valid = false;
            }
            if (_.isNumber(options.length) && options.length !== value.length) {
              response.valid = false;
              response.constraints.length = false;
            }
            return response;
          };
        },
        string: function(options) {
          options || (options = {});
          return function(value) {
            var response;
            response = createResponse(value, 'String');
            if (!_.isString(value)) {
              response.valid = false;
              return response;
            }
            if (_.isNumber(options.min) && value.length < options.min) {
              response.valid = false;
              response.constraints.min = false;
            }
            if (_.isNumber(options.max) && value.length < options.max) {
              response.valid = false;
              response.constraints.max = false;
            }
            return response;
          };
        },
        pattern: function(regExp) {
          return function(value) {
            var response, valid;
            response = createResponse(value, 'String');
            if (!_.isString(value)) {
              response.valid = false;
              return response;
            }
            valid = regExp.test(value);
            response.pattern = regExp.toString();
            response.patternMatch = valid;
            response.valid = valid;
            return response;
          };
        },
        date: function(options) {
          options || (options = {});
          return function(value) {
            var maxTime, minTime, response, time;
            response = createResponse(value, 'Date');
            if (!_.isDate(value)) {
              response.valid = false;
              return response;
            }
            time = value.getTime();
            if (_.isDate(options.min)) {
              minTime = options.min.getTime();
              if (time < minTime) {
                response.valid = false;
                response.constraints.min = options.min;
              }
            }
            if (_.isDate(options.max)) {
              maxTime = options.max.getTime();
              if (time > maxTime) {
                response.valid = false;
                response.constraints.max = options.max;
              }
            }
            return response;
          };
        },
        element: function() {
          return function(value) {
            var response;
            response = createResponse(value, 'Element');
            if (!_.isElement(value)) {
              response.valid = false;
            }
            return response;
          };
        },
        api: function(methods) {
          return function(value) {
            var missing, response, valid;
            response = createResponse(value, ['Object', 'Array']);
            if (!_.isObject(value)) {
              response.valid = false;
              return response;
            }
            missing = [];
            if (_.isArray(methods)) {
              missing = _.reject(methods, function(method) {
                return _.has(value, method) && _.isFunction(value[method]);
              });
            } else if (_.isObject(methods)) {
              missing = _.reject(methods, function(numArgs, method) {
                var fn;
                if (!_.has(value, method)) {
                  return false;
                }
                fn = value[method];
                return _.isFunction(fn) && fn.length === numArgs;
              });
            }
            valid = missing.length === 0;
            response.valid = valid;
            if (!valid) {
              response.missing = missing;
            }
            return response;
          };
        }
      };
    })();
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
        return void 0;
      }
      if (hasDot(path)) {
        path = path.split(dot);
        initial = _.initial(path);
        last = _.last(path);
        for (_i = 0, _len = initial.length; _i < _len; _i++) {
          key = initial[_i];
          if (!hasObject(parent, key)) {
            return void 0;
          }
          parent = parent[key];
        }
        if (_.has(parent, last)) {
          return parent[last];
        }
        return void 0;
      }
      if (_.has(parent, path)) {
        return parent[path];
      }
      return void 0;
    };
    hasPath = function(parent, path) {
      var initial, key, last, _i, _len;
      if (!path) {
        return false;
      }
      if (hasDot(path)) {
        path = path.split(dot);
        initial = _.initial(path);
        last = _.last(path);
        for (_i = 0, _len = initial.length; _i < _len; _i++) {
          key = initial[_i];
          if (!hasObject(parent, key)) {
            return false;
          }
          parent = parent[key];
        }
        return _.has(parent, last);
      }
      return _.has(parent, path);
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
    has = function(parent, path, validator) {
      var nested;
      if (!hasPath(parent, path)) {
        return false;
      }
      nested = get(parent, path);
      return validator(nested);
    };
    test = function(parent, path, regExp) {
      var str;
      str = get(parent, path);
      return str && _.isString(str) && regExp.test(str);
    };
    clone = function(parent, src) {
      var nested;
      nested = get(parent, src);
      if (nested && _.isObject(nested)) {
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
    validate = function(obj, map) {
      var errors, numErrors;
      errors = {};
      if (!isPlainObject(map)) {
        throw new Error('map for comparison should be a plain object');
      }
      _.each(map, function(validator, key) {
        var nested, nestedErrors, pathExists, response;
        pathExists = hasPath(obj, key);
        nested = get(obj, key);
        if (_.isFunction(validator)) {
          response = validator(nested);
          response.pathExists = pathExists;
          if (!response.valid) {
            return errors[key] = response;
          }
        } else if (_.isRegExp(validator)) {
          validator = validators.pattern(validator);
          response = validator(nested);
          response.pathExists = pathExists;
          if (!response.valid) {
            return errors[key] = response;
          }
        } else if (_.isObject(validator)) {
          nestedErrors = validate(nested, validator);
          if (!nestedErrors.valid) {
            return _.each(nestedErrors.errors, function(err, k) {
              return errors[key + '.' + k] = err;
            });
          }
        } else {
          throw new Error('unknown validator type');
        }
      });
      numErrors = _.keys(errors).length;
      return {
        valid: numErrors === 0,
        errors: errors,
        numErrors: numErrors
      };
    };
    api.validate = function(parent, path, map) {
      var nested, pathExists;
      if (isPlainObject(path)) {
        return validate(parent, path);
      }
      if (!_.isString(path)) {
        throw new Error('path/key should be a string');
      }
      pathExists = hasPath(parent, path);
      nested = get(parent, path);
      if (nested) {
        return validate(nested, map);
      }
      return {
        valid: false,
        pathExists: pathExists
      };
    };
    getCollectionValidator = function(method, validator) {
      return function(value) {
        var collectionResponse, errors, responses, testable, valid;
        collectionResponse = {
          valid: false,
          errors: [],
          expected: ['Array', 'Object'],
          detected: getTypeOf(value)
        };
        testable = _.isArray(value) || isPlainObject(value);
        if (!testable) {
          return collectionResponse;
        }
        responses = _.map(value, function(item) {
          return validator(item);
        });
        valid = _[method](responses, function(response) {
          return response.valid;
        });
        errors = _.filter(responses, function(response) {
          return !response.valid;
        });
        collectionResponse.valid = valid;
        collectionResponse.errors = errors;
        collectionResponse.numErrors = _.keys(errors).length;
        return collectionResponse;
      };
    };
    api.all = function(validator) {
      return getCollectionValidator('all', validator);
    };
    api.any = function(validator) {
      return getCollectionValidator('any', validator);
    };
    api.delegate = function(map) {
      return function(value) {
        if (isPlainObject(value)) {
          return validate(value, map);
        }
        return validators.plainObject()(value);
      };
    };
    _.extend(api, validators);
    return api;
  })();

  if (typeof define === 'function' && define.amd) {
    define(function() {
      return Lib;
    });
  } else if (typeof exports === 'object') {
    module.exports = Lib;
  } else {
    window.quack = Lib;
  }

}).call(this);
