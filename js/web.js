/* paNeo · Web pública: migas, carta conectada al Sheet y animaciones GSAP */
(function () {
  'use strict';

  var reducir = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hayGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  if (hayGsap) gsap.registerPlugin(ScrollTrigger);
  var animar = hayGsap && !reducir;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- Migas del hero ---------- */
  var migas = document.getElementById('migas');
  if (migas && !reducir) {
    var cols = ['#F2B33D', '#E6B37C', '#FFD27A', '#E8761E'], html = '';
    for (var i = 0; i < 14; i++) {
      var s = 6 + (i % 4) * 3;
      html += '<span class="crumb" style="left:' + ((i * 37 + 11) % 90 + 4) + '%;top:' + ((i * 53 + 29) % 70 + 22) +
        '%;width:' + s + 'px;height:' + s + 'px;background:' + cols[i % 4] + ';animation-delay:' + ((i * 0.37) % 5).toFixed(2) + 's"></span>';
    }
    migas.innerHTML = html;
  }

  /* ---------- Carta: lee los productos del Google Sheet ---------- */
  var cont = document.getElementById('productos');
  var productos = (typeof PANEO_RESPALDO !== 'undefined' && PANEO_RESPALDO.productos) || [];
  var filtro = 'todo';

  function precio(p) { return p > 0 ? p.toFixed(2).replace('.', ',') + ' €' : 'Consultar precio'; }
  function etiquetas(p) {
    var t = [];
    if (p.sin_gluten) t.push('Sin gluten');
    if (p.vegano) t.push('Vegano');
    if (p.cero_azucar) t.push('0 azúcar');
    if (p.sin_lactosa && !p.vegano) t.push('Sin lactosa');
    return t.join(' · ');
  }
  function pintarCarta(entrada) {
    if (!cont) return;
    var lista = productos.filter(function (p) { return filtro === 'todo' || p[filtro]; });
    cont.innerHTML = lista.length ? lista.map(function (p) {
      return '<article class="card">' +
        '<div class="card-foto"><svg class="anillo" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46" fill="none" stroke="#E6B37C" stroke-width="1.5" stroke-dasharray="4 6"></circle></svg>' +
        '<img src="' + esc(p.imagen || 'assets/pan-n.png') + '" alt="' + esc(p.nombre) + '" loading="lazy" width="150" height="150"></div>' +
        '<h3>' + esc(p.nombre) + '</h3>' +
        '<p class="tags">' + esc(etiquetas(p)) + '</p>' +
        (p.descripcion ? '<p class="desc">' + esc(p.descripcion) + '</p>' : '') +
        '<p class="precio">' + esc(precio(p.precio)) + '</p></article>';
    }).join('') : '<p class="carta-vacia">Pronto tendremos productos con este filtro.</p>';

    if (!animar) return;
    var cards = cont.querySelectorAll('.card');
    if (entrada === 'filtro') {
      gsap.fromTo(cards, { scale: .7, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: .6, ease: 'back.out(1.6)', stagger: .06 });
    } else {
      gsap.set(cards, { scale: .7, autoAlpha: 0 });
      ScrollTrigger.batch(cards, {
        start: 'top 92%',
        once: true,
        onEnter: function (b) { gsap.to(b, { scale: 1, autoAlpha: 1, duration: .8, ease: 'back.out(1.4)', stagger: .08 }); }
      });
    }
  }

  if (cont) {
    document.querySelectorAll('.pill').forEach(function (b) {
      b.addEventListener('click', function () {
        filtro = b.getAttribute('data-f');
        document.querySelectorAll('.pill').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        pintarCarta('filtro');
      });
    });
    pintarCarta('inicio');

    var url = typeof API_URL === 'string' && /^https:\/\//.test(API_URL) ? API_URL : null;
    if (url) {
      fetch(url + (url.indexOf('?') > -1 ? '&' : '?') + 'action=productos')
        .then(function (r) { return r.json(); })
        .then(function (r) {
          if (r && r.ok && r.productos && r.productos.length) {
            productos = r.productos;
            pintarCarta('filtro');
            if (animar) ScrollTrigger.refresh();
          }
        })
        .catch(function () { /* se queda la lista de respaldo */ });
    }
  }

  /* ---------- Animaciones con scroll ---------- */
  if (!animar) return;

  function revelar(sel, desde) {
    gsap.utils.toArray(sel).forEach(function (el) {
      gsap.from(el, Object.assign({
        autoAlpha: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      }, desde));
    });
  }
  revelar('.rv', { y: 80 });
  revelar('.rvL', { x: -140 });
  revelar('.rvR', { x: 140 });
  revelar('.rvZ', { scale: .7 });

  // "paNeo" gigante en contorno con parallax
  var par = document.querySelector('.par');
  if (par) {
    gsap.fromTo(par, { xPercent: 4 }, {
      xPercent: -22, ease: 'none',
      scrollTrigger: { trigger: par.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  }

  // Parallax del pan del hero al hacer scroll + seguimiento suave del ratón
  var pan = document.getElementById('pan');
  if (pan) {
    gsap.to(pan, { y: 140, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.orbit-wrap', { scale: 1.12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    if (window.matchMedia('(hover: hover)').matches) {
      var mx = gsap.quickTo(pan, 'x', { duration: .8, ease: 'power3' });
      var rot = gsap.quickTo(pan, 'rotation', { duration: .8, ease: 'power3' });
      document.querySelector('.hero').addEventListener('pointermove', function (e) {
        var r = e.currentTarget.getBoundingClientRect();
        var dx = (e.clientX - r.left) / r.width - .5;
        mx(dx * 40);
        rot(dx * 6);
      });
    }
  }

  // Números 01/02/03 y casillas del bono con un pequeño rebote
  gsap.utils.toArray('.punto .num').forEach(function (n) {
    gsap.from(n, { yPercent: 60, rotation: -10, autoAlpha: 0, duration: .9, ease: 'back.out(2)', scrollTrigger: { trigger: n, start: 'top 90%', once: true } });
  });
  var casillas = gsap.utils.toArray('.tarjeta .casilla.llena img');
  if (casillas.length) {
    gsap.from(casillas, {
      scale: 2.4, rotation: 30, autoAlpha: 0, duration: .55, ease: 'back.out(2.2)', stagger: .18,
      scrollTrigger: { trigger: '.tarjeta', start: 'top 75%', once: true }
    });
  }

  // Marquees: se aceleran un poco con la velocidad del scroll
  var pistas = gsap.utils.toArray('.marquee .pista');
  if (pistas.length) {
    ScrollTrigger.create({
      onUpdate: function (self) {
        var v = Math.min(Math.abs(self.getVelocity()) / 600, 3);
        pistas.forEach(function (p) {
          p.getAnimations().forEach(function (a) { a.playbackRate = 1 + v; });
        });
      }
    });
    ScrollTrigger.addEventListener('scrollEnd', function () {
      pistas.forEach(function (p) { p.getAnimations().forEach(function (a) { a.playbackRate = 1; }); });
    });
  }
})();
