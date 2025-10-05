document.addEventListener('DOMContentLoaded', function () {
  console.log('main.js loaded');

  // ---------- 1) Загрузка данных (если есть fish.json) ----------
  let fishes = [];
  fetch('fish.json')
    .then(r => {
      if (!r.ok) throw new Error('fish.json not found');
      return r.json();
    })
    .then(data => { fishes = data; })
    .catch(err => {
      // это нормально, если на странице нет файла или ты не используешь поиск
      console.warn('fish.json load:', err.message);
    });

  // ---------- 2) Поиск рыбы (если на странице есть поле inputFish) ----------
  const input = document.getElementById('inputFish');
  const resultsDiv = document.getElementById('results');

  if (input && resultsDiv) {
    input.addEventListener('input', function () {
      const query = this.value.trim().toLowerCase();
      resultsDiv.innerHTML = '';

      if (query.length < 2) {
        resultsDiv.style.display = 'none';
        return;
      }

      const filtered = (fishes || []).filter(f =>
        f.name && f.name.toLowerCase().includes(query)
      );

      if (!filtered.length) {
        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = '<div>Ничего не найдено</div>';
        return;
      }

      resultsDiv.style.display = 'block';
      filtered.forEach(fish => {
        const item = document.createElement('div');
        item.textContent = fish.name;
        item.addEventListener('click', () => {
          // Обновляем блоки (если они есть)
          const setText = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val || '—';
          };
          setText('trophyWeight', fish.trophy_weight);
          setText('rareTrophyWeight', fish.rare_trophy_weight);
          setText('maxWeight', fish.max_weight);
          setText('rarity', fish.rarity);

          resultsDiv.style.display = 'none';
          input.value = fish.name;
        });
        resultsDiv.appendChild(item);
      });
    });

    // Скрываем подсказки при клике вне поля
    document.addEventListener('click', function (e) {
      if (!e.target.closest('#inputFish') && !e.target.closest('#results')) {
        const r = document.getElementById('results');
        if (r) r.style.display = 'none';
      }
    });
  }

  // ---------- 3) Универсальная логика для модалок "Написать мне" ----------
  // Ищем кнопки — допускаем и id="contactBtn" и class="contactBtn"
  const contactButtons = Array.from(document.querySelectorAll('#contactBtn, .contactBtn'));
  console.log('contact buttons:', contactButtons);

  // Собираем все модалки на странице (на случай, если их несколько)
  const modals = Array.from(document.querySelectorAll('.modal'));
  console.log('modals on page:', modals);

  // Для каждого найденного контактного элемента — вешаем открытие ближайшей модалки
  contactButtons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();

      // 1) Если кнопка имеет data-modal, используем конкретную модалку по id
      const targetId = btn.dataset && btn.dataset.modal;
      let modalEl = null;
      if (targetId) {
        modalEl = document.getElementById(targetId);
      } else {
        // 2) Иначе используем первую модалку на странице
        modalEl = document.querySelector('.modal');
      }

      if (!modalEl) {
        console.warn('Modal not found for button', btn);
        return;
      }

      // Показываем модалку и блокируем скролл страницы
      modalEl.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  });

  // Настраиваем обработчики для каждой модалки (кнопки закрыть, клик по overlay, submit)
  modals.forEach(modalEl => {
    const close = modalEl.querySelector('.close');
    const form = modalEl.querySelector('form');

    if (close) {
      close.addEventListener('click', () => {
        modalEl.style.display = 'none';
        document.body.style.overflow = '';
      });
    }

    // Закрыть кликом по фону
    modalEl.addEventListener('click', function (e) {
      if (e.target === modalEl) {
        modalEl.style.display = 'none';
        document.body.style.overflow = '';
      }
    });

    // submit формы внутри модалки (если есть)
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        alert('Ваше сообщение отправлено!');
        form.reset();
        modalEl.style.display = 'none';
        document.body.style.overflow = '';
      });
    }
  });

}); // end DOMContentLoaded




