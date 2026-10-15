/* KIZUNA - Textos de interfaz en 6 idiomas.
 * ca, es, en, fr: revisados desde la Guía ON Barcelona.
 * eu, ar: traducción de referencia, PENDIENTE DE REVISIÓN por hablantes nativos.
 */
(function (global) {
  "use strict";

  var IDIOMAS = ["es", "ca", "eu", "en", "fr", "ar"];

  var TEXTOS = {
    es: {
      app: "KIZUNA", subtitulo: "DXC Changers Social",
      idioma: "Idioma", ubicacion: "Usar mi ubicación", ubicando: "Buscando tu ubicación…",
      direccion: "Dirección", direccionPlaceholder: "Escribe una dirección de Barcelona",
      buscar: "Buscar", buscando: "Buscando dirección…",
      radio: "Radio", km: "km", todas: "Todas",
      cercanos: "Recursos cercanos", resultados: "{n} recursos encontrados",
      sinResultados: "No hay recursos en este radio. Prueba a ampliar la distancia.",
      sinUbicacion: "Activa tu ubicación o escribe una dirección para ver los recursos más cercanos.",
      geoDenegada: "No se ha podido obtener tu ubicación. Escribe una dirección abajo.",
      geoNoSoportada: "Tu dispositivo no permite geolocalización. Escribe una dirección abajo.",
      direccionNoEncontrada: "No hemos encontrado esa dirección en Barcelona.",
      ubicacionFijada: "Ubicación: {origen}",
      verEnMapa: "Ver en mapa", llamar: "Llamar", comoLlegar: "Cómo llegar",
      favorito: "Guardar", favoritoGuardado: "Guardado", detalle: "Ver detalle", ocultar: "Ocultar",
      direccionLabel: "Dirección", telefono: "Teléfono", horario: "Horario", acceso: "Acceso",
      condiciones: "Condiciones", metro: "Metro", bus: "Bus", entidad: "Entidad",
      accesoTipo: { directo: "Acceso directo", derivacion: "Por derivación", cita: "Con cita previa" },
      distancia: "a {d}", metros: "m", kilometros: "km",
      emergencias: "Emergencias", privacidad: "Tu ubicación se usa solo en este dispositivo. La dirección escrita se envía al servicio de mapas (OpenStreetMap) para localizarla.",
      mapaAtribucion: "© OpenStreetMap",
      saltar: "Ir al contenido", cerrar: "Cerrar", buscarServicio: "Buscar por nombre",
      soloFavoritos: "Solo favoritos", sinFavoritos: "Todavía no tienes favoritos guardados.",
      categorias: { comer: "Dónde comer", dormir: "Dónde dormir", higiene: "Dónde lavarse", salud: "Dónde curarse", acogida: "Acogida y orientación" }
    },
    ca: {
      app: "KIZUNA", subtitulo: "DXC Changers Social",
      idioma: "Idioma", ubicacion: "Usar la meva ubicació", ubicando: "Cercant la teva ubicació…",
      direccion: "Adreça", direccionPlaceholder: "Escriu una adreça de Barcelona",
      buscar: "Cercar", buscando: "Cercant l'adreça…",
      radio: "Radi", km: "km", todas: "Totes",
      cercanos: "Recursos propers", resultados: "{n} recursos trobats",
      sinResultados: "No hi ha recursos en aquest radi. Prova d'ampliar la distància.",
      sinUbicacion: "Activa la teva ubicació o escriu una adreça per veure els recursos més propers.",
      geoDenegada: "No s'ha pogut obtenir la teva ubicació. Escriu una adreça a sota.",
      geoNoSoportada: "El teu dispositiu no permet la geolocalització. Escriu una adreça a sota.",
      direccionNoEncontrada: "No hem trobat aquesta adreça a Barcelona.",
      ubicacionFijada: "Ubicació: {origen}",
      verEnMapa: "Veure al mapa", llamar: "Trucar", comoLlegar: "Com arribar-hi",
      favorito: "Desar", favoritoGuardado: "Desat", detalle: "Veure detall", ocultar: "Amagar",
      direccionLabel: "Adreça", telefono: "Telèfon", horario: "Horari", acceso: "Accés",
      condiciones: "Condicions", metro: "Metro", bus: "Bus", entidad: "Entitat",
      accesoTipo: { directo: "Accés directe", derivacion: "Per derivació", cita: "Amb cita prèvia" },
      distancia: "a {d}", metros: "m", kilometros: "km",
      emergencias: "Emergències", privacidad: "La teva ubicació només s'usa en aquest dispositiu. L'adreça escrita s'envia al servei de mapes (OpenStreetMap) per localitzar-la.",
      mapaAtribucion: "© OpenStreetMap",
      saltar: "Ves al contingut", cerrar: "Tancar", buscarServicio: "Cerca per nom",
      soloFavoritos: "Només favorits", sinFavoritos: "Encara no tens favorits desats.",
      categorias: { comer: "On menjar", dormir: "On dormir", higiene: "On rentar-se", salud: "On curar-se", acogida: "Acollida i orientació" }
    },
    eu: {
      app: "KIZUNA", subtitulo: "DXC Changers Social",
      idioma: "Hizkuntza", ubicacion: "Nire kokapena erabili", ubicando: "Zure kokapena bilatzen…",
      direccion: "Helbidea", direccionPlaceholder: "Idatzi Bartzelonako helbide bat",
      buscar: "Bilatu", buscando: "Helbidea bilatzen…",
      radio: "Erradioa", km: "km", todas: "Guztiak",
      cercanos: "Inguruko baliabideak", resultados: "{n} baliabide aurkitu dira",
      sinResultados: "Erradio honetan ez dago baliabiderik. Saiatu distantzia handitzen.",
      sinUbicacion: "Aktibatu zure kokapena edo idatzi helbide bat hurbilen dauden baliabideak ikusteko.",
      geoDenegada: "Ezin izan da zure kokapena lortu. Idatzi helbide bat behean.",
      geoNoSoportada: "Zure gailuak ez du kokapena onartzen. Idatzi helbide bat behean.",
      direccionNoEncontrada: "Ez da helbide hori aurkitu Bartzelonan.",
      ubicacionFijada: "Kokapena: {origen}",
      verEnMapa: "Mapan ikusi", llamar: "Deitu", comoLlegar: "Nola iritsi",
      favorito: "Gorde", favoritoGuardado: "Gordeta", detalle: "Xehetasunak", ocultar: "Ezkutatu",
      direccionLabel: "Helbidea", telefono: "Telefonoa", horario: "Ordutegia", acceso: "Sarbidea",
      condiciones: "Baldintzak", metro: "Metroa", bus: "Autobusa", entidad: "Erakundea",
      accesoTipo: { directo: "Zuzeneko sarbidea", derivacion: "Derivazioz", cita: "Hitzordua eskatuta" },
      distancia: "{d}-(e)ra", metros: "m", kilometros: "km",
      emergencias: "Larrialdiak", privacidad: "Zure kokapena gailu honetan bakarrik erabiltzen da. Idatzitako helbidea mapa-zerbitzura (OpenStreetMap) bidaltzen da bilatzeko.",
      mapaAtribucion: "© OpenStreetMap",
      saltar: "Edukira joan", cerrar: "Itxi", buscarServicio: "Bilatu izenez",
      soloFavoritos: "Gogokoak soilik", sinFavoritos: "Oraindik ez duzu gogokorik gordeta.",
      categorias: { comer: "Non jan", dormir: "Non lo egin", higiene: "Non garbitu", salud: "Non sendatu", acogida: "Harrera eta orientazioa" }
    },
    en: {
      app: "KIZUNA", subtitulo: "DXC Changers Social",
      idioma: "Language", ubicacion: "Use my location", ubicando: "Finding your location…",
      direccion: "Address", direccionPlaceholder: "Type an address in Barcelona",
      buscar: "Search", buscando: "Searching address…",
      radio: "Radius", km: "km", todas: "All",
      cercanos: "Nearby services", resultados: "{n} services found",
      sinResultados: "No services within this radius. Try a larger distance.",
      sinUbicacion: "Turn on your location or type an address to see the nearest services.",
      geoDenegada: "We could not get your location. Type an address below.",
      geoNoSoportada: "Your device does not support geolocation. Type an address below.",
      direccionNoEncontrada: "We could not find that address in Barcelona.",
      ubicacionFijada: "Location: {origen}",
      verEnMapa: "Show on map", llamar: "Call", comoLlegar: "Directions",
      favorito: "Save", favoritoGuardado: "Saved", detalle: "View details", ocultar: "Hide",
      direccionLabel: "Address", telefono: "Phone", horario: "Opening hours", acceso: "Access",
      condiciones: "Conditions", metro: "Metro", bus: "Bus", entidad: "Organisation",
      accesoTipo: { directo: "Direct access", derivacion: "By referral", cita: "By appointment" },
      distancia: "{d} away", metros: "m", kilometros: "km",
      emergencias: "Emergencies", privacidad: "Your location is only used on this device. The typed address is sent to the map service (OpenStreetMap) to find it.",
      mapaAtribucion: "© OpenStreetMap",
      saltar: "Skip to content", cerrar: "Close", buscarServicio: "Search by name",
      soloFavoritos: "Favourites only", sinFavoritos: "You have no saved favourites yet.",
      categorias: { comer: "Where to eat", dormir: "Where to sleep", higiene: "Where to wash", salud: "Where to get health care", acogida: "Support & guidance" }
    },
    fr: {
      app: "KIZUNA", subtitulo: "DXC Changers Social",
      idioma: "Langue", ubicacion: "Utiliser ma position", ubicando: "Recherche de votre position…",
      direccion: "Adresse", direccionPlaceholder: "Saisissez une adresse à Barcelone",
      buscar: "Rechercher", buscando: "Recherche de l'adresse…",
      radio: "Rayon", km: "km", todas: "Toutes",
      cercanos: "Services à proximité", resultados: "{n} services trouvés",
      sinResultados: "Aucun service dans ce rayon. Essayez une distance plus grande.",
      sinUbicacion: "Activez votre position ou saisissez une adresse pour voir les services les plus proches.",
      geoDenegada: "Impossible d'obtenir votre position. Saisissez une adresse ci-dessous.",
      geoNoSoportada: "Votre appareil ne permet pas la géolocalisation. Saisissez une adresse ci-dessous.",
      direccionNoEncontrada: "Cette adresse est introuvable à Barcelone.",
      ubicacionFijada: "Position : {origen}",
      verEnMapa: "Voir sur la carte", llamar: "Appeler", comoLlegar: "Itinéraire",
      favorito: "Enregistrer", favoritoGuardado: "Enregistré", detalle: "Voir le détail", ocultar: "Masquer",
      direccionLabel: "Adresse", telefono: "Téléphone", horario: "Horaires", acceso: "Accès",
      condiciones: "Conditions", metro: "Métro", bus: "Bus", entidad: "Organisme",
      accesoTipo: { directo: "Accès direct", derivacion: "Sur orientation", cita: "Sur rendez-vous" },
      distancia: "à {d}", metros: "m", kilometros: "km",
      emergencias: "Urgences", privacidad: "Votre position n'est utilisée que sur cet appareil. L'adresse saisie est envoyée au service de cartes (OpenStreetMap) pour la localiser.",
      mapaAtribucion: "© OpenStreetMap",
      saltar: "Aller au contenu", cerrar: "Fermer", buscarServicio: "Rechercher par nom",
      soloFavoritos: "Favoris uniquement", sinFavoritos: "Vous n'avez encore aucun favori enregistré.",
      categorias: { comer: "Où manger", dormir: "Où dormir", higiene: "Où se laver", salud: "Où se soigner", acogida: "Accueil et orientation" }
    },
    ar: {
      app: "KIZUNA", subtitulo: "DXC Changers Social",
      idioma: "اللغة", ubicacion: "استخدام موقعي", ubicando: "جارٍ تحديد موقعك…",
      direccion: "العنوان", direccionPlaceholder: "اكتب عنوانًا في برشلونة",
      buscar: "بحث", buscando: "جارٍ البحث عن العنوان…",
      radio: "نطاق", km: "كم", todas: "الكل",
      cercanos: "الخدمات القريبة", resultados: "تم العثور على {n} خدمة",
      sinResultados: "لا توجد خدمات ضمن هذا النطاق. جرّب مسافة أكبر.",
      sinUbicacion: "فعّل موقعك أو اكتب عنوانًا لعرض أقرب الخدمات.",
      geoDenegada: "تعذّر الحصول على موقعك. اكتب عنوانًا أدناه.",
      geoNoSoportada: "جهازك لا يدعم تحديد الموقع. اكتب عنوانًا أدناه.",
      direccionNoEncontrada: "لم نتمكن من العثور على هذا العنوان في برشلونة.",
      ubicacionFijada: "الموقع: {origen}",
      verEnMapa: "عرض على الخريطة", llamar: "اتصال", comoLlegar: "الوصول إليه",
      favorito: "حفظ", favoritoGuardado: "تم الحفظ", detalle: "عرض التفاصيل", ocultar: "إخفاء",
      direccionLabel: "العنوان", telefono: "الهاتف", horario: "ساعات العمل", acceso: "طريقة الدخول",
      condiciones: "الشروط", metro: "مترو", bus: "حافلة", entidad: "الجهة",
      accesoTipo: { directo: "دخول مباشر", derivacion: "بإحالة", cita: "بموعد مسبق" },
      distancia: "على بُعد {d}", metros: "م", kilometros: "كم",
      emergencias: "الطوارئ", privacidad: "يُستخدم موقعك على هذا الجهاز فقط. يُرسل العنوان المكتوب إلى خدمة الخرائط (OpenStreetMap) لتحديده.",
      mapaAtribucion: "© OpenStreetMap",
      saltar: "الانتقال إلى المحتوى", cerrar: "إغلاق", buscarServicio: "البحث بالاسم",
      soloFavoritos: "المفضلة فقط", sinFavoritos: "لا توجد مفضلات محفوظة بعد.",
      categorias: { comer: "أين تأكل", dormir: "أين تنام", higiene: "أين تغتسل", salud: "أين تتلقى الرعاية الصحية", acogida: "الاستقبال والتوجيه" }
    }
  };

  var NOMBRES_IDIOMA = { es: "Castellano", ca: "Català", eu: "Euskara", en: "English", fr: "Français", ar: "العربية" };

  function formatear(texto, variables) {
    return String(texto).replace(/\{(\w+)\}/g, function (_, k) {
      return variables && variables[k] !== undefined ? variables[k] : "";
    });
  }

  global.KIZUNA_I18N = {
    idiomas: IDIOMAS,
    nombres: NOMBRES_IDIOMA,
    textos: TEXTOS,
    /** Devuelve el texto de la clave `key` en el idioma `lang`, con fallback a español. */
    t: function (lang, key, variables) {
      var pack = TEXTOS[lang] || TEXTOS.es;
      var valor = pack[key];
      if (valor === undefined) valor = TEXTOS.es[key];
      if (typeof valor === "string") return formatear(valor, variables);
      return valor;
    }
  };
})(window);
