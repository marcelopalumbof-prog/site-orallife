/* ==========================================================================
   Clínica Oral Life — interações
   --------------------------------------------------------------------------
   01. Configuração (WhatsApp, convênios)
   02. Navbar (estado ao rolar + scroll spy)
   03. Drawer mobile
   04. Disclosure "O que inclui"
   05. Carrossel de etapas
   06. Reveal ao entrar na viewport
   07. Mini formulário "Prefere que a gente chame você?"
   08. Lista de convênios
   09. Ano no rodapé
   ========================================================================== */

(function () {
  'use strict';

  /* ========================================================================
     01. CONFIGURAÇÃO
     ======================================================================== */

  var WHATSAPP_PHONE = '5571997266122';
  var WHATSAPP_DEFAULT_TEXT = 'Olá! Desejo agendar uma consulta.';

  /**
   * Convênios e planos odontológicos atendidos pela clínica.
   *
   * Adicione os nomes entre aspas, separados por vírgula. Exemplo:
   *   var CONVENIOS = ['Nome do plano A', 'Nome do plano B'];
   *
   * Enquanto a lista estiver vazia, a seção mostra o aviso de "lista em atualização".
   * Não invente nomes de planos: use apenas os convênios confirmados pela clínica.
   */
  var CONVENIOS = [
    /* 'Nome do convênio', */
  ];

  function waLink(text) {
    return 'https://api.whatsapp.com/send?phone=' + WHATSAPP_PHONE + '&text=' + encodeURIComponent(text);
  }

  /* ========================================================================
     02. NAVBAR
     ======================================================================== */
  var nav = document.getElementById('site-nav');

  if (nav) {
    var onScrollNav = function () {
      nav.classList.toggle('is-stuck', window.scrollY > 24);
    };
    onScrollNav();
    window.addEventListener('scroll', onScrollNav, { passive: true });

    // Scroll spy: destaca o link da seção visível
    var links = Array.prototype.slice.call(nav.querySelectorAll('.nav__link'));
    var targets = links
      .map(function (link) {
        var id = link.getAttribute('href');
        return id && id.charAt(0) === '#' ? document.querySelector(id) : null;
      })
      .filter(Boolean);

    if (targets.length && 'IntersectionObserver' in window) {
      var spy = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            links.forEach(function (link) {
              var match = link.getAttribute('href') === '#' + entry.target.id;
              if (match) {
                link.setAttribute('aria-current', 'true');
              } else {
                link.removeAttribute('aria-current');
              }
            });
          });
        },
        { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
      );
      targets.forEach(function (target) {
        spy.observe(target);
      });
    }
  }

  /* ========================================================================
     03. DRAWER MOBILE
     ======================================================================== */
  var drawer = document.getElementById('drawer');
  var btnOpen = document.getElementById('menu-open');
  var btnClose = document.getElementById('menu-close');
  var lastFocused = null;

  function openDrawer() {
    if (!drawer) return;
    lastFocused = document.activeElement;
    drawer.removeAttribute('inert');
    drawer.classList.add('is-open');
    document.body.classList.add('is-locked');
    if (btnOpen) btnOpen.setAttribute('aria-expanded', 'true');
    if (btnClose) btnClose.focus();
    document.addEventListener('keydown', onDrawerKey);
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('inert', '');
    document.body.classList.remove('is-locked');
    if (btnOpen) btnOpen.setAttribute('aria-expanded', 'false');
    document.removeEventListener('keydown', onDrawerKey);
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  function onDrawerKey(event) {
    if (event.key === 'Escape') {
      closeDrawer();
      return;
    }
    if (event.key !== 'Tab' || !drawer) return;

    // Mantém o foco dentro do drawer
    var focusables = drawer.querySelectorAll('a[href], button:not([disabled])');
    if (!focusables.length) return;
    var first = focusables[0];
    var last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  if (btnOpen) btnOpen.addEventListener('click', openDrawer);
  if (btnClose) btnClose.addEventListener('click', closeDrawer);

  if (drawer) {
    // Fecha ao clicar em um link interno
    drawer.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', closeDrawer);
    });

    // Se a tela crescer para desktop, garante o estado fechado
    var desktopQuery = window.matchMedia('(min-width: 1025px)');
    var onBreakpoint = function (event) {
      if (event.matches && drawer.classList.contains('is-open')) closeDrawer();
    };
    if (desktopQuery.addEventListener) desktopQuery.addEventListener('change', onBreakpoint);
    else if (desktopQuery.addListener) desktopQuery.addListener(onBreakpoint);
  }

  /* ========================================================================
     04. DISCLOSURE "O QUE INCLUI"
     ======================================================================== */
  document.querySelectorAll('.disclosure__toggle').forEach(function (toggle) {
    toggle.addEventListener('click', function () {
      var panel = document.getElementById(toggle.getAttribute('aria-controls'));
      var isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      if (panel) panel.classList.toggle('is-open', !isOpen);
    });
  });

  /* ========================================================================
     05. CARROSSEL DE ETAPAS
     ======================================================================== */
  document.querySelectorAll('[data-carousel]').forEach(function (root) {
    var track = root.querySelector('[data-carousel-track]');
    var slides = root.querySelectorAll('.carousel__slide');
    var prevBtn = root.querySelector('[data-carousel-prev]');
    var nextBtn = root.querySelector('[data-carousel-next]');
    var viewport = root.querySelector('.carousel__viewport');
    if (!track || !slides.length || !viewport) return;

    var index = 0;
    var perView = 1;
    var maxIndex = 0;
    var step = 0;

    function measure() {
      var gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
      var slideWidth = slides[0].getBoundingClientRect().width;
      step = slideWidth + gap;
      perView = Math.max(1, Math.round((viewport.clientWidth + gap) / step));
      maxIndex = Math.max(0, slides.length - perView);
      if (index > maxIndex) index = maxIndex;
      apply(false);
    }

    function apply(animate) {
      track.style.transitionDuration = animate === false ? '0ms' : '';
      track.style.transform = 'translate3d(' + -(index * step) + 'px, 0, 0)';
      if (animate === false) {
        // força o navegador a aplicar o estado sem animação
        void track.offsetWidth;
        track.style.transitionDuration = '';
      }
      var atStart = index <= 0;
      var atEnd = index >= maxIndex;
      if (prevBtn) {
        prevBtn.disabled = atStart;
        prevBtn.setAttribute('aria-disabled', String(atStart));
      }
      if (nextBtn) {
        nextBtn.disabled = atEnd;
        nextBtn.setAttribute('aria-disabled', String(atEnd));
      }
      slides.forEach(function (slide, i) {
        var visible = i >= index && i < index + perView;
        slide.setAttribute('aria-hidden', String(!visible));
      });
    }

    function goTo(value) {
      index = Math.min(Math.max(value, 0), maxIndex);
      apply(true);
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(index - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(index + 1); });

    // Teclado
    root.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goTo(index - 1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        goTo(index + 1);
      }
    });

    // Swipe / arrastar
    var startX = 0;
    var startY = 0;
    var dragging = false;

    viewport.addEventListener('pointerdown', function (event) {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      dragging = true;
      startX = event.clientX;
      startY = event.clientY;
    });

    viewport.addEventListener('pointerup', function (event) {
      if (!dragging) return;
      dragging = false;
      var dx = event.clientX - startX;
      var dy = event.clientY - startY;
      if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
      goTo(dx < 0 ? index + 1 : index - 1);
    });

    viewport.addEventListener('pointercancel', function () { dragging = false; });

    // Impede a seleção acidental de texto durante o arrasto
    viewport.addEventListener('dragstart', function (event) { event.preventDefault(); });

    measure();
    window.addEventListener('resize', measure);

    if ('ResizeObserver' in window) {
      var ro = new ResizeObserver(measure);
      ro.observe(viewport);
    }
  });

  /* ========================================================================
     06. REVEAL
     ======================================================================== */
  var revealItems = document.querySelectorAll('.reveal');

  // Quando o GSAP está ativo (assets/js/animations.js roda antes e marca
  // .gsap-on no <html>), as entradas ficam por conta do ScrollTrigger —
  // este observador entra em modo de espera.
  if (revealItems.length && !document.documentElement.classList.contains('gsap-on')) {
    var showAll = function () {
      revealItems.forEach(function (item) { item.classList.add('is-visible'); });
    };

    // Rede de segurança: se o IntersectionObserver não disparar (aba em segundo
    // plano, navegador antigo, etc.), revela o que já está na tela.
    window.addEventListener('load', function () {
      setTimeout(function () {
        document.querySelectorAll('.reveal:not(.is-visible)').forEach(function (item) {
          var rect = item.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            item.classList.add('is-visible');
          }
        });
      }, 900);
    });

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '0px 0px -40px 0px', threshold: 0.12 }
      );
      revealItems.forEach(function (item) { observer.observe(item); });
    } else {
      showAll();
    }
  }

  /* ========================================================================
     07. MINI FORMULÁRIO
     ======================================================================== */
  var form = document.getElementById('callback-form');

  if (form) {
    var nomeInput = document.getElementById('cb-nome');
    var telInput = document.getElementById('cb-tel');
    var status = form.parentElement.querySelector('.callback__status');

    var setStatus = function (message, state) {
      if (!status) return;
      status.textContent = message;
      if (state) status.setAttribute('data-state', state);
      else status.removeAttribute('data-state');
    };

    var mark = function (input, invalid) {
      input.setAttribute('aria-invalid', String(invalid));
    };

    [nomeInput, telInput].forEach(function (input) {
      if (!input) return;
      input.addEventListener('input', function () {
        mark(input, false);
        setStatus('', null);
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var nome = nomeInput ? nomeInput.value.trim() : '';
      var telefone = telInput ? telInput.value.trim() : '';
      var digitos = telefone.replace(/\D/g, '');

      if (nome.length < 2) {
        mark(nomeInput, true);
        setStatus('Por favor, informe o seu nome.', 'error');
        if (nomeInput) nomeInput.focus();
        return;
      }

      if (digitos.length < 10 || digitos.length > 13) {
        mark(telInput, true);
        setStatus('Informe um telefone válido com DDD, por exemplo (71) 90000-0000.', 'error');
        if (telInput) telInput.focus();
        return;
      }

      var mensagem =
        'Olá! Meu nome é ' + nome + ' e meu telefone para contato é ' + telefone +
        '. Gostaria que a clínica entrasse em contato para agendar uma consulta.';

      setStatus('Abrindo o WhatsApp com a sua mensagem…', 'ok');
      window.open(waLink(mensagem), '_blank', 'noopener');
      form.reset();
    });
  }

  /* ========================================================================
     08. LISTA DE CONVÊNIOS
     ======================================================================== */
  var insurersList = document.getElementById('insurers-list');
  var insurersLabel = document.getElementById('insurers-plans-label');

  if (insurersList && Array.isArray(CONVENIOS) && CONVENIOS.length) {
    var icon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

    CONVENIOS.forEach(function (nome) {
      var li = document.createElement('li');
      li.className = 'insurer';
      li.innerHTML = icon + '<span></span>';
      li.querySelector('span').textContent = nome;
      insurersList.appendChild(li);
    });

    insurersList.hidden = false;
    if (insurersLabel) insurersLabel.hidden = false;
  }

  /* ========================================================================
     09. ANO NO RODAPÉ
     ======================================================================== */
  var year = document.getElementById('ano-atual');
  if (year) year.textContent = String(new Date().getFullYear());
})();
