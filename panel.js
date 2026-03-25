// First Car Colombia — Panel Scripts

// ── Brand Logos Map ──────────────────────────────────────────
const BRAND_LOGOS = {
  'Toyota':        'https://upload.wikimedia.org/wikipedia/commons/9/9d/Toyota_carlogo.svg',
  'Renault':       'https://upload.wikimedia.org/wikipedia/commons/4/49/Renault_2021_Text.svg',
  'Kia':           'https://upload.wikimedia.org/wikipedia/commons/1/13/Kia-logo.svg',
  'Chevrolet':     'https://upload.wikimedia.org/wikipedia/commons/8/8f/Chevrolet_Script_logo.svg',
  'Mazda':         'https://upload.wikimedia.org/wikipedia/commons/a/a8/Mazda_logo_with_emblem.svg',
  'Nissan':        'https://upload.wikimedia.org/wikipedia/commons/8/8b/Nissan_2020_logo.svg',
  'Suzuki':        'https://upload.wikimedia.org/wikipedia/commons/1/1f/Suzuki_logo_2.svg',
  'Volkswagen':    'https://upload.wikimedia.org/wikipedia/commons/6/6d/Volkswagen_logo_2019.svg',
  'Hyundai':       'https://upload.wikimedia.org/wikipedia/commons/8/8b/Hyundai_Motor_Company_logo.svg',
  'Ford':          'https://upload.wikimedia.org/wikipedia/commons/3/3e/Ford_Motor_Company_Logo.svg',
  'BMW':           'https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg',
  'Mercedes-Benz': 'https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg',
  'Audi':          'https://upload.wikimedia.org/wikipedia/commons/9/92/Audi-Logo_2016.svg',
  'BYD':           'https://upload.wikimedia.org/wikipedia/commons/1/19/BYD_Company_Logo.svg',
  'Honda':         'https://upload.wikimedia.org/wikipedia/commons/3/38/Honda.svg',
  'Mitsubishi':    'https://upload.wikimedia.org/wikipedia/commons/8/8a/Mitsubishi_logo.svg',
  'Jeep':          'https://upload.wikimedia.org/wikipedia/commons/0/05/Jeep_logo.svg',
  'Peugeot':       'https://upload.wikimedia.org/wikipedia/commons/5/5b/Peugeot_logo.svg',
  'Fiat':          'https://upload.wikimedia.org/wikipedia/commons/8/82/Fiat_logo.svg',
  'Subaru':        'https://upload.wikimedia.org/wikipedia/commons/5/5c/Subaru_logo.svg',
  'Volvo':         'https://upload.wikimedia.org/wikipedia/commons/3/38/Volvo_Cars_logo.svg',
  'Land Rover':    'https://upload.wikimedia.org/wikipedia/commons/a/a5/Land_Rover_logo.svg',
  'MG':            'https://upload.wikimedia.org/wikipedia/commons/e/e7/MG_Logo.svg',
  'Isuzu':         'https://upload.wikimedia.org/wikipedia/commons/5/5e/Isuzu_logo.svg',
  'Chery':'', 'Changan':'', 'JAC':'', 'Haval':'', 'DFSK':'',
  'Foton':'', 'SsangYong':'', 'Deepal':'', 'GAC Aion':'',
};

function brandLogoHTML(brand, size, theme) {
  size  = size  || 'sm';
  theme = theme || 'dark';
  var url  = BRAND_LOGOS[brand] || '';
  var w    = size === 'sm' ? 36 : size === 'md' ? 48 : 56;
  var h    = size === 'sm' ? 20 : size === 'md' ? 26 : 32;
  var filt = theme === 'dark' ? 'brightness(0) invert(1)' : 'none';
  if (!url) return '<strong>' + brand + '</strong>';
  var imgEl = document.createElement('img');
  imgEl.src = url;
  imgEl.alt = brand;
  imgEl.width = w;
  imgEl.height = h;
  imgEl.style.cssText = 'object-fit:contain;filter:' + filt + ';opacity:.85';
  imgEl.onerror = function(){ this.style.display='none'; };
  var span = document.createElement('span');
  span.style.cssText = 'display:inline-flex;align-items:center;gap:7px;vertical-align:middle';
  var nameSpan = document.createElement('span');
  nameSpan.textContent = brand;
  span.appendChild(imgEl);
  span.appendChild(nameSpan);
  return span.outerHTML;
}


// ══════════════════════════════════════════════════
//  AUTH SYSTEM
// ══════════════════════════════════════════════════

// ⚠️  CREDENCIALES — cambiar por las definitivas
const USERS_DB = [
  { id:'admin', username:'AdminFC',  password:'1948*J',        role:'admin',     name:'Admin Master' },
  // Los 5 slots adicionales (el admin puede crearlos desde el panel)
];

let currentUser = null;
let vehicles = (function(){
  try { var v=JSON.parse(localStorage.getItem('fc_vehicles')||'[]'); return Array.isArray(v)?v:[]; }
  catch(e){ return []; }
})();
// Always load admin from USERS_DB (source of truth), merge extra users from localStorage
let users = (function(){
  try {
    var saved = JSON.parse(localStorage.getItem('fc_users')||'[]');
    var extra = Array.isArray(saved) ? saved.filter(function(u){return u.role!=='admin';}) : [];
    return USERS_DB.concat(extra);
  } catch(e){ return USERS_DB.slice(); }
})();
let editPhotos  = [];

function doLogin() {
  const u = document.getElementById('loginUser').value.trim();
  const p = document.getElementById('loginPass').value;
  const found = users.find(x => x.username === u && x.password === p);
  if (!found) {
    document.getElementById('loginError').style.display = 'block';
    document.getElementById('loginPass').value = '';
    return;
  }
  currentUser = found;
  document.getElementById('loginScreen').style.display  = 'none';
  document.getElementById('dashboard').style.display = 'block';
  initDashboard();
}

document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && document.getElementById('loginScreen').style.display !== 'none') doLogin();
});

function doLogout() {
  currentUser = null;
  document.getElementById('dashboard').style.display   = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('loginUser').value = '';
  document.getElementById('loginPass').value = '';
  document.getElementById('loginError').style.display  = 'none';
}

// ══════════════════════════════════════════════════
//  INIT DASHBOARD
// ══════════════════════════════════════════════════
function initDashboard() {
  document.getElementById('sidebarUsername').textContent = currentUser.name;
  document.getElementById('sidebarRoleBadge').textContent = currentUser.role === 'admin' ? 'Admin Master' : currentUser.role;
  document.getElementById('sidebarRole').textContent = currentUser.role === 'admin' ? 'Admin Master' : currentUser.role;
  document.getElementById('sidebarAvatar').textContent = currentUser.name[0].toUpperCase();

  // Hide admin-only items for non-admins
  if (currentUser.role !== 'admin') {
    document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
    document.getElementById('btnAddUser') && (document.getElementById('btnAddUser').style.display = 'none');
  }

  // Date
  const d = new Date();
  document.getElementById('topbarDate').textContent = d.toLocaleDateString('es-CO', { weekday:'long', day:'numeric', month:'long' });

  // SEO char counters
  document.getElementById('seoTitle').addEventListener('input', e => {
    document.getElementById('seoTitleCount').textContent = `${e.target.value.length} / 60 caracteres`;
  });
  document.getElementById('seoDesc').addEventListener('input', e => {
    document.getElementById('seoDescCount').textContent = `${e.target.value.length} / 160 caracteres`;
  });

  updateStats();
  renderVehicleTable();
  renderUserList();
  renderLeadsTable();
}

// ══════════════════════════════════════════════════
//  NAVIGATION
// ══════════════════════════════════════════════════
const panelTitles = {
  overview:'Resumen', vehicles:'Gestión de Vehículos',
  upload:'Subir Vehículo', seo:'SEO / SEM',
  config:'Configuración del Sitio', users:'Gestión de Usuarios', leads:'Gestión de Leads'
};

function showPanel(id, navEl) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-' + id).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (navEl) navEl.classList.add('active');
  document.getElementById('pageTitle').textContent = panelTitles[id] || id;
  if (id === 'upload') {
    document.getElementById('uploadFormTitle').textContent = 'Agregar nuevo vehículo';
    clearForm();
  }
}

// ══════════════════════════════════════════════════
//  VEHICLES
// ══════════════════════════════════════════════════
function saveVehicles() { localStorage.setItem('fc_vehicles', JSON.stringify(vehicles)); }

function saveVehicle() {
  const marca  = document.getElementById('vMarca').value;
  const modelo = document.getElementById('vModelo').value.trim();
  const anio   = document.getElementById('vAnio').value;
  const precio = document.getElementById('vPrecio').value.trim();

  if (!marca || !modelo || !anio || !precio) {
    showToast('Completa los campos obligatorios (Marca, Modelo, Año, Precio)', 'error'); return;
  }

  const id = document.getElementById('editingId').value;
  const v = {
    id:          id || Date.now().toString(),
    marca, modelo, anio,
    precio:      precio,
    km:          document.getElementById('vKm').value || '0 km',
    combustible: document.getElementById('vCombustible').value,
    transmision: document.getElementById('vTransmision').value,
    tipo:        document.getElementById('vTipo').value,
    estado:      document.getElementById('vEstado').value,
    color:       document.getElementById('vColor').value,
    motor:       document.getElementById('vMotor').value,
    version:     document.getElementById('vVersion').value,
    descripcion: document.getElementById('vDescripcion').value,
    equipamiento: document.getElementById('vEquipamiento').value,
    carroceria:   document.getElementById('vCarroceria').value,
    traccion:     document.getElementById('vTraccion').value,
    puertas:      document.getElementById('vPuertas').value,
    direccion:    document.getElementById('vDireccion').value,
    placa:        document.getElementById('vPlaca').value,
    abs:          document.getElementById('vABS').checked,
    aire:         document.getElementById('vAire').checked,
    alarma:       document.getElementById('vAlarma').checked,
    vidrios:      document.getElementById('vVidrios').checked,
    photos:      editPhotos.slice(),
    fecha:       id ? (vehicles.find(x=>x.id===id)?.fecha || new Date().toLocaleDateString('es-CO')) : new Date().toLocaleDateString('es-CO'),
  };

  if (id) {
    const idx = vehicles.findIndex(x => x.id === id);
    if (idx !== -1) vehicles[idx] = v;
    showToast('Vehículo actualizado correctamente', 'success');
  } else {
    vehicles.unshift(v);
    showToast('Vehículo agregado correctamente', 'success');
  }

  saveVehicles();
  updateStats();
  renderVehicleTable();
  clearForm();
  showPanel('vehicles', document.querySelector('[onclick*="vehicles"]'));
}

function editVehicle(id) {
  const v = vehicles.find(x => x.id === id);
  if (!v) return;
  document.getElementById('editingId').value = id;
  document.getElementById('vMarca').value        = v.marca;
  document.getElementById('vModelo').value       = v.modelo;
  document.getElementById('vAnio').value         = v.anio;
  document.getElementById('vPrecio').value       = v.precio;
  document.getElementById('vKm').value           = v.km;
  document.getElementById('vCombustible').value  = v.combustible;
  document.getElementById('vTransmision').value  = v.transmision;
  document.getElementById('vTipo').value         = v.tipo;
  document.getElementById('vEstado').value       = v.estado;
  document.getElementById('vColor').value        = v.color;
  document.getElementById('vMotor').value        = v.motor;
  document.getElementById('vVersion').value      = v.version;
  document.getElementById('vDescripcion').value  = v.descripcion;
  document.getElementById('vEquipamiento').value = v.equipamiento || '';
  document.getElementById('vCarroceria').value   = v.carroceria   || '';
  document.getElementById('vTraccion').value     = v.traccion     || '';
  document.getElementById('vPuertas').value      = v.puertas      || '';
  document.getElementById('vDireccion').value    = v.direccion    || '';
  document.getElementById('vPlaca').value        = v.placa        || '';
  document.getElementById('vABS').checked        = v.abs          || false;
  document.getElementById('vAire').checked       = v.aire         || false;
  document.getElementById('vAlarma').checked     = v.alarma       || false;
  document.getElementById('vVidrios').checked    = v.vidrios      || false;
  editPhotos = v.photos ? [...v.photos] : [];
  renderPhotoGrid();
  document.getElementById('uploadFormTitle').textContent = `Editando: ${v.marca} ${v.modelo} ${v.anio}`;
  // Restore brand picker display
  const bpImg  = document.getElementById('brandPickerImg');
  const bpName = document.getElementById('brandPickerName');
  const bpUrl  = BRAND_LOGOS[v.marca] || '';
  if (bpImg)  { if (bpUrl) { bpImg.src = bpUrl; bpImg.style.display='inline-block'; } else { bpImg.style.display='none'; } }
  if (bpName) { bpName.textContent = v.marca; bpName.style.color = 'var(--text)'; }
  showPanel('upload', document.querySelector('[onclick*="upload"]'));
}

function deleteVehicle(id) {
  if (!confirm('¿Eliminar este vehículo? Esta acción no se puede deshacer.')) return;
  vehicles = vehicles.filter(x => x.id !== id);
  saveVehicles();
  updateStats();
  renderVehicleTable();
  showToast('Vehículo eliminado', 'error');
}

function clearForm() {
  ['editingId','vModelo','vAnio','vPrecio','vKm','vColor','vMotor','vVersion','vDescripcion','vEquipamiento',
   'vCarroceria','vTraccion','vPuertas','vDireccion','vPlaca'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  // Reset vMarca hidden input
  const vmEl = document.getElementById('vMarca');
  if (vmEl) vmEl.value = '';
  // Reset checkboxes
  ['vABS','vAire','vAlarma','vVidrios'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.checked = false;
  });
  editPhotos = [];
  renderPhotoGrid();
  // Reset brand picker
  const bpImg2  = document.getElementById('brandPickerImg');
  const bpName2 = document.getElementById('brandPickerName');
  if (bpImg2)  bpImg2.style.display = 'none';
  if (bpName2) { bpName2.textContent = 'Seleccionar marca'; bpName2.style.color = 'var(--text3)'; }
}

function renderVehicleTable(list) {
  const data = list !== undefined ? list : vehicles;
  const tbody = document.getElementById('vehicleTableBody');
  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--text3);padding:40px">No hay vehículos. <a href="#" onclick="showPanel('upload',null)" style="color:var(--red)">Agrega el primero</a></td></tr>`;
    return;
  }
  tbody.innerHTML = data.map(v => `
    <tr>
      <td>${brandLogoHTML(v.marca,"sm","dark")} ${v.modelo} ${v.anio}</td>
      <td>$${v.precio}</td>
      <td>${v.km}</td>
      <td>${v.anio}</td>
      <td><span class="badge ${v.tipo==='nuevo'?'badge-green':'badge-blue'}">${v.tipo}</span></td>
      <td><span class="badge ${v.estado==='disponible'?'badge-green':v.estado==='reservado'?'badge-amber':'badge-blue'}">${v.estado}</span></td>
      <td>
        <div style="display:flex;gap:8px">
          <button class="btn btn-ghost btn-sm btn-icon" onclick="editVehicle('${v.id}')" title="Editar">✏️</button>
          <button class="btn btn-danger btn-sm btn-icon" onclick="deleteVehicle('${v.id}')" title="Eliminar">🗑️</button>
        </div>
      </td>
    </tr>`).join('');
}

function filterVehicles() {
  const q      = document.getElementById('vehicleSearch').value.toLowerCase();
  const status = document.getElementById('filterStatus').value;
  const type   = document.getElementById('filterType').value;
  const result = vehicles.filter(v => {
    const matchQ = !q || `${v.marca} ${v.modelo} ${v.anio}`.toLowerCase().includes(q);
    const matchS = !status || v.estado === status;
    const matchT = !type   || v.tipo   === type;
    return matchQ && matchS && matchT;
  });
  renderVehicleTable(result);
}

function openUploadModal() { showPanel('upload', document.querySelector('[onclick*="upload"]')); }

function updateStats() {
  const total   = vehicles.length;
  const avail   = vehicles.filter(v => v.estado === 'disponible').length;
  const res     = vehicles.filter(v => v.estado === 'reservado').length;
  const sold    = vehicles.filter(v => v.estado === 'vendido').length;
  document.getElementById('stat-active').textContent   = total;
  document.getElementById('vehicleCount').textContent  = total;
  document.getElementById('stat-avail').textContent    = avail;
  document.getElementById('stat-reserved').textContent = res;
  document.getElementById('stat-sold').textContent     = sold;

  // Recent vehicles in overview
  const recent = vehicles.slice(0,5);
  const tbody  = document.getElementById('recentVehicles');
  if (!recent.length) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--text3);padding:32px">Sin vehículos aún</td></tr>`;
  } else {
    tbody.innerHTML = recent.map(v => `
      <tr>
        <td>${brandLogoHTML(v.marca,"sm","dark")} ${v.modelo} ${v.anio}</td>
        <td>$${v.precio}</td>
        <td><span class="badge ${v.estado==='disponible'?'badge-green':v.estado==='reservado'?'badge-amber':'badge-blue'}">${v.estado}</span></td>
        <td><span class="badge ${v.tipo==='nuevo'?'badge-green':'badge-blue'}">${v.tipo}</span></td>
        <td style="color:var(--text2)">${v.fecha}</td>
      </tr>`).join('');
  }
}

// ══════════════════════════════════════════════════
//  PHOTOS
// ══════════════════════════════════════════════════
function handlePhotos(files) {
  Array.from(files).forEach(file => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => { editPhotos.push(e.target.result); renderPhotoGrid(); };
    reader.readAsDataURL(file);
  });
}
function handleDrop(e) {
  e.preventDefault();
  document.getElementById('photoZone').classList.remove('drag');
  handlePhotos(e.dataTransfer.files);
}
function removePhoto(i) { editPhotos.splice(i,1); renderPhotoGrid(); }
function renderPhotoGrid() {
  const grid = document.getElementById('photoGrid');
  grid.innerHTML = editPhotos.map((src,i) => `
    <div class="photo-thumb">
      <img src="${src}" alt="foto ${i+1}">
      <button class="remove" onclick="removePhoto(${i})">×</button>
    </div>`).join('');
}

// ══════════════════════════════════════════════════
//  USERS
// ══════════════════════════════════════════════════
function saveUsers() {
    // Only persist non-admin users; admin always comes from USERS_DB
    const toSave = users.filter(u => u.role !== 'admin');
    localStorage.setItem('fc_users', JSON.stringify(toSave));
  }

function renderUserList() {
  const list = document.getElementById('userList');
  if (!list) return;
  const colors = ['#EC0606','#4e8cff','#00c97a','#f5a623','#b366ff','#ff6b9d'];
  list.innerHTML = users.map((u, i) => `
    <div class="user-card">
      <div class="user-card-avatar" style="color:${colors[i%colors.length]};border-color:${colors[i%colors.length]}44">
        ${u.name[0].toUpperCase()}
      </div>
      <div class="user-card-info">
        <div class="user-card-name">${u.name}
          ${u.role==='admin' ? '<span class="badge badge-red" style="margin-left:8px;font-size:10px">Admin Master</span>' : ''}
        </div>
        <div class="user-card-email">@${u.username} · ${u.role}</div>
      </div>
      ${u.role !== 'admin' && currentUser.role === 'admin' ? `
      <div class="user-card-actions">
        <button class="btn btn-ghost btn-sm btn-icon" onclick="editUser('${u.id}')" title="Editar">✏️</button>
        <button class="btn btn-danger btn-sm btn-icon" onclick="deleteUser('${u.id}')" title="Eliminar">🗑️</button>
      </div>` : ''}
    </div>`).join('');

  const addBtn = document.getElementById('btnAddUser');
  if (addBtn) addBtn.style.display = users.length >= 6 ? 'none' : '';
}

function openAddUserModal() {
  if (users.length >= 6) { showToast('Límite de 6 usuarios alcanzado', 'error'); return; }
  document.getElementById('userModalTitle').textContent = 'Agregar usuario';
  document.getElementById('editingUserId').value = '';
  ['uName','uUser','uPass'].forEach(id => document.getElementById(id).value = '');
  openModal('userModal');
}

function editUser(id) {
  const u = users.find(x => x.id === id);
  if (!u) return;
  document.getElementById('userModalTitle').textContent = 'Editar usuario';
  document.getElementById('editingUserId').value = id;
  document.getElementById('uName').value = u.name;
  document.getElementById('uUser').value = u.username;
  document.getElementById('uPass').value = '';
  document.getElementById('uRole').value = u.role;
  openModal('userModal');
}

function saveUser() {
  const name = document.getElementById('uName').value.trim();
  const user = document.getElementById('uUser').value.trim();
  const pass = document.getElementById('uPass').value;
  const role = document.getElementById('uRole').value;
  const id   = document.getElementById('editingUserId').value;

  if (!name || !user) { showToast('Nombre y usuario son obligatorios', 'error'); return; }
  if (!id && !pass)   { showToast('La contraseña es obligatoria', 'error'); return; }
  if (!id && users.find(u => u.username === user)) { showToast('Ese nombre de usuario ya existe', 'error'); return; }

  if (id) {
    const idx = users.findIndex(u => u.id === id);
    if (idx !== -1) {
      users[idx].name = name;
      users[idx].username = user;
      users[idx].role = role;
      if (pass) users[idx].password = pass;
    }
    showToast('Usuario actualizado', 'success');
  } else {
    users.push({ id: Date.now().toString(), username: user, password: pass, role, name });
    showToast('Usuario creado correctamente', 'success');
  }
  saveUsers();
  renderUserList();
  closeModal('userModal');
}

function deleteUser(id) {
  if (!confirm('¿Eliminar este usuario?')) return;
  users = users.filter(u => u.id !== id);
  saveUsers();
  renderUserList();
  showToast('Usuario eliminado', 'error');
}

// ══════════════════════════════════════════════════
//  SEO / SEM / CONFIG SAVES
// ══════════════════════════════════════════════════
function saveSEO() {
    const cfg = JSON.parse(localStorage.getItem('fc_seo') || '{}');
    cfg.title     = document.getElementById('seoTitle').value;
    cfg.desc      = document.getElementById('seoDesc').value;
    cfg.keywords  = document.getElementById('seoKeywords').value;
    cfg.canonical = document.getElementById('seoCanonical').value;
    localStorage.setItem('fc_seo', JSON.stringify(cfg));
    showToast('Configuración SEO guardada', 'success');
  }
  function saveSEM() {
    const cfg = {
      ga4:    document.getElementById('semGA4').value,
      google: document.getElementById('semGoogleId').value,
      fb:     document.getElementById('semFBPixel').value,
      tt:     document.getElementById('semTTPixel').value,
      custom: document.getElementById('semCustomScript').value,
    };
    localStorage.setItem('fc_sem', JSON.stringify(cfg));
    showToast('Configuración SEM guardada', 'success');
  }
  function saveOG() {
    const cfg = {
      title: document.getElementById('ogTitle').value,
      desc:  document.getElementById('ogDesc').value,
      image: document.getElementById('ogImage').value,
      card:  document.getElementById('twitterCard').value,
    };
    localStorage.setItem('fc_og', JSON.stringify(cfg));
    showToast('Open Graph guardado', 'success');
  }
  function saveTexts() {
    const cfg = JSON.parse(localStorage.getItem('fc_config') || '{}');
    cfg.heroTitle    = document.getElementById('heroTitle').value;
    cfg.heroSubtitle = document.getElementById('heroSubtitle').value;
    cfg.heroBtnText  = document.getElementById('heroBtnText').value;
    localStorage.setItem('fc_config', JSON.stringify(cfg));
    showToast('Textos del hero actualizados — visibles en el sitio', 'success');
  }
  function saveContact() {
    const cfg = JSON.parse(localStorage.getItem('fc_config') || '{}');
    cfg.phone   = document.getElementById('cfgPhone').value;
    cfg.email   = document.getElementById('cfgEmail').value;
    cfg.address = document.getElementById('cfgAddress').value;
    cfg.ig      = document.getElementById('cfgIG').value;
    localStorage.setItem('fc_config', JSON.stringify(cfg));
    showToast('Información de contacto guardada', 'success');
  }
  function resetColors() {
    document.getElementById('colorPrimary').value = '#EC0606';
    document.getElementById('colorDark').value    = '#343434';
    document.getElementById('colorBg').value      = '#FFFFFF';
    const cfg = JSON.parse(localStorage.getItem('fc_config') || '{}');
    cfg.colorPrimary = '#EC0606';
    cfg.colorDark    = '#343434';
    cfg.colorBg      = '#FFFFFF';
    localStorage.setItem('fc_config', JSON.stringify(cfg));
    showToast('Colores restablecidos', 'info');
  }
  function applyColor(varName, c) {
    const cfg = JSON.parse(localStorage.getItem('fc_config') || '{}');
    if (varName === 'red')   cfg.colorPrimary = c;
    if (varName === 'dark')  cfg.colorDark    = c;
    if (varName === 'white') cfg.colorBg      = c;
    localStorage.setItem('fc_config', JSON.stringify(cfg));
    showToast(`Color actualizado — visible en el sitio`, 'info');
  }

// ══════════════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════════════
function formatPriceInput(el) {
  let raw = el.value.replace(/\D/g,'');
  el.value = raw.replace(/\B(?=(\d{3})+(?!\d))/g,'.');
}
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

function showToast(msg, type='info') {
  const icons = { success:'✅', error:'❌', info:'ℹ️' };
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span class="toast-icon">${icons[type]}</span><span class="toast-msg">${msg}</span>`;
  document.getElementById('toastContainer').appendChild(t);
  setTimeout(() => t.remove(), 3500);
}
  // ── Brand Picker ────────────────────────────────────────────────
  function toggleBrandPicker() {
    const dd = document.getElementById('brandPickerDropdown');
    const disp = document.getElementById('brandPickerDisplay');
    const isOpen = dd.classList.contains('open');
    dd.classList.toggle('open');
    disp.classList.toggle('open');
    if (!isOpen) {
      const search = dd.querySelector('.brand-picker-search');
      if (search) { search.value=''; filterBrands(''); search.focus(); }
    }
  }

  function selectBrand(brand, el) {
    document.getElementById('vMarca').value = brand;
    const url = BRAND_LOGOS[brand] || '';
    const img = document.getElementById('brandPickerImg');
    const name = document.getElementById('brandPickerName');
    if (url) {
      img.src = url; img.style.display = 'inline-block';
    } else {
      img.style.display = 'none';
    }
    name.textContent = brand;
    name.style.color = 'var(--text)';
    document.getElementById('brandPickerDropdown').classList.remove('open');
    document.getElementById('brandPickerDisplay').classList.remove('open');
  }

  function filterBrands(q) {
    const opts = document.querySelectorAll('#brandPickerOptions .brand-select-option');
    opts.forEach(opt => {
      const name = opt.querySelector('span').textContent.toLowerCase();
      opt.style.display = name.includes(q.toLowerCase()) ? '' : 'none';
    });
  }

  // Close picker when clicking outside
  document.addEventListener('click', e => {
    const wrap = document.getElementById('brandPickerWrap');
    if (wrap && !wrap.contains(e.target)) {
      document.getElementById('brandPickerDropdown')?.classList.remove('open');
      document.getElementById('brandPickerDisplay')?.classList.remove('open');
    }
  });





  function clearDashboardCache() {
    try {
      localStorage.removeItem('fc_users');
      localStorage.removeItem('fc_vehicles');
      localStorage.removeItem('fc_config');
      localStorage.removeItem('fc_seo');
      localStorage.removeItem('fc_sem');
      localStorage.removeItem('fc_og');
    } catch(e) {}
    // Reinit users from USERS_DB
    users = [...USERS_DB];
    document.getElementById('loginError').style.display = 'none';
    alert('Caché limpiado. Ahora ingresa con AdminFC / 1948*J');
  }

  // ══════════════════════════════════════════════════
  //  LEADS
  // ══════════════════════════════════════════════════
  function loadLeads() {
    try { return JSON.parse(localStorage.getItem('fc_leads') || '[]'); } catch(e){ return []; }
  }
  function saveLeads(leads) { localStorage.setItem('fc_leads', JSON.stringify(leads)); }

  function renderLeadsTable(list) {
    var data = list !== undefined ? list : loadLeads();
    var tbody = document.getElementById('leadsTableBody');
    if (!tbody) return;

    // Update badge
    var all = loadLeads();
    var badge = document.getElementById('leadsCount');
    if (badge) badge.textContent = all.length;

    if (!data.length) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text3);padding:40px">No hay leads aún</td></tr>';
      return;
    }
    var estadoColors = { nuevo:'badge-red', contactado:'badge-amber', cerrado:'badge-green' };
    tbody.innerHTML = data.map(function(l) {
      var col = estadoColors[l.estado] || 'badge-blue';
      return '<tr>'
        + '<td><strong>' + (l.nombre||'—') + '</strong><div style="font-size:11px;color:var(--text3)">' + (l.hora||'') + '</div></td>'
        + '<td>' + (l.email||'—') + '</td>'
        + '<td>' + (l.tel||'—') + '</td>'
        + '<td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + (l.asunto||'—') + '</td>'
        + '<td style="color:var(--text2)">' + (l.fecha||'—') + '</td>'
        + '<td><select class="form-select" style="padding:4px 8px;font-size:12px" onchange="changeLeadStatus(\'' + l.id + '\',this.value)">'
          + ['nuevo','contactado','cerrado'].map(function(s){ return '<option value="'+s+'"'+(l.estado===s?' selected':'')+'>'+s.charAt(0).toUpperCase()+s.slice(1)+'</option>'; }).join('')
        + '</select></td>'
        + '<td><button class="btn btn-danger btn-sm btn-icon" onclick="deleteLead(\'' + l.id + '\')" title="Eliminar">🗑️</button></td>'
        + '</tr>';
    }).join('');
  }

  function filterLeads() {
    var q = document.getElementById('leadsSearch').value.toLowerCase();
    var estado = document.getElementById('filterLeadEstado').value;
    var all = loadLeads();
    var filtered = all.filter(function(l){
      var matchQ = !q || (l.nombre||'').toLowerCase().includes(q) || (l.email||'').toLowerCase().includes(q) || (l.tel||'').includes(q);
      var matchE = !estado || l.estado === estado;
      return matchQ && matchE;
    });
    renderLeadsTable(filtered);
  }

  function changeLeadStatus(id, newStatus) {
    var leads = loadLeads();
    var idx = leads.findIndex(function(l){ return l.id === id; });
    if (idx !== -1) { leads[idx].estado = newStatus; saveLeads(leads); }
    showToast('Estado actualizado', 'success');
  }

  function deleteLead(id) {
    if (!confirm('¿Eliminar este lead?')) return;
    var leads = loadLeads().filter(function(l){ return l.id !== id; });
    saveLeads(leads);
    renderLeadsTable();
    showToast('Lead eliminado', 'error');
  }

  function clearAllLeads() {
    if (!confirm('¿Eliminar TODOS los leads? Esta acción no se puede deshacer.')) return;
    localStorage.removeItem('fc_leads');
    renderLeadsTable();
    showToast('Todos los leads eliminados', 'error');
  }

  // Listen for new leads from the site
  window.addEventListener('storage', function(e) {
    if (e.key === 'fc_leads') renderLeadsTable();
  });