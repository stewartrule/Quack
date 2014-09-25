
window.quack = do ->

    validator = do ->

        api = {}

        delegate = ['Function', 'Object', 'Array', 'Number', 'String', 'Boolean', 'Date', 'RegExp', 'Element']

        _.each delegate, (type) ->
            fn = 'is' + type
            api[fn] = _[fn]

        regexp = {
            Email: /^.+@.+\..+$/
            Zipcode: /^[0-9]{4}[A-Z]{2}$/
            Hex: /^#?([a-f0-9]{6}|[a-f0-9]{3})$/
            Ip: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
            Slug: /^[a-z0-9\-\_]+$/
        }

        api.regexp = regexp

        _.each regexp, (rgxp, type) ->
            fn = 'is' + type
            api[fn] = (val) ->
                val && rgxp.test(val)

        api.types = delegate.concat(_.keys(regexp))

        api

    types = validator.types

    hasApi = (obj, methods) ->
        _.all methods, (method) ->
            _.has(obj, method) && _.isFunction(obj[method])

    hasObject = (parent, key) ->
        _.has(parent, key) && _.isObject(parent[key])

    dot = '.'

    hasDot = (str) ->
        str && str.indexOf(dot) > -1

    get = (parent, path) ->
        unless path
            return null
        if hasDot(path)
            path = path.split(dot)
            initial = _.initial(path)
            last = _.last(path)
            for key in initial
                unless hasObject(parent, key)
                    return null
                parent = parent[key]
            if _.has(parent, last)
                return parent[last]
            return null
        if _.has(parent, path)
            return parent[path]
        null

    set = (parent, path, val) ->
        if hasDot(path)
            path = path.split(dot)
            initial = _.initial(path)
            last = _.last(path)
            for key in initial
                if hasObject(parent, key)
                    parent = parent[key]
                else
                    parent[key] = {}
                    parent = parent[key]
            parent[last] = val
        else
            parent[path] = val

    has = (parent, path, fn) ->
        nested = get(parent, path)
        nested? && validator[fn](nested)

    test = (parent, path, regExp) ->
        unless api.isString(parent, path)
            return false
        str = get(parent, path)
        regExp.test(str)

    clone = (parent, src) ->
        nested = get(parent, src)
        unless nested?
            return null
        if _.isObject(nested)
            return _.clone(nested)
        nested

    api = { get, set, test, clone }

    _.each types, (type) ->
        fn = 'is' + type
        api[fn] = (parent, path) ->
            has parent, path, fn

    api.hasApi = (parent, path, methods) ->
        if _.isArray(path)
            return hasApi(parent, path)
        if api.isObject(parent, path)
            obj = api.get(parent, path)
            return hasApi(obj, methods)
        return false

    api.validator = validator

    _.each types, (type) ->
        api[type.toUpperCase()] = type

    validate = (obj, map) ->
        if _.isObject(map) && not _.isRegExp(map)
            return _.all map, (type, key) ->
                if _.isObject(type)
                    if _.isRegExp(type)
                        return test(obj, key, type)
                    nested = get(obj, key)
                    if nested?
                        if _.isFunction(type)
                            return type(nested)
                        return validate(nested, type)
                    return false
                unless _.contains(types, type)
                    throw new Error('Unknown validation type')
                fn = 'is' + type
                return has(obj, key, fn)
        return false

    api.validate = (parent, path, map) ->
        if _.isObject(path)
            return validate(parent, path)
        nested = get(parent, path)
        nested && validate(nested, map)

    getCollectionValidator = (method, type) ->
        (value) ->
            if _.isArray(value) or _.isObject(value)
                return _[method] value, (item) ->
                    if _.isRegExp(type)
                        return type.test(item)

                    if _.contains(types, type)
                        fn = 'is' + type
                        return validator[fn](item)

                    if _.isFunction(type)
                        return type(item)

                    throw new Error('Unknown validation type to validate collections')

            return false

    api.all = (type) ->
        getCollectionValidator('all', type)

    api.any = (type) ->
        getCollectionValidator('any', type)

    api.whitelist = (values) ->
        api.all (value) ->
            _.contains(values, value)

    api.blacklist = (values) ->
        api.all (value) ->
            not _.contains(values, value)

    api

