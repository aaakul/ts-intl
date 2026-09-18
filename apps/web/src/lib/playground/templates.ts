export interface PlaygroundTemplate {
  messages: string;
  app: string;
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
  },
};
