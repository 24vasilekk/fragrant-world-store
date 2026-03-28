(function () {
  const STORAGE_KEY = 'fw_catalog_v1';
  const curatedImages = {
    'xerjoff-erba-pura': 'assets/images/xerjoff-erba-pura.svg',
    'tom-ford-oud-wood': 'assets/images/tom-ford-oud-wood.svg'
  };

  const defaultProducts = [
    {
      id: 'initio-oud-for-greatness',
      name: 'Initio Oud for Greatness',
      brand: 'Initio',
      volume: '90 ml',
      price: 19900,
      notes: 'Шафран, мускатный орех, лаванда, уд',
      category: 'Unisex',
      image:
        'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 'xerjoff-erba-pura',
      name: 'Xerjoff Erba Pura',
      brand: 'Xerjoff',
      volume: '100 ml',
      price: 16900,
      notes: 'Апельсин, лимон, бергамот, белый мускус',
      category: 'Unisex',
      image: 'assets/images/xerjoff-erba-pura.svg'
    },
    {
      id: 'tom-ford-oud-wood',
      name: 'Tom Ford Oud Wood',
      brand: 'Tom Ford',
      volume: '100 ml',
      price: 21400,
      notes: 'Кардамон, уд, сандал, амбра, ваниль',
      category: 'Men',
      image: 'assets/images/tom-ford-oud-wood.svg'
    },
    {
      id: 'mancera-cedrat-boise',
      name: 'Mancera Cedrat Boise',
      brand: 'Mancera',
      volume: '120 ml',
      price: 9800,
      notes: 'Цитрус, черная смородина, кожа, ваниль',
      category: 'Unisex',
      image:
        'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 'montale-arabians-tonka',
      name: 'Montale Arabians Tonka',
      brand: 'Montale',
      volume: '100 ml',
      price: 11200,
      notes: 'Бергамот, роза, бобы тонка, амбра',
      category: 'Unisex',
      image:
        'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=80'
    }
  ];

  function sanitizeProducts(list) {
    if (!Array.isArray(list)) return null;
    const cleaned = list
      .map(function (item) {
        const id = String(item.id || '').trim();
        return {
          id: id,
          name: String(item.name || '').trim(),
          brand: String(item.brand || '').trim(),
          volume: String(item.volume || '').trim(),
          price: Number(item.price || 0),
          notes: String(item.notes || '').trim(),
          category: String(item.category || 'Unisex').trim(),
          image: curatedImages[id] || String(item.image || '').trim()
        };
      })
      .filter(function (item) {
        return item.id && item.name && item.price > 0;
      });

    return cleaned.length ? cleaned : null;
  }

  function loadCatalog() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      return sanitizeProducts(parsed) || defaultProducts.slice();
    } catch (err) {
      return defaultProducts.slice();
    }
  }

  function saveCatalog(items) {
    const data = sanitizeProducts(items);
    if (!data) return false;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  }

  function formatRub(price) {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
  }

  window.FragrantStoreData = {
    STORAGE_KEY: STORAGE_KEY,
    defaultProducts: defaultProducts,
    loadCatalog: loadCatalog,
    saveCatalog: saveCatalog,
    formatRub: formatRub
  };
})();
