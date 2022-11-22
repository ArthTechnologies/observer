import { d as derived, w as writable } from './index-4b33a228.js';

const translations = {
  "en-US": {
    "homepage.title": "Your Servers",
    "navbar.webname": "Your Servers",
    "site.webtitle": "Your Servers",
    "software.paper": "Paper",
    "version.latest": "Latest",
    "button.terminal": "Terminal",
    "button.start": "Start",
    "button.stop": "Stop",
    "button.restart": "Restart",
    "navbar.servers": "Servers",
    "navbar.settings": "Settings",
    "settings.title": "Webpanel Settings",
    "settings.desc": "Here you can find all the settings that affect this panel, such as site URL, and trusted domains.",
    "settings.h.general": "General Settings",
    "settings.l.webport": "Webpanel Port",
    "settings.l.webtitle": "Browser Title",
    "settings.l.webname": "Webpanel Name",
    "settings.h.trusted": "Trusted Domains",
    "settings.l.pay": "Payment & Billing Features",
    "settings.desc.trusted": "To protect your machine from users uploading malware posing as plugins/mods, you can limit URLs to download from sites such as modrinth. Please seperate domains with commas!",
    "button.save": "Save",
    "site.footer": ", licensed under ",
    "settings.t.webport": "This is the port that this panel will run on (3000 by default). If you're not using a reverse proxy, you will see :port after the hostname in the URL.",
    "bill.title": "Billing",
    "bill.balance": "Your Balance",
    "bill.chargein": " charge in ",
    "bill.days": " days",
    "button.methods": "Payment Methods",
    "button.payBill": "Pay Bill",
    "newserver.title": "New Server",
    "newserver.l.choose": "Choose Software",
    "newserver.l.name": "Server Name",
    "newserver.l.version": "Minecraft Version",
    "button.createServer": "Create Server",
    "account.profile": "Profile",
    "account.settings": "Account Settings",
    "account.logout": "Logout",
    "general.ex": "ex:",
    "signin.title": "Welcome!",
    "signin.h": "Sign in to access servers.",
    "signin.discord": "Discord (Coming Soon)",
    "signin.metamask": "MetaMask (Coming Soon)",
    "signin.h.email": "Sign in via Email:",
    "signin": "Signin",
    "signup": "Signup",
    "signin.l.email": "Email Address",
    "signin.l.pwd": "Password",
    "signin.l.cpwd": "Confirm Password",
    "button.submit": "Submit"
  },
  "es-ES": {
    "homepage.title": "Sus servidores",
    "navbar.webname": "Sus servidores",
    "site.webtitle": "Sus servidores",
    "software.paper": "Papel",
    "version.latest": "\xDAltimo",
    "button.terminal": "Terminal",
    "button.start": "Empezar",
    "button.stop": "Parar",
    "button.restart": "Reinciar",
    "navbar.servers": "Servidores",
    "navbar.settings": "Configuraci\xF3n",
    "settings.title": "Configuraci\xF3n del panel",
    "settings.desc": "Aqu\xED puede encontrar todas las configuraciones que afectan a este sitio, como la URL del sitio y los dominios de confianza.",
    "settings.h.general": "Configuraci\xF3n general",
    "settings.l.webport": "Puerto Web",
    "settings.l.webtitle": "T\xEDtulo del navegador",
    "settings.l.webname": "Nombre del panel",
    "settings.h.trusted": "Dominios de confianza",
    "settings.l.pay": "Functiones de pago y facturaci\xF3n",
    "settings.desc.trusted": "Para proteger su m\xE1quina de los usuarios que cargan malware que se hacen pasar por complementos / mods, puede limitar las URL para descargar desde sitios como modrinth. \xA1Por favor, separe los dominios con comas!",
    "button.save": "Salvar",
    "site.footer": ", licenciado bajo ",
    "settings.t.webport": "Este es el puerto en el que se ejecutar\xE1 este panel (3000 de forma predeterminada). Si no est\xE1 utilizando un proxy inverso, ver\xE1 :[puerto] despu\xE9s del nombre de host en la URL.",
    "bill.title": "Facturaci\xF3n",
    "bill.balance": "Su saldo",
    "bill.chargein": " cargar en ",
    "bill.days": " d\xEDas",
    "button.methods": "M\xE9todos de pago",
    "button.payBill": "Pagar factura",
    "newserver.title": "Nuevo servidor",
    "newserver.l.choose": "Elija el software",
    "newserver.l.name": "Nombre del servidor",
    "newserver.l.version": "Versi\xF3n Minecraft",
    "button.createServer": "Crear servidor",
    "account.profile": "Perfil",
    "account.settings": "Opciones de cuenta",
    "account.logout": "Cerrar sesi\xF3n",
    "general.ex": "ex:",
    "signin.title": "\xA1Bienvenido!",
    "signin.h": "Inicia sesi\xF3n para acceder a tus servidores.",
    "signin.discord": "Discord (Coming Soon)",
    "signin.metamask": "MetaMask (Coming Soon)",
    "signin.h.email": "Iniciar sesi\xF3n con Email:",
    "signin": "Iniciar sesi\xF3n",
    "signup": "Registrarse",
    "signin.l.email": "Direccion de Email",
    "signin.l.pwd": "Clave",
    "signin.l.cpwd": "Confirmar contrase\xF1a",
    "button.submit": "Enviar"
  }
};
const locale = writable("en-US");
function translate(locale2, key, vars) {
  if (!key)
    throw new Error("no key provided to $t()");
  if (!locale2)
    throw new Error(`no translation for key "${key}"`);
  let text = translations[locale2][key];
  if (!text)
    throw new Error(`no translation found for ${locale2}.${key}`);
  Object.keys(vars).map((k) => {
    const regex = new RegExp(`{{${k}}}`, "g");
    text = text.replace(regex, vars[k]);
  });
  return text;
}
const t = derived(
  locale,
  ($locale) => (key, vars = {}) => translate($locale, key, vars)
);

export { locale as l, t };
//# sourceMappingURL=i18n-5de95841.js.map
