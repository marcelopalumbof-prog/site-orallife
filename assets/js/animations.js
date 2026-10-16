/* ==========================================================================
   Clínica Oral Life — animações de rolagem (GSAP + ScrollTrigger)
   --------------------------------------------------------------------------
   Como este arquivo carrega ANTES do main.js, ele "assume" as entradas
   dos elementos .reveal quando o GSAP está disponível. O main.js percebe
   isso pela classe .gsap-on no <html> e desliga o próprio observador.

   Se o GSAP não carregar, ou se o sistema tiver "reduzir movimento"
   ativado, nada aqui roda — e o site continua funcionando com o sistema
   de entrada padrão do main.js.

   Tudo é registrado via gsap.matchMedia(), que limpa os gatilhos
   automaticamente se a preferência do usuário mudar.

   Movimentos escolhidos (propositalmente discretos):
   01. Entradas .reveal           — fade-up com stagger por grupo
   02. Navbar, faixa do hero e    — entrada única no carregamento
       botão flutuante
   03. Hero                       — zoom + parallax lentos ao rolar
   04. Marca d'água e ilustrações — deriva suave (arcadas, moléculas)
   05. Fotos grandes              — "respiração" (zoom lento) ao passar
   06. Micro-detalhes             — estrelas e números das etapas
   07. Cards decorativos          — deriva apenas no desktop (só existem lá)
   ========================================================================== */

(function () {
  'use strict';

  if (!window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  var mm = gsap.matchMedia();

  /* ======================================================================
     Base — só roda sem "reduzir movimento"
     ====================================================================== */
  mm.add('(prefers-reduced-motion: no-preference)', function () {

    // Avisa CSS e main.js de que o GSAP está no comando
    document.documentElement.classList.add('gsap-on');

    /* ----------------------------------------------------------------
       01. Entradas .reveal
       "end: 'max'" impede que um salto de rolagem (âncora, Page Down,
       posição restaurada pelo navegador) pule a faixa ativa do gatilho
       e deixe conteúdo invisível.
    ---------------------------------------------------------------- */
    gsap.set('.reveal', { opacity: 0, y: 22 });

    ScrollTrigger.batch('.reveal', {
      start: 'top 90%',
      end: 'max',
      once: true,
      onEnter: function (els) {
        gsap.to(els, {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
          stagger: 0.07,
          overwrite: true
        });
      }
    });

    /* ----------------------------------------------------------------
       01b. Rede de segurança — se algum gatilho for perdido por qualquer
       motivo, qualquer elemento que já esteja em cena (ou que já passou)
       e ainda esteja invisível é revelado na hora.
    ---------------------------------------------------------------- */
    var safetyNet = function () {
      var limit = window.innerHeight * 0.95;
      var missed = [];
      document.querySelectorAll('.reveal').forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.top < limit && parseFloat(getComputedStyle(el).opacity) < 0.05) {
          missed.push(el);
        }
      });
      if (missed.length) {
        gsap.to(missed, {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: 'power3.out',
          stagger: 0.03,
          overwrite: true
        });
      }
    };

    ScrollTrigger.addEventListener('refresh', safetyNet);
    window.addEventListener('load', function () {
      setTimeout(safetyNet, 1500);
    });

    // Cobrir saltos bruscos de rolagem (âncoras, teclado, rolar do touch)
    var safetyTimer = null;
    window.addEventListener(
      'scroll',
      function () {
        if (safetyTimer) return;
        safetyTimer = setTimeout(function () {
          safetyTimer = null;
          safetyNet();
        }, 400);
      },
      { passive: true }
    );

    /* ----------------------------------------------------------------
       02. Entrada única no carregamento
    ---------------------------------------------------------------- */
    gsap.from('.nav__pill', {
      y: -14,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      delay: 0.1
    });

    gsap.from('.hero__strip', {
      opacity: 0,
      y: 10,
      duration: 0.9,
      ease: 'power2.out',
      delay: 0.55
    });

    gsap.from('.wa-float', {
      y: 22,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      delay: 1.05
    });

    /* ----------------------------------------------------------------
       03. Hero — zoom e parallax enquanto o banner sai da tela
           (a moldura tem overflow:hidden, então nada vaza)
    ---------------------------------------------------------------- */
    gsap.fromTo('.hero__media',
      { scale: 1.02, yPercent: 0 },
      {
        scale: 1.15,
        yPercent: 3.5,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero__frame',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6
        }
      }
    );

    gsap.to('.hero__inner', {
      y: -46,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero__frame',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6
      }
    });

    /* ----------------------------------------------------------------
       04. Marca d'água e ilustrações — deriva suave
    ---------------------------------------------------------------- */
    var drift = function (el, trigger, from, to) {
      if (!document.querySelector(el)) return;
      gsap.fromTo(el, from, {
        y: to.y,
        rotate: to.rotate,
        ease: 'none',
        scrollTrigger: {
          trigger: trigger,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8
        }
      });
    };

    drift('.plan-panel__watermark', '.plan-panel', { y: 48, rotate: 1.4 }, { y: -48, rotate: -1.4 });
    drift('.insurers__watermark', '.insurers', { y: 40, rotate: -2 }, { y: -40, rotate: 2 });
    drift('.cta-block__deco', '.cta-block', { y: 26, rotate: -1.2 }, { y: -26, rotate: 1.2 });

    /* ----------------------------------------------------------------
       05. Fotos grandes — "respiração" (zoom lento) ao passar pela tela
           (todos os contêineres têm overflow:hidden)
    ---------------------------------------------------------------- */
    ['.steps-media img', '.insurers__media img', '.reviews__photo img'].forEach(function (selector) {
      if (!document.querySelector(selector)) return;
      gsap.fromTo(selector, { scale: 1.06 }, {
        scale: 1.16,
        ease: 'none',
        scrollTrigger: {
          trigger: selector,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5
        }
      });
    });

    /* ----------------------------------------------------------------
       06. Micro-detalhes — estrelas da nota e números das etapas
    ---------------------------------------------------------------- */
    if (document.querySelector('.rating__stars')) {
      gsap.from('.rating__stars svg', {
        scale: 0.3,
        opacity: 0,
        stagger: 0.07,
        duration: 0.5,
        ease: 'back.out(2.2)',
        scrollTrigger: { trigger: '.rating', start: 'top 85%', once: true }
      });
    }

    if (document.querySelector('.steps')) {
      gsap.from('.step__num', {
        scale: 0.4,
        opacity: 0,
        stagger: 0.09,
        duration: 0.5,
        ease: 'back.out(2)',
        scrollTrigger: { trigger: '.steps', start: 'top 85%', once: true }
      });
    }
  });

  /* ======================================================================
     07. Cards decorativos — só existem a partir de 1025px de largura
     ====================================================================== */
  mm.add('(min-width: 1025px) and (prefers-reduced-motion: no-preference)', function () {
    if (!document.querySelector('.deco-a')) return;

    gsap.fromTo('.deco-a svg', { y: 26, rotate: 3 }, {
      y: -26,
      rotate: -3,
      ease: 'none',
      scrollTrigger: { trigger: '.deco-a', start: 'top bottom', end: 'bottom top', scrub: 0.8 }
    });

    gsap.fromTo('.deco-b svg', { y: -22, rotate: -3 }, {
      y: 22,
      rotate: 3,
      ease: 'none',
      scrollTrigger: { trigger: '.deco-b', start: 'top bottom', end: 'bottom top', scrub: 0.8 }
    });
  });
})();
