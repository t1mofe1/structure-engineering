'use strict';
function polyfill() {
	var w = window,
		d = document;
	if (!('scrollBehavior' in d.documentElement.style && !0 !== w.__forceSmoothScrollPolyfill__)) {
		var Element = w.HTMLElement || w.Element,
			SCROLL_TIME = 468,
			original = { scroll: w.scroll || w.scrollTo, scrollBy: w.scrollBy, elementScroll: Element.prototype.scroll || scrollElement, scrollIntoView: Element.prototype.scrollIntoView },
			now = w.performance && w.performance.now ? w.performance.now.bind(w.performance) : Date.now,
			ROUNDING_TOLERANCE = isMicrosoftBrowser(w.navigator.userAgent) ? 1 : 0;
		(w.scroll = w.scrollTo =
			function () {
				void 0 !== arguments[0] &&
					(!0 !== shouldBailOut(arguments[0])
						? smoothScroll.call(
								w,
								d.body,
								void 0 !== arguments[0].left ? ~~arguments[0].left : w.scrollX || w.pageXOffset,
								void 0 !== arguments[0].top ? ~~arguments[0].top : w.scrollY || w.pageYOffset,
						  )
						: original.scroll.call(
								w,
								void 0 !== arguments[0].left ? arguments[0].left : 'object' != typeof arguments[0] ? arguments[0] : w.scrollX || w.pageXOffset,
								void 0 !== arguments[0].top ? arguments[0].top : void 0 !== arguments[1] ? arguments[1] : w.scrollY || w.pageYOffset,
						  ));
			}),
			(w.scrollBy = function () {
				void 0 !== arguments[0] &&
					(shouldBailOut(arguments[0])
						? original.scrollBy.call(
								w,
								void 0 !== arguments[0].left ? arguments[0].left : 'object' != typeof arguments[0] ? arguments[0] : 0,
								void 0 !== arguments[0].top ? arguments[0].top : void 0 !== arguments[1] ? arguments[1] : 0,
						  )
						: smoothScroll.call(w, d.body, ~~arguments[0].left + (w.scrollX || w.pageXOffset), ~~arguments[0].top + (w.scrollY || w.pageYOffset)));
			}),
			(Element.prototype.scroll = Element.prototype.scrollTo =
				function () {
					if (void 0 !== arguments[0])
						if (!0 !== shouldBailOut(arguments[0])) {
							var left = arguments[0].left,
								top = arguments[0].top;
							smoothScroll.call(this, this, void 0 === left ? this.scrollLeft : ~~left, void 0 === top ? this.scrollTop : ~~top);
						} else {
							if ('number' == typeof arguments[0] && void 0 === arguments[1]) throw new SyntaxError('Value could not be converted');
							original.elementScroll.call(
								this,
								void 0 !== arguments[0].left ? ~~arguments[0].left : 'object' != typeof arguments[0] ? ~~arguments[0] : this.scrollLeft,
								void 0 !== arguments[0].top ? ~~arguments[0].top : void 0 !== arguments[1] ? ~~arguments[1] : this.scrollTop,
							);
						}
				}),
			(Element.prototype.scrollBy = function () {
				void 0 !== arguments[0] &&
					(!0 !== shouldBailOut(arguments[0])
						? this.scroll({ left: ~~arguments[0].left + this.scrollLeft, top: ~~arguments[0].top + this.scrollTop, behavior: arguments[0].behavior })
						: original.elementScroll.call(
								this,
								void 0 !== arguments[0].left ? ~~arguments[0].left + this.scrollLeft : ~~arguments[0] + this.scrollLeft,
								void 0 !== arguments[0].top ? ~~arguments[0].top + this.scrollTop : ~~arguments[1] + this.scrollTop,
						  ));
			}),
			(Element.prototype.scrollIntoView = function () {
				if (!0 !== shouldBailOut(arguments[0])) {
					var scrollableParent = findScrollableParent(this),
						parentRects = scrollableParent.getBoundingClientRect(),
						clientRects = this.getBoundingClientRect();
					scrollableParent !== d.body
						? (smoothScroll.call(this, scrollableParent, scrollableParent.scrollLeft + clientRects.left - parentRects.left, scrollableParent.scrollTop + clientRects.top - parentRects.top),
						  'fixed' !== w.getComputedStyle(scrollableParent).position && w.scrollBy({ left: parentRects.left, top: parentRects.top, behavior: 'smooth' }))
						: w.scrollBy({ left: clientRects.left, top: clientRects.top, behavior: 'smooth' });
				} else original.scrollIntoView.call(this, void 0 === arguments[0] || arguments[0]);
			});
	}
	function isMicrosoftBrowser(userAgent) {
		var userAgentPatterns;
		return new RegExp(['MSIE ', 'Trident/', 'Edge/'].join('|')).test(userAgent);
	}
	function scrollElement(x, y) {
		(this.scrollLeft = x), (this.scrollTop = y);
	}
	function ease(k) {
		return 0.5 * (1 - Math.cos(Math.PI * k));
	}
	function shouldBailOut(firstArg) {
		if (null === firstArg || 'object' != typeof firstArg || void 0 === firstArg.behavior || 'auto' === firstArg.behavior || 'instant' === firstArg.behavior) return !0;
		if ('object' == typeof firstArg && 'smooth' === firstArg.behavior) return !1;
		throw new TypeError('behavior member of ScrollOptions ' + firstArg.behavior + ' is not a valid value for enumeration ScrollBehavior.');
	}
	function hasScrollableSpace(el, axis) {
		return 'Y' === axis ? el.clientHeight + ROUNDING_TOLERANCE < el.scrollHeight : 'X' === axis ? el.clientWidth + ROUNDING_TOLERANCE < el.scrollWidth : void 0;
	}
	function canOverflow(el, axis) {
		var overflowValue = w.getComputedStyle(el, null)['overflow' + axis];
		return 'auto' === overflowValue || 'scroll' === overflowValue;
	}
	function isScrollable(el) {
		var isScrollableY = hasScrollableSpace(el, 'Y') && canOverflow(el, 'Y'),
			isScrollableX = hasScrollableSpace(el, 'X') && canOverflow(el, 'X');
		return isScrollableY || isScrollableX;
	}
	function findScrollableParent(el) {
		for (; el !== d.body && !1 === isScrollable(el); ) el = el.parentNode || el.host;
		return el;
	}
	function step(context) {
		var time,
			value,
			currentX,
			currentY,
			elapsed = (now() - context.startTime) / 468;
		(value = ease((elapsed = elapsed > 1 ? 1 : elapsed))),
			(currentX = context.startX + (context.x - context.startX) * value),
			(currentY = context.startY + (context.y - context.startY) * value),
			context.method.call(context.scrollable, currentX, currentY),
			(currentX === context.x && currentY === context.y) || w.requestAnimationFrame(step.bind(w, context));
	}
	function smoothScroll(el, x, y) {
		var scrollable,
			startX,
			startY,
			method,
			startTime = now();
		el === d.body
			? ((scrollable = w), (startX = w.scrollX || w.pageXOffset), (startY = w.scrollY || w.pageYOffset), (method = original.scroll))
			: ((scrollable = el), (startX = el.scrollLeft), (startY = el.scrollTop), (method = scrollElement)),
			step({ scrollable: scrollable, method: method, startTime: startTime, startX: startX, startY: startY, x: x, y: y });
	}
}
'object' == typeof exports && 'undefined' != typeof module ? (module.exports = { polyfill: polyfill }) : polyfill();
