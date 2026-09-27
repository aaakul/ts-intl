export interface PlaygroundPreview {
  title: string;
  role: string;
  bannerPrefix: string;
  badgeText: string;
  bannerSuffix: string;
  cart: string;
  invoice: string;
  delivery: string;
  btn: string;
}

export interface PlaygroundTemplate {
  messages: string;
  app: string;
  preview: PlaygroundPreview;
}

export const TEMPLATES: Record<string, PlaygroundTemplate> = {
  "zh-Hans": {
    messages: `export default {
  dashboard: {
    greeting: "你好，{name: string}！",
    membership: "{role, select, admin {管理员} pro {专业版会员} other {普通会员}}",
    cart: "{count, plural, =0 {购物车暂无商品} other {购物车共有 # 件商品}}",
    discount: "限时促销：<badge>全场 8 折</badge>",
    invoice: "结算总额：{amount, number, currency}",
    delivery: "预计送达：{time}",
  },
} as const;`,
    app: `import { createI18n } from "@aaakul/ts-intl";
import messages from "./messages";

const { getTranslations, getFormatter } = createI18n({
  defaultLanguage: "zh-Hans",
  formats: {
    number: {
      currency: { style: "currency", currency: "CNY" },
    },
  },
  messages: {
    "zh-Hans": messages,
  },
});

const t = getTranslations("zh-Hans", "dashboard");
const formatter = getFormatter("zh-Hans");

export default function App() {
  const count = 3;
  const deliveryDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

  return (
    <div className="demo-card">
      <div className="demo-header">
        <h3 className="demo-title">{t("greeting", { name: "开发者" })}</h3>
        <span className="demo-tag">{t("membership", { role: "pro" })}</span>
      </div>

      <div className="demo-banner">
        {t.rich("discount", {
          badge: (children) => <strong className="demo-badge">{children}</strong>,
        })}
      </div>

      <div className="demo-body">
        <div className="demo-row">
          <span className="demo-label">{t("cart", { count })}</span>
          <span className="demo-price">{t("invoice", { amount: 899.5 })}</span>
        </div>
        <div className="demo-subtext">
          {t("delivery", { time: formatter.relativeTime(deliveryDate) })}
        </div>
      </div>

      <button className="demo-btn" onClick={() => alert("正在处理结算...")}>
        立即结算
      </button>
    </div>
  );
}`,
    preview: {
      title: "你好，开发者！",
      role: "专业版会员",
      bannerPrefix: "限时促销：",
      badgeText: "全场 8 折",
      bannerSuffix: "",
      cart: "购物车共有 3 件商品",
      invoice: "结算总额：¥899.50",
      delivery: "预计送达：2天后",
      btn: "立即结算",
    },
  },
  "en-US": {
    messages: `export default {
  dashboard: {
    greeting: "Hello, {name: string}!",
    membership: "{role, select, admin {Admin} pro {Pro Member} other {Standard Member}}",
    cart: "{count, plural, =0 {Cart is empty} one {# item in cart} other {# items in cart}}",
    discount: "Flash Sale: <badge>20% OFF</badge> on all items",
    invoice: "Total: {amount, number, currency}",
    delivery: "Estimated delivery: {time}",
  },
} as const;`,
    app: `import { createI18n } from "@aaakul/ts-intl";
import messages from "./messages";

const { getTranslations, getFormatter } = createI18n({
  defaultLanguage: "en-US",
  formats: {
    number: {
      currency: { style: "currency", currency: "USD" },
    },
  },
  messages: {
    "en-US": messages,
  },
});

const t = getTranslations("en-US", "dashboard");
const formatter = getFormatter("en-US");

export default function App() {
  const count = 3;
  const deliveryDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

  return (
    <div className="demo-card">
      <div className="demo-header">
        <h3 className="demo-title">{t("greeting", { name: "Alex" })}</h3>
        <span className="demo-tag">{t("membership", { role: "pro" })}</span>
      </div>

      <div className="demo-banner">
        {t.rich("discount", {
          badge: (children) => <strong className="demo-badge">{children}</strong>,
        })}
      </div>

      <div className="demo-body">
        <div className="demo-row">
          <span className="demo-label">{t("cart", { count })}</span>
          <span className="demo-price">{t("invoice", { amount: 129.99 })}</span>
        </div>
        <div className="demo-subtext">
          {t("delivery", { time: formatter.relativeTime(deliveryDate) })}
        </div>
      </div>

      <button className="demo-btn" onClick={() => alert("Processing checkout...")}>
        Checkout Now
      </button>
    </div>
  );
}`,
    preview: {
      title: "Hello, Alex!",
      role: "Pro Member",
      bannerPrefix: "Flash Sale: ",
      badgeText: "20% OFF",
      bannerSuffix: " on all items",
      cart: "3 items in cart",
      invoice: "Total: $129.99",
      delivery: "Estimated delivery: in 2 days",
      btn: "Checkout Now",
    },
  },
  "ja-JP": {
    messages: `export default {
  dashboard: {
    greeting: "こんにちは、{name: string}様！",
    membership: "{role, select, admin {管理者} pro {Proメンバー} other {一般メンバー}}",
    cart: "{count, plural, =0 {カートは空です} other {カート内に # 件の商品}}",
    discount: "タイムセール：<badge>全品 20% OFF</badge> 実施中！",
    invoice: "お支払い合計：{amount, number, currency}",
    delivery: "お届け予定：{time}",
  },
} as const;`,
    app: `import { createI18n } from "@aaakul/ts-intl";
import messages from "./messages";

const { getTranslations, getFormatter } = createI18n({
  defaultLanguage: "ja-JP",
  formats: {
    number: {
      currency: { style: "currency", currency: "JPY" },
    },
  },
  messages: {
    "ja-JP": messages,
  },
});

const t = getTranslations("ja-JP", "dashboard");
const formatter = getFormatter("ja-JP");

export default function App() {
  const count = 3;
  const deliveryDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

  return (
    <div className="demo-card">
      <div className="demo-header">
        <h3 className="demo-title">{t("greeting", { name: "田中" })}</h3>
        <span className="demo-tag">{t("membership", { role: "pro" })}</span>
      </div>

      <div className="demo-banner">
        {t.rich("discount", {
          badge: (children) => <strong className="demo-badge">{children}</strong>,
        })}
      </div>

      <div className="demo-body">
        <div className="demo-row">
          <span className="demo-label">{t("cart", { count })}</span>
          <span className="demo-price">{t("invoice", { amount: 15800 })}</span>
        </div>
        <div className="demo-subtext">
          {t("delivery", { time: formatter.relativeTime(deliveryDate) })}
        </div>
      </div>

      <button className="demo-btn" onClick={() => alert("注文手続きへ進みます")}>
        レジに進む
      </button>
    </div>
  );
}`,
    preview: {
      title: "こんにちは、田中様！",
      role: "Proメンバー",
      bannerPrefix: "タイムセール：",
      badgeText: "全品 20% OFF",
      bannerSuffix: " 実施中！",
      cart: "カート内に 3 件の商品",
      invoice: "お支払い合計：¥15,800",
      delivery: "お届け予定：2日後",
      btn: "レジに進む",
    },
  },
  "zh-Hant": {
    messages: `export default {
  dashboard: {
    greeting: "你好，{name: string}！",
    membership: "{role, select, admin {管理員} pro {專業版會員} other {普通會員}}",
    cart: "{count, plural, =0 {購物車暫無商品} other {購物車共有 # 件商品}}",
    discount: "限時促銷：<badge>全館 8 折</badge>",
    invoice: "結算總額：{amount, number, currency}",
    delivery: "預計送達：{time}",
  },
} as const;`,
    app: `import { createI18n } from "@aaakul/ts-intl";
import messages from "./messages";

const { getTranslations, getFormatter } = createI18n({
  defaultLanguage: "zh-Hant",
  formats: {
    number: {
      currency: { style: "currency", currency: "CNY" },
    },
  },
  messages: {
    "zh-Hant": messages,
  },
});

const t = getTranslations("zh-Hant", "dashboard");
const formatter = getFormatter("zh-Hant");

export default function App() {
  const count = 3;
  const deliveryDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

  return (
    <div className="demo-card">
      <div className="demo-header">
        <h3 className="demo-title">{t("greeting", { name: "開發者" })}</h3>
        <span className="demo-tag">{t("membership", { role: "pro" })}</span>
      </div>

      <div className="demo-banner">
        {t.rich("discount", {
          badge: (children) => <strong className="demo-badge">{children}</strong>,
        })}
      </div>

      <div className="demo-body">
        <div className="demo-row">
          <span className="demo-label">{t("cart", { count })}</span>
          <span className="demo-price">{t("invoice", { amount: 899.5 })}</span>
        </div>
        <div className="demo-subtext">
          {t("delivery", { time: formatter.relativeTime(deliveryDate) })}
        </div>
      </div>

      <button className="demo-btn" onClick={() => alert("正在處理結算...")}>
        立即結算
      </button>
    </div>
  );
}`,
    preview: {
      title: "你好，開發者！",
      role: "專業版會員",
      bannerPrefix: "限時促銷：",
      badgeText: "全館 8 折",
      bannerSuffix: "",
      cart: "購物車共有 3 件商品",
      invoice: "結算總額：¥899.50",
      delivery: "預計送達：2天後",
      btn: "立即結算",
    },
  },
  "ko-KR": {
    messages: `export default {
  dashboard: {
    greeting: "안녕하세요, {name: string}님!",
    membership: "{role, select, admin {관리자} pro {프로 회원} other {일반 회원}}",
    cart: "{count, plural, =0 {장바구니가 비어 있습니다} other {장바구니 상품 #개}}",
    discount: "반짝 세일: <badge>전 품목 20% 할인</badge>",
    invoice: "결제 금액: {amount, number, currency}",
    delivery: "예상 도착: {time}",
  },
} as const;`,
    app: `import { createI18n } from "@aaakul/ts-intl";
import messages from "./messages";

const { getTranslations, getFormatter } = createI18n({
  defaultLanguage: "ko-KR",
  formats: {
    number: {
      currency: { style: "currency", currency: "KRW" },
    },
  },
  messages: {
    "ko-KR": messages,
  },
});

const t = getTranslations("ko-KR", "dashboard");
const formatter = getFormatter("ko-KR");

export default function App() {
  const count = 3;
  const deliveryDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

  return (
    <div className="demo-card">
      <div className="demo-header">
        <h3 className="demo-title">{t("greeting", { name: "개발자" })}</h3>
        <span className="demo-tag">{t("membership", { role: "pro" })}</span>
      </div>

      <div className="demo-banner">
        {t.rich("discount", {
          badge: (children) => <strong className="demo-badge">{children}</strong>,
        })}
      </div>

      <div className="demo-body">
        <div className="demo-row">
          <span className="demo-label">{t("cart", { count })}</span>
          <span className="demo-price">{t("invoice", { amount: 129000 })}</span>
        </div>
        <div className="demo-subtext">
          {t("delivery", { time: formatter.relativeTime(deliveryDate) })}
        </div>
      </div>

      <button className="demo-btn" onClick={() => alert("결제를 진행하는 중...")}>
        지금 결제하기
      </button>
    </div>
  );
}`,
    preview: {
      title: "안녕하세요, 개발자님!",
      role: "프로 회원",
      bannerPrefix: "반짝 세일: ",
      badgeText: "전 품목 20% 할인",
      bannerSuffix: "",
      cart: "장바구니 상품 3개",
      invoice: "결제 금액: ₩129,000",
      delivery: "예상 도착: 2일 후",
      btn: "지금 결제하기",
    },
  },
  "es-ES": {
    messages: `export default {
  dashboard: {
    greeting: "¡Hola, {name: string}!",
    membership: "{role, select, admin {Administrador} pro {Miembro Pro} other {Miembro Estándar}}",
    cart: "{count, plural, =0 {El carrito está vacío} one {# artículo en el carrito} other {# artículos en el carrito}}",
    discount: "Venta flash: <badge>20% de descuento</badge> en todos los artículos",
    invoice: "Total: {amount, number, currency}",
    delivery: "Entrega estimada: {time}",
  },
} as const;`,
    app: `import { createI18n } from "@aaakul/ts-intl";
import messages from "./messages";

const { getTranslations, getFormatter } = createI18n({
  defaultLanguage: "es-ES",
  formats: {
    number: {
      currency: { style: "currency", currency: "EUR" },
    },
  },
  messages: {
    "es-ES": messages,
  },
});

const t = getTranslations("es-ES", "dashboard");
const formatter = getFormatter("es-ES");

export default function App() {
  const count = 3;
  const deliveryDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

  return (
    <div className="demo-card">
      <div className="demo-header">
        <h3 className="demo-title">{t("greeting", { name: "Alex" })}</h3>
        <span className="demo-tag">{t("membership", { role: "pro" })}</span>
      </div>

      <div className="demo-banner">
        {t.rich("discount", {
          badge: (children) => <strong className="demo-badge">{children}</strong>,
        })}
      </div>

      <div className="demo-body">
        <div className="demo-row">
          <span className="demo-label">{t("cart", { count })}</span>
          <span className="demo-price">{t("invoice", { amount: 129.99 })}</span>
        </div>
        <div className="demo-subtext">
          {t("delivery", { time: formatter.relativeTime(deliveryDate) })}
        </div>
      </div>

      <button className="demo-btn" onClick={() => alert("Procesando pago...")}>
        Pagar ahora
      </button>
    </div>
  );
}`,
    preview: {
      title: "¡Hola, Alex!",
      role: "Miembro Pro",
      bannerPrefix: "Venta flash: ",
      badgeText: "20% de descuento",
      bannerSuffix: " en todos los artículos",
      cart: "3 artículos en el carrito",
      invoice: "Total: 129,99 €",
      delivery: "Entrega estimada: en 2 días",
      btn: "Pagar ahora",
    },
  },
  "de-DE": {
    messages: `export default {
  dashboard: {
    greeting: "Hallo, {name: string}!",
    membership: "{role, select, admin {Administrator} pro {Pro-Mitglied} other {Standard-Mitglied}}",
    cart: "{count, plural, =0 {Warenkorb ist leer} one {# Artikel im Warenkorb} other {# Artikel im Warenkorb}}",
    discount: "Blitzangebot: <badge>20 % Rabatt</badge> auf alle Artikel",
    invoice: "Gesamt: {amount, number, currency}",
    delivery: "Voraussichtliche Lieferung: {time}",
  },
} as const;`,
    app: `import { createI18n } from "@aaakul/ts-intl";
import messages from "./messages";

const { getTranslations, getFormatter } = createI18n({
  defaultLanguage: "de-DE",
  formats: {
    number: {
      currency: { style: "currency", currency: "EUR" },
    },
  },
  messages: {
    "de-DE": messages,
  },
});

const t = getTranslations("de-DE", "dashboard");
const formatter = getFormatter("de-DE");

export default function App() {
  const count = 3;
  const deliveryDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

  return (
    <div className="demo-card">
      <div className="demo-header">
        <h3 className="demo-title">{t("greeting", { name: "Alex" })}</h3>
        <span className="demo-tag">{t("membership", { role: "pro" })}</span>
      </div>

      <div className="demo-banner">
        {t.rich("discount", {
          badge: (children) => <strong className="demo-badge">{children}</strong>,
        })}
      </div>

      <div className="demo-body">
        <div className="demo-row">
          <span className="demo-label">{t("cart", { count })}</span>
          <span className="demo-price">{t("invoice", { amount: 129.99 })}</span>
        </div>
        <div className="demo-subtext">
          {t("delivery", { time: formatter.relativeTime(deliveryDate) })}
        </div>
      </div>

      <button className="demo-btn" onClick={() => alert("Bestellung wird verarbeitet...")}>
        Zur Kasse
      </button>
    </div>
  );
}`,
    preview: {
      title: "Hallo, Alex!",
      role: "Pro-Mitglied",
      bannerPrefix: "Blitzangebot: ",
      badgeText: "20 % Rabatt",
      bannerSuffix: " auf alle Artikel",
      cart: "3 Artikel im Warenkorb",
      invoice: "Gesamt: 129,99 €",
      delivery: "Voraussichtliche Lieferung: in 2 Tagen",
      btn: "Zur Kasse",
    },
  },
  "fr-FR": {
    messages: `export default {
  dashboard: {
    greeting: "Bonjour, {name: string} !",
    membership: "{role, select, admin {Administrateur} pro {Membre Pro} other {Membre Standard}}",
    cart: "{count, plural, =0 {Le panier est vide} one {# article dans le panier} other {# articles dans le panier}}",
    discount: "Vente flash : <badge>-20 %</badge> sur tous les articles",
    invoice: "Total : {amount, number, currency}",
    delivery: "Livraison estimée : {time}",
  },
} as const;`,
    app: `import { createI18n } from "@aaakul/ts-intl";
import messages from "./messages";

const { getTranslations, getFormatter } = createI18n({
  defaultLanguage: "fr-FR",
  formats: {
    number: {
      currency: { style: "currency", currency: "EUR" },
    },
  },
  messages: {
    "fr-FR": messages,
  },
});

const t = getTranslations("fr-FR", "dashboard");
const formatter = getFormatter("fr-FR");

export default function App() {
  const count = 3;
  const deliveryDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

  return (
    <div className="demo-card">
      <div className="demo-header">
        <h3 className="demo-title">{t("greeting", { name: "Alex" })}</h3>
        <span className="demo-tag">{t("membership", { role: "pro" })}</span>
      </div>

      <div className="demo-banner">
        {t.rich("discount", {
          badge: (children) => <strong className="demo-badge">{children}</strong>,
        })}
      </div>

      <div className="demo-body">
        <div className="demo-row">
          <span className="demo-label">{t("cart", { count })}</span>
          <span className="demo-price">{t("invoice", { amount: 129.99 })}</span>
        </div>
        <div className="demo-subtext">
          {t("delivery", { time: formatter.relativeTime(deliveryDate) })}
        </div>
      </div>

      <button className="demo-btn" onClick={() => alert("Traitement du paiement...")}>
        Passer la commande
      </button>
    </div>
  );
}`,
    preview: {
      title: "Bonjour, Alex !",
      role: "Membre Pro",
      bannerPrefix: "Vente flash : ",
      badgeText: "-20 %",
      bannerSuffix: " sur tous les articles",
      cart: "3 articles dans le panier",
      invoice: "Total : 129,99 €",
      delivery: "Livraison estimée : dans 2 jours",
      btn: "Passer la commande",
    },
  },
  "ru-RU": {
    messages: `export default {
  dashboard: {
    greeting: "Привет, {name: string}!",
    membership: "{role, select, admin {Администратор} pro {Pro-аккаунт} other {Обычный аккаунт}}",
    cart: "{count, plural, =0 {Корзина пуста} one {В корзине # товар} few {В корзине # товара} many {В корзине # товаров} other {В корзине # товара}}",
    discount: "Распродажа: <badge>Скидка 20%</badge> на всё",
    invoice: "Итого: {amount, number, currency}",
    delivery: "Ориентировочная доставка: {time}",
  },
} as const;`,
    app: `import { createI18n } from "@aaakul/ts-intl";
import messages from "./messages";

const { getTranslations, getFormatter } = createI18n({
  defaultLanguage: "ru-RU",
  formats: {
    number: {
      currency: { style: "currency", currency: "RUB" },
    },
  },
  messages: {
    "ru-RU": messages,
  },
});

const t = getTranslations("ru-RU", "dashboard");
const formatter = getFormatter("ru-RU");

export default function App() {
  const count = 3;
  const deliveryDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

  return (
    <div className="demo-card">
      <div className="demo-header">
        <h3 className="demo-title">{t("greeting", { name: "Алексей" })}</h3>
        <span className="demo-tag">{t("membership", { role: "pro" })}</span>
      </div>

      <div className="demo-banner">
        {t.rich("discount", {
          badge: (children) => <strong className="demo-badge">{children}</strong>,
        })}
      </div>

      <div className="demo-body">
        <div className="demo-row">
          <span className="demo-label">{t("cart", { count })}</span>
          <span className="demo-price">{t("invoice", { amount: 12990 })}</span>
        </div>
        <div className="demo-subtext">
          {t("delivery", { time: formatter.relativeTime(deliveryDate) })}
        </div>
      </div>

      <button className="demo-btn" onClick={() => alert("Оформление заказа...")}>
        Оформить заказ
      </button>
    </div>
  );
}`,
    preview: {
      title: "Привет, Алексей!",
      role: "Pro-аккаунт",
      bannerPrefix: "Распродажа: ",
      badgeText: "Скидка 20%",
      bannerSuffix: " на всё",
      cart: "В корзине 3 товара",
      invoice: "Итого: 12 990 ₽",
      delivery: "Ориентировочная доставка: через 2 дня",
      btn: "Оформить заказ",
    },
  },
  "it-IT": {
    messages: `export default {
  dashboard: {
    greeting: "Ciao, {name: string}!",
    membership: "{role, select, admin {Amministratore} pro {Membro Pro} other {Membro Standard}}",
    cart: "{count, plural, =0 {Il carrello è vuoto} one {# articolo nel carrello} other {# articoli nel carrello}}",
    discount: "Offerta lampo: <badge>20% di sconto</badge> su tutti gli articoli",
    invoice: "Totale: {amount, number, currency}",
    delivery: "Consegna stimata: {time}",
  },
} as const;`,
    app: `import { createI18n } from "@aaakul/ts-intl";
import messages from "./messages";

const { getTranslations, getFormatter } = createI18n({
  defaultLanguage: "it-IT",
  formats: {
    number: {
      currency: { style: "currency", currency: "EUR" },
    },
  },
  messages: {
    "it-IT": messages,
  },
});

const t = getTranslations("it-IT", "dashboard");
const formatter = getFormatter("it-IT");

export default function App() {
  const count = 3;
  const deliveryDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

  return (
    <div className="demo-card">
      <div className="demo-header">
        <h3 className="demo-title">{t("greeting", { name: "Alex" })}</h3>
        <span className="demo-tag">{t("membership", { role: "pro" })}</span>
      </div>

      <div className="demo-banner">
        {t.rich("discount", {
          badge: (children) => <strong className="demo-badge">{children}</strong>,
        })}
      </div>

      <div className="demo-body">
        <div className="demo-row">
          <span className="demo-label">{t("cart", { count })}</span>
          <span className="demo-price">{t("invoice", { amount: 129.99 })}</span>
        </div>
        <div className="demo-subtext">
          {t("delivery", { time: formatter.relativeTime(deliveryDate) })}
        </div>
      </div>

      <button className="demo-btn" onClick={() => alert("Elaborazione del pagamento...")}>
        Vai al pagamento
      </button>
    </div>
  );
}`,
    preview: {
      title: "Ciao, Alex!",
      role: "Membro Pro",
      bannerPrefix: "Offerta lampo: ",
      badgeText: "20% di sconto",
      bannerSuffix: " su tutti gli articoli",
      cart: "3 articoli nel carrello",
      invoice: "Totale: 129,99 €",
      delivery: "Consegna stimata: tra 2 giorni",
      btn: "Vai al pagamento",
    },
  },
};
