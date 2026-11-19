/* AGR TRIPRINCIPLE  トップページの動き */
(function () {
  'use strict';

  /* ---------- スライダー ---------- */
  document.querySelectorAll('[data-slider]').forEach(function (root) {
    var slides = root.querySelectorAll('.slide');
    var dotsBox = root.querySelector('.slider__dots');
    var pauseBtn = root.querySelector('.slider__pause');
    var INTERVAL = 6000;
    var current = 0;
    var timer = null;
    var paused = false;

    var dots = Array.prototype.map.call(slides, function (_, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', (i + 1) + '枚目へ');
      b.addEventListener('click', function () { go(i); restart(); });
      dotsBox.appendChild(b);
      return b;
    });

    function go(n) {
      current = (n + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle('is-active', i === current); });
      dots.forEach(function (d, i) { d.classList.toggle('is-active', i === current); });
    }
    function start() { if (!paused) timer = setInterval(function () { go(current + 1); }, INTERVAL); }
    function stop() { clearInterval(timer); timer = null; }
    function restart() { stop(); start(); }

    root.querySelector('.slider__arrow--prev').addEventListener('click', function () { go(current - 1); restart(); });
    root.querySelector('.slider__arrow--next').addEventListener('click', function () { go(current + 1); restart(); });
    pauseBtn.addEventListener('click', function () {
      paused = !paused;
      pauseBtn.classList.toggle('is-paused', paused);
      pauseBtn.setAttribute('aria-label', paused ? '再生' : '一時停止');
      paused ? stop() : start();
    });

    // スワイプ
    var x0 = null;
    root.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    root.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) { go(current + (dx < 0 ? 1 : -1)); restart(); }
      x0 = null;
    });

    go(0);
    start();
  });

  /* ---------- スマホのメニュー ---------- */
  var burger = document.querySelector('.header__burger');
  var gnav = document.getElementById('gnav');
  if (burger && gnav) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') !== 'true';
      burger.setAttribute('aria-expanded', open);
      gnav.classList.toggle('is-open', open);
    });
    gnav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        burger.setAttribute('aria-expanded', 'false');
        gnav.classList.remove('is-open');
      }
    });
  }

  /* ---------- ヘッダーの検索 ---------- */
  var search = document.querySelector('.header__search');
  if (search) {
    var sBtn = search.querySelector('.header__searchBtn');
    var sInput = search.querySelector('.header__searchInput');
    var setSearch = function (open) {
      search.classList.toggle('is-open', open);
      sBtn.setAttribute('aria-expanded', open);
      sBtn.setAttribute('aria-label', open ? '検索する' : '検索を開く');
      sInput.tabIndex = open ? 0 : -1;
      if (open) setTimeout(function () { sInput.focus(); }, 50);
    };
    sBtn.addEventListener('click', function () {
      if (!search.classList.contains('is-open')) return setSearch(true);
      // 開いている時：文字があれば検索、空なら閉じる
      if (sInput.value.trim()) search.requestSubmit ? search.requestSubmit() : search.submit();
      else setSearch(false);
    });
    sInput.addEventListener('keydown', function (e) { if (e.key === 'Escape') { sInput.value = ''; setSearch(false); sBtn.focus(); } });
    document.addEventListener('click', function (e) {
      if (!search.contains(e.target) && !sInput.value.trim()) setSearch(false);
    });
  }

  /* ---------- 図解の拡大表示 ---------- */
  var zoom = document.getElementById('zoom');
  if (zoom) {
    var zoomImg = zoom.querySelector('img');
    var closeZoom = function () { zoom.hidden = true; document.body.style.overflow = ''; };
    document.querySelectorAll('[data-zoom]').forEach(function (b) {
      b.addEventListener('click', function () {
        zoomImg.src = b.getAttribute('data-zoom');
        zoomImg.alt = b.querySelector('img').alt;
        zoom.hidden = false;
        document.body.style.overflow = 'hidden';
      });
    });
    zoom.addEventListener('click', closeZoom);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !zoom.hidden) closeZoom(); });
  }

  /* ---------- お気に入り ---------- */
  document.querySelectorAll('.fav').forEach(function (b) {
    b.addEventListener('click', function () {
      var on = b.getAttribute('aria-pressed') !== 'true';
      b.setAttribute('aria-pressed', on);
      b.setAttribute('aria-label', on ? 'お気に入りから外す' : 'お気に入りに追加');
    });
  });
})();
