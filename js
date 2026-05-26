const WHATSAPP_NUMBER = "18099816085";

const quotePanel = document.getElementById("quotePanel");
const quoteButton = document.getElementById("quoteButton");
const closeQuotePanel = document.getElementById("closeQuotePanel");
const quoteItems = document.getElementById("quoteItems");
const quoteTotal = document.getElementById("quoteTotal");
const quoteCount = document.getElementById("quoteCount");
const toast = document.getElementById("toast");

const traySize = document.getElementById("traySize");
const trayTheme = document.getElementById("trayTheme");
const trayColor = document.getElementById("trayColor");
const trayName = document.getElementById("trayName");
const trayPreview = document.getElementById("trayPreview");
const trayPreviewName = document.getElementById("trayPreviewName");
const trayTotal = document.getElementById("trayTotal");

const courseLevel = document.getElementById("courseLevel");
const courseDate = document.getElementById("courseDate");
const coursePeople = document.getElementById("coursePeople");
const courseSeats = document.getElementById("courseSeats");

const candyPeople = document.getElementById("candyPeople");
const candyTheme = document.getElementById("candyTheme");
const candyColors = document.getElementById("candyColors");
const candyResult = document.getElementById("candyResult");
const candyTotal = document.getElementById("candyTotal");

let quote = loadQuote();

function formatMoney(value) {
    return `RD$${Number(value).toLocaleString("es-DO")}`;
}

function whatsappUrl(message) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function loadQuote() {
    try {
        return JSON.parse(localStorage.getItem("creative_quote")) || [];
    } catch (error) {
        return [];
    }
}

function saveQuote() {
    localStorage.setItem("creative_quote", JSON.stringify(quote));
}

function openQuotePanel() {
    quotePanel.classList.add("open");
}

function closeQuotePanelOnly() {
    quotePanel.classList.remove("open");
}

function toggleQuotePanel() {
    quotePanel.classList.toggle("open");
}

function addQuoteItem(item) {
    const existing = quote.find((entry) => entry.name === item.name && entry.detail === item.detail);

    if (existing) {
        existing.quantity += item.quantity || 1;
    } else {
        quote.push({
            name: item.name,
            detail: item.detail || "",
            price: item.price,
            quantity: item.quantity || 1
        });
    }

    renderQuote();
    openQuotePanel();
    showToast("Agregado a cotizacion");
}

function removeQuoteItem(index) {
    quote.splice(index, 1);
    renderQuote();
}

function renderQuote() {
    quoteItems.innerHTML = "";

    if (!quote.length) {
        quoteItems.innerHTML = '<div class="quote-item">Tu cotizacion esta vacia.</div>';
    }

    let total = 0;
    let count = 0;

    quote.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        count += item.quantity;

        const node = document.createElement("article");
        node.className = "quote-item";
        node.innerHTML = `
            <div>
                <strong>${item.name}</strong>
                <button type="button" data-remove-quote="${index}">Quitar</button>
            </div>
            <span>${item.detail}</span>
            <small>${formatMoney(item.price)} x ${item.quantity} = ${formatMoney(subtotal)}</small>
        `;
        quoteItems.appendChild(node);
    });

    quoteTotal.textContent = formatMoney(total);
    quoteCount.textContent = count;
    saveQuote();
}

function selectedPrice(select) {
    return Number(select?.selectedOptions?.[0]?.dataset.price || 0);
}

function selectedText(select) {
    return select?.selectedOptions?.[0]?.textContent?.split(" - ")?.[0] || "";
}

function getTrayState() {
    const extras = [...document.querySelectorAll("[data-tray-extra]:checked")].map((input) => ({
        name: input.dataset.trayExtra,
        price: Number(input.dataset.price)
    }));

    const total = selectedPrice(traySize) + selectedPrice(trayTheme) + extras.reduce((sum, item) => sum + item.price, 0);

    return {
        size: selectedText(traySize),
        theme: trayTheme.value,
        color: trayColor.value,
        name: trayName.value.trim() || "Tu nombre",
        extras,
        total
    };
}

function updateTray() {
    const state = getTrayState();

    trayPreview.style.setProperty("--tray-color", state.color);
    trayPreviewName.textContent = state.name;
    trayTotal.textContent = formatMoney(state.total);
}

function addTrayToQuote() {
    const state = getTrayState();
    const extras = state.extras.map((item) => item.name).join(", ") || "Sin extras";

    addQuoteItem({
        name: `Bandeja personalizada para ${state.name}`,
        detail: `${state.size}, tema ${state.theme}, extras: ${extras}`,
        price: state.total,
        quantity: 1
    });
}

function updateCourseSeats() {
    const people = Math.max(1, Number(coursePeople.value) || 1);
    const seats = Math.max(0, 7 - people);
    courseSeats.textContent = seats;
}

function addCourseToQuote() {
    const people = Math.max(1, Number(coursePeople.value) || 1);
    const price = selectedPrice(courseLevel) * people;
    const date = courseDate.value || "fecha por coordinar";

    addQuoteItem({
        name: `Curso creativo ${courseLevel.value}`,
        detail: `${people} participante(s), ${date}`,
        price,
        quantity: 1
    });
}

function getCandyState() {
    const people = Math.max(10, Number(candyPeople.value) || 10);
    const tableCount = Math.ceil(people / 45);
    const sweets = Math.ceil(people * 3.2);
    const decorPieces = Math.max(4, Math.ceil(people / 18));
    const total = 4500 + people * 95 + tableCount * 1200 + decorPieces * 350;

    return {
        people,
        tableCount,
        sweets,
        decorPieces,
        theme: candyTheme.value,
        colors: candyColors.value.trim() || "colores por definir",
        total
    };
}

function updateCandy() {
    const state = getCandyState();

    candyResult.innerHTML = `
        <div><strong>${state.tableCount}</strong> mesa(s) recomendada(s)</div>
        <div><strong>${state.sweets}</strong> dulces estimados</div>
        <div><strong>${state.decorPieces}</strong> piezas decorativas</div>
        <div>Tema: ${state.theme}. Colores: ${state.colors}</div>
    `;
    candyTotal.textContent = formatMoney(state.total);
}

function addCandyToQuote() {
    const state = getCandyState();

    addQuoteItem({
        name: `Candy buffet ${state.theme}`,
        detail: `${state.people} personas, ${state.tableCount} mesa(s), colores: ${state.colors}`,
        price: state.total,
        quantity: 1
    });
}

function filterProducts(category) {
    document.querySelectorAll("[data-product]").forEach((product) => {
        const visible = category === "todos" || product.dataset.category === category;
        product.style.display = visible ? "" : "none";
    });

    document.querySelectorAll("[data-filter]").forEach((button) => {
        button.classList.toggle("active", button.dataset.filter === category);
    });
}

function sendQuote() {
    if (!quote.length) {
        showToast("Agrega algo a la cotizacion primero");
        return;
    }

    const total = quote.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const lines = [
        "*COTIZACION DETALLES CREATIVOS*",
        "",
        ...quote.map((item) => `- ${item.name}: ${item.detail} | ${formatMoney(item.price)} x ${item.quantity}`),
        "",
        `*TOTAL ESTIMADO: ${formatMoney(total)}*`,
        "",
        "Quiero recibir mas informacion para confirmar mi pedido."
    ];

    window.open(whatsappUrl(lines.join("\n")), "_blank");
}

function sendIdea(event) {
    event.preventDefault();

    const name = document.getElementById("clientName").value.trim();
    const phone = document.getElementById("clientPhone").value.trim();
    const service = document.getElementById("clientService").value;
    const idea = document.getElementById("clientIdea").value.trim();

    if (!name || !phone || !idea) {
        showToast("Completa nombre, WhatsApp e idea");
        return;
    }

    const message = [
        "*PEDIDO PERSONALIZADO*",
        "",
        `Nombre: ${name}`,
        `WhatsApp: ${phone}`,
        `Servicio: ${service}`,
        "",
        `Idea: ${idea}`
    ].join("\n");

    window.open(whatsappUrl(message), "_blank");
}

function initEvents() {
    quoteButton.addEventListener("click", toggleQuotePanel);
    closeQuotePanel.addEventListener("click", closeQuotePanelOnly);

    document.querySelectorAll("[data-open-quote]").forEach((button) => {
        button.addEventListener("click", openQuotePanel);
    });

    document.querySelectorAll("[data-scroll]").forEach((button) => {
        button.addEventListener("click", () => {
            document.querySelector(button.dataset.scroll)?.scrollIntoView({ behavior: "smooth" });
        });
    });

    document.querySelectorAll("[data-add-service]").forEach((button) => {
        button.addEventListener("click", () => {
            addQuoteItem({
                name: button.dataset.addService,
                detail: "Solicitud personalizada",
                price: Number(button.dataset.price || 0),
                quantity: 1
            });
        });
    });

    quoteItems.addEventListener("click", (event) => {
        const removeButton = event.target.closest("[data-remove-quote]");
        if (!removeButton) return;
        removeQuoteItem(Number(removeButton.dataset.removeQuote));
    });

    [traySize, trayTheme, trayColor, trayName, ...document.querySelectorAll("[data-tray-extra]")].forEach((control) => {
        control.addEventListener("input", updateTray);
        control.addEventListener("change", updateTray);
    });

    [courseLevel, coursePeople].forEach((control) => {
        control.addEventListener("input", updateCourseSeats);
        control.addEventListener("change", updateCourseSeats);
    });

    [candyPeople, candyTheme, candyColors].forEach((control) => {
        control.addEventListener("input", updateCandy);
        control.addEventListener("change", updateCandy);
    });

    document.getElementById("addTray").addEventListener("click", addTrayToQuote);
    document.getElementById("addCourse").addEventListener("click", addCourseToQuote);
    document.getElementById("addCandy").addEventListener("click", addCandyToQuote);
    document.getElementById("sendQuote").addEventListener("click", sendQuote);
    document.getElementById("ideaForm").addEventListener("submit", sendIdea);

    document.getElementById("filterBar").addEventListener("click", (event) => {
        const button = event.target.closest("[data-filter]");
        if (!button) return;
        filterProducts(button.dataset.filter);
    });
}

initEvents();
updateTray();
updateCourseSeats();
updateCandy();
renderQuote();
