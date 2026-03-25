// First Car Colombia — Site Scripts

// Navigation
  function showPage(id, linkEl) {
    // Ocultar todas las páginas y mostrar la seleccionada
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + id).classList.add('active');

    // Limpiar activos en nav de escritorio
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));

    // Limpiar activos en nav móvil
    document.querySelectorAll('.mobile-nav a').forEach(a => a.classList.remove('active'));

    // Si se pasó un link específico (clic desde nav escritorio), marcarlo
    if (linkEl) {
      linkEl.classList.add('active');
    }

    // Siempre sincronizar el link correspondiente en el nav de escritorio
    const desktopLink = document.querySelector('.nav-links a[onclick*="' + id + '"]');
    if (desktopLink) desktopLink.classList.add('active');

    // Siempre sincronizar el link correspondiente en el nav móvil
    const mobileLink = document.querySelector('.mobile-nav a[data-page="' + id + '"]');
    if (mobileLink) mobileLink.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Search tabs
  // ── SEARCH MODULE ────────────────────────────────────────────────

  let currentTab      = 'nuevo';
  let currentCurrency = 'COP';

  // Currency config
  // Slider: min=0, max=250 steps. Each step:
  //   COP → 1M COP  (range: $5M – $250M)
  //   USD → $250 USD (range: $1.250 – $62.500)
  //   EUR → €200 EUR (range: €1.000 – €50.000)
  const currencyConfig = {
    COP: {
      minDefault: 5,
      maxDefault: 250,
      toLabel:  v => `$${v}M`,
      maxLabel: v => v >= 250 ? '$250M+' : `$${v}M`,
    },
    USD: {
      minDefault: 5,
      maxDefault: 250,
      toLabel:  v => {
        const val = v * 250;
        return val >= 1000 ? `US$${(val/1000).toFixed(1)}k` : `US$${val}`;
      },
      maxLabel: v => {
        const val = v * 250;
        return v >= 250 ? 'US$62.500+' : (val >= 1000 ? `US$${(val/1000).toFixed(1)}k` : `US$${val}`);
      },
    },
    EUR: {
      minDefault: 5,
      maxDefault: 250,
      toLabel:  v => {
        const val = v * 200;
        return val >= 1000 ? `€${(val/1000).toFixed(1)}k` : `€${val}`;
      },
      maxLabel: v => {
        const val = v * 200;
        return v >= 250 ? '€50.000+' : (val >= 1000 ? `€${(val/1000).toFixed(1)}k` : `€${val}`);
      },
    }
  };

  // ── Marcas y modelos reales Colombia 2024-2025 ──
  const modelMap = {
    toyota:     ['Corolla Cross','Corolla','Hilux','Land Cruiser','Land Cruiser Prado','Yaris','Veloz','RAV4','Fortuner','Rush','Avanza','Hiace','4Runner','Camry','GR86'],
    renault:    ['Duster','Logan','Kwid','Stepway','Sandero','Captur','Koleos','Oroch','Kardian','Megane','Kangoo','Master','Triber','Zoe E-Tech'],
    kia:        ['Picanto','Stonic','Rio','K3 Cross','Seltos','Sportage','Sorento','Carnival','Sonet','EV5','EV3','EV6','Niro','Telluride','Cerato'],
    chevrolet:  ['Onix','Tracker','Captiva','Spark','Montana','Trailblazer','Equinox','Tahoe','Silverado','Colorado','Groove','Trax','Blazer EV','Captiva EV','Spark EUV'],
    mazda:      ['CX-30','Mazda2','Mazda3','CX-5','CX-50','CX-60','CX-90','Mazda6','MX-5','BT-50'],
    nissan:     ['Versa','Kicks','X-Trail','March','Frontier','Navara','Pathfinder','Murano','Qashqai','NP300','Sentra','GT-R'],
    suzuki:     ['Swift','Vitara','S-Cross','Jimny','Fronx','Dzire','Alto','Ertiga','Baleno','Grand Vitara','XL7'],
    volkswagen: ['Polo','Golf','T-Cross','Tiguan','Touareg','T-Roc','Virtus','Vento','Taos','Amarok','Passat','ID.4','ID.3'],
    hyundai:    ['Creta','Tucson','Santa Fe','Grand i10','Ioniq 5','Ioniq 6','Venue','Staria','Elantra','Kona EV','Palisade','i20'],
    ford:       ['Territory','Ranger','F-150','Bronco','Explorer','Escape','Mustang','Transit','Maverick','Everest','EcoSport'],
    bmw:        ['Serie 1','Serie 2','Serie 3','Serie 5','Serie 7','X1','X2','X3','X4','X5','X6','X7','iX1','iX3','i4','i5','M3','M4','M5'],
    mercedes:   ['Clase A','Clase B','Clase C','Clase E','Clase S','GLA','GLB','GLC','GLE','GLS','EQA','EQB','EQC','AMG GT','Clase CLA','Clase CLS'],
    audi:       ['A1','A3','A4','A5','A6','A7','Q2','Q3','Q5','Q7','Q8','e-tron','e-tron GT','RS3','RS5','TT'],
    byd:        ['Seagull','Yuan Up','Yuan Plus','Dolphin','Seal','Atto 3','Song Plus','Song Pro','Shark','Han','Tang','Sealion 6','Sealion 7'],
    chery:      ['Tiggo 2 Pro','Tiggo 4 Pro','Tiggo 7 Pro','Tiggo 8 Pro','Arrizo 5','iCar 03','Omoda 5','Omoda 7','Jetour Dashing','Jetour X70'],
    changan:    ['CS35 Plus','CS55 Plus','CS75 Plus','UNI-T','UNI-K','Hunter','Deepal S05','Deepal S07','Lamore','Oshan X5'],
    jac:        ['JS3','JS4','JS6','T8','J7','S2','E10X','E30X','E20X','iEV40'],
    mg:         ['MG ZS','MG5','MG HS','MG VS','MG GT','MG4 EV','MG ZS EV','MG One','Cyberster'],
    honda:      ['Civic','HR-V','CR-V','WR-V','Accord','City','BR-V','Pilot','Odyssey','ZR-V'],
    mitsubishi: ['Outlander','ASX','Eclipse Cross','Montero Sport','L200 Triton','Mirage','Outlander PHEV','Galant'],
    jeep:       ['Renegade','Compass','Wrangler','Grand Cherokee','Gladiator','Cherokee','Commander'],
    haval:      ['H6','H6 HEV','H6 PHEV','Jolion','Jolion HEV','H9','Dargo','Big Dog'],
    peugeot:    ['208','308','2008','3008','5008','408','Partner','Expert','Rifter'],
    volkswagen2:[], // placeholder
    dfsk:       ['Glory 580','Glory 580 Pro','EC35','K07S','C35'],
    foton:      ['BJ40','BJ80','Tunland','Sauvana','Midi'],
    fiat:       ['Pulse','Fastback','Mobi','Toro','Strada','Cronos','Doblo','Ducato'],
    subaru:     ['Forester','Outback','XV','Impreza','Legacy','WRX','BRZ','Solterra'],
    volvo:      ['XC40','XC60','XC90','S60','V60','C40 Recharge','EX40','EX90'],
    porsche:    ['Cayenne','Macan','Taycan','Panamera','911','718'],
    land_rover: ['Defender','Discovery','Discovery Sport','Range Rover','Range Rover Sport','Range Rover Evoque','Range Rover Velar'],
    isuzu:      ['D-Max','MU-X','Trooper'],
    ssangyong:  ['Rexton','Tivoli','Korando','Musso'],
    deepal:     ['S05','S05 E-Max','S05 Max','S07','S07 Max','G318'],
    gac:        ['Aion V','Aion UT','GS3','GS4','GS8','GA4'],
  };

  // Brands display names
  const brandNames = {
    toyota:'Toyota', renault:'Renault', kia:'Kia', chevrolet:'Chevrolet',
    mazda:'Mazda', nissan:'Nissan', suzuki:'Suzuki', volkswagen:'Volkswagen',
    hyundai:'Hyundai', ford:'Ford', bmw:'BMW', mercedes:'Mercedes-Benz',
    audi:'Audi', byd:'BYD', chery:'Chery / Omoda / Jetour', changan:'Changan / Deepal',
    jac:'JAC', mg:'MG', honda:'Honda', mitsubishi:'Mitsubishi', jeep:'Jeep',
    haval:'Haval / GWM', peugeot:'Peugeot', dfsk:'DFSK', foton:'Foton',
    fiat:'Fiat', subaru:'Subaru', volvo:'Volvo', porsche:'Porsche',
    land_rover:'Land Rover', isuzu:'Isuzu', ssangyong:'SsangYong',
    deepal:'Deepal', gac:'GAC Aion'
  };


  // Tab switcher
  function setTab(el, tab) {
    document.querySelectorAll('.search-tabs .search-tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    currentTab = tab;
  }

  // Currency switcher
  function setCurrency(currency, btn) {
    currentCurrency = currency;
    document.querySelectorAll('.currency-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cfg = currencyConfig[currency];
    document.getElementById('priceMin').value = cfg.minDefault;  // starts at 5
    document.getElementById('priceMax').value = cfg.maxDefault;
    updatePrice();
  }

  // Models by make
  function updateModels() {
    const make = document.getElementById('makeSelect').value;
    const sel  = document.getElementById('modelSelect');
    sel.innerHTML = '<option value="">Todos los modelos</option>';
    if (make && modelMap[make]) {
      modelMap[make].forEach(m => {
        const o = document.createElement('option');
        o.value = m.toLowerCase().replace(/\s+/g, '-');
        o.textContent = m;
        sel.appendChild(o);
      });
    }
  }

  // Price range dual slider
  function updatePrice() {
    let minV = parseInt(document.getElementById('priceMin').value);
    let maxV = parseInt(document.getElementById('priceMax').value);
    if (minV > maxV) [minV, maxV] = [maxV, minV];
    const fill = document.getElementById('priceFill');
    fill.style.left  = (minV / 250 * 100) + '%';
    fill.style.right = ((250 - maxV) / 250 * 100) + '%';
    const cfg = currencyConfig[currentCurrency];
    document.getElementById('priceMinVal').textContent = cfg.toLabel(minV);
    document.getElementById('priceMaxVal').textContent = cfg.maxLabel(maxV);
  }


  // Modal
  function showModal() { document.getElementById('loginModal').classList.add('active'); }
  function closeModal() { document.getElementById('loginModal').classList.remove('active'); }
  function closeModalOnBg(e) { if (e.target.id === 'loginModal') closeModal(); }
  function switchTab(tab, el) {
    document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.modal-form').forEach(f => f.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('form-' + tab).classList.add('active');
  }

  // Scroll navb
  // Scroll navbar effect
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (nav) {
      if (window.scrollY > 10) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    }
  });

  // Hamburger menu toggle
  function toggleMenu() {
    const menu = document.getElementById('mobileNav');
    const btn  = document.getElementById('hamburger');
    if (!menu || !btn) return;
    menu.classList.toggle('open');
    btn.classList.toggle('open');
  }

  // Reveal on scroll animations
  const revealEls = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObs.observe(el));

  // Run on DOM ready - sets price labels and fill bar correctly
  document.addEventListener('DOMContentLoaded', function() {
    updatePrice();
  });

  // ══════════════════════════════════════════════════
  //  INTEGRACIÓN CON DASHBOARD — localStorage bridge
  // ══════════════════════════════════════════════════

  const BRAND_LOGOS = {
    'Toyota': 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Toyota_carlogo.svg',
    'Renault': 'https://upload.wikimedia.org/wikipedia/commons/4/49/Renault_2021_Text.svg',
    'Kia': 'https://upload.wikimedia.org/wikipedia/commons/1/13/Kia-logo.svg',
    'Chevrolet': 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Chevrolet_Script_logo.svg',
    'Mazda': 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Mazda_logo_with_emblem.svg',
    'Nissan': 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Nissan_2020_logo.svg',
    'Suzuki': 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Suzuki_logo_2.svg',
    'Volkswagen': 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Volkswagen_logo_2019.svg',
    'Hyundai': 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Hyundai_Motor_Company_logo.svg',
    'Ford': 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Ford_Motor_Company_Logo.svg',
    'BMW': 'https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg',
    'Mercedes-Benz': 'https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg',
    'Audi': 'https://upload.wikimedia.org/wikipedia/commons/9/92/Audi-Logo_2016.svg',
    'BYD': 'https://upload.wikimedia.org/wikipedia/commons/1/19/BYD_Company_Logo.svg',
    'Chery': 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Chery_Automobile_logo.svg',
    'Changan': 'https://upload.wikimedia.org/wikipedia/commons/d/db/Changan_Auto_logo.svg',
    'JAC': 'https://upload.wikimedia.org/wikipedia/commons/a/a5/JAC_logo.svg',
    'MG': 'https://upload.wikimedia.org/wikipedia/commons/e/e7/MG_Logo.svg',
    'Honda': 'https://upload.wikimedia.org/wikipedia/commons/3/38/Honda.svg',
    'Mitsubishi': 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Mitsubishi_logo.svg',
    'Jeep': 'https://upload.wikimedia.org/wikipedia/commons/0/05/Jeep_logo.svg',
    'Peugeot': 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Peugeot_logo.svg',
    'Fiat': 'https://upload.wikimedia.org/wikipedia/commons/8/82/Fiat_logo.svg',
    'Subaru': 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Subaru_logo.svg',
    'Volvo': 'https://upload.wikimedia.org/wikipedia/commons/3/38/Volvo_Cars_logo.svg',
    'Land Rover': 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Land_Rover_logo.svg',
  };

  // Color icons per brand (for emoji fallback)
  const brandEmoji = {
    Toyota:'🚗', BMW:'🏎️', Mazda:'🚙', Renault:'🚕', Kia:'🚘',
    Chevrolet:'🛻', Mercedes:'🏎️', Ford:'🚐', Hyundai:'🚗',
    Volkswagen:'🚗', Nissan:'🚗', Suzuki:'🚗', Audi:'🏎️',
    BYD:'⚡', Chery:'🚗', Changan:'🚗', JAC:'🛻', MG:'🚗',
    Honda:'🚗', Mitsubishi:'🚙', Jeep:'🪖', Haval:'🚙', default:'🚗'
  };

  const gradients = [
    'linear-gradient(135deg,#1a1a2e,#16213e)',
    'linear-gradient(135deg,#0d1b2a,#1b263b)',
    'linear-gradient(135deg,#1a0a0a,#2d1010)',
    'linear-gradient(135deg,#0a1a0a,#102d10)',
    'linear-gradient(135deg,#1a1a0a,#2d2d10)',
    'linear-gradient(135deg,#0a0a1a,#10102d)',
    'linear-gradient(135deg,#1a0a1a,#2d102d)',
    'linear-gradient(135deg,#111,#222)',
    'linear-gradient(135deg,#0f0f23,#1a1a3e)',
  ];

  // Build a single car card HTML
  function buildCarCard(v, idx) {
    const emoji = brandEmoji[v.marca] || brandEmoji.default;
    const grad  = v.photos && v.photos[0]
      ? ''
      : gradients[idx % gradients.length];
    const imgStyle = v.photos && v.photos[0]
      ? `background-image:url('${v.photos[0]}');background-size:cover;background-position:center;`
      : `background:${grad}`;
    const badgeClass = v.tipo === 'nuevo' ? '' : 'used';
    const badgeText  = v.tipo === 'nuevo' ? 'Nuevo' : 'Usado';

    // Parse specs
    const specs = [
      v.motor      ? `⚙️ ${v.motor}`       : '',
      v.anio       ? `📅 ${v.anio}`         : '',
      v.km         ? `🛣️ ${v.km}`           : '',
    ].filter(Boolean).map(s => `<div class="car-spec">${s}</div>`).join('');

    return `
      <div class="car-card" data-id="${v.id}" data-estado="${v.estado}">
        <div class="car-img" style="${imgStyle}">
          ${!v.photos || !v.photos[0] ? emoji : ''}
          <div class="car-badge ${badgeClass}">${badgeText}</div>
          <div class="car-fav">♡</div>
        </div>
        <div class="car-info">
          <div class="car-brand-logo">
          ${BRAND_LOGOS[v.marca] ? `<img src="${BRAND_LOGOS[v.marca]}" alt="${v.marca}" onerror="this.style.display='none'">` : ''}
          <span>${v.marca}</span>
        </div>
          <div class="car-name">${v.modelo} ${v.anio}</div>
          <div class="car-specs">${specs}</div>
          <div class="car-footer">
            <div class="car-price">$${v.precio} <span>COP</span></div>
            <button class="btn-card" onclick="showPage('listing')">Ver Detalle</button>
          </div>
        </div>
      </div>`;
  }

  // Load vehicles from localStorage (written by dashboard)
  function loadVehiclesFromDashboard() {
    const stored = localStorage.getItem('fc_vehicles');
    if (!stored) return [];
    try { return JSON.parse(stored); } catch(e) { return []; }
  }

  // Render featured grid (home) — shows up to 6 available vehicles
  function renderFeaturedGrid() {
    const grid = document.getElementById('featuredGrid');
    if (!grid) return;
    const veh = loadVehiclesFromDashboard().filter(v => v.estado === 'disponible').slice(0, 6);
    if (!veh.length) {
      grid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--mid-gray)">
          <div style="font-size:48px;margin-bottom:12px">🚗</div>
          <div style="font-size:18px;font-weight:600">Pronto habrá vehículos disponibles</div>
          <div style="font-size:14px;margin-top:6px">El catálogo se actualizará desde el panel de administración</div>
        </div>`;
      return;
    }
    grid.innerHTML = veh.map((v, i) => buildCarCard(v, i)).join('');
  }

  // Render listing grid — full catalog with filters applied
  function renderListingGrid(filtered) {
    const grid = document.getElementById('listingGrid');
    if (!grid) return;
    const veh = filtered !== undefined ? filtered : loadVehiclesFromDashboard();

    // Update count
    const countEl = document.querySelector('.listing-count strong');
    if (countEl) countEl.textContent = veh.length.toLocaleString('es-CO');

    if (!veh.length) {
      grid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--mid-gray)">
          <div style="font-size:48px;margin-bottom:12px">🔍</div>
          <div style="font-size:18px;font-weight:600">No se encontraron vehículos</div>
          <div style="font-size:14px;margin-top:6px">Intenta con otros filtros o consulta más adelante</div>
        </div>`;
      return;
    }
    grid.innerHTML = veh.map((v, i) => buildCarCard(v, i)).join('');
  }

  // Apply site configuration from dashboard
  function applySiteConfig() {
    const cfg = JSON.parse(localStorage.getItem('fc_config') || '{}');
    if (cfg.colorPrimary) {
      document.documentElement.style.setProperty('--red', cfg.colorPrimary);
    }
    if (cfg.colorDark) {
      document.documentElement.style.setProperty('--dark', cfg.colorDark);
    }
    if (cfg.heroTitle) {
      const h1 = document.querySelector('.hero h1');
      if (h1) h1.innerHTML = cfg.heroTitle.replace('\n','<br>');
    }
  }

  // Hook doSearch to filter the listing grid
  const _origDoSearch = doSearch;
  function doSearch() {
    const make     = document.getElementById('makeSelect').value;
    const model    = document.getElementById('modelSelect').value;
    const minV     = parseInt(document.getElementById('priceMin').value);
    const maxV     = parseInt(document.getElementById('priceMax').value);
    const tab      = document.querySelector('.search-tab.active')?.textContent.trim().toLowerCase();

    showPage('listing');

    const allVeh = loadVehiclesFromDashboard();
    const filtered = allVeh.filter(v => {
      const matchMarca  = !make  || v.marca.toLowerCase().includes(make.toLowerCase());
      const matchModelo = !model || v.modelo.toLowerCase().includes(model.replace(/-/g,' ').toLowerCase());
      const matchTipo   = !tab   || tab === 'todos' || v.tipo === tab;
      // Price: v.precio can be "95.000.000" or "95" (M COP)
      const rawPrice = parseInt(v.precio.replace(/\./g,'').replace(/[^0-9]/g,'')) || 0;
      const priceInM = rawPrice > 1000 ? rawPrice / 1000000 : rawPrice;
      const matchMin = priceInM >= minV;
      const matchMax = priceInM <= maxV || maxV >= 250;
      return matchMarca && matchModelo && matchTipo && matchMin && matchMax;
    });

    setTimeout(() => renderListingGrid(filtered), 80);
  }

  // Listen for storage events (dashboard open in another tab)
  window.addEventListener('storage', e => {
    if (e.key === 'fc_vehicles') {
      renderFeaturedGrid();
      renderListingGrid();
    }
    if (e.key === 'fc_config') {
      applySiteConfig();
    }
  });

  // Init on load
  document.addEventListener('DOMContentLoaded', function() {
    updatePrice();
    applySiteConfig();
    renderFeaturedGrid();
    renderListingGrid();
  });

  // ── Lead capture ─────────────────────────────────────────────
  function submitLead() {
    var nombre   = (document.getElementById('leadNombre')   || {}).value || '';
    var apellido = (document.getElementById('leadApellido') || {}).value || '';
    var email    = (document.getElementById('leadEmail')    || {}).value || '';
    var tel      = (document.getElementById('leadTel')      || {}).value || '';
    var asunto   = (document.getElementById('leadAsunto')   || {}).value || '';
    var mensaje  = (document.getElementById('leadMensaje')  || {}).value || '';

    if (!nombre && !email && !tel) {
      alert('Por favor completa al menos tu nombre, email o teléfono.');
      return;
    }

    var leads = [];
    try { leads = JSON.parse(localStorage.getItem('fc_leads') || '[]'); } catch(e){}
    leads.unshift({
      id:       Date.now().toString(),
      nombre:   nombre + ' ' + apellido,
      email:    email,
      tel:      tel,
      asunto:   asunto,
      mensaje:  mensaje,
      fecha:    new Date().toLocaleDateString('es-CO'),
      hora:     new Date().toLocaleTimeString('es-CO', {hour:'2-digit',minute:'2-digit'}),
      estado:   'nuevo'
    });
    localStorage.setItem('fc_leads', JSON.stringify(leads));

    // Show success, clear form
    var s = document.getElementById('leadSuccess');
    if (s) s.style.display = 'block';
    ['leadNombre','leadApellido','leadEmail','leadTel','leadMensaje'].forEach(function(id){
      var el = document.getElementById(id);
      if (el) el.value = '';
    });
    setTimeout(function(){ if(s) s.style.display='none'; }, 4000);
  }

  // ── HOME LEAD CAPTURE ─────────────────────────────────────────
  function submitHomeLead() {
    var nombre  = (document.getElementById('hlNombre')  || {}).value || '';
    var celular = (document.getElementById('hlCelular') || {}).value || '';
    var correo  = (document.getElementById('hlCorreo')  || {}).value || '';

    if (!nombre && !celular && !correo) {
      document.getElementById('hlNombre').focus();
      return;
    }

    var leads = [];
    try { leads = JSON.parse(localStorage.getItem('fc_leads') || '[]'); } catch(e){}
    leads.unshift({
      id:      Date.now().toString(),
      nombre:  nombre,
      email:   correo,
      tel:     celular,
      asunto:  'Consulta desde Home',
      mensaje: '',
      fecha:   new Date().toLocaleDateString('es-CO'),
      hora:    new Date().toLocaleTimeString('es-CO', {hour:'2-digit', minute:'2-digit'}),
      estado:  'nuevo'
    });
    localStorage.setItem('fc_leads', JSON.stringify(leads));

    // Clear fields + show confirmation
    ['hlNombre','hlCelular','hlCorreo'].forEach(function(id){
      var el = document.getElementById(id);
      if (el) el.value = '';
    });
    var ok = document.getElementById('hlOk');
    if (ok) { ok.style.display = 'block'; setTimeout(function(){ ok.style.display='none'; }, 5000); }
  }