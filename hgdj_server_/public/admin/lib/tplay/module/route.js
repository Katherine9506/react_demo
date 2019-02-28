layui.define(["utils", "jquery", "lodash", "nprogress"],
function(i) {
    var e = layui.utils,
    t = e.localStorage,
    o = t.setItem,
    n = t.getItem,
    r = layui.jquery,
    a = layui.lodash,
    s = void 0,
    u = function() {
        this.config = {
            name: "TPLAYROUTE",
            routerViewId: void 0,
            beforeRender: void 0
        },
        this.version = "1.0.0"
    };
    u.prototype.set = function(i) {
        return r.extend(!0, this.config, i),
        this
    },
    u.prototype.setRoutes = function(i) {
        var t = this;
        i.name = i.name || t.config.name,
        t.config.name = i.name;
        var n = {
            routes: []
        };
        return r.extend(!0, n, i),
        a.forEach(n.routes,
        function(i) {
            i.id = (new Date).getTime() + "" + a.random(1e3, 9999)
        }),
        o(n.name, n.routes),
        r(window).off("popstate").on("popstate",
        function() {
            e.isFunction(i.onChanged) ? i.onChanged() : t.render()
        }),
        t
    },
    u.prototype.getRoutes = function() {
        return n(this.config.name)
    },
    u.prototype.getRoute = function(i) {
        var t = this.getRoutes(this.config.name);
        if (null !== t && void 0 !== t) {
            i = i || location.hash;
            var o = layui.router(i);
            return e.find(t,
            function(i) {
                return i.path === o.href.split("?")[0]
            })
        }
    },
    u.prototype.render = function(i, t, o) {
        var n = this,
        a = n.config,
        u = void 0;
        if (NProgress.start(), t && t.length > 0) u = t;
        else {
            var d = void 0 === a.routerViewId ? r("router-view") : r("router-view#" + a.routerViewId);
            if (d.length > 0) {
                var l = e.randomCode();
                d.parent().append('<div id="' + l + '"></div>'),
                d.remove(),
                u = r("#" + l),
                s = u
            }
        }
        void 0 === u && (u = s);
        var c = n.getRoute(i);
        function v() {
            NProgress.done(),
            e.isFunction(o) && o()
        }
        return void 0 !== c ? ("function" == typeof a.beforeRender && (c = a.beforeRender(c)), e.tplLoader(c.component,
        function(i) {
            u.html(i),
            v()
        },
        function(i) {
            var e = ['<div class="layui-fluid">', '<div class="layui-row">', '<div class="layui-col-xs12">', '<div class="tplay-not-router">', i, "</div>", "</div>", "</div>", "</div>"].join("");
            u.html(e),
            v()
        })) : (u.html(['<div class="layui-fluid">', '  <div class="layui-row">', '    <div class="layui-col-xs12">', '      <div class="layui-row">', '        <div class="layui-col-md4">&nbsp;</div>', '        <div class="layui-col-md4">', '          <div class="tplay-exception">', '            <i class="layui-icon tplay-exception-icon">&#xe61c;</i>', '            <h3 class="tplay-exception-title">:>404 抱歉，你访问的页面不存在</h3>', '            <a href="javascript:history.back(-1);" class="layui-btn">返回上一页</a>', "          </div>", "        </div>", '        <div class="layui-col-md4">&nbsp;</div>', "      </div>", "    </div>", "  </div>", "</div>"].join("")), NProgress.done()),
        n
    },
    u.prototype.params = function() {
        var i = layui.router();
        if (void 0 === i.href) return null;
        var e = i.href,
        t = e.substr(e.indexOf("?") + 1);
        if (e === t) return null;
        var o = t.split("&"),
        n = {};
        return a.forEach(o,
        function(i, e) {
            var t = i.split("="),
            o = t[0],
            r = t[1];
            n[o] = r
        }),
        n
    },
    i("route", new u)
});