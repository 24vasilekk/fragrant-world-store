(function () {
  const dataApi = window.FragrantStoreData;
  const catalogGrid = document.getElementById('catalogGrid');
  const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
  const revealItems = Array.from(document.querySelectorAll('.reveal'));
  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');
  const perfumeModel = document.getElementById('perfumeModel');
  const cssBottleFallback = document.getElementById('cssBottleFallback');

  const modal = document.getElementById('productModal');
  const modalClose = document.getElementById('modalClose');
  const modalImage = document.getElementById('modalImage');
  const modalMeta = document.getElementById('modalMeta');
  const modalTitle = document.getElementById('modalTitle');
  const modalNotes = document.getElementById('modalNotes');
  const modalPrice = document.getElementById('modalPrice');
  const modalCategory = document.getElementById('modalCategory');

  let products = dataApi.loadCatalog();
  let activeFilter = 'all';
  let searchQuery = '';
  let sortMode = 'default';

  function cardTemplate(item) {
    return `
      <article class="card reveal" data-product="${item.id}" tabindex="0">
        <div class="card__media">
          <img class="card__img" src="${item.image}" alt="${item.name}" loading="lazy" />
          <div class="card__gloss"></div>
          <span class="card__chip">${item.category}</span>
        </div>
        <div class="card__body">
          <p class="card__meta">${item.brand} • ${item.volume}</p>
          <h3>${item.name}</h3>
          <p class="card__notes">${item.notes}</p>
          <div class="card__row">
            <span class="price">${dataApi.formatRub(item.price)}</span>
            <span class="card__open">Открыть</span>
          </div>
        </div>
      </article>
    `;
  }

  function sortProducts(items) {
    const sorted = items.slice();
    if (sortMode === 'price-asc') {
      sorted.sort(function (a, b) {
        return a.price - b.price;
      });
    } else if (sortMode === 'price-desc') {
      sorted.sort(function (a, b) {
        return b.price - a.price;
      });
    } else if (sortMode === 'name-asc') {
      sorted.sort(function (a, b) {
        return a.name.localeCompare(b.name, 'ru');
      });
    }
    return sorted;
  }

  function filteredProducts() {
    return sortProducts(
      products.filter(function (item) {
        const byCategory = activeFilter === 'all' || item.category === activeFilter;
        const needle = `${item.name} ${item.brand}`.toLowerCase();
        const bySearch = !searchQuery || needle.includes(searchQuery);
        return byCategory && bySearch;
      })
    );
  }

  function renderCatalog() {
    const current = filteredProducts();
    if (!current.length) {
      catalogGrid.innerHTML = '<p>По вашему запросу ничего не найдено.</p>';
      return;
    }

    catalogGrid.innerHTML = current.map(cardTemplate).join('');
    observeReveal();
  }

  function observeReveal() {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );

    Array.from(document.querySelectorAll('.reveal')).forEach(function (node) {
      observer.observe(node);
    });
  }

  function openModal(productId) {
    const item = products.find(function (entry) {
      return entry.id === productId;
    });
    if (!item) return;

    modalImage.src = item.image;
    modalImage.alt = item.name;
    modalMeta.textContent = `${item.brand} • ${item.volume}`;
    modalTitle.textContent = item.name;
    modalNotes.textContent = item.notes;
    modalPrice.textContent = dataApi.formatRub(item.price);
    modalCategory.textContent = item.category;

    if (typeof modal.showModal === 'function') {
      modal.showModal();
    }
  }

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      activeFilter = button.dataset.filter;
      filterButtons.forEach(function (btn) {
        btn.classList.remove('is-active');
      });
      button.classList.add('is-active');
      renderCatalog();
    });
  });

  searchInput.addEventListener('input', function () {
    searchQuery = searchInput.value.trim().toLowerCase();
    renderCatalog();
  });

  sortSelect.addEventListener('change', function () {
    sortMode = sortSelect.value;
    renderCatalog();
  });

  catalogGrid.addEventListener('click', function (event) {
    const card = event.target.closest('[data-product]');
    if (!card) return;
    openModal(card.dataset.product);
  });

  catalogGrid.addEventListener('keydown', function (event) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const card = event.target.closest('[data-product]');
    if (!card) return;
    event.preventDefault();
    openModal(card.dataset.product);
  });

  modalClose.addEventListener('click', function () {
    modal.close();
  });

  modal.addEventListener('click', function (event) {
    if (event.target === modal) {
      modal.close();
    }
  });

  if (perfumeModel && cssBottleFallback) {
    let loaded = false;

    function showFallback() {
      perfumeModel.classList.remove('is-ready');
      cssBottleFallback.hidden = false;
    }

    function showModel() {
      loaded = true;
      cssBottleFallback.hidden = true;
      perfumeModel.classList.add('is-ready');
    }

    // If custom element is unavailable on deploy, keep animated CSS fallback.
    if (!window.customElements || !customElements.get('model-viewer')) {
      showFallback();
    }

    perfumeModel.addEventListener('load', function () {
      showModel();
    });

    perfumeModel.addEventListener('error', function () {
      showFallback();
    });

    setTimeout(function () {
      if (!loaded) showFallback();
    }, 3500);
  }

  window.addEventListener('storage', function (event) {
    if (event.key === dataApi.STORAGE_KEY) {
      products = dataApi.loadCatalog();
      renderCatalog();
    }
  });

  products = dataApi.loadCatalog();
  renderCatalog();
  revealItems.forEach(function (item) {
    item.classList.add('is-visible');
  });
})();
