(() => {
  "use strict";

  const STORAGE_KEYS = {
    products: "motobike.products.v1",
    cart: "motobike.cart.v1",
    favorites: "motobike.favorites.v1"
  };
  const CATEGORIES = ["Sport bike", "Naked bike", "Touring", "Cross / Enduro", "Kaskalar", "Qo‘lqoplar", "Moto kiyimlar", "Ehtiyot qismlar"];
  const FALLBACK_IMAGE = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="650" viewBox="0 0 800 650"><rect width="800" height="650" fill="#eeeeec"/><path d="M0 475h800" stroke="#ddd" stroke-width="3"/><circle cx="282" cy="407" r="76" fill="none" stroke="#333" stroke-width="18"/><circle cx="570" cy="407" r="76" fill="none" stroke="#333" stroke-width="18"/><path d="m285 405 94-117 113 7 80 110M367 345h120l-57-89h-69l-73 70m240-69 45-18" fill="none" stroke="#e5282d" stroke-linecap="round" stroke-linejoin="round" stroke-width="28"/><text x="400" y="570" text-anchor="middle" font-family="Arial,sans-serif" font-size="26" fill="#777">MOTO BIKE</text></svg>'
  );
  const seedProducts = [
    { id: "bike-r1", name: "Yamaha YZF-R1", price: 289000000, oldPrice: 310000000, category: "Sport bike", image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=85", description: "Poyga texnologiyalari asosida yaratilgan, kuchli va aniq boshqaruvga ega sport mototsikl. Trassada ham, ochiq yo‘lda ham yuqori hissiyot beradi.", stock: 4, createdAt: 1740000000001, featured: true },
    { id: "bike-mt09", name: "Yamaha MT-09", price: 168000000, oldPrice: null, category: "Naked bike", image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=900&q=85", description: "Yengil kuzov, chaqqon boshqaruv va kuchli motor uyg‘unlashgan zamonaviy naked bike. Shaharda kundalik yurish uchun ham juda qulay.", stock: 6, createdAt: 1740000000002, featured: true },
    { id: "bike-tiger", name: "Triumph Tiger 900", price: 245000000, oldPrice: 268000000, category: "Touring", image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=85&sat=-20", description: "Uzoq masofalar va turli yo‘l sharoitlari uchun yaratilgan adventure touring mototsikl. Qulay o‘tirish holati va sayohatga tayyor xarakter.", stock: 3, createdAt: 1740000000003, featured: false },
    { id: "bike-enduro", name: "KTM 450 Enduro", price: 132000000, oldPrice: null, category: "Cross / Enduro", image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=85&sat=-55", description: "Yengil va chidamli enduro modeli. Notekis yo‘llar, changli yo‘laklar va yangi sarguzashtlar uchun o‘ziga ishonchli hamroh.", stock: 2, createdAt: 1740000000004, featured: false },
    { id: "helmet-agv", name: "AGV K6 S — Matte Black", price: 7950000, oldPrice: 8900000, category: "Kaskalar", image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=900&q=85", description: "Yengil kompozit qobiq, keng ko‘rish maydoni va qulay ichki qoplama. Kundalik va sport haydovchiligi uchun ishonchli himoya.", stock: 12, createdAt: 1740000000005, featured: true },
    { id: "gloves-alpinestars", name: "Alpinestars GP Pro", price: 2450000, oldPrice: null, category: "Qo‘lqoplar", image: "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?auto=format&fit=crop&w=900&q=85", description: "Himoya panellari va mustahkam materialdan tikilgan sport qo‘lqoplari. Qulay ushlash va boshqaruvni yaxshilashga yordam beradi.", stock: 18, createdAt: 1740000000006, featured: false },
    { id: "jacket-dainese", name: "Dainese Racing 4", price: 12400000, oldPrice: null, category: "Moto kiyimlar", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=85", description: "Mustahkam charm, ergonomik bichim va himoya elementlari bilan jihozlangan moto kurtka. Safarda qulaylik va himoya uchun.", stock: 7, createdAt: 1740000000007, featured: false },
    { id: "chain-kit", name: "DID X-Ring zanjir to‘plami", price: 1850000, oldPrice: null, category: "Ehtiyot qismlar", image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=900&q=85", description: "Chidamli X-Ring texnologiyasidagi zanjir to‘plami. Moslikni aniqlash uchun mototsiklingiz modelini mutaxassis bilan tekshiring.", stock: 9, createdAt: 1740000000008, featured: false }
  ];

  function readStorage(key, fallback, validate) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      const parsed = JSON.parse(raw);
      return validate(parsed) ? parsed : fallback;
    } catch (error) {
      console.error(`Saqlangan ma’lumotni o‘qib bo‘lmadi (${key}).`, error);
      return fallback;
    }
  }
  function saveStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      showToast("Ma’lumotni saqlab bo‘lmadi. Brauzer xotirasini tekshiring.", "error");
      console.error(`Ma’lumotni saqlab bo‘lmadi (${key}).`, error);
      return false;
    }
  }
  const isProductList = value => Array.isArray(value) && value.every(product =>
    product && typeof product.id === "string" && typeof product.name === "string" &&
    Number.isFinite(product.price) && typeof product.category === "string" &&
    Number.isInteger(product.stock) && product.stock >= 0
  );
  let products = readStorage(STORAGE_KEYS.products, null, isProductList);
  if (!products) {
    products = seedProducts.map(product => ({ ...product }));
    saveStorage(STORAGE_KEYS.products, products);
  }
  let cart = readStorage(STORAGE_KEYS.cart, [], value => Array.isArray(value) &&
    value.every(item => item && typeof item.id === "string" && Number.isInteger(item.quantity) && item.quantity > 0));
  let favorites = readStorage(STORAGE_KEYS.favorites, [], value => Array.isArray(value) && value.every(id => typeof id === "string"));
  cart = cart.filter(item => products.some(product => product.id === item.id))
    .map(item => ({ ...item, quantity: Math.min(item.quantity, products.find(product => product.id === item.id).stock) }))
    .filter(item => item.quantity > 0);
  favorites = favorites.filter(id => products.some(product => product.id === id));

  const state = { activeCategory: "Barchasi", searchQuery: "", sort: "featured", favoritesOnly: false };
  const $ = selector => document.querySelector(selector);
  const grid = $("#product-grid");
  const categoryFilters = $("#category-filters");
  const catalogEmpty = $("#catalog-empty");
  const dialogs = ["#details-dialog", "#cart-dialog", "#favorites-dialog", "#admin-dialog"].map(selector => $(selector)).filter(Boolean);

  function formatPrice(price) {
    return `${new Intl.NumberFormat("uz-UZ").format(price)} so‘m`;
  }
  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  }
  function imageHTML(url, alt, className) {
    const safeUrl = typeof url === "string" && /^https?:\/\//i.test(url) ? url : FALLBACK_IMAGE;
    return `<img class="${className}" src="${escapeHTML(safeUrl)}" alt="${escapeHTML(alt)}" loading="lazy" data-fallback="true">`;
  }
  function showToast(message, type = "success") {
    const region = $("#toast-region");
    if (!region) return;
    const toast = document.createElement("div");
    toast.className = `toast${type === "error" ? " error" : ""}`;
    toast.setAttribute("role", type === "error" ? "alert" : "status");
    toast.textContent = message;
    region.append(toast);
    window.setTimeout(() => toast.remove(), 3500);
  }
  function productById(id) {
    return products.find(product => product.id === id);
  }
  function persistProducts() {
    return saveStorage(STORAGE_KEYS.products, products);
  }
  function persistCart() {
    saveStorage(STORAGE_KEYS.cart, cart);
    updateCounts();
  }
  function persistFavorites() {
    saveStorage(STORAGE_KEYS.favorites, favorites);
    updateCounts();
  }
  function updateCounts() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartBadge = $("#cart-count");
    const favoritesBadge = $("#favorites-count");
    if (cartBadge) cartBadge.textContent = String(cartCount);
    if (favoritesBadge) favoritesBadge.textContent = String(favorites.length);
  }
  function renderCategories() {
    if (!categoryFilters) return;
    const categories = ["Barchasi", "Aksessuarlar", ...CATEGORIES];
    categoryFilters.innerHTML = categories.map(category =>
      `<button class="category-chip${state.activeCategory === category ? " active" : ""}" type="button" data-category="${escapeHTML(category)}" aria-pressed="${state.activeCategory === category}">${escapeHTML(category)}</button>`
    ).join("");
  }
  function visibleProducts() {
    let filtered = products.filter(product => {
      const accessoryCategories = ["Kaskalar", "Qo‘lqoplar", "Moto kiyimlar", "Ehtiyot qismlar"];
      const matchesCategory = state.activeCategory === "Barchasi" ||
        (state.activeCategory === "Aksessuarlar" ? accessoryCategories.includes(product.category) : product.category === state.activeCategory);
      const matchesSearch = !state.searchQuery || `${product.name} ${product.category} ${product.description}`.toLocaleLowerCase("uz").includes(state.searchQuery.toLocaleLowerCase("uz"));
      const matchesFavorites = !state.favoritesOnly || favorites.includes(product.id);
      return matchesCategory && matchesSearch && matchesFavorites;
    });
    if (state.sort === "price-asc") filtered.sort((a, b) => a.price - b.price);
    if (state.sort === "price-desc") filtered.sort((a, b) => b.price - a.price);
    if (state.sort === "newest") filtered.sort((a, b) => b.createdAt - a.createdAt);
    if (state.sort === "featured") filtered.sort((a, b) => Number(b.featured) - Number(a.featured) || b.createdAt - a.createdAt);
    return filtered;
  }
  function renderProducts() {
    if (!grid || !catalogEmpty) return;
    const items = visibleProducts();
    const status = $("#catalog-status");
    if (status) status.textContent = state.favoritesOnly ? `${items.length} ta sevimli mahsulot` : `${items.length} ta mahsulot`;
    catalogEmpty.hidden = items.length > 0;
    grid.hidden = items.length === 0;
    grid.innerHTML = items.map((product, index) => {
      const favorite = favorites.includes(product.id);
      const discount = product.oldPrice && product.oldPrice > product.price;
      return `<article class="product-card" style="animation-delay:${Math.min(index * 35, 245)}ms">
        <div class="product-image-wrap">
          ${imageHTML(product.image, product.name, "product-image")}
          ${discount ? `<span class="product-label">-${Math.round((1 - product.price / product.oldPrice) * 100)}%</span>` : ""}
          <button class="favorite-toggle${favorite ? " active" : ""}" type="button" data-action="favorite" data-id="${escapeHTML(product.id)}" aria-label="${favorite ? "Sevimlilardan olib tashlash" : "Sevimlilarga qo‘shish"}" aria-pressed="${favorite}">${favorite ? "♥" : "♡"}</button>
        </div>
        <div class="product-content">
          <p class="product-category">${escapeHTML(product.category)}</p>
          <h3 class="product-title">${escapeHTML(product.name)}</h3>
          <p class="product-description">${escapeHTML(product.description)}</p>
          <div class="product-price-row"><span class="product-price">${formatPrice(product.price)}</span>${discount ? `<span class="old-price">${formatPrice(product.oldPrice)}</span>` : ""}</div>
          <p class="stock-line${product.stock > 0 && product.stock <= 3 ? " low-stock" : ""}">${product.stock > 0 ? `Omborda: ${product.stock} ta` : "Hozircha mavjud emas"}</p>
          <div class="product-actions">
            <button class="button button-primary" type="button" data-action="add-cart" data-id="${escapeHTML(product.id)}" ${product.stock < 1 ? "disabled" : ""}>Savatga qo‘shish <span aria-hidden="true">+</span></button>
            <button class="button button-outline-dark" type="button" data-action="favorite" data-id="${escapeHTML(product.id)}" aria-label="${favorite ? "Sevimlilardan olib tashlash" : "Sevimlilarga qo‘shish"}" aria-pressed="${favorite}">${favorite ? "♥" : "♡"}</button>
            <button class="button details-button" type="button" data-action="details" data-id="${escapeHTML(product.id)}">Batafsil ko‘rish <span aria-hidden="true">↗</span></button>
          </div>
        </div>
      </article>`;
    }).join("");
    renderCategories();
  }
  function openDialog(dialog) {
    if (!dialog || typeof dialog.showModal !== "function") return;
    if (!dialog.open) dialog.showModal();
    document.body.classList.add("dialog-open");
  }
  function closeDialog(dialog) {
    if (dialog && dialog.open) dialog.close();
  }
  function syncDialogBodyLock() {
    if (!dialogs.some(dialog => dialog.open)) document.body.classList.remove("dialog-open");
  }
  function openDetails(id) {
    const product = productById(id);
    if (!product) return;
    const content = $("#details-content");
    if (!content) return;
    content.innerHTML = `<div class="details-layout">
      ${imageHTML(product.image, product.name, "details-image")}
      <div class="details-copy"><p class="product-category">${escapeHTML(product.category)}</p><h2 id="details-title">${escapeHTML(product.name)}</h2>
        <p>${escapeHTML(product.description)}</p><span class="product-price">${formatPrice(product.price)}</span>
        ${product.oldPrice && product.oldPrice > product.price ? `<span class="old-price">${formatPrice(product.oldPrice)}</span>` : ""}
        <p class="stock-line${product.stock > 0 && product.stock <= 3 ? " low-stock" : ""}">${product.stock > 0 ? `Omborda: ${product.stock} ta` : "Hozircha mavjud emas"}</p>
        <button class="button button-primary" type="button" data-action="add-cart" data-id="${escapeHTML(product.id)}" ${product.stock < 1 ? "disabled" : ""}>Savatga qo‘shish <span aria-hidden="true">+</span></button>
      </div>
    </div>`;
    openDialog($("#details-dialog"));
  }
  function addToCart(id) {
    const product = productById(id);
    if (!product) return showToast("Mahsulot topilmadi.", "error");
    const item = cart.find(entry => entry.id === id);
    if (product.stock < 1 || (item && item.quantity >= product.stock)) return showToast("Omborda yetarli mahsulot mavjud emas.", "error");
    if (item) item.quantity += 1;
    else cart.push({ id, quantity: 1 });
    persistCart();
    renderProducts();
    renderCart();
    showToast(`${product.name} savatga qo‘shildi.`);
  }
  function toggleFavorite(id) {
    const product = productById(id);
    if (!product) return;
    if (favorites.includes(id)) {
      favorites = favorites.filter(favoriteId => favoriteId !== id);
      showToast("Mahsulot sevimlilardan olib tashlandi.");
    } else {
      favorites.push(id);
      showToast("Mahsulot sevimlilarga qo‘shildi.");
    }
    persistFavorites();
    renderProducts();
    renderFavorites();
  }
  function renderCart() {
    const content = $("#cart-content");
    if (!content) return;
    if (!cart.length) {
      content.innerHTML = '<div class="empty-dialog"><span aria-hidden="true">⌑</span>Savatingiz hozircha bo‘sh.<br>Katalogdan o‘zingizga yoqqan mahsulotni tanlang.</div>';
      return;
    }
    const subtotal = cart.reduce((sum, item) => {
      const product = productById(item.id);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
    content.innerHTML = `${cart.map(item => {
      const product = productById(item.id);
      if (!product) return "";
      return `<div class="cart-line">
        ${imageHTML(product.image, product.name, "")}
        <div class="cart-line-info"><strong>${escapeHTML(product.name)}</strong><small>${formatPrice(product.price)}</small>
          <div class="quantity-control"><button type="button" data-action="quantity" data-id="${escapeHTML(product.id)}" data-change="-1" aria-label="Miqdorni kamaytirish">−</button><span>${item.quantity}</span><button type="button" data-action="quantity" data-id="${escapeHTML(product.id)}" data-change="1" aria-label="Miqdorni oshirish" ${item.quantity >= product.stock ? "disabled" : ""}>+</button></div>
        </div>
        <div class="cart-line-end"><strong>${formatPrice(product.price * item.quantity)}</strong><button class="remove-line" type="button" data-action="remove-cart" data-id="${escapeHTML(product.id)}">Olib tashlash</button></div>
      </div>`;
    }).join("")}
    <div class="cart-summary"><div class="cart-total"><span>Jami</span><strong>${formatPrice(subtotal)}</strong></div><p>Yetkazib berish narxi buyurtma tasdiqlanganda kelishiladi.</p><button class="button button-primary" type="button" data-action="checkout">Buyurtmani rasmiylashtirish <span aria-hidden="true">→</span></button></div>`;
  }
  function updateQuantity(id, change) {
    const item = cart.find(entry => entry.id === id);
    const product = productById(id);
    if (!item || !product) return;
    const nextQuantity = item.quantity + change;
    if (nextQuantity > product.stock) return showToast("Omborda yetarli mahsulot mavjud emas.", "error");
    if (nextQuantity < 1) cart = cart.filter(entry => entry.id !== id);
    else item.quantity = nextQuantity;
    persistCart();
    renderCart();
    renderProducts();
  }
  function renderFavorites() {
    const content = $("#favorites-content");
    if (!content) return;
    const favoriteProducts = favorites.map(productById).filter(Boolean);
    if (!favoriteProducts.length) {
      content.innerHTML = '<div class="empty-dialog"><span aria-hidden="true">♡</span>Sevimlilar ro‘yxati bo‘sh.<br>Mahsulot yonidagi yurakni bosib saqlab qo‘ying.</div>';
      return;
    }
    content.innerHTML = favoriteProducts.map(product => `<div class="favorite-line">
      ${imageHTML(product.image, product.name, "")}
      <div><strong>${escapeHTML(product.name)}</strong><small>${formatPrice(product.price)}</small><button class="favorite-remove" type="button" data-action="favorite" data-id="${escapeHTML(product.id)}">Sevimlidan olib tashlash</button></div>
      <button class="button button-primary" type="button" data-action="add-cart" data-id="${escapeHTML(product.id)}" ${product.stock < 1 ? "disabled" : ""}>Savatga</button>
    </div>`).join("");
  }
  function renderAdminList() {
    const list = $("#admin-product-list");
    const count = $("#admin-product-count");
    if (!list) return;
    if (count) count.textContent = `${products.length} ta mahsulot`;
    if (!products.length) {
      list.innerHTML = '<div class="admin-empty">Hozircha mahsulot yo‘q.</div>';
      return;
    }
    list.innerHTML = products.map(product => `<div class="admin-product-row">
      ${imageHTML(product.image, product.name, "")}
      <div><strong>${escapeHTML(product.name)}</strong><small>${escapeHTML(product.category)} · ${formatPrice(product.price)} · Ombor: ${product.stock}</small></div>
      <div class="admin-row-actions"><button type="button" data-action="edit-product" data-id="${escapeHTML(product.id)}">Tahrirlash</button><button type="button" data-action="delete-product" data-id="${escapeHTML(product.id)}">O‘chirish</button></div>
    </div>`).join("");
  }
  function prepareAdminForm() {
    const select = $("#admin-category");
    if (select) select.innerHTML = CATEGORIES.map(category => `<option value="${escapeHTML(category)}">${escapeHTML(category)}</option>`).join("");
    renderAdminList();
  }
  function resetAdminForm() {
    const form = $("#admin-form");
    if (!form) return;
    form.reset();
    $("#admin-product-id").value = "";
    $("#admin-form-title").textContent = "Yangi mahsulot";
    $("#admin-submit").innerHTML = 'Mahsulot qo‘shish <span aria-hidden="true">+</span>';
    $("#admin-cancel-edit").hidden = true;
  }
  function editProduct(id) {
    const product = productById(id);
    if (!product) return;
    $("#admin-product-id").value = product.id;
    $("#admin-name").value = product.name;
    $("#admin-price").value = String(product.price);
    $("#admin-old-price").value = product.oldPrice ? String(product.oldPrice) : "";
    $("#admin-category").value = product.category;
    $("#admin-image").value = /^https?:\/\//i.test(product.image) ? product.image : "";
    $("#admin-description").value = product.description;
    $("#admin-stock").value = String(product.stock);
    $("#admin-form-title").textContent = "Mahsulotni tahrirlash";
    $("#admin-submit").innerHTML = 'O‘zgarishlarni saqlash <span aria-hidden="true">✓</span>';
    $("#admin-cancel-edit").hidden = false;
    $("#admin-form-title").scrollIntoView({ behavior: "smooth", block: "center" });
  }
  function handleAdminSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const name = $("#admin-name").value.trim();
    const price = Number($("#admin-price").value);
    const oldPriceInput = $("#admin-old-price").value.trim();
    const oldPrice = oldPriceInput ? Number(oldPriceInput) : null;
    const category = $("#admin-category").value;
    const image = $("#admin-image").value.trim() || FALLBACK_IMAGE;
    const description = $("#admin-description").value.trim();
    const stock = Number($("#admin-stock").value);
    const editingId = $("#admin-product-id").value;
    if (!name || !description || !CATEGORIES.includes(category) || !Number.isSafeInteger(price) || price < 1 ||
        (oldPrice !== null && (!Number.isSafeInteger(oldPrice) || oldPrice < 1 || oldPrice <= price)) ||
        !Number.isInteger(stock) || stock < 0 || stock > 1000000) {
      return showToast("Maydonlarni tekshiring. Narx musbat butun son, eski narx esa joriy narxdan yuqori bo‘lsin.", "error");
    }
    if (image !== FALLBACK_IMAGE) {
      try {
        const parsedUrl = new URL(image);
        if (!["http:", "https:"].includes(parsedUrl.protocol)) throw new Error("URL noto‘g‘ri");
      } catch {
        return showToast("Rasm uchun to‘g‘ri http yoki https URL kiriting.", "error");
      }
    }
    const previousProducts = products.map(product => ({ ...product }));
    const previousCart = cart.map(item => ({ ...item }));
    let successMessage;
    if (editingId) {
      const product = productById(editingId);
      if (!product) return showToast("Tahrirlanadigan mahsulot topilmadi.", "error");
      Object.assign(product, { name, price, oldPrice, category, image, description, stock });
      cart = cart.map(item => item.id === product.id ? { ...item, quantity: Math.min(item.quantity, stock) } : item).filter(item => item.quantity > 0);
      successMessage = "Mahsulot ma’lumotlari yangilandi.";
    } else {
      products.unshift({ id: `product-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, name, price, oldPrice, category, image, description, stock, createdAt: Date.now(), featured: false });
      successMessage = "Yangi mahsulot katalogga qo‘shildi.";
    }
    if (!persistProducts()) {
      products = previousProducts;
      cart = previousCart;
      return;
    }
    if (editingId) persistCart();
    showToast(successMessage);
    resetAdminForm();
    renderProducts();
    renderCart();
    renderAdminList();
  }
  function deleteProduct(id) {
    const product = productById(id);
    if (!product) return;
    if (!window.confirm(`“${product.name}” mahsulotini o‘chirishni tasdiqlaysizmi?`)) return;
    const previousProducts = products;
    const previousCart = cart;
    const previousFavorites = favorites;
    products = products.filter(item => item.id !== id);
    cart = cart.filter(item => item.id !== id);
    favorites = favorites.filter(favoriteId => favoriteId !== id);
    if (!persistProducts()) {
      products = previousProducts;
      cart = previousCart;
      favorites = previousFavorites;
      return;
    }
    persistCart();
    persistFavorites();
    renderProducts();
    renderCart();
    renderFavorites();
    renderAdminList();
    showToast("Mahsulot o‘chirildi.");
  }
  function handleDelegatedClick(event) {
    const button = event.target.closest("[data-action]");
    if (!button) return;
    const { action, id } = button.dataset;
    if (action === "add-cart") addToCart(id);
    if (action === "favorite") toggleFavorite(id);
    if (action === "details") openDetails(id);
    if (action === "quantity") updateQuantity(id, Number(button.dataset.change));
    if (action === "remove-cart") {
      cart = cart.filter(item => item.id !== id);
      persistCart();
      renderCart();
      renderProducts();
    }
    if (action === "edit-product") editProduct(id);
    if (action === "delete-product") deleteProduct(id);
    if (action === "checkout") showToast("Demo do‘kon: buyurtma serverga yuborilmadi. Bog‘lanish uchun telefon yoki Telegramdan foydalaning.", "error");
  }
  function clearFilters() {
    state.activeCategory = "Barchasi";
    state.searchQuery = "";
    state.sort = "featured";
    state.favoritesOnly = false;
    const searchInput = $("#search-input");
    const sortSelect = $("#sort-select");
    if (searchInput) searchInput.value = "";
    if (sortSelect) sortSelect.value = "featured";
    renderProducts();
  }

  document.addEventListener("click", handleDelegatedClick);
  document.addEventListener("error", event => {
    const image = event.target;
    if (image instanceof HTMLImageElement && image.dataset.fallback === "true" && image.src !== FALLBACK_IMAGE) image.src = FALLBACK_IMAGE;
  }, true);
  document.addEventListener("click", event => {
    const closeButton = event.target.closest("[data-close-dialog]");
    if (closeButton) closeDialog(closeButton.closest("dialog"));
  });
  dialogs.forEach(dialog => {
    dialog.addEventListener("close", syncDialogBodyLock);
    dialog.addEventListener("cancel", event => {
      event.preventDefault();
      closeDialog(dialog);
    });
    dialog.addEventListener("click", event => {
      if (event.target === dialog) closeDialog(dialog);
    });
  });
  document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    const openDialog = dialogs.find(dialog => dialog.open);
    if (openDialog) closeDialog(openDialog);
  });
  categoryFilters?.addEventListener("click", event => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    state.activeCategory = button.dataset.category;
    state.favoritesOnly = false;
    renderProducts();
  });
  $("#sort-select")?.addEventListener("change", event => {
    state.sort = event.target.value;
    renderProducts();
  });
  $("#search-input")?.addEventListener("input", event => {
    state.searchQuery = event.target.value.trim();
    state.favoritesOnly = false;
    renderProducts();
  });
  $("#search-toggle")?.addEventListener("click", () => {
    const bar = $("#search-bar");
    if (!bar) return;
    bar.hidden = !bar.hidden;
    if (!bar.hidden) $("#search-input")?.focus();
    else {
      state.searchQuery = "";
      if ($("#search-input")) $("#search-input").value = "";
      renderProducts();
    }
  });
  $("#search-close")?.addEventListener("click", () => {
    $("#search-bar").hidden = true;
    $("#search-input").value = "";
    state.searchQuery = "";
    renderProducts();
  });
  $("#clear-filters")?.addEventListener("click", clearFilters);
  $("#empty-clear")?.addEventListener("click", clearFilters);
  $("#cart-open")?.addEventListener("click", () => {
    renderCart();
    openDialog($("#cart-dialog"));
  });
  $("#favorites-open")?.addEventListener("click", () => {
    state.favoritesOnly = false;
    renderFavorites();
    openDialog($("#favorites-dialog"));
  });
  $("#admin-open")?.addEventListener("click", () => {
    prepareAdminForm();
    openDialog($("#admin-dialog"));
  });
  $("#admin-form")?.addEventListener("submit", handleAdminSubmit);
  $("#admin-cancel-edit")?.addEventListener("click", resetAdminForm);
  $("#contact-form")?.addEventListener("submit", event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    showToast("Rahmat! Demo rejimida xabar serverga yuborilmadi. Iltimos, telefon yoki Telegram orqali bog‘laning.", "error");
    form.reset();
  });
  $("#menu-toggle")?.addEventListener("click", event => {
    const button = event.currentTarget;
    const nav = $("#primary-nav");
    const isOpen = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isOpen));
    button.setAttribute("aria-label", isOpen ? "Menyuni ochish" : "Menyuni yopish");
    nav?.classList.toggle("open", !isOpen);
  });
  $("#primary-nav")?.addEventListener("click", event => {
    const link = event.target.closest("a");
    if (!link) return;
    if (link.dataset.categoryLink) {
      state.activeCategory = link.dataset.categoryLink;
      renderProducts();
    }
    $("#menu-toggle")?.setAttribute("aria-expanded", "false");
    $("#menu-toggle")?.setAttribute("aria-label", "Menyuni ochish");
    $("#primary-nav")?.classList.remove("open");
  });
  $("#back-to-top")?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  window.addEventListener("scroll", () => $("#back-to-top")?.classList.toggle("visible", window.scrollY > 450), { passive: true });
  $("#current-year").textContent = String(new Date().getFullYear());

  renderCategories();
  renderProducts();
  updateCounts();
})();
