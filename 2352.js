"use strict";
(self.webpackChunkbrowser_extension_wallet =
  self.webpackChunkbrowser_extension_wallet || []).push([
  ["2352"],
  {
    69441: function (t, e, i) {
      i.d(e, {
        FK: () => Animations,
        Gu: () => k,
        ST: () => LineController,
        W_: () => Element,
        f$: () => LinearScale,
        jI: () => DoughnutController,
        jn: () => LineElement,
        kL: () => Chart,
        od: () => PointElement,
        uw: () => CategoryScale,
      });
      var s = i(29020);
      let Animator = class Animator {
        constructor() {
          (this._request = null),
            (this._charts = new Map()),
            (this._running = !1),
            (this._lastDate = void 0);
        }
        _notify(t, e, i, s) {
          let a = e.listeners[s],
            n = e.duration;
          a.forEach((s) =>
            s({
              chart: t,
              initial: e.initial,
              numSteps: n,
              currentStep: Math.min(i - e.start, n),
            })
          );
        }
        _refresh() {
          this._request ||
            ((this._running = !0),
            (this._request = s.r.call(window, () => {
              this._update(),
                (this._request = null),
                this._running && this._refresh();
            })));
        }
        _update(t = Date.now()) {
          let e = 0;
          this._charts.forEach((i, s) => {
            let a;
            if (!i.running || !i.items.length) return;
            let n = i.items,
              r = n.length - 1,
              o = !1;
            for (; r >= 0; --r)
              (a = n[r])._active
                ? (a._total > i.duration && (i.duration = a._total),
                  a.tick(t),
                  (o = !0))
                : ((n[r] = n[n.length - 1]), n.pop());
            o && (s.draw(), this._notify(s, i, t, "progress")),
              n.length ||
                ((i.running = !1),
                this._notify(s, i, t, "complete"),
                (i.initial = !1)),
              (e += n.length);
          }),
            (this._lastDate = t),
            0 === e && (this._running = !1);
        }
        _getAnims(t) {
          let e = this._charts,
            i = e.get(t);
          return (
            i ||
              ((i = {
                running: !1,
                initial: !0,
                items: [],
                listeners: { complete: [], progress: [] },
              }),
              e.set(t, i)),
            i
          );
        }
        listen(t, e, i) {
          this._getAnims(t).listeners[e].push(i);
        }
        add(t, e) {
          e && e.length && this._getAnims(t).items.push(...e);
        }
        has(t) {
          return this._getAnims(t).items.length > 0;
        }
        start(t) {
          let e = this._charts.get(t);
          e &&
            ((e.running = !0),
            (e.start = Date.now()),
            (e.duration = e.items.reduce(
              (t, e) => Math.max(t, e._duration),
              0
            )),
            this._refresh());
        }
        running(t) {
          if (!this._running) return !1;
          let e = this._charts.get(t);
          return !!e && !!e.running && !!e.items.length;
        }
        stop(t) {
          let e = this._charts.get(t);
          if (!e || !e.items.length) return;
          let i = e.items,
            s = i.length - 1;
          for (; s >= 0; --s) i[s].cancel();
          (e.items = []), this._notify(t, e, Date.now(), "complete");
        }
        remove(t) {
          return this._charts.delete(t);
        }
      };
      var a = new Animator();
      let n = "transparent",
        r = {
          boolean: (t, e, i) => (i > 0.5 ? e : t),
          color(t, e, i) {
            let a = (0, s.c)(t || n),
              r = a.valid && (0, s.c)(e || n);
            return r && r.valid ? r.mix(a, i).hexString() : e;
          },
          number: (t, e, i) => t + (e - t) * i,
        };
      let Animation = class Animation {
        constructor(t, e, i, a) {
          let n = e[i];
          a = (0, s.a)([t.to, a, n, t.from]);
          let o = (0, s.a)([t.from, n, a]);
          (this._active = !0),
            (this._fn = t.fn || r[t.type || typeof o]),
            (this._easing = s.e[t.easing] || s.e.linear),
            (this._start = Math.floor(Date.now() + (t.delay || 0))),
            (this._duration = this._total = Math.floor(t.duration)),
            (this._loop = !!t.loop),
            (this._target = e),
            (this._prop = i),
            (this._from = o),
            (this._to = a),
            (this._promises = void 0);
        }
        active() {
          return this._active;
        }
        update(t, e, i) {
          if (this._active) {
            this._notify(!1);
            let a = this._target[this._prop],
              n = i - this._start,
              r = this._duration - n;
            (this._start = i),
              (this._duration = Math.floor(Math.max(r, t.duration))),
              (this._total += n),
              (this._loop = !!t.loop),
              (this._to = (0, s.a)([t.to, e, a, t.from])),
              (this._from = (0, s.a)([t.from, a, e]));
          }
        }
        cancel() {
          this._active &&
            (this.tick(Date.now()), (this._active = !1), this._notify(!1));
        }
        tick(t) {
          let e,
            i = t - this._start,
            s = this._duration,
            a = this._prop,
            n = this._from,
            r = this._loop,
            o = this._to;
          if (((this._active = n !== o && (r || i < s)), !this._active)) {
            (this._target[a] = o), this._notify(!0);
            return;
          }
          if (i < 0) {
            this._target[a] = n;
            return;
          }
          (e = (i / s) % 2),
            (e = r && e > 1 ? 2 - e : e),
            (e = this._easing(Math.min(1, Math.max(0, e)))),
            (this._target[a] = this._fn(n, o, e));
        }
        wait() {
          let t = this._promises || (this._promises = []);
          return new Promise((e, i) => {
            t.push({ res: e, rej: i });
          });
        }
        _notify(t) {
          let e = t ? "res" : "rej",
            i = this._promises || [];
          for (let t = 0; t < i.length; t++) i[t][e]();
        }
      };
      let Animations = class Animations {
        constructor(t, e) {
          (this._chart = t), (this._properties = new Map()), this.configure(e);
        }
        configure(t) {
          if (!(0, s.i)(t)) return;
          let e = Object.keys(s.d.animation),
            i = this._properties;
          Object.getOwnPropertyNames(t).forEach((a) => {
            let n = t[a];
            if (!(0, s.i)(n)) return;
            let r = {};
            for (let t of e) r[t] = n[t];
            (((0, s.b)(n.properties) && n.properties) || [a]).forEach((t) => {
              (t !== a && i.has(t)) || i.set(t, r);
            });
          });
        }
        _animateOptions(t, e) {
          let i = e.options,
            s = resolveTargetOptions(t, i);
          if (!s) return [];
          let a = this._createAnimations(s, i);
          return (
            i.$shared &&
              awaitAll(t.options.$animations, i).then(
                () => {
                  t.options = i;
                },
                () => {}
              ),
            a
          );
        }
        _createAnimations(t, e) {
          let i,
            s = this._properties,
            a = [],
            n = t.$animations || (t.$animations = {}),
            r = Object.keys(e),
            o = Date.now();
          for (i = r.length - 1; i >= 0; --i) {
            let l = r[i];
            if ("$" === l.charAt(0)) continue;
            if ("options" === l) {
              a.push(...this._animateOptions(t, e));
              continue;
            }
            let h = e[l],
              c = n[l],
              d = s.get(l);
            if (c)
              if (d && c.active()) {
                c.update(d, h, o);
                continue;
              } else c.cancel();
            if (!d || !d.duration) {
              t[l] = h;
              continue;
            }
            (n[l] = c = new Animation(d, t, l, h)), a.push(c);
          }
          return a;
        }
        update(t, e) {
          if (0 === this._properties.size) return void Object.assign(t, e);
          let i = this._createAnimations(t, e);
          if (i.length) return a.add(this._chart, i), !0;
        }
      };
      function awaitAll(t, e) {
        let i = [],
          s = Object.keys(e);
        for (let e = 0; e < s.length; e++) {
          let a = t[s[e]];
          a && a.active() && i.push(a.wait());
        }
        return Promise.all(i);
      }
      function resolveTargetOptions(t, e) {
        if (!e) return;
        let i = t.options;
        if (!i) {
          t.options = e;
          return;
        }
        return (
          i.$shared &&
            (t.options = i =
              Object.assign({}, i, { $shared: !1, $animations: {} })),
          i
        );
      }
      function scaleClip(t, e) {
        let i = (t && t.options) || {},
          s = i.reverse,
          a = void 0 === i.min ? e : 0,
          n = void 0 === i.max ? e : 0;
        return { start: s ? n : a, end: s ? a : n };
      }
      function defaultClip(t, e, i) {
        if (!1 === i) return !1;
        let s = scaleClip(t, i),
          a = scaleClip(e, i);
        return { top: a.end, right: s.end, bottom: a.start, left: s.start };
      }
      function toClip(t) {
        let e, i, a, n;
        return (
          (0, s.i)(t)
            ? ((e = t.top), (i = t.right), (a = t.bottom), (n = t.left))
            : (e = i = a = n = t),
          { top: e, right: i, bottom: a, left: n, disabled: !1 === t }
        );
      }
      function getSortedDatasetIndices(t, e) {
        let i,
          s,
          a = [],
          n = t._getSortedDatasetMetas(e);
        for (i = 0, s = n.length; i < s; ++i) a.push(n[i].index);
        return a;
      }
      function applyStack(t, e, i, a = {}) {
        let n,
          r,
          o,
          l,
          h = t.keys,
          c = "single" === a.mode;
        if (null === e) return;
        let d = !1;
        for (n = 0, r = h.length; n < r; ++n) {
          if ((o = +h[n]) === i) {
            if (((d = !0), a.all)) continue;
            break;
          }
          (l = t.values[o]),
            (0, s.g)(l) &&
              (c || 0 === e || (0, s.s)(e) === (0, s.s)(l)) &&
              (e += l);
        }
        return d || a.all ? e : 0;
      }
      function convertObjectDataToArray(t, e) {
        let i,
          s,
          a,
          { iScale: n, vScale: r } = e,
          o = "x" === n.axis ? "x" : "y",
          l = "x" === r.axis ? "x" : "y",
          h = Object.keys(t),
          c = Array(h.length);
        for (i = 0, s = h.length; i < s; ++i)
          (a = h[i]), (c[i] = { [o]: a, [l]: t[a] });
        return c;
      }
      function isStacked(t, e) {
        let i = t && t.options.stacked;
        return i || (void 0 === i && void 0 !== e.stack);
      }
      function getStackKey(t, e, i) {
        return `${t.id}.${e.id}.${i.stack || i.type}`;
      }
      function getUserBounds(t) {
        let {
          min: e,
          max: i,
          minDefined: s,
          maxDefined: a,
        } = t.getUserBounds();
        return {
          min: s ? e : Number.NEGATIVE_INFINITY,
          max: a ? i : Number.POSITIVE_INFINITY,
        };
      }
      function getOrCreateStack(t, e, i) {
        let s = t[e] || (t[e] = {});
        return s[i] || (s[i] = {});
      }
      function getLastIndexInStack(t, e, i, s) {
        for (let a of e.getMatchingVisibleMetas(s).reverse()) {
          let e = t[a.index];
          if ((i && e > 0) || (!i && e < 0)) return a.index;
        }
        return null;
      }
      function updateStacks(t, e) {
        let i,
          { chart: s, _cachedMeta: a } = t,
          n = s._stacks || (s._stacks = {}),
          { iScale: r, vScale: o, index: l } = a,
          h = r.axis,
          c = o.axis,
          d = getStackKey(r, o, a),
          u = e.length;
        for (let t = 0; t < u; ++t) {
          let s = e[t],
            { [h]: r, [c]: u } = s;
          ((i = (s._stacks || (s._stacks = {}))[c] = getOrCreateStack(n, d, r))[
            l
          ] = u),
            (i._top = getLastIndexInStack(i, o, !0, a.type)),
            (i._bottom = getLastIndexInStack(i, o, !1, a.type)),
            ((i._visualValues || (i._visualValues = {}))[l] = u);
        }
      }
      function getFirstScaleId(t, e) {
        let i = t.scales;
        return Object.keys(i)
          .filter((t) => i[t].axis === e)
          .shift();
      }
      function createDatasetContext(t, e) {
        return (0, s.j)(t, {
          active: !1,
          dataset: void 0,
          datasetIndex: e,
          index: e,
          mode: "default",
          type: "dataset",
        });
      }
      function createDataContext(t, e, i) {
        return (0, s.j)(t, {
          active: !1,
          dataIndex: e,
          parsed: void 0,
          raw: void 0,
          element: i,
          index: e,
          mode: "default",
          type: "data",
        });
      }
      function clearStacks(t, e) {
        let i = t.controller.index,
          s = t.vScale && t.vScale.axis;
        if (s)
          for (let a of (e = e || t._parsed)) {
            let t = a._stacks;
            if (!t || void 0 === t[s] || void 0 === t[s][i]) return;
            delete t[s][i],
              void 0 !== t[s]._visualValues &&
                void 0 !== t[s]._visualValues[i] &&
                delete t[s]._visualValues[i];
          }
      }
      let isDirectUpdateMode = (t) => "reset" === t || "none" === t,
        cloneIfNotShared = (t, e) => (e ? t : Object.assign({}, t)),
        createStack = (t, e, i) =>
          t &&
          !e.hidden &&
          e._stacked && { keys: getSortedDatasetIndices(i, !0), values: null };
      let DatasetController = class DatasetController {
        static defaults = {};
        static datasetElementType = null;
        static dataElementType = null;
        constructor(t, e) {
          (this.chart = t),
            (this._ctx = t.ctx),
            (this.index = e),
            (this._cachedDataOpts = {}),
            (this._cachedMeta = this.getMeta()),
            (this._type = this._cachedMeta.type),
            (this.options = void 0),
            (this._parsing = !1),
            (this._data = void 0),
            (this._objectData = void 0),
            (this._sharedOptions = void 0),
            (this._drawStart = void 0),
            (this._drawCount = void 0),
            (this.enableOptionSharing = !1),
            (this.supportsDecimation = !1),
            (this.$context = void 0),
            (this._syncList = []),
            (this.datasetElementType = new.target.datasetElementType),
            (this.dataElementType = new.target.dataElementType),
            this.initialize();
        }
        initialize() {
          let t = this._cachedMeta;
          this.configure(),
            this.linkScales(),
            (t._stacked = isStacked(t.vScale, t)),
            this.addElements(),
            this.options.fill &&
              !this.chart.isPluginEnabled("filler") &&
              console.warn(
                "Tried to use the 'fill' option without the 'Filler' plugin enabled. Please import and register the 'Filler' plugin and make sure it is not disabled in the options"
              );
        }
        updateIndex(t) {
          this.index !== t && clearStacks(this._cachedMeta), (this.index = t);
        }
        linkScales() {
          let t = this.chart,
            e = this._cachedMeta,
            i = this.getDataset(),
            chooseId = (t, e, i, s) => ("x" === t ? e : "r" === t ? s : i),
            a = (e.xAxisID = (0, s.v)(i.xAxisID, getFirstScaleId(t, "x"))),
            n = (e.yAxisID = (0, s.v)(i.yAxisID, getFirstScaleId(t, "y"))),
            r = (e.rAxisID = (0, s.v)(i.rAxisID, getFirstScaleId(t, "r"))),
            o = e.indexAxis,
            l = (e.iAxisID = chooseId(o, a, n, r)),
            h = (e.vAxisID = chooseId(o, n, a, r));
          (e.xScale = this.getScaleForId(a)),
            (e.yScale = this.getScaleForId(n)),
            (e.rScale = this.getScaleForId(r)),
            (e.iScale = this.getScaleForId(l)),
            (e.vScale = this.getScaleForId(h));
        }
        getDataset() {
          return this.chart.data.datasets[this.index];
        }
        getMeta() {
          return this.chart.getDatasetMeta(this.index);
        }
        getScaleForId(t) {
          return this.chart.scales[t];
        }
        _getOtherScale(t) {
          let e = this._cachedMeta;
          return t === e.iScale ? e.vScale : e.iScale;
        }
        reset() {
          this._update("reset");
        }
        _destroy() {
          let t = this._cachedMeta;
          this._data && (0, s.u)(this._data, this),
            t._stacked && clearStacks(t);
        }
        _dataCheck() {
          let t = this.getDataset(),
            e = t.data || (t.data = []),
            i = this._data;
          if ((0, s.i)(e)) {
            let t = this._cachedMeta;
            this._data = convertObjectDataToArray(e, t);
          } else if (i !== e) {
            if (i) {
              (0, s.u)(i, this);
              let t = this._cachedMeta;
              clearStacks(t), (t._parsed = []);
            }
            e && Object.isExtensible(e) && (0, s.l)(e, this),
              (this._syncList = []),
              (this._data = e);
          }
        }
        addElements() {
          let t = this._cachedMeta;
          this._dataCheck(),
            this.datasetElementType &&
              (t.dataset = new this.datasetElementType());
        }
        buildOrUpdateElements(t) {
          let e = this._cachedMeta,
            i = this.getDataset(),
            s = !1;
          this._dataCheck();
          let a = e._stacked;
          (e._stacked = isStacked(e.vScale, e)),
            e.stack !== i.stack &&
              ((s = !0), clearStacks(e), (e.stack = i.stack)),
            this._resyncElements(t),
            (s || a !== e._stacked) &&
              (updateStacks(this, e._parsed),
              (e._stacked = isStacked(e.vScale, e)));
        }
        configure() {
          let t = this.chart.config,
            e = t.datasetScopeKeys(this._type),
            i = t.getOptionScopes(this.getDataset(), e, !0);
          (this.options = t.createResolver(i, this.getContext())),
            (this._parsing = this.options.parsing),
            (this._cachedDataOpts = {});
        }
        parse(t, e) {
          let i,
            a,
            n,
            { _cachedMeta: r, _data: o } = this,
            { iScale: l, _stacked: h } = r,
            c = l.axis,
            d = (0 === t && e === o.length) || r._sorted,
            u = t > 0 && r._parsed[t - 1];
          if (!1 === this._parsing) (r._parsed = o), (r._sorted = !0), (n = o);
          else {
            n = (0, s.b)(o[t])
              ? this.parseArrayData(r, o, t, e)
              : (0, s.i)(o[t])
              ? this.parseObjectData(r, o, t, e)
              : this.parsePrimitiveData(r, o, t, e);
            let isNotInOrderComparedToPrev = () =>
              null === a[c] || (u && a[c] < u[c]);
            for (i = 0; i < e; ++i)
              (r._parsed[i + t] = a = n[i]),
                d && (isNotInOrderComparedToPrev() && (d = !1), (u = a));
            r._sorted = d;
          }
          h && updateStacks(this, n);
        }
        parsePrimitiveData(t, e, i, s) {
          let a,
            n,
            { iScale: r, vScale: o } = t,
            l = r.axis,
            h = o.axis,
            c = r.getLabels(),
            d = r === o,
            u = Array(s);
          for (a = 0; a < s; ++a)
            (n = a + i),
              (u[a] = { [l]: d || r.parse(c[n], n), [h]: o.parse(e[n], n) });
          return u;
        }
        parseArrayData(t, e, i, s) {
          let a,
            n,
            r,
            { xScale: o, yScale: l } = t,
            h = Array(s);
          for (a = 0; a < s; ++a)
            (r = e[(n = a + i)]),
              (h[a] = { x: o.parse(r[0], n), y: l.parse(r[1], n) });
          return h;
        }
        parseObjectData(t, e, i, a) {
          let n,
            r,
            o,
            { xScale: l, yScale: h } = t,
            { xAxisKey: c = "x", yAxisKey: d = "y" } = this._parsing,
            u = Array(a);
          for (n = 0; n < a; ++n)
            (o = e[(r = n + i)]),
              (u[n] = {
                x: l.parse((0, s.f)(o, c), r),
                y: h.parse((0, s.f)(o, d), r),
              });
          return u;
        }
        getParsed(t) {
          return this._cachedMeta._parsed[t];
        }
        getDataElement(t) {
          return this._cachedMeta.data[t];
        }
        applyStack(t, e, i) {
          let s = this.chart,
            a = this._cachedMeta,
            n = e[t.axis];
          return applyStack(
            {
              keys: getSortedDatasetIndices(s, !0),
              values: e._stacks[t.axis]._visualValues,
            },
            n,
            a.index,
            { mode: i }
          );
        }
        updateRangeFromParsed(t, e, i, s) {
          let a = i[e.axis],
            n = null === a ? NaN : a,
            r = s && i._stacks[e.axis];
          s &&
            r &&
            ((s.values = r), (n = applyStack(s, a, this._cachedMeta.index))),
            (t.min = Math.min(t.min, n)),
            (t.max = Math.max(t.max, n));
        }
        getMinMax(t, e) {
          let i,
            a,
            n = this._cachedMeta,
            r = n._parsed,
            o = n._sorted && t === n.iScale,
            l = r.length,
            h = this._getOtherScale(t),
            c = createStack(e, n, this.chart),
            d = {
              min: Number.POSITIVE_INFINITY,
              max: Number.NEGATIVE_INFINITY,
            },
            { min: u, max: g } = getUserBounds(h);
          function _skip() {
            let e = (a = r[i])[h.axis];
            return !(0, s.g)(a[t.axis]) || u > e || g < e;
          }
          for (
            i = 0;
            i < l && (_skip() || (this.updateRangeFromParsed(d, t, a, c), !o));
            ++i
          );
          if (o) {
            for (i = l - 1; i >= 0; --i)
              if (!_skip()) {
                this.updateRangeFromParsed(d, t, a, c);
                break;
              }
          }
          return d;
        }
        getAllParsedValues(t) {
          let e,
            i,
            a,
            n = this._cachedMeta._parsed,
            r = [];
          for (e = 0, i = n.length; e < i; ++e)
            (a = n[e][t.axis]), (0, s.g)(a) && r.push(a);
          return r;
        }
        getMaxOverflow() {
          return !1;
        }
        getLabelAndValue(t) {
          let e = this._cachedMeta,
            i = e.iScale,
            s = e.vScale,
            a = this.getParsed(t);
          return {
            label: i ? "" + i.getLabelForValue(a[i.axis]) : "",
            value: s ? "" + s.getLabelForValue(a[s.axis]) : "",
          };
        }
        _update(t) {
          let e = this._cachedMeta;
          this.update(t || "default"),
            (e._clip = toClip(
              (0, s.v)(
                this.options.clip,
                defaultClip(e.xScale, e.yScale, this.getMaxOverflow())
              )
            ));
        }
        update(t) {}
        draw() {
          let t,
            e = this._ctx,
            i = this.chart,
            s = this._cachedMeta,
            a = s.data || [],
            n = i.chartArea,
            r = [],
            o = this._drawStart || 0,
            l = this._drawCount || a.length - o,
            h = this.options.drawActiveElementsOnTop;
          for (s.dataset && s.dataset.draw(e, n, o, l), t = o; t < o + l; ++t) {
            let i = a[t];
            i.hidden || (i.active && h ? r.push(i) : i.draw(e, n));
          }
          for (t = 0; t < r.length; ++t) r[t].draw(e, n);
        }
        getStyle(t, e) {
          let i = e ? "active" : "default";
          return void 0 === t && this._cachedMeta.dataset
            ? this.resolveDatasetElementOptions(i)
            : this.resolveDataElementOptions(t || 0, i);
        }
        getContext(t, e, i) {
          let s,
            a = this.getDataset();
          if (t >= 0 && t < this._cachedMeta.data.length) {
            let e = this._cachedMeta.data[t];
            ((s =
              e.$context ||
              (e.$context = createDataContext(
                this.getContext(),
                t,
                e
              ))).parsed = this.getParsed(t)),
              (s.raw = a.data[t]),
              (s.index = s.dataIndex = t);
          } else
            ((s =
              this.$context ||
              (this.$context = createDatasetContext(
                this.chart.getContext(),
                this.index
              ))).dataset = a),
              (s.index = s.datasetIndex = this.index);
          return (s.active = !!e), (s.mode = i), s;
        }
        resolveDatasetElementOptions(t) {
          return this._resolveElementOptions(this.datasetElementType.id, t);
        }
        resolveDataElementOptions(t, e) {
          return this._resolveElementOptions(this.dataElementType.id, e, t);
        }
        _resolveElementOptions(t, e = "default", i) {
          let a = "active" === e,
            n = this._cachedDataOpts,
            r = t + "-" + e,
            o = n[r],
            l = this.enableOptionSharing && (0, s.h)(i);
          if (o) return cloneIfNotShared(o, l);
          let h = this.chart.config,
            c = h.datasetElementScopeKeys(this._type, t),
            d = a ? [`${t}Hover`, "hover", t, ""] : [t, ""],
            u = h.getOptionScopes(this.getDataset(), c),
            g = Object.keys(s.d.elements[t]),
            p = h.resolveNamedOptions(u, g, () => this.getContext(i, a, e), d);
          return (
            p.$shared &&
              ((p.$shared = l), (n[r] = Object.freeze(cloneIfNotShared(p, l)))),
            p
          );
        }
        _resolveAnimations(t, e, i) {
          let s,
            a = this.chart,
            n = this._cachedDataOpts,
            r = `animation-${e}`,
            o = n[r];
          if (o) return o;
          if (!1 !== a.options.animation) {
            let a = this.chart.config,
              n = a.datasetAnimationScopeKeys(this._type, e),
              r = a.getOptionScopes(this.getDataset(), n);
            s = a.createResolver(r, this.getContext(t, i, e));
          }
          let l = new Animations(a, s && s.animations);
          return s && s._cacheable && (n[r] = Object.freeze(l)), l;
        }
        getSharedOptions(t) {
          if (t.$shared)
            return (
              this._sharedOptions ||
              (this._sharedOptions = Object.assign({}, t))
            );
        }
        includeOptions(t, e) {
          return !e || isDirectUpdateMode(t) || this.chart._animationsDisabled;
        }
        _getSharedOptions(t, e) {
          let i = this.resolveDataElementOptions(t, e),
            s = this._sharedOptions,
            a = this.getSharedOptions(i),
            n = this.includeOptions(e, a) || a !== s;
          return (
            this.updateSharedOptions(a, e, i),
            { sharedOptions: a, includeOptions: n }
          );
        }
        updateElement(t, e, i, s) {
          isDirectUpdateMode(s)
            ? Object.assign(t, i)
            : this._resolveAnimations(e, s).update(t, i);
        }
        updateSharedOptions(t, e, i) {
          t &&
            !isDirectUpdateMode(e) &&
            this._resolveAnimations(void 0, e).update(t, i);
        }
        _setStyle(t, e, i, s) {
          t.active = s;
          let a = this.getStyle(e, s);
          this._resolveAnimations(e, i, s).update(t, {
            options: (!s && this.getSharedOptions(a)) || a,
          });
        }
        removeHoverStyle(t, e, i) {
          this._setStyle(t, i, "active", !1);
        }
        setHoverStyle(t, e, i) {
          this._setStyle(t, i, "active", !0);
        }
        _removeDatasetHoverStyle() {
          let t = this._cachedMeta.dataset;
          t && this._setStyle(t, void 0, "active", !1);
        }
        _setDatasetHoverStyle() {
          let t = this._cachedMeta.dataset;
          t && this._setStyle(t, void 0, "active", !0);
        }
        _resyncElements(t) {
          let e = this._data,
            i = this._cachedMeta.data;
          for (let [t, e, i] of this._syncList) this[t](e, i);
          this._syncList = [];
          let s = i.length,
            a = e.length,
            n = Math.min(a, s);
          n && this.parse(0, n),
            a > s
              ? this._insertElements(s, a - s, t)
              : a < s && this._removeElements(a, s - a);
        }
        _insertElements(t, e, i = !0) {
          let s,
            a = this._cachedMeta,
            n = a.data,
            r = t + e,
            move = (t) => {
              for (t.length += e, s = t.length - 1; s >= r; s--)
                t[s] = t[s - e];
            };
          for (move(n), s = t; s < r; ++s) n[s] = new this.dataElementType();
          this._parsing && move(a._parsed),
            this.parse(t, e),
            i && this.updateElements(n, t, e, "reset");
        }
        updateElements(t, e, i, s) {}
        _removeElements(t, e) {
          let i = this._cachedMeta;
          if (this._parsing) {
            let s = i._parsed.splice(t, e);
            i._stacked && clearStacks(i, s);
          }
          i.data.splice(t, e);
        }
        _sync(t) {
          if (this._parsing) this._syncList.push(t);
          else {
            let [e, i, s] = t;
            this[e](i, s);
          }
          this.chart._dataChanges.push([this.index, ...t]);
        }
        _onDataPush() {
          let t = arguments.length;
          this._sync(["_insertElements", this.getDataset().data.length - t, t]);
        }
        _onDataPop() {
          this._sync(["_removeElements", this._cachedMeta.data.length - 1, 1]);
        }
        _onDataShift() {
          this._sync(["_removeElements", 0, 1]);
        }
        _onDataSplice(t, e) {
          e && this._sync(["_removeElements", t, e]);
          let i = arguments.length - 2;
          i && this._sync(["_insertElements", t, i]);
        }
        _onDataUnshift() {
          this._sync(["_insertElements", 0, arguments.length]);
        }
      };
      function getAllScaleValues(t, e) {
        if (!t._cache.$bar) {
          let i = t.getMatchingVisibleMetas(e),
            a = [];
          for (let e = 0, s = i.length; e < s; e++)
            a = a.concat(i[e].controller.getAllParsedValues(t));
          t._cache.$bar = (0, s._)(a.sort((t, e) => t - e));
        }
        return t._cache.$bar;
      }
      function computeMinSampleSize(t) {
        let e,
          i,
          a,
          n,
          r = t.iScale,
          o = getAllScaleValues(r, t.type),
          l = r._length,
          updateMinAndPrev = () => {
            32767 !== a &&
              -32768 !== a &&
              ((0, s.h)(n) && (l = Math.min(l, Math.abs(a - n) || l)), (n = a));
          };
        for (e = 0, i = o.length; e < i; ++e)
          (a = r.getPixelForValue(o[e])), updateMinAndPrev();
        for (e = 0, n = void 0, i = r.ticks.length; e < i; ++e)
          (a = r.getPixelForTick(e)), updateMinAndPrev();
        return l;
      }
      function computeFitCategoryTraits(t, e, i, a) {
        let n,
          r,
          o = i.barThickness;
        return (
          (0, s.k)(o)
            ? ((n = e.min * i.categoryPercentage), (r = i.barPercentage))
            : ((n = o * a), (r = 1)),
          { chunk: n / a, ratio: r, start: e.pixels[t] - n / 2 }
        );
      }
      function computeFlexCategoryTraits(t, e, i, s) {
        let a = e.pixels,
          n = a[t],
          r = t > 0 ? a[t - 1] : null,
          o = t < a.length - 1 ? a[t + 1] : null,
          l = i.categoryPercentage;
        null === r && (r = n - (null === o ? e.end - e.start : o - n)),
          null === o && (o = n + n - r);
        let h = n - ((n - Math.min(r, o)) / 2) * l;
        return {
          chunk: ((Math.abs(o - r) / 2) * l) / s,
          ratio: i.barPercentage,
          start: h,
        };
      }
      function parseFloatBar(t, e, i, s) {
        let a = i.parse(t[0], s),
          n = i.parse(t[1], s),
          r = Math.min(a, n),
          o = Math.max(a, n),
          l = r,
          h = o;
        Math.abs(r) > Math.abs(o) && ((l = o), (h = r)),
          (e[i.axis] = h),
          (e._custom = {
            barStart: l,
            barEnd: h,
            start: a,
            end: n,
            min: r,
            max: o,
          });
      }
      function parseValue(t, e, i, a) {
        return (
          (0, s.b)(t) ? parseFloatBar(t, e, i, a) : (e[i.axis] = i.parse(t, a)),
          e
        );
      }
      function parseArrayOrPrimitive(t, e, i, s) {
        let a,
          n,
          r,
          o,
          l = t.iScale,
          h = t.vScale,
          c = l.getLabels(),
          d = l === h,
          u = [];
        for (a = i, n = i + s; a < n; ++a)
          (o = e[a]),
            ((r = {})[l.axis] = d || l.parse(c[a], a)),
            u.push(parseValue(o, r, h, a));
        return u;
      }
      function isFloatBar(t) {
        return t && void 0 !== t.barStart && void 0 !== t.barEnd;
      }
      function barSign(t, e, i) {
        return 0 !== t
          ? (0, s.s)(t)
          : (e.isHorizontal() ? 1 : -1) * (e.min >= i ? 1 : -1);
      }
      function borderProps(t) {
        let e, i, s, a, n;
        return (
          t.horizontal
            ? ((e = t.base > t.x), (i = "left"), (s = "right"))
            : ((e = t.base < t.y), (i = "bottom"), (s = "top")),
          e ? ((a = "end"), (n = "start")) : ((a = "start"), (n = "end")),
          { start: i, end: s, reverse: e, top: a, bottom: n }
        );
      }
      function setBorderSkipped(t, e, i, s) {
        let a = e.borderSkipped,
          n = {};
        if (!a) {
          t.borderSkipped = n;
          return;
        }
        if (!0 === a) {
          t.borderSkipped = { top: !0, right: !0, bottom: !0, left: !0 };
          return;
        }
        let {
          start: r,
          end: o,
          reverse: l,
          top: h,
          bottom: c,
        } = borderProps(t);
        "middle" === a &&
          i &&
          ((t.enableBorderRadius = !0),
          (i._top || 0) === s
            ? (a = h)
            : (i._bottom || 0) === s
            ? (a = c)
            : ((n[parseEdge(c, r, o, l)] = !0), (a = h))),
          (n[parseEdge(a, r, o, l)] = !0),
          (t.borderSkipped = n);
      }
      function parseEdge(t, e, i, s) {
        return (t = s
          ? startEnd((t = swap(t, e, i)), i, e)
          : startEnd(t, e, i));
      }
      function swap(t, e, i) {
        return t === e ? i : t === i ? e : t;
      }
      function startEnd(t, e, i) {
        return "start" === t ? e : "end" === t ? i : t;
      }
      function setInflateAmount(t, { inflateAmount: e }, i) {
        t.inflateAmount = "auto" === e ? 0.33 * (1 === i) : e;
      }
      let BarController = class BarController extends DatasetController {
        static id = "bar";
        static defaults = {
          datasetElementType: !1,
          dataElementType: "bar",
          categoryPercentage: 0.8,
          barPercentage: 0.9,
          grouped: !0,
          animations: {
            numbers: {
              type: "number",
              properties: ["x", "y", "base", "width", "height"],
            },
          },
        };
        static overrides = {
          scales: {
            _index_: { type: "category", offset: !0, grid: { offset: !0 } },
            _value_: { type: "linear", beginAtZero: !0 },
          },
        };
        parsePrimitiveData(t, e, i, s) {
          return parseArrayOrPrimitive(t, e, i, s);
        }
        parseArrayData(t, e, i, s) {
          return parseArrayOrPrimitive(t, e, i, s);
        }
        parseObjectData(t, e, i, a) {
          let n,
            r,
            o,
            l,
            { iScale: h, vScale: c } = t,
            { xAxisKey: d = "x", yAxisKey: u = "y" } = this._parsing,
            g = "x" === h.axis ? d : u,
            p = "x" === c.axis ? d : u,
            m = [];
          for (n = i, r = i + a; n < r; ++n)
            (l = e[n]),
              ((o = {})[h.axis] = h.parse((0, s.f)(l, g), n)),
              m.push(parseValue((0, s.f)(l, p), o, c, n));
          return m;
        }
        updateRangeFromParsed(t, e, i, s) {
          super.updateRangeFromParsed(t, e, i, s);
          let a = i._custom;
          a &&
            e === this._cachedMeta.vScale &&
            ((t.min = Math.min(t.min, a.min)),
            (t.max = Math.max(t.max, a.max)));
        }
        getMaxOverflow() {
          return 0;
        }
        getLabelAndValue(t) {
          let { iScale: e, vScale: i } = this._cachedMeta,
            s = this.getParsed(t),
            a = s._custom,
            n = isFloatBar(a)
              ? "[" + a.start + ", " + a.end + "]"
              : "" + i.getLabelForValue(s[i.axis]);
          return { label: "" + e.getLabelForValue(s[e.axis]), value: n };
        }
        initialize() {
          (this.enableOptionSharing = !0),
            super.initialize(),
            (this._cachedMeta.stack = this.getDataset().stack);
        }
        update(t) {
          let e = this._cachedMeta;
          this.updateElements(e.data, 0, e.data.length, t);
        }
        updateElements(t, e, i, a) {
          let n = "reset" === a,
            {
              index: r,
              _cachedMeta: { vScale: o },
            } = this,
            l = o.getBasePixel(),
            h = o.isHorizontal(),
            c = this._getRuler(),
            { sharedOptions: d, includeOptions: u } = this._getSharedOptions(
              e,
              a
            );
          for (let g = e; g < e + i; g++) {
            let e = this.getParsed(g),
              i =
                n || (0, s.k)(e[o.axis])
                  ? { base: l, head: l }
                  : this._calculateBarValuePixels(g),
              p = this._calculateBarIndexPixels(g, c),
              m = (e._stacks || {})[o.axis],
              b = {
                horizontal: h,
                base: i.base,
                enableBorderRadius:
                  !m ||
                  isFloatBar(e._custom) ||
                  r === m._top ||
                  r === m._bottom,
                x: h ? i.head : p.center,
                y: h ? p.center : i.head,
                height: h ? p.size : Math.abs(i.size),
                width: h ? Math.abs(i.size) : p.size,
              };
            u &&
              (b.options =
                d ||
                this.resolveDataElementOptions(g, t[g].active ? "active" : a));
            let x = b.options || t[g].options;
            setBorderSkipped(b, x, m, r),
              setInflateAmount(b, x, c.ratio),
              this.updateElement(t[g], g, b, a);
          }
        }
        _getStacks(t, e) {
          let { iScale: i } = this._cachedMeta,
            a = i
              .getMatchingVisibleMetas(this._type)
              .filter((t) => t.controller.options.grouped),
            n = i.options.stacked,
            r = [],
            o = this._cachedMeta.controller.getParsed(e),
            l = o && o[i.axis],
            skipNull = (t) => {
              let e = t._parsed.find((t) => t[i.axis] === l),
                a = e && e[t.vScale.axis];
              if ((0, s.k)(a) || isNaN(a)) return !0;
            };
          for (let i of a)
            if (
              !(void 0 !== e && skipNull(i)) &&
              ((!1 === n ||
                -1 === r.indexOf(i.stack) ||
                (void 0 === n && void 0 === i.stack)) &&
                r.push(i.stack),
              i.index === t)
            )
              break;
          return r.length || r.push(void 0), r;
        }
        _getStackCount(t) {
          return this._getStacks(void 0, t).length;
        }
        _getStackIndex(t, e, i) {
          let s = this._getStacks(t, i),
            a = void 0 !== e ? s.indexOf(e) : -1;
          return -1 === a ? s.length - 1 : a;
        }
        _getRuler() {
          let t,
            e,
            i = this.options,
            s = this._cachedMeta,
            a = s.iScale,
            n = [];
          for (t = 0, e = s.data.length; t < e; ++t)
            n.push(a.getPixelForValue(this.getParsed(t)[a.axis], t));
          let r = i.barThickness;
          return {
            min: r || computeMinSampleSize(s),
            pixels: n,
            start: a._startPixel,
            end: a._endPixel,
            stackCount: this._getStackCount(),
            scale: a,
            grouped: i.grouped,
            ratio: r ? 1 : i.categoryPercentage * i.barPercentage,
          };
        }
        _calculateBarValuePixels(t) {
          let e,
            i,
            {
              _cachedMeta: { vScale: a, _stacked: n, index: r },
              options: { base: o, minBarLength: l },
            } = this,
            h = o || 0,
            c = this.getParsed(t),
            d = c._custom,
            u = isFloatBar(d),
            g = c[a.axis],
            p = 0,
            m = n ? this.applyStack(a, c, n) : g;
          m !== g && ((p = m - g), (m = g)),
            u &&
              ((g = d.barStart),
              (m = d.barEnd - d.barStart),
              0 !== g && (0, s.s)(g) !== (0, s.s)(d.barEnd) && (p = 0),
              (p += g));
          let b = (0, s.k)(o) || u ? p : o,
            x = a.getPixelForValue(b);
          if (
            Math.abs(
              (i =
                (e = this.chart.getDataVisibility(t)
                  ? a.getPixelForValue(p + m)
                  : x) - x)
            ) < l
          ) {
            (i = barSign(i, a, h) * l), g === h && (x -= i / 2);
            let t = a.getPixelForDecimal(0),
              s = a.getPixelForDecimal(1),
              o = Math.min(t, s);
            (e = (x = Math.max(Math.min(x, Math.max(t, s)), o)) + i),
              n &&
                !u &&
                (c._stacks[a.axis]._visualValues[r] =
                  a.getValueForPixel(e) - a.getValueForPixel(x));
          }
          if (x === a.getPixelForValue(h)) {
            let t = ((0, s.s)(i) * a.getLineWidthForValue(h)) / 2;
            (x += t), (i -= t);
          }
          return { size: i, base: x, head: e, center: e + i / 2 };
        }
        _calculateBarIndexPixels(t, e) {
          let i,
            a,
            n = e.scale,
            r = this.options,
            o = r.skipNull,
            l = (0, s.v)(r.maxBarThickness, 1 / 0);
          if (e.grouped) {
            let s = o ? this._getStackCount(t) : e.stackCount,
              n =
                "flex" === r.barThickness
                  ? computeFlexCategoryTraits(t, e, r, s)
                  : computeFitCategoryTraits(t, e, r, s),
              h = this._getStackIndex(
                this.index,
                this._cachedMeta.stack,
                o ? t : void 0
              );
            (i = n.start + n.chunk * h + n.chunk / 2),
              (a = Math.min(l, n.chunk * n.ratio));
          } else
            (i = n.getPixelForValue(this.getParsed(t)[n.axis], t)),
              (a = Math.min(l, e.min * e.ratio));
          return { base: i - a / 2, head: i + a / 2, center: i, size: a };
        }
        draw() {
          let t = this._cachedMeta,
            e = t.vScale,
            i = t.data,
            s = i.length,
            a = 0;
          for (; a < s; ++a)
            null === this.getParsed(a)[e.axis] ||
              i[a].hidden ||
              i[a].draw(this._ctx);
        }
      };
      let BubbleController = class BubbleController extends DatasetController {
        static id = "bubble";
        static defaults = {
          datasetElementType: !1,
          dataElementType: "point",
          animations: {
            numbers: {
              type: "number",
              properties: ["x", "y", "borderWidth", "radius"],
            },
          },
        };
        static overrides = {
          scales: { x: { type: "linear" }, y: { type: "linear" } },
        };
        initialize() {
          (this.enableOptionSharing = !0), super.initialize();
        }
        parsePrimitiveData(t, e, i, s) {
          let a = super.parsePrimitiveData(t, e, i, s);
          for (let t = 0; t < a.length; t++)
            a[t]._custom = this.resolveDataElementOptions(t + i).radius;
          return a;
        }
        parseArrayData(t, e, i, a) {
          let n = super.parseArrayData(t, e, i, a);
          for (let t = 0; t < n.length; t++) {
            let a = e[i + t];
            n[t]._custom = (0, s.v)(
              a[2],
              this.resolveDataElementOptions(t + i).radius
            );
          }
          return n;
        }
        parseObjectData(t, e, i, a) {
          let n = super.parseObjectData(t, e, i, a);
          for (let t = 0; t < n.length; t++) {
            let a = e[i + t];
            n[t]._custom = (0, s.v)(
              a && a.r && +a.r,
              this.resolveDataElementOptions(t + i).radius
            );
          }
          return n;
        }
        getMaxOverflow() {
          let t = this._cachedMeta.data,
            e = 0;
          for (let i = t.length - 1; i >= 0; --i)
            e = Math.max(e, t[i].size(this.resolveDataElementOptions(i)) / 2);
          return e > 0 && e;
        }
        getLabelAndValue(t) {
          let e = this._cachedMeta,
            i = this.chart.data.labels || [],
            { xScale: s, yScale: a } = e,
            n = this.getParsed(t),
            r = s.getLabelForValue(n.x),
            o = a.getLabelForValue(n.y),
            l = n._custom;
          return {
            label: i[t] || "",
            value: "(" + r + ", " + o + (l ? ", " + l : "") + ")",
          };
        }
        update(t) {
          let e = this._cachedMeta.data;
          this.updateElements(e, 0, e.length, t);
        }
        updateElements(t, e, i, s) {
          let a = "reset" === s,
            { iScale: n, vScale: r } = this._cachedMeta,
            { sharedOptions: o, includeOptions: l } = this._getSharedOptions(
              e,
              s
            ),
            h = n.axis,
            c = r.axis;
          for (let d = e; d < e + i; d++) {
            let e = t[d],
              i = !a && this.getParsed(d),
              u = {},
              g = (u[h] = a
                ? n.getPixelForDecimal(0.5)
                : n.getPixelForValue(i[h])),
              p = (u[c] = a ? r.getBasePixel() : r.getPixelForValue(i[c]));
            (u.skip = isNaN(g) || isNaN(p)),
              l &&
                ((u.options =
                  o ||
                  this.resolveDataElementOptions(d, e.active ? "active" : s)),
                a && (u.options.radius = 0)),
              this.updateElement(e, d, u, s);
          }
        }
        resolveDataElementOptions(t, e) {
          let i = this.getParsed(t),
            a = super.resolveDataElementOptions(t, e);
          a.$shared && (a = Object.assign({}, a, { $shared: !1 }));
          let n = a.radius;
          return (
            "active" !== e && (a.radius = 0),
            (a.radius += (0, s.v)(i && i._custom, n)),
            a
          );
        }
      };
      function getRatioAndOffset(t, e, i) {
        let a = 1,
          n = 1,
          r = 0,
          o = 0;
        if (e < s.T) {
          let l = t + e,
            h = Math.cos(t),
            c = Math.sin(t),
            d = Math.cos(l),
            u = Math.sin(l),
            calcMax = (e, a, n) =>
              (0, s.p)(e, t, l, !0) ? 1 : Math.max(a, a * i, n, n * i),
            calcMin = (e, a, n) =>
              (0, s.p)(e, t, l, !0) ? -1 : Math.min(a, a * i, n, n * i),
            g = calcMax(0, h, d),
            p = calcMax(s.H, c, u),
            m = calcMin(s.P, h, d),
            b = calcMin(s.P + s.H, c, u);
          (a = (g - m) / 2),
            (n = (p - b) / 2),
            (r = -(g + m) / 2),
            (o = -(p + b) / 2);
        }
        return { ratioX: a, ratioY: n, offsetX: r, offsetY: o };
      }
      let DoughnutController = class DoughnutController extends DatasetController {
        static id = "doughnut";
        static defaults = {
          datasetElementType: !1,
          dataElementType: "arc",
          animation: { animateRotate: !0, animateScale: !1 },
          animations: {
            numbers: {
              type: "number",
              properties: [
                "circumference",
                "endAngle",
                "innerRadius",
                "outerRadius",
                "startAngle",
                "x",
                "y",
                "offset",
                "borderWidth",
                "spacing",
              ],
            },
          },
          cutout: "50%",
          rotation: 0,
          circumference: 360,
          radius: "100%",
          spacing: 0,
          indexAxis: "r",
        };
        static descriptors = {
          _scriptable: (t) => "spacing" !== t,
          _indexable: (t) =>
            "spacing" !== t &&
            !t.startsWith("borderDash") &&
            !t.startsWith("hoverBorderDash"),
        };
        static overrides = {
          aspectRatio: 1,
          plugins: {
            legend: {
              labels: {
                generateLabels(t) {
                  let e = t.data;
                  if (e.labels.length && e.datasets.length) {
                    let {
                      labels: { pointStyle: i, color: s },
                    } = t.legend.options;
                    return e.labels.map((e, a) => {
                      let n = t.getDatasetMeta(0).controller.getStyle(a);
                      return {
                        text: e,
                        fillStyle: n.backgroundColor,
                        strokeStyle: n.borderColor,
                        fontColor: s,
                        lineWidth: n.borderWidth,
                        pointStyle: i,
                        hidden: !t.getDataVisibility(a),
                        index: a,
                      };
                    });
                  }
                  return [];
                },
              },
              onClick(t, e, i) {
                i.chart.toggleDataVisibility(e.index), i.chart.update();
              },
            },
          },
        };
        constructor(t, e) {
          super(t, e),
            (this.enableOptionSharing = !0),
            (this.innerRadius = void 0),
            (this.outerRadius = void 0),
            (this.offsetX = void 0),
            (this.offsetY = void 0);
        }
        linkScales() {}
        parse(t, e) {
          let i = this.getDataset().data,
            a = this._cachedMeta;
          if (!1 === this._parsing) a._parsed = i;
          else {
            let n,
              r,
              getter = (t) => +i[t];
            if ((0, s.i)(i[t])) {
              let { key: t = "value" } = this._parsing;
              getter = (e) => +(0, s.f)(i[e], t);
            }
            for (n = t, r = t + e; n < r; ++n) a._parsed[n] = getter(n);
          }
        }
        _getRotation() {
          return (0, s.t)(this.options.rotation - 90);
        }
        _getCircumference() {
          return (0, s.t)(this.options.circumference);
        }
        _getRotationExtents() {
          let t = s.T,
            e = -s.T;
          for (let i = 0; i < this.chart.data.datasets.length; ++i)
            if (
              this.chart.isDatasetVisible(i) &&
              this.chart.getDatasetMeta(i).type === this._type
            ) {
              let s = this.chart.getDatasetMeta(i).controller,
                a = s._getRotation(),
                n = s._getCircumference();
              (t = Math.min(t, a)), (e = Math.max(e, a + n));
            }
          return { rotation: t, circumference: e - t };
        }
        update(t) {
          let { chartArea: e } = this.chart,
            i = this._cachedMeta,
            a = i.data,
            n =
              this.getMaxBorderWidth() +
              this.getMaxOffset(a) +
              this.options.spacing,
            r = Math.max((Math.min(e.width, e.height) - n) / 2, 0),
            o = Math.min((0, s.m)(this.options.cutout, r), 1),
            l = this._getRingWeight(this.index),
            { circumference: h, rotation: c } = this._getRotationExtents(),
            {
              ratioX: d,
              ratioY: u,
              offsetX: g,
              offsetY: p,
            } = getRatioAndOffset(c, h, o),
            m = Math.max(
              Math.min((e.width - n) / d, (e.height - n) / u) / 2,
              0
            ),
            b = (0, s.n)(this.options.radius, m),
            x = Math.max(b * o, 0),
            _ = (b - x) / this._getVisibleDatasetWeightTotal();
          (this.offsetX = g * b),
            (this.offsetY = p * b),
            (i.total = this.calculateTotal()),
            (this.outerRadius = b - _ * this._getRingWeightOffset(this.index)),
            (this.innerRadius = Math.max(this.outerRadius - _ * l, 0)),
            this.updateElements(a, 0, a.length, t);
        }
        _circumference(t, e) {
          let i = this.options,
            a = this._cachedMeta,
            n = this._getCircumference();
          return (e && i.animation.animateRotate) ||
            !this.chart.getDataVisibility(t) ||
            null === a._parsed[t] ||
            a.data[t].hidden
            ? 0
            : this.calculateCircumference((a._parsed[t] * n) / s.T);
        }
        updateElements(t, e, i, s) {
          let a,
            n = "reset" === s,
            r = this.chart,
            o = r.chartArea,
            l = r.options.animation,
            h = (o.left + o.right) / 2,
            c = (o.top + o.bottom) / 2,
            d = n && l.animateScale,
            u = d ? 0 : this.innerRadius,
            g = d ? 0 : this.outerRadius,
            { sharedOptions: p, includeOptions: m } = this._getSharedOptions(
              e,
              s
            ),
            b = this._getRotation();
          for (a = 0; a < e; ++a) b += this._circumference(a, n);
          for (a = e; a < e + i; ++a) {
            let e = this._circumference(a, n),
              i = t[a],
              r = {
                x: h + this.offsetX,
                y: c + this.offsetY,
                startAngle: b,
                endAngle: b + e,
                circumference: e,
                outerRadius: g,
                innerRadius: u,
              };
            m &&
              (r.options =
                p ||
                this.resolveDataElementOptions(a, i.active ? "active" : s)),
              (b += e),
              this.updateElement(i, a, r, s);
          }
        }
        calculateTotal() {
          let t,
            e = this._cachedMeta,
            i = e.data,
            s = 0;
          for (t = 0; t < i.length; t++) {
            let a = e._parsed[t];
            null !== a &&
              !isNaN(a) &&
              this.chart.getDataVisibility(t) &&
              !i[t].hidden &&
              (s += Math.abs(a));
          }
          return s;
        }
        calculateCircumference(t) {
          let e = this._cachedMeta.total;
          return e > 0 && !isNaN(t) ? s.T * (Math.abs(t) / e) : 0;
        }
        getLabelAndValue(t) {
          let e = this._cachedMeta,
            i = this.chart,
            a = i.data.labels || [],
            n = (0, s.o)(e._parsed[t], i.options.locale);
          return { label: a[t] || "", value: n };
        }
        getMaxBorderWidth(t) {
          let e,
            i,
            s,
            a,
            n,
            r = 0,
            o = this.chart;
          if (!t) {
            for (e = 0, i = o.data.datasets.length; e < i; ++e)
              if (o.isDatasetVisible(e)) {
                (t = (s = o.getDatasetMeta(e)).data), (a = s.controller);
                break;
              }
          }
          if (!t) return 0;
          for (e = 0, i = t.length; e < i; ++e)
            "inner" !== (n = a.resolveDataElementOptions(e)).borderAlign &&
              (r = Math.max(r, n.borderWidth || 0, n.hoverBorderWidth || 0));
          return r;
        }
        getMaxOffset(t) {
          let e = 0;
          for (let i = 0, s = t.length; i < s; ++i) {
            let t = this.resolveDataElementOptions(i);
            e = Math.max(e, t.offset || 0, t.hoverOffset || 0);
          }
          return e;
        }
        _getRingWeightOffset(t) {
          let e = 0;
          for (let i = 0; i < t; ++i)
            this.chart.isDatasetVisible(i) && (e += this._getRingWeight(i));
          return e;
        }
        _getRingWeight(t) {
          return Math.max((0, s.v)(this.chart.data.datasets[t].weight, 1), 0);
        }
        _getVisibleDatasetWeightTotal() {
          return (
            this._getRingWeightOffset(this.chart.data.datasets.length) || 1
          );
        }
      };
      let LineController = class LineController extends DatasetController {
        static id = "line";
        static defaults = {
          datasetElementType: "line",
          dataElementType: "point",
          showLine: !0,
          spanGaps: !1,
        };
        static overrides = {
          scales: {
            _index_: { type: "category" },
            _value_: { type: "linear" },
          },
        };
        initialize() {
          (this.enableOptionSharing = !0),
            (this.supportsDecimation = !0),
            super.initialize();
        }
        update(t) {
          let e = this._cachedMeta,
            { dataset: i, data: a = [], _dataset: n } = e,
            r = this.chart._animationsDisabled,
            { start: o, count: l } = (0, s.q)(e, a, r);
          (this._drawStart = o),
            (this._drawCount = l),
            (0, s.w)(e) && ((o = 0), (l = a.length)),
            (i._chart = this.chart),
            (i._datasetIndex = this.index),
            (i._decimated = !!n._decimated),
            (i.points = a);
          let h = this.resolveDatasetElementOptions(t);
          this.options.showLine || (h.borderWidth = 0),
            (h.segment = this.options.segment),
            this.updateElement(i, void 0, { animated: !r, options: h }, t),
            this.updateElements(a, o, l, t);
        }
        updateElements(t, e, i, a) {
          let n = "reset" === a,
            {
              iScale: r,
              vScale: o,
              _stacked: l,
              _dataset: h,
            } = this._cachedMeta,
            { sharedOptions: c, includeOptions: d } = this._getSharedOptions(
              e,
              a
            ),
            u = r.axis,
            g = o.axis,
            { spanGaps: p, segment: m } = this.options,
            b = (0, s.x)(p) ? p : Number.POSITIVE_INFINITY,
            x = this.chart._animationsDisabled || n || "none" === a,
            _ = e + i,
            y = t.length,
            v = e > 0 && this.getParsed(e - 1);
          for (let i = 0; i < y; ++i) {
            let p = t[i],
              y = x ? p : {};
            if (i < e || i >= _) {
              y.skip = !0;
              continue;
            }
            let k = this.getParsed(i),
              M = (0, s.k)(k[g]),
              S = (y[u] = r.getPixelForValue(k[u], i)),
              w = (y[g] =
                n || M
                  ? o.getBasePixel()
                  : o.getPixelForValue(l ? this.applyStack(o, k, l) : k[g], i));
            (y.skip = isNaN(S) || isNaN(w) || M),
              (y.stop = i > 0 && Math.abs(k[u] - v[u]) > b),
              m && ((y.parsed = k), (y.raw = h.data[i])),
              d &&
                (y.options =
                  c ||
                  this.resolveDataElementOptions(i, p.active ? "active" : a)),
              x || this.updateElement(p, i, y, a),
              (v = k);
          }
        }
        getMaxOverflow() {
          let t = this._cachedMeta,
            e = t.dataset,
            i = (e.options && e.options.borderWidth) || 0,
            s = t.data || [];
          return s.length
            ? Math.max(
                i,
                s[0].size(this.resolveDataElementOptions(0)),
                s[s.length - 1].size(
                  this.resolveDataElementOptions(s.length - 1)
                )
              ) / 2
            : i;
        }
        draw() {
          let t = this._cachedMeta;
          t.dataset.updateControlPoints(this.chart.chartArea, t.iScale.axis),
            super.draw();
        }
      };
      let PolarAreaController = class PolarAreaController extends DatasetController {
        static id = "polarArea";
        static defaults = {
          dataElementType: "arc",
          animation: { animateRotate: !0, animateScale: !0 },
          animations: {
            numbers: {
              type: "number",
              properties: [
                "x",
                "y",
                "startAngle",
                "endAngle",
                "innerRadius",
                "outerRadius",
              ],
            },
          },
          indexAxis: "r",
          startAngle: 0,
        };
        static overrides = {
          aspectRatio: 1,
          plugins: {
            legend: {
              labels: {
                generateLabels(t) {
                  let e = t.data;
                  if (e.labels.length && e.datasets.length) {
                    let {
                      labels: { pointStyle: i, color: s },
                    } = t.legend.options;
                    return e.labels.map((e, a) => {
                      let n = t.getDatasetMeta(0).controller.getStyle(a);
                      return {
                        text: e,
                        fillStyle: n.backgroundColor,
                        strokeStyle: n.borderColor,
                        fontColor: s,
                        lineWidth: n.borderWidth,
                        pointStyle: i,
                        hidden: !t.getDataVisibility(a),
                        index: a,
                      };
                    });
                  }
                  return [];
                },
              },
              onClick(t, e, i) {
                i.chart.toggleDataVisibility(e.index), i.chart.update();
              },
            },
          },
          scales: {
            r: {
              type: "radialLinear",
              angleLines: { display: !1 },
              beginAtZero: !0,
              grid: { circular: !0 },
              pointLabels: { display: !1 },
              startAngle: 0,
            },
          },
        };
        constructor(t, e) {
          super(t, e), (this.innerRadius = void 0), (this.outerRadius = void 0);
        }
        getLabelAndValue(t) {
          let e = this._cachedMeta,
            i = this.chart,
            a = i.data.labels || [],
            n = (0, s.o)(e._parsed[t].r, i.options.locale);
          return { label: a[t] || "", value: n };
        }
        parseObjectData(t, e, i, a) {
          return s.y.bind(this)(t, e, i, a);
        }
        update(t) {
          let e = this._cachedMeta.data;
          this._updateRadius(), this.updateElements(e, 0, e.length, t);
        }
        getMinMax() {
          let t = this._cachedMeta,
            e = {
              min: Number.POSITIVE_INFINITY,
              max: Number.NEGATIVE_INFINITY,
            };
          return (
            t.data.forEach((t, i) => {
              let s = this.getParsed(i).r;
              !isNaN(s) &&
                this.chart.getDataVisibility(i) &&
                (s < e.min && (e.min = s), s > e.max && (e.max = s));
            }),
            e
          );
        }
        _updateRadius() {
          let t = this.chart,
            e = t.chartArea,
            i = t.options,
            s = Math.max(Math.min(e.right - e.left, e.bottom - e.top) / 2, 0),
            a = Math.max(
              i.cutoutPercentage ? (s / 100) * i.cutoutPercentage : 1,
              0
            ),
            n = (s - a) / t.getVisibleDatasetCount();
          (this.outerRadius = s - n * this.index),
            (this.innerRadius = this.outerRadius - n);
        }
        updateElements(t, e, i, a) {
          let n,
            r = "reset" === a,
            o = this.chart,
            l = o.options.animation,
            h = this._cachedMeta.rScale,
            c = h.xCenter,
            d = h.yCenter,
            u = h.getIndexAngle(0) - 0.5 * s.P,
            g = u,
            p = 360 / this.countVisibleElements();
          for (n = 0; n < e; ++n) g += this._computeAngle(n, a, p);
          for (n = e; n < e + i; n++) {
            let e = t[n],
              i = g,
              s = g + this._computeAngle(n, a, p),
              m = o.getDataVisibility(n)
                ? h.getDistanceFromCenterForValue(this.getParsed(n).r)
                : 0;
            (g = s),
              r && (l.animateScale && (m = 0), l.animateRotate && (i = s = u));
            let b = {
              x: c,
              y: d,
              innerRadius: 0,
              outerRadius: m,
              startAngle: i,
              endAngle: s,
              options: this.resolveDataElementOptions(
                n,
                e.active ? "active" : a
              ),
            };
            this.updateElement(e, n, b, a);
          }
        }
        countVisibleElements() {
          let t = this._cachedMeta,
            e = 0;
          return (
            t.data.forEach((t, i) => {
              !isNaN(this.getParsed(i).r) &&
                this.chart.getDataVisibility(i) &&
                e++;
            }),
            e
          );
        }
        _computeAngle(t, e, i) {
          return this.chart.getDataVisibility(t)
            ? (0, s.t)(this.resolveDataElementOptions(t, e).angle || i)
            : 0;
        }
      };
      function abstract() {
        throw Error(
          "This method is not implemented: Check that a complete date adapter is provided."
        );
      }
      let DateAdapterBase = class DateAdapterBase {
        static override(t) {
          Object.assign(DateAdapterBase.prototype, t);
        }
        options;
        constructor(t) {
          this.options = t || {};
        }
        init() {}
        formats() {
          return abstract();
        }
        parse() {
          return abstract();
        }
        format() {
          return abstract();
        }
        add() {
          return abstract();
        }
        diff() {
          return abstract();
        }
        startOf() {
          return abstract();
        }
        endOf() {
          return abstract();
        }
      };
      function binarySearch(t, e, i, a) {
        let { controller: n, data: r, _sorted: o } = t,
          l = n._cachedMeta.iScale,
          h =
            t.dataset && t.dataset.options ? t.dataset.options.spanGaps : null;
        if (l && e === l.axis && "r" !== e && o && r.length) {
          let o = l._reversePixels ? s.A : s.B;
          if (a) {
            if (n._sharedOptions) {
              let t = r[0],
                s = "function" == typeof t.getRange && t.getRange(e);
              if (s) {
                let t = o(r, e, i - s),
                  a = o(r, e, i + s);
                return { lo: t.lo, hi: a.hi };
              }
            }
          } else {
            let a = o(r, e, i);
            if (h) {
              let { vScale: e } = n._cachedMeta,
                { _parsed: i } = t,
                r = i
                  .slice(0, a.lo + 1)
                  .reverse()
                  .findIndex((t) => !(0, s.k)(t[e.axis]));
              a.lo -= Math.max(0, r);
              let o = i.slice(a.hi).findIndex((t) => !(0, s.k)(t[e.axis]));
              a.hi += Math.max(0, o);
            }
            return a;
          }
        }
        return { lo: 0, hi: r.length - 1 };
      }
      function evaluateInteractionItems(t, e, i, s, a) {
        let n = t.getSortedVisibleDatasetMetas(),
          r = i[e];
        for (let t = 0, i = n.length; t < i; ++t) {
          let { index: i, data: o } = n[t],
            { lo: l, hi: h } = binarySearch(n[t], e, r, a);
          for (let t = l; t <= h; ++t) {
            let e = o[t];
            e.skip || s(e, i, t);
          }
        }
      }
      function getDistanceMetricForAxis(t) {
        let e = -1 !== t.indexOf("x"),
          i = -1 !== t.indexOf("y");
        return function (t, s) {
          return Math.sqrt(
            Math.pow(e ? Math.abs(t.x - s.x) : 0, 2) +
              Math.pow(i ? Math.abs(t.y - s.y) : 0, 2)
          );
        };
      }
      function getIntersectItems(t, e, i, a, n) {
        let r = [];
        return (
          (n || t.isPointInArea(e)) &&
            evaluateInteractionItems(
              t,
              i,
              e,
              function (i, o, l) {
                (n || (0, s.C)(i, t.chartArea, 0)) &&
                  i.inRange(e.x, e.y, a) &&
                  r.push({ element: i, datasetIndex: o, index: l });
              },
              !0
            ),
          r
        );
      }
      function getNearestRadialItems(t, e, i, a) {
        let n = [];
        function evaluationFunc(t, i, r) {
          let { startAngle: o, endAngle: l } = t.getProps(
              ["startAngle", "endAngle"],
              a
            ),
            { angle: h } = (0, s.D)(t, { x: e.x, y: e.y });
          (0, s.p)(h, o, l) &&
            n.push({ element: t, datasetIndex: i, index: r });
        }
        return evaluateInteractionItems(t, i, e, evaluationFunc), n;
      }
      function getNearestCartesianItems(t, e, i, s, a, n) {
        let r = [],
          o = getDistanceMetricForAxis(i),
          l = Number.POSITIVE_INFINITY;
        function evaluationFunc(i, h, c) {
          let d = i.inRange(e.x, e.y, a);
          if (s && !d) return;
          let u = i.getCenterPoint(a);
          if (!(n || t.isPointInArea(u)) && !d) return;
          let g = o(e, u);
          g < l
            ? ((r = [{ element: i, datasetIndex: h, index: c }]), (l = g))
            : g === l && r.push({ element: i, datasetIndex: h, index: c });
        }
        return evaluateInteractionItems(t, i, e, evaluationFunc), r;
      }
      function getNearestItems(t, e, i, s, a, n) {
        return n || t.isPointInArea(e)
          ? "r" !== i || s
            ? getNearestCartesianItems(t, e, i, s, a, n)
            : getNearestRadialItems(t, e, i, a)
          : [];
      }
      function getAxisItems(t, e, i, s, a) {
        let n = [],
          r = "x" === i ? "inXRange" : "inYRange",
          o = !1;
        return (evaluateInteractionItems(t, i, e, (t, s, l) => {
          t[r] &&
            t[r](e[i], a) &&
            (n.push({ element: t, datasetIndex: s, index: l }),
            (o = o || t.inRange(e.x, e.y, a)));
        }),
        s && !o)
          ? []
          : n;
      }
      var o = {
        modes: {
          index(t, e, i, a) {
            let n = (0, s.z)(e, t),
              r = i.axis || "x",
              o = i.includeInvisible || !1,
              l = i.intersect
                ? getIntersectItems(t, n, r, a, o)
                : getNearestItems(t, n, r, !1, a, o),
              h = [];
            return l.length
              ? (t.getSortedVisibleDatasetMetas().forEach((t) => {
                  let e = l[0].index,
                    i = t.data[e];
                  i &&
                    !i.skip &&
                    h.push({ element: i, datasetIndex: t.index, index: e });
                }),
                h)
              : [];
          },
          dataset(t, e, i, a) {
            let n = (0, s.z)(e, t),
              r = i.axis || "xy",
              o = i.includeInvisible || !1,
              l = i.intersect
                ? getIntersectItems(t, n, r, a, o)
                : getNearestItems(t, n, r, !1, a, o);
            if (l.length > 0) {
              let e = l[0].datasetIndex,
                i = t.getDatasetMeta(e).data;
              l = [];
              for (let t = 0; t < i.length; ++t)
                l.push({ element: i[t], datasetIndex: e, index: t });
            }
            return l;
          },
          point(t, e, i, a) {
            let n = (0, s.z)(e, t);
            return getIntersectItems(
              t,
              n,
              i.axis || "xy",
              a,
              i.includeInvisible || !1
            );
          },
          nearest(t, e, i, a) {
            let n = (0, s.z)(e, t),
              r = i.axis || "xy",
              o = i.includeInvisible || !1;
            return getNearestItems(t, n, r, i.intersect, a, o);
          },
          x(t, e, i, a) {
            let n = (0, s.z)(e, t);
            return getAxisItems(t, n, "x", i.intersect, a);
          },
          y(t, e, i, a) {
            let n = (0, s.z)(e, t);
            return getAxisItems(t, n, "y", i.intersect, a);
          },
        },
      };
      let l = ["left", "top", "right", "bottom"];
      function filterByPosition(t, e) {
        return t.filter((t) => t.pos === e);
      }
      function filterDynamicPositionByAxis(t, e) {
        return t.filter((t) => -1 === l.indexOf(t.pos) && t.box.axis === e);
      }
      function sortByWeight(t, e) {
        return t.sort((t, i) => {
          let s = e ? i : t,
            a = e ? t : i;
          return s.weight === a.weight
            ? s.index - a.index
            : s.weight - a.weight;
        });
      }
      function wrapBoxes(t) {
        let e,
          i,
          s,
          a,
          n,
          r,
          o = [];
        for (e = 0, i = (t || []).length; e < i; ++e)
          (s = t[e]),
            ({
              position: a,
              options: { stack: n, stackWeight: r = 1 },
            } = s),
            o.push({
              index: e,
              box: s,
              pos: a,
              horizontal: s.isHorizontal(),
              weight: s.weight,
              stack: n && a + n,
              stackWeight: r,
            });
        return o;
      }
      function buildStacks(t) {
        let e = {};
        for (let i of t) {
          let { stack: t, pos: s, stackWeight: a } = i;
          if (!t || !l.includes(s)) continue;
          let n = e[t] || (e[t] = { count: 0, placed: 0, weight: 0, size: 0 });
          n.count++, (n.weight += a);
        }
        return e;
      }
      function setLayoutDims(t, e) {
        let i,
          s,
          a,
          n = buildStacks(t),
          { vBoxMaxWidth: r, hBoxMaxHeight: o } = e;
        for (i = 0, s = t.length; i < s; ++i) {
          let { fullSize: s } = (a = t[i]).box,
            l = n[a.stack],
            h = l && a.stackWeight / l.weight;
          a.horizontal
            ? ((a.width = h ? h * r : s && e.availableWidth), (a.height = o))
            : ((a.width = r), (a.height = h ? h * o : s && e.availableHeight));
        }
        return n;
      }
      function buildLayoutBoxes(t) {
        let e = wrapBoxes(t),
          i = sortByWeight(
            e.filter((t) => t.box.fullSize),
            !0
          ),
          s = sortByWeight(filterByPosition(e, "left"), !0),
          a = sortByWeight(filterByPosition(e, "right")),
          n = sortByWeight(filterByPosition(e, "top"), !0),
          r = sortByWeight(filterByPosition(e, "bottom")),
          o = filterDynamicPositionByAxis(e, "x"),
          l = filterDynamicPositionByAxis(e, "y");
        return {
          fullSize: i,
          leftAndTop: s.concat(n),
          rightAndBottom: a.concat(l).concat(r).concat(o),
          chartArea: filterByPosition(e, "chartArea"),
          vertical: s.concat(a).concat(l),
          horizontal: n.concat(r).concat(o),
        };
      }
      function getCombinedMax(t, e, i, s) {
        return Math.max(t[i], e[i]) + Math.max(t[s], e[s]);
      }
      function updateMaxPadding(t, e) {
        (t.top = Math.max(t.top, e.top)),
          (t.left = Math.max(t.left, e.left)),
          (t.bottom = Math.max(t.bottom, e.bottom)),
          (t.right = Math.max(t.right, e.right));
      }
      function updateDims(t, e, i, a) {
        let { pos: n, box: r } = i,
          o = t.maxPadding;
        if (!(0, s.i)(n)) {
          i.size && (t[n] -= i.size);
          let e = a[i.stack] || { size: 0, count: 1 };
          (e.size = Math.max(e.size, i.horizontal ? r.height : r.width)),
            (i.size = e.size / e.count),
            (t[n] += i.size);
        }
        r.getPadding && updateMaxPadding(o, r.getPadding());
        let l = Math.max(
            0,
            e.outerWidth - getCombinedMax(o, t, "left", "right")
          ),
          h = Math.max(
            0,
            e.outerHeight - getCombinedMax(o, t, "top", "bottom")
          ),
          c = l !== t.w,
          d = h !== t.h;
        return (
          (t.w = l),
          (t.h = h),
          i.horizontal ? { same: c, other: d } : { same: d, other: c }
        );
      }
      function handleMaxPadding(t) {
        let e = t.maxPadding;
        function updatePos(i) {
          let s = Math.max(e[i] - t[i], 0);
          return (t[i] += s), s;
        }
        (t.y += updatePos("top")),
          (t.x += updatePos("left")),
          updatePos("right"),
          updatePos("bottom");
      }
      function getMargins(t, e) {
        let i = e.maxPadding;
        return (function marginForPositions(t) {
          let s = { left: 0, top: 0, right: 0, bottom: 0 };
          return (
            t.forEach((t) => {
              s[t] = Math.max(e[t], i[t]);
            }),
            s
          );
        })(t ? ["left", "right"] : ["top", "bottom"]);
      }
      function fitBoxes(t, e, i, s) {
        let a,
          n,
          r,
          o,
          l,
          h,
          c = [];
        for (a = 0, n = t.length, l = 0; a < n; ++a) {
          (o = (r = t[a]).box).update(
            r.width || e.w,
            r.height || e.h,
            getMargins(r.horizontal, e)
          );
          let { same: n, other: d } = updateDims(e, i, r, s);
          (l |= n && c.length), (h = h || d), o.fullSize || c.push(r);
        }
        return (l && fitBoxes(c, e, i, s)) || h;
      }
      function setBoxDims(t, e, i, s, a) {
        (t.top = i),
          (t.left = e),
          (t.right = e + s),
          (t.bottom = i + a),
          (t.width = s),
          (t.height = a);
      }
      function placeBoxes(t, e, i, a) {
        let n = i.padding,
          { x: r, y: o } = e;
        for (let l of t) {
          let t = l.box,
            h = a[l.stack] || { count: 1, placed: 0, weight: 1 },
            c = l.stackWeight / h.weight || 1;
          if (l.horizontal) {
            let a = e.w * c,
              r = h.size || t.height;
            (0, s.h)(h.start) && (o = h.start),
              t.fullSize
                ? setBoxDims(t, n.left, o, i.outerWidth - n.right - n.left, r)
                : setBoxDims(t, e.left + h.placed, o, a, r),
              (h.start = o),
              (h.placed += a),
              (o = t.bottom);
          } else {
            let a = e.h * c,
              o = h.size || t.width;
            (0, s.h)(h.start) && (r = h.start),
              t.fullSize
                ? setBoxDims(t, r, n.top, o, i.outerHeight - n.bottom - n.top)
                : setBoxDims(t, r, e.top + h.placed, o, a),
              (h.start = r),
              (h.placed += a),
              (r = t.right);
          }
        }
        (e.x = r), (e.y = o);
      }
      var h = {
        addBox(t, e) {
          t.boxes || (t.boxes = []),
            (e.fullSize = e.fullSize || !1),
            (e.position = e.position || "top"),
            (e.weight = e.weight || 0),
            (e._layers =
              e._layers ||
              function () {
                return [
                  {
                    z: 0,
                    draw(t) {
                      e.draw(t);
                    },
                  },
                ];
              }),
            t.boxes.push(e);
        },
        removeBox(t, e) {
          let i = t.boxes ? t.boxes.indexOf(e) : -1;
          -1 !== i && t.boxes.splice(i, 1);
        },
        configure(t, e, i) {
          (e.fullSize = i.fullSize),
            (e.position = i.position),
            (e.weight = i.weight);
        },
        update(t, e, i, a) {
          if (!t) return;
          let n = (0, s.E)(t.options.layout.padding),
            r = Math.max(e - n.width, 0),
            o = Math.max(i - n.height, 0),
            l = buildLayoutBoxes(t.boxes),
            h = l.vertical,
            c = l.horizontal;
          (0, s.F)(t.boxes, (t) => {
            "function" == typeof t.beforeLayout && t.beforeLayout();
          });
          let d = Object.freeze({
              outerWidth: e,
              outerHeight: i,
              padding: n,
              availableWidth: r,
              availableHeight: o,
              vBoxMaxWidth:
                r /
                2 /
                (h.reduce(
                  (t, e) =>
                    e.box.options && !1 === e.box.options.display ? t : t + 1,
                  0
                ) || 1),
              hBoxMaxHeight: o / 2,
            }),
            u = Object.assign({}, n);
          updateMaxPadding(u, (0, s.E)(a));
          let g = Object.assign(
              { maxPadding: u, w: r, h: o, x: n.left, y: n.top },
              n
            ),
            p = setLayoutDims(h.concat(c), d);
          fitBoxes(l.fullSize, g, d, p),
            fitBoxes(h, g, d, p),
            fitBoxes(c, g, d, p) && fitBoxes(h, g, d, p),
            handleMaxPadding(g),
            placeBoxes(l.leftAndTop, g, d, p),
            (g.x += g.w),
            (g.y += g.h),
            placeBoxes(l.rightAndBottom, g, d, p),
            (t.chartArea = {
              left: g.left,
              top: g.top,
              right: g.left + g.w,
              bottom: g.top + g.h,
              height: g.h,
              width: g.w,
            }),
            (0, s.F)(l.chartArea, (e) => {
              let i = e.box;
              Object.assign(i, t.chartArea),
                i.update(g.w, g.h, { left: 0, top: 0, right: 0, bottom: 0 });
            });
        },
      };
      let BasePlatform = class BasePlatform {
        acquireContext(t, e) {}
        releaseContext(t) {
          return !1;
        }
        addEventListener(t, e, i) {}
        removeEventListener(t, e, i) {}
        getDevicePixelRatio() {
          return 1;
        }
        getMaximumSize(t, e, i, s) {
          return (
            (e = Math.max(0, e || t.width)),
            (i = i || t.height),
            { width: e, height: Math.max(0, s ? Math.floor(e / s) : i) }
          );
        }
        isAttached(t) {
          return !0;
        }
        updateConfig(t) {}
      };
      let BasicPlatform = class BasicPlatform extends BasePlatform {
        acquireContext(t) {
          return (t && t.getContext && t.getContext("2d")) || null;
        }
        updateConfig(t) {
          t.options.animation = !1;
        }
      };
      let c = "$chartjs",
        d = {
          touchstart: "mousedown",
          touchmove: "mousemove",
          touchend: "mouseup",
          pointerenter: "mouseenter",
          pointerdown: "mousedown",
          pointermove: "mousemove",
          pointerup: "mouseup",
          pointerleave: "mouseout",
          pointerout: "mouseout",
        },
        isNullOrEmpty = (t) => null === t || "" === t;
      function initCanvas(t, e) {
        let i = t.style,
          a = t.getAttribute("height"),
          n = t.getAttribute("width");
        if (
          ((t[c] = {
            initial: {
              height: a,
              width: n,
              style: { display: i.display, height: i.height, width: i.width },
            },
          }),
          (i.display = i.display || "block"),
          (i.boxSizing = i.boxSizing || "border-box"),
          isNullOrEmpty(n))
        ) {
          let e = (0, s.J)(t, "width");
          void 0 !== e && (t.width = e);
        }
        if (isNullOrEmpty(a))
          if ("" === t.style.height) t.height = t.width / (e || 2);
          else {
            let e = (0, s.J)(t, "height");
            void 0 !== e && (t.height = e);
          }
        return t;
      }
      let u = !!s.K && { passive: !0 };
      function addListener(t, e, i) {
        t && t.addEventListener(e, i, u);
      }
      function removeListener(t, e, i) {
        t && t.canvas && t.canvas.removeEventListener(e, i, u);
      }
      function fromNativeEvent(t, e) {
        let i = d[t.type] || t.type,
          { x: a, y: n } = (0, s.z)(t, e);
        return {
          type: i,
          chart: e,
          native: t,
          x: void 0 !== a ? a : null,
          y: void 0 !== n ? n : null,
        };
      }
      function nodeListContains(t, e) {
        for (let i of t) if (i === e || i.contains(e)) return !0;
      }
      function createAttachObserver(t, e, i) {
        let s = t.canvas,
          a = new MutationObserver((t) => {
            let e = !1;
            for (let i of t)
              e =
                (e = e || nodeListContains(i.addedNodes, s)) &&
                !nodeListContains(i.removedNodes, s);
            e && i();
          });
        return a.observe(document, { childList: !0, subtree: !0 }), a;
      }
      function createDetachObserver(t, e, i) {
        let s = t.canvas,
          a = new MutationObserver((t) => {
            let e = !1;
            for (let i of t)
              e =
                (e = e || nodeListContains(i.removedNodes, s)) &&
                !nodeListContains(i.addedNodes, s);
            e && i();
          });
        return a.observe(document, { childList: !0, subtree: !0 }), a;
      }
      let g = new Map(),
        p = 0;
      function onWindowResize() {
        let t = window.devicePixelRatio;
        t !== p &&
          ((p = t),
          g.forEach((e, i) => {
            i.currentDevicePixelRatio !== t && e();
          }));
      }
      function listenDevicePixelRatioChanges(t, e) {
        g.size || window.addEventListener("resize", onWindowResize),
          g.set(t, e);
      }
      function unlistenDevicePixelRatioChanges(t) {
        g.delete(t),
          g.size || window.removeEventListener("resize", onWindowResize);
      }
      function createResizeObserver(t, e, i) {
        let a = t.canvas,
          n = a && (0, s.I)(a);
        if (!n) return;
        let r = (0, s.L)((t, e) => {
            let s = n.clientWidth;
            i(t, e), s < n.clientWidth && i();
          }, window),
          o = new ResizeObserver((t) => {
            let e = t[0],
              i = e.contentRect.width,
              s = e.contentRect.height;
            (0 !== i || 0 !== s) && r(i, s);
          });
        return o.observe(n), listenDevicePixelRatioChanges(t, r), o;
      }
      function releaseObserver(t, e, i) {
        i && i.disconnect(),
          "resize" === e && unlistenDevicePixelRatioChanges(t);
      }
      function createProxyAndListen(t, e, i) {
        let a = t.canvas,
          n = (0, s.L)((e) => {
            null !== t.ctx && i(fromNativeEvent(e, t));
          }, t);
        return addListener(a, e, n), n;
      }
      let DomPlatform = class DomPlatform extends BasePlatform {
        acquireContext(t, e) {
          let i = t && t.getContext && t.getContext("2d");
          return i && i.canvas === t ? (initCanvas(t, e), i) : null;
        }
        releaseContext(t) {
          let e = t.canvas;
          if (!e[c]) return !1;
          let i = e[c].initial;
          ["height", "width"].forEach((t) => {
            let a = i[t];
            (0, s.k)(a) ? e.removeAttribute(t) : e.setAttribute(t, a);
          });
          let a = i.style || {};
          return (
            Object.keys(a).forEach((t) => {
              e.style[t] = a[t];
            }),
            (e.width = e.width),
            delete e[c],
            !0
          );
        }
        addEventListener(t, e, i) {
          this.removeEventListener(t, e);
          let s = t.$proxies || (t.$proxies = {}),
            a =
              {
                attach: createAttachObserver,
                detach: createDetachObserver,
                resize: createResizeObserver,
              }[e] || createProxyAndListen;
          s[e] = a(t, e, i);
        }
        removeEventListener(t, e) {
          let i = t.$proxies || (t.$proxies = {}),
            s = i[e];
          s &&
            ((
              {
                attach: releaseObserver,
                detach: releaseObserver,
                resize: releaseObserver,
              }[e] || removeListener
            )(t, e, s),
            (i[e] = void 0));
        }
        getDevicePixelRatio() {
          return window.devicePixelRatio;
        }
        getMaximumSize(t, e, i, a) {
          return (0, s.G)(t, e, i, a);
        }
        isAttached(t) {
          let e = t && (0, s.I)(t);
          return !!(e && e.isConnected);
        }
      };
      function _detectPlatform(t) {
        return !(0, s.M)() ||
          ("undefined" != typeof OffscreenCanvas &&
            t instanceof OffscreenCanvas)
          ? BasicPlatform
          : DomPlatform;
      }
      let Element = class Element {
        static defaults = {};
        static defaultRoutes = void 0;
        x;
        y;
        active = !1;
        options;
        $animations;
        tooltipPosition(t) {
          let { x: e, y: i } = this.getProps(["x", "y"], t);
          return { x: e, y: i };
        }
        hasValue() {
          return (0, s.x)(this.x) && (0, s.x)(this.y);
        }
        getProps(t, e) {
          let i = this.$animations;
          if (!e || !i) return this;
          let s = {};
          return (
            t.forEach((t) => {
              s[t] = i[t] && i[t].active() ? i[t]._to : this[t];
            }),
            s
          );
        }
      };
      function autoSkip(t, e) {
        let i = t.options.ticks,
          a = determineMaxTicks(t),
          n = Math.min(i.maxTicksLimit || a, a),
          r = i.major.enabled ? getMajorIndices(e) : [],
          o = r.length,
          l = r[0],
          h = r[o - 1],
          c = [];
        if (o > n) return skipMajors(e, c, r, o / n), c;
        let d = calculateSpacing(r, e, n);
        if (o > 0) {
          let t,
            i,
            a = o > 1 ? Math.round((h - l) / (o - 1)) : null;
          for (
            skip(e, c, d, (0, s.k)(a) ? 0 : l - a, l), t = 0, i = o - 1;
            t < i;
            t++
          )
            skip(e, c, d, r[t], r[t + 1]);
          return skip(e, c, d, h, (0, s.k)(a) ? e.length : h + a), c;
        }
        return skip(e, c, d), c;
      }
      function determineMaxTicks(t) {
        let e = t.options.offset,
          i = t._tickSize();
        return Math.floor(Math.min(t._length / i + +!e, t._maxLength / i));
      }
      function calculateSpacing(t, e, i) {
        let a = getEvenSpacing(t),
          n = e.length / i;
        if (!a) return Math.max(n, 1);
        let r = (0, s.N)(a);
        for (let t = 0, e = r.length - 1; t < e; t++) {
          let e = r[t];
          if (e > n) return e;
        }
        return Math.max(n, 1);
      }
      function getMajorIndices(t) {
        let e,
          i,
          s = [];
        for (e = 0, i = t.length; e < i; e++) t[e].major && s.push(e);
        return s;
      }
      function skipMajors(t, e, i, s) {
        let a,
          n = 0,
          r = i[0];
        for (a = 0, s = Math.ceil(s); a < t.length; a++)
          a === r && (e.push(t[a]), (r = i[++n * s]));
      }
      function skip(t, e, i, a, n) {
        let r,
          o,
          l,
          h = (0, s.v)(a, 0),
          c = Math.min((0, s.v)(n, t.length), t.length),
          d = 0;
        for (
          i = Math.ceil(i), n && (i = (r = n - a) / Math.floor(r / i)), l = h;
          l < 0;

        )
          l = Math.round(h + ++d * i);
        for (o = Math.max(h, 0); o < c; o++)
          o === l && (e.push(t[o]), (l = Math.round(h + ++d * i)));
      }
      function getEvenSpacing(t) {
        let e,
          i,
          s = t.length;
        if (s < 2) return !1;
        for (i = t[0], e = 1; e < s; ++e) if (t[e] - t[e - 1] !== i) return !1;
        return i;
      }
      let reverseAlign = (t) =>
          "left" === t ? "right" : "right" === t ? "left" : t,
        offsetFromEdge = (t, e, i) =>
          "top" === e || "left" === e ? t[e] + i : t[e] - i,
        getTicksLimit = (t, e) => Math.min(e || t, t);
      function sample(t, e) {
        let i = [],
          s = t.length / e,
          a = t.length,
          n = 0;
        for (; n < a; n += s) i.push(t[Math.floor(n)]);
        return i;
      }
      function getPixelForGridLine(t, e, i) {
        let s,
          a = t.ticks.length,
          n = Math.min(e, a - 1),
          r = t._startPixel,
          o = t._endPixel,
          l = t.getPixelForTick(n);
        if (
          !i ||
          ((s =
            1 === a
              ? Math.max(l - r, o - l)
              : 0 === e
              ? (t.getPixelForTick(1) - l) / 2
              : (l - t.getPixelForTick(n - 1)) / 2),
          !((l += n < e ? s : -s) < r - 1e-6) && !(l > o + 1e-6))
        )
          return l;
      }
      function garbageCollect(t, e) {
        (0, s.F)(t, (t) => {
          let i,
            s = t.gc,
            a = s.length / 2;
          if (a > e) {
            for (i = 0; i < a; ++i) delete t.data[s[i]];
            s.splice(0, a);
          }
        });
      }
      function getTickMarkLength(t) {
        return t.drawTicks ? t.tickLength : 0;
      }
      function getTitleHeight(t, e) {
        if (!t.display) return 0;
        let i = (0, s.a0)(t.font, e),
          a = (0, s.E)(t.padding);
        return ((0, s.b)(t.text) ? t.text.length : 1) * i.lineHeight + a.height;
      }
      function createScaleContext(t, e) {
        return (0, s.j)(t, { scale: e, type: "scale" });
      }
      function createTickContext(t, e, i) {
        return (0, s.j)(t, { tick: i, index: e, type: "tick" });
      }
      function titleAlign(t, e, i) {
        let a = (0, s.a1)(t);
        return (
          ((i && "right" !== e) || (!i && "right" === e)) &&
            (a = reverseAlign(a)),
          a
        );
      }
      function titleArgs(t, e, i, a) {
        let n,
          r,
          o,
          { top: l, left: h, bottom: c, right: d, chart: u } = t,
          { chartArea: g, scales: p } = u,
          m = 0,
          b = c - l,
          x = d - h;
        if (t.isHorizontal()) {
          if (((r = (0, s.a2)(a, h, d)), (0, s.i)(i))) {
            let t = Object.keys(i)[0],
              s = i[t];
            o = p[t].getPixelForValue(s) + b - e;
          } else
            o =
              "center" === i
                ? (g.bottom + g.top) / 2 + b - e
                : offsetFromEdge(t, i, e);
          n = d - h;
        } else {
          if ((0, s.i)(i)) {
            let t = Object.keys(i)[0],
              s = i[t];
            r = p[t].getPixelForValue(s) - x + e;
          } else
            r =
              "center" === i
                ? (g.left + g.right) / 2 - x + e
                : offsetFromEdge(t, i, e);
          (o = (0, s.a2)(a, c, l)), (m = "left" === i ? -s.H : s.H);
        }
        return { titleX: r, titleY: o, maxWidth: n, rotation: m };
      }
      let Scale = class Scale extends Element {
        constructor(t) {
          super(),
            (this.id = t.id),
            (this.type = t.type),
            (this.options = void 0),
            (this.ctx = t.ctx),
            (this.chart = t.chart),
            (this.top = void 0),
            (this.bottom = void 0),
            (this.left = void 0),
            (this.right = void 0),
            (this.width = void 0),
            (this.height = void 0),
            (this._margins = { left: 0, right: 0, top: 0, bottom: 0 }),
            (this.maxWidth = void 0),
            (this.maxHeight = void 0),
            (this.paddingTop = void 0),
            (this.paddingBottom = void 0),
            (this.paddingLeft = void 0),
            (this.paddingRight = void 0),
            (this.axis = void 0),
            (this.labelRotation = void 0),
            (this.min = void 0),
            (this.max = void 0),
            (this._range = void 0),
            (this.ticks = []),
            (this._gridLineItems = null),
            (this._labelItems = null),
            (this._labelSizes = null),
            (this._length = 0),
            (this._maxLength = 0),
            (this._longestTextCache = {}),
            (this._startPixel = void 0),
            (this._endPixel = void 0),
            (this._reversePixels = !1),
            (this._userMax = void 0),
            (this._userMin = void 0),
            (this._suggestedMax = void 0),
            (this._suggestedMin = void 0),
            (this._ticksLength = 0),
            (this._borderValue = 0),
            (this._cache = {}),
            (this._dataLimitsCached = !1),
            (this.$context = void 0);
        }
        init(t) {
          (this.options = t.setContext(this.getContext())),
            (this.axis = t.axis),
            (this._userMin = this.parse(t.min)),
            (this._userMax = this.parse(t.max)),
            (this._suggestedMin = this.parse(t.suggestedMin)),
            (this._suggestedMax = this.parse(t.suggestedMax));
        }
        parse(t, e) {
          return t;
        }
        getUserBounds() {
          let {
            _userMin: t,
            _userMax: e,
            _suggestedMin: i,
            _suggestedMax: a,
          } = this;
          return (
            (t = (0, s.O)(t, Number.POSITIVE_INFINITY)),
            (e = (0, s.O)(e, Number.NEGATIVE_INFINITY)),
            (i = (0, s.O)(i, Number.POSITIVE_INFINITY)),
            (a = (0, s.O)(a, Number.NEGATIVE_INFINITY)),
            {
              min: (0, s.O)(t, i),
              max: (0, s.O)(e, a),
              minDefined: (0, s.g)(t),
              maxDefined: (0, s.g)(e),
            }
          );
        }
        getMinMax(t) {
          let e,
            {
              min: i,
              max: a,
              minDefined: n,
              maxDefined: r,
            } = this.getUserBounds();
          if (n && r) return { min: i, max: a };
          let o = this.getMatchingVisibleMetas();
          for (let s = 0, l = o.length; s < l; ++s)
            (e = o[s].controller.getMinMax(this, t)),
              n || (i = Math.min(i, e.min)),
              r || (a = Math.max(a, e.max));
          return (
            (i = r && i > a ? a : i),
            (a = n && i > a ? i : a),
            {
              min: (0, s.O)(i, (0, s.O)(a, i)),
              max: (0, s.O)(a, (0, s.O)(i, a)),
            }
          );
        }
        getPadding() {
          return {
            left: this.paddingLeft || 0,
            top: this.paddingTop || 0,
            right: this.paddingRight || 0,
            bottom: this.paddingBottom || 0,
          };
        }
        getTicks() {
          return this.ticks;
        }
        getLabels() {
          let t = this.chart.data;
          return (
            this.options.labels ||
            (this.isHorizontal() ? t.xLabels : t.yLabels) ||
            t.labels ||
            []
          );
        }
        getLabelItems(t = this.chart.chartArea) {
          return (
            this._labelItems || (this._labelItems = this._computeLabelItems(t))
          );
        }
        beforeLayout() {
          (this._cache = {}), (this._dataLimitsCached = !1);
        }
        beforeUpdate() {
          (0, s.Q)(this.options.beforeUpdate, [this]);
        }
        update(t, e, i) {
          let { beginAtZero: a, grace: n, ticks: r } = this.options,
            o = r.sampleSize;
          this.beforeUpdate(),
            (this.maxWidth = t),
            (this.maxHeight = e),
            (this._margins = i =
              Object.assign({ left: 0, right: 0, top: 0, bottom: 0 }, i)),
            (this.ticks = null),
            (this._labelSizes = null),
            (this._gridLineItems = null),
            (this._labelItems = null),
            this.beforeSetDimensions(),
            this.setDimensions(),
            this.afterSetDimensions(),
            (this._maxLength = this.isHorizontal()
              ? this.width + i.left + i.right
              : this.height + i.top + i.bottom),
            this._dataLimitsCached ||
              (this.beforeDataLimits(),
              this.determineDataLimits(),
              this.afterDataLimits(),
              (this._range = (0, s.R)(this, n, a)),
              (this._dataLimitsCached = !0)),
            this.beforeBuildTicks(),
            (this.ticks = this.buildTicks() || []),
            this.afterBuildTicks();
          let l = o < this.ticks.length;
          this._convertTicksToLabels(l ? sample(this.ticks, o) : this.ticks),
            this.configure(),
            this.beforeCalculateLabelRotation(),
            this.calculateLabelRotation(),
            this.afterCalculateLabelRotation(),
            r.display &&
              (r.autoSkip || "auto" === r.source) &&
              ((this.ticks = autoSkip(this, this.ticks)),
              (this._labelSizes = null),
              this.afterAutoSkip()),
            l && this._convertTicksToLabels(this.ticks),
            this.beforeFit(),
            this.fit(),
            this.afterFit(),
            this.afterUpdate();
        }
        configure() {
          let t,
            e,
            i = this.options.reverse;
          this.isHorizontal()
            ? ((t = this.left), (e = this.right))
            : ((t = this.top), (e = this.bottom), (i = !i)),
            (this._startPixel = t),
            (this._endPixel = e),
            (this._reversePixels = i),
            (this._length = e - t),
            (this._alignToPixels = this.options.alignToPixels);
        }
        afterUpdate() {
          (0, s.Q)(this.options.afterUpdate, [this]);
        }
        beforeSetDimensions() {
          (0, s.Q)(this.options.beforeSetDimensions, [this]);
        }
        setDimensions() {
          this.isHorizontal()
            ? ((this.width = this.maxWidth),
              (this.left = 0),
              (this.right = this.width))
            : ((this.height = this.maxHeight),
              (this.top = 0),
              (this.bottom = this.height)),
            (this.paddingLeft = 0),
            (this.paddingTop = 0),
            (this.paddingRight = 0),
            (this.paddingBottom = 0);
        }
        afterSetDimensions() {
          (0, s.Q)(this.options.afterSetDimensions, [this]);
        }
        _callHooks(t) {
          this.chart.notifyPlugins(t, this.getContext()),
            (0, s.Q)(this.options[t], [this]);
        }
        beforeDataLimits() {
          this._callHooks("beforeDataLimits");
        }
        determineDataLimits() {}
        afterDataLimits() {
          this._callHooks("afterDataLimits");
        }
        beforeBuildTicks() {
          this._callHooks("beforeBuildTicks");
        }
        buildTicks() {
          return [];
        }
        afterBuildTicks() {
          this._callHooks("afterBuildTicks");
        }
        beforeTickToLabelConversion() {
          (0, s.Q)(this.options.beforeTickToLabelConversion, [this]);
        }
        generateTickLabels(t) {
          let e,
            i,
            a,
            n = this.options.ticks;
          for (e = 0, i = t.length; e < i; e++)
            (a = t[e]).label = (0, s.Q)(n.callback, [a.value, e, t], this);
        }
        afterTickToLabelConversion() {
          (0, s.Q)(this.options.afterTickToLabelConversion, [this]);
        }
        beforeCalculateLabelRotation() {
          (0, s.Q)(this.options.beforeCalculateLabelRotation, [this]);
        }
        calculateLabelRotation() {
          let t,
            e,
            i,
            a = this.options,
            n = a.ticks,
            r = getTicksLimit(this.ticks.length, a.ticks.maxTicksLimit),
            o = n.minRotation || 0,
            l = n.maxRotation,
            h = o;
          if (
            !this._isVisible() ||
            !n.display ||
            o >= l ||
            r <= 1 ||
            !this.isHorizontal()
          ) {
            this.labelRotation = o;
            return;
          }
          let c = this._getLabelSizes(),
            d = c.widest.width,
            u = c.highest.height,
            g = (0, s.S)(this.chart.width - d, 0, this.maxWidth);
          d + 6 > (t = a.offset ? this.maxWidth / r : g / (r - 1)) &&
            ((t = g / (r - (a.offset ? 0.5 : 1))),
            (e =
              this.maxHeight -
              getTickMarkLength(a.grid) -
              n.padding -
              getTitleHeight(a.title, this.chart.options.font)),
            (i = Math.sqrt(d * d + u * u)),
            (h = Math.max(
              o,
              Math.min(
                l,
                (h = (0, s.U)(
                  Math.min(
                    Math.asin((0, s.S)((c.highest.height + 6) / t, -1, 1)),
                    Math.asin((0, s.S)(e / i, -1, 1)) -
                      Math.asin((0, s.S)(u / i, -1, 1))
                  )
                ))
              )
            ))),
            (this.labelRotation = h);
        }
        afterCalculateLabelRotation() {
          (0, s.Q)(this.options.afterCalculateLabelRotation, [this]);
        }
        afterAutoSkip() {}
        beforeFit() {
          (0, s.Q)(this.options.beforeFit, [this]);
        }
        fit() {
          let t = { width: 0, height: 0 },
            {
              chart: e,
              options: { ticks: i, title: a, grid: n },
            } = this,
            r = this._isVisible(),
            o = this.isHorizontal();
          if (r) {
            let r = getTitleHeight(a, e.options.font);
            if (
              (o
                ? ((t.width = this.maxWidth),
                  (t.height = getTickMarkLength(n) + r))
                : ((t.height = this.maxHeight),
                  (t.width = getTickMarkLength(n) + r)),
              i.display && this.ticks.length)
            ) {
              let {
                  first: e,
                  last: a,
                  widest: n,
                  highest: r,
                } = this._getLabelSizes(),
                l = 2 * i.padding,
                h = (0, s.t)(this.labelRotation),
                c = Math.cos(h),
                d = Math.sin(h);
              if (o) {
                let e = i.mirror ? 0 : d * n.width + c * r.height;
                t.height = Math.min(this.maxHeight, t.height + e + l);
              } else {
                let e = i.mirror ? 0 : c * n.width + d * r.height;
                t.width = Math.min(this.maxWidth, t.width + e + l);
              }
              this._calculatePadding(e, a, d, c);
            }
          }
          this._handleMargins(),
            o
              ? ((this.width = this._length =
                  e.width - this._margins.left - this._margins.right),
                (this.height = t.height))
              : ((this.width = t.width),
                (this.height = this._length =
                  e.height - this._margins.top - this._margins.bottom));
        }
        _calculatePadding(t, e, i, s) {
          let {
              ticks: { align: a, padding: n },
              position: r,
            } = this.options,
            o = 0 !== this.labelRotation,
            l = "top" !== r && "x" === this.axis;
          if (this.isHorizontal()) {
            let r = this.getPixelForTick(0) - this.left,
              h = this.right - this.getPixelForTick(this.ticks.length - 1),
              c = 0,
              d = 0;
            o
              ? l
                ? ((c = s * t.width), (d = i * e.height))
                : ((c = i * t.height), (d = s * e.width))
              : "start" === a
              ? (d = e.width)
              : "end" === a
              ? (c = t.width)
              : "inner" !== a && ((c = t.width / 2), (d = e.width / 2)),
              (this.paddingLeft = Math.max(
                ((c - r + n) * this.width) / (this.width - r),
                0
              )),
              (this.paddingRight = Math.max(
                ((d - h + n) * this.width) / (this.width - h),
                0
              ));
          } else {
            let i = e.height / 2,
              s = t.height / 2;
            "start" === a
              ? ((i = 0), (s = t.height))
              : "end" === a && ((i = e.height), (s = 0)),
              (this.paddingTop = i + n),
              (this.paddingBottom = s + n);
          }
        }
        _handleMargins() {
          this._margins &&
            ((this._margins.left = Math.max(
              this.paddingLeft,
              this._margins.left
            )),
            (this._margins.top = Math.max(this.paddingTop, this._margins.top)),
            (this._margins.right = Math.max(
              this.paddingRight,
              this._margins.right
            )),
            (this._margins.bottom = Math.max(
              this.paddingBottom,
              this._margins.bottom
            )));
        }
        afterFit() {
          (0, s.Q)(this.options.afterFit, [this]);
        }
        isHorizontal() {
          let { axis: t, position: e } = this.options;
          return "top" === e || "bottom" === e || "x" === t;
        }
        isFullSize() {
          return this.options.fullSize;
        }
        _convertTicksToLabels(t) {
          let e, i;
          for (
            this.beforeTickToLabelConversion(),
              this.generateTickLabels(t),
              e = 0,
              i = t.length;
            e < i;
            e++
          )
            (0, s.k)(t[e].label) && (t.splice(e, 1), i--, e--);
          this.afterTickToLabelConversion();
        }
        _getLabelSizes() {
          let t = this._labelSizes;
          if (!t) {
            let e = this.options.ticks.sampleSize,
              i = this.ticks;
            e < i.length && (i = sample(i, e)),
              (this._labelSizes = t =
                this._computeLabelSizes(
                  i,
                  i.length,
                  this.options.ticks.maxTicksLimit
                ));
          }
          return t;
        }
        _computeLabelSizes(t, e, i) {
          let a,
            n,
            r,
            o,
            l,
            h,
            c,
            d,
            u,
            g,
            p,
            { ctx: m, _longestTextCache: b } = this,
            x = [],
            _ = [],
            y = Math.floor(e / getTicksLimit(e, i)),
            v = 0,
            k = 0;
          for (a = 0; a < e; a += y) {
            if (
              ((o = t[a].label),
              (m.font = h = (l = this._resolveTickFontOptions(a)).string),
              (c = b[h] = b[h] || { data: {}, gc: [] }),
              (d = l.lineHeight),
              (u = g = 0),
              (0, s.k)(o) || (0, s.b)(o))
            ) {
              if ((0, s.b)(o))
                for (n = 0, r = o.length; n < r; ++n)
                  (p = o[n]),
                    (0, s.k)(p) ||
                      (0, s.b)(p) ||
                      ((u = (0, s.V)(m, c.data, c.gc, u, p)), (g += d));
            } else (u = (0, s.V)(m, c.data, c.gc, u, o)), (g = d);
            x.push(u), _.push(g), (v = Math.max(u, v)), (k = Math.max(g, k));
          }
          garbageCollect(b, e);
          let M = x.indexOf(v),
            S = _.indexOf(k),
            valueAt = (t) => ({ width: x[t] || 0, height: _[t] || 0 });
          return {
            first: valueAt(0),
            last: valueAt(e - 1),
            widest: valueAt(M),
            highest: valueAt(S),
            widths: x,
            heights: _,
          };
        }
        getLabelForValue(t) {
          return t;
        }
        getPixelForValue(t, e) {
          return NaN;
        }
        getValueForPixel(t) {}
        getPixelForTick(t) {
          let e = this.ticks;
          return t < 0 || t > e.length - 1
            ? null
            : this.getPixelForValue(e[t].value);
        }
        getPixelForDecimal(t) {
          this._reversePixels && (t = 1 - t);
          let e = this._startPixel + t * this._length;
          return (0, s.W)(this._alignToPixels ? (0, s.X)(this.chart, e, 0) : e);
        }
        getDecimalForPixel(t) {
          let e = (t - this._startPixel) / this._length;
          return this._reversePixels ? 1 - e : e;
        }
        getBasePixel() {
          return this.getPixelForValue(this.getBaseValue());
        }
        getBaseValue() {
          let { min: t, max: e } = this;
          return t < 0 && e < 0 ? e : t > 0 && e > 0 ? t : 0;
        }
        getContext(t) {
          let e = this.ticks || [];
          if (t >= 0 && t < e.length) {
            let i = e[t];
            return (
              i.$context ||
              (i.$context = createTickContext(this.getContext(), t, i))
            );
          }
          return (
            this.$context ||
            (this.$context = createScaleContext(this.chart.getContext(), this))
          );
        }
        _tickSize() {
          let t = this.options.ticks,
            e = (0, s.t)(this.labelRotation),
            i = Math.abs(Math.cos(e)),
            a = Math.abs(Math.sin(e)),
            n = this._getLabelSizes(),
            r = t.autoSkipPadding || 0,
            o = n ? n.widest.width + r : 0,
            l = n ? n.highest.height + r : 0;
          return this.isHorizontal()
            ? l * i > o * a
              ? o / i
              : l / a
            : l * a < o * i
            ? l / i
            : o / a;
        }
        _isVisible() {
          let t = this.options.display;
          return "auto" !== t ? !!t : this.getMatchingVisibleMetas().length > 0;
        }
        _computeGridLineItems(t) {
          let e,
            i,
            a,
            n,
            r,
            o,
            l,
            h,
            c,
            d,
            u,
            g,
            p = this.axis,
            m = this.chart,
            b = this.options,
            { grid: x, position: _, border: y } = b,
            v = x.offset,
            k = this.isHorizontal(),
            M = this.ticks.length + +!!v,
            S = getTickMarkLength(x),
            w = [],
            P = y.setContext(this.getContext()),
            C = P.display ? P.width : 0,
            D = C / 2,
            alignBorderValue = function (t) {
              return (0, s.X)(m, t, C);
            };
          if ("top" === _)
            (e = alignBorderValue(this.bottom)),
              (o = this.bottom - S),
              (h = e - D),
              (d = alignBorderValue(t.top) + D),
              (g = t.bottom);
          else if ("bottom" === _)
            (e = alignBorderValue(this.top)),
              (d = t.top),
              (g = alignBorderValue(t.bottom) - D),
              (o = e + D),
              (h = this.top + S);
          else if ("left" === _)
            (e = alignBorderValue(this.right)),
              (r = this.right - S),
              (l = e - D),
              (c = alignBorderValue(t.left) + D),
              (u = t.right);
          else if ("right" === _)
            (e = alignBorderValue(this.left)),
              (c = t.left),
              (u = alignBorderValue(t.right) - D),
              (r = e + D),
              (l = this.left + S);
          else if ("x" === p) {
            if ("center" === _)
              e = alignBorderValue((t.top + t.bottom) / 2 + 0.5);
            else if ((0, s.i)(_)) {
              let t = Object.keys(_)[0],
                i = _[t];
              e = alignBorderValue(this.chart.scales[t].getPixelForValue(i));
            }
            (d = t.top), (g = t.bottom), (h = (o = e + D) + S);
          } else if ("y" === p) {
            if ("center" === _) e = alignBorderValue((t.left + t.right) / 2);
            else if ((0, s.i)(_)) {
              let t = Object.keys(_)[0],
                i = _[t];
              e = alignBorderValue(this.chart.scales[t].getPixelForValue(i));
            }
            (l = (r = e - D) - S), (c = t.left), (u = t.right);
          }
          let O = (0, s.v)(b.ticks.maxTicksLimit, M),
            A = Math.max(1, Math.ceil(M / O));
          for (i = 0; i < M; i += A) {
            let t = this.getContext(i),
              e = x.setContext(t),
              p = y.setContext(t),
              b = e.lineWidth,
              _ = e.color,
              M = p.dash || [],
              S = p.dashOffset,
              P = e.tickWidth,
              C = e.tickColor,
              D = e.tickBorderDash || [],
              O = e.tickBorderDashOffset;
            void 0 !== (a = getPixelForGridLine(this, i, v)) &&
              ((n = (0, s.X)(m, a, b)),
              k ? (r = l = c = u = n) : (o = h = d = g = n),
              w.push({
                tx1: r,
                ty1: o,
                tx2: l,
                ty2: h,
                x1: c,
                y1: d,
                x2: u,
                y2: g,
                width: b,
                color: _,
                borderDash: M,
                borderDashOffset: S,
                tickWidth: P,
                tickColor: C,
                tickBorderDash: D,
                tickBorderDashOffset: O,
              }));
          }
          return (this._ticksLength = M), (this._borderValue = e), w;
        }
        _computeLabelItems(t) {
          let e,
            i,
            a,
            n,
            r,
            o,
            l,
            h,
            c,
            d,
            u,
            g = this.axis,
            p = this.options,
            { position: m, ticks: b } = p,
            x = this.isHorizontal(),
            _ = this.ticks,
            { align: y, crossAlign: v, padding: k, mirror: M } = b,
            S = getTickMarkLength(p.grid),
            w = S + k,
            P = M ? -k : w,
            C = -(0, s.t)(this.labelRotation),
            D = [],
            O = "middle";
          if ("top" === m)
            (r = this.bottom - P), (o = this._getXAxisLabelAlignment());
          else if ("bottom" === m)
            (r = this.top + P), (o = this._getXAxisLabelAlignment());
          else if ("left" === m) {
            let t = this._getYAxisLabelAlignment(S);
            (o = t.textAlign), (n = t.x);
          } else if ("right" === m) {
            let t = this._getYAxisLabelAlignment(S);
            (o = t.textAlign), (n = t.x);
          } else if ("x" === g) {
            if ("center" === m) r = (t.top + t.bottom) / 2 + w;
            else if ((0, s.i)(m)) {
              let t = Object.keys(m)[0],
                e = m[t];
              r = this.chart.scales[t].getPixelForValue(e) + w;
            }
            o = this._getXAxisLabelAlignment();
          } else if ("y" === g) {
            if ("center" === m) n = (t.left + t.right) / 2 - w;
            else if ((0, s.i)(m)) {
              let t = Object.keys(m)[0],
                e = m[t];
              n = this.chart.scales[t].getPixelForValue(e);
            }
            o = this._getYAxisLabelAlignment(S).textAlign;
          }
          "y" === g &&
            ("start" === y ? (O = "top") : "end" === y && (O = "bottom"));
          let A = this._getLabelSizes();
          for (e = 0, i = _.length; e < i; ++e) {
            let t;
            a = _[e].label;
            let g = b.setContext(this.getContext(e));
            (l = this.getPixelForTick(e) + b.labelOffset),
              (c = (h = this._resolveTickFontOptions(e)).lineHeight);
            let p = (d = (0, s.b)(a) ? a.length : 1) / 2,
              y = g.color,
              k = g.textStrokeColor,
              S = g.textStrokeWidth,
              w = o;
            if (
              (x
                ? ((n = l),
                  "inner" === o &&
                    (w =
                      e === i - 1
                        ? this.options.reverse
                          ? "left"
                          : "right"
                        : 0 === e
                        ? this.options.reverse
                          ? "right"
                          : "left"
                        : "center"),
                  (u =
                    "top" === m
                      ? "near" === v || 0 !== C
                        ? -d * c + c / 2
                        : "center" === v
                        ? -A.highest.height / 2 - p * c + c
                        : -A.highest.height + c / 2
                      : "near" === v || 0 !== C
                      ? c / 2
                      : "center" === v
                      ? A.highest.height / 2 - p * c
                      : A.highest.height - d * c),
                  M && (u *= -1),
                  0 === C ||
                    g.showLabelBackdrop ||
                    (n += (c / 2) * Math.sin(C)))
                : ((r = l), (u = ((1 - d) * c) / 2)),
              g.showLabelBackdrop)
            ) {
              let a = (0, s.E)(g.backdropPadding),
                n = A.heights[e],
                r = A.widths[e],
                l = u - a.top,
                h = 0 - a.left;
              switch (O) {
                case "middle":
                  l -= n / 2;
                  break;
                case "bottom":
                  l -= n;
              }
              switch (o) {
                case "center":
                  h -= r / 2;
                  break;
                case "right":
                  h -= r;
                  break;
                case "inner":
                  e === i - 1 ? (h -= r) : e > 0 && (h -= r / 2);
              }
              t = {
                left: h,
                top: l,
                width: r + a.width,
                height: n + a.height,
                color: g.backdropColor,
              };
            }
            D.push({
              label: a,
              font: h,
              textOffset: u,
              options: {
                rotation: C,
                color: y,
                strokeColor: k,
                strokeWidth: S,
                textAlign: w,
                textBaseline: O,
                translation: [n, r],
                backdrop: t,
              },
            });
          }
          return D;
        }
        _getXAxisLabelAlignment() {
          let { position: t, ticks: e } = this.options;
          if (-(0, s.t)(this.labelRotation))
            return "top" === t ? "left" : "right";
          let i = "center";
          return (
            "start" === e.align
              ? (i = "left")
              : "end" === e.align
              ? (i = "right")
              : "inner" === e.align && (i = "inner"),
            i
          );
        }
        _getYAxisLabelAlignment(t) {
          let e,
            i,
            {
              position: s,
              ticks: { crossAlign: a, mirror: n, padding: r },
            } = this.options,
            o = this._getLabelSizes(),
            l = t + r,
            h = o.widest.width;
          return (
            "left" === s
              ? n
                ? ((i = this.right + r),
                  "near" === a
                    ? (e = "left")
                    : "center" === a
                    ? ((e = "center"), (i += h / 2))
                    : ((e = "right"), (i += h)))
                : ((i = this.right - l),
                  "near" === a
                    ? (e = "right")
                    : "center" === a
                    ? ((e = "center"), (i -= h / 2))
                    : ((e = "left"), (i = this.left)))
              : "right" === s
              ? n
                ? ((i = this.left + r),
                  "near" === a
                    ? (e = "right")
                    : "center" === a
                    ? ((e = "center"), (i -= h / 2))
                    : ((e = "left"), (i -= h)))
                : ((i = this.left + l),
                  "near" === a
                    ? (e = "left")
                    : "center" === a
                    ? ((e = "center"), (i += h / 2))
                    : ((e = "right"), (i = this.right)))
              : (e = "right"),
            { textAlign: e, x: i }
          );
        }
        _computeLabelArea() {
          if (this.options.ticks.mirror) return;
          let t = this.chart,
            e = this.options.position;
          return "left" === e || "right" === e
            ? { top: 0, left: this.left, bottom: t.height, right: this.right }
            : "top" === e || "bottom" === e
            ? { top: this.top, left: 0, bottom: this.bottom, right: t.width }
            : void 0;
        }
        drawBackground() {
          let {
            ctx: t,
            options: { backgroundColor: e },
            left: i,
            top: s,
            width: a,
            height: n,
          } = this;
          e &&
            (t.save(), (t.fillStyle = e), t.fillRect(i, s, a, n), t.restore());
        }
        getLineWidthForValue(t) {
          let e = this.options.grid;
          if (!this._isVisible() || !e.display) return 0;
          let i = this.ticks.findIndex((e) => e.value === t);
          return i >= 0 ? e.setContext(this.getContext(i)).lineWidth : 0;
        }
        drawGrid(t) {
          let e,
            i,
            s = this.options.grid,
            a = this.ctx,
            n =
              this._gridLineItems ||
              (this._gridLineItems = this._computeGridLineItems(t)),
            drawLine = (t, e, i) => {
              i.width &&
                i.color &&
                (a.save(),
                (a.lineWidth = i.width),
                (a.strokeStyle = i.color),
                a.setLineDash(i.borderDash || []),
                (a.lineDashOffset = i.borderDashOffset),
                a.beginPath(),
                a.moveTo(t.x, t.y),
                a.lineTo(e.x, e.y),
                a.stroke(),
                a.restore());
            };
          if (s.display)
            for (e = 0, i = n.length; e < i; ++e) {
              let t = n[e];
              s.drawOnChartArea &&
                drawLine({ x: t.x1, y: t.y1 }, { x: t.x2, y: t.y2 }, t),
                s.drawTicks &&
                  drawLine(
                    { x: t.tx1, y: t.ty1 },
                    { x: t.tx2, y: t.ty2 },
                    {
                      color: t.tickColor,
                      width: t.tickWidth,
                      borderDash: t.tickBorderDash,
                      borderDashOffset: t.tickBorderDashOffset,
                    }
                  );
            }
        }
        drawBorder() {
          let t,
            e,
            i,
            a,
            {
              chart: n,
              ctx: r,
              options: { border: o, grid: l },
            } = this,
            h = o.setContext(this.getContext()),
            c = o.display ? h.width : 0;
          if (!c) return;
          let d = l.setContext(this.getContext(0)).lineWidth,
            u = this._borderValue;
          this.isHorizontal()
            ? ((t = (0, s.X)(n, this.left, c) - c / 2),
              (e = (0, s.X)(n, this.right, d) + d / 2),
              (i = a = u))
            : ((i = (0, s.X)(n, this.top, c) - c / 2),
              (a = (0, s.X)(n, this.bottom, d) + d / 2),
              (t = e = u)),
            r.save(),
            (r.lineWidth = h.width),
            (r.strokeStyle = h.color),
            r.beginPath(),
            r.moveTo(t, i),
            r.lineTo(e, a),
            r.stroke(),
            r.restore();
        }
        drawLabels(t) {
          if (!this.options.ticks.display) return;
          let e = this.ctx,
            i = this._computeLabelArea();
          for (let a of (i && (0, s.Y)(e, i), this.getLabelItems(t))) {
            let t = a.options,
              i = a.font,
              n = a.label,
              r = a.textOffset;
            (0, s.Z)(e, n, 0, r, i, t);
          }
          i && (0, s.$)(e);
        }
        drawTitle() {
          let {
            ctx: t,
            options: { position: e, title: i, reverse: a },
          } = this;
          if (!i.display) return;
          let n = (0, s.a0)(i.font),
            r = (0, s.E)(i.padding),
            o = i.align,
            l = n.lineHeight / 2;
          "bottom" === e || "center" === e || (0, s.i)(e)
            ? ((l += r.bottom),
              (0, s.b)(i.text) && (l += n.lineHeight * (i.text.length - 1)))
            : (l += r.top);
          let {
            titleX: h,
            titleY: c,
            maxWidth: d,
            rotation: u,
          } = titleArgs(this, l, e, o);
          (0, s.Z)(t, i.text, 0, 0, n, {
            color: i.color,
            maxWidth: d,
            rotation: u,
            textAlign: titleAlign(o, e, a),
            textBaseline: "middle",
            translation: [h, c],
          });
        }
        draw(t) {
          this._isVisible() &&
            (this.drawBackground(),
            this.drawGrid(t),
            this.drawBorder(),
            this.drawTitle(),
            this.drawLabels(t));
        }
        _layers() {
          let t = this.options,
            e = (t.ticks && t.ticks.z) || 0,
            i = (0, s.v)(t.grid && t.grid.z, -1),
            a = (0, s.v)(t.border && t.border.z, 0);
          return this._isVisible() && this.draw === Scale.prototype.draw
            ? [
                {
                  z: i,
                  draw: (t) => {
                    this.drawBackground(), this.drawGrid(t), this.drawTitle();
                  },
                },
                {
                  z: a,
                  draw: () => {
                    this.drawBorder();
                  },
                },
                {
                  z: e,
                  draw: (t) => {
                    this.drawLabels(t);
                  },
                },
              ]
            : [
                {
                  z: e,
                  draw: (t) => {
                    this.draw(t);
                  },
                },
              ];
        }
        getMatchingVisibleMetas(t) {
          let e,
            i,
            s = this.chart.getSortedVisibleDatasetMetas(),
            a = this.axis + "AxisID",
            n = [];
          for (e = 0, i = s.length; e < i; ++e) {
            let i = s[e];
            i[a] !== this.id || (t && i.type !== t) || n.push(i);
          }
          return n;
        }
        _resolveTickFontOptions(t) {
          let e = this.options.ticks.setContext(this.getContext(t));
          return (0, s.a0)(e.font);
        }
        _maxDigits() {
          let t = this._resolveTickFontOptions(0).lineHeight;
          return (this.isHorizontal() ? this.width : this.height) / t;
        }
      };
      let TypedRegistry = class TypedRegistry {
        constructor(t, e, i) {
          (this.type = t),
            (this.scope = e),
            (this.override = i),
            (this.items = Object.create(null));
        }
        isForType(t) {
          return Object.prototype.isPrototypeOf.call(
            this.type.prototype,
            t.prototype
          );
        }
        register(t) {
          let e,
            i = Object.getPrototypeOf(t);
          isIChartComponent(i) && (e = this.register(i));
          let a = this.items,
            n = t.id,
            r = this.scope + "." + n;
          if (!n) throw Error("class does not have id: " + t);
          return (
            n in a ||
              ((a[n] = t),
              registerDefaults(t, r, e),
              this.override && s.d.override(t.id, t.overrides)),
            r
          );
        }
        get(t) {
          return this.items[t];
        }
        unregister(t) {
          let e = this.items,
            i = t.id,
            a = this.scope;
          i in e && delete e[i],
            a &&
              i in s.d[a] &&
              (delete s.d[a][i], this.override && delete s.a3[i]);
        }
      };
      function registerDefaults(t, e, i) {
        let a = (0, s.a4)(Object.create(null), [
          i ? s.d.get(i) : {},
          s.d.get(e),
          t.defaults,
        ]);
        s.d.set(e, a),
          t.defaultRoutes && routeDefaults(e, t.defaultRoutes),
          t.descriptors && s.d.describe(e, t.descriptors);
      }
      function routeDefaults(t, e) {
        Object.keys(e).forEach((i) => {
          let a = i.split("."),
            n = a.pop(),
            r = [t].concat(a).join("."),
            o = e[i].split("."),
            l = o.pop(),
            h = o.join(".");
          s.d.route(r, n, h, l);
        });
      }
      function isIChartComponent(t) {
        return "id" in t && "defaults" in t;
      }
      let Registry = class Registry {
        constructor() {
          (this.controllers = new TypedRegistry(
            DatasetController,
            "datasets",
            !0
          )),
            (this.elements = new TypedRegistry(Element, "elements")),
            (this.plugins = new TypedRegistry(Object, "plugins")),
            (this.scales = new TypedRegistry(Scale, "scales")),
            (this._typedRegistries = [
              this.controllers,
              this.scales,
              this.elements,
            ]);
        }
        add(...t) {
          this._each("register", t);
        }
        remove(...t) {
          this._each("unregister", t);
        }
        addControllers(...t) {
          this._each("register", t, this.controllers);
        }
        addElements(...t) {
          this._each("register", t, this.elements);
        }
        addPlugins(...t) {
          this._each("register", t, this.plugins);
        }
        addScales(...t) {
          this._each("register", t, this.scales);
        }
        getController(t) {
          return this._get(t, this.controllers, "controller");
        }
        getElement(t) {
          return this._get(t, this.elements, "element");
        }
        getPlugin(t) {
          return this._get(t, this.plugins, "plugin");
        }
        getScale(t) {
          return this._get(t, this.scales, "scale");
        }
        removeControllers(...t) {
          this._each("unregister", t, this.controllers);
        }
        removeElements(...t) {
          this._each("unregister", t, this.elements);
        }
        removePlugins(...t) {
          this._each("unregister", t, this.plugins);
        }
        removeScales(...t) {
          this._each("unregister", t, this.scales);
        }
        _each(t, e, i) {
          [...e].forEach((e) => {
            let a = i || this._getRegistryForType(e);
            i || a.isForType(e) || (a === this.plugins && e.id)
              ? this._exec(t, a, e)
              : (0, s.F)(e, (e) => {
                  let s = i || this._getRegistryForType(e);
                  this._exec(t, s, e);
                });
          });
        }
        _exec(t, e, i) {
          let a = (0, s.a5)(t);
          (0, s.Q)(i["before" + a], [], i),
            e[t](i),
            (0, s.Q)(i["after" + a], [], i);
        }
        _getRegistryForType(t) {
          for (let e = 0; e < this._typedRegistries.length; e++) {
            let i = this._typedRegistries[e];
            if (i.isForType(t)) return i;
          }
          return this.plugins;
        }
        _get(t, e, i) {
          let s = e.get(t);
          if (void 0 === s)
            throw Error('"' + t + '" is not a registered ' + i + ".");
          return s;
        }
      };
      var m = new Registry();
      let PluginService = class PluginService {
        constructor() {
          this._init = [];
        }
        notify(t, e, i, s) {
          "beforeInit" === e &&
            ((this._init = this._createDescriptors(t, !0)),
            this._notify(this._init, t, "install"));
          let a = s ? this._descriptors(t).filter(s) : this._descriptors(t),
            n = this._notify(a, t, e, i);
          return (
            "afterDestroy" === e &&
              (this._notify(a, t, "stop"),
              this._notify(this._init, t, "uninstall")),
            n
          );
        }
        _notify(t, e, i, a) {
          for (let n of ((a = a || {}), t)) {
            let t = n.plugin,
              r = t[i],
              o = [e, a, n.options];
            if (!1 === (0, s.Q)(r, o, t) && a.cancelable) return !1;
          }
          return !0;
        }
        invalidate() {
          (0, s.k)(this._cache) ||
            ((this._oldCache = this._cache), (this._cache = void 0));
        }
        _descriptors(t) {
          if (this._cache) return this._cache;
          let e = (this._cache = this._createDescriptors(t));
          return this._notifyStateChanges(t), e;
        }
        _createDescriptors(t, e) {
          let i = t && t.config,
            a = (0, s.v)(i.options && i.options.plugins, {}),
            n = allPlugins(i);
          return !1 !== a || e ? createDescriptors(t, n, a, e) : [];
        }
        _notifyStateChanges(t) {
          let e = this._oldCache || [],
            i = this._cache,
            diff = (t, e) =>
              t.filter((t) => !e.some((e) => t.plugin.id === e.plugin.id));
          this._notify(diff(e, i), t, "stop"),
            this._notify(diff(i, e), t, "start");
        }
      };
      function allPlugins(t) {
        let e = {},
          i = [],
          s = Object.keys(m.plugins.items);
        for (let t = 0; t < s.length; t++) i.push(m.getPlugin(s[t]));
        let a = t.plugins || [];
        for (let t = 0; t < a.length; t++) {
          let s = a[t];
          -1 === i.indexOf(s) && (i.push(s), (e[s.id] = !0));
        }
        return { plugins: i, localIds: e };
      }
      function getOpts(t, e) {
        return e || !1 !== t ? (!0 === t ? {} : t) : null;
      }
      function createDescriptors(t, { plugins: e, localIds: i }, s, a) {
        let n = [],
          r = t.getContext();
        for (let o of e) {
          let e = o.id,
            l = getOpts(s[e], a);
          null !== l &&
            n.push({
              plugin: o,
              options: pluginOpts(t.config, { plugin: o, local: i[e] }, l, r),
            });
        }
        return n;
      }
      function pluginOpts(t, { plugin: e, local: i }, s, a) {
        let n = t.pluginScopeKeys(e),
          r = t.getOptionScopes(s, n);
        return (
          i && e.defaults && r.push(e.defaults),
          t.createResolver(r, a, [""], {
            scriptable: !1,
            indexable: !1,
            allKeys: !0,
          })
        );
      }
      function getIndexAxis(t, e) {
        let i = s.d.datasets[t] || {};
        return (
          ((e.datasets || {})[t] || {}).indexAxis ||
          e.indexAxis ||
          i.indexAxis ||
          "x"
        );
      }
      function getAxisFromDefaultScaleID(t, e) {
        let i = t;
        return (
          "_index_" === t
            ? (i = e)
            : "_value_" === t && (i = "x" === e ? "y" : "x"),
          i
        );
      }
      function getDefaultScaleIDFromAxis(t, e) {
        return t === e ? "_index_" : "_value_";
      }
      function idMatchesAxis(t) {
        if ("x" === t || "y" === t || "r" === t) return t;
      }
      function axisFromPosition(t) {
        return "top" === t || "bottom" === t
          ? "x"
          : "left" === t || "right" === t
          ? "y"
          : void 0;
      }
      function determineAxis(t, ...e) {
        if (idMatchesAxis(t)) return t;
        for (let i of e) {
          let e =
            i.axis ||
            axisFromPosition(i.position) ||
            (t.length > 1 && idMatchesAxis(t[0].toLowerCase()));
          if (e) return e;
        }
        throw Error(
          `Cannot determine type of '${t}' axis. Please provide 'axis' or 'position' option.`
        );
      }
      function getAxisFromDataset(t, e, i) {
        if (i[e + "AxisID"] === t) return { axis: e };
      }
      function retrieveAxisFromDatasets(t, e) {
        if (e.data && e.data.datasets) {
          let i = e.data.datasets.filter(
            (e) => e.xAxisID === t || e.yAxisID === t
          );
          if (i.length)
            return (
              getAxisFromDataset(t, "x", i[0]) ||
              getAxisFromDataset(t, "y", i[0])
            );
        }
        return {};
      }
      function mergeScaleConfig(t, e) {
        let i = s.a3[t.type] || { scales: {} },
          a = e.scales || {},
          n = getIndexAxis(t.type, e),
          r = Object.create(null);
        return (
          Object.keys(a).forEach((e) => {
            let o = a[e];
            if (!(0, s.i)(o))
              return console.error(
                `Invalid scale configuration for scale: ${e}`
              );
            if (o._proxy)
              return console.warn(
                `Ignoring resolver passed as options for scale: ${e}`
              );
            let l = determineAxis(
                e,
                o,
                retrieveAxisFromDatasets(e, t),
                s.d.scales[o.type]
              ),
              h = getDefaultScaleIDFromAxis(l, n),
              c = i.scales || {};
            r[e] = (0, s.ab)(Object.create(null), [{ axis: l }, o, c[l], c[h]]);
          }),
          t.data.datasets.forEach((i) => {
            let n = i.type || t.type,
              o = i.indexAxis || getIndexAxis(n, e),
              l = (s.a3[n] || {}).scales || {};
            Object.keys(l).forEach((t) => {
              let e = getAxisFromDefaultScaleID(t, o),
                n = i[e + "AxisID"] || e;
              (r[n] = r[n] || Object.create(null)),
                (0, s.ab)(r[n], [{ axis: e }, a[n], l[t]]);
            });
          }),
          Object.keys(r).forEach((t) => {
            let e = r[t];
            (0, s.ab)(e, [s.d.scales[e.type], s.d.scale]);
          }),
          r
        );
      }
      function initOptions(t) {
        let e = t.options || (t.options = {});
        (e.plugins = (0, s.v)(e.plugins, {})),
          (e.scales = mergeScaleConfig(t, e));
      }
      function initData(t) {
        return (
          ((t = t || {}).datasets = t.datasets || []),
          (t.labels = t.labels || []),
          t
        );
      }
      function initConfig(t) {
        return ((t = t || {}).data = initData(t.data)), initOptions(t), t;
      }
      let b = new Map(),
        x = new Set();
      function cachedKeys(t, e) {
        let i = b.get(t);
        return i || ((i = e()), b.set(t, i), x.add(i)), i;
      }
      let addIfFound = (t, e, i) => {
        let a = (0, s.f)(e, i);
        void 0 !== a && t.add(a);
      };
      let Config = class Config {
        constructor(t) {
          (this._config = initConfig(t)),
            (this._scopeCache = new Map()),
            (this._resolverCache = new Map());
        }
        get platform() {
          return this._config.platform;
        }
        get type() {
          return this._config.type;
        }
        set type(t) {
          this._config.type = t;
        }
        get data() {
          return this._config.data;
        }
        set data(t) {
          this._config.data = initData(t);
        }
        get options() {
          return this._config.options;
        }
        set options(t) {
          this._config.options = t;
        }
        get plugins() {
          return this._config.plugins;
        }
        update() {
          let t = this._config;
          this.clearCache(), initOptions(t);
        }
        clearCache() {
          this._scopeCache.clear(), this._resolverCache.clear();
        }
        datasetScopeKeys(t) {
          return cachedKeys(t, () => [[`datasets.${t}`, ""]]);
        }
        datasetAnimationScopeKeys(t, e) {
          return cachedKeys(`${t}.transition.${e}`, () => [
            [`datasets.${t}.transitions.${e}`, `transitions.${e}`],
            [`datasets.${t}`, ""],
          ]);
        }
        datasetElementScopeKeys(t, e) {
          return cachedKeys(`${t}-${e}`, () => [
            [
              `datasets.${t}.elements.${e}`,
              `datasets.${t}`,
              `elements.${e}`,
              "",
            ],
          ]);
        }
        pluginScopeKeys(t) {
          let e = t.id,
            i = this.type;
          return cachedKeys(`${i}-plugin-${e}`, () => [
            [`plugins.${e}`, ...(t.additionalOptionScopes || [])],
          ]);
        }
        _cachedScopes(t, e) {
          let i = this._scopeCache,
            s = i.get(t);
          return (!s || e) && ((s = new Map()), i.set(t, s)), s;
        }
        getOptionScopes(t, e, i) {
          let { options: a, type: n } = this,
            r = this._cachedScopes(t, i),
            o = r.get(e);
          if (o) return o;
          let l = new Set();
          e.forEach((e) => {
            t && (l.add(t), e.forEach((e) => addIfFound(l, t, e))),
              e.forEach((t) => addIfFound(l, a, t)),
              e.forEach((t) => addIfFound(l, s.a3[n] || {}, t)),
              e.forEach((t) => addIfFound(l, s.d, t)),
              e.forEach((t) => addIfFound(l, s.a6, t));
          });
          let h = Array.from(l);
          return (
            0 === h.length && h.push(Object.create(null)),
            x.has(e) && r.set(e, h),
            h
          );
        }
        chartOptionScopes() {
          let { options: t, type: e } = this;
          return [
            t,
            s.a3[e] || {},
            s.d.datasets[e] || {},
            { type: e },
            s.d,
            s.a6,
          ];
        }
        resolveNamedOptions(t, e, i, a = [""]) {
          let n = { $shared: !0 },
            { resolver: r, subPrefixes: o } = getResolver(
              this._resolverCache,
              t,
              a
            ),
            l = r;
          if (needContext(r, e)) {
            (n.$shared = !1), (i = (0, s.a7)(i) ? i() : i);
            let e = this.createResolver(t, i, o);
            l = (0, s.a8)(r, i, e);
          }
          for (let t of e) n[t] = l[t];
          return n;
        }
        createResolver(t, e, i = [""], a) {
          let { resolver: n } = getResolver(this._resolverCache, t, i);
          return (0, s.i)(e) ? (0, s.a8)(n, e, void 0, a) : n;
        }
      };
      function getResolver(t, e, i) {
        let a = t.get(e);
        a || ((a = new Map()), t.set(e, a));
        let n = i.join(),
          r = a.get(n);
        return (
          r ||
            ((r = {
              resolver: (0, s.a9)(e, i),
              subPrefixes: i.filter((t) => !t.toLowerCase().includes("hover")),
            }),
            a.set(n, r)),
          r
        );
      }
      let hasFunction = (t) =>
        (0, s.i)(t) &&
        Object.getOwnPropertyNames(t).some((e) => (0, s.a7)(t[e]));
      function needContext(t, e) {
        let { isScriptable: i, isIndexable: a } = (0, s.aa)(t);
        for (let n of e) {
          let e = i(n),
            r = a(n),
            o = (r || e) && t[n];
          if ((e && ((0, s.a7)(o) || hasFunction(o))) || (r && (0, s.b)(o)))
            return !0;
        }
        return !1;
      }
      let _ = ["top", "bottom", "left", "right", "chartArea"];
      function positionIsHorizontal(t, e) {
        return (
          "top" === t || "bottom" === t || (-1 === _.indexOf(t) && "x" === e)
        );
      }
      function compare2Level(t, e) {
        return function (i, s) {
          return i[t] === s[t] ? i[e] - s[e] : i[t] - s[t];
        };
      }
      function onAnimationsComplete(t) {
        let e = t.chart,
          i = e.options.animation;
        e.notifyPlugins("afterRender"), (0, s.Q)(i && i.onComplete, [t], e);
      }
      function onAnimationProgress(t) {
        let e = t.chart,
          i = e.options.animation;
        (0, s.Q)(i && i.onProgress, [t], e);
      }
      function getCanvas(t) {
        return (
          (0, s.M)() && "string" == typeof t
            ? (t = document.getElementById(t))
            : t && t.length && (t = t[0]),
          t && t.canvas && (t = t.canvas),
          t
        );
      }
      let y = {},
        getChart = (t) => {
          let e = getCanvas(t);
          return Object.values(y)
            .filter((t) => t.canvas === e)
            .pop();
        };
      function moveNumericKeys(t, e, i) {
        for (let s of Object.keys(t)) {
          let a = +s;
          if (a >= e) {
            let n = t[s];
            delete t[s], (i > 0 || a > e) && (t[a + i] = n);
          }
        }
      }
      function determineLastEvent(t, e, i, s) {
        return i && "mouseout" !== t.type ? (s ? e : t) : null;
      }
      function getSizeForArea(t, e, i) {
        return t.options.clip ? t[i] : e[i];
      }
      function getDatasetArea(t, e) {
        let { xScale: i, yScale: s } = t;
        return i && s
          ? {
              left: getSizeForArea(i, e, "left"),
              right: getSizeForArea(i, e, "right"),
              top: getSizeForArea(s, e, "top"),
              bottom: getSizeForArea(s, e, "bottom"),
            }
          : e;
      }
      let Chart = class Chart {
        static defaults = s.d;
        static instances = y;
        static overrides = s.a3;
        static registry = m;
        static version = "4.4.8";
        static getChart = getChart;
        static register(...t) {
          m.add(...t), invalidatePlugins();
        }
        static unregister(...t) {
          m.remove(...t), invalidatePlugins();
        }
        constructor(t, e) {
          let i = (this.config = new Config(e)),
            n = getCanvas(t),
            r = getChart(n);
          if (r)
            throw Error(
              "Canvas is already in use. Chart with ID '" +
                r.id +
                "' must be destroyed before the canvas with ID '" +
                r.canvas.id +
                "' can be reused."
            );
          let o = i.createResolver(i.chartOptionScopes(), this.getContext());
          (this.platform = new (i.platform || _detectPlatform(n))()),
            this.platform.updateConfig(i);
          let l = this.platform.acquireContext(n, o.aspectRatio),
            h = l && l.canvas,
            c = h && h.height,
            d = h && h.width;
          if (
            ((this.id = (0, s.ac)()),
            (this.ctx = l),
            (this.canvas = h),
            (this.width = d),
            (this.height = c),
            (this._options = o),
            (this._aspectRatio = this.aspectRatio),
            (this._layers = []),
            (this._metasets = []),
            (this._stacks = void 0),
            (this.boxes = []),
            (this.currentDevicePixelRatio = void 0),
            (this.chartArea = void 0),
            (this._active = []),
            (this._lastEvent = void 0),
            (this._listeners = {}),
            (this._responsiveListeners = void 0),
            (this._sortedMetasets = []),
            (this.scales = {}),
            (this._plugins = new PluginService()),
            (this.$proxies = {}),
            (this._hiddenIndices = {}),
            (this.attached = !1),
            (this._animationsDisabled = void 0),
            (this.$context = void 0),
            (this._doResize = (0, s.ad)(
              (t) => this.update(t),
              o.resizeDelay || 0
            )),
            (this._dataChanges = []),
            (y[this.id] = this),
            !l || !h)
          )
            return void console.error(
              "Failed to create chart: can't acquire context from the given item"
            );
          a.listen(this, "complete", onAnimationsComplete),
            a.listen(this, "progress", onAnimationProgress),
            this._initialize(),
            this.attached && this.update();
        }
        get aspectRatio() {
          let {
            options: { aspectRatio: t, maintainAspectRatio: e },
            width: i,
            height: a,
            _aspectRatio: n,
          } = this;
          return (0, s.k)(t) ? (e && n ? n : a ? i / a : null) : t;
        }
        get data() {
          return this.config.data;
        }
        set data(t) {
          this.config.data = t;
        }
        get options() {
          return this._options;
        }
        set options(t) {
          this.config.options = t;
        }
        get registry() {
          return m;
        }
        _initialize() {
          return (
            this.notifyPlugins("beforeInit"),
            this.options.responsive
              ? this.resize()
              : (0, s.ae)(this, this.options.devicePixelRatio),
            this.bindEvents(),
            this.notifyPlugins("afterInit"),
            this
          );
        }
        clear() {
          return (0, s.af)(this.canvas, this.ctx), this;
        }
        stop() {
          return a.stop(this), this;
        }
        resize(t, e) {
          a.running(this)
            ? (this._resizeBeforeDraw = { width: t, height: e })
            : this._resize(t, e);
        }
        _resize(t, e) {
          let i = this.options,
            a = this.canvas,
            n = i.maintainAspectRatio && this.aspectRatio,
            r = this.platform.getMaximumSize(a, t, e, n),
            o = i.devicePixelRatio || this.platform.getDevicePixelRatio(),
            l = this.width ? "resize" : "attach";
          (this.width = r.width),
            (this.height = r.height),
            (this._aspectRatio = this.aspectRatio),
            (0, s.ae)(this, o, !0) &&
              (this.notifyPlugins("resize", { size: r }),
              (0, s.Q)(i.onResize, [this, r], this),
              this.attached && this._doResize(l) && this.render());
        }
        ensureScalesHaveIDs() {
          let t = this.options.scales || {};
          (0, s.F)(t, (t, e) => {
            t.id = e;
          });
        }
        buildOrUpdateScales() {
          let t = this.options,
            e = t.scales,
            i = this.scales,
            a = Object.keys(i).reduce((t, e) => ((t[e] = !1), t), {}),
            n = [];
          e &&
            (n = n.concat(
              Object.keys(e).map((t) => {
                let i = e[t],
                  s = determineAxis(t, i),
                  a = "r" === s,
                  n = "x" === s;
                return {
                  options: i,
                  dposition: a ? "chartArea" : n ? "bottom" : "left",
                  dtype: a ? "radialLinear" : n ? "category" : "linear",
                };
              })
            )),
            (0, s.F)(n, (e) => {
              let n = e.options,
                r = n.id,
                o = determineAxis(r, n),
                l = (0, s.v)(n.type, e.dtype);
              (void 0 === n.position ||
                positionIsHorizontal(n.position, o) !==
                  positionIsHorizontal(e.dposition)) &&
                (n.position = e.dposition),
                (a[r] = !0);
              let h = null;
              r in i && i[r].type === l
                ? (h = i[r])
                : (i[
                    (h = new (m.getScale(l))({
                      id: r,
                      type: l,
                      ctx: this.ctx,
                      chart: this,
                    })).id
                  ] = h),
                h.init(n, t);
            }),
            (0, s.F)(a, (t, e) => {
              t || delete i[e];
            }),
            (0, s.F)(i, (t) => {
              h.configure(this, t, t.options), h.addBox(this, t);
            });
        }
        _updateMetasets() {
          let t = this._metasets,
            e = this.data.datasets.length,
            i = t.length;
          if ((t.sort((t, e) => t.index - e.index), i > e)) {
            for (let t = e; t < i; ++t) this._destroyDatasetMeta(t);
            t.splice(e, i - e);
          }
          this._sortedMetasets = t
            .slice(0)
            .sort(compare2Level("order", "index"));
        }
        _removeUnreferencedMetasets() {
          let {
            _metasets: t,
            data: { datasets: e },
          } = this;
          t.length > e.length && delete this._stacks,
            t.forEach((t, i) => {
              0 === e.filter((e) => e === t._dataset).length &&
                this._destroyDatasetMeta(i);
            });
        }
        buildOrUpdateControllers() {
          let t,
            e,
            i = [],
            a = this.data.datasets;
          for (
            this._removeUnreferencedMetasets(), t = 0, e = a.length;
            t < e;
            t++
          ) {
            let e = a[t],
              n = this.getDatasetMeta(t),
              r = e.type || this.config.type;
            if (
              (n.type &&
                n.type !== r &&
                (this._destroyDatasetMeta(t), (n = this.getDatasetMeta(t))),
              (n.type = r),
              (n.indexAxis = e.indexAxis || getIndexAxis(r, this.options)),
              (n.order = e.order || 0),
              (n.index = t),
              (n.label = "" + e.label),
              (n.visible = this.isDatasetVisible(t)),
              n.controller)
            )
              n.controller.updateIndex(t), n.controller.linkScales();
            else {
              let e = m.getController(r),
                { datasetElementType: a, dataElementType: o } = s.d.datasets[r];
              Object.assign(e, {
                dataElementType: m.getElement(o),
                datasetElementType: a && m.getElement(a),
              }),
                (n.controller = new e(this, t)),
                i.push(n.controller);
            }
          }
          return this._updateMetasets(), i;
        }
        _resetElements() {
          (0, s.F)(
            this.data.datasets,
            (t, e) => {
              this.getDatasetMeta(e).controller.reset();
            },
            this
          );
        }
        reset() {
          this._resetElements(), this.notifyPlugins("reset");
        }
        update(t) {
          let e = this.config;
          e.update();
          let i = (this._options = e.createResolver(
              e.chartOptionScopes(),
              this.getContext()
            )),
            a = (this._animationsDisabled = !i.animation);
          if (
            (this._updateScales(),
            this._checkEventBindings(),
            this._updateHiddenIndices(),
            this._plugins.invalidate(),
            !1 ===
              this.notifyPlugins("beforeUpdate", { mode: t, cancelable: !0 }))
          )
            return;
          let n = this.buildOrUpdateControllers();
          this.notifyPlugins("beforeElementsUpdate");
          let r = 0;
          for (let t = 0, e = this.data.datasets.length; t < e; t++) {
            let { controller: e } = this.getDatasetMeta(t),
              i = !a && -1 === n.indexOf(e);
            e.buildOrUpdateElements(i), (r = Math.max(+e.getMaxOverflow(), r));
          }
          (r = this._minPadding = i.layout.autoPadding ? r : 0),
            this._updateLayout(r),
            a ||
              (0, s.F)(n, (t) => {
                t.reset();
              }),
            this._updateDatasets(t),
            this.notifyPlugins("afterUpdate", { mode: t }),
            this._layers.sort(compare2Level("z", "_idx"));
          let { _active: o, _lastEvent: l } = this;
          l
            ? this._eventHandler(l, !0)
            : o.length && this._updateHoverStyles(o, o, !0),
            this.render();
        }
        _updateScales() {
          (0, s.F)(this.scales, (t) => {
            h.removeBox(this, t);
          }),
            this.ensureScalesHaveIDs(),
            this.buildOrUpdateScales();
        }
        _checkEventBindings() {
          let t = this.options,
            e = new Set(Object.keys(this._listeners)),
            i = new Set(t.events);
          ((0, s.ag)(e, i) && !!this._responsiveListeners === t.responsive) ||
            (this.unbindEvents(), this.bindEvents());
        }
        _updateHiddenIndices() {
          let { _hiddenIndices: t } = this;
          for (let {
            method: e,
            start: i,
            count: s,
          } of this._getUniformDataChanges() || [])
            moveNumericKeys(t, i, "_removeElements" === e ? -s : s);
        }
        _getUniformDataChanges() {
          let t = this._dataChanges;
          if (!t || !t.length) return;
          this._dataChanges = [];
          let e = this.data.datasets.length,
            makeSet = (e) =>
              new Set(
                t
                  .filter((t) => t[0] === e)
                  .map((t, e) => e + "," + t.splice(1).join(","))
              ),
            i = makeSet(0);
          for (let t = 1; t < e; t++) if (!(0, s.ag)(i, makeSet(t))) return;
          return Array.from(i)
            .map((t) => t.split(","))
            .map((t) => ({ method: t[1], start: +t[2], count: +t[3] }));
        }
        _updateLayout(t) {
          if (!1 === this.notifyPlugins("beforeLayout", { cancelable: !0 }))
            return;
          h.update(this, this.width, this.height, t);
          let e = this.chartArea,
            i = e.width <= 0 || e.height <= 0;
          (this._layers = []),
            (0, s.F)(
              this.boxes,
              (t) => {
                (i && "chartArea" === t.position) ||
                  (t.configure && t.configure(),
                  this._layers.push(...t._layers()));
              },
              this
            ),
            this._layers.forEach((t, e) => {
              t._idx = e;
            }),
            this.notifyPlugins("afterLayout");
        }
        _updateDatasets(t) {
          if (
            !1 !==
            this.notifyPlugins("beforeDatasetsUpdate", {
              mode: t,
              cancelable: !0,
            })
          ) {
            for (let t = 0, e = this.data.datasets.length; t < e; ++t)
              this.getDatasetMeta(t).controller.configure();
            for (let e = 0, i = this.data.datasets.length; e < i; ++e)
              this._updateDataset(e, (0, s.a7)(t) ? t({ datasetIndex: e }) : t);
            this.notifyPlugins("afterDatasetsUpdate", { mode: t });
          }
        }
        _updateDataset(t, e) {
          let i = this.getDatasetMeta(t),
            s = { meta: i, index: t, mode: e, cancelable: !0 };
          !1 !== this.notifyPlugins("beforeDatasetUpdate", s) &&
            (i.controller._update(e),
            (s.cancelable = !1),
            this.notifyPlugins("afterDatasetUpdate", s));
        }
        render() {
          !1 !== this.notifyPlugins("beforeRender", { cancelable: !0 }) &&
            (a.has(this)
              ? this.attached && !a.running(this) && a.start(this)
              : (this.draw(), onAnimationsComplete({ chart: this })));
        }
        draw() {
          let t;
          if (this._resizeBeforeDraw) {
            let { width: t, height: e } = this._resizeBeforeDraw;
            (this._resizeBeforeDraw = null), this._resize(t, e);
          }
          if (
            (this.clear(),
            this.width <= 0 ||
              this.height <= 0 ||
              !1 === this.notifyPlugins("beforeDraw", { cancelable: !0 }))
          )
            return;
          let e = this._layers;
          for (t = 0; t < e.length && e[t].z <= 0; ++t)
            e[t].draw(this.chartArea);
          for (this._drawDatasets(); t < e.length; ++t)
            e[t].draw(this.chartArea);
          this.notifyPlugins("afterDraw");
        }
        _getSortedDatasetMetas(t) {
          let e,
            i,
            s = this._sortedMetasets,
            a = [];
          for (e = 0, i = s.length; e < i; ++e) {
            let i = s[e];
            (!t || i.visible) && a.push(i);
          }
          return a;
        }
        getSortedVisibleDatasetMetas() {
          return this._getSortedDatasetMetas(!0);
        }
        _drawDatasets() {
          if (
            !1 === this.notifyPlugins("beforeDatasetsDraw", { cancelable: !0 })
          )
            return;
          let t = this.getSortedVisibleDatasetMetas();
          for (let e = t.length - 1; e >= 0; --e) this._drawDataset(t[e]);
          this.notifyPlugins("afterDatasetsDraw");
        }
        _drawDataset(t) {
          let e = this.ctx,
            i = t._clip,
            a = !i.disabled,
            n = getDatasetArea(t, this.chartArea),
            r = { meta: t, index: t.index, cancelable: !0 };
          !1 !== this.notifyPlugins("beforeDatasetDraw", r) &&
            (a &&
              (0, s.Y)(e, {
                left: !1 === i.left ? 0 : n.left - i.left,
                right: !1 === i.right ? this.width : n.right + i.right,
                top: !1 === i.top ? 0 : n.top - i.top,
                bottom: !1 === i.bottom ? this.height : n.bottom + i.bottom,
              }),
            t.controller.draw(),
            a && (0, s.$)(e),
            (r.cancelable = !1),
            this.notifyPlugins("afterDatasetDraw", r));
        }
        isPointInArea(t) {
          return (0, s.C)(t, this.chartArea, this._minPadding);
        }
        getElementsAtEventForMode(t, e, i, s) {
          let a = o.modes[e];
          return "function" == typeof a ? a(this, t, i, s) : [];
        }
        getDatasetMeta(t) {
          let e = this.data.datasets[t],
            i = this._metasets,
            s = i.filter((t) => t && t._dataset === e).pop();
          return (
            s ||
              ((s = {
                type: null,
                data: [],
                dataset: null,
                controller: null,
                hidden: null,
                xAxisID: null,
                yAxisID: null,
                order: (e && e.order) || 0,
                index: t,
                _dataset: e,
                _parsed: [],
                _sorted: !1,
              }),
              i.push(s)),
            s
          );
        }
        getContext() {
          return (
            this.$context ||
            (this.$context = (0, s.j)(null, { chart: this, type: "chart" }))
          );
        }
        getVisibleDatasetCount() {
          return this.getSortedVisibleDatasetMetas().length;
        }
        isDatasetVisible(t) {
          let e = this.data.datasets[t];
          if (!e) return !1;
          let i = this.getDatasetMeta(t);
          return "boolean" == typeof i.hidden ? !i.hidden : !e.hidden;
        }
        setDatasetVisibility(t, e) {
          this.getDatasetMeta(t).hidden = !e;
        }
        toggleDataVisibility(t) {
          this._hiddenIndices[t] = !this._hiddenIndices[t];
        }
        getDataVisibility(t) {
          return !this._hiddenIndices[t];
        }
        _updateVisibility(t, e, i) {
          let a = i ? "show" : "hide",
            n = this.getDatasetMeta(t),
            r = n.controller._resolveAnimations(void 0, a);
          (0, s.h)(e)
            ? ((n.data[e].hidden = !i), this.update())
            : (this.setDatasetVisibility(t, i),
              r.update(n, { visible: i }),
              this.update((e) => (e.datasetIndex === t ? a : void 0)));
        }
        hide(t, e) {
          this._updateVisibility(t, e, !1);
        }
        show(t, e) {
          this._updateVisibility(t, e, !0);
        }
        _destroyDatasetMeta(t) {
          let e = this._metasets[t];
          e && e.controller && e.controller._destroy(),
            delete this._metasets[t];
        }
        _stop() {
          let t, e;
          for (
            this.stop(), a.remove(this), t = 0, e = this.data.datasets.length;
            t < e;
            ++t
          )
            this._destroyDatasetMeta(t);
        }
        destroy() {
          this.notifyPlugins("beforeDestroy");
          let { canvas: t, ctx: e } = this;
          this._stop(),
            this.config.clearCache(),
            t &&
              (this.unbindEvents(),
              (0, s.af)(t, e),
              this.platform.releaseContext(e),
              (this.canvas = null),
              (this.ctx = null)),
            delete y[this.id],
            this.notifyPlugins("afterDestroy");
        }
        toBase64Image(...t) {
          return this.canvas.toDataURL(...t);
        }
        bindEvents() {
          this.bindUserEvents(),
            this.options.responsive
              ? this.bindResponsiveEvents()
              : (this.attached = !0);
        }
        bindUserEvents() {
          let t = this._listeners,
            e = this.platform,
            _add = (i, s) => {
              e.addEventListener(this, i, s), (t[i] = s);
            },
            listener = (t, e, i) => {
              (t.offsetX = e), (t.offsetY = i), this._eventHandler(t);
            };
          (0, s.F)(this.options.events, (t) => _add(t, listener));
        }
        bindResponsiveEvents() {
          let t;
          this._responsiveListeners || (this._responsiveListeners = {});
          let e = this._responsiveListeners,
            i = this.platform,
            _add = (t, s) => {
              i.addEventListener(this, t, s), (e[t] = s);
            },
            _remove = (t, s) => {
              e[t] && (i.removeEventListener(this, t, s), delete e[t]);
            },
            listener = (t, e) => {
              this.canvas && this.resize(t, e);
            },
            attached = () => {
              _remove("attach", attached),
                (this.attached = !0),
                this.resize(),
                _add("resize", listener),
                _add("detach", t);
            };
          (t = () => {
            (this.attached = !1),
              _remove("resize", listener),
              this._stop(),
              this._resize(0, 0),
              _add("attach", attached);
          }),
            i.isAttached(this.canvas) ? attached() : t();
        }
        unbindEvents() {
          (0, s.F)(this._listeners, (t, e) => {
            this.platform.removeEventListener(this, e, t);
          }),
            (this._listeners = {}),
            (0, s.F)(this._responsiveListeners, (t, e) => {
              this.platform.removeEventListener(this, e, t);
            }),
            (this._responsiveListeners = void 0);
        }
        updateHoverStyle(t, e, i) {
          let s,
            a,
            n,
            r = i ? "set" : "remove";
          for (
            "dataset" === e &&
              this.getDatasetMeta(t[0].datasetIndex).controller[
                "_" + r + "DatasetHoverStyle"
              ](),
              a = 0,
              n = t.length;
            a < n;
            ++a
          ) {
            let e =
              (s = t[a]) && this.getDatasetMeta(s.datasetIndex).controller;
            e && e[r + "HoverStyle"](s.element, s.datasetIndex, s.index);
          }
        }
        getActiveElements() {
          return this._active || [];
        }
        setActiveElements(t) {
          let e = this._active || [],
            i = t.map(({ datasetIndex: t, index: e }) => {
              let i = this.getDatasetMeta(t);
              if (!i) throw Error("No dataset found at index " + t);
              return { datasetIndex: t, element: i.data[e], index: e };
            });
          (0, s.ah)(i, e) ||
            ((this._active = i),
            (this._lastEvent = null),
            this._updateHoverStyles(i, e));
        }
        notifyPlugins(t, e, i) {
          return this._plugins.notify(this, t, e, i);
        }
        isPluginEnabled(t) {
          return (
            1 === this._plugins._cache.filter((e) => e.plugin.id === t).length
          );
        }
        _updateHoverStyles(t, e, i) {
          let s = this.options.hover,
            diff = (t, e) =>
              t.filter(
                (t) =>
                  !e.some(
                    (e) =>
                      t.datasetIndex === e.datasetIndex && t.index === e.index
                  )
              ),
            a = diff(e, t),
            n = i ? t : diff(t, e);
          a.length && this.updateHoverStyle(a, s.mode, !1),
            n.length && s.mode && this.updateHoverStyle(n, s.mode, !0);
        }
        _eventHandler(t, e) {
          let i = {
              event: t,
              replay: e,
              cancelable: !0,
              inChartArea: this.isPointInArea(t),
            },
            eventFilter = (e) =>
              (e.options.events || this.options.events).includes(t.native.type);
          if (!1 === this.notifyPlugins("beforeEvent", i, eventFilter)) return;
          let s = this._handleEvent(t, e, i.inChartArea);
          return (
            (i.cancelable = !1),
            this.notifyPlugins("afterEvent", i, eventFilter),
            (s || i.changed) && this.render(),
            this
          );
        }
        _handleEvent(t, e, i) {
          let { _active: a = [], options: n } = this,
            r = this._getActiveElements(t, a, i, e),
            o = (0, s.ai)(t),
            l = determineLastEvent(t, this._lastEvent, i, o);
          i &&
            ((this._lastEvent = null),
            (0, s.Q)(n.onHover, [t, r, this], this),
            o && (0, s.Q)(n.onClick, [t, r, this], this));
          let h = !(0, s.ah)(r, a);
          return (
            (h || e) && ((this._active = r), this._updateHoverStyles(r, a, e)),
            (this._lastEvent = l),
            h
          );
        }
        _getActiveElements(t, e, i, s) {
          if ("mouseout" === t.type) return [];
          if (!i) return e;
          let a = this.options.hover;
          return this.getElementsAtEventForMode(t, a.mode, a, s);
        }
      };
      function invalidatePlugins() {
        return (0, s.F)(Chart.instances, (t) => t._plugins.invalidate());
      }
      function setStyle(t, e, i = e) {
        (t.lineCap = (0, s.v)(i.borderCapStyle, e.borderCapStyle)),
          t.setLineDash((0, s.v)(i.borderDash, e.borderDash)),
          (t.lineDashOffset = (0, s.v)(i.borderDashOffset, e.borderDashOffset)),
          (t.lineJoin = (0, s.v)(i.borderJoinStyle, e.borderJoinStyle)),
          (t.lineWidth = (0, s.v)(i.borderWidth, e.borderWidth)),
          (t.strokeStyle = (0, s.v)(i.borderColor, e.borderColor));
      }
      function lineTo(t, e, i) {
        t.lineTo(i.x, i.y);
      }
      function getLineMethod(t) {
        return t.stepped
          ? s.ar
          : t.tension || "monotone" === t.cubicInterpolationMode
          ? s.as
          : lineTo;
      }
      function pathVars(t, e, i = {}) {
        let s = t.length,
          { start: a = 0, end: n = s - 1 } = i,
          { start: r, end: o } = e,
          l = Math.max(a, r),
          h = Math.min(n, o);
        return {
          count: s,
          start: l,
          loop: e.loop,
          ilen:
            h < l && !((a < r && n < r) || (a > o && n > o))
              ? s + h - l
              : h - l,
        };
      }
      function pathSegment(t, e, i, s) {
        let a,
          n,
          r,
          { points: o, options: l } = e,
          { count: h, start: c, loop: d, ilen: u } = pathVars(o, i, s),
          g = getLineMethod(l),
          { move: p = !0, reverse: m } = s || {};
        for (a = 0; a <= u; ++a)
          (n = o[(c + (m ? u - a : a)) % h]).skip ||
            (p ? (t.moveTo(n.x, n.y), (p = !1)) : g(t, r, n, m, l.stepped),
            (r = n));
        return d && g(t, r, (n = o[(c + (m ? u : 0)) % h]), m, l.stepped), !!d;
      }
      function fastPathSegment(t, e, i, s) {
        let a,
          n,
          r,
          o,
          l,
          h,
          c = e.points,
          { count: d, start: u, ilen: g } = pathVars(c, i, s),
          { move: p = !0, reverse: m } = s || {},
          b = 0,
          x = 0,
          pointIndex = (t) => (u + (m ? g - t : t)) % d,
          drawX = () => {
            o !== l && (t.lineTo(b, l), t.lineTo(b, o), t.lineTo(b, h));
          };
        for (
          p && ((n = c[pointIndex(0)]), t.moveTo(n.x, n.y)), a = 0;
          a <= g;
          ++a
        ) {
          if ((n = c[pointIndex(a)]).skip) continue;
          let e = n.x,
            i = n.y,
            s = 0 | e;
          s === r
            ? (i < o ? (o = i) : i > l && (l = i), (b = (x * b + e) / ++x))
            : (drawX(), t.lineTo(e, i), (r = s), (x = 0), (o = l = i)),
            (h = i);
        }
        drawX();
      }
      function _getSegmentMethod(t) {
        let e = t.options,
          i = e.borderDash && e.borderDash.length;
        return t._decimated ||
          t._loop ||
          e.tension ||
          "monotone" === e.cubicInterpolationMode ||
          e.stepped ||
          i
          ? pathSegment
          : fastPathSegment;
      }
      function _getInterpolationMethod(t) {
        return t.stepped
          ? s.ao
          : t.tension || "monotone" === t.cubicInterpolationMode
          ? s.ap
          : s.aq;
      }
      function strokePathWithCache(t, e, i, s) {
        let a = e._path;
        !a && ((a = e._path = new Path2D()), e.path(a, i, s) && a.closePath()),
          setStyle(t, e.options),
          t.stroke(a);
      }
      function strokePathDirect(t, e, i, s) {
        let { segments: a, options: n } = e,
          r = _getSegmentMethod(e);
        for (let o of a)
          setStyle(t, n, o.style),
            t.beginPath(),
            r(t, e, o, { start: i, end: i + s - 1 }) && t.closePath(),
            t.stroke();
      }
      let v = "function" == typeof Path2D;
      function draw(t, e, i, s) {
        v && !e.options.segment
          ? strokePathWithCache(t, e, i, s)
          : strokePathDirect(t, e, i, s);
      }
      let LineElement = class LineElement extends Element {
        static id = "line";
        static defaults = {
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0,
          borderJoinStyle: "miter",
          borderWidth: 3,
          capBezierPoints: !0,
          cubicInterpolationMode: "default",
          fill: !1,
          spanGaps: !1,
          stepped: !1,
          tension: 0,
        };
        static defaultRoutes = {
          backgroundColor: "backgroundColor",
          borderColor: "borderColor",
        };
        static descriptors = {
          _scriptable: !0,
          _indexable: (t) => "borderDash" !== t && "fill" !== t,
        };
        constructor(t) {
          super(),
            (this.animated = !0),
            (this.options = void 0),
            (this._chart = void 0),
            (this._loop = void 0),
            (this._fullLoop = void 0),
            (this._path = void 0),
            (this._points = void 0),
            (this._segments = void 0),
            (this._decimated = !1),
            (this._pointsUpdated = !1),
            (this._datasetIndex = void 0),
            t && Object.assign(this, t);
        }
        updateControlPoints(t, e) {
          let i = this.options;
          if (
            (i.tension || "monotone" === i.cubicInterpolationMode) &&
            !i.stepped &&
            !this._pointsUpdated
          ) {
            let a = i.spanGaps ? this._loop : this._fullLoop;
            (0, s.al)(this._points, i, t, a, e), (this._pointsUpdated = !0);
          }
        }
        set points(t) {
          (this._points = t),
            delete this._segments,
            delete this._path,
            (this._pointsUpdated = !1);
        }
        get points() {
          return this._points;
        }
        get segments() {
          return (
            this._segments ||
            (this._segments = (0, s.am)(this, this.options.segment))
          );
        }
        first() {
          let t = this.segments,
            e = this.points;
          return t.length && e[t[0].start];
        }
        last() {
          let t = this.segments,
            e = this.points,
            i = t.length;
          return i && e[t[i - 1].end];
        }
        interpolate(t, e) {
          let i,
            a,
            n = this.options,
            r = t[e],
            o = this.points,
            l = (0, s.an)(this, { property: e, start: r, end: r });
          if (!l.length) return;
          let h = [],
            c = _getInterpolationMethod(n);
          for (i = 0, a = l.length; i < a; ++i) {
            let { start: s, end: a } = l[i],
              d = o[s],
              u = o[a];
            if (d === u) {
              h.push(d);
              continue;
            }
            let g = Math.abs((r - d[e]) / (u[e] - d[e])),
              p = c(d, u, g, n.stepped);
            (p[e] = t[e]), h.push(p);
          }
          return 1 === h.length ? h[0] : h;
        }
        pathSegment(t, e, i) {
          return _getSegmentMethod(this)(t, this, e, i);
        }
        path(t, e, i) {
          let s = this.segments,
            a = _getSegmentMethod(this),
            n = this._loop;
          for (let r of ((e = e || 0), (i = i || this.points.length - e), s))
            n &= a(t, this, r, { start: e, end: e + i - 1 });
          return !!n;
        }
        draw(t, e, i, s) {
          let a = this.options || {};
          (this.points || []).length &&
            a.borderWidth &&
            (t.save(), draw(t, this, i, s), t.restore()),
            this.animated &&
              ((this._pointsUpdated = !1), (this._path = void 0));
        }
      };
      function inRange$1(t, e, i, s) {
        let a = t.options,
          { [i]: n } = t.getProps([i], s);
        return Math.abs(e - n) < a.radius + a.hitRadius;
      }
      let PointElement = class PointElement extends Element {
        static id = "point";
        parsed;
        skip;
        stop;
        static defaults = {
          borderWidth: 1,
          hitRadius: 1,
          hoverBorderWidth: 1,
          hoverRadius: 4,
          pointStyle: "circle",
          radius: 3,
          rotation: 0,
        };
        static defaultRoutes = {
          backgroundColor: "backgroundColor",
          borderColor: "borderColor",
        };
        constructor(t) {
          super(),
            (this.options = void 0),
            (this.parsed = void 0),
            (this.skip = void 0),
            (this.stop = void 0),
            t && Object.assign(this, t);
        }
        inRange(t, e, i) {
          let s = this.options,
            { x: a, y: n } = this.getProps(["x", "y"], i);
          return (
            Math.pow(t - a, 2) + Math.pow(e - n, 2) <
            Math.pow(s.hitRadius + s.radius, 2)
          );
        }
        inXRange(t, e) {
          return inRange$1(this, t, "x", e);
        }
        inYRange(t, e) {
          return inRange$1(this, t, "y", e);
        }
        getCenterPoint(t) {
          let { x: e, y: i } = this.getProps(["x", "y"], t);
          return { x: e, y: i };
        }
        size(t) {
          let e = (t = t || this.options || {}).radius || 0,
            i =
              ((e = Math.max(e, (e && t.hoverRadius) || 0)) && t.borderWidth) ||
              0;
          return (e + i) * 2;
        }
        draw(t, e) {
          let i = this.options;
          !this.skip &&
            !(i.radius < 0.1) &&
            (0, s.C)(this, e, this.size(i) / 2) &&
            ((t.strokeStyle = i.borderColor),
            (t.lineWidth = i.borderWidth),
            (t.fillStyle = i.backgroundColor),
            (0, s.at)(t, i, this.x, this.y));
        }
        getRange() {
          let t = this.options || {};
          return t.radius + t.hitRadius;
        }
      };
      function _segments(t, e, i) {
        let a = t.segments,
          n = t.points,
          r = e.points,
          o = [];
        for (let t of a) {
          let { start: a, end: l } = t;
          l = _findSegmentEnd(a, l, n);
          let h = _getBounds(i, n[a], n[l], t.loop);
          if (!e.segments) {
            o.push({ source: t, target: h, start: n[a], end: n[l] });
            continue;
          }
          for (let a of (0, s.an)(e, h)) {
            let e = _getBounds(i, r[a.start], r[a.end], a.loop);
            for (let r of (0, s.ax)(t, n, e))
              o.push({
                source: r,
                target: a,
                start: { [i]: _getEdge(h, e, "start", Math.max) },
                end: { [i]: _getEdge(h, e, "end", Math.min) },
              });
          }
        }
        return o;
      }
      function _getBounds(t, e, i, a) {
        if (a) return;
        let n = e[t],
          r = i[t];
        return (
          "angle" === t && ((n = (0, s.ay)(n)), (r = (0, s.ay)(r))),
          { property: t, start: n, end: r }
        );
      }
      function _pointsFromSegments(t, e) {
        let { x: i = null, y: s = null } = t || {},
          a = e.points,
          n = [];
        return (
          e.segments.forEach(({ start: t, end: e }) => {
            e = _findSegmentEnd(t, e, a);
            let r = a[t],
              o = a[e];
            null !== s
              ? (n.push({ x: r.x, y: s }), n.push({ x: o.x, y: s }))
              : null !== i &&
                (n.push({ x: i, y: r.y }), n.push({ x: i, y: o.y }));
          }),
          n
        );
      }
      function _findSegmentEnd(t, e, i) {
        for (; e > t; e--) {
          let t = i[e];
          if (!isNaN(t.x) && !isNaN(t.y)) break;
        }
        return e;
      }
      function _getEdge(t, e, i, s) {
        return t && e ? s(t[i], e[i]) : t ? t[i] : e ? e[i] : 0;
      }
      function _createBoundaryLine(t, e) {
        let i = [],
          a = !1;
        return (
          (0, s.b)(t) ? ((a = !0), (i = t)) : (i = _pointsFromSegments(t, e)),
          i.length
            ? new LineElement({
                points: i,
                options: { tension: 0 },
                _loop: a,
                _fullLoop: a,
              })
            : null
        );
      }
      function _shouldApplyFill(t) {
        return t && !1 !== t.fill;
      }
      function _resolveTarget(t, e, i) {
        let a,
          n = t[e].fill,
          r = [e];
        if (!i) return n;
        for (; !1 !== n && -1 === r.indexOf(n); ) {
          if (!(0, s.g)(n)) return n;
          if (!(a = t[n])) break;
          if (a.visible) return n;
          r.push(n), (n = a.fill);
        }
        return !1;
      }
      function _decodeFill(t, e, i) {
        let a = parseFillOption(t);
        if ((0, s.i)(a)) return !isNaN(a.value) && a;
        let n = parseFloat(a);
        return (0, s.g)(n) && Math.floor(n) === n
          ? decodeTargetIndex(a[0], e, n, i)
          : ["origin", "start", "end", "stack", "shape"].indexOf(a) >= 0 && a;
      }
      function decodeTargetIndex(t, e, i, s) {
        return (
          ("-" === t || "+" === t) && (i = e + i),
          i !== e && !(i < 0) && !(i >= s) && i
        );
      }
      function _getTargetPixel(t, e) {
        let i = null;
        return (
          "start" === t
            ? (i = e.bottom)
            : "end" === t
            ? (i = e.top)
            : (0, s.i)(t)
            ? (i = e.getPixelForValue(t.value))
            : e.getBasePixel && (i = e.getBasePixel()),
          i
        );
      }
      function _getTargetValue(t, e, i) {
        let a;
        return "start" === t
          ? i
          : "end" === t
          ? e.options.reverse
            ? e.min
            : e.max
          : (0, s.i)(t)
          ? t.value
          : e.getBaseValue();
      }
      function parseFillOption(t) {
        let e = t.options,
          i = e.fill,
          a = (0, s.v)(i && i.target, i);
        return (
          void 0 === a && (a = !!e.backgroundColor),
          !1 !== a && null !== a && (!0 === a ? "origin" : a)
        );
      }
      function _buildStackLine(t) {
        let { scale: e, index: i, line: s } = t,
          a = [],
          n = s.segments,
          r = s.points,
          o = getLinesBelow(e, i);
        o.push(_createBoundaryLine({ x: null, y: e.bottom }, s));
        for (let t = 0; t < n.length; t++) {
          let e = n[t];
          for (let t = e.start; t <= e.end; t++) addPointsBelow(a, r[t], o);
        }
        return new LineElement({ points: a, options: {} });
      }
      function getLinesBelow(t, e) {
        let i = [],
          s = t.getMatchingVisibleMetas("line");
        for (let t = 0; t < s.length; t++) {
          let a = s[t];
          if (a.index === e) break;
          a.hidden || i.unshift(a.dataset);
        }
        return i;
      }
      function addPointsBelow(t, e, i) {
        let s = [];
        for (let a = 0; a < i.length; a++) {
          let { first: n, last: r, point: o } = findPoint(i[a], e, "x");
          if (o && (!n || !r)) {
            if (n) s.unshift(o);
            else if ((t.push(o), !r)) break;
          }
        }
        t.push(...s);
      }
      function findPoint(t, e, i) {
        let a = t.interpolate(e, i);
        if (!a) return {};
        let n = a[i],
          r = t.segments,
          o = t.points,
          l = !1,
          h = !1;
        for (let t = 0; t < r.length; t++) {
          let e = r[t],
            a = o[e.start][i],
            c = o[e.end][i];
          if ((0, s.aj)(n, a, c)) {
            (l = n === a), (h = n === c);
            break;
          }
        }
        return { first: l, last: h, point: a };
      }
      let simpleArc = class simpleArc {
        constructor(t) {
          (this.x = t.x), (this.y = t.y), (this.radius = t.radius);
        }
        pathSegment(t, e, i) {
          let { x: a, y: n, radius: r } = this;
          return (
            (e = e || { start: 0, end: s.T }),
            t.arc(a, n, r, e.end, e.start, !0),
            !i.bounds
          );
        }
        interpolate(t) {
          let { x: e, y: i, radius: s } = this,
            a = t.angle;
          return { x: e + Math.cos(a) * s, y: i + Math.sin(a) * s, angle: a };
        }
      };
      function _getTarget(t) {
        let { chart: e, fill: i, line: a } = t;
        if ((0, s.g)(i)) return getLineByIndex(e, i);
        if ("stack" === i) return _buildStackLine(t);
        if ("shape" === i) return !0;
        let n = computeBoundary(t);
        return n instanceof simpleArc ? n : _createBoundaryLine(n, a);
      }
      function getLineByIndex(t, e) {
        let i = t.getDatasetMeta(e);
        return i && t.isDatasetVisible(e) ? i.dataset : null;
      }
      function computeBoundary(t) {
        return (t.scale || {}).getPointPositionForValue
          ? computeCircularBoundary(t)
          : computeLinearBoundary(t);
      }
      function computeLinearBoundary(t) {
        let { scale: e = {}, fill: i } = t,
          a = _getTargetPixel(i, e);
        if ((0, s.g)(a)) {
          let t = e.isHorizontal();
          return { x: t ? a : null, y: t ? null : a };
        }
        return null;
      }
      function computeCircularBoundary(t) {
        let { scale: e, fill: i } = t,
          s = e.options,
          a = e.getLabels().length,
          n = s.reverse ? e.max : e.min,
          r = _getTargetValue(i, e, n),
          o = [];
        if (s.grid.circular) {
          let t = e.getPointPositionForValue(0, n);
          return new simpleArc({
            x: t.x,
            y: t.y,
            radius: e.getDistanceFromCenterForValue(r),
          });
        }
        for (let t = 0; t < a; ++t) o.push(e.getPointPositionForValue(t, r));
        return o;
      }
      function _drawfill(t, e, i) {
        let a = _getTarget(e),
          { line: n, scale: r, axis: o } = e,
          l = n.options,
          h = l.fill,
          c = l.backgroundColor,
          { above: d = c, below: u = c } = h || {};
        a &&
          n.points.length &&
          ((0, s.Y)(t, i),
          doFill(t, {
            line: n,
            target: a,
            above: d,
            below: u,
            area: i,
            scale: r,
            axis: o,
          }),
          (0, s.$)(t));
      }
      function doFill(t, e) {
        let { line: i, target: s, above: a, below: n, area: r, scale: o } = e,
          l = i._loop ? "angle" : e.axis;
        t.save(),
          "x" === l &&
            n !== a &&
            (clipVertical(t, s, r.top),
            fill(t, { line: i, target: s, color: a, scale: o, property: l }),
            t.restore(),
            t.save(),
            clipVertical(t, s, r.bottom)),
          fill(t, { line: i, target: s, color: n, scale: o, property: l }),
          t.restore();
      }
      function clipVertical(t, e, i) {
        let { segments: s, points: a } = e,
          n = !0,
          r = !1;
        for (let o of (t.beginPath(), s)) {
          let { start: s, end: l } = o,
            h = a[s],
            c = a[_findSegmentEnd(s, l, a)];
          n
            ? (t.moveTo(h.x, h.y), (n = !1))
            : (t.lineTo(h.x, i), t.lineTo(h.x, h.y)),
            (r = !!e.pathSegment(t, o, { move: r }))
              ? t.closePath()
              : t.lineTo(c.x, i);
        }
        t.lineTo(e.first().x, i), t.closePath(), t.clip();
      }
      function fill(t, e) {
        let { line: i, target: s, property: a, color: n, scale: r } = e;
        for (let { source: e, target: o, start: l, end: h } of _segments(
          i,
          s,
          a
        )) {
          let c,
            { style: { backgroundColor: d = n } = {} } = e,
            u = !0 !== s;
          t.save(),
            (t.fillStyle = d),
            clipBounds(t, r, u && _getBounds(a, l, h)),
            t.beginPath();
          let g = !!i.pathSegment(t, e);
          if (u) {
            g ? t.closePath() : interpolatedLineTo(t, s, h, a);
            let e = !!s.pathSegment(t, o, { move: g, reverse: !0 });
            (c = g && e) || interpolatedLineTo(t, s, l, a);
          }
          t.closePath(), t.fill(c ? "evenodd" : "nonzero"), t.restore();
        }
      }
      function clipBounds(t, e, i) {
        let { top: s, bottom: a } = e.chart.chartArea,
          { property: n, start: r, end: o } = i || {};
        "x" === n && (t.beginPath(), t.rect(r, s, o - r, a - s), t.clip());
      }
      function interpolatedLineTo(t, e, i, s) {
        let a = e.interpolate(i, s);
        a && t.lineTo(a.x, a.y);
      }
      var k = {
        id: "filler",
        afterDatasetsUpdate(t, e, i) {
          let s,
            a,
            n,
            r,
            o = (t.data.datasets || []).length,
            l = [];
          for (a = 0; a < o; ++a)
            (n = (s = t.getDatasetMeta(a)).dataset),
              (r = null),
              n &&
                n.options &&
                n instanceof LineElement &&
                (r = {
                  visible: t.isDatasetVisible(a),
                  index: a,
                  fill: _decodeFill(n, a, o),
                  chart: t,
                  axis: s.controller.options.indexAxis,
                  scale: s.vScale,
                  line: n,
                }),
              (s.$filler = r),
              l.push(r);
          for (a = 0; a < o; ++a)
            (r = l[a]) &&
              !1 !== r.fill &&
              (r.fill = _resolveTarget(l, a, i.propagate));
        },
        beforeDraw(t, e, i) {
          let s = "beforeDraw" === i.drawTime,
            a = t.getSortedVisibleDatasetMetas(),
            n = t.chartArea;
          for (let e = a.length - 1; e >= 0; --e) {
            let i = a[e].$filler;
            i &&
              (i.line.updateControlPoints(n, i.axis),
              s && i.fill && _drawfill(t.ctx, i, n));
          }
        },
        beforeDatasetsDraw(t, e, i) {
          if ("beforeDatasetsDraw" !== i.drawTime) return;
          let s = t.getSortedVisibleDatasetMetas();
          for (let e = s.length - 1; e >= 0; --e) {
            let i = s[e].$filler;
            _shouldApplyFill(i) && _drawfill(t.ctx, i, t.chartArea);
          }
        },
        beforeDatasetDraw(t, e, i) {
          let s = e.meta.$filler;
          _shouldApplyFill(s) &&
            "beforeDatasetDraw" === i.drawTime &&
            _drawfill(t.ctx, s, t.chartArea);
        },
        defaults: { propagate: !0, drawTime: "beforeDatasetDraw" },
      };
      new WeakMap();
      let M = {
        average(t) {
          let e, i;
          if (!t.length) return !1;
          let s = new Set(),
            a = 0,
            n = 0;
          for (e = 0, i = t.length; e < i; ++e) {
            let i = t[e].element;
            if (i && i.hasValue()) {
              let t = i.tooltipPosition();
              s.add(t.x), (a += t.y), ++n;
            }
          }
          return (
            0 !== n &&
            0 !== s.size && {
              x: [...s].reduce((t, e) => t + e) / s.size,
              y: a / n,
            }
          );
        },
        nearest(t, e) {
          let i, a, n;
          if (!t.length) return !1;
          let r = e.x,
            o = e.y,
            l = Number.POSITIVE_INFINITY;
          for (i = 0, a = t.length; i < a; ++i) {
            let a = t[i].element;
            if (a && a.hasValue()) {
              let t = a.getCenterPoint(),
                i = (0, s.aE)(e, t);
              i < l && ((l = i), (n = a));
            }
          }
          if (n) {
            let t = n.tooltipPosition();
            (r = t.x), (o = t.y);
          }
          return { x: r, y: o };
        },
      };
      function pushOrConcat(t, e) {
        return (
          e && ((0, s.b)(e) ? Array.prototype.push.apply(t, e) : t.push(e)), t
        );
      }
      function splitNewlines(t) {
        return ("string" == typeof t || t instanceof String) &&
          t.indexOf("\n") > -1
          ? t.split("\n")
          : t;
      }
      function createTooltipItem(t, e) {
        let { element: i, datasetIndex: s, index: a } = e,
          n = t.getDatasetMeta(s).controller,
          { label: r, value: o } = n.getLabelAndValue(a);
        return {
          chart: t,
          label: r,
          parsed: n.getParsed(a),
          raw: t.data.datasets[s].data[a],
          formattedValue: o,
          dataset: n.getDataset(),
          dataIndex: a,
          datasetIndex: s,
          element: i,
        };
      }
      function getTooltipSize(t, e) {
        let i = t.chart.ctx,
          { body: a, footer: n, title: r } = t,
          { boxWidth: o, boxHeight: l } = e,
          h = (0, s.a0)(e.bodyFont),
          c = (0, s.a0)(e.titleFont),
          d = (0, s.a0)(e.footerFont),
          u = r.length,
          g = n.length,
          p = a.length,
          m = (0, s.E)(e.padding),
          b = m.height,
          x = 0,
          _ = a.reduce(
            (t, e) => t + e.before.length + e.lines.length + e.after.length,
            0
          );
        (_ += t.beforeBody.length + t.afterBody.length),
          u &&
            (b +=
              u * c.lineHeight +
              (u - 1) * e.titleSpacing +
              e.titleMarginBottom),
          _ &&
            (b +=
              p * (e.displayColors ? Math.max(l, h.lineHeight) : h.lineHeight) +
              (_ - p) * h.lineHeight +
              (_ - 1) * e.bodySpacing),
          g &&
            (b +=
              e.footerMarginTop + g * d.lineHeight + (g - 1) * e.footerSpacing);
        let y = 0,
          maxLineWidth = function (t) {
            x = Math.max(x, i.measureText(t).width + y);
          };
        return (
          i.save(),
          (i.font = c.string),
          (0, s.F)(t.title, maxLineWidth),
          (i.font = h.string),
          (0, s.F)(t.beforeBody.concat(t.afterBody), maxLineWidth),
          (y = e.displayColors ? o + 2 + e.boxPadding : 0),
          (0, s.F)(a, (t) => {
            (0, s.F)(t.before, maxLineWidth),
              (0, s.F)(t.lines, maxLineWidth),
              (0, s.F)(t.after, maxLineWidth);
          }),
          (y = 0),
          (i.font = d.string),
          (0, s.F)(t.footer, maxLineWidth),
          i.restore(),
          { width: (x += m.width), height: b }
        );
      }
      function determineYAlign(t, e) {
        let { y: i, height: s } = e;
        return i < s / 2 ? "top" : i > t.height - s / 2 ? "bottom" : "center";
      }
      function doesNotFitWithAlign(t, e, i, s) {
        let { x: a, width: n } = s,
          r = i.caretSize + i.caretPadding;
        if (
          ("left" === t && a + n + r > e.width) ||
          ("right" === t && a - n - r < 0)
        )
          return !0;
      }
      function determineXAlign(t, e, i, s) {
        let { x: a, width: n } = i,
          {
            width: r,
            chartArea: { left: o, right: l },
          } = t,
          h = "center";
        return (
          "center" === s
            ? (h = a <= (o + l) / 2 ? "left" : "right")
            : a <= n / 2
            ? (h = "left")
            : a >= r - n / 2 && (h = "right"),
          doesNotFitWithAlign(h, t, e, i) && (h = "center"),
          h
        );
      }
      function determineAlignment(t, e, i) {
        let s = i.yAlign || e.yAlign || determineYAlign(t, i);
        return {
          xAlign: i.xAlign || e.xAlign || determineXAlign(t, e, i, s),
          yAlign: s,
        };
      }
      function alignX(t, e) {
        let { x: i, width: s } = t;
        return "right" === e ? (i -= s) : "center" === e && (i -= s / 2), i;
      }
      function alignY(t, e, i) {
        let { y: s, height: a } = t;
        return (
          "top" === e ? (s += i) : "bottom" === e ? (s -= a + i) : (s -= a / 2),
          s
        );
      }
      function getBackgroundPoint(t, e, i, a) {
        let { caretSize: n, caretPadding: r, cornerRadius: o } = t,
          { xAlign: l, yAlign: h } = i,
          c = n + r,
          {
            topLeft: d,
            topRight: u,
            bottomLeft: g,
            bottomRight: p,
          } = (0, s.aw)(o),
          m = alignX(e, l),
          b = alignY(e, h, c);
        return (
          "center" === h
            ? "left" === l
              ? (m += c)
              : "right" === l && (m -= c)
            : "left" === l
            ? (m -= Math.max(d, g) + n)
            : "right" === l && (m += Math.max(u, p) + n),
          {
            x: (0, s.S)(m, 0, a.width - e.width),
            y: (0, s.S)(b, 0, a.height - e.height),
          }
        );
      }
      function getAlignedX(t, e, i) {
        let a = (0, s.E)(i.padding);
        return "center" === e
          ? t.x + t.width / 2
          : "right" === e
          ? t.x + t.width - a.right
          : t.x + a.left;
      }
      function createTooltipContext(t, e, i) {
        return (0, s.j)(t, { tooltip: e, tooltipItems: i, type: "tooltip" });
      }
      function overrideCallbacks(t, e) {
        let i =
          e && e.dataset && e.dataset.tooltip && e.dataset.tooltip.callbacks;
        return i ? t.override(i) : t;
      }
      let S = {
        beforeTitle: s.aF,
        title(t) {
          if (t.length > 0) {
            let e = t[0],
              i = e.chart.data.labels,
              s = i ? i.length : 0;
            if (this && this.options && "dataset" === this.options.mode)
              return e.dataset.label || "";
            if (e.label) return e.label;
            if (s > 0 && e.dataIndex < s) return i[e.dataIndex];
          }
          return "";
        },
        afterTitle: s.aF,
        beforeBody: s.aF,
        beforeLabel: s.aF,
        label(t) {
          if (this && this.options && "dataset" === this.options.mode)
            return t.label + ": " + t.formattedValue || t.formattedValue;
          let e = t.dataset.label || "";
          e && (e += ": ");
          let i = t.formattedValue;
          return (0, s.k)(i) || (e += i), e;
        },
        labelColor(t) {
          let e = t.chart
            .getDatasetMeta(t.datasetIndex)
            .controller.getStyle(t.dataIndex);
          return {
            borderColor: e.borderColor,
            backgroundColor: e.backgroundColor,
            borderWidth: e.borderWidth,
            borderDash: e.borderDash,
            borderDashOffset: e.borderDashOffset,
            borderRadius: 0,
          };
        },
        labelTextColor() {
          return this.options.bodyColor;
        },
        labelPointStyle(t) {
          let e = t.chart
            .getDatasetMeta(t.datasetIndex)
            .controller.getStyle(t.dataIndex);
          return { pointStyle: e.pointStyle, rotation: e.rotation };
        },
        afterLabel: s.aF,
        afterBody: s.aF,
        beforeFooter: s.aF,
        footer: s.aF,
        afterFooter: s.aF,
      };
      function invokeCallbackWithFallback(t, e, i, s) {
        let a = t[e].call(i, s);
        return void 0 === a ? S[e].call(i, s) : a;
      }
      let Tooltip = class Tooltip extends Element {
        static positioners = M;
        constructor(t) {
          super(),
            (this.opacity = 0),
            (this._active = []),
            (this._eventPosition = void 0),
            (this._size = void 0),
            (this._cachedAnimations = void 0),
            (this._tooltipItems = []),
            (this.$animations = void 0),
            (this.$context = void 0),
            (this.chart = t.chart),
            (this.options = t.options),
            (this.dataPoints = void 0),
            (this.title = void 0),
            (this.beforeBody = void 0),
            (this.body = void 0),
            (this.afterBody = void 0),
            (this.footer = void 0),
            (this.xAlign = void 0),
            (this.yAlign = void 0),
            (this.x = void 0),
            (this.y = void 0),
            (this.height = void 0),
            (this.width = void 0),
            (this.caretX = void 0),
            (this.caretY = void 0),
            (this.labelColors = void 0),
            (this.labelPointStyles = void 0),
            (this.labelTextColors = void 0);
        }
        initialize(t) {
          (this.options = t),
            (this._cachedAnimations = void 0),
            (this.$context = void 0);
        }
        _resolveAnimations() {
          let t = this._cachedAnimations;
          if (t) return t;
          let e = this.chart,
            i = this.options.setContext(this.getContext()),
            s = i.enabled && e.options.animation && i.animations,
            a = new Animations(this.chart, s);
          return s._cacheable && (this._cachedAnimations = Object.freeze(a)), a;
        }
        getContext() {
          return (
            this.$context ||
            (this.$context = createTooltipContext(
              this.chart.getContext(),
              this,
              this._tooltipItems
            ))
          );
        }
        getTitle(t, e) {
          let { callbacks: i } = e,
            s = invokeCallbackWithFallback(i, "beforeTitle", this, t),
            a = invokeCallbackWithFallback(i, "title", this, t),
            n = invokeCallbackWithFallback(i, "afterTitle", this, t),
            r = [];
          return (
            (r = pushOrConcat(r, splitNewlines(s))),
            (r = pushOrConcat(r, splitNewlines(a))),
            (r = pushOrConcat(r, splitNewlines(n)))
          );
        }
        getBeforeBody(t, e) {
          return pushOrConcat(
            [],
            splitNewlines(
              invokeCallbackWithFallback(e.callbacks, "beforeBody", this, t)
            )
          );
        }
        getBody(t, e) {
          let { callbacks: i } = e,
            a = [];
          return (
            (0, s.F)(t, (t) => {
              let e = { before: [], lines: [], after: [] },
                s = overrideCallbacks(i, t);
              pushOrConcat(
                e.before,
                splitNewlines(
                  invokeCallbackWithFallback(s, "beforeLabel", this, t)
                )
              ),
                pushOrConcat(
                  e.lines,
                  invokeCallbackWithFallback(s, "label", this, t)
                ),
                pushOrConcat(
                  e.after,
                  splitNewlines(
                    invokeCallbackWithFallback(s, "afterLabel", this, t)
                  )
                ),
                a.push(e);
            }),
            a
          );
        }
        getAfterBody(t, e) {
          return pushOrConcat(
            [],
            splitNewlines(
              invokeCallbackWithFallback(e.callbacks, "afterBody", this, t)
            )
          );
        }
        getFooter(t, e) {
          let { callbacks: i } = e,
            s = invokeCallbackWithFallback(i, "beforeFooter", this, t),
            a = invokeCallbackWithFallback(i, "footer", this, t),
            n = invokeCallbackWithFallback(i, "afterFooter", this, t),
            r = [];
          return (
            (r = pushOrConcat(r, splitNewlines(s))),
            (r = pushOrConcat(r, splitNewlines(a))),
            (r = pushOrConcat(r, splitNewlines(n)))
          );
        }
        _createItems(t) {
          let e,
            i,
            a = this._active,
            n = this.chart.data,
            r = [],
            o = [],
            l = [],
            h = [];
          for (e = 0, i = a.length; e < i; ++e)
            h.push(createTooltipItem(this.chart, a[e]));
          return (
            t.filter && (h = h.filter((e, i, s) => t.filter(e, i, s, n))),
            t.itemSort && (h = h.sort((e, i) => t.itemSort(e, i, n))),
            (0, s.F)(h, (e) => {
              let i = overrideCallbacks(t.callbacks, e);
              r.push(invokeCallbackWithFallback(i, "labelColor", this, e)),
                o.push(
                  invokeCallbackWithFallback(i, "labelPointStyle", this, e)
                ),
                l.push(
                  invokeCallbackWithFallback(i, "labelTextColor", this, e)
                );
            }),
            (this.labelColors = r),
            (this.labelPointStyles = o),
            (this.labelTextColors = l),
            (this.dataPoints = h),
            h
          );
        }
        update(t, e) {
          let i,
            s = this.options.setContext(this.getContext()),
            a = this._active,
            n = [];
          if (a.length) {
            let t = M[s.position].call(this, a, this._eventPosition);
            (n = this._createItems(s)),
              (this.title = this.getTitle(n, s)),
              (this.beforeBody = this.getBeforeBody(n, s)),
              (this.body = this.getBody(n, s)),
              (this.afterBody = this.getAfterBody(n, s)),
              (this.footer = this.getFooter(n, s));
            let e = (this._size = getTooltipSize(this, s)),
              r = Object.assign({}, t, e),
              o = determineAlignment(this.chart, s, r),
              l = getBackgroundPoint(s, r, o, this.chart);
            (this.xAlign = o.xAlign),
              (this.yAlign = o.yAlign),
              (i = {
                opacity: 1,
                x: l.x,
                y: l.y,
                width: e.width,
                height: e.height,
                caretX: t.x,
                caretY: t.y,
              });
          } else 0 !== this.opacity && (i = { opacity: 0 });
          (this._tooltipItems = n),
            (this.$context = void 0),
            i && this._resolveAnimations().update(this, i),
            t &&
              s.external &&
              s.external.call(this, {
                chart: this.chart,
                tooltip: this,
                replay: e,
              });
        }
        drawCaret(t, e, i, s) {
          let a = this.getCaretPosition(t, i, s);
          e.lineTo(a.x1, a.y1), e.lineTo(a.x2, a.y2), e.lineTo(a.x3, a.y3);
        }
        getCaretPosition(t, e, i) {
          let a,
            n,
            r,
            o,
            l,
            h,
            { xAlign: c, yAlign: d } = this,
            { caretSize: u, cornerRadius: g } = i,
            {
              topLeft: p,
              topRight: m,
              bottomLeft: b,
              bottomRight: x,
            } = (0, s.aw)(g),
            { x: _, y: y } = t,
            { width: v, height: k } = e;
          return (
            "center" === d
              ? ((l = y + k / 2),
                "left" === c
                  ? ((n = (a = _) - u), (o = l + u), (h = l - u))
                  : ((n = (a = _ + v) + u), (o = l - u), (h = l + u)),
                (r = a))
              : ((n =
                  "left" === c
                    ? _ + Math.max(p, b) + u
                    : "right" === c
                    ? _ + v - Math.max(m, x) - u
                    : this.caretX),
                "top" === d
                  ? ((l = (o = y) - u), (a = n - u), (r = n + u))
                  : ((l = (o = y + k) + u), (a = n + u), (r = n - u)),
                (h = o)),
            { x1: a, x2: n, x3: r, y1: o, y2: l, y3: h }
          );
        }
        drawTitle(t, e, i) {
          let a,
            n,
            r,
            o = this.title,
            l = o.length;
          if (l) {
            let h = (0, s.az)(i.rtl, this.x, this.width);
            for (
              r = 0,
                t.x = getAlignedX(this, i.titleAlign, i),
                e.textAlign = h.textAlign(i.titleAlign),
                e.textBaseline = "middle",
                a = (0, s.a0)(i.titleFont),
                n = i.titleSpacing,
                e.fillStyle = i.titleColor,
                e.font = a.string;
              r < l;
              ++r
            )
              e.fillText(o[r], h.x(t.x), t.y + a.lineHeight / 2),
                (t.y += a.lineHeight + n),
                r + 1 === l && (t.y += i.titleMarginBottom - n);
          }
        }
        _drawColorBox(t, e, i, a, n) {
          let r = this.labelColors[i],
            o = this.labelPointStyles[i],
            { boxHeight: l, boxWidth: h } = n,
            c = (0, s.a0)(n.bodyFont),
            d = getAlignedX(this, "left", n),
            u = a.x(d),
            g = l < c.lineHeight ? (c.lineHeight - l) / 2 : 0,
            p = e.y + g;
          if (n.usePointStyle) {
            let e = {
                radius: Math.min(h, l) / 2,
                pointStyle: o.pointStyle,
                rotation: o.rotation,
                borderWidth: 1,
              },
              i = a.leftForLtr(u, h) + h / 2,
              c = p + l / 2;
            (t.strokeStyle = n.multiKeyBackground),
              (t.fillStyle = n.multiKeyBackground),
              (0, s.at)(t, e, i, c),
              (t.strokeStyle = r.borderColor),
              (t.fillStyle = r.backgroundColor),
              (0, s.at)(t, e, i, c);
          } else {
            (t.lineWidth = (0, s.i)(r.borderWidth)
              ? Math.max(...Object.values(r.borderWidth))
              : r.borderWidth || 1),
              (t.strokeStyle = r.borderColor),
              t.setLineDash(r.borderDash || []),
              (t.lineDashOffset = r.borderDashOffset || 0);
            let e = a.leftForLtr(u, h),
              i = a.leftForLtr(a.xPlus(u, 1), h - 2),
              o = (0, s.aw)(r.borderRadius);
            Object.values(o).some((t) => 0 !== t)
              ? (t.beginPath(),
                (t.fillStyle = n.multiKeyBackground),
                (0, s.au)(t, { x: e, y: p, w: h, h: l, radius: o }),
                t.fill(),
                t.stroke(),
                (t.fillStyle = r.backgroundColor),
                t.beginPath(),
                (0, s.au)(t, { x: i, y: p + 1, w: h - 2, h: l - 2, radius: o }),
                t.fill())
              : ((t.fillStyle = n.multiKeyBackground),
                t.fillRect(e, p, h, l),
                t.strokeRect(e, p, h, l),
                (t.fillStyle = r.backgroundColor),
                t.fillRect(i, p + 1, h - 2, l - 2));
          }
          t.fillStyle = this.labelTextColors[i];
        }
        drawBody(t, e, i) {
          let a,
            n,
            r,
            o,
            l,
            h,
            { body: c } = this,
            {
              bodySpacing: d,
              bodyAlign: u,
              displayColors: g,
              boxHeight: p,
              boxWidth: m,
              boxPadding: b,
            } = i,
            x = (0, s.a0)(i.bodyFont),
            _ = x.lineHeight,
            y = 0,
            v = (0, s.az)(i.rtl, this.x, this.width),
            fillLineOfText = function (i) {
              e.fillText(i, v.x(t.x + y), t.y + _ / 2), (t.y += _ + d);
            },
            k = v.textAlign(u);
          for (
            e.textAlign = u,
              e.textBaseline = "middle",
              e.font = x.string,
              t.x = getAlignedX(this, k, i),
              e.fillStyle = i.bodyColor,
              (0, s.F)(this.beforeBody, fillLineOfText),
              y =
                g && "right" !== k
                  ? "center" === u
                    ? m / 2 + b
                    : m + 2 + b
                  : 0,
              r = 0,
              l = c.length;
            r < l;
            ++r
          ) {
            for (
              a = c[r],
                e.fillStyle = this.labelTextColors[r],
                (0, s.F)(a.before, fillLineOfText),
                n = a.lines,
                g &&
                  n.length &&
                  (this._drawColorBox(e, t, r, v, i),
                  (_ = Math.max(x.lineHeight, p))),
                o = 0,
                h = n.length;
              o < h;
              ++o
            )
              fillLineOfText(n[o]), (_ = x.lineHeight);
            (0, s.F)(a.after, fillLineOfText);
          }
          (y = 0),
            (_ = x.lineHeight),
            (0, s.F)(this.afterBody, fillLineOfText),
            (t.y -= d);
        }
        drawFooter(t, e, i) {
          let a,
            n,
            r = this.footer,
            o = r.length;
          if (o) {
            let l = (0, s.az)(i.rtl, this.x, this.width);
            for (
              t.x = getAlignedX(this, i.footerAlign, i),
                t.y += i.footerMarginTop,
                e.textAlign = l.textAlign(i.footerAlign),
                e.textBaseline = "middle",
                a = (0, s.a0)(i.footerFont),
                e.fillStyle = i.footerColor,
                e.font = a.string,
                n = 0;
              n < o;
              ++n
            )
              e.fillText(r[n], l.x(t.x), t.y + a.lineHeight / 2),
                (t.y += a.lineHeight + i.footerSpacing);
          }
        }
        drawBackground(t, e, i, a) {
          let { xAlign: n, yAlign: r } = this,
            { x: o, y: l } = t,
            { width: h, height: c } = i,
            {
              topLeft: d,
              topRight: u,
              bottomLeft: g,
              bottomRight: p,
            } = (0, s.aw)(a.cornerRadius);
          (e.fillStyle = a.backgroundColor),
            (e.strokeStyle = a.borderColor),
            (e.lineWidth = a.borderWidth),
            e.beginPath(),
            e.moveTo(o + d, l),
            "top" === r && this.drawCaret(t, e, i, a),
            e.lineTo(o + h - u, l),
            e.quadraticCurveTo(o + h, l, o + h, l + u),
            "center" === r && "right" === n && this.drawCaret(t, e, i, a),
            e.lineTo(o + h, l + c - p),
            e.quadraticCurveTo(o + h, l + c, o + h - p, l + c),
            "bottom" === r && this.drawCaret(t, e, i, a),
            e.lineTo(o + g, l + c),
            e.quadraticCurveTo(o, l + c, o, l + c - g),
            "center" === r && "left" === n && this.drawCaret(t, e, i, a),
            e.lineTo(o, l + d),
            e.quadraticCurveTo(o, l, o + d, l),
            e.closePath(),
            e.fill(),
            a.borderWidth > 0 && e.stroke();
        }
        _updateAnimationTarget(t) {
          let e = this.chart,
            i = this.$animations,
            s = i && i.x,
            a = i && i.y;
          if (s || a) {
            let i = M[t.position].call(this, this._active, this._eventPosition);
            if (!i) return;
            let n = (this._size = getTooltipSize(this, t)),
              r = Object.assign({}, i, this._size),
              o = determineAlignment(e, t, r),
              l = getBackgroundPoint(t, r, o, e);
            (s._to !== l.x || a._to !== l.y) &&
              ((this.xAlign = o.xAlign),
              (this.yAlign = o.yAlign),
              (this.width = n.width),
              (this.height = n.height),
              (this.caretX = i.x),
              (this.caretY = i.y),
              this._resolveAnimations().update(this, l));
          }
        }
        _willRender() {
          return !!this.opacity;
        }
        draw(t) {
          let e = this.options.setContext(this.getContext()),
            i = this.opacity;
          if (!i) return;
          this._updateAnimationTarget(e);
          let a = { width: this.width, height: this.height },
            n = { x: this.x, y: this.y };
          i = 0.001 > Math.abs(i) ? 0 : i;
          let r = (0, s.E)(e.padding),
            o =
              this.title.length ||
              this.beforeBody.length ||
              this.body.length ||
              this.afterBody.length ||
              this.footer.length;
          e.enabled &&
            o &&
            (t.save(),
            (t.globalAlpha = i),
            this.drawBackground(n, t, a, e),
            (0, s.aA)(t, e.textDirection),
            (n.y += r.top),
            this.drawTitle(n, t, e),
            this.drawBody(n, t, e),
            this.drawFooter(n, t, e),
            (0, s.aC)(t, e.textDirection),
            t.restore());
        }
        getActiveElements() {
          return this._active || [];
        }
        setActiveElements(t, e) {
          let i = this._active,
            a = t.map(({ datasetIndex: t, index: e }) => {
              let i = this.chart.getDatasetMeta(t);
              if (!i) throw Error("Cannot find a dataset at index " + t);
              return { datasetIndex: t, element: i.data[e], index: e };
            }),
            n = !(0, s.ah)(i, a),
            r = this._positionChanged(a, e);
          (n || r) &&
            ((this._active = a),
            (this._eventPosition = e),
            (this._ignoreReplayEvents = !0),
            this.update(!0));
        }
        handleEvent(t, e, i = !0) {
          if (e && this._ignoreReplayEvents) return !1;
          this._ignoreReplayEvents = !1;
          let a = this.options,
            n = this._active || [],
            r = this._getActiveElements(t, n, e, i),
            o = this._positionChanged(r, t),
            l = e || !(0, s.ah)(r, n) || o;
          return (
            l &&
              ((this._active = r),
              (a.enabled || a.external) &&
                ((this._eventPosition = { x: t.x, y: t.y }),
                this.update(!0, e))),
            l
          );
        }
        _getActiveElements(t, e, i, s) {
          let a = this.options;
          if ("mouseout" === t.type) return [];
          if (!s)
            return e.filter(
              (t) =>
                this.chart.data.datasets[t.datasetIndex] &&
                void 0 !==
                  this.chart
                    .getDatasetMeta(t.datasetIndex)
                    .controller.getParsed(t.index)
            );
          let n = this.chart.getElementsAtEventForMode(t, a.mode, a, i);
          return a.reverse && n.reverse(), n;
        }
        _positionChanged(t, e) {
          let { caretX: i, caretY: s, options: a } = this,
            n = M[a.position].call(this, t, e);
          return !1 !== n && (i !== n.x || s !== n.y);
        }
      };
      let addIfString = (t, e, i, s) => (
        "string" == typeof e
          ? ((i = t.push(e) - 1), s.unshift({ index: i, label: e }))
          : isNaN(e) && (i = null),
        i
      );
      function findOrAddLabel(t, e, i, s) {
        let a = t.indexOf(e);
        return -1 === a
          ? addIfString(t, e, i, s)
          : a !== t.lastIndexOf(e)
          ? i
          : a;
      }
      let validIndex = (t, e) =>
        null === t ? null : (0, s.S)(Math.round(t), 0, e);
      function _getLabelForValue(t) {
        let e = this.getLabels();
        return t >= 0 && t < e.length ? e[t] : t;
      }
      let CategoryScale = class CategoryScale extends Scale {
        static id = "category";
        static defaults = { ticks: { callback: _getLabelForValue } };
        constructor(t) {
          super(t),
            (this._startValue = void 0),
            (this._valueRange = 0),
            (this._addedLabels = []);
        }
        init(t) {
          let e = this._addedLabels;
          if (e.length) {
            let t = this.getLabels();
            for (let { index: i, label: s } of e) t[i] === s && t.splice(i, 1);
            this._addedLabels = [];
          }
          super.init(t);
        }
        parse(t, e) {
          if ((0, s.k)(t)) return null;
          let i = this.getLabels();
          return validIndex(
            (e =
              isFinite(e) && i[e] === t
                ? e
                : findOrAddLabel(i, t, (0, s.v)(e, t), this._addedLabels)),
            i.length - 1
          );
        }
        determineDataLimits() {
          let { minDefined: t, maxDefined: e } = this.getUserBounds(),
            { min: i, max: s } = this.getMinMax(!0);
          "ticks" === this.options.bounds &&
            (t || (i = 0), e || (s = this.getLabels().length - 1)),
            (this.min = i),
            (this.max = s);
        }
        buildTicks() {
          let t = this.min,
            e = this.max,
            i = this.options.offset,
            s = [],
            a = this.getLabels();
          (a = 0 === t && e === a.length - 1 ? a : a.slice(t, e + 1)),
            (this._valueRange = Math.max(a.length - +!i, 1)),
            (this._startValue = this.min - 0.5 * !!i);
          for (let i = t; i <= e; i++) s.push({ value: i });
          return s;
        }
        getLabelForValue(t) {
          return _getLabelForValue.call(this, t);
        }
        configure() {
          super.configure(),
            this.isHorizontal() || (this._reversePixels = !this._reversePixels);
        }
        getPixelForValue(t) {
          return (
            "number" != typeof t && (t = this.parse(t)),
            null === t
              ? NaN
              : this.getPixelForDecimal(
                  (t - this._startValue) / this._valueRange
                )
          );
        }
        getPixelForTick(t) {
          let e = this.ticks;
          return t < 0 || t > e.length - 1
            ? null
            : this.getPixelForValue(e[t].value);
        }
        getValueForPixel(t) {
          return Math.round(
            this._startValue + this.getDecimalForPixel(t) * this._valueRange
          );
        }
        getBasePixel() {
          return this.bottom;
        }
      };
      function generateTicks$1(t, e) {
        let i,
          a,
          n,
          r,
          o = [],
          {
            bounds: l,
            step: h,
            min: c,
            max: d,
            precision: u,
            count: g,
            maxTicks: p,
            maxDigits: m,
            includeBounds: b,
          } = t,
          x = h || 1,
          _ = p - 1,
          { min: y, max: v } = e,
          k = !(0, s.k)(c),
          M = !(0, s.k)(d),
          S = !(0, s.k)(g),
          w = (v - y) / (m + 1),
          P = (0, s.aH)((v - y) / _ / x) * x;
        if (P < 1e-14 && !k && !M) return [{ value: y }, { value: v }];
        (r = Math.ceil(v / P) - Math.floor(y / P)) > _ &&
          (P = (0, s.aH)((r * P) / _ / x) * x),
          (0, s.k)(u) || (P = Math.ceil(P * (i = Math.pow(10, u))) / i),
          "ticks" === l
            ? ((a = Math.floor(y / P) * P), (n = Math.ceil(v / P) * P))
            : ((a = y), (n = v)),
          k && M && h && (0, s.aI)((d - c) / h, P / 1e3)
            ? ((r = Math.round(Math.min((d - c) / P, p))),
              (P = (d - c) / r),
              (a = c),
              (n = d))
            : S
            ? ((a = k ? c : a), (P = ((n = M ? d : n) - a) / (r = g - 1)))
            : ((r = (n - a) / P),
              (r = (0, s.aJ)(r, Math.round(r), P / 1e3)
                ? Math.round(r)
                : Math.ceil(r)));
        let C = Math.max((0, s.aK)(P), (0, s.aK)(a));
        (a = Math.round(a * (i = Math.pow(10, (0, s.k)(u) ? C : u))) / i),
          (n = Math.round(n * i) / i);
        let D = 0;
        for (
          k &&
          (b && a !== c
            ? (o.push({ value: c }),
              a < c && D++,
              (0, s.aJ)(
                Math.round((a + D * P) * i) / i,
                c,
                relativeLabelSize(c, w, t)
              ) && D++)
            : a < c && D++);
          D < r;
          ++D
        ) {
          let t = Math.round((a + D * P) * i) / i;
          if (M && t > d) break;
          o.push({ value: t });
        }
        return (
          M && b && n !== d
            ? o.length &&
              (0, s.aJ)(o[o.length - 1].value, d, relativeLabelSize(d, w, t))
              ? (o[o.length - 1].value = d)
              : o.push({ value: d })
            : (M && n !== d) || o.push({ value: n }),
          o
        );
      }
      function relativeLabelSize(t, e, { horizontal: i, minRotation: a }) {
        let n = (0, s.t)(a),
          r = (i ? Math.sin(n) : Math.cos(n)) || 0.001,
          o = 0.75 * e * ("" + t).length;
        return Math.min(e / r, o);
      }
      let LinearScaleBase = class LinearScaleBase extends Scale {
        constructor(t) {
          super(t),
            (this.start = void 0),
            (this.end = void 0),
            (this._startValue = void 0),
            (this._endValue = void 0),
            (this._valueRange = 0);
        }
        parse(t, e) {
          return (0, s.k)(t) ||
            (("number" == typeof t || t instanceof Number) && !isFinite(+t))
            ? null
            : +t;
        }
        handleTickRangeOptions() {
          let { beginAtZero: t } = this.options,
            { minDefined: e, maxDefined: i } = this.getUserBounds(),
            { min: a, max: n } = this,
            setMin = (t) => (a = e ? a : t),
            setMax = (t) => (n = i ? n : t);
          if (t) {
            let t = (0, s.s)(a),
              e = (0, s.s)(n);
            t < 0 && e < 0 ? setMax(0) : t > 0 && e > 0 && setMin(0);
          }
          if (a === n) {
            let e = 0 === n ? 1 : Math.abs(0.05 * n);
            setMax(n + e), t || setMin(a - e);
          }
          (this.min = a), (this.max = n);
        }
        getTickLimit() {
          let t,
            { maxTicksLimit: e, stepSize: i } = this.options.ticks;
          return (
            i
              ? (t = Math.ceil(this.max / i) - Math.floor(this.min / i) + 1) >
                  1e3 &&
                (console.warn(
                  `scales.${this.id}.ticks.stepSize: ${i} would result generating up to ${t} ticks. Limiting to 1000.`
                ),
                (t = 1e3))
              : ((t = this.computeTickLimit()), (e = e || 11)),
            e && (t = Math.min(e, t)),
            t
          );
        }
        computeTickLimit() {
          return Number.POSITIVE_INFINITY;
        }
        buildTicks() {
          let t = this.options,
            e = t.ticks,
            i = this.getTickLimit(),
            a = generateTicks$1(
              {
                maxTicks: (i = Math.max(2, i)),
                bounds: t.bounds,
                min: t.min,
                max: t.max,
                precision: e.precision,
                step: e.stepSize,
                count: e.count,
                maxDigits: this._maxDigits(),
                horizontal: this.isHorizontal(),
                minRotation: e.minRotation || 0,
                includeBounds: !1 !== e.includeBounds,
              },
              this._range || this
            );
          return (
            "ticks" === t.bounds && (0, s.aG)(a, this, "value"),
            t.reverse
              ? (a.reverse(), (this.start = this.max), (this.end = this.min))
              : ((this.start = this.min), (this.end = this.max)),
            a
          );
        }
        configure() {
          let t = this.ticks,
            e = this.min,
            i = this.max;
          if ((super.configure(), this.options.offset && t.length)) {
            let s = (i - e) / Math.max(t.length - 1, 1) / 2;
            (e -= s), (i += s);
          }
          (this._startValue = e),
            (this._endValue = i),
            (this._valueRange = i - e);
        }
        getLabelForValue(t) {
          return (0, s.o)(
            t,
            this.chart.options.locale,
            this.options.ticks.format
          );
        }
      };
      let LinearScale = class LinearScale extends LinearScaleBase {
        static id = "linear";
        static defaults = { ticks: { callback: s.aL.formatters.numeric } };
        determineDataLimits() {
          let { min: t, max: e } = this.getMinMax(!0);
          (this.min = (0, s.g)(t) ? t : 0),
            (this.max = (0, s.g)(e) ? e : 1),
            this.handleTickRangeOptions();
        }
        computeTickLimit() {
          let t = this.isHorizontal(),
            e = t ? this.width : this.height,
            i = (0, s.t)(this.options.ticks.minRotation),
            a = (t ? Math.sin(i) : Math.cos(i)) || 0.001;
          return Math.ceil(
            e / Math.min(40, this._resolveTickFontOptions(0).lineHeight / a)
          );
        }
        getPixelForValue(t) {
          return null === t
            ? NaN
            : this.getPixelForDecimal(
                (t - this._startValue) / this._valueRange
              );
        }
        getValueForPixel(t) {
          return (
            this._startValue + this.getDecimalForPixel(t) * this._valueRange
          );
        }
      };
      let log10Floor = (t) => Math.floor((0, s.aM)(t)),
        changeExponent = (t, e) => Math.pow(10, log10Floor(t) + e);
      function isMajor(t) {
        return 1 == t / Math.pow(10, log10Floor(t));
      }
      function steps(t, e, i) {
        let s = Math.pow(10, i),
          a = Math.floor(t / s);
        return Math.ceil(e / s) - a;
      }
      function startExp(t, e) {
        let i = log10Floor(e - t);
        for (; steps(t, e, i) > 10; ) i++;
        for (; 10 > steps(t, e, i); ) i--;
        return Math.min(i, log10Floor(t));
      }
      function generateTicks(t, { min: e, max: i }) {
        e = (0, s.O)(t.min, e);
        let a = [],
          n = log10Floor(e),
          r = startExp(e, i),
          o = r < 0 ? Math.pow(10, Math.abs(r)) : 1,
          l = Math.pow(10, r),
          h = n > r ? Math.pow(10, n) : 0,
          c = Math.round((e - h) * o) / o,
          d = Math.floor((e - h) / l / 10) * l * 10,
          u = Math.floor((c - d) / Math.pow(10, r)),
          g = (0, s.O)(
            t.min,
            Math.round((h + d + u * Math.pow(10, r)) * o) / o
          );
        for (; g < i; )
          a.push({ value: g, major: isMajor(g), significand: u }),
            u >= 10 ? (u = u < 15 ? 15 : 20) : u++,
            u >= 20 && ((u = 2), (o = ++r >= 0 ? 1 : o)),
            (g = Math.round((h + d + u * Math.pow(10, r)) * o) / o);
        let p = (0, s.O)(t.max, g);
        return a.push({ value: p, major: isMajor(p), significand: u }), a;
      }
      let LogarithmicScale = class LogarithmicScale extends Scale {
        static id = "logarithmic";
        static defaults = {
          ticks: {
            callback: s.aL.formatters.logarithmic,
            major: { enabled: !0 },
          },
        };
        constructor(t) {
          super(t),
            (this.start = void 0),
            (this.end = void 0),
            (this._startValue = void 0),
            (this._valueRange = 0);
        }
        parse(t, e) {
          let i = LinearScaleBase.prototype.parse.apply(this, [t, e]);
          if (0 === i) {
            this._zero = !0;
            return;
          }
          return (0, s.g)(i) && i > 0 ? i : null;
        }
        determineDataLimits() {
          let { min: t, max: e } = this.getMinMax(!0);
          (this.min = (0, s.g)(t) ? Math.max(0, t) : null),
            (this.max = (0, s.g)(e) ? Math.max(0, e) : null),
            this.options.beginAtZero && (this._zero = !0),
            this._zero &&
              this.min !== this._suggestedMin &&
              !(0, s.g)(this._userMin) &&
              (this.min =
                t === changeExponent(this.min, 0)
                  ? changeExponent(this.min, -1)
                  : changeExponent(this.min, 0)),
            this.handleTickRangeOptions();
        }
        handleTickRangeOptions() {
          let { minDefined: t, maxDefined: e } = this.getUserBounds(),
            i = this.min,
            s = this.max,
            setMin = (e) => (i = t ? i : e),
            setMax = (t) => (s = e ? s : t);
          i === s &&
            (i <= 0
              ? (setMin(1), setMax(10))
              : (setMin(changeExponent(i, -1)), setMax(changeExponent(s, 1)))),
            i <= 0 && setMin(changeExponent(s, -1)),
            s <= 0 && setMax(changeExponent(i, 1)),
            (this.min = i),
            (this.max = s);
        }
        buildTicks() {
          let t = this.options,
            e = generateTicks({ min: this._userMin, max: this._userMax }, this);
          return (
            "ticks" === t.bounds && (0, s.aG)(e, this, "value"),
            t.reverse
              ? (e.reverse(), (this.start = this.max), (this.end = this.min))
              : ((this.start = this.min), (this.end = this.max)),
            e
          );
        }
        getLabelForValue(t) {
          return void 0 === t
            ? "0"
            : (0, s.o)(t, this.chart.options.locale, this.options.ticks.format);
        }
        configure() {
          let t = this.min;
          super.configure(),
            (this._startValue = (0, s.aM)(t)),
            (this._valueRange = (0, s.aM)(this.max) - (0, s.aM)(t));
        }
        getPixelForValue(t) {
          return ((void 0 === t || 0 === t) && (t = this.min),
          null === t || isNaN(t))
            ? NaN
            : this.getPixelForDecimal(
                t === this.min
                  ? 0
                  : ((0, s.aM)(t) - this._startValue) / this._valueRange
              );
        }
        getValueForPixel(t) {
          let e = this.getDecimalForPixel(t);
          return Math.pow(10, this._startValue + e * this._valueRange);
        }
      };
      function getTickBackdropHeight(t) {
        let e = t.ticks;
        if (e.display && t.display) {
          let t = (0, s.E)(e.backdropPadding);
          return (0, s.v)(e.font && e.font.size, s.d.font.size) + t.height;
        }
        return 0;
      }
      function measureLabelSize(t, e, i) {
        return (
          (i = (0, s.b)(i) ? i : [i]),
          { w: (0, s.aN)(t, e.string, i), h: i.length * e.lineHeight }
        );
      }
      function determineLimits(t, e, i, s, a) {
        return t === s || t === a
          ? { start: e - i / 2, end: e + i / 2 }
          : t < s || t > a
          ? { start: e - i, end: e }
          : { start: e, end: e + i };
      }
      function fitWithPointLabels(t) {
        let e = {
            l: t.left + t._padding.left,
            r: t.right - t._padding.right,
            t: t.top + t._padding.top,
            b: t.bottom - t._padding.bottom,
          },
          i = Object.assign({}, e),
          a = [],
          n = [],
          r = t._pointLabels.length,
          o = t.options.pointLabels,
          l = o.centerPointLabels ? s.P / r : 0;
        for (let h = 0; h < r; h++) {
          let r = o.setContext(t.getPointLabelContext(h));
          n[h] = r.padding;
          let c = t.getPointPosition(h, t.drawingArea + n[h], l),
            d = (0, s.a0)(r.font),
            u = measureLabelSize(t.ctx, d, t._pointLabels[h]);
          a[h] = u;
          let g = (0, s.ay)(t.getIndexAngle(h) + l),
            p = Math.round((0, s.U)(g));
          updateLimits(
            i,
            e,
            g,
            determineLimits(p, c.x, u.w, 0, 180),
            determineLimits(p, c.y, u.h, 90, 270)
          );
        }
        t.setCenterPoint(e.l - i.l, i.r - e.r, e.t - i.t, i.b - e.b),
          (t._pointLabelItems = buildPointLabelItems(t, a, n));
      }
      function updateLimits(t, e, i, s, a) {
        let n = Math.abs(Math.sin(i)),
          r = Math.abs(Math.cos(i)),
          o = 0,
          l = 0;
        s.start < e.l
          ? ((o = (e.l - s.start) / n), (t.l = Math.min(t.l, e.l - o)))
          : s.end > e.r &&
            ((o = (s.end - e.r) / n), (t.r = Math.max(t.r, e.r + o))),
          a.start < e.t
            ? ((l = (e.t - a.start) / r), (t.t = Math.min(t.t, e.t - l)))
            : a.end > e.b &&
              ((l = (a.end - e.b) / r), (t.b = Math.max(t.b, e.b + l)));
      }
      function createPointLabelItem(t, e, i) {
        let a = t.drawingArea,
          { extra: n, additionalAngle: r, padding: o, size: l } = i,
          h = t.getPointPosition(e, a + n + o, r),
          c = Math.round((0, s.U)((0, s.ay)(h.angle + s.H))),
          d = yForAngle(h.y, l.h, c),
          u = getTextAlignForAngle(c),
          g = leftForTextAlign(h.x, l.w, u);
        return {
          visible: !0,
          x: h.x,
          y: d,
          textAlign: u,
          left: g,
          top: d,
          right: g + l.w,
          bottom: d + l.h,
        };
      }
      function isNotOverlapped(t, e) {
        if (!e) return !0;
        let { left: i, top: a, right: n, bottom: r } = t;
        return !(
          (0, s.C)({ x: i, y: a }, e) ||
          (0, s.C)({ x: i, y: r }, e) ||
          (0, s.C)({ x: n, y: a }, e) ||
          (0, s.C)({ x: n, y: r }, e)
        );
      }
      function buildPointLabelItems(t, e, i) {
        let a,
          n = [],
          r = t._pointLabels.length,
          o = t.options,
          { centerPointLabels: l, display: h } = o.pointLabels,
          c = {
            extra: getTickBackdropHeight(o) / 2,
            additionalAngle: l ? s.P / r : 0,
          };
        for (let s = 0; s < r; s++) {
          (c.padding = i[s]), (c.size = e[s]);
          let r = createPointLabelItem(t, s, c);
          n.push(r),
            "auto" === h &&
              ((r.visible = isNotOverlapped(r, a)), r.visible && (a = r));
        }
        return n;
      }
      function getTextAlignForAngle(t) {
        return 0 === t || 180 === t ? "center" : t < 180 ? "left" : "right";
      }
      function leftForTextAlign(t, e, i) {
        return "right" === i ? (t -= e) : "center" === i && (t -= e / 2), t;
      }
      function yForAngle(t, e, i) {
        return (
          90 === i || 270 === i
            ? (t -= e / 2)
            : (i > 270 || i < 90) && (t -= e),
          t
        );
      }
      function drawPointLabelBox(t, e, i) {
        let { left: a, top: n, right: r, bottom: o } = i,
          { backdropColor: l } = e;
        if (!(0, s.k)(l)) {
          let i = (0, s.aw)(e.borderRadius),
            h = (0, s.E)(e.backdropPadding);
          t.fillStyle = l;
          let c = a - h.left,
            d = n - h.top,
            u = r - a + h.width,
            g = o - n + h.height;
          Object.values(i).some((t) => 0 !== t)
            ? (t.beginPath(),
              (0, s.au)(t, { x: c, y: d, w: u, h: g, radius: i }),
              t.fill())
            : t.fillRect(c, d, u, g);
        }
      }
      function drawPointLabels(t, e) {
        let {
          ctx: i,
          options: { pointLabels: a },
        } = t;
        for (let n = e - 1; n >= 0; n--) {
          let e = t._pointLabelItems[n];
          if (!e.visible) continue;
          let r = a.setContext(t.getPointLabelContext(n));
          drawPointLabelBox(i, r, e);
          let o = (0, s.a0)(r.font),
            { x: l, y: h, textAlign: c } = e;
          (0, s.Z)(i, t._pointLabels[n], l, h + o.lineHeight / 2, o, {
            color: r.color,
            textAlign: c,
            textBaseline: "middle",
          });
        }
      }
      function pathRadiusLine(t, e, i, a) {
        let { ctx: n } = t;
        if (i) n.arc(t.xCenter, t.yCenter, e, 0, s.T);
        else {
          let i = t.getPointPosition(0, e);
          n.moveTo(i.x, i.y);
          for (let s = 1; s < a; s++)
            (i = t.getPointPosition(s, e)), n.lineTo(i.x, i.y);
        }
      }
      function drawRadiusLine(t, e, i, s, a) {
        let n = t.ctx,
          r = e.circular,
          { color: o, lineWidth: l } = e;
        (r || s) &&
          o &&
          l &&
          !(i < 0) &&
          (n.save(),
          (n.strokeStyle = o),
          (n.lineWidth = l),
          n.setLineDash(a.dash || []),
          (n.lineDashOffset = a.dashOffset),
          n.beginPath(),
          pathRadiusLine(t, i, r, s),
          n.closePath(),
          n.stroke(),
          n.restore());
      }
      function createPointLabelContext(t, e, i) {
        return (0, s.j)(t, { label: i, index: e, type: "pointLabel" });
      }
      let RadialLinearScale = class RadialLinearScale extends LinearScaleBase {
        static id = "radialLinear";
        static defaults = {
          display: !0,
          animate: !0,
          position: "chartArea",
          angleLines: {
            display: !0,
            lineWidth: 1,
            borderDash: [],
            borderDashOffset: 0,
          },
          grid: { circular: !1 },
          startAngle: 0,
          ticks: { showLabelBackdrop: !0, callback: s.aL.formatters.numeric },
          pointLabels: {
            backdropColor: void 0,
            backdropPadding: 2,
            display: !0,
            font: { size: 10 },
            callback: (t) => t,
            padding: 5,
            centerPointLabels: !1,
          },
        };
        static defaultRoutes = {
          "angleLines.color": "borderColor",
          "pointLabels.color": "color",
          "ticks.color": "color",
        };
        static descriptors = { angleLines: { _fallback: "grid" } };
        constructor(t) {
          super(t),
            (this.xCenter = void 0),
            (this.yCenter = void 0),
            (this.drawingArea = void 0),
            (this._pointLabels = []),
            (this._pointLabelItems = []);
        }
        setDimensions() {
          let t = (this._padding = (0, s.E)(
              getTickBackdropHeight(this.options) / 2
            )),
            e = (this.width = this.maxWidth - t.width),
            i = (this.height = this.maxHeight - t.height);
          (this.xCenter = Math.floor(this.left + e / 2 + t.left)),
            (this.yCenter = Math.floor(this.top + i / 2 + t.top)),
            (this.drawingArea = Math.floor(Math.min(e, i) / 2));
        }
        determineDataLimits() {
          let { min: t, max: e } = this.getMinMax(!1);
          (this.min = (0, s.g)(t) && !isNaN(t) ? t : 0),
            (this.max = (0, s.g)(e) && !isNaN(e) ? e : 0),
            this.handleTickRangeOptions();
        }
        computeTickLimit() {
          return Math.ceil(
            this.drawingArea / getTickBackdropHeight(this.options)
          );
        }
        generateTickLabels(t) {
          LinearScaleBase.prototype.generateTickLabels.call(this, t),
            (this._pointLabels = this.getLabels()
              .map((t, e) => {
                let i = (0, s.Q)(
                  this.options.pointLabels.callback,
                  [t, e],
                  this
                );
                return i || 0 === i ? i : "";
              })
              .filter((t, e) => this.chart.getDataVisibility(e)));
        }
        fit() {
          let t = this.options;
          t.display && t.pointLabels.display
            ? fitWithPointLabels(this)
            : this.setCenterPoint(0, 0, 0, 0);
        }
        setCenterPoint(t, e, i, s) {
          (this.xCenter += Math.floor((t - e) / 2)),
            (this.yCenter += Math.floor((i - s) / 2)),
            (this.drawingArea -= Math.min(
              this.drawingArea / 2,
              Math.max(t, e, i, s)
            ));
        }
        getIndexAngle(t) {
          let e = s.T / (this._pointLabels.length || 1),
            i = this.options.startAngle || 0;
          return (0, s.ay)(t * e + (0, s.t)(i));
        }
        getDistanceFromCenterForValue(t) {
          if ((0, s.k)(t)) return NaN;
          let e = this.drawingArea / (this.max - this.min);
          return this.options.reverse ? (this.max - t) * e : (t - this.min) * e;
        }
        getValueForDistanceFromCenter(t) {
          if ((0, s.k)(t)) return NaN;
          let e = t / (this.drawingArea / (this.max - this.min));
          return this.options.reverse ? this.max - e : this.min + e;
        }
        getPointLabelContext(t) {
          let e = this._pointLabels || [];
          if (t >= 0 && t < e.length) {
            let i = e[t];
            return createPointLabelContext(this.getContext(), t, i);
          }
        }
        getPointPosition(t, e, i = 0) {
          let a = this.getIndexAngle(t) - s.H + i;
          return {
            x: Math.cos(a) * e + this.xCenter,
            y: Math.sin(a) * e + this.yCenter,
            angle: a,
          };
        }
        getPointPositionForValue(t, e) {
          return this.getPointPosition(
            t,
            this.getDistanceFromCenterForValue(e)
          );
        }
        getBasePosition(t) {
          return this.getPointPositionForValue(t || 0, this.getBaseValue());
        }
        getPointLabelPosition(t) {
          let {
            left: e,
            top: i,
            right: s,
            bottom: a,
          } = this._pointLabelItems[t];
          return { left: e, top: i, right: s, bottom: a };
        }
        drawBackground() {
          let {
            backgroundColor: t,
            grid: { circular: e },
          } = this.options;
          if (t) {
            let i = this.ctx;
            i.save(),
              i.beginPath(),
              pathRadiusLine(
                this,
                this.getDistanceFromCenterForValue(this._endValue),
                e,
                this._pointLabels.length
              ),
              i.closePath(),
              (i.fillStyle = t),
              i.fill(),
              i.restore();
          }
        }
        drawGrid() {
          let t,
            e,
            i,
            s = this.ctx,
            a = this.options,
            { angleLines: n, grid: r, border: o } = a,
            l = this._pointLabels.length;
          if (
            (a.pointLabels.display && drawPointLabels(this, l),
            r.display &&
              this.ticks.forEach((t, i) => {
                if (0 !== i || (0 === i && this.min < 0)) {
                  e = this.getDistanceFromCenterForValue(t.value);
                  let s = this.getContext(i),
                    a = r.setContext(s),
                    n = o.setContext(s);
                  drawRadiusLine(this, a, e, l, n);
                }
              }),
            n.display)
          ) {
            for (s.save(), t = l - 1; t >= 0; t--) {
              let r = n.setContext(this.getPointLabelContext(t)),
                { color: o, lineWidth: l } = r;
              l &&
                o &&
                ((s.lineWidth = l),
                (s.strokeStyle = o),
                s.setLineDash(r.borderDash),
                (s.lineDashOffset = r.borderDashOffset),
                (e = this.getDistanceFromCenterForValue(
                  a.reverse ? this.min : this.max
                )),
                (i = this.getPointPosition(t, e)),
                s.beginPath(),
                s.moveTo(this.xCenter, this.yCenter),
                s.lineTo(i.x, i.y),
                s.stroke());
            }
            s.restore();
          }
        }
        drawBorder() {}
        drawLabels() {
          let t,
            e,
            i = this.ctx,
            a = this.options,
            n = a.ticks;
          if (!n.display) return;
          let r = this.getIndexAngle(0);
          i.save(),
            i.translate(this.xCenter, this.yCenter),
            i.rotate(r),
            (i.textAlign = "center"),
            (i.textBaseline = "middle"),
            this.ticks.forEach((r, o) => {
              if (0 === o && this.min >= 0 && !a.reverse) return;
              let l = n.setContext(this.getContext(o)),
                h = (0, s.a0)(l.font);
              if (
                ((t = this.getDistanceFromCenterForValue(this.ticks[o].value)),
                l.showLabelBackdrop)
              ) {
                (i.font = h.string),
                  (e = i.measureText(r.label).width),
                  (i.fillStyle = l.backdropColor);
                let a = (0, s.E)(l.backdropPadding);
                i.fillRect(
                  -e / 2 - a.left,
                  -t - h.size / 2 - a.top,
                  e + a.width,
                  h.size + a.height
                );
              }
              (0, s.Z)(i, r.label, 0, -t, h, {
                color: l.color,
                strokeColor: l.textStrokeColor,
                strokeWidth: l.textStrokeWidth,
              });
            }),
            i.restore();
        }
        drawTitle() {}
      };
      let w = {
          millisecond: { common: !0, size: 1, steps: 1e3 },
          second: { common: !0, size: 1e3, steps: 60 },
          minute: { common: !0, size: 6e4, steps: 60 },
          hour: { common: !0, size: 36e5, steps: 24 },
          day: { common: !0, size: 864e5, steps: 30 },
          week: { common: !1, size: 6048e5, steps: 4 },
          month: { common: !0, size: 2628e6, steps: 12 },
          quarter: { common: !1, size: 7884e6, steps: 4 },
          year: { common: !0, size: 3154e7 },
        },
        P = Object.keys(w);
      function sorter(t, e) {
        return t - e;
      }
      function parse(t, e) {
        if ((0, s.k)(e)) return null;
        let i = t._adapter,
          { parser: a, round: n, isoWeekday: r } = t._parseOpts,
          o = e;
        return ("function" == typeof a && (o = a(o)),
        (0, s.g)(o) || (o = "string" == typeof a ? i.parse(o, a) : i.parse(o)),
        null === o)
          ? null
          : (n &&
              (o =
                "week" === n && ((0, s.x)(r) || !0 === r)
                  ? i.startOf(o, "isoWeek", r)
                  : i.startOf(o, n)),
            +o);
      }
      function determineUnitForAutoTicks(t, e, i, s) {
        let a = P.length;
        for (let n = P.indexOf(t); n < a - 1; ++n) {
          let t = w[P[n]],
            a = t.steps ? t.steps : Number.MAX_SAFE_INTEGER;
          if (t.common && Math.ceil((i - e) / (a * t.size)) <= s) return P[n];
        }
        return P[a - 1];
      }
      function determineUnitForFormatting(t, e, i, s, a) {
        for (let n = P.length - 1; n >= P.indexOf(i); n--) {
          let i = P[n];
          if (w[i].common && t._adapter.diff(a, s, i) >= e - 1) return i;
        }
        return P[i ? P.indexOf(i) : 0];
      }
      function determineMajorUnit(t) {
        for (let e = P.indexOf(t) + 1, i = P.length; e < i; ++e)
          if (w[P[e]].common) return P[e];
      }
      function addTick(t, e, i) {
        if (i) {
          if (i.length) {
            let { lo: a, hi: n } = (0, s.aP)(i, e);
            t[i[a] >= e ? i[a] : i[n]] = !0;
          }
        } else t[e] = !0;
      }
      function setMajorTicks(t, e, i, s) {
        let a,
          n,
          r = t._adapter,
          o = +r.startOf(e[0].value, s),
          l = e[e.length - 1].value;
        for (a = o; a <= l; a = +r.add(a, 1, s))
          (n = i[a]) >= 0 && (e[n].major = !0);
        return e;
      }
      function ticksFromTimestamps(t, e, i) {
        let s,
          a,
          n = [],
          r = {},
          o = e.length;
        for (s = 0; s < o; ++s)
          (r[(a = e[s])] = s), n.push({ value: a, major: !1 });
        return 0 !== o && i ? setMajorTicks(t, n, r, i) : n;
      }
      let TimeScale = class TimeScale extends Scale {
        static id = "time";
        static defaults = {
          bounds: "data",
          adapters: {},
          time: {
            parser: !1,
            unit: !1,
            round: !1,
            isoWeekday: !1,
            minUnit: "millisecond",
            displayFormats: {},
          },
          ticks: { source: "auto", callback: !1, major: { enabled: !1 } },
        };
        constructor(t) {
          super(t),
            (this._cache = { data: [], labels: [], all: [] }),
            (this._unit = "day"),
            (this._majorUnit = void 0),
            (this._offsets = {}),
            (this._normalized = !1),
            (this._parseOpts = void 0);
        }
        init(t, e = {}) {
          let i = t.time || (t.time = {}),
            a = (this._adapter = new DateAdapterBase(t.adapters.date));
          a.init(e),
            (0, s.ab)(i.displayFormats, a.formats()),
            (this._parseOpts = {
              parser: i.parser,
              round: i.round,
              isoWeekday: i.isoWeekday,
            }),
            super.init(t),
            (this._normalized = e.normalized);
        }
        parse(t, e) {
          return void 0 === t ? null : parse(this, t);
        }
        beforeLayout() {
          super.beforeLayout(),
            (this._cache = { data: [], labels: [], all: [] });
        }
        determineDataLimits() {
          let t = this.options,
            e = this._adapter,
            i = t.time.unit || "day",
            {
              min: a,
              max: n,
              minDefined: r,
              maxDefined: o,
            } = this.getUserBounds();
          function _applyBounds(t) {
            r || isNaN(t.min) || (a = Math.min(a, t.min)),
              o || isNaN(t.max) || (n = Math.max(n, t.max));
          }
          (r && o) ||
            (_applyBounds(this._getLabelBounds()),
            ("ticks" !== t.bounds || "labels" !== t.ticks.source) &&
              _applyBounds(this.getMinMax(!1))),
            (a = (0, s.g)(a) && !isNaN(a) ? a : +e.startOf(Date.now(), i)),
            (n = (0, s.g)(n) && !isNaN(n) ? n : +e.endOf(Date.now(), i) + 1),
            (this.min = Math.min(a, n - 1)),
            (this.max = Math.max(a + 1, n));
        }
        _getLabelBounds() {
          let t = this.getLabelTimestamps(),
            e = Number.POSITIVE_INFINITY,
            i = Number.NEGATIVE_INFINITY;
          return (
            t.length && ((e = t[0]), (i = t[t.length - 1])), { min: e, max: i }
          );
        }
        buildTicks() {
          let t = this.options,
            e = t.time,
            i = t.ticks,
            a =
              "labels" === i.source
                ? this.getLabelTimestamps()
                : this._generate();
          "ticks" === t.bounds &&
            a.length &&
            ((this.min = this._userMin || a[0]),
            (this.max = this._userMax || a[a.length - 1]));
          let n = this.min,
            r = this.max,
            o = (0, s.aO)(a, n, r);
          return (
            (this._unit =
              e.unit ||
              (i.autoSkip
                ? determineUnitForAutoTicks(
                    e.minUnit,
                    this.min,
                    this.max,
                    this._getLabelCapacity(n)
                  )
                : determineUnitForFormatting(
                    this,
                    o.length,
                    e.minUnit,
                    this.min,
                    this.max
                  ))),
            (this._majorUnit =
              i.major.enabled && "year" !== this._unit
                ? determineMajorUnit(this._unit)
                : void 0),
            this.initOffsets(a),
            t.reverse && o.reverse(),
            ticksFromTimestamps(this, o, this._majorUnit)
          );
        }
        afterAutoSkip() {
          this.options.offsetAfterAutoskip &&
            this.initOffsets(this.ticks.map((t) => +t.value));
        }
        initOffsets(t = []) {
          let e,
            i,
            a = 0,
            n = 0;
          this.options.offset &&
            t.length &&
            ((e = this.getDecimalForValue(t[0])),
            (a =
              1 === t.length ? 1 - e : (this.getDecimalForValue(t[1]) - e) / 2),
            (i = this.getDecimalForValue(t[t.length - 1])),
            (n =
              1 === t.length
                ? i
                : (i - this.getDecimalForValue(t[t.length - 2])) / 2));
          let r = t.length < 3 ? 0.5 : 0.25;
          (a = (0, s.S)(a, 0, r)),
            (n = (0, s.S)(n, 0, r)),
            (this._offsets = { start: a, end: n, factor: 1 / (a + 1 + n) });
        }
        _generate() {
          let t,
            e,
            i = this._adapter,
            a = this.min,
            n = this.max,
            r = this.options,
            o = r.time,
            l =
              o.unit ||
              determineUnitForAutoTicks(
                o.minUnit,
                a,
                n,
                this._getLabelCapacity(a)
              ),
            h = (0, s.v)(r.ticks.stepSize, 1),
            c = "week" === l && o.isoWeekday,
            d = (0, s.x)(c) || !0 === c,
            u = {},
            g = a;
          if (
            (d && (g = +i.startOf(g, "isoWeek", c)),
            (g = +i.startOf(g, d ? "day" : l)),
            i.diff(n, a, l) > 1e5 * h)
          )
            throw Error(
              a +
                " and " +
                n +
                " are too far apart with stepSize of " +
                h +
                " " +
                l
            );
          let p = "data" === r.ticks.source && this.getDataTimestamps();
          for (t = g, e = 0; t < n; t = +i.add(t, h, l), e++) addTick(u, t, p);
          return (
            (t === n || "ticks" === r.bounds || 1 === e) && addTick(u, t, p),
            Object.keys(u)
              .sort(sorter)
              .map((t) => +t)
          );
        }
        getLabelForValue(t) {
          let e = this._adapter,
            i = this.options.time;
          return i.tooltipFormat
            ? e.format(t, i.tooltipFormat)
            : e.format(t, i.displayFormats.datetime);
        }
        format(t, e) {
          let i = this.options.time.displayFormats,
            s = this._unit,
            a = e || i[s];
          return this._adapter.format(t, a);
        }
        _tickFormatFunction(t, e, i, a) {
          let n = this.options,
            r = n.ticks.callback;
          if (r) return (0, s.Q)(r, [t, e, i], this);
          let o = n.time.displayFormats,
            l = this._unit,
            h = this._majorUnit,
            c = l && o[l],
            d = h && o[h],
            u = i[e],
            g = h && d && u && u.major;
          return this._adapter.format(t, a || (g ? d : c));
        }
        generateTickLabels(t) {
          let e, i, s;
          for (e = 0, i = t.length; e < i; ++e)
            (s = t[e]).label = this._tickFormatFunction(s.value, e, t);
        }
        getDecimalForValue(t) {
          return null === t ? NaN : (t - this.min) / (this.max - this.min);
        }
        getPixelForValue(t) {
          let e = this._offsets,
            i = this.getDecimalForValue(t);
          return this.getPixelForDecimal((e.start + i) * e.factor);
        }
        getValueForPixel(t) {
          let e = this._offsets,
            i = this.getDecimalForPixel(t) / e.factor - e.end;
          return this.min + i * (this.max - this.min);
        }
        _getLabelSize(t) {
          let e = this.options.ticks,
            i = this.ctx.measureText(t).width,
            a = (0, s.t)(this.isHorizontal() ? e.maxRotation : e.minRotation),
            n = Math.cos(a),
            r = Math.sin(a),
            o = this._resolveTickFontOptions(0).size;
          return { w: i * n + o * r, h: i * r + o * n };
        }
        _getLabelCapacity(t) {
          let e = this.options.time,
            i = e.displayFormats,
            s = i[e.unit] || i.millisecond,
            a = this._tickFormatFunction(
              t,
              0,
              ticksFromTimestamps(this, [t], this._majorUnit),
              s
            ),
            n = this._getLabelSize(a),
            r =
              Math.floor(
                this.isHorizontal() ? this.width / n.w : this.height / n.h
              ) - 1;
          return r > 0 ? r : 1;
        }
        getDataTimestamps() {
          let t,
            e,
            i = this._cache.data || [];
          if (i.length) return i;
          let s = this.getMatchingVisibleMetas();
          if (this._normalized && s.length)
            return (this._cache.data =
              s[0].controller.getAllParsedValues(this));
          for (t = 0, e = s.length; t < e; ++t)
            i = i.concat(s[t].controller.getAllParsedValues(this));
          return (this._cache.data = this.normalize(i));
        }
        getLabelTimestamps() {
          let t,
            e,
            i = this._cache.labels || [];
          if (i.length) return i;
          let s = this.getLabels();
          for (t = 0, e = s.length; t < e; ++t) i.push(parse(this, s[t]));
          return (this._cache.labels = this._normalized
            ? i
            : this.normalize(i));
        }
        normalize(t) {
          return (0, s._)(t.sort(sorter));
        }
      };
      function interpolate(t, e, i) {
        let a,
          n,
          r,
          o,
          l = 0,
          h = t.length - 1;
        i
          ? (e >= t[l].pos &&
              e <= t[h].pos &&
              ({ lo: l, hi: h } = (0, s.B)(t, "pos", e)),
            ({ pos: a, time: r } = t[l]),
            ({ pos: n, time: o } = t[h]))
          : (e >= t[l].time &&
              e <= t[h].time &&
              ({ lo: l, hi: h } = (0, s.B)(t, "time", e)),
            ({ time: a, pos: r } = t[l]),
            ({ time: n, pos: o } = t[h]));
        let c = n - a;
        return c ? r + ((o - r) * (e - a)) / c : r;
      }
      let TimeSeriesScale = class TimeSeriesScale extends TimeScale {
        static id = "timeseries";
        static defaults = TimeScale.defaults;
        constructor(t) {
          super(t),
            (this._table = []),
            (this._minPos = void 0),
            (this._tableRange = void 0);
        }
        initOffsets() {
          let t = this._getTimestampsForTable(),
            e = (this._table = this.buildLookupTable(t));
          (this._minPos = interpolate(e, this.min)),
            (this._tableRange = interpolate(e, this.max) - this._minPos),
            super.initOffsets(t);
        }
        buildLookupTable(t) {
          let e,
            i,
            s,
            { min: a, max: n } = this,
            r = [],
            o = [];
          for (e = 0, i = t.length; e < i; ++e)
            (s = t[e]) >= a && s <= n && r.push(s);
          if (r.length < 2)
            return [
              { time: a, pos: 0 },
              { time: n, pos: 1 },
            ];
          for (e = 0, i = r.length; e < i; ++e)
            Math.round((r[e + 1] + r[e - 1]) / 2) !== (s = r[e]) &&
              o.push({ time: s, pos: e / (i - 1) });
          return o;
        }
        _generate() {
          let t = this.min,
            e = this.max,
            i = super.getDataTimestamps();
          return (
            (i.includes(t) && i.length) || i.splice(0, 0, t),
            (i.includes(e) && 1 !== i.length) || i.push(e),
            i.sort((t, e) => t - e)
          );
        }
        _getTimestampsForTable() {
          let t = this._cache.all || [];
          if (t.length) return t;
          let e = this.getDataTimestamps(),
            i = this.getLabelTimestamps();
          return (
            (t =
              e.length && i.length
                ? this.normalize(e.concat(i))
                : e.length
                ? e
                : i),
            (t = this._cache.all = t)
          );
        }
        getDecimalForValue(t) {
          return (
            (interpolate(this._table, t) - this._minPos) / this._tableRange
          );
        }
        getValueForPixel(t) {
          let e = this._offsets,
            i = this.getDecimalForPixel(t) / e.factor - e.end;
          return interpolate(
            this._table,
            i * this._tableRange + this._minPos,
            !0
          );
        }
      };
    },
    29020: function (t, e, i) {
      let s, a;
      function round(t) {
        return (t + 0.5) | 0;
      }
      i.d(e, {
        ay: () => _normalizeAngle,
        l: () => listenArrayEvents,
        w: () => _scaleRangesChanged,
        ag: () => setsEqual,
        a0: () => toFont,
        aF: () => noop,
        ar: () => _steppedLineTo,
        C: () => _isPointInArea,
        N: () => _factorize,
        Y: () => clipArea,
        d: () => I,
        o: () => formatNumber,
        z: () => getRelativePosition,
        a4: () => merge,
        aJ: () => almostEquals,
        ak: () => _readValueToProps,
        av: () => toTRBL,
        F: () => each,
        Q: () => helpers_segment_callback,
        g: () => isNumberFinite,
        r: () => w,
        az: () => getRtlAdapter,
        a8: () => _attachContext,
        aC: () => restoreTextDirection,
        aN: () => _longestText,
        ad: () => debounce,
        I: () => _getParentNode,
        T: () => p,
        _: () => _arrayUnique,
        ao: () => _steppedInterpolation,
        b3: () => x,
        j: () => createContext,
        u: () => unlistenArrayEvents,
        ah: () => _elementsEqual,
        a1: () => _toLeftRightCenter,
        aG: () => _setMinAndMaxByKey,
        A: () => _rlookupByKey,
        L: () => throttled,
        W: () => _int16Range,
        as: () => _bezierCurveTo,
        b: () => isArray,
        m: () => toPercentage,
        x: () => isNumber,
        a5: () => _capitalize,
        aK: () => _decimalPlaces,
        aa: () => chunks_helpers_segment_descriptors,
        D: () => getAngleFromPoint,
        O: () => finiteOrDefault,
        Z: () => renderText,
        al: () => _updateBezierControlPoints,
        aw: () => toTRBLCorners,
        e: () => P,
        p: () => _angleBetween,
        ap: () => _bezierInterpolation,
        aD: () => drawPointLegend,
        aO: () => _filterBetween,
        a9: () => _createResolver,
        G: () => getMaximumSize,
        R: () => _addGrace,
        ae: () => retinaScale,
        b4: () => y,
        h: () => defined,
        s: () => M,
        aH: () => niceNum,
        a2: () => _alignStartEnd,
        ai: () => _isClickEvent,
        at: () => drawPoint,
        J: () => readUsedSize,
        U: () => toDegrees,
        k: () => isNullOrUndef,
        v: () => valueOrDefault,
        a6: () => F,
        aA: () => overrideTextDirection,
        aL: () => T,
        B: () => _lookupByKey,
        M: () => _isDomSupported,
        X: () => _alignPixel,
        ab: () => mergeIf,
        am: () => _computeSegments,
        ax: () => _boundSegment,
        c: () => helpers_segment_color,
        n: () => toDimension,
        af: () => clearCanvas,
        $: () => unclipArea,
        aE: () => distanceBetweenPoints,
        aP: () => _lookup,
        E: () => toPadding,
        P: () => g,
        aq: () => _pointInLine,
        b5: () => v,
        f: () => resolveObjectKey,
        q: () => _getStartAndCountOfVisiblePoints,
        y: () => _parseObjectDataRadialScale,
        aI: () => almostWhole,
        a3: () => L,
        aj: () => _isBetween,
        au: () => addRoundedRectPath,
        H: () => _,
        S: () => _limitValue,
        i: () => isObject,
        t: () => toRadians,
        a7: () => isFunction,
        aB: () => _textX,
        aM: () => k,
        ac: () => d,
        K: () => V,
        V: () => _measureText,
        a: () => helpers_segment_resolve,
        an: () => _boundSegments,
      });
      let lim = (t, e, i) => Math.max(Math.min(t, i), e);
      function p2b(t) {
        return lim(round(2.55 * t), 0, 255);
      }
      function n2b(t) {
        return lim(round(255 * t), 0, 255);
      }
      function b2n(t) {
        return lim(round(t / 2.55) / 100, 0, 1);
      }
      function n2p(t) {
        return lim(round(100 * t), 0, 100);
      }
      let n = {
          0: 0,
          1: 1,
          2: 2,
          3: 3,
          4: 4,
          5: 5,
          6: 6,
          7: 7,
          8: 8,
          9: 9,
          A: 10,
          B: 11,
          C: 12,
          D: 13,
          E: 14,
          F: 15,
          a: 10,
          b: 11,
          c: 12,
          d: 13,
          e: 14,
          f: 15,
        },
        r = [..."0123456789ABCDEF"],
        h1 = (t) => r[15 & t],
        h2 = (t) => r[(240 & t) >> 4] + r[15 & t],
        eq = (t) => (240 & t) >> 4 == (15 & t),
        isShort = (t) => eq(t.r) && eq(t.g) && eq(t.b) && eq(t.a);
      function hexParse(t) {
        var e,
          i = t.length;
        return (
          "#" === t[0] &&
            (4 === i || 5 === i
              ? (e = {
                  r: 255 & (17 * n[t[1]]),
                  g: 255 & (17 * n[t[2]]),
                  b: 255 & (17 * n[t[3]]),
                  a: 5 === i ? 17 * n[t[4]] : 255,
                })
              : (7 === i || 9 === i) &&
                (e = {
                  r: (n[t[1]] << 4) | n[t[2]],
                  g: (n[t[3]] << 4) | n[t[4]],
                  b: (n[t[5]] << 4) | n[t[6]],
                  a: 9 === i ? (n[t[7]] << 4) | n[t[8]] : 255,
                })),
          e
        );
      }
      let alpha = (t, e) => (t < 255 ? e(t) : "");
      function hexString(t) {
        var e = isShort(t) ? h1 : h2;
        return t ? "#" + e(t.r) + e(t.g) + e(t.b) + alpha(t.a, e) : void 0;
      }
      let o =
        /^(hsla?|hwb|hsv)\(\s*([-+.e\d]+)(?:deg)?[\s,]+([-+.e\d]+)%[\s,]+([-+.e\d]+)%(?:[\s,]+([-+.e\d]+)(%)?)?\s*\)$/;
      function hsl2rgbn(t, e, i) {
        let s = e * Math.min(i, 1 - i),
          f = (e, a = (e + t / 30) % 12) =>
            i - s * Math.max(Math.min(a - 3, 9 - a, 1), -1);
        return [f(0), f(8), f(4)];
      }
      function hsv2rgbn(t, e, i) {
        let f = (s, a = (s + t / 60) % 6) =>
          i - i * e * Math.max(Math.min(a, 4 - a, 1), 0);
        return [f(5), f(3), f(1)];
      }
      function hwb2rgbn(t, e, i) {
        let s,
          a = hsl2rgbn(t, 1, 0.5);
        for (
          e + i > 1 && ((s = 1 / (e + i)), (e *= s), (i *= s)), s = 0;
          s < 3;
          s++
        )
          (a[s] *= 1 - e - i), (a[s] += e);
        return a;
      }
      function hueValue(t, e, i, s, a) {
        return t === a
          ? (e - i) / s + 6 * (e < i)
          : e === a
          ? (i - t) / s + 2
          : (t - e) / s + 4;
      }
      function rgb2hsl(t) {
        let e,
          i,
          s,
          a = t.r / 255,
          n = t.g / 255,
          r = t.b / 255,
          o = Math.max(a, n, r),
          l = Math.min(a, n, r),
          h = (o + l) / 2;
        return (
          o !== l &&
            ((s = o - l),
            (i = h > 0.5 ? s / (2 - o - l) : s / (o + l)),
            (e = 60 * (e = hueValue(a, n, r, s, o)) + 0.5)),
          [0 | e, i || 0, h]
        );
      }
      function calln(t, e, i, s) {
        return (Array.isArray(e) ? t(e[0], e[1], e[2]) : t(e, i, s)).map(n2b);
      }
      function hwb2rgb(t, e, i) {
        return calln(hwb2rgbn, t, e, i);
      }
      function hsv2rgb(t, e, i) {
        return calln(hsv2rgbn, t, e, i);
      }
      function hue(t) {
        return ((t % 360) + 360) % 360;
      }
      function hueParse(t) {
        let e,
          i = o.exec(t),
          s = 255;
        if (!i) return;
        i[5] !== e && (s = i[6] ? p2b(+i[5]) : n2b(+i[5]));
        let a = hue(+i[2]),
          n = +i[3] / 100,
          r = +i[4] / 100;
        return {
          r: (e =
            "hwb" === i[1]
              ? hwb2rgb(a, n, r)
              : "hsv" === i[1]
              ? hsv2rgb(a, n, r)
              : calln(hsl2rgbn, a, n, r))[0],
          g: e[1],
          b: e[2],
          a: s,
        };
      }
      function rotate(t, e) {
        var i = rgb2hsl(t);
        (i[0] = hue(i[0] + e)),
          (t.r = (i = calln(hsl2rgbn, i, void 0, void 0))[0]),
          (t.g = i[1]),
          (t.b = i[2]);
      }
      function hslString(t) {
        if (!t) return;
        let e = rgb2hsl(t),
          i = e[0],
          s = n2p(e[1]),
          a = n2p(e[2]);
        return t.a < 255
          ? `hsla(${i}, ${s}%, ${a}%, ${b2n(t.a)})`
          : `hsl(${i}, ${s}%, ${a}%)`;
      }
      let l = {
          x: "dark",
          Z: "light",
          Y: "re",
          X: "blu",
          W: "gr",
          V: "medium",
          U: "slate",
          A: "ee",
          T: "ol",
          S: "or",
          B: "ra",
          C: "lateg",
          D: "ights",
          R: "in",
          Q: "turquois",
          E: "hi",
          P: "ro",
          O: "al",
          N: "le",
          M: "de",
          L: "yello",
          F: "en",
          K: "ch",
          G: "arks",
          H: "ea",
          I: "ightg",
          J: "wh",
        },
        h = {
          OiceXe: "f0f8ff",
          antiquewEte: "faebd7",
          aqua: "ffff",
          aquamarRe: "7fffd4",
          azuY: "f0ffff",
          beige: "f5f5dc",
          bisque: "ffe4c4",
          black: "0",
          blanKedOmond: "ffebcd",
          Xe: "ff",
          XeviTet: "8a2be2",
          bPwn: "a52a2a",
          burlywood: "deb887",
          caMtXe: "5f9ea0",
          KartYuse: "7fff00",
          KocTate: "d2691e",
          cSO: "ff7f50",
          cSnflowerXe: "6495ed",
          cSnsilk: "fff8dc",
          crimson: "dc143c",
          cyan: "ffff",
          xXe: "8b",
          xcyan: "8b8b",
          xgTMnPd: "b8860b",
          xWay: "a9a9a9",
          xgYF: "6400",
          xgYy: "a9a9a9",
          xkhaki: "bdb76b",
          xmagFta: "8b008b",
          xTivegYF: "556b2f",
          xSange: "ff8c00",
          xScEd: "9932cc",
          xYd: "8b0000",
          xsOmon: "e9967a",
          xsHgYF: "8fbc8f",
          xUXe: "483d8b",
          xUWay: "2f4f4f",
          xUgYy: "2f4f4f",
          xQe: "ced1",
          xviTet: "9400d3",
          dAppRk: "ff1493",
          dApskyXe: "bfff",
          dimWay: "696969",
          dimgYy: "696969",
          dodgerXe: "1e90ff",
          fiYbrick: "b22222",
          flSOwEte: "fffaf0",
          foYstWAn: "228b22",
          fuKsia: "ff00ff",
          gaRsbSo: "dcdcdc",
          ghostwEte: "f8f8ff",
          gTd: "ffd700",
          gTMnPd: "daa520",
          Way: "808080",
          gYF: "8000",
          gYFLw: "adff2f",
          gYy: "808080",
          honeyMw: "f0fff0",
          hotpRk: "ff69b4",
          RdianYd: "cd5c5c",
          Rdigo: "4b0082",
          ivSy: "fffff0",
          khaki: "f0e68c",
          lavFMr: "e6e6fa",
          lavFMrXsh: "fff0f5",
          lawngYF: "7cfc00",
          NmoncEffon: "fffacd",
          ZXe: "add8e6",
          ZcSO: "f08080",
          Zcyan: "e0ffff",
          ZgTMnPdLw: "fafad2",
          ZWay: "d3d3d3",
          ZgYF: "90ee90",
          ZgYy: "d3d3d3",
          ZpRk: "ffb6c1",
          ZsOmon: "ffa07a",
          ZsHgYF: "20b2aa",
          ZskyXe: "87cefa",
          ZUWay: "778899",
          ZUgYy: "778899",
          ZstAlXe: "b0c4de",
          ZLw: "ffffe0",
          lime: "ff00",
          limegYF: "32cd32",
          lRF: "faf0e6",
          magFta: "ff00ff",
          maPon: "800000",
          VaquamarRe: "66cdaa",
          VXe: "cd",
          VScEd: "ba55d3",
          VpurpN: "9370db",
          VsHgYF: "3cb371",
          VUXe: "7b68ee",
          VsprRggYF: "fa9a",
          VQe: "48d1cc",
          VviTetYd: "c71585",
          midnightXe: "191970",
          mRtcYam: "f5fffa",
          mistyPse: "ffe4e1",
          moccasR: "ffe4b5",
          navajowEte: "ffdead",
          navy: "80",
          Tdlace: "fdf5e6",
          Tive: "808000",
          TivedBb: "6b8e23",
          Sange: "ffa500",
          SangeYd: "ff4500",
          ScEd: "da70d6",
          pOegTMnPd: "eee8aa",
          pOegYF: "98fb98",
          pOeQe: "afeeee",
          pOeviTetYd: "db7093",
          papayawEp: "ffefd5",
          pHKpuff: "ffdab9",
          peru: "cd853f",
          pRk: "ffc0cb",
          plum: "dda0dd",
          powMrXe: "b0e0e6",
          purpN: "800080",
          YbeccapurpN: "663399",
          Yd: "ff0000",
          Psybrown: "bc8f8f",
          PyOXe: "4169e1",
          saddNbPwn: "8b4513",
          sOmon: "fa8072",
          sandybPwn: "f4a460",
          sHgYF: "2e8b57",
          sHshell: "fff5ee",
          siFna: "a0522d",
          silver: "c0c0c0",
          skyXe: "87ceeb",
          UXe: "6a5acd",
          UWay: "708090",
          UgYy: "708090",
          snow: "fffafa",
          sprRggYF: "ff7f",
          stAlXe: "4682b4",
          tan: "d2b48c",
          teO: "8080",
          tEstN: "d8bfd8",
          tomato: "ff6347",
          Qe: "40e0d0",
          viTet: "ee82ee",
          JHt: "f5deb3",
          wEte: "ffffff",
          wEtesmoke: "f5f5f5",
          Lw: "ffff00",
          LwgYF: "9acd32",
        };
      function unpack() {
        let t,
          e,
          i,
          s,
          a,
          n = {},
          r = Object.keys(h),
          o = Object.keys(l);
        for (t = 0; t < r.length; t++) {
          for (e = 0, s = a = r[t]; e < o.length; e++)
            (i = o[e]), (a = a.replace(i, l[i]));
          (i = parseInt(h[s], 16)),
            (n[a] = [(i >> 16) & 255, (i >> 8) & 255, 255 & i]);
        }
        return n;
      }
      function nameParse(t) {
        s || ((s = unpack()).transparent = [0, 0, 0, 0]);
        let e = s[t.toLowerCase()];
        return (
          e && { r: e[0], g: e[1], b: e[2], a: 4 === e.length ? e[3] : 255 }
        );
      }
      let c =
        /^rgba?\(\s*([-+.\d]+)(%)?[\s,]+([-+.e\d]+)(%)?[\s,]+([-+.e\d]+)(%)?(?:[\s,/]+([-+.e\d]+)(%)?)?\s*\)$/;
      function rgbParse(t) {
        let e,
          i,
          s,
          a = c.exec(t),
          n = 255;
        if (a) {
          if (a[7] !== e) {
            let t = +a[7];
            n = a[8] ? p2b(t) : lim(255 * t, 0, 255);
          }
          return (
            (e = +a[1]),
            (i = +a[3]),
            (s = +a[5]),
            (e = 255 & (a[2] ? p2b(e) : lim(e, 0, 255))),
            {
              r: e,
              g: (i = 255 & (a[4] ? p2b(i) : lim(i, 0, 255))),
              b: (s = 255 & (a[6] ? p2b(s) : lim(s, 0, 255))),
              a: n,
            }
          );
        }
      }
      function rgbString(t) {
        return (
          t &&
          (t.a < 255
            ? `rgba(${t.r}, ${t.g}, ${t.b}, ${b2n(t.a)})`
            : `rgb(${t.r}, ${t.g}, ${t.b})`)
        );
      }
      let to = (t) =>
          t <= 0.0031308 ? 12.92 * t : 1.055 * Math.pow(t, 1 / 2.4) - 0.055,
        from = (t) =>
          t <= 0.04045 ? t / 12.92 : Math.pow((t + 0.055) / 1.055, 2.4);
      function interpolate(t, e, i) {
        let s = from(b2n(t.r)),
          a = from(b2n(t.g)),
          n = from(b2n(t.b));
        return {
          r: n2b(to(s + i * (from(b2n(e.r)) - s))),
          g: n2b(to(a + i * (from(b2n(e.g)) - a))),
          b: n2b(to(n + i * (from(b2n(e.b)) - n))),
          a: t.a + i * (e.a - t.a),
        };
      }
      function modHSL(t, e, i) {
        if (t) {
          let s = rgb2hsl(t);
          (s[e] = Math.max(0, Math.min(s[e] + s[e] * i, 0 === e ? 360 : 1))),
            (t.r = (s = calln(hsl2rgbn, s, void 0, void 0))[0]),
            (t.g = s[1]),
            (t.b = s[2]);
        }
      }
      function clone(t, e) {
        return t ? Object.assign(e || {}, t) : t;
      }
      function fromObject(t) {
        var e = { r: 0, g: 0, b: 0, a: 255 };
        return (
          Array.isArray(t)
            ? t.length >= 3 &&
              ((e = { r: t[0], g: t[1], b: t[2], a: 255 }),
              t.length > 3 && (e.a = n2b(t[3])))
            : ((e = clone(t, { r: 0, g: 0, b: 0, a: 1 })).a = n2b(e.a)),
          e
        );
      }
      function functionParse(t) {
        return "r" === t.charAt(0) ? rgbParse(t) : hueParse(t);
      }
      let Color = class Color {
        constructor(t) {
          let e;
          if (t instanceof Color) return t;
          let i = typeof t;
          "object" === i
            ? (e = fromObject(t))
            : "string" === i &&
              (e = hexParse(t) || nameParse(t) || functionParse(t)),
            (this._rgb = e),
            (this._valid = !!e);
        }
        get valid() {
          return this._valid;
        }
        get rgb() {
          var t = clone(this._rgb);
          return t && (t.a = b2n(t.a)), t;
        }
        set rgb(t) {
          this._rgb = fromObject(t);
        }
        rgbString() {
          return this._valid ? rgbString(this._rgb) : void 0;
        }
        hexString() {
          return this._valid ? hexString(this._rgb) : void 0;
        }
        hslString() {
          return this._valid ? hslString(this._rgb) : void 0;
        }
        mix(t, e) {
          if (t) {
            let i,
              s = this.rgb,
              a = t.rgb,
              n = e === i ? 0.5 : e,
              r = 2 * n - 1,
              o = s.a - a.a,
              l = ((r * o == -1 ? r : (r + o) / (1 + r * o)) + 1) / 2;
            (i = 1 - l),
              (s.r = 255 & (l * s.r + i * a.r + 0.5)),
              (s.g = 255 & (l * s.g + i * a.g + 0.5)),
              (s.b = 255 & (l * s.b + i * a.b + 0.5)),
              (s.a = n * s.a + (1 - n) * a.a),
              (this.rgb = s);
          }
          return this;
        }
        interpolate(t, e) {
          return t && (this._rgb = interpolate(this._rgb, t._rgb, e)), this;
        }
        clone() {
          return new Color(this.rgb);
        }
        alpha(t) {
          return (this._rgb.a = n2b(t)), this;
        }
        clearer(t) {
          let e = this._rgb;
          return (e.a *= 1 - t), this;
        }
        greyscale() {
          let t = this._rgb,
            e = round(0.3 * t.r + 0.59 * t.g + 0.11 * t.b);
          return (t.r = t.g = t.b = e), this;
        }
        opaquer(t) {
          let e = this._rgb;
          return (e.a *= 1 + t), this;
        }
        negate() {
          let t = this._rgb;
          return (t.r = 255 - t.r), (t.g = 255 - t.g), (t.b = 255 - t.b), this;
        }
        lighten(t) {
          return modHSL(this._rgb, 2, t), this;
        }
        darken(t) {
          return modHSL(this._rgb, 2, -t), this;
        }
        saturate(t) {
          return modHSL(this._rgb, 1, t), this;
        }
        desaturate(t) {
          return modHSL(this._rgb, 1, -t), this;
        }
        rotate(t) {
          return rotate(this._rgb, t), this;
        }
      };
      function noop() {}
      let d = ((a = 0), () => a++);
      function isNullOrUndef(t) {
        return null == t;
      }
      function isArray(t) {
        if (Array.isArray && Array.isArray(t)) return !0;
        let e = Object.prototype.toString.call(t);
        return "[object" === e.slice(0, 7) && "Array]" === e.slice(-6);
      }
      function isObject(t) {
        return (
          null !== t && "[object Object]" === Object.prototype.toString.call(t)
        );
      }
      function isNumberFinite(t) {
        return ("number" == typeof t || t instanceof Number) && isFinite(+t);
      }
      function finiteOrDefault(t, e) {
        return isNumberFinite(t) ? t : e;
      }
      function valueOrDefault(t, e) {
        return void 0 === t ? e : t;
      }
      let toPercentage = (t, e) =>
          "string" == typeof t && t.endsWith("%")
            ? parseFloat(t) / 100
            : +t / e,
        toDimension = (t, e) =>
          "string" == typeof t && t.endsWith("%")
            ? (parseFloat(t) / 100) * e
            : +t;
      function helpers_segment_callback(t, e, i) {
        if (t && "function" == typeof t.call) return t.apply(i, e);
      }
      function each(t, e, i, s) {
        let a, n, r;
        if (isArray(t))
          if (((n = t.length), s))
            for (a = n - 1; a >= 0; a--) e.call(i, t[a], a);
          else for (a = 0; a < n; a++) e.call(i, t[a], a);
        else if (isObject(t))
          for (a = 0, n = (r = Object.keys(t)).length; a < n; a++)
            e.call(i, t[r[a]], r[a]);
      }
      function _elementsEqual(t, e) {
        let i, s, a, n;
        if (!t || !e || t.length !== e.length) return !1;
        for (i = 0, s = t.length; i < s; ++i)
          if (
            ((a = t[i]),
            (n = e[i]),
            a.datasetIndex !== n.datasetIndex || a.index !== n.index)
          )
            return !1;
        return !0;
      }
      function helpers_segment_clone(t) {
        if (isArray(t)) return t.map(helpers_segment_clone);
        if (isObject(t)) {
          let e = Object.create(null),
            i = Object.keys(t),
            s = i.length,
            a = 0;
          for (; a < s; ++a) e[i[a]] = helpers_segment_clone(t[i[a]]);
          return e;
        }
        return t;
      }
      function isValidKey(t) {
        return -1 === ["__proto__", "prototype", "constructor"].indexOf(t);
      }
      function _merger(t, e, i, s) {
        if (!isValidKey(t)) return;
        let a = e[t],
          n = i[t];
        isObject(a) && isObject(n)
          ? merge(a, n, s)
          : (e[t] = helpers_segment_clone(n));
      }
      function merge(t, e, i) {
        let s,
          a = isArray(e) ? e : [e],
          n = a.length;
        if (!isObject(t)) return t;
        let r = (i = i || {}).merger || _merger;
        for (let e = 0; e < n; ++e) {
          if (!isObject((s = a[e]))) continue;
          let n = Object.keys(s);
          for (let e = 0, a = n.length; e < a; ++e) r(n[e], t, s, i);
        }
        return t;
      }
      function mergeIf(t, e) {
        return merge(t, e, { merger: _mergerIf });
      }
      function _mergerIf(t, e, i) {
        if (!isValidKey(t)) return;
        let s = e[t],
          a = i[t];
        isObject(s) && isObject(a)
          ? mergeIf(s, a)
          : Object.prototype.hasOwnProperty.call(e, t) ||
            (e[t] = helpers_segment_clone(a));
      }
      let u = { "": (t) => t, x: (t) => t.x, y: (t) => t.y };
      function _splitKey(t) {
        let e = t.split("."),
          i = [],
          s = "";
        for (let t of e)
          (s += t).endsWith("\\")
            ? (s = s.slice(0, -1) + ".")
            : (i.push(s), (s = ""));
        return i;
      }
      function _getKeyResolver(t) {
        let e = _splitKey(t);
        return (t) => {
          for (let i of e) {
            if ("" === i) break;
            t = t && t[i];
          }
          return t;
        };
      }
      function resolveObjectKey(t, e) {
        return (u[e] || (u[e] = _getKeyResolver(e)))(t);
      }
      function _capitalize(t) {
        return t.charAt(0).toUpperCase() + t.slice(1);
      }
      let defined = (t) => void 0 !== t,
        isFunction = (t) => "function" == typeof t,
        setsEqual = (t, e) => {
          if (t.size !== e.size) return !1;
          for (let i of t) if (!e.has(i)) return !1;
          return !0;
        };
      function _isClickEvent(t) {
        return (
          "mouseup" === t.type || "click" === t.type || "contextmenu" === t.type
        );
      }
      let g = Math.PI,
        p = 2 * g,
        m = p + g,
        b = Number.POSITIVE_INFINITY,
        x = g / 180,
        _ = g / 2,
        y = g / 4,
        v = (2 * g) / 3,
        k = Math.log10,
        M = Math.sign;
      function almostEquals(t, e, i) {
        return Math.abs(t - e) < i;
      }
      function niceNum(t) {
        let e = Math.round(t),
          i = Math.pow(
            10,
            Math.floor(k((t = almostEquals(t, e, t / 1e3) ? e : t)))
          ),
          s = t / i;
        return (s <= 1 ? 1 : s <= 2 ? 2 : s <= 5 ? 5 : 10) * i;
      }
      function _factorize(t) {
        let e,
          i = [],
          s = Math.sqrt(t);
        for (e = 1; e < s; e++) t % e == 0 && (i.push(e), i.push(t / e));
        return s === (0 | s) && i.push(s), i.sort((t, e) => t - e).pop(), i;
      }
      function isNonPrimitive(t) {
        return (
          "symbol" == typeof t ||
          ("object" == typeof t &&
            null !== t &&
            !(Symbol.toPrimitive in t || "toString" in t || "valueOf" in t))
        );
      }
      function isNumber(t) {
        return !isNonPrimitive(t) && !isNaN(parseFloat(t)) && isFinite(t);
      }
      function almostWhole(t, e) {
        let i = Math.round(t);
        return i - e <= t && i + e >= t;
      }
      function _setMinAndMaxByKey(t, e, i) {
        let s, a, n;
        for (s = 0, a = t.length; s < a; s++)
          isNaN((n = t[s][i])) ||
            ((e.min = Math.min(e.min, n)), (e.max = Math.max(e.max, n)));
      }
      function toRadians(t) {
        return (g / 180) * t;
      }
      function toDegrees(t) {
        return (180 / g) * t;
      }
      function _decimalPlaces(t) {
        if (!isNumberFinite(t)) return;
        let e = 1,
          i = 0;
        for (; Math.round(t * e) / e !== t; ) (e *= 10), i++;
        return i;
      }
      function getAngleFromPoint(t, e) {
        let i = e.x - t.x,
          s = e.y - t.y,
          a = Math.sqrt(i * i + s * s),
          n = Math.atan2(s, i);
        return n < -0.5 * g && (n += p), { angle: n, distance: a };
      }
      function distanceBetweenPoints(t, e) {
        return Math.sqrt(Math.pow(e.x - t.x, 2) + Math.pow(e.y - t.y, 2));
      }
      function _angleDiff(t, e) {
        return ((t - e + m) % p) - g;
      }
      function _normalizeAngle(t) {
        return ((t % p) + p) % p;
      }
      function _angleBetween(t, e, i, s) {
        let a = _normalizeAngle(t),
          n = _normalizeAngle(e),
          r = _normalizeAngle(i),
          o = _normalizeAngle(n - a),
          l = _normalizeAngle(r - a),
          h = _normalizeAngle(a - n),
          c = _normalizeAngle(a - r);
        return a === n || a === r || (s && n === r) || (o > l && h < c);
      }
      function _limitValue(t, e, i) {
        return Math.max(e, Math.min(i, t));
      }
      function _int16Range(t) {
        return _limitValue(t, -32768, 32767);
      }
      function _isBetween(t, e, i, s = 1e-6) {
        return t >= Math.min(e, i) - s && t <= Math.max(e, i) + s;
      }
      function _lookup(t, e, i) {
        let s;
        i = i || ((i) => t[i] < e);
        let a = t.length - 1,
          n = 0;
        for (; a - n > 1; ) i((s = (n + a) >> 1)) ? (n = s) : (a = s);
        return { lo: n, hi: a };
      }
      let _lookupByKey = (t, e, i, s) =>
          _lookup(
            t,
            i,
            s
              ? (s) => {
                  let a = t[s][e];
                  return a < i || (a === i && t[s + 1][e] === i);
                }
              : (s) => t[s][e] < i
          ),
        _rlookupByKey = (t, e, i) => _lookup(t, i, (s) => t[s][e] >= i);
      function _filterBetween(t, e, i) {
        let s = 0,
          a = t.length;
        for (; s < a && t[s] < e; ) s++;
        for (; a > s && t[a - 1] > i; ) a--;
        return s > 0 || a < t.length ? t.slice(s, a) : t;
      }
      let S = ["push", "pop", "shift", "splice", "unshift"];
      function listenArrayEvents(t, e) {
        if (t._chartjs) return void t._chartjs.listeners.push(e);
        Object.defineProperty(t, "_chartjs", {
          configurable: !0,
          enumerable: !1,
          value: { listeners: [e] },
        }),
          S.forEach((e) => {
            let i = "_onData" + _capitalize(e),
              s = t[e];
            Object.defineProperty(t, e, {
              configurable: !0,
              enumerable: !1,
              value(...e) {
                let a = s.apply(this, e);
                return (
                  t._chartjs.listeners.forEach((t) => {
                    "function" == typeof t[i] && t[i](...e);
                  }),
                  a
                );
              },
            });
          });
      }
      function unlistenArrayEvents(t, e) {
        let i = t._chartjs;
        if (!i) return;
        let s = i.listeners,
          a = s.indexOf(e);
        -1 !== a && s.splice(a, 1),
          s.length > 0 ||
            (S.forEach((e) => {
              delete t[e];
            }),
            delete t._chartjs);
      }
      function _arrayUnique(t) {
        let e = new Set(t);
        return e.size === t.length ? t : Array.from(e);
      }
      let w =
        "undefined" == typeof window
          ? function (t) {
              return t();
            }
          : window.requestAnimationFrame;
      function throttled(t, e) {
        let i = [],
          s = !1;
        return function (...a) {
          (i = a),
            s ||
              ((s = !0),
              w.call(window, () => {
                (s = !1), t.apply(e, i);
              }));
        };
      }
      function debounce(t, e) {
        let i;
        return function (...s) {
          return (
            e ? (clearTimeout(i), (i = setTimeout(t, e, s))) : t.apply(this, s),
            e
          );
        };
      }
      let _toLeftRightCenter = (t) =>
          "start" === t ? "left" : "end" === t ? "right" : "center",
        _alignStartEnd = (t, e, i) =>
          "start" === t ? e : "end" === t ? i : (e + i) / 2,
        _textX = (t, e, i, s) =>
          t === (s ? "left" : "right") ? i : "center" === t ? (e + i) / 2 : e;
      function _getStartAndCountOfVisiblePoints(t, e, i) {
        let s = e.length,
          a = 0,
          n = s;
        if (t._sorted) {
          let { iScale: r, vScale: o, _parsed: l } = t,
            h =
              t.dataset && t.dataset.options
                ? t.dataset.options.spanGaps
                : null,
            c = r.axis,
            {
              min: d,
              max: u,
              minDefined: g,
              maxDefined: p,
            } = r.getUserBounds();
          if (g) {
            if (
              ((a = Math.min(
                _lookupByKey(l, c, d).lo,
                i ? s : _lookupByKey(e, c, r.getPixelForValue(d)).lo
              )),
              h)
            ) {
              let t = l
                .slice(0, a + 1)
                .reverse()
                .findIndex((t) => !isNullOrUndef(t[o.axis]));
              a -= Math.max(0, t);
            }
            a = _limitValue(a, 0, s - 1);
          }
          if (p) {
            let t = Math.max(
              _lookupByKey(l, r.axis, u, !0).hi + 1,
              i ? 0 : _lookupByKey(e, c, r.getPixelForValue(u), !0).hi + 1
            );
            if (h) {
              let e = l
                .slice(t - 1)
                .findIndex((t) => !isNullOrUndef(t[o.axis]));
              t += Math.max(0, e);
            }
            n = _limitValue(t, a, s) - a;
          } else n = s - a;
        }
        return { start: a, count: n };
      }
      function _scaleRangesChanged(t) {
        let { xScale: e, yScale: i, _scaleRanges: s } = t,
          a = { xmin: e.min, xmax: e.max, ymin: i.min, ymax: i.max };
        if (!s) return (t._scaleRanges = a), !0;
        let n =
          s.xmin !== e.min ||
          s.xmax !== e.max ||
          s.ymin !== i.min ||
          s.ymax !== i.max;
        return Object.assign(s, a), n;
      }
      let atEdge = (t) => 0 === t || 1 === t,
        elasticIn = (t, e, i) =>
          -(Math.pow(2, 10 * (t -= 1)) * Math.sin(((t - e) * p) / i)),
        elasticOut = (t, e, i) =>
          Math.pow(2, -10 * t) * Math.sin(((t - e) * p) / i) + 1,
        P = {
          linear: (t) => t,
          easeInQuad: (t) => t * t,
          easeOutQuad: (t) => -t * (t - 2),
          easeInOutQuad: (t) =>
            (t /= 0.5) < 1 ? 0.5 * t * t : -0.5 * (--t * (t - 2) - 1),
          easeInCubic: (t) => t * t * t,
          easeOutCubic: (t) => (t -= 1) * t * t + 1,
          easeInOutCubic: (t) =>
            (t /= 0.5) < 1 ? 0.5 * t * t * t : 0.5 * ((t -= 2) * t * t + 2),
          easeInQuart: (t) => t * t * t * t,
          easeOutQuart: (t) => -((t -= 1) * t * t * t - 1),
          easeInOutQuart: (t) =>
            (t /= 0.5) < 1
              ? 0.5 * t * t * t * t
              : -0.5 * ((t -= 2) * t * t * t - 2),
          easeInQuint: (t) => t * t * t * t * t,
          easeOutQuint: (t) => (t -= 1) * t * t * t * t + 1,
          easeInOutQuint: (t) =>
            (t /= 0.5) < 1
              ? 0.5 * t * t * t * t * t
              : 0.5 * ((t -= 2) * t * t * t * t + 2),
          easeInSine: (t) => -Math.cos(t * _) + 1,
          easeOutSine: (t) => Math.sin(t * _),
          easeInOutSine: (t) => -0.5 * (Math.cos(g * t) - 1),
          easeInExpo: (t) => (0 === t ? 0 : Math.pow(2, 10 * (t - 1))),
          easeOutExpo: (t) => (1 === t ? 1 : -Math.pow(2, -10 * t) + 1),
          easeInOutExpo: (t) =>
            atEdge(t)
              ? t
              : t < 0.5
              ? 0.5 * Math.pow(2, 10 * (2 * t - 1))
              : 0.5 * (-Math.pow(2, -10 * (2 * t - 1)) + 2),
          easeInCirc: (t) => (t >= 1 ? t : -(Math.sqrt(1 - t * t) - 1)),
          easeOutCirc: (t) => Math.sqrt(1 - (t -= 1) * t),
          easeInOutCirc: (t) =>
            (t /= 0.5) < 1
              ? -0.5 * (Math.sqrt(1 - t * t) - 1)
              : 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1),
          easeInElastic: (t) => (atEdge(t) ? t : elasticIn(t, 0.075, 0.3)),
          easeOutElastic: (t) => (atEdge(t) ? t : elasticOut(t, 0.075, 0.3)),
          easeInOutElastic: (t) =>
            atEdge(t)
              ? t
              : t < 0.5
              ? 0.5 * elasticIn(2 * t, 0.1125, 0.45)
              : 0.5 + 0.5 * elasticOut(2 * t - 1, 0.1125, 0.45),
          easeInBack: (t) => t * t * (2.70158 * t - 1.70158),
          easeOutBack: (t) => (t -= 1) * t * (2.70158 * t + 1.70158) + 1,
          easeInOutBack(t) {
            let e = 1.70158;
            return (t /= 0.5) < 1
              ? 0.5 * (t * t * (((e *= 1.525) + 1) * t - e))
              : 0.5 * ((t -= 2) * t * (((e *= 1.525) + 1) * t + e) + 2);
          },
          easeInBounce: (t) => 1 - P.easeOutBounce(1 - t),
          easeOutBounce: (t) =>
            t < 0.36363636363636365
              ? 7.5625 * t * t
              : t < 0.7272727272727273
              ? 7.5625 * (t -= 0.5454545454545454) * t + 0.75
              : t < 0.9090909090909091
              ? 7.5625 * (t -= 0.8181818181818182) * t + 0.9375
              : 7.5625 * (t -= 0.9545454545454546) * t + 0.984375,
          easeInOutBounce: (t) =>
            t < 0.5
              ? 0.5 * P.easeInBounce(2 * t)
              : 0.5 * P.easeOutBounce(2 * t - 1) + 0.5,
        };
      function isPatternOrGradient(t) {
        if (t && "object" == typeof t) {
          let e = t.toString();
          return (
            "[object CanvasPattern]" === e || "[object CanvasGradient]" === e
          );
        }
        return !1;
      }
      function helpers_segment_color(t) {
        return isPatternOrGradient(t) ? t : new Color(t);
      }
      function getHoverColor(t) {
        return isPatternOrGradient(t)
          ? t
          : new Color(t).saturate(0.5).darken(0.1).hexString();
      }
      let C = ["x", "y", "borderWidth", "radius", "tension"],
        D = ["color", "borderColor", "backgroundColor"];
      function applyAnimationsDefaults(t) {
        t.set("animation", {
          delay: void 0,
          duration: 1e3,
          easing: "easeOutQuart",
          fn: void 0,
          from: void 0,
          loop: void 0,
          to: void 0,
          type: void 0,
        }),
          t.describe("animation", {
            _fallback: !1,
            _indexable: !1,
            _scriptable: (t) =>
              "onProgress" !== t && "onComplete" !== t && "fn" !== t,
          }),
          t.set("animations", {
            colors: { type: "color", properties: D },
            numbers: { type: "number", properties: C },
          }),
          t.describe("animations", { _fallback: "animation" }),
          t.set("transitions", {
            active: { animation: { duration: 400 } },
            resize: { animation: { duration: 0 } },
            show: {
              animations: {
                colors: { from: "transparent" },
                visible: { type: "boolean", duration: 0 },
              },
            },
            hide: {
              animations: {
                colors: { to: "transparent" },
                visible: {
                  type: "boolean",
                  easing: "linear",
                  fn: (t) => 0 | t,
                },
              },
            },
          });
      }
      function applyLayoutsDefaults(t) {
        t.set("layout", {
          autoPadding: !0,
          padding: { top: 0, right: 0, bottom: 0, left: 0 },
        });
      }
      let O = new Map();
      function getNumberFormat(t, e) {
        let i = t + JSON.stringify((e = e || {})),
          s = O.get(i);
        return s || ((s = new Intl.NumberFormat(t, e)), O.set(i, s)), s;
      }
      function formatNumber(t, e, i) {
        return getNumberFormat(e, i).format(t);
      }
      let A = {
        values: (t) => (isArray(t) ? t : "" + t),
        numeric(t, e, i) {
          let s;
          if (0 === t) return "0";
          let a = this.chart.options.locale,
            n = t;
          if (i.length > 1) {
            let e = Math.max(
              Math.abs(i[0].value),
              Math.abs(i[i.length - 1].value)
            );
            (e < 1e-4 || e > 1e15) && (s = "scientific"),
              (n = calculateDelta(t, i));
          }
          let r = k(Math.abs(n)),
            o = isNaN(r) ? 1 : Math.max(Math.min(-1 * Math.floor(r), 20), 0),
            l = {
              notation: s,
              minimumFractionDigits: o,
              maximumFractionDigits: o,
            };
          return (
            Object.assign(l, this.options.ticks.format), formatNumber(t, a, l)
          );
        },
        logarithmic(t, e, i) {
          return 0 === t
            ? "0"
            : [1, 2, 3, 5, 10, 15].includes(
                i[e].significand || t / Math.pow(10, Math.floor(k(t)))
              ) || e > 0.8 * i.length
            ? A.numeric.call(this, t, e, i)
            : "";
        },
      };
      function calculateDelta(t, e) {
        let i =
          e.length > 3 ? e[2].value - e[1].value : e[1].value - e[0].value;
        return (
          Math.abs(i) >= 1 && t !== Math.floor(t) && (i = t - Math.floor(t)), i
        );
      }
      var T = { formatters: A };
      function applyScaleDefaults(t) {
        t.set("scale", {
          display: !0,
          offset: !1,
          reverse: !1,
          beginAtZero: !1,
          bounds: "ticks",
          clip: !0,
          grace: 0,
          grid: {
            display: !0,
            lineWidth: 1,
            drawOnChartArea: !0,
            drawTicks: !0,
            tickLength: 8,
            tickWidth: (t, e) => e.lineWidth,
            tickColor: (t, e) => e.color,
            offset: !1,
          },
          border: { display: !0, dash: [], dashOffset: 0, width: 1 },
          title: { display: !1, text: "", padding: { top: 4, bottom: 4 } },
          ticks: {
            minRotation: 0,
            maxRotation: 50,
            mirror: !1,
            textStrokeWidth: 0,
            textStrokeColor: "",
            padding: 3,
            display: !0,
            autoSkip: !0,
            autoSkipPadding: 3,
            labelOffset: 0,
            callback: T.formatters.values,
            minor: {},
            major: {},
            align: "center",
            crossAlign: "near",
            showLabelBackdrop: !1,
            backdropColor: "rgba(255, 255, 255, 0.75)",
            backdropPadding: 2,
          },
        }),
          t.route("scale.ticks", "color", "", "color"),
          t.route("scale.grid", "color", "", "borderColor"),
          t.route("scale.border", "color", "", "borderColor"),
          t.route("scale.title", "color", "", "color"),
          t.describe("scale", {
            _fallback: !1,
            _scriptable: (t) =>
              !t.startsWith("before") &&
              !t.startsWith("after") &&
              "callback" !== t &&
              "parser" !== t,
            _indexable: (t) =>
              "borderDash" !== t && "tickBorderDash" !== t && "dash" !== t,
          }),
          t.describe("scales", { _fallback: "scale" }),
          t.describe("scale.ticks", {
            _scriptable: (t) => "backdropPadding" !== t && "callback" !== t,
            _indexable: (t) => "backdropPadding" !== t,
          });
      }
      let L = Object.create(null),
        F = Object.create(null);
      function getScope$1(t, e) {
        if (!e) return t;
        let i = e.split(".");
        for (let e = 0, s = i.length; e < s; ++e) {
          let s = i[e];
          t = t[s] || (t[s] = Object.create(null));
        }
        return t;
      }
      function helpers_segment_set(t, e, i) {
        return "string" == typeof e
          ? merge(getScope$1(t, e), i)
          : merge(getScope$1(t, ""), e);
      }
      let Defaults = class Defaults {
        constructor(t, e) {
          (this.animation = void 0),
            (this.backgroundColor = "rgba(0,0,0,0.1)"),
            (this.borderColor = "rgba(0,0,0,0.1)"),
            (this.color = "#666"),
            (this.datasets = {}),
            (this.devicePixelRatio = (t) =>
              t.chart.platform.getDevicePixelRatio()),
            (this.elements = {}),
            (this.events = [
              "mousemove",
              "mouseout",
              "click",
              "touchstart",
              "touchmove",
            ]),
            (this.font = {
              family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
              size: 12,
              style: "normal",
              lineHeight: 1.2,
              weight: null,
            }),
            (this.hover = {}),
            (this.hoverBackgroundColor = (t, e) =>
              getHoverColor(e.backgroundColor)),
            (this.hoverBorderColor = (t, e) => getHoverColor(e.borderColor)),
            (this.hoverColor = (t, e) => getHoverColor(e.color)),
            (this.indexAxis = "x"),
            (this.interaction = {
              mode: "nearest",
              intersect: !0,
              includeInvisible: !1,
            }),
            (this.maintainAspectRatio = !0),
            (this.onHover = null),
            (this.onClick = null),
            (this.parsing = !0),
            (this.plugins = {}),
            (this.responsive = !0),
            (this.scale = void 0),
            (this.scales = {}),
            (this.showLine = !0),
            (this.drawActiveElementsOnTop = !0),
            this.describe(t),
            this.apply(e);
        }
        set(t, e) {
          return helpers_segment_set(this, t, e);
        }
        get(t) {
          return getScope$1(this, t);
        }
        describe(t, e) {
          return helpers_segment_set(F, t, e);
        }
        override(t, e) {
          return helpers_segment_set(L, t, e);
        }
        route(t, e, i, s) {
          let a = getScope$1(this, t),
            n = getScope$1(this, i),
            r = "_" + e;
          Object.defineProperties(a, {
            [r]: { value: a[e], writable: !0 },
            [e]: {
              enumerable: !0,
              get() {
                let t = this[r],
                  e = n[s];
                return isObject(t)
                  ? Object.assign({}, e, t)
                  : valueOrDefault(t, e);
              },
              set(t) {
                this[r] = t;
              },
            },
          });
        }
        apply(t) {
          t.forEach((t) => t(this));
        }
      };
      var I = new Defaults(
        {
          _scriptable: (t) => !t.startsWith("on"),
          _indexable: (t) => "events" !== t,
          hover: { _fallback: "interaction" },
          interaction: { _scriptable: !1, _indexable: !1 },
        },
        [applyAnimationsDefaults, applyLayoutsDefaults, applyScaleDefaults]
      );
      function toFontString(t) {
        return !t || isNullOrUndef(t.size) || isNullOrUndef(t.family)
          ? null
          : (t.style ? t.style + " " : "") +
              (t.weight ? t.weight + " " : "") +
              t.size +
              "px " +
              t.family;
      }
      function _measureText(t, e, i, s, a) {
        let n = e[a];
        return (
          n || ((n = e[a] = t.measureText(a).width), i.push(a)),
          n > s && (s = n),
          s
        );
      }
      function _longestText(t, e, i, s) {
        let a,
          n,
          r,
          o,
          l,
          h = ((s = s || {}).data = s.data || {}),
          c = (s.garbageCollect = s.garbageCollect || []);
        s.font !== e &&
          ((h = s.data = {}), (c = s.garbageCollect = []), (s.font = e)),
          t.save(),
          (t.font = e);
        let d = 0,
          u = i.length;
        for (a = 0; a < u; a++)
          if (null == (o = i[a]) || isArray(o)) {
            if (isArray(o))
              for (n = 0, r = o.length; n < r; n++)
                null == (l = o[n]) ||
                  isArray(l) ||
                  (d = _measureText(t, h, c, d, l));
          } else d = _measureText(t, h, c, d, o);
        t.restore();
        let g = c.length / 2;
        if (g > i.length) {
          for (a = 0; a < g; a++) delete h[c[a]];
          c.splice(0, g);
        }
        return d;
      }
      function _alignPixel(t, e, i) {
        let s = t.currentDevicePixelRatio,
          a = 0 !== i ? Math.max(i / 2, 0.5) : 0;
        return Math.round((e - a) * s) / s + a;
      }
      function clearCanvas(t, e) {
        (e || t) &&
          ((e = e || t.getContext("2d")).save(),
          e.resetTransform(),
          e.clearRect(0, 0, t.width, t.height),
          e.restore());
      }
      function drawPoint(t, e, i, s) {
        drawPointLegend(t, e, i, s, null);
      }
      function drawPointLegend(t, e, i, s, a) {
        let n,
          r,
          o,
          l,
          h,
          c,
          d,
          u,
          m = e.pointStyle,
          b = e.rotation,
          k = e.radius,
          M = (b || 0) * x;
        if (
          m &&
          "object" == typeof m &&
          ("[object HTMLImageElement]" === (n = m.toString()) ||
            "[object HTMLCanvasElement]" === n)
        ) {
          t.save(),
            t.translate(i, s),
            t.rotate(M),
            t.drawImage(m, -m.width / 2, -m.height / 2, m.width, m.height),
            t.restore();
          return;
        }
        if (!isNaN(k) && !(k <= 0)) {
          switch ((t.beginPath(), m)) {
            default:
              a ? t.ellipse(i, s, a / 2, k, 0, 0, p) : t.arc(i, s, k, 0, p),
                t.closePath();
              break;
            case "triangle":
              (c = a ? a / 2 : k),
                t.moveTo(i + Math.sin(M) * c, s - Math.cos(M) * k),
                (M += v),
                t.lineTo(i + Math.sin(M) * c, s - Math.cos(M) * k),
                (M += v),
                t.lineTo(i + Math.sin(M) * c, s - Math.cos(M) * k),
                t.closePath();
              break;
            case "rectRounded":
              (h = 0.516 * k),
                (r = Math.cos(M + y) * (l = k - h)),
                (d = Math.cos(M + y) * (a ? a / 2 - h : l)),
                (o = Math.sin(M + y) * l),
                (u = Math.sin(M + y) * (a ? a / 2 - h : l)),
                t.arc(i - d, s - o, h, M - g, M - _),
                t.arc(i + u, s - r, h, M - _, M),
                t.arc(i + d, s + o, h, M, M + _),
                t.arc(i - u, s + r, h, M + _, M + g),
                t.closePath();
              break;
            case "rect":
              if (!b) {
                (l = Math.SQRT1_2 * k),
                  (c = a ? a / 2 : l),
                  t.rect(i - c, s - l, 2 * c, 2 * l);
                break;
              }
              M += y;
            case "rectRot":
              (d = Math.cos(M) * (a ? a / 2 : k)),
                (r = Math.cos(M) * k),
                (o = Math.sin(M) * k),
                (u = Math.sin(M) * (a ? a / 2 : k)),
                t.moveTo(i - d, s - o),
                t.lineTo(i + u, s - r),
                t.lineTo(i + d, s + o),
                t.lineTo(i - u, s + r),
                t.closePath();
              break;
            case "crossRot":
              M += y;
            case "cross":
              (d = Math.cos(M) * (a ? a / 2 : k)),
                (r = Math.cos(M) * k),
                (o = Math.sin(M) * k),
                (u = Math.sin(M) * (a ? a / 2 : k)),
                t.moveTo(i - d, s - o),
                t.lineTo(i + d, s + o),
                t.moveTo(i + u, s - r),
                t.lineTo(i - u, s + r);
              break;
            case "star":
              (d = Math.cos(M) * (a ? a / 2 : k)),
                (r = Math.cos(M) * k),
                (o = Math.sin(M) * k),
                (u = Math.sin(M) * (a ? a / 2 : k)),
                t.moveTo(i - d, s - o),
                t.lineTo(i + d, s + o),
                t.moveTo(i + u, s - r),
                t.lineTo(i - u, s + r),
                (M += y),
                (d = Math.cos(M) * (a ? a / 2 : k)),
                (r = Math.cos(M) * k),
                (o = Math.sin(M) * k),
                (u = Math.sin(M) * (a ? a / 2 : k)),
                t.moveTo(i - d, s - o),
                t.lineTo(i + d, s + o),
                t.moveTo(i + u, s - r),
                t.lineTo(i - u, s + r);
              break;
            case "line":
              (r = a ? a / 2 : Math.cos(M) * k),
                (o = Math.sin(M) * k),
                t.moveTo(i - r, s - o),
                t.lineTo(i + r, s + o);
              break;
            case "dash":
              t.moveTo(i, s),
                t.lineTo(
                  i + Math.cos(M) * (a ? a / 2 : k),
                  s + Math.sin(M) * k
                );
              break;
            case !1:
              t.closePath();
          }
          t.fill(), e.borderWidth > 0 && t.stroke();
        }
      }
      function _isPointInArea(t, e, i) {
        return (
          (i = i || 0.5),
          !e ||
            (t &&
              t.x > e.left - i &&
              t.x < e.right + i &&
              t.y > e.top - i &&
              t.y < e.bottom + i)
        );
      }
      function clipArea(t, e) {
        t.save(),
          t.beginPath(),
          t.rect(e.left, e.top, e.right - e.left, e.bottom - e.top),
          t.clip();
      }
      function unclipArea(t) {
        t.restore();
      }
      function _steppedLineTo(t, e, i, s, a) {
        if (!e) return t.lineTo(i.x, i.y);
        if ("middle" === a) {
          let s = (e.x + i.x) / 2;
          t.lineTo(s, e.y), t.lineTo(s, i.y);
        } else ("after" === a) != !!s ? t.lineTo(e.x, i.y) : t.lineTo(i.x, e.y);
        t.lineTo(i.x, i.y);
      }
      function _bezierCurveTo(t, e, i, s) {
        if (!e) return t.lineTo(i.x, i.y);
        t.bezierCurveTo(
          s ? e.cp1x : e.cp2x,
          s ? e.cp1y : e.cp2y,
          s ? i.cp2x : i.cp1x,
          s ? i.cp2y : i.cp1y,
          i.x,
          i.y
        );
      }
      function setRenderOpts(t, e) {
        e.translation && t.translate(e.translation[0], e.translation[1]),
          isNullOrUndef(e.rotation) || t.rotate(e.rotation),
          e.color && (t.fillStyle = e.color),
          e.textAlign && (t.textAlign = e.textAlign),
          e.textBaseline && (t.textBaseline = e.textBaseline);
      }
      function decorateText(t, e, i, s, a) {
        if (a.strikethrough || a.underline) {
          let n = t.measureText(s),
            r = e - n.actualBoundingBoxLeft,
            o = e + n.actualBoundingBoxRight,
            l = i - n.actualBoundingBoxAscent,
            h = i + n.actualBoundingBoxDescent,
            c = a.strikethrough ? (l + h) / 2 : h;
          (t.strokeStyle = t.fillStyle),
            t.beginPath(),
            (t.lineWidth = a.decorationWidth || 2),
            t.moveTo(r, c),
            t.lineTo(o, c),
            t.stroke();
        }
      }
      function drawBackdrop(t, e) {
        let i = t.fillStyle;
        (t.fillStyle = e.color),
          t.fillRect(e.left, e.top, e.width, e.height),
          (t.fillStyle = i);
      }
      function renderText(t, e, i, s, a, n = {}) {
        let r,
          o,
          l = isArray(e) ? e : [e],
          h = n.strokeWidth > 0 && "" !== n.strokeColor;
        for (
          t.save(), t.font = a.string, setRenderOpts(t, n), r = 0;
          r < l.length;
          ++r
        )
          (o = l[r]),
            n.backdrop && drawBackdrop(t, n.backdrop),
            h &&
              (n.strokeColor && (t.strokeStyle = n.strokeColor),
              isNullOrUndef(n.strokeWidth) || (t.lineWidth = n.strokeWidth),
              t.strokeText(o, i, s, n.maxWidth)),
            t.fillText(o, i, s, n.maxWidth),
            decorateText(t, i, s, o, n),
            (s += Number(a.lineHeight));
        t.restore();
      }
      function addRoundedRectPath(t, e) {
        let { x: i, y: s, w: a, h: n, radius: r } = e;
        t.arc(i + r.topLeft, s + r.topLeft, r.topLeft, 1.5 * g, g, !0),
          t.lineTo(i, s + n - r.bottomLeft),
          t.arc(i + r.bottomLeft, s + n - r.bottomLeft, r.bottomLeft, g, _, !0),
          t.lineTo(i + a - r.bottomRight, s + n),
          t.arc(
            i + a - r.bottomRight,
            s + n - r.bottomRight,
            r.bottomRight,
            _,
            0,
            !0
          ),
          t.lineTo(i + a, s + r.topRight),
          t.arc(i + a - r.topRight, s + r.topRight, r.topRight, 0, -_, !0),
          t.lineTo(i + r.topLeft, s);
      }
      let E = /^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/,
        R =
          /^(normal|italic|initial|inherit|unset|(oblique( -?[0-9]?[0-9]deg)?))$/;
      function toLineHeight(t, e) {
        let i = ("" + t).match(E);
        if (!i || "normal" === i[1]) return 1.2 * e;
        switch (((t = +i[2]), i[3])) {
          case "px":
            return t;
          case "%":
            t /= 100;
        }
        return e * t;
      }
      let numberOrZero = (t) => +t || 0;
      function _readValueToProps(t, e) {
        let i = {},
          s = isObject(e),
          a = s ? Object.keys(e) : e,
          n = isObject(t)
            ? s
              ? (i) => valueOrDefault(t[i], t[e[i]])
              : (e) => t[e]
            : () => t;
        for (let t of a) i[t] = numberOrZero(n(t));
        return i;
      }
      function toTRBL(t) {
        return _readValueToProps(t, {
          top: "y",
          right: "x",
          bottom: "y",
          left: "x",
        });
      }
      function toTRBLCorners(t) {
        return _readValueToProps(t, [
          "topLeft",
          "topRight",
          "bottomLeft",
          "bottomRight",
        ]);
      }
      function toPadding(t) {
        let e = toTRBL(t);
        return (e.width = e.left + e.right), (e.height = e.top + e.bottom), e;
      }
      function toFont(t, e) {
        (t = t || {}), (e = e || I.font);
        let i = valueOrDefault(t.size, e.size);
        "string" == typeof i && (i = parseInt(i, 10));
        let s = valueOrDefault(t.style, e.style);
        s &&
          !("" + s).match(R) &&
          (console.warn('Invalid font style specified: "' + s + '"'),
          (s = void 0));
        let a = {
          family: valueOrDefault(t.family, e.family),
          lineHeight: toLineHeight(
            valueOrDefault(t.lineHeight, e.lineHeight),
            i
          ),
          size: i,
          style: s,
          weight: valueOrDefault(t.weight, e.weight),
          string: "",
        };
        return (a.string = toFontString(a)), a;
      }
      function helpers_segment_resolve(t, e, i, s) {
        let a,
          n,
          r,
          o = !0;
        for (a = 0, n = t.length; a < n; ++a)
          if (
            void 0 !== (r = t[a]) &&
            (void 0 !== e && "function" == typeof r && ((r = r(e)), (o = !1)),
            void 0 !== i && isArray(r) && ((r = r[i % r.length]), (o = !1)),
            void 0 !== r)
          )
            return s && !o && (s.cacheable = !1), r;
      }
      function _addGrace(t, e, i) {
        let { min: s, max: a } = t,
          n = toDimension(e, (a - s) / 2),
          keepZero = (t, e) => (i && 0 === t ? 0 : t + e);
        return { min: keepZero(s, -Math.abs(n)), max: keepZero(a, n) };
      }
      function createContext(t, e) {
        return Object.assign(Object.create(t), e);
      }
      function _createResolver(t, e = [""], i, s, a = () => t[0]) {
        let n = i || t;
        return (
          void 0 === s && (s = _resolve("_fallback", t)),
          new Proxy(
            {
              [Symbol.toStringTag]: "Object",
              _cacheable: !0,
              _scopes: t,
              _rootScopes: n,
              _fallback: s,
              _getTarget: a,
              override: (i) => _createResolver([i, ...t], e, n, s),
            },
            {
              deleteProperty: (e, i) => (
                delete e[i], delete e._keys, delete t[0][i], !0
              ),
              get: (i, s) =>
                _cached(i, s, () => _resolveWithPrefixes(s, e, t, i)),
              getOwnPropertyDescriptor: (t, e) =>
                Reflect.getOwnPropertyDescriptor(t._scopes[0], e),
              getPrototypeOf: () => Reflect.getPrototypeOf(t[0]),
              has: (t, e) => getKeysFromAllScopes(t).includes(e),
              ownKeys: (t) => getKeysFromAllScopes(t),
              set(t, e, i) {
                let s = t._storage || (t._storage = a());
                return (t[e] = s[e] = i), delete t._keys, !0;
              },
            }
          )
        );
      }
      function _attachContext(t, e, i, s) {
        return new Proxy(
          {
            _cacheable: !1,
            _proxy: t,
            _context: e,
            _subProxy: i,
            _stack: new Set(),
            _descriptors: chunks_helpers_segment_descriptors(t, s),
            setContext: (e) => _attachContext(t, e, i, s),
            override: (a) => _attachContext(t.override(a), e, i, s),
          },
          {
            deleteProperty: (e, i) => (delete e[i], delete t[i], !0),
            get: (t, e, i) => _cached(t, e, () => _resolveWithContext(t, e, i)),
            getOwnPropertyDescriptor: (e, i) =>
              e._descriptors.allKeys
                ? Reflect.has(t, i)
                  ? { enumerable: !0, configurable: !0 }
                  : void 0
                : Reflect.getOwnPropertyDescriptor(t, i),
            getPrototypeOf: () => Reflect.getPrototypeOf(t),
            has: (e, i) => Reflect.has(t, i),
            ownKeys: () => Reflect.ownKeys(t),
            set: (e, i, s) => ((t[i] = s), delete e[i], !0),
          }
        );
      }
      function chunks_helpers_segment_descriptors(
        t,
        e = { scriptable: !0, indexable: !0 }
      ) {
        let {
          _scriptable: i = e.scriptable,
          _indexable: s = e.indexable,
          _allKeys: a = e.allKeys,
        } = t;
        return {
          allKeys: a,
          scriptable: i,
          indexable: s,
          isScriptable: isFunction(i) ? i : () => i,
          isIndexable: isFunction(s) ? s : () => s,
        };
      }
      let readKey = (t, e) => (t ? t + _capitalize(e) : e),
        needsSubResolver = (t, e) =>
          isObject(e) &&
          "adapters" !== t &&
          (null === Object.getPrototypeOf(e) || e.constructor === Object);
      function _cached(t, e, i) {
        if (Object.prototype.hasOwnProperty.call(t, e) || "constructor" === e)
          return t[e];
        let s = i();
        return (t[e] = s), s;
      }
      function _resolveWithContext(t, e, i) {
        let { _proxy: s, _context: a, _subProxy: n, _descriptors: r } = t,
          o = s[e];
        return (
          isFunction(o) &&
            r.isScriptable(e) &&
            (o = _resolveScriptable(e, o, t, i)),
          isArray(o) && o.length && (o = _resolveArray(e, o, t, r.isIndexable)),
          needsSubResolver(e, o) && (o = _attachContext(o, a, n && n[e], r)),
          o
        );
      }
      function _resolveScriptable(t, e, i, s) {
        let { _proxy: a, _context: n, _subProxy: r, _stack: o } = i;
        if (o.has(t))
          throw Error(
            "Recursion detected: " + Array.from(o).join("->") + "->" + t
          );
        o.add(t);
        let l = e(n, r || s);
        return (
          o.delete(t),
          needsSubResolver(t, l) && (l = createSubResolver(a._scopes, a, t, l)),
          l
        );
      }
      function _resolveArray(t, e, i, s) {
        let { _proxy: a, _context: n, _subProxy: r, _descriptors: o } = i;
        if (void 0 !== n.index && s(t)) return e[n.index % e.length];
        if (isObject(e[0])) {
          let i = e,
            s = a._scopes.filter((t) => t !== i);
          for (let l of ((e = []), i)) {
            let i = createSubResolver(s, a, t, l);
            e.push(_attachContext(i, n, r && r[t], o));
          }
        }
        return e;
      }
      let getScope = (t, e) =>
        !0 === t ? e : "string" == typeof t ? resolveObjectKey(e, t) : void 0;
      function addScopes(t, e, i, s, a) {
        for (let r of e) {
          let e = getScope(i, r);
          if (e) {
            var n;
            t.add(e);
            let r = ((n = e._fallback), isFunction(n) ? n(i, a) : n);
            if (void 0 !== r && r !== i && r !== s) return r;
          } else if (!1 === e && void 0 !== s && i !== s) return null;
        }
        return !1;
      }
      function createSubResolver(t, e, i, s) {
        var a;
        let n = e._rootScopes,
          r = ((a = e._fallback), isFunction(a) ? a(i, s) : a),
          o = [...t, ...n],
          l = new Set();
        l.add(s);
        let h = addScopesFromKey(l, o, i, r || i, s);
        return (
          null !== h &&
          (void 0 === r ||
            r === i ||
            null !== (h = addScopesFromKey(l, o, r, h, s))) &&
          _createResolver(Array.from(l), [""], n, r, () =>
            subGetTarget(e, i, s)
          )
        );
      }
      function addScopesFromKey(t, e, i, s, a) {
        for (; i; ) i = addScopes(t, e, i, s, a);
        return i;
      }
      function subGetTarget(t, e, i) {
        let s = t._getTarget();
        e in s || (s[e] = {});
        let a = s[e];
        return isArray(a) && isObject(i) ? i : a || {};
      }
      function _resolveWithPrefixes(t, e, i, s) {
        let a;
        for (let n of e)
          if (void 0 !== (a = _resolve(readKey(n, t), i)))
            return needsSubResolver(t, a) ? createSubResolver(i, s, t, a) : a;
      }
      function _resolve(t, e) {
        for (let i of e) {
          if (!i) continue;
          let e = i[t];
          if (void 0 !== e) return e;
        }
      }
      function getKeysFromAllScopes(t) {
        let e = t._keys;
        return e || (e = t._keys = resolveKeysFromAllScopes(t._scopes)), e;
      }
      function resolveKeysFromAllScopes(t) {
        let e = new Set();
        for (let i of t)
          for (let t of Object.keys(i).filter((t) => !t.startsWith("_")))
            e.add(t);
        return Array.from(e);
      }
      function _parseObjectDataRadialScale(t, e, i, s) {
        let a,
          n,
          r,
          { iScale: o } = t,
          { key: l = "r" } = this._parsing,
          h = Array(s);
        for (a = 0; a < s; ++a)
          (r = e[(n = a + i)]),
            (h[a] = { r: o.parse(resolveObjectKey(r, l), n) });
        return h;
      }
      let B = Number.EPSILON || 1e-14,
        getPoint = (t, e) => e < t.length && !t[e].skip && t[e],
        getValueAxis = (t) => ("x" === t ? "y" : "x");
      function splineCurve(t, e, i, s) {
        let a = t.skip ? e : t,
          n = i.skip ? e : i,
          r = distanceBetweenPoints(e, a),
          o = distanceBetweenPoints(n, e),
          l = r / (r + o),
          h = o / (r + o);
        (l = isNaN(l) ? 0 : l), (h = isNaN(h) ? 0 : h);
        let c = s * l,
          d = s * h;
        return {
          previous: { x: e.x - c * (n.x - a.x), y: e.y - c * (n.y - a.y) },
          next: { x: e.x + d * (n.x - a.x), y: e.y + d * (n.y - a.y) },
        };
      }
      function monotoneAdjust(t, e, i) {
        let s,
          a,
          n,
          r,
          o,
          l = t.length,
          h = getPoint(t, 0);
        for (let c = 0; c < l - 1; ++c)
          if (((o = h), (h = getPoint(t, c + 1)), o && h)) {
            if (almostEquals(e[c], 0, B)) {
              i[c] = i[c + 1] = 0;
              continue;
            }
            (r =
              Math.pow((s = i[c] / e[c]), 2) +
              Math.pow((a = i[c + 1] / e[c]), 2)) <= 9 ||
              ((n = 3 / Math.sqrt(r)),
              (i[c] = s * n * e[c]),
              (i[c + 1] = a * n * e[c]));
          }
      }
      function monotoneCompute(t, e, i = "x") {
        let s,
          a,
          n,
          r = getValueAxis(i),
          o = t.length,
          l = getPoint(t, 0);
        for (let h = 0; h < o; ++h) {
          if (((a = n), (n = l), (l = getPoint(t, h + 1)), !n)) continue;
          let o = n[i],
            c = n[r];
          a &&
            ((s = (o - a[i]) / 3),
            (n[`cp1${i}`] = o - s),
            (n[`cp1${r}`] = c - s * e[h])),
            l &&
              ((s = (l[i] - o) / 3),
              (n[`cp2${i}`] = o + s),
              (n[`cp2${r}`] = c + s * e[h]));
        }
      }
      function splineCurveMonotone(t, e = "x") {
        let i,
          s,
          a,
          n = getValueAxis(e),
          r = t.length,
          o = Array(r).fill(0),
          l = Array(r),
          h = getPoint(t, 0);
        for (i = 0; i < r; ++i)
          if (((s = a), (a = h), (h = getPoint(t, i + 1)), a)) {
            if (h) {
              let t = h[e] - a[e];
              o[i] = 0 !== t ? (h[n] - a[n]) / t : 0;
            }
            l[i] = s
              ? h
                ? M(o[i - 1]) !== M(o[i])
                  ? 0
                  : (o[i - 1] + o[i]) / 2
                : o[i - 1]
              : o[i];
          }
        monotoneAdjust(t, o, l), monotoneCompute(t, l, e);
      }
      function capControlPoint(t, e, i) {
        return Math.max(Math.min(t, i), e);
      }
      function capBezierPoints(t, e) {
        let i,
          s,
          a,
          n,
          r,
          o = _isPointInArea(t[0], e);
        for (i = 0, s = t.length; i < s; ++i)
          (r = n),
            (n = o),
            (o = i < s - 1 && _isPointInArea(t[i + 1], e)),
            n &&
              ((a = t[i]),
              r &&
                ((a.cp1x = capControlPoint(a.cp1x, e.left, e.right)),
                (a.cp1y = capControlPoint(a.cp1y, e.top, e.bottom))),
              o &&
                ((a.cp2x = capControlPoint(a.cp2x, e.left, e.right)),
                (a.cp2y = capControlPoint(a.cp2y, e.top, e.bottom))));
      }
      function _updateBezierControlPoints(t, e, i, s, a) {
        let n, r, o, l;
        if (
          (e.spanGaps && (t = t.filter((t) => !t.skip)),
          "monotone" === e.cubicInterpolationMode)
        )
          splineCurveMonotone(t, a);
        else {
          let i = s ? t[t.length - 1] : t[0];
          for (n = 0, r = t.length; n < r; ++n)
            (l = splineCurve(
              i,
              (o = t[n]),
              t[Math.min(n + 1, r - +!s) % r],
              e.tension
            )),
              (o.cp1x = l.previous.x),
              (o.cp1y = l.previous.y),
              (o.cp2x = l.next.x),
              (o.cp2y = l.next.y),
              (i = o);
        }
        e.capBezierPoints && capBezierPoints(t, i);
      }
      function _isDomSupported() {
        return "undefined" != typeof window && "undefined" != typeof document;
      }
      function _getParentNode(t) {
        let e = t.parentNode;
        return e && "[object ShadowRoot]" === e.toString() && (e = e.host), e;
      }
      function parseMaxStyle(t, e, i) {
        let s;
        return (
          "string" == typeof t
            ? ((s = parseInt(t, 10)),
              -1 !== t.indexOf("%") && (s = (s / 100) * e.parentNode[i]))
            : (s = t),
          s
        );
      }
      let getComputedStyle = (t) =>
        t.ownerDocument.defaultView.getComputedStyle(t, null);
      function getStyle(t, e) {
        return getComputedStyle(t).getPropertyValue(e);
      }
      let z = ["top", "right", "bottom", "left"];
      function getPositionedStyle(t, e, i) {
        let s = {};
        i = i ? "-" + i : "";
        for (let a = 0; a < 4; a++) {
          let n = z[a];
          s[n] = parseFloat(t[e + "-" + n + i]) || 0;
        }
        return (s.width = s.left + s.right), (s.height = s.top + s.bottom), s;
      }
      let useOffsetPos = (t, e, i) => (t > 0 || e > 0) && (!i || !i.shadowRoot);
      function getCanvasPosition(t, e) {
        let i,
          s,
          a = t.touches,
          n = a && a.length ? a[0] : t,
          { offsetX: r, offsetY: o } = n,
          l = !1;
        if (useOffsetPos(r, o, t.target)) (i = r), (s = o);
        else {
          let t = e.getBoundingClientRect();
          (i = n.clientX - t.left), (s = n.clientY - t.top), (l = !0);
        }
        return { x: i, y: s, box: l };
      }
      function getRelativePosition(t, e) {
        if ("native" in t) return t;
        let { canvas: i, currentDevicePixelRatio: s } = e,
          a = getComputedStyle(i),
          n = "border-box" === a.boxSizing,
          r = getPositionedStyle(a, "padding"),
          o = getPositionedStyle(a, "border", "width"),
          { x: l, y: h, box: c } = getCanvasPosition(t, i),
          d = r.left + (c && o.left),
          u = r.top + (c && o.top),
          { width: g, height: p } = e;
        return (
          n && ((g -= r.width + o.width), (p -= r.height + o.height)),
          {
            x: Math.round((((l - d) / g) * i.width) / s),
            y: Math.round((((h - u) / p) * i.height) / s),
          }
        );
      }
      function getContainerSize(t, e, i) {
        let s, a;
        if (void 0 === e || void 0 === i) {
          let n = t && _getParentNode(t);
          if (n) {
            let t = n.getBoundingClientRect(),
              r = getComputedStyle(n),
              o = getPositionedStyle(r, "border", "width"),
              l = getPositionedStyle(r, "padding");
            (e = t.width - l.width - o.width),
              (i = t.height - l.height - o.height),
              (s = parseMaxStyle(r.maxWidth, n, "clientWidth")),
              (a = parseMaxStyle(r.maxHeight, n, "clientHeight"));
          } else (e = t.clientWidth), (i = t.clientHeight);
        }
        return { width: e, height: i, maxWidth: s || b, maxHeight: a || b };
      }
      let round1 = (t) => Math.round(10 * t) / 10;
      function getMaximumSize(t, e, i, s) {
        let a = getComputedStyle(t),
          n = getPositionedStyle(a, "margin"),
          r = parseMaxStyle(a.maxWidth, t, "clientWidth") || b,
          o = parseMaxStyle(a.maxHeight, t, "clientHeight") || b,
          l = getContainerSize(t, e, i),
          { width: h, height: c } = l;
        if ("content-box" === a.boxSizing) {
          let t = getPositionedStyle(a, "border", "width"),
            e = getPositionedStyle(a, "padding");
          (h -= e.width + t.width), (c -= e.height + t.height);
        }
        return (
          (h = Math.max(0, h - n.width)),
          (c = Math.max(0, s ? h / s : c - n.height)),
          (h = round1(Math.min(h, r, l.maxWidth))),
          (c = round1(Math.min(c, o, l.maxHeight))),
          h && !c && (c = round1(h / 2)),
          (void 0 !== e || void 0 !== i) &&
            s &&
            l.height &&
            c > l.height &&
            (h = round1(Math.floor((c = l.height) * s))),
          { width: h, height: c }
        );
      }
      function retinaScale(t, e, i) {
        let s = e || 1,
          a = Math.floor(t.height * s),
          n = Math.floor(t.width * s);
        (t.height = Math.floor(t.height)), (t.width = Math.floor(t.width));
        let r = t.canvas;
        return (
          r.style &&
            (i || (!r.style.height && !r.style.width)) &&
            ((r.style.height = `${t.height}px`),
            (r.style.width = `${t.width}px`)),
          (t.currentDevicePixelRatio !== s ||
            r.height !== a ||
            r.width !== n) &&
            ((t.currentDevicePixelRatio = s),
            (r.height = a),
            (r.width = n),
            t.ctx.setTransform(s, 0, 0, s, 0, 0),
            !0)
        );
      }
      let V = (function () {
        let t = !1;
        try {
          let e = {
            get passive() {
              return (t = !0), !1;
            },
          };
          _isDomSupported() &&
            (window.addEventListener("test", null, e),
            window.removeEventListener("test", null, e));
        } catch (t) {}
        return t;
      })();
      function readUsedSize(t, e) {
        let i = getStyle(t, e),
          s = i && i.match(/^(\d+)(\.\d+)?px$/);
        return s ? +s[1] : void 0;
      }
      function _pointInLine(t, e, i, s) {
        return { x: t.x + i * (e.x - t.x), y: t.y + i * (e.y - t.y) };
      }
      function _steppedInterpolation(t, e, i, s) {
        return {
          x: t.x + i * (e.x - t.x),
          y:
            "middle" === s
              ? i < 0.5
                ? t.y
                : e.y
              : "after" === s
              ? i < 1
                ? t.y
                : e.y
              : i > 0
              ? e.y
              : t.y,
        };
      }
      function _bezierInterpolation(t, e, i, s) {
        let a = { x: t.cp2x, y: t.cp2y },
          n = { x: e.cp1x, y: e.cp1y },
          r = _pointInLine(t, a, i),
          o = _pointInLine(a, n, i),
          l = _pointInLine(n, e, i),
          h = _pointInLine(r, o, i),
          c = _pointInLine(o, l, i);
        return _pointInLine(h, c, i);
      }
      function getRtlAdapter(t, e, i) {
        var s;
        return t
          ? ((s = i),
            {
              x: (t) => e + e + s - t,
              setWidth(t) {
                s = t;
              },
              textAlign: (t) =>
                "center" === t ? t : "right" === t ? "left" : "right",
              xPlus: (t, e) => t - e,
              leftForLtr: (t, e) => t - e,
            })
          : {
              x: (t) => t,
              setWidth(t) {},
              textAlign: (t) => t,
              xPlus: (t, e) => t + e,
              leftForLtr: (t, e) => t,
            };
      }
      function overrideTextDirection(t, e) {
        let i, s;
        ("ltr" === e || "rtl" === e) &&
          ((s = [
            (i = t.canvas.style).getPropertyValue("direction"),
            i.getPropertyPriority("direction"),
          ]),
          i.setProperty("direction", e, "important"),
          (t.prevTextDirection = s));
      }
      function restoreTextDirection(t, e) {
        void 0 !== e &&
          (delete t.prevTextDirection,
          t.canvas.style.setProperty("direction", e[0], e[1]));
      }
      function propertyFn(t) {
        return "angle" === t
          ? {
              between: _angleBetween,
              compare: _angleDiff,
              normalize: _normalizeAngle,
            }
          : {
              between: _isBetween,
              compare: (t, e) => t - e,
              normalize: (t) => t,
            };
      }
      function normalizeSegment({
        start: t,
        end: e,
        count: i,
        loop: s,
        style: a,
      }) {
        return {
          start: t % i,
          end: e % i,
          loop: s && (e - t + 1) % i == 0,
          style: a,
        };
      }
      function getSegment(t, e, i) {
        let s,
          { property: a, start: n, end: r } = i,
          { between: o, normalize: l } = propertyFn(a),
          h = e.length,
          { start: c, end: d, loop: u } = t;
        if (u) {
          for (c += h, d += h, s = 0; s < h && o(l(e[c % h][a]), n, r); ++s)
            c--, d--;
          (c %= h), (d %= h);
        }
        return d < c && (d += h), { start: c, end: d, loop: u, style: t.style };
      }
      function _boundSegment(t, e, i) {
        let s, a, n;
        if (!i) return [t];
        let { property: r, start: o, end: l } = i,
          h = e.length,
          { compare: c, between: d, normalize: u } = propertyFn(r),
          { start: g, end: p, loop: m, style: b } = getSegment(t, e, i),
          x = [],
          _ = !1,
          y = null,
          startIsBefore = () => d(o, n, s) && 0 !== c(o, n),
          endIsBefore = () => 0 === c(l, s) || d(l, n, s),
          shouldStart = () => _ || startIsBefore(),
          shouldStop = () => !_ || endIsBefore();
        for (let t = g, i = g; t <= p; ++t)
          (a = e[t % h]).skip ||
            ((s = u(a[r])) !== n &&
              ((_ = d(s, o, l)),
              null === y && shouldStart() && (y = 0 === c(s, o) ? t : i),
              null !== y &&
                shouldStop() &&
                (x.push(
                  normalizeSegment({
                    start: y,
                    end: t,
                    loop: m,
                    count: h,
                    style: b,
                  })
                ),
                (y = null)),
              (i = t),
              (n = s)));
        return (
          null !== y &&
            x.push(
              normalizeSegment({
                start: y,
                end: p,
                loop: m,
                count: h,
                style: b,
              })
            ),
          x
        );
      }
      function _boundSegments(t, e) {
        let i = [],
          s = t.segments;
        for (let a = 0; a < s.length; a++) {
          let n = _boundSegment(s[a], t.points, e);
          n.length && i.push(...n);
        }
        return i;
      }
      function findStartAndEnd(t, e, i, s) {
        let a = 0,
          n = e - 1;
        if (i && !s) for (; a < e && !t[a].skip; ) a++;
        for (; a < e && t[a].skip; ) a++;
        for (a %= e, i && (n += a); n > a && t[n % e].skip; ) n--;
        return { start: a, end: (n %= e) };
      }
      function solidSegments(t, e, i, s) {
        let a,
          n = t.length,
          r = [],
          o = e,
          l = t[e];
        for (a = e + 1; a <= i; ++a) {
          let i = t[a % n];
          i.skip || i.stop
            ? l.skip ||
              ((s = !1),
              r.push({ start: e % n, end: (a - 1) % n, loop: s }),
              (e = o = i.stop ? a : null))
            : ((o = a), l.skip && (e = a)),
            (l = i);
        }
        return null !== o && r.push({ start: e % n, end: o % n, loop: s }), r;
      }
      function _computeSegments(t, e) {
        let i = t.points,
          s = t.options.spanGaps,
          a = i.length;
        if (!a) return [];
        let n = !!t._loop,
          { start: r, end: o } = findStartAndEnd(i, a, n, s);
        if (!0 === s)
          return splitByStyles(t, [{ start: r, end: o, loop: n }], i, e);
        let l = o < r ? o + a : o,
          h = !!t._fullLoop && 0 === r && o === a - 1;
        return splitByStyles(t, solidSegments(i, r, l, h), i, e);
      }
      function splitByStyles(t, e, i, s) {
        return s && s.setContext && i ? doSplitByStyles(t, e, i, s) : e;
      }
      function doSplitByStyles(t, e, i, s) {
        let a = t._chart.getContext(),
          n = readStyle(t.options),
          {
            _datasetIndex: r,
            options: { spanGaps: o },
          } = t,
          l = i.length,
          h = [],
          c = n,
          d = e[0].start,
          u = d;
        function addStyle(t, e, s, a) {
          let n = o ? -1 : 1;
          if (t !== e) {
            for (t += l; i[t % l].skip; ) t -= n;
            for (; i[e % l].skip; ) e += n;
            t % l != e % l &&
              (h.push({ start: t % l, end: e % l, loop: s, style: a }),
              (c = a),
              (d = e % l));
          }
        }
        for (let t of e) {
          let e,
            n = i[(d = o ? d : t.start) % l];
          for (u = d + 1; u <= t.end; u++) {
            let o = i[u % l];
            styleChanged(
              (e = readStyle(
                s.setContext(
                  createContext(a, {
                    type: "segment",
                    p0: n,
                    p1: o,
                    p0DataIndex: (u - 1) % l,
                    p1DataIndex: u % l,
                    datasetIndex: r,
                  })
                )
              )),
              c
            ) && addStyle(d, u - 1, t.loop, c),
              (n = o),
              (c = e);
          }
          d < u - 1 && addStyle(d, u - 1, t.loop, c);
        }
        return h;
      }
      function readStyle(t) {
        return {
          backgroundColor: t.backgroundColor,
          borderCapStyle: t.borderCapStyle,
          borderDash: t.borderDash,
          borderDashOffset: t.borderDashOffset,
          borderJoinStyle: t.borderJoinStyle,
          borderWidth: t.borderWidth,
          borderColor: t.borderColor,
        };
      }
      function styleChanged(t, e) {
        if (!e) return !1;
        let i = [],
          replacer = function (t, e) {
            return isPatternOrGradient(e)
              ? (i.includes(e) || i.push(e), i.indexOf(e))
              : e;
          };
        return JSON.stringify(t, replacer) !== JSON.stringify(e, replacer);
      }
    },
    58093: function (t, e, i) {
      i.d(e, { x1: () => h });
      var s,
        a,
        n = i(67294),
        r = i(69441);
      let o = "label";
      function reforwardRef(t, e) {
        "function" == typeof t ? t(e) : t && (t.current = e);
      }
      function setOptions(t, e) {
        let i = t.options;
        i && e && Object.assign(i, e);
      }
      function setDatasets(t, e) {
        let i =
            arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : o,
          s = [];
        t.datasets = e.map((e) => {
          let a = t.datasets.find((t) => t[i] === e[i]);
          return !a || !e.data || s.includes(a)
            ? { ...e }
            : (s.push(a), Object.assign(a, e), a);
        });
      }
      function cloneData(t) {
        let e =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : o,
          i = { labels: [], datasets: [] };
        return (i.labels = t.labels), setDatasets(i, t.datasets, e), i;
      }
      function ChartComponent(t, e) {
        let {
            height: i = 150,
            width: s = 300,
            redraw: a = !1,
            datasetIdKey: o,
            type: l,
            data: h,
            options: c,
            plugins: d = [],
            fallbackContent: u,
            updateMode: g,
            ...p
          } = t,
          m = (0, n.useRef)(null),
          b = (0, n.useRef)(null),
          renderChart = () => {
            m.current &&
              ((b.current = new r.kL(m.current, {
                type: l,
                data: cloneData(h, o),
                options: c && { ...c },
                plugins: d,
              })),
              reforwardRef(e, b.current));
          },
          destroyChart = () => {
            reforwardRef(e, null),
              b.current && (b.current.destroy(), (b.current = null));
          };
        return (
          (0, n.useEffect)(() => {
            !a && b.current && c && setOptions(b.current, c);
          }, [a, c]),
          (0, n.useEffect)(() => {
            !a && b.current && (b.current.config.data.labels = h.labels);
          }, [a, h.labels]),
          (0, n.useEffect)(() => {
            !a &&
              b.current &&
              h.datasets &&
              setDatasets(b.current.config.data, h.datasets, o);
          }, [a, h.datasets]),
          (0, n.useEffect)(() => {
            b.current &&
              (a
                ? (destroyChart(), setTimeout(renderChart))
                : b.current.update(g));
          }, [a, c, h.labels, h.datasets, g]),
          (0, n.useEffect)(() => {
            b.current && (destroyChart(), setTimeout(renderChart));
          }, [l]),
          (0, n.useEffect)(() => (renderChart(), () => destroyChart()), []),
          n.createElement(
            "canvas",
            { ref: m, role: "img", height: i, width: s, ...p },
            u
          )
        );
      }
      let l = (0, n.forwardRef)(ChartComponent),
        h =
          ((s = "line"),
          (a = r.ST),
          r.kL.register(a),
          (0, n.forwardRef)((t, e) =>
            n.createElement(l, { ...t, ref: e, type: s })
          ));
    },
  },
]);
