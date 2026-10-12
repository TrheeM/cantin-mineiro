/* =========================================================
   Cantin Mineiro — catálogo (UI)
   Produtos, destaques e a cesta ficam em data.js.
   ========================================================= */
import { WHATSAPP, CATEGORIES, PRODUCTS, HERO, OFFERS, CESTA, EVENTOS, CREDITS } from './data.js';

document.documentElement.classList.add('js');

/* ---------- helpers ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const byId = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGsap = () => typeof window.gsap !== 'undefined';
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = v => v.toFixed(2).replace('.', ',');
const priceHTML = v => {
    const [i, c] = fmt(v).split(',');
    return `<span class="price"><small>R$ </small>${i}<small>,${c}</small></span>`;
};
const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage blocked */ } },
};
const IMG = id => `assets/img/products/${id}.webp`;
const EXT = 'target="_blank" rel="noopener noreferrer"';
const ICON = id => `<svg class="icon" aria-hidden="true"><use href="#${id}"/></svg>`;
const photo = (p, { eager = false } = {}) =>
    `<img class="pimg" src="${IMG(p.id)}" alt="${esc(p.name)}" width="640" height="800" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;

/* ---------- WhatsApp ---------- */
const waLink = msg => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
const msgFor = p => `Olá, Cantin Mineiro! Vi no catálogo e queria saber: tem disponível *${p.name}*${p.price ? ` (R$ ${fmt(p.price)})` : ''}? Qual o valor?`;
const GENERAL_MSG = { geral: 'Olá, Cantin Mineiro! Vim pelo catálogo do site e queria fazer um pedido.' };
$$('[data-wa]').forEach(a => { a.href = waLink(GENERAL_MSG[a.dataset.wa] || GENERAL_MSG.geral); });

const asked = new Set(store.get('cantin-asked', []));
const toastEl = $('#toast');
let toastT;
function toast(text) {
    $('span', toastEl).textContent = text;
    toastEl.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove('show'), 2600);
}
function markAsked(id) {
    asked.add(id);
    store.set('cantin-asked', [...asked]);
    $$(`.asked[data-for="${id}"]`).forEach(el => { el.hidden = false; });
}
document.addEventListener('click', e => {
    const a = e.target.closest('[data-ask]');
    if (!a) return;
    const p = byId[a.dataset.ask];
    if (p) { markAsked(p.id); toast(`Abrindo o WhatsApp: ${p.name}`); }
});

const askBtn = (p, cls = 'btn-wa', text = 'Tem disponível?') =>
    `<a class="${cls}" href="${waLink(msgFor(p))}" ${EXT} data-ask="${p.id}" aria-label="Perguntar no WhatsApp se tem ${esc(p.name)}">${ICON('i-wa')}${text}</a>`;
const addBtn = (p, compact = false) =>
    `<button class="add" type="button" data-add="${p.id}" aria-pressed="false" aria-label="Pôr ${esc(p.name)} na cesta">${ICON('i-plus')}${compact ? '<span>Pôr na cesta</span>' : 'Pôr na cesta'}</button>`;

/* =========================================================
   Hero: foto do destaque numa janela em arco
   ========================================================= */
const heroEl = $('#inicio');
const tiltEl = $('#hero-tilt');
const archEl = $('#hero-arch');
const slides = HERO.map((h, i) => {
    const p = byId[h.id];
    const img = document.createElement('img');
    img.className = 'slide' + (i === 0 ? ' on' : '');
    img.src = h.lg ? `assets/img/products/${p.id}-lg.webp` : IMG(p.id);
    img.alt = i === 0 ? p.name : '';
    img.width = 640; img.height = 800;
    img.decoding = 'async';
    if (i === 0) img.fetchPriority = 'high';
    archEl.appendChild(img);
    return img;
});

const picker = $('#picker');
picker.innerHTML = HERO.map((h, i) => {
    const p = byId[h.id];
    return `<button class="pick" type="button" aria-pressed="${i === 0}" data-index="${i}" aria-label="${esc(p.name)}">
        <img src="${IMG(p.id)}" alt="" width="640" height="800" decoding="async">
        <span class="pick-info"><b>${esc(h.short)}</b><span>${p.price ? `R$ ${fmt(p.price)}` : 'Consulte'}</span></span>
    </button>`;
}).join('');

let heroIndex = 0;
let switching = false;
const heroAsk = $('#hero-ask');
function setHeroAsk(i) {
    const p = byId[HERO[i].id];
    heroAsk.href = waLink(msgFor(p));
    heroAsk.dataset.ask = p.id;
    heroAsk.setAttribute('aria-label', `Perguntar no WhatsApp se tem ${p.name}`);
    $('#hero-live').textContent = `Em destaque: ${p.name}`;
}
setHeroAsk(0);

function swapSlide(from, to) {
    slides[from].classList.remove('on');
    slides[from].alt = '';
    slides[to].classList.add('on');
    slides[to].alt = byId[HERO[to].id].name;
}
function selectHero(i) {
    i = (i + HERO.length) % HERO.length;
    if (i === heroIndex || switching) return;
    const from = heroIndex;
    heroIndex = i;
    $$('.pick', picker).forEach((c, k) => c.setAttribute('aria-pressed', String(k === i)));
    setHeroAsk(i);
    const h = HERO[i];
    if (!hasGsap() || reduceMotion) {
        heroEl.style.setProperty('--bg-inner', h.theme[0]);
        heroEl.style.setProperty('--bg-mid', h.theme[1]);
        heroEl.style.setProperty('--bg-outer', h.theme[2]);
        heroEl.style.setProperty('--glow', h.glow);
        swapSlide(from, i);
        return;
    }
    switching = true;
    gsap.to(heroEl, { '--bg-inner': h.theme[0], '--bg-mid': h.theme[1], '--bg-outer': h.theme[2], '--glow': h.glow, duration: 1.4, ease: 'power2.inOut' });
    // a janela "abre" de baixo pra cima com a nova foto, enquanto o arco gira de leve
    const next = slides[i], cur = slides[from];
    next.classList.add('on');
    gsap.set(next, { zIndex: 2 });
    gsap.fromTo(next, { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.18 }, {
        clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.1, ease: 'expo.inOut',
        onComplete() { swapSlide(from, i); gsap.set([next, cur], { clearProps: 'zIndex,clipPath,transform' }); switching = false; },
    });
    gsap.fromTo(cur, { scale: 1 }, { scale: 0.92, duration: 1.1, ease: 'expo.inOut' });
    gsap.fromTo(archEl, { rotationY: 0 }, { keyframes: [{ rotationY: -14, duration: 0.5, ease: 'power2.in' }, { rotationY: 0, duration: 1, ease: 'back.out(1.6)' }] });
}
picker.addEventListener('click', e => { const c = e.target.closest('.pick'); if (c) selectHero(+c.dataset.index); });
$('#hero-prev').addEventListener('click', () => selectHero(heroIndex - 1));
$('#hero-next').addEventListener('click', () => selectHero(heroIndex + 1));

/* ---------- Grãos de café: flutuam, seguem o cursor em camadas e fogem dele ---------- */
const beans = (() => {
    const box = $('#beans');
    const spec = innerWidth < 700
        ? [[6, 52, 26, 1], [88, 50, 30, 1], [84, 70, 38, 1], [10, 74, 22, 0], [70, 44, 18, 0]]
        : [[34, 16, 44, 1], [64, 11, 28, 0], [69, 64, 56, 1], [30, 72, 34, 1], [23, 62, 22, 0], [73, 48, 24, 0], [52, 95, 20, 0], [6, 68, 28, 0], [90, 60, 38, 1]];
    const list = spec.map(([x, y, s, near], k) => {
        const el = document.createElement('span');
        el.className = 'bean' + (near ? '' : ' far');
        el.style.left = x + '%';
        el.style.top = y + '%';
        el.style.width = s + 'px';
        el.style.height = s * 1.3 + 'px';
        el.innerHTML = '<svg viewBox="0 0 40 52"><use href="#i-bean"/></svg>';
        box.appendChild(el);
        return { el, depth: near ? 1 : 0.45, rot: (k * 47) % 360, phase: k * 1.3, rx: 0, ry: 0 };
    });
    return {
        render(time, cm, mouse) {
            const r = box.getBoundingClientRect();
            for (const b of list) {
                const bx = r.left + b.el.offsetLeft, by = r.top + b.el.offsetTop;
                const dx = bx - mouse.px, dy = by - (mouse.py - scrollY);
                const d = Math.hypot(dx, dy);
                const push = reduceMotion ? 0 : Math.max(0, 1 - d / 240) * 70 * b.depth;
                b.rx += ((d ? dx / d : 0) * push - b.rx) * 0.08;
                b.ry += ((d ? dy / d : 0) * push - b.ry) * 0.08;
                const fy = reduceMotion ? 0 : Math.sin(time * 0.9 + b.phase) * 10 * b.depth;
                const px = -cm.x * 60 * b.depth, py = -cm.y * 40 * b.depth;
                const rot = b.rot + (reduceMotion ? 0 : Math.sin(time * 0.4 + b.phase) * 14);
                b.el.style.transform = `translate3d(${(px + b.rx).toFixed(1)}px, ${(py + fy + b.ry).toFixed(1)}px, 0) rotate(${rot.toFixed(1)}deg)`;
            }
        },
    };
})();

/* ---------- Loop do topo: janela inclina com o cursor, grãos se mexem ---------- */
(() => {
    const mouse = { x: 0, y: 0, px: -9999, py: -9999 };
    const cm = { x: 0, y: 0 };
    addEventListener('pointermove', e => {
        mouse.x = e.clientX / innerWidth - 0.5;
        mouse.y = e.clientY / innerHeight - 0.5;
        mouse.px = e.clientX;
        mouse.py = e.clientY + scrollY;
    }, { passive: true });
    let running = false, raf = 0;
    function frame() {
        const time = performance.now() * 0.001;
        cm.x += (mouse.x - cm.x) * 0.05;
        cm.y += (mouse.y - cm.y) * 0.05;
        const fy = reduceMotion ? 0 : Math.sin(time * Math.PI * 2 / 7) * 10;
        tiltEl.style.transform = `translate3d(0, ${fy.toFixed(2)}px, 0) rotateY(${(cm.x * 14).toFixed(2)}deg) rotateX(${(-cm.y * 8).toFixed(2)}deg)`;
        beans.render(time, cm, mouse);
        raf = running ? requestAnimationFrame(frame) : 0;
    }
    function setRunning(on) {
        running = on && !document.hidden;
        if (running && !raf) raf = requestAnimationFrame(frame);
    }
    new IntersectionObserver(([e]) => setRunning(e.isIntersecting), { threshold: 0 }).observe(heroEl);
    document.addEventListener('visibilitychange', () => setRunning(!document.hidden && heroEl.getBoundingClientRect().bottom > 0));
    frame();
})();

/* ---------- Mais pedidos ---------- */
(() => {
    const [main, ...rest] = OFFERS.map(id => byId[id]);
    $('#offers').innerHTML = `
        <article class="offer-hero">
            <div class="o-copy">
                <span class="o-flag">O que começou tudo</span>
                <h3>${esc(main.name)}<small>${esc(main.style)}</small></h3>
                <p class="o-desc">Foi com os queijos da família que o Marcus começou a vender de porta em porta em Lorena. Até hoje a gente busca em Minas.</p>
                <div class="o-ask">
                    <span class="hand">${main.price ? priceHTML(main.price) : 'preço: pergunte!'}</span>
                    <div class="o-foot">${askBtn(main)} ${addBtn(main)}</div>
                </div>
            </div>
            <div class="o-render"><div class="frame">${photo(main)}</div></div>
        </article>
        <div class="offer-list">
            ${rest.map(p => `
            <article class="offer-row">
                <div class="o-thumb">${photo(p)}</div>
                <div>
                    <h3>${esc(p.name)}</h3>
                    <p class="o-desc">${esc(p.style)}</p>
                    <div class="o-foot">${askBtn(p)}${addBtn(p)}</div>
                </div>
            </article>`).join('')}
        </div>`;
})();

/* ---------- Armário (catálogo) ---------- */
const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const STRING = '<svg class="tag-string" viewBox="0 0 18 30" aria-hidden="true"><path d="M6 23 C 1 14, 14 10, 10 0" stroke="#7a5a3a" stroke-width="1.4" fill="none" stroke-linecap="round"/></svg>';
(() => {
    const shelves = $('#shelves');
    shelves.innerHTML = CATEGORIES.map(c => {
        const items = PRODUCTS.filter(p => p.cat === c.id);
        return `<section class="shelf" data-cat="${c.id}" aria-labelledby="shelf-${c.id}">
            <div class="shelf-head"><h3 id="shelf-${c.id}">${c.name}</h3><span>${items.length} ${items.length === 1 ? 'item' : 'itens'}</span></div>
            <ul class="shelf-row">
            ${items.map(p => `<li class="item" data-id="${p.id}" data-search="${esc(norm(`${p.name} ${p.size} ${p.style} ${c.name}`))}">
                <div class="spot"><div class="window">${photo(p)}${p.own ? '<span class="own-mark">foto nossa</span>' : ''}</div></div>
                <div class="ledge" aria-hidden="true"></div>
                <div class="tag">${STRING}${p.price ? priceHTML(p.price) : '<span class="consulte">consulte</span>'}${p.promo ? '<span class="t-flag">Mais pedido</span>' : ''}</div>
                <div class="t-body">
                    <p class="t-name">${esc(p.name)}</p>
                    <p class="t-meta"><span class="t-size">${esc(p.size)}</span>${esc(p.style)}</p>
                    <div class="t-actions">${askBtn(p, 'ask')}${addBtn(p, true)}</div>
                    <span class="asked" data-for="${p.id}" ${asked.has(p.id) ? '' : 'hidden'}>${ICON('i-check')}Você já perguntou</span>
                </div>
            </li>`).join('')}
            </ul>
        </section>`;
    }).join('');

    const filters = [{ id: 'all', name: 'Tudo' }, { id: 'promo', name: 'Mais pedidos' }, ...CATEGORIES];
    const count = id => id === 'all' ? PRODUCTS.length : id === 'promo' ? PRODUCTS.filter(p => p.promo).length : PRODUCTS.filter(p => p.cat === id).length;
    const toggles = $('#toggles');
    toggles.innerHTML = filters.map((f, i) => `<button class="toggle" type="button" data-filter="${f.id}" aria-pressed="${i === 0}">${f.name}<span class="n">${count(f.id)}</span></button>`).join('');

    let filter = 'all', query = '';
    const items = $$('.item', shelves);
    const shelfEls = $$('.shelf', shelves);
    const resultCount = $('#result-count');
    const empty = $('#empty-state');
    function apply() {
        const q = norm(query.trim());
        let n = 0;
        items.forEach(li => {
            const p = byId[li.dataset.id];
            const okF = filter === 'all' || (filter === 'promo' ? p.promo : p.cat === filter);
            const okQ = !q || q.split(/\s+/).every(w => li.dataset.search.includes(w));
            li.hidden = !(okF && okQ);
            if (!li.hidden) n++;
        });
        shelfEls.forEach(s => { s.hidden = !$$('.item', s).some(li => !li.hidden); });
        resultCount.textContent = (q || filter !== 'all') ? `${n} ${n === 1 ? 'produto encontrado' : 'produtos encontrados'}` : `${n} produtos no armário`;
        empty.classList.toggle('show', n === 0);
        if (window.__revealShelvesInView) requestAnimationFrame(window.__revealShelvesInView);
        if (n === 0) $('#empty-ask').href = waLink(`Olá, Cantin Mineiro! Procurei no site e não achei: *${query.trim().slice(0, 80) || 'um produto'}*. Vocês têm?`);
    }
    toggles.addEventListener('click', e => {
        const b = e.target.closest('.toggle');
        if (!b) return;
        filter = b.dataset.filter;
        $$('.toggle', toggles).forEach(t => t.setAttribute('aria-pressed', String(t === b)));
        apply();
    });
    let st;
    $('#search').addEventListener('input', e => { clearTimeout(st); query = e.target.value; st = setTimeout(apply, 120); });
    apply();
})();

/* =========================================================
   Monte sua cesta: cada produto cai dentro da cesta
   (a ação principal do site, como o copão da Adega Milão)
   ========================================================= */
const cesta = (() => {
    const form = $('#cesta-form');
    form.addEventListener('submit', e => e.preventDefault());
    const box = $('#basket-items');
    const lines = $('#caderno-lines');
    const send = $('#caderno-send');
    const hint = $('#caderno-hint');
    const clearBtn = $('#caderno-clear');
    const ocasiaoOut = $('#caderno-ocasiao');
    const countOut = $('#basket-count');
    const animate = !reduceMotion && hasGsap();
    const valid = new Set(PRODUCTS.map(p => p.id));
    let picked = store.get('cantin-cesta', []).filter(id => valid.has(id)).slice(0, CESTA.max);
    let ocasiao = store.get('cantin-ocasiao', '');
    if (!CESTA.ocasioes.includes(ocasiao)) ocasiao = '';

    // opções do formulário
    $('[data-group="ocasiao"]', form).innerHTML = CESTA.ocasioes.map(o =>
        `<label class="chip text"><input type="radio" name="ocasiao" value="${esc(o)}" ${o === ocasiao ? 'checked' : ''}><span>${esc(o)}</span></label>`).join('');
    for (const g of CESTA.grupos) {
        $(`[data-group="${g.id}"]`, form).innerHTML = g.items.map(id => {
            const p = byId[id];
            return `<label class="chip"><input type="checkbox" name="produto" value="${id}"><span><img src="${IMG(id)}" alt="" width="30" height="30" loading="lazy" decoding="async">${esc(p.name)}</span></label>`;
        }).join('');
    }

    // posições na cesta: fileira de trás (mais alta) e da frente; a primeira peça cai no meio
    const SLOTS = [
        { x: 50, b: 33, r: 0, z: 6 }, { x: 34, b: 42, r: -7, z: 2 }, { x: 66, b: 42, r: 7, z: 2 }, { x: 28, b: 31, r: -5, z: 5 },
        { x: 72, b: 31, r: 5, z: 5 }, { x: 19, b: 39, r: -12, z: 1 }, { x: 81, b: 39, r: 12, z: 1 }, { x: 50, b: 47, r: 2, z: 0 },
    ];
    const els = new Map();
    function place(el, k, tween) {
        const s = SLOTS[k];
        const props = { left: `${s.x - 12.5}%`, bottom: `${s.b}%`, rotation: s.r, zIndex: s.z };
        if (tween && animate) gsap.to(el, { ...props, duration: 0.6, ease: 'expo.out' });
        else if (hasGsap()) gsap.set(el, props);
        else Object.assign(el.style, { left: props.left, bottom: props.bottom, zIndex: s.z, transform: `rotate(${s.r}deg)` });
    }
    function dropIn(id, k, quiet) {
        const el = document.createElement('div');
        el.className = 'b-item';
        el.innerHTML = `<img src="${IMG(id)}" alt="" width="640" height="800" decoding="async">`;
        box.appendChild(el);
        els.set(id, el);
        place(el, k, false);
        if (animate && !quiet) {
            gsap.fromTo(el, { yPercent: -230, rotation: SLOTS[k].r - 24, opacity: 0 },
                { yPercent: 0, rotation: SLOTS[k].r, opacity: 1, duration: 1, ease: 'bounce.out' });
            gsap.fromTo('#basket', { scaleY: 1 }, { keyframes: [{ scaleY: 0.97, scaleX: 1.02, duration: 0.12, delay: 0.42 }, { scaleY: 1, scaleX: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' }], transformOrigin: '50% 100%' });
        }
    }
    function takeOut(id) {
        const el = els.get(id);
        els.delete(id);
        if (!el) return;
        if (animate) gsap.to(el, { yPercent: -160, opacity: 0, rotation: '+=20', duration: 0.5, ease: 'power2.in', onComplete: () => el.remove() });
        else el.remove();
    }
    function relayout() { picked.forEach((id, k) => { const el = els.get(id); if (el) place(el, k, true); }); }

    function render(changedLine) {
        const full = picked.length >= CESTA.max;
        $$('input[name="produto"]', form).forEach(i => {
            i.checked = picked.includes(i.value);
            i.disabled = full && !i.checked;
        });
        $$('[data-add]').forEach(b => {
            const on = picked.includes(b.dataset.add);
            b.setAttribute('aria-pressed', String(on));
            const p = byId[b.dataset.add];
            b.setAttribute('aria-label', `${on ? 'Tirar' : 'Pôr'} ${p.name} ${on ? 'da' : 'na'} cesta`);
            const span = $('span', b);
            if (span) span.textContent = on ? 'Na cesta' : 'Pôr na cesta';
            else b.lastChild.textContent = on ? 'Na cesta' : 'Pôr na cesta';
        });
        ocasiaoOut.textContent = `Ocasião: ${ocasiao || 'escolha ao lado'}`;
        lines.innerHTML = picked.length
            ? picked.map(id => `<li>${esc(byId[id].name)}</li>`).join('')
            : '<li class="empty">Nada na cesta ainda</li>';
        if (changedLine && animate) {
            const li = [...lines.children].find(l => l.textContent === byId[changedLine]?.name);
            if (li) gsap.fromTo(li, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.6, ease: 'steps(10)' });
        }
        countOut.textContent = picked.length ? `${picked.length} de ${CESTA.max} na cesta` : 'A cesta está vazia';
        const ready = picked.length > 0;
        send.setAttribute('aria-disabled', ready ? 'false' : 'true');
        clearBtn.hidden = !ready;
        hint.textContent = ready ? 'A gente responde com o que tem e o valor da cesta.' : 'Coloque pelo menos um produto na cesta.';
        send.href = ready
            ? waLink(`Olá, Cantin Mineiro! Montei uma cesta no site:${ocasiao ? `\nOcasião: ${ocasiao}` : ''}\n${picked.map(id => `- ${byId[id].name}`).join('\n')}\nTem tudo disponível? Qual fica o valor?`)
            : '#';
        store.set('cantin-cesta', picked);
        store.set('cantin-ocasiao', ocasiao);
    }

    function toggle(id, { from } = {}) {
        if (picked.includes(id)) {
            picked = picked.filter(x => x !== id);
            takeOut(id);
            relayout();
            render();
            if (from === 'catalog') toast(`${byId[id].name} saiu da cesta`);
            return;
        }
        if (picked.length >= CESTA.max) { toast(`A cesta está cheia (${CESTA.max} itens). Tire algo pra trocar.`); render(); return; }
        picked.push(id);
        dropIn(id, picked.length - 1);
        render(id);
        if (from === 'catalog') toast(`${byId[id].name} foi pra cesta`);
    }

    form.addEventListener('change', e => {
        if (e.target.name === 'ocasiao') { ocasiao = e.target.value; render(); return; }
        if (e.target.name === 'produto') toggle(e.target.value);
    });
    document.addEventListener('click', e => {
        const b = e.target.closest('[data-add]');
        if (b) toggle(b.dataset.add, { from: 'catalog' });
    });
    send.addEventListener('click', e => {
        if (send.getAttribute('aria-disabled') === 'true') { e.preventDefault(); hint.textContent = 'Falta colocar algum produto na cesta.'; return; }
        toast('Abrindo o WhatsApp com a sua cesta');
    });
    clearBtn.addEventListener('click', () => {
        [...picked].forEach(takeOut);
        picked = [];
        render();
    });

    // cesta que ficou salva de outra visita: aparece já montada
    picked.forEach((id, k) => dropIn(id, k, true));
    render();
    return { refill() {
        if (!animate || !picked.length) return;
        picked.forEach((id, k) => { const el = els.get(id); gsap.fromTo(el, { yPercent: -200, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, delay: 0.25 + k * 0.08, ease: 'bounce.out' }); });
    } };
})();

/* ---------- Orçamento de eventos ---------- */
(() => {
    const form = $('#quote-form');
    form.addEventListener('submit', e => e.preventDefault());
    $('[data-group="tipo"]', form).innerHTML = EVENTOS.tipos.map(t =>
        `<label class="chip text"><input type="radio" name="tipo" value="${esc(t)}"><span>${esc(t)}</span></label>`).join('');
    $('[data-group="servicos"]', form).innerHTML = EVENTOS.servicos.map(t =>
        `<label class="chip text"><input type="checkbox" name="servico" value="${esc(t)}"><span>${esc(t)}</span></label>`).join('');
    const send = $('#quote-send');
    function update() {
        const tipo = form.elements.tipo.value;
        const conv = parseInt(form.elements.convidados.value, 10);
        const data = form.elements.data.value;
        const serv = $$('input[name="servico"]:checked', form).map(i => i.value);
        const rows = [];
        if (tipo) rows.push(`Tipo: ${tipo}`);
        if (conv > 0) rows.push(`Convidados: ${conv}`);
        if (data) { const [y, m, d] = data.split('-'); rows.push(`Data: ${d}/${m}/${y}`); }
        if (serv.length) rows.push(`Quero: ${serv.join(', ')}`);
        send.href = waLink(`Olá, Cantin Mineiro! Quero um orçamento para evento.${rows.length ? '\n' + rows.map(r => `- ${r}`).join('\n') : ''}`);
    }
    form.addEventListener('input', update);
    form.addEventListener('change', update);
    send.addEventListener('click', () => toast('Abrindo o WhatsApp com o seu orçamento'));
    update();
})();

/* ---------- Créditos das fotos ilustrativas ---------- */
$('#credits').innerHTML = CREDITS.map(c =>
    `<li>${esc(byId[c.id]?.name || c.id)}: ${esc(c.author)}, <a href="${esc(c.url)}" ${EXT}>${esc(c.license)}</a> (Wikimedia Commons)</li>`).join('');

/* ---------- Header / FAB / nav ---------- */
(() => {
    const header = $('#header'), fab = $('#fab');
    new IntersectionObserver(([e]) => {
        header.classList.toggle('scrolled', !e.isIntersecting || e.intersectionRatio < 0.92);
        fab.classList.toggle('show', !e.isIntersecting);
    }, { threshold: [0, 0.92] }).observe(heroEl);
    const links = $$('.nav-item');
    const io = new IntersectionObserver(entries => {
        entries.forEach(en => {
            if (en.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${en.target.id}`));
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['inicio', 'destaques', 'cesta', 'catalogo', 'eventos', 'historia'].forEach(id => io.observe(document.getElementById(id)));
})();

/* =========================================================
   Movimento: uma sequência de entrada, depois revelações no scroll
   ========================================================= */
const motionOK = !reduceMotion && hasGsap();
const ST = motionOK && window.ScrollTrigger ? window.ScrollTrigger : null;
if (ST) gsap.registerPlugin(ST);

function playIntro() {
    if (!motionOK) { $$('.intro').forEach(el => { el.style.opacity = '1'; }); return; }
    heroEl.classList.add('intro-run');
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, onComplete() { heroEl.classList.remove('intro-run'); } });
    tl.fromTo('.main-title .intro', { y: 90, opacity: 0, filter: 'blur(12px)' }, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.4, stagger: 0.12, clearProps: 'transform,filter' }, 0.05)
      .set(tiltEl, { opacity: 1 }, 0.1)
      // a janela sobe e a foto se revela de baixo pra cima
      .fromTo(archEl, { y: 120, scale: 0.86, clipPath: 'inset(100% 0% 0% 0% round 999px 999px 4px 4px)' }, { y: 0, scale: 1, clipPath: 'inset(0% 0% 0% 0% round 999px 999px 4px 4px)', duration: 1.8, clearProps: 'transform,clipPath' }, 0.1)
      .fromTo(slides[0], { scale: 1.3 }, { scale: 1, duration: 2.2, clearProps: 'transform' }, 0.1)
      .fromTo('.bean', { scale: 0, opacity: 0 }, { scale: 1, opacity: (k, el) => el.classList.contains('far') ? 0.7 : 1, duration: 1.2, stagger: 0.05, ease: 'back.out(2)', clearProps: 'scale' }, 0.5)
      .fromTo(['.description.intro', '.primary-btn.intro'], { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, stagger: 0.1, clearProps: 'transform' }, 0.5)
      .set('#picker', { opacity: 1 }, 0.55)
      .fromTo('.pick', { y: 60, opacity: 0 }, { y: 0, opacity: (k, el) => el.getAttribute('aria-pressed') === 'true' ? 1 : 0.62, duration: 1.1, stagger: 0.09, ease: 'back.out(1.5)', clearProps: 'transform,opacity' }, 0.55)
      .fromTo('.picker-nav.intro', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, clearProps: 'transform' }, 0.8)
      .fromTo('.side-title .intro', { x: 60, opacity: 0, filter: 'blur(10px)' }, { x: 0, opacity: 1, filter: 'blur(0px)', duration: 1.3, stagger: 0.1, clearProps: 'transform,filter' }, 0.7)
      .fromTo('.badge.intro', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, clearProps: 'transform' }, 1)
      .fromTo('.seal.intro', { scale: 0.3, rotation: -120, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: 1.4, ease: 'back.out(1.7)', clearProps: 'transform' }, 0.95);
}
(document.fonts ? Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 900))]) : Promise.resolve()).then(playIntro);

/* ---------- faixa da marca: corre sozinha e acelera com o scroll ---------- */
(() => {
    const track = $('#ticker-track');
    const group = $('.ticker-group', track);
    track.appendChild(group.cloneNode(true));
    if (reduceMotion) return;
    if (!hasGsap()) { track.classList.add('css-run'); return; }
    const loop = gsap.to(track, { xPercent: -50, duration: 38, ease: 'none', repeat: -1 });
    if (!ST) return;
    let dir = 1;
    ST.create({
        trigger: track,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: self => { if (self.isActive) loop.play(); else loop.pause(); },
        onUpdate: self => {
            dir = self.direction;
            const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 350, 5);
            gsap.to(loop, { timeScale: dir * boost, duration: 0.2, overwrite: true, onComplete: () => gsap.to(loop, { timeScale: dir, duration: 1.2, ease: 'power2.out' }) });
        },
    });
})();

/* ---------- revelações no scroll ---------- */
const revealShelf = shelf => {
    if (shelf.dataset.shown) return;
    shelf.dataset.shown = '1';
    const tl = gsap.timeline();
    tl.to($$('.ledge', shelf), { scaleX: 1, duration: 0.8, stagger: 0.05, ease: 'expo.out' })
      .to($$('.spot .window', shelf), { y: 0, opacity: 1, duration: 0.9, stagger: 0.07, ease: 'back.out(1.4)' }, 0.15)
      .to($$('.tag', shelf), { rotation: 0, opacity: 1, duration: 1.2, stagger: 0.06, ease: 'elastic.out(1, 0.4)' }, 0.45)
      .to($$('.t-body', shelf), { y: 0, opacity: 1, duration: 0.7, stagger: 0.05, ease: 'expo.out', clearProps: 'transform' }, 0.5);
};
window.__revealShelvesInView = () => {
    if (!ST) return;
    ST.refresh();
    $$('.shelf').forEach(s => { if (!s.hidden && s.getBoundingClientRect().top < innerHeight) revealShelf(s); });
};

if (ST) {
    const up = (targets, vars = {}) => gsap.set(targets, { y: 50, opacity: 0, ...vars });
    $$('.section-head').forEach(head => {
        const h = $('.h2', head), lede = $('.lede', head);
        gsap.set(h, { y: 70, opacity: 0, filter: 'blur(10px)' });
        up(lede, { y: 30 });
        ST.create({ trigger: head, start: 'top 85%', once: true, onEnter: () => {
            gsap.to(h, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.3, ease: 'expo.out', clearProps: 'filter' });
            gsap.to(lede, { y: 0, opacity: 1, duration: 1.1, delay: 0.15, ease: 'expo.out' });
        } });
    });
    // destaque principal: a janela sobe e a foto revela de baixo pra cima, depois flutua com o scroll
    gsap.set('.o-render .frame', { clipPath: 'inset(100% 0% 0% 0% round 999px 999px 4px 4px)' });
    up('.offer-hero .o-copy > *');
    ST.create({ trigger: '.offer-hero', start: 'top 80%', once: true, onEnter: () => {
        gsap.to('.o-render .frame', { clipPath: 'inset(0% 0% 0% 0% round 999px 999px 4px 4px)', duration: 1.6, ease: 'expo.inOut', clearProps: 'clipPath' });
        gsap.fromTo('.o-render .pimg', { scale: 1.3 }, { scale: 1, duration: 2, ease: 'expo.out', clearProps: 'transform' });
        gsap.to('.offer-hero .o-copy > *', { y: 0, opacity: 1, duration: 1, stagger: 0.08, ease: 'expo.out', delay: 0.15 });
    } });
    gsap.fromTo('.o-render', { yPercent: 5 }, { yPercent: -5, ease: 'none', scrollTrigger: { trigger: '.offer-hero', start: 'top bottom', end: 'bottom top', scrub: true } });
    up('.offer-row', { x: 50, y: 0 });
    ST.batch('.offer-row', { start: 'top 88%', once: true, onEnter: b => gsap.to(b, { x: 0, opacity: 1, duration: 1, stagger: 0.12, ease: 'expo.out' }) });
    // cesta
    up('.steps .step');
    ST.batch('.steps .step', { start: 'top 88%', once: true, onEnter: b => gsap.to(b, { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'expo.out' }) });
    gsap.set('#basket', { y: 80, opacity: 0, rotation: -4 });
    gsap.set('.caderno', { y: 120, opacity: 0, rotation: 8 });
    ST.create({ trigger: '#basket', start: 'top 85%', once: true, onEnter: () => {
        gsap.to('#basket', { y: 0, opacity: 1, rotation: 0, duration: 1.3, ease: 'back.out(1.4)', onComplete: () => cesta.refill() });
        gsap.to('.caderno', { y: 0, opacity: 1, rotation: innerWidth > 680 ? -1.2 : 0, duration: 1.4, delay: 0.12, ease: 'expo.out' });
    } });
    // armário: a prateleira se desenha, as janelas sobem, as etiquetas balançam no barbante
    gsap.set('.ledge', { scaleX: 0, transformOrigin: '0 50%' });
    gsap.set('.spot .window', { y: 50, opacity: 0 });
    gsap.set('.tag', { rotation: -22, opacity: 0, transformOrigin: '8px 50%' });
    gsap.set('.t-body', { y: 20, opacity: 0 });
    $$('.shelf').forEach(shelf => ST.create({ trigger: shelf, start: 'top 82%', once: true, onEnter: () => revealShelf(shelf) }));
    // eventos
    // a janela com o chocolate abre e o flyer cai por cima, como papel solto na mesa
    gsap.set('.ev-arch', { clipPath: 'inset(100% 0% 0% 0% round 999px 999px 4px 4px)' });
    gsap.set('.ev-flyer', { y: -120, opacity: 0, rotation: -14 });
    ST.create({ trigger: '.ev-photos', start: 'top 80%', once: true, onEnter: () => {
        gsap.to('.ev-arch', { clipPath: 'inset(0% 0% 0% 0% round 999px 999px 4px 4px)', duration: 1.6, ease: 'expo.inOut', clearProps: 'clipPath' });
        gsap.to('.ev-flyer', { y: 0, opacity: 1, rotation: 4, duration: 1.3, delay: 0.6, ease: 'back.out(1.6)' });
    } });
    gsap.fromTo('.ev-flyer', { yPercent: 4 }, { yPercent: -6, ease: 'none', scrollTrigger: { trigger: '#eventos', start: 'top bottom', end: 'bottom top', scrub: true } });
    up('.ev-services li', { x: 40, y: 0 });
    ST.batch('.ev-services li', { start: 'top 90%', once: true, onEnter: b => gsap.to(b, { x: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'expo.out' }) });
    up('.quote', { y: 40 });
    ST.create({ trigger: '.quote', start: 'top 90%', once: true, onEnter: () => gsap.to('.quote', { y: 0, opacity: 1, duration: 1, ease: 'expo.out' }) });
    // história
    gsap.set('.story-photo img', { clipPath: 'inset(100% 0% 0% 0% round 999px 999px 4px 4px)' });
    gsap.set('.story-photo figcaption', { x: 40, opacity: 0, rotation: 6 });
    up('.story-copy > *', { y: 30 });
    ST.create({ trigger: '.story', start: 'top 75%', once: true, onEnter: () => {
        gsap.to('.story-photo img', { clipPath: 'inset(0% 0% 0% 0% round 999px 999px 4px 4px)', duration: 1.6, ease: 'expo.inOut', clearProps: 'clipPath' });
        gsap.to('.story-photo figcaption', { x: 0, opacity: 1, rotation: -4, duration: 1.2, delay: 0.9, ease: 'elastic.out(1, 0.5)' });
        gsap.to('.story-copy > *', { y: 0, opacity: 1, duration: 1, stagger: 0.08, delay: 0.2, ease: 'expo.out' });
    } });
    // instagram
    up('.insta a', { y: 70, scale: 0.96 });
    ST.batch('.insta a', { start: 'top 90%', once: true, onEnter: b => gsap.to(b, { y: 0, scale: 1, opacity: 1, duration: 1.2, stagger: 0.1, ease: 'expo.out' }) });
    // como pedir
    up('.how li', { y: 40 });
    ST.batch('.how li', { start: 'top 90%', once: true, onEnter: b => gsap.to(b, { y: 0, opacity: 1, duration: 1, stagger: 0.12, ease: 'expo.out' }) });
    up('.contact', { y: 40 });
    ST.create({ trigger: '.contact', start: 'top 92%', once: true, onEnter: () => gsap.to('.contact', { y: 0, opacity: 1, duration: 1, ease: 'expo.out' }) });
    addEventListener('load', () => ST.refresh(), { once: true });
}
