/* KIZUNA - DXC CHANGERS SOCIAL
 * Lógica de la aplicación: datos (servicios.json), geolocalización, búsqueda de dirección,
 * distancias, filtros, mapa (Leaflet + OpenStreetMap) y preferencias guardadas en el dispositivo.
 */
(function () {
  "use strict";

  var I18N = window.KIZUNA_I18N;
  var DATA_URL = "servicios.json";
  var CLAVE_PREFS = "kizuna:prefs:v1";
  var CENTRO_BCN = [41.3874, 2.1686];
  var RADIO_OPCIONES = [1, 2, 3, 4, 5];
  var CAJA_BCN = { latMin: 41.25, latMax: 41.55, lngMin: 1.95, lngMax: 2.35 };

  // ---------- Preferencias (solo en este dispositivo) ----------
  function cargarPrefs() {
    try {
      var raw = window.localStorage.getItem(CLAVE_PREFS);
      var p = raw ? JSON.parse(raw) : {};
      return p && typeof p === "object" ? p : {};
    } catch (e) {
      return {};
    }
  }

  function guardarPrefs() {
    try {
      window.localStorage.setItem(CLAVE_PREFS, JSON.stringify(prefs));
    } catch (e) {
      /* almacenamiento no disponible: la app sigue funcionando sin persistir */
    }
  }

  var prefs = cargarPrefs();
  if (!Array.isArray(prefs.favoritos)) prefs.favoritos = [];

  function idiomaInicial() {
    if (prefs.lang && I18N.idiomas.indexOf(prefs.lang) >= 0) return prefs.lang;
    var nav = (navigator.language || "es").slice(0, 2).toLowerCase();
    return I18N.idiomas.indexOf(nav) >= 0 ? nav : "es";
  }
  prefs.lang = idiomaInicial();
  if (RADIO_OPCIONES.indexOf(Number(prefs.radio)) < 0) prefs.radio = 2;
  if (typeof prefs.categoria !== "string") prefs.categoria = "todas";

  // ---------- Estado ----------
  var datos = null;
  var estado = {
    origen: null,          // { lat, lng, texto }
    texto: "",
    soloFavoritos: false,
    seleccion: null,
    abiertos: {},
    marcadores: {}
  };
  var mapa = null;
  var capaServicios = null;
  var capaOrigen = null;
  var capaRadio = null;

  // ---------- Utilidades ----------
  function t(key, vars) {
    return I18N.t(prefs.lang, key, vars);
  }

  function esc(valor) {
    return String(valor == null ? "" : valor)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function normaliza(s) {
    return String(s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "");
  }

  function distanciaM(a, b) {
    var R = 6371000;
    var rad = function (x) { return (x * Math.PI) / 180; };
    var dLat = rad(b.lat - a.lat);
    var dLng = rad(b.lng - a.lng);
    var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
    }

  function formatoDistancia(metros) {
    if (metros < 1000) return Math.round(metros) + " " + t("metros");
    return (metros / 1000).toFixed(1).replace(".", ",") + " " + t("kilometros");
  }

  function categoriaInfo(id) {
    return datos.meta.categorias.filter(function (c) { return c.id === id; })[0] || null;
  }

  function nombreCategoria(id) {
    return (I18N.textos[prefs.lang] && I18N.textos[prefs.lang].categorias[id]) ||
           I18N.textos.es.categorias[id] || id;
  }

  function esFavorito(id) {
    return prefs.favoritos.indexOf(id) >= 0;
  }

  function nombreAcceso(acceso) {
    return (I18N.textos[prefs.lang] || I18N.textos.es).accesoTipo[acceso] || acceso;
  }

  function telefonoLimpio(tel) {
    return String(tel || "").replace(/[^0-9+]/g, "");
  }

  // ---------- Filtrado ----------
  function serviciosFiltrados() {
    var q = normaliza(estado.texto.trim());
    var base = datos.servicios.filter(function (s) {
      if (prefs.categoria !== "todas" && s.categoria !== prefs.categoria) return false;
      if (estado.soloFavoritos && !esFavorito(s.id)) return false;
      if (q) {
        var campos = normaliza([s.nombre, s.entidad, s.barrio, s.direccion, s.distrito].join(" "));
        if (campos.indexOf(q) < 0) return false;
      }
      return true;
    });

    if (estado.origen) {
      var conDistancia = base.map(function (s) {
        return { s: s, d: distanciaM(estado.origen, { lat: s.lat, lng: s.lng }) };
      });
      var radioM = Number(prefs.radio) * 1000;
      return conDistancia
        .filter(function (x) { return x.d <= radioM; })
        .sort(function (a, b) { return a.d - b.d; });
    }

    return base
      .map(function (s) { return { s: s, d: null }; })
      .sort(function (a, b) { return a.s.nombre.localeCompare(b.s.nombre, prefs.lang); });
  }

  // ---------- Render: filtros y textos ----------
  function construirFiltros() {
    var cont = document.getElementById("filtros");
    var html = '<button type="button" class="btn btn--pill" data-cat="todas" aria-pressed="' +
               (prefs.categoria === "todas") + '">' + esc(t("todas")) + "</button>";
    datos.meta.categorias.forEach(function (c) {
      html += '<button type="button" class="btn btn--pill cat-' + esc(c.id) + '" data-cat="' + esc(c.id) +
              '" aria-pressed="' + (prefs.categoria === c.id) + '">' + esc(nombreCategoria(c.id)) + "</button>";
    });
    cont.innerHTML = html;
  }

  function actualizarFiltrosActivos() {
    document.querySelectorAll("#filtros [data-cat]").forEach(function (b) {
      var sel = b.getAttribute("data-cat") === prefs.categoria;
      b.setAttribute("aria-pressed", String(sel));
      b.textContent = b.getAttribute("data-cat") === "todas" ? t("todas") : nombreCategoria(b.getAttribute("data-cat"));
    });
  }

  function aplicarTextos() {
    document.documentElement.lang = prefs.lang;
    document.documentElement.dir = prefs.lang === "ar" ? "rtl" : "ltr";

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder")));
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
    });

    var radioSel = document.getElementById("radio");
    radioSel.innerHTML = RADIO_OPCIONES.map(function (km) {
      return '<option value="' + km + '">' + km + " " + esc(t("km")) + "</option>";
    }).join("");
    radioSel.value = String(prefs.radio);

    var idiomaSel = document.getElementById("idioma");
    idiomaSel.innerHTML = I18N.idiomas.map(function (code) {
      return '<option value="' + code + '">' + esc(I18N.nombres[code]) + "</option>";
    }).join("");
    idiomaSel.value = prefs.lang;

    var soloFav = document.getElementById("solo-favoritos");
    soloFav.textContent = t("soloFavoritos");
    soloFav.setAttribute("aria-pressed", String(estado.soloFavoritos));

    document.getElementById("buscar-texto").setAttribute("placeholder", t("buscarServicio"));

    construirFiltros();
    renderEmergencias();
    renderTodo();
  }

  function renderEmergencias() {
    var ul = document.getElementById("emergencias");
    ul.innerHTML = datos.meta.telefonos_ayuda.map(function (tel) {
      return '<li><a class="btn btn--pill" href="tel:' + esc(telefonoLimpio(tel.telefono)) + '">' +
             esc(tel.telefono) + " · " + esc(tel.nombre) + "</a></li>";
    }).join("");
  }

  // ---------- Render: lista ----------
  function tarjetaHTML(item) {
    var s = item.s;
    var cat = categoriaInfo(s.categoria);
    var color = cat ? cat.color : "#003366";
    var fav = esFavorito(s.id);
    var abierto = !!estado.abiertos[s.id];
    var distancia = item.d != null ? '<span class="tarjeta__distancia">' + esc(t("distancia", { d: formatoDistancia(item.d) })) + "</span>" : "";

    var accionesTel = s.telefono
      ? '<a class="btn btn--pill" href="tel:' + esc(telefonoLimpio(s.telefono)) + '">' + esc(t("llamar")) + "</a>"
      : "";

    var rutaUrl = estado.origen
      ? "https://www.openstreetmap.org/directions?engine=fossgis_osrm_foot&route=" +
        estado.origen.lat.toFixed(6) + "%2C" + estado.origen.lng.toFixed(6) + "%3B" +
        s.lat.toFixed(6) + "%2C" + s.lng.toFixed(6)
      : "https://www.openstreetmap.org/?mlat=" + s.lat + "&mlon=" + s.lng + "#map=17/" + s.lat + "/" + s.lng;

    var detalle = abierto
      ? '<dl class="tarjeta__detalle">' +
          "<dt>" + esc(t("direccionLabel")) + "</dt><dd>" + esc(s.direccion) + ", " + esc(s.barrio) + "</dd>" +
          (s.telefono ? "<dt>" + esc(t("telefono")) + "</dt><dd>" + esc(s.telefono) + "</dd>" : "") +
          "<dt>" + esc(t("horario")) + "</dt><dd>" + esc(s.horario) + "</dd>" +
          "<dt>" + esc(t("acceso")) + "</dt><dd>" + esc(nombreAcceso(s.acceso)) + "</dd>" +
          "<dt>" + esc(t("condiciones")) + "</dt><dd>" + esc(s.condiciones) + "</dd>" +
          (s.metro ? "<dt>" + esc(t("metro")) + "</dt><dd>" + esc(s.metro) + "</dd>" : "") +
          (s.bus ? "<dt>" + esc(t("bus")) + "</dt><dd>" + esc(s.bus) + "</dd>" : "") +
          "<dt>" + esc(t("entidad")) + "</dt><dd>" + esc(s.entidad) + "</dd>" +
        "</dl>"
      : "";

    return '<li class="tarjeta cat-' + esc(s.categoria) + '" data-id="' + s.id + '" id="srv-' + s.id + '">' +
      '<div class="tarjeta__cabecera"><h3 class="tarjeta__nombre">' + esc(s.nombre) + "</h3>" + distancia + "</div>" +
      '<p class="tarjeta__meta">' + esc(nombreCategoria(s.categoria)) + " · " + esc(s.barrio) + "</p>" +
      '<p class="tarjeta__meta">' + esc(s.direccion) + ' · <span class="badge badge--acceso-' + esc(s.acceso) + '" style="background:' + esc(color) + '">' + esc(nombreAcceso(s.acceso)) + "</span></p>" +
      '<div class="tarjeta__acciones">' +
        '<button type="button" class="btn btn--secundario btn--pill" data-accion="mapa" data-id="' + s.id + '">' + esc(t("verEnMapa")) + "</button>" +
        accionesTel +
        '<a class="btn btn--secundario btn--pill" target="_blank" rel="noopener" href="' + esc(rutaUrl) + '">' + esc(t("comoLlegar")) + "</a>" +
        '<button type="button" class="btn btn--secundario btn--pill" data-accion="favorito" data-id="' + s.id + '" aria-pressed="' + fav + '">' +
          esc(fav ? t("favoritoGuardado") : t("favorito")) + "</button>" +
        '<button type="button" class="btn btn--secundario btn--pill" data-accion="detalle" data-id="' + s.id + '" aria-expanded="' + abierto + '">' +
          esc(abierto ? t("ocultar") : t("detalle")) + "</button>" +
      "</div>" + detalle +
      "</li>";
  }

  function renderLista(items) {
    var ul = document.getElementById("lista");
    var vacio = document.getElementById("vacio");
    if (!items.length) {
      ul.innerHTML = "";
      vacio.hidden = false;
      vacio.textContent = estado.soloFavoritos && !prefs.favoritos.length
        ? t("sinFavoritos")
        : (estado.origen ? t("sinResultados") : t("sinUbicacion"));
      return;
    }
    vacio.hidden = true;
    ul.innerHTML = items.map(tarjetaHTML).join("");
  }

  // ---------- Render: mapa ----------
  function iniciarMapa() {
    mapa = L.map("mapa", { zoomControl: true }).setView(CENTRO_BCN, 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: t("mapaAtribucion")
    }).addTo(mapa);
    capaServicios = L.layerGroup().addTo(mapa);
    capaRadio = L.layerGroup().addTo(mapa);
    capaOrigen = L.layerGroup().addTo(mapa);
  }

  function renderMapa(items) {
    capaServicios.clearLayers();
    capaRadio.clearLayers();
    capaOrigen.clearLayers();
    estado.marcadores = {};

    items.forEach(function (item) {
      var s = item.s;
      var icono = L.divIcon({
        className: "",
        html: '<div class="marcador-servicio cat-' + esc(s.categoria) + '" aria-hidden="true"></div>',
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28]
      });
      var m = L.marker([s.lat, s.lng], { icon: icono, title: s.nombre, alt: s.nombre, keyboard: true });
      m.bindPopup("<strong>" + esc(s.nombre) + "</strong><br>" + esc(s.direccion));
      m.on("click", function () { seleccionar(s.id, false); });
      m.addTo(capaServicios);
      estado.marcadores[s.id] = m;
    });

    if (estado.origen) {
      L.circle([estado.origen.lat, estado.origen.lng], {
        radius: Number(prefs.radio) * 1000,
        color: "#0055cc", weight: 2, fillOpacity: 0.06, interactive: false
      }).addTo(capaRadio);
      L.marker([estado.origen.lat, estado.origen.lng], {
        icon: L.divIcon({ className: "", html: '<div class="marcador-usuario"></div>', iconSize: [18, 18], iconAnchor: [9, 9] }),
        title: estado.origen.texto || "",
        keyboard: false
      }).addTo(capaOrigen);
    }
  }

  function ajustarMapa(items) {
    if (estado.origen) {
      var pts = items.map(function (x) { return [x.s.lat, x.s.lng]; });
      pts.push([estado.origen.lat, estado.origen.lng]);
      if (pts.length > 1) {
        mapa.fitBounds(L.latLngBounds(pts), { padding: [30, 30], maxZoom: 16 });
      } else {
        mapa.setView([estado.origen.lat, estado.origen.lng], 15);
      }
    } else if (items.length) {
      mapa.fitBounds(L.latLngBounds(items.map(function (x) { return [x.s.lat, x.s.lng]; })), { padding: [30, 30], maxZoom: 15 });
    }
  }

  // ---------- Estado general ----------
  function renderEstado(count) {
    var el = document.getElementById("estado");
    el.classList.remove("estado--error");
    if (estado.origen) {
      el.textContent = t("resultados", { n: count }) + " · " +
        t("ubicacionFijada", { origen: estado.origen.texto || "GPS" });
    } else {
      el.textContent = t("sinUbicacion");
    }
  }

  function renderTodo(opciones) {
    var items = serviciosFiltrados();
    renderEstado(items.length);
    renderLista(items);
    renderMapa(items);
    if (mapa && (!opciones || opciones.ajustar !== false)) ajustarMapa(items);
    actualizarFiltrosActivos();
    document.getElementById("cercanos-titulo").textContent = t("cercanos");
  }

  function mostrarError(mensaje) {
    var el = document.getElementById("estado");
    el.textContent = mensaje;
    el.classList.add("estado--error");
  }

  // ---------- Selección de un servicio ----------
  function seleccionar(id, abrirDetalle) {
    estado.seleccion = id;
    var s = datos.servicios.filter(function (x) { return x.id === id; })[0];
    if (!s) return;
    if (abrirDetalle) estado.abiertos[id] = true;

    var m = estado.marcadores[id];
    if (m) {
      mapa.setView(m.getLatLng(), Math.max(mapa.getZoom(), 16));
      m.openPopup();
    } else {
      mapa.setView([s.lat, s.lng], 16);
    }

    renderTodo({ ajustar: false });
    var tarjeta = document.getElementById("srv-" + id);
    if (tarjeta) {
      tarjeta.scrollIntoView({ block: "nearest", behavior: "smooth" });
      tarjeta.focus({ preventScroll: true });
    }
  }

  // ---------- Geolocalización y dirección ----------
  function usarUbicacion() {
    if (!("geolocation" in navigator)) {
      mostrarError(t("geoNoSoportada"));
      return;
    }
    document.getElementById("estado").textContent = t("ubicando");
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        estado.origen = { lat: pos.coords.latitude, lng: pos.coords.longitude, texto: "GPS" };
        renderTodo();
      },
      function () {
        mostrarError(t("geoDenegada"));
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 60000 }
    );
  }

  function buscarDireccion(texto) {
    var q = texto.trim();
    if (!q) return;
    if (!/barcelona/i.test(q)) q = q + ", Barcelona";

    var el = document.getElementById("estado");
    el.textContent = t("buscando");

    var ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, 10000) : null;
    var url = "https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=es&q=" +
              encodeURIComponent(q);

    fetch(url, {
      headers: { "Accept-Language": prefs.lang },
      signal: ctrl ? ctrl.signal : undefined
    })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (res) {
        if (timer) clearTimeout(timer);
        if (!res || !res.length) { mostrarError(t("direccionNoEncontrada")); return; }
        var lat = parseFloat(res[0].lat);
        var lng = parseFloat(res[0].lon);
        if (lat < CAJA_BCN.latMin || lat > CAJA_BCN.latMax || lng < CAJA_BCN.lngMin || lng > CAJA_BCN.lngMax) {
          mostrarError(t("direccionNoEncontrada"));
          return;
        }
        estado.origen = { lat: lat, lng: lng, texto: texto.trim() };
        renderTodo();
      })
      .catch(function () {
        if (timer) clearTimeout(timer);
        mostrarError(t("direccionNoEncontrada"));
      });
  }

  // ---------- Eventos ----------
  function enlazarEventos() {
    document.getElementById("idioma").addEventListener("change", function (e) {
      prefs.lang = e.target.value;
      guardarPrefs();
      aplicarTextos();
    });

    document.getElementById("radio").addEventListener("change", function (e) {
      prefs.radio = Number(e.target.value);
      guardarPrefs();
      renderTodo();
    });

    document.getElementById("filtros").addEventListener("click", function (e) {
      var b = e.target.closest("[data-cat]");
      if (!b) return;
      prefs.categoria = b.getAttribute("data-cat");
      guardarPrefs();
      renderTodo({ ajustar: false });
    });

    document.getElementById("solo-favoritos").addEventListener("click", function () {
      estado.soloFavoritos = !estado.soloFavoritos;
      this.setAttribute("aria-pressed", String(estado.soloFavoritos));
      renderTodo({ ajustar: false });
    });

    document.getElementById("buscar-texto").addEventListener("input", function (e) {
      estado.texto = e.target.value;
      renderTodo({ ajustar: false });
    });

    document.getElementById("btn-ubicacion").addEventListener("click", usarUbicacion);

    document.getElementById("form-direccion").addEventListener("submit", function (e) {
      e.preventDefault();
      buscarDireccion(document.getElementById("direccion").value);
    });

    document.getElementById("lista").addEventListener("click", function (e) {
      var btn = e.target.closest("[data-accion]");
      if (!btn) return;
      var id = Number(btn.getAttribute("data-id"));
      var accion = btn.getAttribute("data-accion");

      if (accion === "mapa") {
        seleccionar(id, false);
      } else if (accion === "detalle") {
        estado.abiertos[id] = !estado.abiertos[id];
        renderTodo({ ajustar: false });
      } else if (accion === "favorito") {
        var idx = prefs.favoritos.indexOf(id);
        if (idx >= 0) prefs.favoritos.splice(idx, 1);
        else prefs.favoritos.push(id);
        guardarPrefs();
        renderTodo({ ajustar: false });
      }
    });
  }

  // ---------- Arranque ----------
  function arrancar() {
    fetch(DATA_URL, { cache: "no-cache" })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (json) {
        datos = json;
        iniciarMapa();
        enlazarEventos();
        aplicarTextos();
      })
      .catch(function () {
        mostrarError("No se han podido cargar los recursos. / No s'han pogut carregar els recursos.");
      });
  }

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () { /* sin SW: la app funciona online */ });
    });
  }

  document.addEventListener("DOMContentLoaded", arrancar);
})();
