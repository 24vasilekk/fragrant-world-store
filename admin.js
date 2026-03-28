(function () {
  const dataApi = window.FragrantStoreData;
  const form = document.getElementById('productForm');
  const formTitle = document.getElementById('formTitle');
  const saveBtn = document.getElementById('saveBtn');
  const cancelEditBtn = document.getElementById('cancelEditBtn');
  const imageUpload = document.getElementById('imageUpload');
  const list = document.getElementById('adminList');
  const resetBtn = document.getElementById('resetBtn');

  let products = dataApi.loadCatalog();

  function resetFormState() {
    form.reset();
    form.elements.id.value = '';
    formTitle.textContent = 'Добавить аромат';
    saveBtn.textContent = 'Сохранить в каталог';
    cancelEditBtn.hidden = true;
  }

  function slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9а-яё]+/gi, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48);
  }

  function renderList() {
    if (!products.length) {
      list.innerHTML = '<p>Каталог пуст.</p>';
      return;
    }

    list.innerHTML = products
      .map(function (item) {
        return `
          <article class="item-row">
            <img src="${item.image}" alt="${item.name}" />
            <div>
              <strong>${item.name}</strong>
              <p>${item.brand} • ${item.volume} • ${dataApi.formatRub(item.price)}</p>
            </div>
            <div class="row-actions">
              <button class="btn-small btn-edit" data-edit="${item.id}">Редактировать</button>
              <button class="danger" data-delete="${item.id}">Удалить</button>
            </div>
          </article>
        `;
      })
      .join('');
  }

  function persist() {
    dataApi.saveCatalog(products);
    renderList();
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(form).entries());
    const editId = payload.id.trim();

    const nextItem = {
      id: editId || `${slugify(payload.brand)}-${slugify(payload.name)}-${Date.now().toString(36)}`,
      name: payload.name.trim(),
      brand: payload.brand.trim(),
      volume: payload.volume.trim(),
      price: Number(payload.price),
      notes: payload.notes.trim(),
      category: payload.category,
      image: payload.image.trim()
    };

    if (editId) {
      products = products.map(function (item) {
        return item.id === editId ? nextItem : item;
      });
    } else {
      products.unshift(nextItem);
    }

    persist();
    resetFormState();
  });

  imageUpload.addEventListener('change', function (event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function () {
      form.elements.image.value = String(reader.result || '');
    };
    reader.readAsDataURL(file);
  });

  list.addEventListener('click', function (event) {
    const deleteBtn = event.target.closest('[data-delete]');
    if (deleteBtn) {
      const id = deleteBtn.dataset.delete;
      products = products.filter(function (item) {
        return item.id !== id;
      });
      persist();
      return;
    }

    const editBtn = event.target.closest('[data-edit]');
    if (!editBtn) return;
    const id = editBtn.dataset.edit;
    const item = products.find(function (entry) {
      return entry.id === id;
    });
    if (!item) return;

    form.elements.id.value = item.id;
    form.elements.name.value = item.name;
    form.elements.brand.value = item.brand;
    form.elements.volume.value = item.volume;
    form.elements.price.value = String(item.price);
    form.elements.category.value = item.category;
    form.elements.notes.value = item.notes;
    form.elements.image.value = item.image;
    formTitle.textContent = 'Редактирование аромата';
    saveBtn.textContent = 'Сохранить изменения';
    cancelEditBtn.hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  resetBtn.addEventListener('click', function () {
    products = dataApi.defaultProducts.slice();
    persist();
    resetFormState();
  });

  cancelEditBtn.addEventListener('click', function () {
    resetFormState();
  });

  resetFormState();
  renderList();
})();
