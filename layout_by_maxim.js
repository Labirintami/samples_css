(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = global || self, factory(global.webix = {}));
}(this, (function (exports) { 'use strict';

	var UNMANAGED = 0;
	var ELEMENT = 1;
	var TEXT = 2;
	var COMMENT = 3;
	var VVIEW = 4;
	var VMODEL = 5;
	var ENV_DOM = typeof window !== "undefined";
	var doc = ENV_DOM ? document : {};
	var emptyObj = {};
	function noop() { }
	function retArg0(a) { return a; }
	var isArr = Array.isArray;
	function isPlainObj(val) {
	    return val != null && val.constructor === Object;
	}
	function insertArr(targ, arr, pos, rem) {
	    targ.splice.apply(targ, [pos, rem].concat(arr));
	}
	function isVal(val) {
	    var t = typeof val;
	    return t === "string" || t === "number";
	}
	function isFunc(val) {
	    return typeof val === "function";
	}
	function isProm(val) {
	    return typeof val === "object" && isFunc(val.then);
	}
	function assignObj(targ) {
	    var args = arguments;
	    for (var i = 1; i < args.length; i++) {
	        for (var k in args[i]) {
	            targ[k] = args[i][k];
	        }
	    }
	    return targ;
	}
	function deepSet(targ, path, val) {
	    var seg;
	    while (seg = path.shift()) {
	        if (path.length === 0) {
	            targ[seg] = val;
	        }
	        else {
	            targ[seg] = targ = targ[seg] || {};
	        }
	    }
	}
	function sliceArgs(args, offs) {
	    var arr = [];
	    for (var i = offs; i < args.length; i++) {
	        arr.push(args[i]);
	    }
	    return arr;
	}
	function eqObj(a, b) {
	    for (var i in a) {
	        if (a[i] !== b[i]) {
	            return false;
	        }
	    }
	    return true;
	}
	function eqArr(a, b) {
	    var alen = a.length;
	    if (b.length !== alen) {
	        return false;
	    }
	    for (var i = 0; i < alen; i++) {
	        if (a[i] !== b[i]) {
	            return false;
	        }
	    }
	    return true;
	}
	function eq(o, n) {
	    return (o === n ? true :
	        n == null || o == null ? false :
	            isArr(o) ? eqArr(o, n) :
	                isPlainObj(o) ? eqObj(o, n) :
	                    false);
	}
	function curry(fn, args, ctx) {
	    return function () {
	        return fn.apply(ctx, args);
	    };
	}
	function longestIncreasingSubsequence(a) {
	    var p = a.slice();
	    var result = [];
	    result[0] = 0;
	    var n = 0;
	    var u;
	    var v;
	    var j;
	    for (var i = 0; i < a.length; ++i) {
	        var k = a[i];
	        j = result[n];
	        if (a[j] < k) {
	            p[i] = j;
	            result[++n] = i;
	        }
	        else {
	            u = 0;
	            v = n;
	            while (u < v) {
	                j = (u + v) >> 1;
	                if (a[result[j]] < k) {
	                    u = j + 1;
	                }
	                else {
	                    v = j;
	                }
	            }
	            if (k < a[result[u]]) {
	                if (u > 0) {
	                    p[i] = result[u - 1];
	                }
	                result[u] = i;
	            }
	        }
	    }
	    v = result[n];
	    while (n >= 0) {
	        result[n--] = v;
	        v = p[v];
	    }
	    return result;
	}
	function binaryFindLarger(item, list) {
	    var min = 0;
	    var max = list.length - 1;
	    var guess;
	    var bitwise = (max <= 2147483647) ? true : false;
	    if (bitwise) {
	        while (min <= max) {
	            guess = (min + max) >> 1;
	            if (list[guess] === item) {
	                return guess;
	            }
	            else {
	                if (list[guess] < item) {
	                    min = guess + 1;
	                }
	                else {
	                    max = guess - 1;
	                }
	            }
	        }
	    }
	    else {
	        while (min <= max) {
	            guess = Math.floor((min + max) / 2);
	            if (list[guess] === item) {
	                return guess;
	            }
	            else {
	                if (list[guess] < item) {
	                    min = guess + 1;
	                }
	                else {
	                    max = guess - 1;
	                }
	            }
	        }
	    }
	    return (min == list.length) ? null : min;
	}
	function isPropAttr(name) {
	    return name[0] === ".";
	}
	function isEvAttr(name) {
	    return name[0] === "o" && name[1] === "n";
	}
	function isSplAttr(name) {
	    return name[0] === "_";
	}
	function isStyleAttr(name) {
	    return name === "style";
	}
	function repaint(node) {
	    node && node.el && node.el.offsetHeight;
	}
	function isHydrated(vm) {
	    return vm.node != null && vm.node.el != null;
	}
	function isDynAttr(tag, attr) {
	    switch (attr) {
	        case "value":
	        case "checked":
	        case "selected":
	            return true;
	    }
	    return false;
	}
	function getVm(n) {
	    n = n || emptyObj;
	    while (n.vm == null && n.parent) {
	        n = n.parent;
	    }
	    return n.vm;
	}
	function VNode() { }
	var VNodeProto = VNode.prototype = {
	    constructor: VNode,
	    type: null,
	    vm: null,
	    key: null,
	    ref: null,
	    data: null,
	    hooks: null,
	    ns: null,
	    el: null,
	    tag: null,
	    attrs: null,
	    body: null,
	    flags: 0,
	    _diff: null,
	    _dead: false,
	    _lis: false,
	    idx: null,
	    parent: null,
	};
	{
	    VNodeProto._class = null;
	}
	function defineText(body) {
	    var node = new VNode;
	    node.type = TEXT;
	    node.body = body;
	    return node;
	}
	var tagCache = {};
	var RE_ATTRS = /\[([^=\]]+)=?([^\]]+)?\]/g;
	function parseTag(raw) {
	    var cached = tagCache[raw];
	    if (cached == null) {
	        var tag, id, cls, attr;
	        tagCache[raw] = cached = {
	            tag: (tag = raw.match(/^[-\w]+/)) ? tag[0] : "div",
	            id: (id = raw.match(/#([-\w]+)/)) ? id[1] : null,
	            class: (cls = raw.match(/\.([-\w.]+)/)) ? cls[1].replace(/\./g, " ") : null,
	            attrs: null,
	        };
	        while (attr = RE_ATTRS.exec(raw)) {
	            if (cached.attrs == null) {
	                cached.attrs = {};
	            }
	            cached.attrs[attr[1]] = attr[2] || "";
	        }
	    }
	    return cached;
	}
	var DEVMODE = {
	    warnings: true,
	    verbose: true,
	    mutations: true,
	    DATA_REPLACED: function (vm, oldData, newData) {
	        if (isFunc(vm.view) && vm.view.length > 1) {
	            var msg = "A view's data was replaced. The data originally passed to the view closure during init is now stale. You may want to rely only on the data passed to render() or vm.data.";
	            return [msg, vm, oldData, newData];
	        }
	    },
	    UNKEYED_INPUT: function (vnode) {
	        return ["Unkeyed <input> detected. Consider adding a name, id, _key, or _ref attr to avoid accidental DOM recycling between different <input> types.", vnode];
	    },
	    UNMOUNTED_REDRAW: function (vm) {
	        return ["Invoking redraw() of an unmounted (sub)view may result in errors.", vm];
	    },
	    INLINE_HANDLER: function (vnode, oval, nval) {
	        return ["Anonymous event handlers get re-bound on each redraw, consider defining them outside of templates for better reuse.", vnode, oval, nval];
	    },
	    MISMATCHED_HANDLER: function (vnode, oval, nval) {
	        return ["Patching of different event handler styles is not fully supported for performance reasons. Ensure that handlers are defined using the same style.", vnode, oval, nval];
	    },
	    SVG_WRONG_FACTORY: function (vnode) {
	        return ["<svg> defined using domvm.defineElement. Use domvm.defineSvgElement for <svg> & child nodes.", vnode];
	    },
	    FOREIGN_ELEMENT: function (el) {
	        return ["domvm stumbled upon an element in its DOM that it didn't create, which may be problematic. You can inject external elements into the vtree using domvm.injectElement.", el];
	    },
	    REUSED_ATTRS: function (vnode) {
	        return ["Attrs objects may only be reused if they are truly static, as a perf optimization. Mutating & reusing them will have no effect on the DOM due to 0 diff.", vnode];
	    },
	    ADJACENT_TEXT: function (vnode, text1, text2) {
	        return ["Adjacent text nodes will be merged. Consider concatentating them yourself in the template for improved perf.", vnode, text1, text2];
	    },
	    ARRAY_FLATTENED: function (vnode, array) {
	        return ["Arrays within templates will be flattened. When they are leading or trailing, it's easy and more performant to just .concat() them in the template.", vnode, array];
	    },
	    ALREADY_HYDRATED: function (vm) {
	        return ["A child view failed to mount because it was already hydrated. Make sure not to invoke vm.redraw() or vm.update() on unmounted views.", vm];
	    },
	    ATTACH_IMPLICIT_TBODY: function (vnode, vchild) {
	        return ["<table><tr> was detected in the vtree, but the DOM will be <table><tbody><tr> after HTML's implicit parsing. You should create the <tbody> vnode explicitly to avoid SSR/attach() failures.", vnode, vchild];
	    }
	};
	function devNotify(key, args) {
	    if (DEVMODE.warnings && isFunc(DEVMODE[key])) {
	        var msgArgs = DEVMODE[key].apply(null, args);
	        if (msgArgs) {
	            msgArgs[0] = key + ": " + (DEVMODE.verbose ? msgArgs[0] : "");
	            console.warn.apply(console, msgArgs);
	        }
	    }
	}
	var DEEP_REMOVE = 1 << 0;
	var FIXED_BODY = 1 << 1;
	var KEYED_LIST = 1 << 2;
	var LAZY_LIST = 1 << 3;
	function initElementNode(tag, attrs, body, flags) {
	    var node = new VNode;
	    node.type = ELEMENT;
	    node.flags = flags || 0;
	    node.attrs = attrs || null;
	    {
	        var parsed = parseTag(tag);
	        tag = parsed.tag;
	        var hasId = parsed.id != null, hasClass = parsed.class != null, hasAttrs = parsed.attrs != null;
	        if (hasId || hasClass || hasAttrs) {
	            var p = node.attrs || {};
	            if (hasId && p.id == null) {
	                p.id = parsed.id;
	            }
	            if (hasClass) {
	                {
	                    node._class = parsed.class;
	                    p.class = parsed.class + (p.class != null ? (" " + p.class) : "");
	                }
	            }
	            if (hasAttrs) {
	                for (var key in parsed.attrs) {
	                    if (p[key] == null) {
	                        p[key] = parsed.attrs[key];
	                    }
	                }
	            }
	            node.attrs = p;
	        }
	    }
	    node.tag = tag;
	    if (node.attrs != null) {
	        var mergedAttrs = node.attrs;
	        {
	            if (mergedAttrs._key != null) {
	                node.key = mergedAttrs._key;
	            }
	            if (mergedAttrs._ref != null) {
	                node.ref = mergedAttrs._ref;
	            }
	            if (mergedAttrs._hooks != null) {
	                node.hooks = mergedAttrs._hooks;
	            }
	            if (mergedAttrs._data != null) {
	                node.data = mergedAttrs._data;
	            }
	            if (mergedAttrs._flags != null) {
	                node.flags = mergedAttrs._flags;
	            }
	        }
	        {
	            if (node.key == null) {
	                if (node.ref != null) {
	                    node.key = node.ref;
	                }
	                else if (mergedAttrs.id != null) {
	                    node.key = mergedAttrs.id;
	                }
	                else if (mergedAttrs.name != null) {
	                    node.key = mergedAttrs.name + (mergedAttrs.type === "radio" || mergedAttrs.type === "checkbox" ? mergedAttrs.value : "");
	                }
	            }
	        }
	    }
	    if (body != null) {
	        node.body = body;
	        if (body instanceof List) {
	            node.flags = body.flags;
	        }
	    }
	    {
	        if (node.tag === "svg") {
	            setTimeout(function () {
	                node.ns == null && devNotify("SVG_WRONG_FACTORY", [node]);
	            }, 16);
	        }
	        else if (/^(?:input|textarea|select|datalist|output)$/.test(node.tag) && node.key == null) {
	            devNotify("UNKEYED_INPUT", [node]);
	        }
	    }
	    return node;
	}
	function List(items, diff, key) {
	    var self = this, tpl;
	    var len = items.length;
	    self.flags = LAZY_LIST;
	    self.items = items;
	    self.length = len;
	    self.key = function (i) { return null; };
	    self.diff = {
	        val: function (i, newParent) {
	            return diff.val(items[i], newParent);
	        },
	        eq: function (i, donor) {
	            return diff.eq(donor._diff, self.diff.val(i));
	        }
	    };
	    self.tpl = function (i) { return tpl(items[i], i); };
	    self.map = function (tpl0) {
	        tpl = tpl0;
	        return self;
	    };
	    self.body = function (vnode) {
	        var nbody = [];
	        for (var i = 0; i < len; i++) {
	            var vnode2 = self.tpl(i);
	            if (vnode2.type != VVIEW) {
	                vnode2._diff = self.diff.val(i, vnode);
	            }
	            nbody.push(vnode2);
	        }
	        vnode.body = nbody;
	        preProcBody(vnode);
	    };
	    if (key != null) {
	        self.flags |= KEYED_LIST;
	        self.key = function (i) { return key(items[i], i); };
	    }
	    {
	        if (isFunc(diff)) {
	            self.diff = {
	                val: function (i) {
	                    return diff(items[i]);
	                },
	                eq: function (i, donor) {
	                    var o = donor._diff, n = self.diff.val(i);
	                    return eq(o, n);
	                }
	            };
	        }
	    }
	}
	var streamVal = retArg0;
	var streamOn = noop;
	var streamOff = noop;
	function setRef(vm, name, node) {
	    var path = ("refs." + name).split(".");
	    deepSet(vm, path, node);
	}
	function setDeepRemove(node) {
	    while (node = node.parent) {
	        node.flags |= DEEP_REMOVE;
	    }
	}
	function preProc(vnew, parent, idx, ownVm) {
	    if (vnew.type === VMODEL || vnew.type === VVIEW) {
	        return;
	    }
	    vnew.parent = parent;
	    vnew.idx = idx;
	    vnew.vm = ownVm;
	    if (vnew.ref != null) {
	        setRef(getVm(vnew), vnew.ref, vnew);
	    }
	    var nh = vnew.hooks, vh = ownVm && ownVm.hooks;
	    if (nh && (nh.willRemove || nh.didRemove) ||
	        vh && (vh.willUnmount || vh.didUnmount)) {
	        setDeepRemove(vnew);
	    }
	    if (isArr(vnew.body)) {
	        preProcBody(vnew);
	    }
	    else if (vnew.body === "") {
	        vnew.body = null;
	    }
	    else {
	        {
	            vnew.body = streamVal(vnew.body, getVm(vnew)._stream);
	        }
	        if (vnew.body != null && !(vnew.body instanceof List)) {
	            vnew.body = "" + vnew.body;
	        }
	    }
	}
	function preProcBody(vnew) {
	    var body = vnew.body;
	    for (var i = 0; i < body.length; i++) {
	        var node2 = body[i];
	        if (node2 === false || node2 == null) {
	            body.splice(i--, 1);
	        }
	        else if (isArr(node2)) {
	            {
	                if (i === 0 || i === body.length - 1) {
	                    devNotify("ARRAY_FLATTENED", [vnew, node2]);
	                }
	            }
	            insertArr(body, node2, i--, 1);
	        }
	        else {
	            if (node2.type == null) {
	                body[i] = node2 = defineText("" + node2);
	            }
	            if (node2.type === TEXT) {
	                if (node2.body == null || node2.body === "") {
	                    body.splice(i--, 1);
	                }
	                else if (i > 0 && body[i - 1].type === TEXT) {
	                    {
	                        devNotify("ADJACENT_TEXT", [vnew, body[i - 1].body, node2.body]);
	                    }
	                    body[i - 1].body += node2.body;
	                    body.splice(i--, 1);
	                }
	                else {
	                    preProc(node2, vnew, i, null);
	                }
	            }
	            else {
	                preProc(node2, vnew, i, null);
	            }
	        }
	    }
	}
	var unitlessProps = {
	    animationIterationCount: true,
	    boxFlex: true,
	    boxFlexGroup: true,
	    boxOrdinalGroup: true,
	    columnCount: true,
	    flex: true,
	    flexGrow: true,
	    flexPositive: true,
	    flexShrink: true,
	    flexNegative: true,
	    flexOrder: true,
	    gridRow: true,
	    gridColumn: true,
	    order: true,
	    lineClamp: true,
	    borderImageOutset: true,
	    borderImageSlice: true,
	    borderImageWidth: true,
	    fontWeight: true,
	    lineHeight: true,
	    opacity: true,
	    orphans: true,
	    tabSize: true,
	    widows: true,
	    zIndex: true,
	    zoom: true,
	    fillOpacity: true,
	    floodOpacity: true,
	    stopOpacity: true,
	    strokeDasharray: true,
	    strokeDashoffset: true,
	    strokeMiterlimit: true,
	    strokeOpacity: true,
	    strokeWidth: true
	};
	function autoPx(name, val) {
	    {
	        return !isNaN(val) && !unitlessProps[name] ? (val + "px") : val;
	    }
	}
	function patchStyle(n, o) {
	    var ns = (n.attrs || emptyObj).style;
	    var os = o ? (o.attrs || emptyObj).style : null;
	    if (ns == null || isVal(ns)) {
	        n.el.style.cssText = ns;
	    }
	    else {
	        for (var nn in ns) {
	            var nv = ns[nn];
	            {
	                ns[nn] = nv = streamVal(nv, getVm(n)._stream);
	            }
	            if (os == null || nv != null && nv !== os[nn]) {
	                n.el.style[nn] = autoPx(nn, nv);
	            }
	        }
	        if (os) {
	            for (var on in os) {
	                if (ns[on] == null) {
	                    n.el.style[on] = "";
	                }
	            }
	        }
	    }
	}
	var onemit = {};
	function emit(evName) {
	    var targ = this, src = targ;
	    var args = sliceArgs(arguments, 1).concat(src, src.data);
	    do {
	        var evs = targ.onemit;
	        var fn = evs ? evs[evName] : null;
	        if (fn) {
	            fn.apply(targ, args);
	            break;
	        }
	    } while (targ = targ.parent());
	    if (onemit[evName]) {
	        onemit[evName].apply(targ, args);
	    }
	}
	var onevent = noop;
	var syncRedraw = false;
	var registry = {};
	function listen(ontype) {
	    if (registry[ontype]) {
	        return;
	    }
	    registry[ontype] = true;
	    bind(doc, ontype, handle, true);
	}
	function unbind(el, type, fn, capt) {
	    el.removeEventListener(type.slice(2), fn, capt);
	}
	function bind(el, type, fn, capt) {
	    el.addEventListener(type.slice(2), fn, capt);
	}
	function exec(fn, args, e, node, vm) {
	    var out1 = fn.apply(vm, args.concat([e, node, vm, vm.data])), out2, out3;
	    {
	        out2 = vm.onevent(e, node, vm, vm.data, args),
	            out3 = onevent.call(null, e, node, vm, vm.data, args);
	    }
	    if (out1 === false || out2 === false || out3 === false) {
	        e.preventDefault();
	        e.stopPropagation();
	        return false;
	    }
	}
	function ancestEvDefs(type, node) {
	    var ontype = "on" + type, evDef, attrs, evDefs = [];
	    while (node) {
	        if (attrs = node.attrs) {
	            if ((evDef = attrs[ontype]) && isArr(evDef)) {
	                evDefs.unshift(evDef);
	            }
	        }
	        node = node.parent;
	    }
	    return evDefs;
	}
	function handle(e) {
	    var node = e.target._node;
	    if (node == null) {
	        return;
	    }
	    var evDefs = ancestEvDefs(e.type, node);
	    var vm = getVm(node);
	    for (var i = 0; i < evDefs.length; i++) {
	        var res = exec(evDefs[i][0], evDefs[i].slice(1), e, node, vm);
	        if (res === false) {
	            break;
	        }
	    }
	}
	function patchEvent(node, name, nval, oval) {
	    if (nval == oval) {
	        return;
	    }
	    {
	        if (isFunc(nval) && isFunc(oval) && oval.name == nval.name) {
	            devNotify("INLINE_HANDLER", [node, oval, nval]);
	        }
	        if (oval != null && nval != null &&
	            (isArr(oval) != isArr(nval) ||
	                isPlainObj(oval) != isPlainObj(nval) ||
	                isFunc(oval) != isFunc(nval))) {
	            devNotify("MISMATCHED_HANDLER", [node, oval, nval]);
	        }
	    }
	    var el = node.el;
	    if (isFunc(nval)) {
	        bind(el, name, nval, false);
	    }
	    else if (nval != null) {
	        listen(name);
	    }
	    if (isFunc(oval)) {
	        unbind(el, name, oval, false);
	    }
	}
	function remAttr(node, name, asProp) {
	    if (isPropAttr(name)) {
	        name = name.substr(1);
	        asProp = true;
	    }
	    if (asProp) {
	        node.el[name] = "";
	    }
	    else {
	        node.el.removeAttribute(name);
	    }
	}
	function setAttr(node, name, val, asProp, initial) {
	    var el = node.el;
	    if (node.ns != null) {
	        el.setAttribute(name, val);
	    }
	    else if (name === "class") {
	        el.className = val;
	    }
	    else if (name === "id" || typeof val === "boolean" || asProp) {
	        el[name] = val;
	    }
	    else if (name[0] === ".") {
	        el[name.substr(1)] = val;
	    }
	    else {
	        el.setAttribute(name, val);
	    }
	}
	function patchAttrs(vnode, donor, initial) {
	    var nattrs = vnode.attrs || emptyObj;
	    var oattrs = donor.attrs || emptyObj;
	    if (nattrs === oattrs) {
	        {
	            devNotify("REUSED_ATTRS", [vnode]);
	        }
	    }
	    else {
	        for (var key in nattrs) {
	            var nval = nattrs[key];
	            if (nval == null) {
	                continue;
	            }
	            var isDyn = isDynAttr(vnode.tag, key);
	            var oval = isDyn ? vnode.el[key] : oattrs[key];
	            {
	                nattrs[key] = nval = streamVal(nval, (getVm(vnode) || emptyObj)._stream);
	            }
	            if (nval === oval)
	                ;
	            else if (isStyleAttr(key)) {
	                patchStyle(vnode, donor);
	            }
	            else if (isSplAttr(key))
	                ;
	            else if (isEvAttr(key)) {
	                patchEvent(vnode, key, nval, oval);
	            }
	            else {
	                setAttr(vnode, key, nval, isDyn);
	            }
	        }
	        for (var key in oattrs) {
	            if (nattrs[key] == null) {
	                if (isEvAttr(key)) {
	                    patchEvent(vnode, key, nattrs[key], oattrs[key]);
	                }
	                else if (!isSplAttr(key)) {
	                    remAttr(vnode, key, isDynAttr(vnode.tag, key));
	                }
	            }
	        }
	    }
	}
	function createView(view, data, key, opts) {
	    if (view.type === VVIEW) {
	        data = view.data;
	        key = view.key;
	        opts = view.opts;
	        view = view.view;
	    }
	    return new ViewModel(view, data, key, opts);
	}
	var didQueue = [];
	function fireHook(hooks, name, o, n, immediate) {
	    if (hooks != null) {
	        var fn = o.hooks[name];
	        if (fn) {
	            if (name[0] === "d" && name[1] === "i" && name[2] === "d") {
	                if (immediate) {
	                    repaint(o.parent);
	                    fn(o, n);
	                }
	                else {
	                    didQueue.push([fn, o, n]);
	                }
	            }
	            else {
	                return fn(o, n);
	            }
	        }
	    }
	}
	function drainDidHooks(vm, doRepaint) {
	    if (didQueue.length) {
	        doRepaint && repaint(vm.node);
	        var item;
	        while (item = didQueue.shift()) {
	            item[0](item[1], item[2]);
	        }
	    }
	}
	function createElement(tag, ns) {
	    if (ns != null) {
	        return doc.createElementNS(ns, tag);
	    }
	    return doc.createElement(tag);
	}
	function createTextNode(body) {
	    return doc.createTextNode(body);
	}
	function createComment(body) {
	    return doc.createComment(body);
	}
	function nextSib(sib) {
	    return sib.nextSibling;
	}
	function prevSib(sib) {
	    return sib.previousSibling;
	}
	function deepNotifyRemove(node) {
	    var vm = node.vm;
	    var wuRes = vm != null && fireHook(vm.hooks, "willUnmount", vm, vm.data);
	    var wrRes = fireHook(node.hooks, "willRemove", node);
	    if ((node.flags & DEEP_REMOVE) === DEEP_REMOVE && isArr(node.body)) {
	        for (var i = 0; i < node.body.length; i++) {
	            deepNotifyRemove(node.body[i]);
	        }
	    }
	    return wuRes || wrRes;
	}
	function deepUnref(node, self) {
	    if (self) {
	        var vm = node.vm;
	        if (vm != null) {
	            vm.node = vm.refs = null;
	        }
	    }
	    var obody = node.body;
	    if (isArr(obody)) {
	        for (var i = 0; i < obody.length; i++) {
	            deepUnref(obody[i], true);
	        }
	    }
	}
	function _removeChild(parEl, el, immediate) {
	    var node = el._node, vm = node.vm;
	    deepUnref(node, true);
	    if ((node.flags & DEEP_REMOVE) === DEEP_REMOVE) {
	        for (var i = 0; i < node.body.length; i++) {
	            _removeChild(el, node.body[i].el);
	        }
	    }
	    delete el._node;
	    parEl.removeChild(el);
	    fireHook(node.hooks, "didRemove", node, null, immediate);
	    if (vm != null) {
	        fireHook(vm.hooks, "didUnmount", vm, vm.data, immediate);
	        vm.node = null;
	    }
	}
	function removeChild(parEl, el) {
	    var node = el._node;
	    if (node._dead) {
	        return;
	    }
	    var res = deepNotifyRemove(node);
	    if (res != null && isProm(res)) {
	        node._dead = true;
	        res.then(curry(_removeChild, [parEl, el, true]));
	    }
	    else {
	        _removeChild(parEl, el);
	    }
	}
	function clearChildren(parent) {
	    var parEl = parent.el;
	    if ((parent.flags & DEEP_REMOVE) === 0) {
	        deepUnref(parent, false);
	        parEl.textContent = null;
	    }
	    else {
	        var el = parEl.firstChild;
	        if (el != null) {
	            do {
	                var next = nextSib(el);
	                removeChild(parEl, el);
	            } while (el = next);
	        }
	    }
	}
	function insertBefore(parEl, el, refEl) {
	    var node = el._node, inDom = el.parentNode != null;
	    var vm = (el === refEl || !inDom) ? node.vm : null;
	    if (vm != null) {
	        fireHook(vm.hooks, "willMount", vm, vm.data);
	    }
	    fireHook(node.hooks, inDom ? "willReinsert" : "willInsert", node);
	    parEl.insertBefore(el, refEl);
	    fireHook(node.hooks, inDom ? "didReinsert" : "didInsert", node);
	    if (vm != null) {
	        fireHook(vm.hooks, "didMount", vm, vm.data);
	    }
	}
	function insertAfter(parEl, el, refEl) {
	    insertBefore(parEl, el, refEl ? nextSib(refEl) : null);
	}
	function hydrateBody(vnode) {
	    for (var i = 0; i < vnode.body.length; i++) {
	        var vnode2 = vnode.body[i];
	        var type2 = vnode2.type;
	        if (type2 <= COMMENT) {
	            insertBefore(vnode.el, hydrate(vnode2));
	        }
	        else if (type2 === VVIEW) {
	            var vm = createView(vnode2.view, vnode2.data, vnode2.key, vnode2.opts)._redraw(vnode, i, false);
	            type2 = vm.node.type;
	            insertBefore(vnode.el, hydrate(vm.node));
	        }
	        else if (type2 === VMODEL) {
	            var vm = vnode2.vm;
	            vm._update(vnode2.data, vnode, i, true, true);
	            type2 = vm.node.type;
	            insertBefore(vnode.el, vm.node.el);
	        }
	    }
	}
	function hydrate(vnode, withEl) {
	    if (vnode.el == null) {
	        if (vnode.type === ELEMENT) {
	            vnode.el = withEl || createElement(vnode.tag, vnode.ns);
	            if (vnode.attrs != null) {
	                patchAttrs(vnode, emptyObj);
	            }
	            if ((vnode.flags & LAZY_LIST) === LAZY_LIST) {
	                vnode.body.body(vnode);
	            }
	            if (isArr(vnode.body)) {
	                hydrateBody(vnode);
	            }
	            else if (vnode.body != null) {
	                vnode.el.textContent = vnode.body;
	            }
	        }
	        else if (vnode.type === TEXT) {
	            vnode.el = withEl || createTextNode(vnode.body);
	        }
	        else if (vnode.type === COMMENT) {
	            vnode.el = withEl || createComment(vnode.body);
	        }
	    }
	    vnode.el._node = vnode;
	    return vnode.el;
	}
	function nextNode(node, body) {
	    return body[node.idx + 1];
	}
	function prevNode(node, body) {
	    return body[node.idx - 1];
	}
	function parentNode(node) {
	    return node.parent;
	}
	var BREAK = 1;
	var BREAK_ALL = 2;
	function syncDir(advSib, advNode, insert, sibName, nodeName, invSibName, invNodeName, invInsert) {
	    return function (node, parEl, body, state, convTest, lis) {
	        var sibNode, tmpSib;
	        if (state[sibName] != null) {
	            sibNode = state[sibName]._node;
	            {
	                if (sibNode == null) {
	                    {
	                        devNotify("FOREIGN_ELEMENT", [state[sibName]]);
	                    }
	                    state[sibName] = advSib(state[sibName]);
	                    return;
	                }
	            }
	            if (parentNode(sibNode) !== node) {
	                tmpSib = advSib(state[sibName]);
	                sibNode.vm != null ? sibNode.vm.unmount(true) : removeChild(parEl, state[sibName]);
	                state[sibName] = tmpSib;
	                return;
	            }
	        }
	        if (state[nodeName] == convTest) {
	            return BREAK_ALL;
	        }
	        else if (state[nodeName].el == null) {
	            insert(parEl, hydrate(state[nodeName]), state[sibName]);
	            state[nodeName] = advNode(state[nodeName], body);
	        }
	        else if (state[nodeName].el === state[sibName]) {
	            state[nodeName] = advNode(state[nodeName], body);
	            state[sibName] = advSib(state[sibName]);
	        }
	        else if (!lis && sibNode === state[invNodeName]) {
	            tmpSib = state[sibName];
	            state[sibName] = advSib(tmpSib);
	            invInsert(parEl, tmpSib, state[invSibName]);
	            state[invSibName] = tmpSib;
	        }
	        else {
	            {
	                if (state[nodeName].vm != null) {
	                    devNotify("ALREADY_HYDRATED", [state[nodeName].vm]);
	                }
	            }
	            if (lis && state[sibName] != null) {
	                return lisMove(advSib, advNode, insert, sibName, nodeName, parEl, body, sibNode, state);
	            }
	            return BREAK;
	        }
	    };
	}
	function lisMove(advSib, advNode, insert, sibName, nodeName, parEl, body, sibNode, state) {
	    if (sibNode._lis) {
	        insert(parEl, state[nodeName].el, state[sibName]);
	        state[nodeName] = advNode(state[nodeName], body);
	    }
	    else {
	        var t = binaryFindLarger(sibNode.idx, state.tombs);
	        sibNode._lis = true;
	        var tmpSib = advSib(state[sibName]);
	        insert(parEl, state[sibName], t != null ? body[state.tombs[t]].el : t);
	        if (t == null) {
	            state.tombs.push(sibNode.idx);
	        }
	        else {
	            state.tombs.splice(t, 0, sibNode.idx);
	        }
	        state[sibName] = tmpSib;
	    }
	}
	var syncLft = syncDir(nextSib, nextNode, insertBefore, "lftSib", "lftNode", "rgtSib", "rgtNode", insertAfter);
	var syncRgt = syncDir(prevSib, prevNode, insertAfter, "rgtSib", "rgtNode", "lftSib", "lftNode", insertBefore);
	function syncChildren(node, donor) {
	    var obody = donor.body, parEl = node.el, body = node.body, state = {
	        lftNode: body[0],
	        rgtNode: body[body.length - 1],
	        lftSib: ((obody)[0] || emptyObj).el,
	        rgtSib: (obody[obody.length - 1] || emptyObj).el,
	    };
	    converge: while (1) {
	        while (1) {
	            var l = syncLft(node, parEl, body, state, null, false);
	            if (l === BREAK) {
	                break;
	            }
	            if (l === BREAK_ALL) {
	                break converge;
	            }
	        }
	        while (1) {
	            var r = syncRgt(node, parEl, body, state, state.lftNode, false);
	            if (r === BREAK) {
	                break;
	            }
	            if (r === BREAK_ALL) {
	                break converge;
	            }
	        }
	        sortDOM(node, parEl, body, state);
	        break;
	    }
	}
	function sortDOM(node, parEl, body, state) {
	    var domIdxs = [];
	    var el = parEl.firstChild;
	    do {
	        var n = el._node;
	        if (n.parent === node) {
	            domIdxs.push(n.idx);
	        }
	    } while (el = nextSib(el));
	    var tombs = longestIncreasingSubsequence(domIdxs).map(function (i) { return domIdxs[i]; });
	    for (var i = 0; i < tombs.length; i++) {
	        body[tombs[i]]._lis = true;
	    }
	    state.tombs = tombs;
	    while (1) {
	        var r = syncLft(node, parEl, body, state, null, true);
	        if (r === BREAK_ALL) {
	            break;
	        }
	    }
	}
	function alreadyAdopted(vnode) {
	    return vnode.el._node.parent !== vnode.parent;
	}
	function takeSeqIndex(n, obody, fromIdx) {
	    return obody[fromIdx];
	}
	function findSeqThorough(n, obody, fromIdx) {
	    for (; fromIdx < obody.length; fromIdx++) {
	        var o = obody[fromIdx];
	        if (o.vm != null) {
	            if (n.type === VVIEW && o.vm.view === n.view && o.vm.key === n.key || n.type === VMODEL && o.vm === n.vm) {
	                return o;
	            }
	        }
	        else if (!alreadyAdopted(o) && n.tag === o.tag && n.type === o.type && n.key === o.key && (n.flags & ~DEEP_REMOVE) === (o.flags & ~DEEP_REMOVE)) {
	            return o;
	        }
	    }
	    return null;
	}
	function findKeyed(n, obody, fromIdx) {
	    if (obody._keys == null) {
	        if (obody[fromIdx].key === n.key) {
	            return obody[fromIdx];
	        }
	        else {
	            var keys = {};
	            for (var i = 0; i < obody.length; i++) {
	                keys[obody[i].key] = i;
	            }
	            obody._keys = keys;
	        }
	    }
	    return obody[obody._keys[n.key]];
	}
	function patch(vnode, donor) {
	    fireHook(donor.hooks, "willRecycle", donor, vnode);
	    var el = vnode.el = donor.el;
	    var obody = donor.body;
	    var nbody = vnode.body;
	    el._node = vnode;
	    if (vnode.type === TEXT && nbody !== obody) {
	        el.nodeValue = nbody;
	        return;
	    }
	    if (vnode.attrs != null || donor.attrs != null) {
	        patchAttrs(vnode, donor);
	    }
	    var oldIsArr = isArr(obody);
	    var newIsArr = isArr(nbody);
	    var lazyList = (vnode.flags & LAZY_LIST) === LAZY_LIST;
	    if (oldIsArr) {
	        if (newIsArr || lazyList) {
	            patchChildren(vnode, donor);
	        }
	        else if (nbody !== obody) {
	            if (nbody != null) {
	                el.textContent = nbody;
	            }
	            else {
	                clearChildren(donor);
	            }
	        }
	    }
	    else {
	        if (newIsArr) {
	            clearChildren(donor);
	            hydrateBody(vnode);
	        }
	        else if (nbody !== obody) {
	            if (nbody != null && obody != null) {
	                el.firstChild.nodeValue = nbody;
	            }
	            else {
	                el.textContent = nbody;
	            }
	        }
	    }
	    fireHook(donor.hooks, "didRecycle", donor, vnode);
	}
	function patchChildren(vnode, donor) {
	    var nbody = vnode.body, nlen = nbody.length, obody = donor.body, olen = obody.length, isLazy = (vnode.flags & LAZY_LIST) === LAZY_LIST, isFixed = (vnode.flags & FIXED_BODY) === FIXED_BODY, isKeyed = (vnode.flags & KEYED_LIST) === KEYED_LIST, domSync = !isFixed && vnode.type === ELEMENT, doFind = true, find = (olen === 0 ? noop :
	        isKeyed ? findKeyed :
	            isFixed || isLazy ? takeSeqIndex :
	                findSeqThorough);
	    if (domSync && nlen === 0) {
	        clearChildren(donor);
	        if (isLazy) {
	            vnode.body = [];
	        }
	        return;
	    }
	    var donor2, node2, foundIdx, patched = 0, everNonseq = false, fromIdx = 0;
	    if (isLazy) {
	        var fnode2 = { key: null };
	        var nbodyNew = vnode.body = Array(nlen);
	    }
	    for (var i = 0; i < nlen; i++) {
	        if (isLazy) {
	            var remake = false;
	            if (doFind) {
	                if (isKeyed) {
	                    fnode2.key = nbody.key(i);
	                }
	                donor2 = find(fnode2, obody, fromIdx);
	            }
	            if (donor2 != null) {
	                foundIdx = donor2.idx;
	                if (nbody.diff.eq(i, donor2)) {
	                    node2 = donor2;
	                    node2.parent = vnode;
	                    node2.idx = i;
	                    node2._lis = false;
	                }
	                else {
	                    remake = true;
	                }
	            }
	            else {
	                remake = true;
	            }
	            if (remake) {
	                node2 = nbody.tpl(i);
	                if (node2.type === VVIEW) {
	                    if (donor2 != null) {
	                        node2 = donor2.vm._update(node2.data, vnode, i, true, true).node;
	                    }
	                    else {
	                        node2 = createView(node2.view, node2.data, node2.key, node2.opts)._redraw(vnode, i, false).node;
	                    }
	                }
	                else {
	                    preProc(node2, vnode, i);
	                    node2._diff = nbody.diff.val(i, vnode);
	                    if (donor2 != null) {
	                        patch(node2, donor2);
	                    }
	                }
	            }
	            nbodyNew[i] = node2;
	        }
	        else {
	            var node2 = nbody[i];
	            var type2 = node2.type;
	            if (type2 <= COMMENT) {
	                if (donor2 = doFind && find(node2, obody, fromIdx)) {
	                    patch(node2, donor2);
	                    foundIdx = donor2.idx;
	                }
	            }
	            else if (type2 === VVIEW) {
	                if (donor2 = doFind && find(node2, obody, fromIdx)) {
	                    foundIdx = donor2.idx;
	                    donor2.vm._update(node2.data, vnode, i, true, true);
	                }
	                else {
	                    createView(node2.view, node2.data, node2.key, node2.opts)._redraw(vnode, i, false);
	                }
	            }
	            else if (type2 === VMODEL) {
	                var vm = node2.vm;
	                var hasDOM = isHydrated(vm);
	                if (hasDOM && vm.node.parent != donor) {
	                    vm.unmount(true);
	                    hasDOM = false;
	                }
	                vm._update(node2.data, vnode, i, hasDOM, true);
	            }
	        }
	        if (donor2 != null) {
	            if (foundIdx === fromIdx) {
	                fromIdx++;
	                if (fromIdx === olen && nlen > olen) {
	                    donor2 = null;
	                    doFind = false;
	                }
	            }
	            else {
	                everNonseq = true;
	            }
	            if (!isKeyed && olen > 100 && everNonseq && ++patched % 10 === 0) {
	                while (fromIdx < olen && alreadyAdopted(obody[fromIdx])) {
	                    fromIdx++;
	                }
	            }
	        }
	    }
	    domSync && syncChildren(vnode, donor);
	}
	function DOMInstr(withTime) {
	    var isEdge = navigator.userAgent.indexOf("Edge") !== -1;
	    var isIE = navigator.userAgent.indexOf("Trident/") !== -1;
	    var getDescr = Object.getOwnPropertyDescriptor;
	    var defProp = Object.defineProperty;
	    var nodeProto = Node.prototype;
	    var textContent = getDescr(nodeProto, "textContent");
	    var nodeValue = getDescr(nodeProto, "nodeValue");
	    var htmlProto = HTMLElement.prototype;
	    var innerText = getDescr(htmlProto, "innerText");
	    var elemProto = Element.prototype;
	    var innerHTML = getDescr(!isIE ? elemProto : htmlProto, "innerHTML");
	    var className = getDescr(!isIE ? elemProto : htmlProto, "className");
	    var id = getDescr(!isIE ? elemProto : htmlProto, "id");
	    var styleProto = CSSStyleDeclaration.prototype;
	    var cssText = getDescr(styleProto, "cssText");
	    var inpProto = HTMLInputElement.prototype;
	    var areaProto = HTMLTextAreaElement.prototype;
	    var selProto = HTMLSelectElement.prototype;
	    var optProto = HTMLOptionElement.prototype;
	    var inpChecked = getDescr(inpProto, "checked");
	    var inpVal = getDescr(inpProto, "value");
	    var areaVal = getDescr(areaProto, "value");
	    var selVal = getDescr(selProto, "value");
	    var selIndex = getDescr(selProto, "selectedIndex");
	    var optSel = getDescr(optProto, "selected");
	    var origOps = {
	        "document.createElement": null,
	        "document.createElementNS": null,
	        "document.createTextNode": null,
	        "document.createComment": null,
	        "document.createDocumentFragment": null,
	        "DocumentFragment.prototype.insertBefore": null,
	        "Element.prototype.appendChild": null,
	        "Element.prototype.removeChild": null,
	        "Element.prototype.insertBefore": null,
	        "Element.prototype.replaceChild": null,
	        "Element.prototype.remove": null,
	        "Element.prototype.setAttribute": null,
	        "Element.prototype.setAttributeNS": null,
	        "Element.prototype.removeAttribute": null,
	        "Element.prototype.removeAttributeNS": null,
	    };
	    var counts = {};
	    var start = null;
	    function ctxName(opName) {
	        var opPath = opName.split(".");
	        var o = window;
	        while (opPath.length > 1) {
	            o = o[opPath.shift()];
	        }
	        return { ctx: o, last: opPath[0] };
	    }
	    for (var opName in origOps) {
	        var p = ctxName(opName);
	        if (origOps[opName] === null) {
	            origOps[opName] = p.ctx[p.last];
	        }
	        (function (opName, opShort) {
	            counts[opShort] = 0;
	            p.ctx[opShort] = function () {
	                counts[opShort]++;
	                return origOps[opName].apply(this, arguments);
	            };
	        })(opName, p.last);
	    }
	    counts.textContent = 0;
	    defProp(nodeProto, "textContent", {
	        set: function (s) {
	            counts.textContent++;
	            textContent.set.call(this, s);
	        },
	    });
	    counts.nodeValue = 0;
	    defProp(nodeProto, "nodeValue", {
	        set: function (s) {
	            counts.nodeValue++;
	            nodeValue.set.call(this, s);
	        },
	    });
	    counts.innerText = 0;
	    defProp(htmlProto, "innerText", {
	        set: function (s) {
	            counts.innerText++;
	            innerText.set.call(this, s);
	        },
	    });
	    counts.innerHTML = 0;
	    defProp(!isIE ? elemProto : htmlProto, "innerHTML", {
	        set: function (s) {
	            counts.innerHTML++;
	            innerHTML.set.call(this, s);
	        },
	    });
	    counts.className = 0;
	    defProp(!isIE ? elemProto : htmlProto, "className", {
	        set: function (s) {
	            counts.className++;
	            className.set.call(this, s);
	        },
	    });
	    counts.cssText = 0;
	    defProp(styleProto, "cssText", {
	        set: function (s) {
	            counts.cssText++;
	            cssText.set.call(this, s);
	        },
	    });
	    counts.id = 0;
	    defProp(!isIE ? elemProto : htmlProto, "id", {
	        set: function (s) {
	            counts.id++;
	            id.set.call(this, s);
	        },
	    });
	    counts.checked = 0;
	    defProp(inpProto, "checked", {
	        set: function (s) {
	            counts.checked++;
	            inpChecked.set.call(this, s);
	        },
	    });
	    counts.value = 0;
	    defProp(inpProto, "value", {
	        set: function (s) {
	            counts.value++;
	            inpVal.set.call(this, s);
	        },
	    });
	    defProp(areaProto, "value", {
	        set: function (s) {
	            counts.value++;
	            areaVal.set.call(this, s);
	        },
	    });
	    defProp(selProto, "value", {
	        set: function (s) {
	            counts.value++;
	            selVal.set.call(this, s);
	        },
	    });
	    counts.selectedIndex = 0;
	    defProp(selProto, "selectedIndex", {
	        set: function (s) {
	            counts.selectedIndex++;
	            selIndex.set.call(this, s);
	        },
	    });
	    counts.selected = 0;
	    defProp(optProto, "selected", {
	        set: function (s) {
	            counts.selected++;
	            optSel.set.call(this, s);
	        },
	    });
	    function reset() {
	        for (var i in counts) {
	            counts[i] = 0;
	        }
	    }
	    this.start = function () {
	        start = +new Date;
	    };
	    this.end = function () {
	        var _time = +new Date - start;
	        start = null;
	        var out = {};
	        for (var i in counts) {
	            if (counts[i] > 0) {
	                out[i] = counts[i];
	            }
	        }
	        reset();
	        if (withTime) {
	            out._time = _time;
	        }
	        return out;
	    };
	}
	var redrawQueue = new Set();
	var rafId = 0;
	function drainQueue() {
	    redrawQueue.forEach(function (vm) {
	        if (vm.node == null) {
	            return;
	        }
	        var parVm = vm;
	        while (parVm = parVm.parent()) {
	            if (redrawQueue.has(parVm)) {
	                return;
	            }
	        }
	        vm.redraw(true);
	    });
	    redrawQueue.clear();
	    rafId = 0;
	}
	var instr = null;
	{
	    if (DEVMODE.mutations) {
	        instr = new DOMInstr(true);
	    }
	}
	function ViewModel(view, data, key, opts) {
	    var vm = this;
	    vm.view = view;
	    vm.data = data;
	    vm.key = key;
	    if (opts) {
	        vm.opts = opts;
	        vm.cfg(opts);
	    }
	    var out = isPlainObj(view) ? view : view.call(vm, vm, data, key, opts);
	    if (isFunc(out)) {
	        vm.render = out;
	    }
	    else {
	        vm.render = out.render;
	        vm.cfg(out);
	    }
	    vm.init && vm.init.call(vm, vm, vm.data, vm.key, opts);
	}
	function dfltEq(vm, o, n) {
	    return eq(o, n);
	}
	function cfg(opts) {
	    var t = this;
	    if (opts.init) {
	        t.init = opts.init;
	    }
	    if (opts.diff) {
	        if (isFunc(opts.diff)) {
	            t.diff = {
	                val: opts.diff,
	                eq: dfltEq,
	            };
	        }
	        else {
	            t.diff = opts.diff;
	        }
	    }
	    {
	        if (opts.onevent) {
	            t.onevent = opts.onevent;
	        }
	    }
	    if (opts.hooks) {
	        t.hooks = assignObj(t.hooks || {}, opts.hooks);
	    }
	    {
	        if (opts.onemit) {
	            t.onemit = assignObj(t.onemit || {}, opts.onemit);
	        }
	    }
	}
	var ViewModelProto = ViewModel.prototype = {
	    constructor: ViewModel,
	    init: null,
	    view: null,
	    key: null,
	    data: null,
	    state: null,
	    api: null,
	    opts: null,
	    node: null,
	    hooks: null,
	    refs: null,
	    render: null,
	    mount: mount,
	    unmount: unmount,
	    cfg: cfg,
	    config: cfg,
	    parent: function () {
	        return getVm(this.node.parent);
	    },
	    root: function () {
	        var p = this.node;
	        while (p.parent) {
	            p = p.parent;
	        }
	        return p.vm;
	    },
	    redraw: function (sync) {
	        var vm = this;
	        {
	            if (sync == null) {
	                sync = syncRedraw;
	            }
	            if (sync) {
	                vm._redraw(null, null, isHydrated(vm));
	            }
	            else {
	                redrawQueue.add(vm);
	                if (rafId === 0) {
	                    rafId = requestAnimationFrame(drainQueue);
	                }
	            }
	        }
	        return vm;
	    },
	    update: function (newData, sync) {
	        var vm = this;
	        {
	            if (sync == null) {
	                sync = syncRedraw;
	            }
	            vm._update(newData, null, null, isHydrated(vm), sync);
	            if (!sync) {
	                vm.redraw();
	            }
	        }
	        return vm;
	    },
	    _update: updateSync,
	    _redraw: redrawSync,
	};
	{
	    ViewModelProto.onevent = noop;
	}
	function mount(el, isRoot) {
	    var vm = this;
	    {
	        if (DEVMODE.mutations) {
	            instr.start();
	        }
	    }
	    if (isRoot) {
	        clearChildren({ el: el, flags: 0 });
	        vm._redraw(null, null, false);
	        if (el.nodeName.toLowerCase() !== vm.node.tag) {
	            hydrate(vm.node);
	            insertBefore(el.parentNode, vm.node.el, el);
	            el.parentNode.removeChild(el);
	        }
	        else {
	            insertBefore(el.parentNode, hydrate(vm.node, el), el);
	        }
	    }
	    else {
	        vm._redraw(null, null);
	        if (el) {
	            insertBefore(el, vm.node.el);
	        }
	    }
	    if (el) {
	        drainDidHooks(vm, true);
	    }
	    {
	        if (DEVMODE.mutations) {
	            console.log(instr.end());
	        }
	    }
	    return vm;
	}
	function unmount(asSub) {
	    var vm = this;
	    {
	        streamOff(vm._stream);
	        vm._stream = null;
	    }
	    var node = vm.node;
	    var parEl = node.el.parentNode;
	    removeChild(parEl, node.el);
	    node.el = null;
	    if (!asSub) {
	        drainDidHooks(vm, true);
	    }
	}
	function reParent(vm, vold, newParent, newIdx) {
	    if (newParent != null) {
	        newParent.body[newIdx] = vold;
	        vold.idx = newIdx;
	        vold.parent = newParent;
	        vold._lis = false;
	    }
	    return vm;
	}
	function redrawSync(newParent, newIdx, withDOM) {
	    var isRedrawRoot = newParent == null;
	    var vm = this;
	    var isMounted = vm.node && vm.node.el && vm.node.el.parentNode;
	    {
	        if (isRedrawRoot && vm.node && vm.node.el && !vm.node.el.parentNode) {
	            devNotify("UNMOUNTED_REDRAW", [vm]);
	        }
	        if (isRedrawRoot && DEVMODE.mutations && isMounted) {
	            instr.start();
	        }
	    }
	    var doDiff = vm.diff != null, vold = vm.node, oldDiff, newDiff;
	    if (vold != null && isRedrawRoot) {
	        newParent = vold.parent;
	        newIdx = vold.idx;
	    }
	    if (doDiff) {
	        newDiff = vm.diff.val(vm, vm.data, vm.key, newParent, newIdx);
	        if (vold != null) {
	            oldDiff = vold._diff;
	            if (vm.diff.eq(vm, oldDiff, newDiff)) {
	                vold._diff = newDiff;
	                return reParent(vm, vold, newParent, newIdx);
	            }
	        }
	    }
	    isMounted && fireHook(vm.hooks, "willRedraw", vm, vm.data);
	    var vnew = vm.render.call(vm, vm, vm.data, vm.key, newParent, newIdx);
	    if (doDiff) {
	        vnew._diff = newDiff;
	    }
	    if (vnew === vold) {
	        return reParent(vm, vold, newParent, newIdx);
	    }
	    vm.refs = null;
	    if (vm.key != null && vnew.key !== vm.key) {
	        vnew.key = vm.key;
	    }
	    vm.node = vnew;
	    {
	        vm._stream = [];
	    }
	    if (newParent) {
	        preProc(vnew, newParent, newIdx, vm);
	        newParent.body[newIdx] = vnew;
	    }
	    else if (vold && vold.parent) {
	        preProc(vnew, vold.parent, vold.idx, vm);
	        vold.parent.body[vold.idx] = vnew;
	    }
	    else {
	        preProc(vnew, null, null, vm);
	    }
	    if (withDOM !== false) {
	        if (vold) {
	            if (vold.tag !== vnew.tag || vold.key !== vnew.key) {
	                vold.vm = vnew.vm = null;
	                var parEl = vold.el.parentNode;
	                var refEl = nextSib(vold.el);
	                removeChild(parEl, vold.el);
	                insertBefore(parEl, hydrate(vnew), refEl);
	                vold.el = vnew.el;
	                vnew.vm = vm;
	            }
	            else {
	                patch(vnew, vold);
	            }
	        }
	        else {
	            hydrate(vnew);
	        }
	    }
	    {
	        streamVal(vm.data, vm._stream);
	        vm._stream = streamOn(vm._stream);
	    }
	    isMounted && fireHook(vm.hooks, "didRedraw", vm, vm.data);
	    if (isRedrawRoot && isMounted) {
	        drainDidHooks(vm, true);
	    }
	    {
	        if (isRedrawRoot && DEVMODE.mutations && isMounted) {
	            console.log(instr.end());
	        }
	    }
	    return vm;
	}
	function updateSync(newData, newParent, newIdx, withDOM, withRedraw) {
	    var vm = this;
	    if (newData != null) {
	        if (vm.data !== newData) {
	            {
	                devNotify("DATA_REPLACED", [vm, vm.data, newData]);
	            }
	            fireHook(vm.hooks, "willUpdate", vm, newData);
	            vm.data = newData;
	        }
	    }
	    return withRedraw ? vm._redraw(newParent, newIdx, withDOM) : vm;
	}
	function defineElement(tag, arg1, arg2, flags) {
	    var attrs, body;
	    if (arg2 == null) {
	        if (isPlainObj(arg1)) {
	            attrs = arg1;
	        }
	        else {
	            body = arg1;
	        }
	    }
	    else {
	        attrs = arg1;
	        body = arg2;
	    }
	    return initElementNode(tag, attrs, body, flags);
	}
	function protoPatch(n, doRepaint) {
	    patch$1(this, n, doRepaint);
	}
	function patch$1(o, n, doRepaint) {
	    if (isPlainObj(n)) {
	        var donor = Object.create(o);
	        donor.attrs = assignObj({}, o.attrs);
	        {
	            if (n.class != null && o._class != null) {
	                n.class = o._class + " " + n.class;
	            }
	        }
	        var oattrs = assignObj(o.attrs, n);
	        patchAttrs(o, donor);
	        doRepaint && repaint(o);
	    }
	    else {
	        if (o.vm != null) {
	            return;
	        }
	        preProc(n, o.parent, o.idx, null);
	        o.parent.body[o.idx] = n;
	        patch(n, o);
	        doRepaint && repaint(n);
	        drainDidHooks(getVm(n), false);
	    }
	}
	VNodeProto.patch = protoPatch;
	function nextSubVms(n, accum) {
	    var body = n.body;
	    if (isArr(body)) {
	        for (var i = 0; i < body.length; i++) {
	            var n2 = body[i];
	            if (n2.vm != null) {
	                accum.push(n2.vm);
	            }
	            else {
	                nextSubVms(n2, accum);
	            }
	        }
	    }
	    return accum;
	}
	ViewModelProto.emit = emit;
	ViewModelProto.onemit = null;
	ViewModelProto.body = function () {
	    return nextSubVms(this.node, []);
	};
	ViewModelProto._stream = null;
	function protoAttach(el) {
	    var vm = this;
	    if (vm.node == null) {
	        vm._redraw(null, null, false);
	    }
	    attach(vm.node, el);
	    drainDidHooks(vm, false);
	    return vm;
	}
	function attach(vnode, withEl) {
	    vnode.el = withEl;
	    withEl._node = vnode;
	    var nattrs = vnode.attrs;
	    for (var key in nattrs) {
	        var nval = nattrs[key];
	        var isDyn = isDynAttr(vnode.tag, key);
	        if (isStyleAttr(key) || isSplAttr(key))
	            ;
	        else if (isEvAttr(key)) {
	            patchEvent(vnode, key, nval);
	        }
	        else if (nval != null && isDyn) {
	            setAttr(vnode, key, nval, isDyn);
	        }
	    }
	    if ((vnode.flags & LAZY_LIST) === LAZY_LIST) {
	        vnode.body.body(vnode);
	    }
	    if (isArr(vnode.body) && vnode.body.length > 0) {
	        var c = withEl.firstChild;
	        var i = 0;
	        var v = vnode.body[i];
	        do {
	            if (v.type === VVIEW) {
	                v = createView(v.view, v.data, v.key, v.opts)._redraw(vnode, i, false).node;
	            }
	            else if (v.type === VMODEL) {
	                v = v.vm.node || v.vm._update(v.data, vnode, i, false, true).node;
	            }
	            {
	                if (vnode.tag === "table" && v.tag === "tr") {
	                    devNotify("ATTACH_IMPLICIT_TBODY", [vnode, v]);
	                }
	            }
	            attach(v, c);
	        } while ((c = c.nextSibling) && (v = vnode.body[++i]));
	        var vm = vnode.vm;
	        vm != null && fireHook(vm.hooks, "willMount", vm, vm.data);
	        fireHook(vnode.hooks, "willInsert", vnode);
	        fireHook(vnode.hooks, "didInsert", vnode);
	        vm != null && fireHook(vm.hooks, "didMount", vm, vm.data);
	    }
	}
	function vmProtoHtml(dynProps, par, idx) {
	    var vm = this;
	    if (vm.node == null) {
	        vm._redraw(par, idx, false);
	    }
	    var markup = html(vm.node, dynProps, par, idx);
	    didQueue.length = 0;
	    return markup;
	}
	function vProtoHtml(dynProps, par, idx) {
	    return html(this, dynProps, par, idx);
	}
	function camelDash(val) {
	    return val.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
	}
	function styleStr(css) {
	    var style = "";
	    for (var pname in css) {
	        if (css[pname] != null) {
	            style += camelDash(pname) + ": " + autoPx(pname, css[pname]) + '; ';
	        }
	    }
	    return style;
	}
	function toStr(val) {
	    return val == null ? '' : '' + val;
	}
	var voidTags = {
	    area: true,
	    base: true,
	    br: true,
	    col: true,
	    command: true,
	    embed: true,
	    hr: true,
	    img: true,
	    input: true,
	    keygen: true,
	    link: true,
	    meta: true,
	    param: true,
	    source: true,
	    track: true,
	    wbr: true
	};
	function escHtml(s) {
	    s = toStr(s);
	    for (var i = 0, out = ''; i < s.length; i++) {
	        switch (s[i]) {
	            case '&':
	                out += '&amp;';
	                break;
	            case '<':
	                out += '&lt;';
	                break;
	            case '>':
	                out += '&gt;';
	                break;
	            default: out += s[i];
	        }
	    }
	    return out;
	}
	function escQuotes(s) {
	    s = toStr(s);
	    for (var i = 0, out = ''; i < s.length; i++) {
	        out += s[i] === '"' ? '&quot;' : s[i];
	    }
	    return out;
	}
	function eachHtml(arr, dynProps, par) {
	    var buf = '';
	    for (var i = 0; i < arr.length; i++) {
	        buf += html(arr[i], dynProps, par, i);
	    }
	    return buf;
	}
	var innerHTML = ".innerHTML";
	function html(node, dynProps, par, idx) {
	    var out, style;
	    switch (node.type) {
	        case VVIEW:
	            out = createView(node.view, node.data, node.key, node.opts).html(dynProps, par, idx);
	            break;
	        case VMODEL:
	            out = node.vm.html(dynProps, par, idx);
	            break;
	        case ELEMENT:
	        case UNMANAGED:
	            if (node.el != null && node.tag == null) {
	                out = node.el.outerHTML;
	                break;
	            }
	            var buf = "";
	            buf += "<" + node.tag;
	            var attrs = node.attrs, hasAttrs = attrs != null;
	            if (hasAttrs) {
	                for (var pname in attrs) {
	                    if (isEvAttr(pname) || isPropAttr(pname) || isSplAttr(pname) || dynProps === false && isDynAttr(node.tag, pname)) {
	                        continue;
	                    }
	                    var val = attrs[pname];
	                    if (pname === "style" && val != null) {
	                        style = typeof val === "object" ? styleStr(val) : val;
	                        continue;
	                    }
	                    if (val === true) {
	                        buf += " " + escHtml(pname);
	                    }
	                    else if (val === false)
	                        ;
	                    else if (val != null) {
	                        buf += " " + escHtml(pname) + '="' + escQuotes(val) + '"';
	                    }
	                }
	                if (style != null) {
	                    buf += ' style="' + escQuotes(style.trim()) + '"';
	                }
	            }
	            if (node.body == null && node.ns != null && node.tag !== "svg") {
	                return buf + "/>";
	            }
	            else {
	                buf += ">";
	            }
	            if (!voidTags[node.tag]) {
	                if (hasAttrs && attrs[innerHTML] != null) {
	                    buf += attrs[innerHTML];
	                }
	                else if (isArr(node.body)) {
	                    buf += eachHtml(node.body, dynProps, node);
	                }
	                else if ((node.flags & LAZY_LIST) === LAZY_LIST) {
	                    node.body.body(node);
	                    buf += eachHtml(node.body, dynProps, node);
	                }
	                else {
	                    buf += escHtml(node.body);
	                }
	                buf += "</" + node.tag + ">";
	            }
	            out = buf;
	            break;
	        case TEXT:
	            out = escHtml(node.body);
	            break;
	        case COMMENT:
	            out = "<!--" + escHtml(node.body) + "-->";
	            break;
	    }
	    return out;
	}
	ViewModelProto.attach = protoAttach;
	ViewModelProto.html = vmProtoHtml;
	VNodeProto.html = vProtoHtml;

	var el = defineElement;
	var cv = createView;

	var widgets = {};
	function defined(a) {
	    return typeof a !== "undefined";
	}
	function ui(config) {
	    var view = config.view;
	    if (!view) {
	        if (config.rows || config.cols)
	            view = "layout";
	        else if (config.template)
	            view = "template";
	        else
	            view = "spacer";
	    }
	    if (config.container && !defined(config.fillspace))
	        config.fillspace = true;
	    var w = widgets[view];
	    return new w(config);
	}
	function register(name, factory) {
	    widgets[name] = factory;
	}

	var INCORRECT_VALUE = 1;
	function logError(mode, prop, now, expected) {
	    switch (mode) {
	        case INCORRECT_VALUE:
	            console.log("incorrect config value, property " + prop + " = " + now + ", which is invalid, use " + expected + " instead");
	            break;
	    }
	}
	function defined$1(a) {
	    return typeof a !== "undefined";
	}
	function notdefined(a) {
	    return typeof a === "undefined";
	}
	var View = (function () {
	    function View(config) {
	        var _this = this;
	        this._settings = config;
	        this._size = { x: 0, y: 0 };
	        this._ensure_correct_sizes();
	        this._css = "wbx-view";
	        var vm = cv({ render: function (vm) { return _this.render(vm); } });
	        var container = this._settings.container;
	        if (container) {
	            setTimeout(function () { return vm.mount(container); });
	        }
	    }
	    View.prototype._ensure_correct_sizes = function () {
	        var s = this._settings;
	        {
	            if (defined$1(s.gravity) && s.gravity * 1 != s.gravity) {
	                logError(INCORRECT_VALUE, "gravity", s.gravity, parseFloat(s.gravity));
	            }
	        }
	        if (typeof s.width === "number")
	            s.width = s.width + "px";
	        if (typeof s.height === "number")
	            s.height = s.height + "px";
	        if (typeof s.minWidth === "number")
	            s.minWidth = s.minWidth + "px";
	        if (typeof s.minHeight === "number")
	            s.minHeight = s.minHeight + "px";
	        if (typeof s.maxWidth === "number")
	            s.maxWidth = s.maxWidth + "px";
	        if (typeof s.maxHeight === "number")
	            s.maxHeight = s.maxHeight + "px";
	        s.gravity = s.gravity || 1;
	    };
	    View.prototype.$getSizes = function () {
	        return this._settings;
	    };
	    View.prototype.$setSizes = function (xN, yN) {
	        var _a = this._size, x = _a.x, y = _a.y;
	        this._size.x = x;
	        this._size.y = y;
	        if (x != xN || y != yN)
	            return true;
	        return false;
	    };
	    Object.defineProperty(View.prototype, "config", {
	        get: function () {
	            return {};
	        },
	        enumerable: false,
	        configurable: true
	    });
	    View.prototype.render = function (vm, content) {
	        var _a = this._size, x = _a.x, y = _a.y;
	        var s = this._settings;
	        var grow = s._noGrow ? 0 : s.gravity;
	        var styles = "";
	        if (defined$1(s.minWidth))
	            styles += "min-width:" + s.minWidth + ";";
	        if (defined$1(s.maxWidth))
	            styles += "max-width:" + s.maxWidth + ";";
	        if (notdefined(s.width)) {
	            if (s.fillspace === true)
	                styles += "width:100%;";
	            else if (s.fillspace === "x") {
	                if (s.autowidth) {
	                    styles += "flex: 0 0 auto;";
	                }
	                else {
	                    styles += "flex:" + grow + " " + (this._cells
	                        ? "0 " + (this._vertical && grow ? "1px" : "auto")
	                        : "1 1px") + ";";
	                }
	            }
	        }
	        else
	            styles += "width:" + s.width + ";";
	        if (defined$1(s.minHeight))
	            styles += "min-height:" + s.minHeight + ";";
	        if (defined$1(s.maxHeight))
	            styles += "max-height:" + s.maxHeight + ";";
	        if (notdefined(s.height)) {
	            if (s.fillspace === true)
	                styles += "height:100%;";
	            else if (s.fillspace === "y")
	                if (s.autoheight) {
	                    styles += "flex: 0 0 auto;";
	                }
	                else {
	                    styles += "flex:" + grow + " " + (this._cells
	                        ? "0 " + (this._vertical ? "1px" : "auto")
	                        : "1 1px") + ";";
	                }
	        }
	        else
	            styles += "height:" + s.height + ";";
	        if (s.fillspace === true && notdefined(s.width) && notdefined(s.height)) {
	            styles += "flex: " + grow + " 1 auto;";
	        }
	        return el("div", { class: this._css + " " + (this._settings.css || ""), style: styles }, content);
	    };
	    return View;
	}());
	register("view", View);

	/*! *****************************************************************************
	Copyright (c) Microsoft Corporation.

	Permission to use, copy, modify, and/or distribute this software for any
	purpose with or without fee is hereby granted.

	THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
	REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
	AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
	INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
	LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
	OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
	PERFORMANCE OF THIS SOFTWARE.
	***************************************************************************** */
	/* global Reflect, Promise */

	var extendStatics = function(d, b) {
	    extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return extendStatics(d, b);
	};

	function __extends(d, b) {
	    extendStatics(d, b);
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	}

	var Button = (function (_super) {
	    __extends(Button, _super);
	    function Button(config) {
	        var _this = this;
	        if (config.autowidth !== false)
	            config.autowidth = true;
	        _this = _super.call(this, config) || this;
	        _this._css += " wbx-button";
	        return _this;
	    }
	    Button.prototype.render = function (vm) {
	        var style = this._settings.autoheight ? "height: auto;" : "";
	        return _super.prototype.render.call(this, vm, [
	            el("button", { ".innerHTML": this._settings.value, style: style }),
	        ]);
	    };
	    return Button;
	}(View));
	register("button", Button);

	var FButton = (function (_super) {
	    __extends(FButton, _super);
	    function FButton(config) {
	        var _this = this;
	        if (!config.autoheight && !config.height)
	            config.height = 40;
	        _this = _super.call(this, config) || this;
	        return _this;
	    }
	    return FButton;
	}(Button));
	register("fbutton", FButton);

	var Spacer = (function (_super) {
	    __extends(Spacer, _super);
	    function Spacer(config) {
	        var _this = this;
	        config.noSize = true;
	        _this = _super.call(this, config) || this;
	        _this._css = "wbx-spacer";
	        return _this;
	    }
	    return Spacer;
	}(View));
	register("spacer", Spacer);

	var Layout = (function (_super) {
	    __extends(Layout, _super);
	    function Layout(config) {
	        var _this = _super.call(this, config) || this;
	        _this._cells = config.rows || config.cols;
	        _this._vertical = !!config.rows;
	        var type = _this._settings.type || "line";
	        _this._css += " wbx-layout-" + (_this._settings.rows ? "y" : "x");
	        _this._css += " wbx-layout-" + type;
	        _this._parse_cells();
	        return _this;
	    }
	    Layout.prototype._parse_cells = function () {
	        var _this = this;
	        this._cells = this._cells.map(function (a) {
	            a.fillspace = _this._vertical ? "y" : "x";
	            return ui(a);
	        });
	    };
	    Layout.prototype.render = function (vm) {
	        var _this = this;
	        var fixed = true;
	        this._cells.forEach(function (a) {
	            var s = a._settings;
	            if (_this._vertical) {
	                if (!s.width && !s.noSize)
	                    fixed = false;
	            }
	            else {
	                if (!s.height && !s.noSize)
	                    fixed = false;
	            }
	        });
	        this._settings._noGrow = fixed;
	        return _super.prototype.render.call(this, vm, this._cells.map(function (c) { return c.render(vm); }));
	    };
	    return Layout;
	}(View));
	register("layout", Layout);

	var Template = (function (_super) {
	    __extends(Template, _super);
	    function Template(config) {
	        var _this = _super.call(this, config) || this;
	        _this._css += " wbx-template";
	        return _this;
	    }
	    Template.prototype.render = function (vm) {
	        return _super.prototype.render.call(this, vm, [
	            el("div", { ".innerHTML": this._settings.template }),
	        ]);
	    };
	    return Template;
	}(View));
	register("template", Template);

	exports.Button = Button;
	exports.FButton = FButton;
	exports.Layout = Layout;
	exports.Spacer = Spacer;
	exports.Template = Template;
	exports.View = View;
	exports.ui = ui;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=webix.js.map
