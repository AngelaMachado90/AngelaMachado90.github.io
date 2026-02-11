/*
 * KODASSAURO-CHAT.JS
 * Chatbot local (sem IA) para KoddaHub.
 * - Fluxos: orcamento, duvidas (FAQ), contato, precos, portfolio
 * - Persistencia local (historico + estado + leads)
 * - Acessibilidade (dialog, foco, aria-live)
 */

(() => {
  "use strict";

  const IS_DEMO_PAGE = /\/pages\//.test(window.location.pathname);
  const DEMO_PREFIX = IS_DEMO_PAGE ? "" : "pages/";
  const INDEX_PREFIX = IS_DEMO_PAGE ? "../" : "";

  const KODASSAURO_CONFIG = {
    copy: {
      brandName: "KoddaHub",
      assistantName: "Kodassauro",
    },
    business: {
      hours: "Seg a Sex, 09:00 as 18:00",
      location: "Sao Paulo - SP (atendimento nacional)",
    },
    channels: {
      whatsapp: "https://wa.me/554192272854?text=",
      email:
        "mailto:angelamachado02022@gmail.com?subject=Contato%20KoddaHub&body=",
      telefone: "tel:+554192272854",
    },
    notifications: {
      enabled: true,
      intervalMs: 120000,
      maxBadge: 9,
    },
    faq: [
      {
        keywords: ["preco", "valor", "investimento", "custa", "orcamento"],
        answer:
          "Trabalhamos com valores a partir de **R$ 2.500** para site institucional e **R$ 4.800** para e-commerce. Para sistemas empresariais, fazemos sob medida. Quer que eu monte um orcamento rapido?",
        cta: { label: "Pedir orcamento", action: "orcamento" },
      },
      {
        keywords: ["prazo", "tempo", "entrega", "quando fica pronto"],
        answer:
          "Prazos variam por escopo, mas normalmente um site institucional sai em **7 a 15 dias** e e-commerce em **15 a 30 dias**. Quer me dizer o tipo de solucao e o seu prazo ideal?",
        cta: { label: "Orcamento", action: "orcamento" },
      },
      {
        keywords: ["seo", "google", "rank", "busca"],
        answer:
          "Aplicamos SEO tecnico (estrutura, performance, semantica) e boas praticas de conteudo. Tambem configuramos metadados e analytics se voce quiser.",
        cta: { label: "Falar com vendedor", action: "contato" },
      },
      {
        keywords: ["suporte", "manutencao", "atualizacao"],
        answer:
          "Oferecemos suporte e manutencao com rotinas de atualizacao, ajustes e acompanhamento. Posso te conectar com o time para definir um plano.",
        cta: { label: "Contato", action: "contato" },
      },
    ],
    demoLinks: [
      {
        label: "Demo Institucional",
        href: `${DEMO_PREFIX}demo-institucional.html`,
      },
      { label: "Demo E-commerce", href: `${DEMO_PREFIX}demo-ecommerce.html` },
      { label: "Demo Industrial", href: `${DEMO_PREFIX}demo-industrial.html` },
      { label: "Demo Servicos", href: `${DEMO_PREFIX}demo-servicos.html` },
      { label: "Demo Sistemas", href: `${DEMO_PREFIX}demo-sistemas.html` },
    ],
  };

  const STORAGE = {
    state: "kodassauro.chat.state.v2",
    leads: "kodassauro.chat.leads.v1",
  };

  function $(sel, root = document) {
    return root.querySelector(sel);
  }

  function $all(sel, root = document) {
    return Array.from(root.querySelectorAll(sel));
  }

  function nowTs() {
    return Date.now();
  }

  function fmtTime(ts) {
    const d = new Date(ts);
    return d.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function safeJsonParse(str, fallback) {
    try {
      return JSON.parse(str);
    } catch {
      return fallback;
    }
  }

  function save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  }

  function load(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return safeJsonParse(raw, fallback);
    } catch {
      return fallback;
    }
  }

  function openUrl(url) {
    const w = window.open(url, "_blank", "noopener,noreferrer");
    if (!w) window.location.href = url;
  }

  function scrollToId(id) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    // Demos nao possuem as secoes do index; redireciona para o index.
    if (IS_DEMO_PAGE) {
      window.location.href = `${INDEX_PREFIX}index.html#${encodeURIComponent(id)}`;
    }
  }

  function clampBadge(n, max) {
    if (n <= 0) return 0;
    return Math.min(n, max);
  }

  function makeTextFragment(text) {
    // Safe formatting: supports **bold** and newlines.
    const frag = document.createDocumentFragment();
    const lines = String(text).split(/\n/);

    for (let li = 0; li < lines.length; li++) {
      const line = lines[li];
      const parts = line.split("**");
      for (let i = 0; i < parts.length; i++) {
        const seg = parts[i];
        if (!seg) continue;
        if (i % 2 === 1) {
          const strong = document.createElement("strong");
          strong.textContent = seg;
          frag.appendChild(strong);
        } else {
          frag.appendChild(document.createTextNode(seg));
        }
      }
      if (li < lines.length - 1) frag.appendChild(document.createElement("br"));
    }

    return frag;
  }

  const initialState = {
    isOpen: false,
    mode: "start",
    step: "idle",
    messages: [],
    leadDraft: {
      solution: "",
      deadline: "",
      budget: "",
      name: "",
      channel: "",
    },
    notifCount: 0,
    lastNotifiedAt: 0,
  };

  function cloneInitialState() {
    // Avoid accidental shared references.
    if (typeof structuredClone === "function")
      return structuredClone(initialState);
    return JSON.parse(JSON.stringify(initialState));
  }

  function hydrateState(raw) {
    const base = cloneInitialState();
    if (!raw || typeof raw !== "object") return base;

    const merged = { ...base, ...raw };
    merged.messages = Array.isArray(raw.messages)
      ? raw.messages
      : base.messages;
    merged.leadDraft = {
      ...base.leadDraft,
      ...(raw.leadDraft && typeof raw.leadDraft === "object"
        ? raw.leadDraft
        : {}),
    };
    merged.notifCount = Number.isFinite(raw.notifCount)
      ? raw.notifCount
      : base.notifCount;
    merged.lastNotifiedAt = Number.isFinite(raw.lastNotifiedAt)
      ? raw.lastNotifiedAt
      : base.lastNotifiedAt;
    merged.isOpen = false; // never restore open on load
    return merged;
  }

  function createBotGreeting() {
    return (
      `Ola! Eu sou o **${KODASSAURO_CONFIG.copy.assistantName}**, assistente da ${KODASSAURO_CONFIG.copy.brandName}.\n` +
      `Posso te ajudar com orcamento, duvidas, precos ou te conectar com um vendedor.`
    );
  }

  function normalize(s) {
    return String(s || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
  }

  function validatePhone(phone) {
    const digits = String(phone || "").replace(/\D/g, "");
    return digits.length >= 10;
  }

  function buildWhatsAppMessage(lead) {
    const lines = [
      `Ola! Vim pelo site da ${KODASSAURO_CONFIG.copy.brandName}.`,
      `Quero um orcamento para: ${lead.solution || "-"}.`,
      `Prazo: ${lead.deadline || "-"}.`,
      `Orcamento estimado: ${lead.budget || "-"}.`,
      `Nome: ${lead.name || "-"}.`,
      `Preferencia de contato: ${lead.channel || "WhatsApp"}.`,
    ];
    return encodeURIComponent(lines.join("\n"));
  }

  function buildMailToBody(lead) {
    const lines = [
      `Ola,`,
      `Gostaria de um orcamento. Seguem detalhes:`,
      `- Solucao: ${lead.solution || "-"}`,
      `- Prazo: ${lead.deadline || "-"}`,
      `- Orcamento estimado: ${lead.budget || "-"}`,
      `- Nome: ${lead.name || "-"}`,
      `- Preferencia de contato: ${lead.channel || "-"}`,
    ];
    return encodeURIComponent(lines.join("\n"));
  }

  function appendLead(lead) {
    const leads = load(STORAGE.leads, []);
    leads.push({ ...lead, ts: nowTs() });
    save(STORAGE.leads, leads);
  }

  function init() {
    try {
      const root = document.getElementById("kodassauroRoot");
      if (!root) return;

      // Defensive: ensure the widget root is a direct child of body so
      // `position: fixed` behaves consistently (avoids issues when an
      // ancestor has transform/positioning). Move it to body if needed.
      if (root.parentElement !== document.body) {
        try {
          document.body.appendChild(root);
        } catch (e) {
          // ignore
        }
      }

      const toggleBtn = $(".kodassauro-toggle", root);
      const badge = $(".kodassauro-badge", root);
      const panel = $("#kodassauroPanel", root);
      const closeBtn = $(".kodassauro-close", root);
      const resetBtn = $(".kodassauro-reset", root);
      const messagesEl = $("#kodassauroMessages", root);
      const quickEl = $("#kodassauroQuick", root);
      const composer = $("#kodassauroComposer", root);
      const input = $("#kodassauroInput", root);

      const state = hydrateState(load(STORAGE.state, initialState));

      function persist() {
        save(STORAGE.state, state);
      }

      let uiHydrated = false;
      let notificationsArmed = false;
      let notifTimer = null;
      let pendingAttention = false;

      function setBadge(n) {
        state.notifCount = n;
        const val = clampBadge(n, KODASSAURO_CONFIG.notifications.maxBadge);
        if (val <= 0) {
          badge.hidden = true;
          badge.textContent = "0";
        } else {
          badge.hidden = false;
          badge.textContent = String(val);
        }
        persist();
      }

      function setQuickOptions(options) {
        quickEl.innerHTML = "";
        for (const opt of options) {
          const b = document.createElement("button");
          b.type = "button";
          b.className = "kodassauro-chip";
          if (opt.action) b.dataset.action = opt.action;
          if (opt.reply) b.dataset.reply = opt.reply;
          if (opt.href) b.dataset.href = opt.href;
          b.textContent = opt.label;
          quickEl.appendChild(b);
        }
      }

      function addMessage(from, text) {
        const msg = { from, text: String(text || ""), ts: nowTs() };
        state.messages.push(msg);
        renderMessage(msg);
        persist();
      }

      function renderMessage(msg) {
        const wrapper = document.createElement("div");
        wrapper.className = `kds-msg ${msg.from === "user" ? "is-user" : "is-bot"}`;

        const bubble = document.createElement("div");
        bubble.className = "kds-bubble";

        const content = document.createElement("div");
        content.appendChild(makeTextFragment(msg.text));

        const time = document.createElement("span");
        time.className = "kds-time";
        time.textContent = fmtTime(msg.ts);

        bubble.appendChild(content);
        bubble.appendChild(time);

        wrapper.appendChild(bubble);
        messagesEl.appendChild(wrapper);
        messagesEl.scrollTop = messagesEl.scrollHeight;
      }

      function renderAll() {
        messagesEl.innerHTML = "";
        for (const msg of state.messages) renderMessage(msg);
      }

      function hydrateUiIfNeeded() {
        if (uiHydrated) return;
        uiHydrated = true;
        renderAll();
        setDefaultQuick();
      }

      function openPanel() {
        state.isOpen = true;
        panel.hidden = false;
        panel.setAttribute("aria-hidden", "false");
        panel.classList.add("is-open");
        toggleBtn.setAttribute("aria-expanded", "true");
        setBadge(0);
        persist();

        hydrateUiIfNeeded();
        // If attention message was queued while panel was closed, show it now.
        if (pendingAttention) {
          addMessage("bot", "Como posso ajudar?");
          pendingAttention = false;
        }

        if (state.messages.length === 0) {
          addMessage("bot", createBotGreeting());
        }

        setTimeout(() => {
          panel.focus();
          input.focus();
        }, 10);
      }

      function closePanel() {
        state.isOpen = false;
        panel.classList.remove("is-open");
        panel.setAttribute("aria-hidden", "true");
        toggleBtn.setAttribute("aria-expanded", "false");
        persist();

        if (!notificationsArmed && KODASSAURO_CONFIG.notifications.enabled) {
          notificationsArmed = true;
          notifTimer = setInterval(() => {
            if (state.isOpen) return;
            const next = (state.notifCount || 0) + 1;
            setBadge(next);
          }, KODASSAURO_CONFIG.notifications.intervalMs);
        }

        // keep hidden after transition
        setTimeout(() => {
          if (!state.isOpen) panel.hidden = true;
        }, 250);

        toggleBtn.focus();
      }

      function resetChat() {
        state.mode = "start";
        state.step = "idle";
        state.messages = [];
        state.leadDraft = {
          solution: "",
          deadline: "",
          budget: "",
          name: "",
          channel: "",
        };
        setBadge(0);
        uiHydrated = false;
        messagesEl.innerHTML = "";
        quickEl.innerHTML = "";
        persist();
      }

      function setDefaultQuick() {
        setQuickOptions([
          { label: "Orcamento", action: "orcamento" },
          { label: "Duvidas", action: "duvidas" },
          { label: "Falar com vendedor", action: "contato" },
          { label: "Ver precos", action: "precos" },
          { label: "Ver portfolio", action: "portfolio" },
          { label: "Abrir WhatsApp", action: "open_whatsapp_short" },
        ]);
      }

      function startOrcamentoFlow() {
        state.mode = "orcamento";
        state.step = "solution";
        state.leadDraft = {
          solution: "",
          deadline: "",
          budget: "",
          name: "",
          channel: "",
        };
        addMessage(
          "bot",
          "Perfeito. Para qual tipo de solucao voce quer orcamento?",
        );
        setQuickOptions([
          { label: "Site institucional", reply: "Site Institucional" },
          { label: "E-commerce", reply: "E-commerce" },
          { label: "Site industrial", reply: "Site Industrial" },
          { label: "Site de servicos", reply: "Site de Servicos" },
          { label: "Sistema empresarial", reply: "Sistema Empresarial" },
          { label: "Voltar", action: "start" },
        ]);
        persist();
      }

      function startDuvidasFlow() {
        state.mode = "duvidas";
        state.step = "idle";
        addMessage(
          "bot",
          "Manda sua duvida por aqui. Se preferir, escreva uma palavra-chave como **preco**, **prazo**, **seo** ou **suporte**.",
        );
        setQuickOptions([
          { label: "Preco", reply: "preco" },
          { label: "Prazo", reply: "prazo" },
          { label: "SEO", reply: "seo" },
          { label: "Suporte", reply: "suporte" },
          { label: "Voltar", action: "start" },
        ]);
        persist();
      }

      function startContatoFlow() {
        state.mode = "contato";
        state.step = "channel";
        addMessage("bot", "Certo. Como voce prefere falar com a gente?");
        setQuickOptions([
          { label: "WhatsApp", reply: "WhatsApp" },
          { label: "E-mail", reply: "Email" },
          { label: "Ligacao", reply: "Telefone" },
          { label: "Voltar", action: "start" },
        ]);
        persist();
      }

      function startPrecosFlow() {
        state.mode = "precos";
        state.step = "idle";
        addMessage(
          "bot",
          "Aqui vai um resumo rapido:\n" +
            "- Site institucional: **a partir de R$ 2.500**\n" +
            "- E-commerce: **a partir de R$ 4.800**\n" +
            "- Site industrial/servicos: varia pelo escopo\n" +
            "- Sistemas empresariais: sob medida\n\nQuer ver as solucoes no site ou pedir um orcamento agora?",
        );
        setQuickOptions([
          { label: "Ver solucoes", action: "scroll_solucoes" },
          { label: "Pedir orcamento", action: "orcamento" },
          { label: "Voltar", action: "start" },
        ]);
        persist();
      }

      function startPortfolioFlow() {
        state.mode = "portfolio";
        state.step = "idle";
        addMessage("bot", "Beleza. Quer abrir alguma demo agora?");
        const opts = KODASSAURO_CONFIG.demoLinks.map((d) => ({
          label: d.label,
          href: d.href,
        }));
        opts.push({ label: "Voltar", action: "start" });
        setQuickOptions(opts);
        persist();
      }

      function handleTopAction(action) {
        switch (action) {
          case "start":
            state.mode = "start";
            state.step = "idle";
            addMessage("bot", "Certo. Em que posso ajudar agora?");
            setDefaultQuick();
            break;
          case "orcamento":
            startOrcamentoFlow();
            break;
          case "duvidas":
            startDuvidasFlow();
            break;
          case "contato":
            startContatoFlow();
            break;
          case "precos":
            startPrecosFlow();
            break;
          case "portfolio":
            startPortfolioFlow();
            break;
          case "scroll_solucoes":
            addMessage(
              "bot",
              "Ok. Vou te levar para a secao de solucoes. Se quiser, eu continuo por aqui.",
            );
            closePanel();
            setTimeout(() => scrollToId("solucoes"), 100);
            break;
          case "open_whatsapp_short":
            addMessage("bot", "Perfeito. Vou abrir o WhatsApp agora.");
            openUrl(
              KODASSAURO_CONFIG.channels.whatsapp +
                encodeURIComponent(
                  "Ola! Vim pelo site da KoddaHub e quero falar com um vendedor.",
                ),
            );
            break;
          default:
            break;
        }
        persist();
      }

      function answerFromFaq(userText) {
        const t = normalize(userText);
        for (const item of KODASSAURO_CONFIG.faq) {
          if (item.keywords.some((k) => t.includes(normalize(k)))) {
            addMessage("bot", item.answer);
            if (item.cta) {
              setQuickOptions([
                { label: item.cta.label, action: item.cta.action },
                { label: "Falar com vendedor", action: "contato" },
                { label: "Voltar", action: "start" },
              ]);
            }
            return true;
          }
        }
        return false;
      }

      function handleOrcamentoInput(text) {
        const t = String(text || "").trim();
        if (!t) return;

        if (state.step === "solution") {
          state.leadDraft.solution = t;
          state.step = "deadline";
          addMessage(
            "bot",
            'Qual seu prazo ideal? Ex: "15 dias", "ate o fim do mes".',
          );
          setQuickOptions([
            { label: "7 a 15 dias", reply: "7 a 15 dias" },
            { label: "15 a 30 dias", reply: "15 a 30 dias" },
            { label: "Sem pressa", reply: "Sem pressa" },
            { label: "Voltar", action: "start" },
          ]);
          return;
        }

        if (state.step === "deadline") {
          state.leadDraft.deadline = t;
          state.step = "budget";
          addMessage(
            "bot",
            "Você tem um orcamento estimado? (Pode ser uma faixa)",
          );
          setQuickOptions([
            { label: "Ate R$ 3k", reply: "Ate R$ 3.000" },
            { label: "R$ 3k a 6k", reply: "R$ 3.000 a 6.000" },
            { label: "Acima de R$ 6k", reply: "Acima de R$ 6.000" },
            { label: "Prefiro conversar", reply: "Prefiro conversar" },
            { label: "Voltar", action: "start" },
          ]);
          return;
        }

        if (state.step === "budget") {
          state.leadDraft.budget = t;
          state.step = "name";
          addMessage("bot", "Perfeito. Qual seu nome?");
          setQuickOptions([{ label: "Voltar", action: "start" }]);
          return;
        }

        if (state.step === "name") {
          state.leadDraft.name = t;
          state.step = "channel";
          addMessage("bot", "Qual canal voce prefere para retorno?");
          setQuickOptions([
            { label: "WhatsApp", reply: "WhatsApp" },
            { label: "E-mail", reply: "Email" },
            { label: "Ligacao", reply: "Telefone" },
            { label: "Voltar", action: "start" },
          ]);
          return;
        }

        if (state.step === "channel") {
          state.leadDraft.channel = t;
          state.step = "confirm";

          const summary =
            "Fechou. Resumo do seu pedido:\n" +
            `- Solucao: **${state.leadDraft.solution || "-"}**\n` +
            `- Prazo: **${state.leadDraft.deadline || "-"}**\n` +
            `- Orcamento: **${state.leadDraft.budget || "-"}**\n` +
            `- Nome: **${state.leadDraft.name || "-"}**\n` +
            `- Canal: **${state.leadDraft.channel || "-"}**\n\n` +
            "Posso abrir o WhatsApp com essa mensagem pronta?";

          addMessage("bot", summary);
          setQuickOptions([
            { label: "Sim, abrir WhatsApp", action: "open_whatsapp_orcamento" },
            { label: "Enviar por e-mail", action: "open_email_orcamento" },
            { label: "Nao agora", action: "start" },
          ]);

          appendLead(state.leadDraft);
          return;
        }
      }

      function handleContatoInput(text) {
        const t = normalize(text);
        if (state.step === "channel") {
          const shortMsg =
            "Ola! Vim pelo site da KoddaHub e quero falar com um vendedor.";
          if (t.includes("whatsapp")) {
            addMessage("bot", "Perfeito. Vou abrir o WhatsApp agora.");
            openUrl(
              KODASSAURO_CONFIG.channels.whatsapp +
                encodeURIComponent(shortMsg),
            );
            return;
          }
          if (t.includes("email") || t.includes("e-mail")) {
            addMessage("bot", "Certo. Vou abrir um e-mail pronto.");
            openUrl(
              KODASSAURO_CONFIG.channels.email + encodeURIComponent(shortMsg),
            );
            return;
          }
          if (
            t.includes("telefone") ||
            t.includes("lig") ||
            t.includes("call")
          ) {
            addMessage("bot", "Ok. Vou iniciar a ligacao.");
            window.location.href = KODASSAURO_CONFIG.channels.telefone;
            return;
          }

          addMessage(
            "bot",
            "Sem problema. Escolha um canal: WhatsApp, E-mail ou Ligacao.",
          );
        }
      }

      function handleUserText(text) {
        const raw = String(text || "").trim();
        if (!raw) return;

        if (state.mode === "orcamento") {
          handleOrcamentoInput(raw);
          return;
        }

        if (state.mode === "contato") {
          handleContatoInput(raw);
          return;
        }

        // duvidas or default
        if (answerFromFaq(raw)) return;

        const t = normalize(raw);
        if (t.includes("orcamento") || t.includes("orçamento")) {
          startOrcamentoFlow();
          return;
        }
        if (t.includes("preco") || t.includes("preço") || t.includes("valor")) {
          startPrecosFlow();
          return;
        }
        if (
          t.includes("contato") ||
          t.includes("vendedor") ||
          t.includes("whatsapp")
        ) {
          startContatoFlow();
          return;
        }
        if (
          t.includes("demo") ||
          t.includes("portfolio") ||
          t.includes("portifolio")
        ) {
          startPortfolioFlow();
          return;
        }

        addMessage(
          "bot",
          "Entendi. Se quiser, me diga **preco**, **prazo**, **seo** ou **suporte**. Ou eu posso te conectar com um vendedor.",
        );
        setQuickOptions([
          { label: "Falar com vendedor", action: "contato" },
          { label: "Pedir orcamento", action: "orcamento" },
          { label: "Voltar", action: "start" },
        ]);
      }

      // Event wiring
      // Force closed state on load (prevents "auto-open" / FOUC in some setups).
      state.isOpen = false;
      panel.hidden = true;
      panel.classList.remove("is-open");
      panel.setAttribute("aria-hidden", "true");
      toggleBtn.setAttribute("aria-expanded", "false");

      toggleBtn.addEventListener("click", () => {
        if (state.isOpen) closePanel();
        else openPanel();
      });

      closeBtn.addEventListener("click", closePanel);

      resetBtn.addEventListener("click", () => {
        resetChat();
        openPanel();
        addMessage("bot", "Conversa limpa. Como posso te ajudar agora?");
      });

      composer.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = input.value;
        input.value = "";
        if (!String(text || "").trim()) return;
        addMessage("user", text);
        handleUserText(text);
      });

      quickEl.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;

        const action = btn.dataset.action;
        const reply = btn.dataset.reply;
        const href = btn.dataset.href;

        if (href) {
          addMessage("user", btn.textContent);
          openUrl(href);
          return;
        }

        if (action) {
          addMessage("user", btn.textContent);
          if (action === "open_whatsapp_orcamento") {
            const msg = buildWhatsAppMessage(state.leadDraft);
            openUrl(KODASSAURO_CONFIG.channels.whatsapp + msg);
            addMessage(
              "bot",
              "Pronto. Se preferir, posso continuar por aqui tambem.",
            );
            setDefaultQuick();
            return;
          }
          if (action === "open_email_orcamento") {
            const body = buildMailToBody(state.leadDraft);
            openUrl(KODASSAURO_CONFIG.channels.email + body);
            addMessage("bot", "E-mail pronto. Quer mais alguma coisa?");
            setDefaultQuick();
            return;
          }
          handleTopAction(action);
          return;
        }

        if (reply) {
          addMessage("user", reply);
          handleUserText(reply);
        }
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && state.isOpen) closePanel();
      });

      document.addEventListener("click", (e) => {
        if (!state.isOpen) return;
        if (root.contains(e.target)) return;
        if (window.innerWidth <= 768) closePanel();
      });

      // Init render
      // Keep closed and silent until opened.
      setBadge(0);

      // ============================================
      // ASSISTANT ATTENTION - APENAS COM BEEP
      // ============================================
      (function assistantAttention() {
        try {
          const key = "kodassauro.attentionShown";
          if (sessionStorage.getItem(key)) return;

          // Visual pulse no botão
          toggleBtn.classList.add("kodassauro-bark");
          setTimeout(() => toggleBtn.classList.remove("kodassauro-bark"), 900);

          // BEEP suave (sem voz)
          try {
            const ctx = new (
              window.AudioContext || window.webkitAudioContext
            )();
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.type = "sine";
            o.frequency.value = 880;
            o.connect(g);
            g.connect(ctx.destination);
            g.gain.setValueAtTime(0.0001, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.02);
            g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
            o.start();
            o.stop(ctx.currentTime + 0.16);
          } catch (e) {}

          // Mensagem fixa
          const calloutText = "Au-au. Posso ajudar?";

          if (state && state.isOpen) {
            addMessage("bot", calloutText);
          } else {
            try {
              const callout = document.createElement("div");
              callout.className = "kodassauro-callout";
              callout.textContent = calloutText;

              // Remove callouts antigos
              const oldCallouts = root.querySelectorAll(".kodassauro-callout");
              oldCallouts.forEach((el) => el.remove());

              root.appendChild(callout);
              requestAnimationFrame(() => callout.classList.add("is-visible"));

              pendingAttention = true;

              setTimeout(() => {
                callout.classList.remove("is-visible");
                setTimeout(() => callout.remove(), 300);
              }, 4000);
            } catch (e) {
              pendingAttention = true;
            }
          }

          sessionStorage.setItem(key, "1");
        } catch (err) {
          // fail silently
        }
      })();

      // Notifications are armed only after first user close.

      // Public API
      window.KodassauroChat = {
        open: openPanel,
        close: closePanel,
        reset: resetChat,
        send: (text) => {
          const t = String(text || "").trim();
          if (!t) return;
          addMessage("user", t);
          handleUserText(t);
        },
        getLeads: () => load(STORAGE.leads, []),
      };

      // Back-compat for 1 release
      window.KoddaChat = window.KodassauroChat;

      persist();
    } catch (err) {
      console.error("[Kodassauro] init failed", err);
      const panel = document.getElementById("kodassauroPanel");
      if (panel) panel.hidden = true;
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
