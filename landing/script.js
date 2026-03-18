/**
 * ЮРИСТ ЧАСТНОЙ ПРАКТИКИ — JAVASCRIPT
 *
 * Содержимое:
 * 1. Липкая шапка (тень при скролле)
 * 2. Бургер-меню (мобильный)
 * 3. Плавное закрытие меню при клике на пункт
 * 4. Подсветка активного пункта навигации при скролле
 * 5. Кнопка «Наверх»
 * 6. Маска телефонного номера
 * 7. Валидация и отправка формы
 * 8. Анимация появления элементов (Intersection Observer)
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. Липкая шапка ─────────────────────────────────────── */
  const header = document.getElementById('header');

  const onScroll = () => {
    // Добавляем тень после прокрутки 10px
    header.classList.toggle('header--scrolled', window.scrollY > 10);

    // Кнопка «Наверх»
    scrollTopBtn.hidden = window.scrollY < 400;
  };

  window.addEventListener('scroll', onScroll, { passive: true });


  /* ── 2. Бургер-меню ──────────────────────────────────────── */
  const burger = document.getElementById('burger');
  const nav    = document.getElementById('nav');

  burger.addEventListener('click', () => {
    const isOpen = burger.classList.toggle('open');
    nav.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    // Блокируем прокрутку фона при открытом меню
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });


  /* ── 3. Закрытие меню при клике на пункт ────────────────── */
  nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      nav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });


  /* ── 4. Активный пункт навигации при скролле ─────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  const activateLink = () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', activateLink, { passive: true });


  /* ── 5. Кнопка «Наверх» ──────────────────────────────────── */
  const scrollTopBtn = document.getElementById('scrollTop');

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ── 6. Маска телефонного номера ─────────────────────────── */
  const phoneInput = document.getElementById('phone');

  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, ''); // оставляем только цифры

      // Если начинается с 8 — заменяем на 7
      if (value.startsWith('8')) value = '7' + value.slice(1);
      // Добавляем 7, если вводят с +7 или сразу с цифр
      if (value.length > 0 && value[0] !== '7') value = '7' + value;

      // Форматируем: +7 (XXX) XXX-XX-XX
      let formatted = '';
      if (value.length > 0)  formatted = '+7';
      if (value.length > 1)  formatted += ' (' + value.slice(1, 4);
      if (value.length >= 4) formatted += ')';
      if (value.length > 4)  formatted += ' ' + value.slice(4, 7);
      if (value.length > 7)  formatted += '-' + value.slice(7, 9);
      if (value.length > 9)  formatted += '-' + value.slice(9, 11);

      e.target.value = formatted;
    });

    // При фокусе добавляем «+7 (», если поле пустое
    phoneInput.addEventListener('focus', () => {
      if (phoneInput.value === '') phoneInput.value = '+7 (';
    });

    // Если осталось только «+7 (» — очищаем поле
    phoneInput.addEventListener('blur', () => {
      if (phoneInput.value === '+7 (') phoneInput.value = '';
    });
  }


  /* ── 7. Валидация и отправка формы ──────────────────────── */
  const form        = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {

    /**
     * Показывает сообщение об ошибке под полем.
     * @param {HTMLElement} input  — поле ввода
     * @param {string}      msg    — текст ошибки (пустая строка = сброс)
     */
    const setError = (input, msg) => {
      const errorEl = document.getElementById(input.id + 'Error');
      input.classList.toggle('error', !!msg);
      if (errorEl) errorEl.textContent = msg;
    };

    /** Проверяет одно поле и возвращает true, если оно валидно. */
    const validateField = (input) => {
      const value = input.value.trim();

      if (input.required && !value) {
        setError(input, 'Это поле обязательно для заполнения');
        return false;
      }

      if (input.id === 'phone' && value) {
        // Проверяем, что в номере 11 цифр
        const digits = value.replace(/\D/g, '');
        if (digits.length < 11) {
          setError(input, 'Введите полный номер телефона');
          return false;
        }
      }

      if (input.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          setError(input, 'Введите корректный email');
          return false;
        }
      }

      setError(input, '');
      return true;
    };

    // Валидируем поле при потере фокуса (UX: ошибка появляется после ввода)
    form.querySelectorAll('.form-input').forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      // Убираем ошибку, как только пользователь начал исправлять
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) validateField(input);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Проверяем все поля
      const fields  = [...form.querySelectorAll('.form-input')];
      const isValid = fields.every(f => validateField(f));

      if (!isValid) return;

      // ──────────────────────────────────────────────────────
      // ИНТЕГРАЦИЯ С БЭКЕНДОМ
      // Замените блок ниже реальным fetch/axios-запросом.
      // Пример:
      //
      // const data = new FormData(form);
      // fetch('/api/contact', { method: 'POST', body: data })
      //   .then(r => r.json())
      //   .then(() => showSuccess())
      //   .catch(() => alert('Ошибка отправки, попробуйте позже'));
      //
      // ──────────────────────────────────────────────────────

      // Временно: имитируем отправку через setTimeout
      const submitBtn = form.querySelector('.form-submit');
      submitBtn.textContent = 'Отправляем...';
      submitBtn.disabled = true;

      setTimeout(() => {
        form.reset();
        submitBtn.textContent = 'Отправить заявку';
        submitBtn.disabled = false;
        formSuccess.hidden = false;
        // Скрываем сообщение об успехе через 6 секунд
        setTimeout(() => { formSuccess.hidden = true; }, 6000);
      }, 1200); // имитация задержки сети
    });
  }


  /* ── 8. Анимация появления элементов ─────────────────────── */
  // Используем Intersection Observer для плавного fade-in
  const animateItems = document.querySelectorAll(
    '.service-card, .why-item, .case-card, .review-card, .about__content, .hero__stats .stat'
  );

  // Добавляем начальный стиль через JS (не CSS), чтобы не ломать print
  animateItems.forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Небольшая задержка для каждого следующего элемента в группе
          setTimeout(() => {
            entry.target.style.opacity   = '1';
            entry.target.style.transform = 'translateY(0)';
          }, i * 80);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 } // элемент должен быть виден на 12%
  );

  animateItems.forEach(el => observer.observe(el));


  /* ── 9. Плавающая кнопка контактов (FAB) ────────────────── */
  const fab       = document.getElementById('fab');
  const fabToggle = document.getElementById('fabToggle');

  if (fabToggle) {
    fabToggle.addEventListener('click', () => {
      fab.classList.toggle('open');
    });

    // Закрываем при клике вне FAB
    document.addEventListener('click', (e) => {
      if (!fab.contains(e.target)) {
        fab.classList.remove('open');
      }
    });
  }


  /* ── 10. Cookie-баннер ──────────────────────────────────── */
  const cookieBanner = document.getElementById('cookieBanner');
  const cookieAccept = document.getElementById('cookieAccept');

  if (cookieBanner && !localStorage.getItem('cookiesAccepted')) {
    cookieBanner.hidden = false;
  }

  if (cookieAccept) {
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'true');
      cookieBanner.hidden = true;
    });
  }

  // ── Яндекс.Метрика: цели ──────────────────────────────────
  // ЗАМЕНИТЕ XXXXX на ваш номер счётчика
  function ymGoal(target) {
    if (typeof ym === 'function') ym(XXXXX, 'reachGoal', target);
  }

  // Клик по телефону
  document.querySelectorAll('a[href^="tel:"]').forEach(function(link) {
    link.addEventListener('click', function() { ymGoal('click_phone'); });
  });

  // Клик по Telegram
  document.querySelectorAll('a[href*="t.me/"]').forEach(function(link) {
    link.addEventListener('click', function() { ymGoal('click_telegram'); });
  });

  // Отправка формы
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function() { ymGoal('submit_form'); });
  }

}); // end DOMContentLoaded
