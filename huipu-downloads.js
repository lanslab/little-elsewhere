// Little Elsewhere — HuiPu card: download panel + "put on the desk" interaction.
// Clicking the HuiPu card swaps the draggable figure on the computer screen to the
// duo; clicking the Pupu card swaps it back. Download buttons keep working as links.
(() => {
  const cfg = window.HUIPU_RELEASE_LINKS || {};
  const icons = {
    windows: `<svg class="pupu-download-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 5.2 10.7 4v7.2H3V5.2Zm8.7-1.4L21 2.4v8.8h-9.3V3.8ZM3 12.2h7.7v7.2L3 18.2v-6Zm8.7 0H21v8.8l-9.3-1.4v-7.4Z"/></svg>`,
    mac: `<svg class="pupu-download-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.8 12.7c0-2.1 1.7-3.1 1.8-3.2a4 4 0 0 0-3.1-1.7c-1.3-.1-2.5.8-3.2.8-.7 0-1.7-.8-2.8-.8-1.4 0-2.8.9-3.5 2.2-1.5 2.7-.4 6.7 1.1 8.8.7 1 1.6 2.2 2.7 2.1 1.1 0 1.5-.7 2.8-.7s1.7.7 2.8.7c1.2 0 1.9-1 2.6-2 .8-1.2 1.2-2.4 1.2-2.5-.1 0-2.4-1-2.4-3.7ZM14.6 6.4c.6-.8 1-1.9.9-3-.9 0-2 .6-2.7 1.3-.6.7-1.1 1.8-.9 2.9 1 .1 2-.5 2.7-1.2Z"/></svg>`,
    quark: `<svg class="pupu-download-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M7.2 17.5h9.7a3.6 3.6 0 0 0 .4-7.2A5.5 5.5 0 0 0 7 9.2a4.2 4.2 0 0 0 .2 8.3Z"/><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M12 10.5v5m-2.5-2.5h5"/></svg>`
  };

  function makeDownload(label, url, icon, wide = false) {
    const el = document.createElement(url ? 'a' : 'span');
    el.className = `pupu-download-btn${wide ? ' pupu-download-wide' : ''}${url ? '' : ' is-pending'}`;
    if (url) {
      el.href = url;
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
      el.setAttribute('aria-label', `下载 HuiPu ${label}`);
    }
    el.innerHTML = `${icon}<span>${url ? label : `${label} · 待发布`}</span>`;
    return el;
  }

  const cardByTitle = (title) => [...document.querySelectorAll('.card')]
    .find((card) => card.querySelector('.card-title')?.textContent.trim() === title);

  function mountCard() {
    const card = cardByTitle('Next');
    if (!card) return null;
    card.classList.add('has-release', 'huipu-card');
    card.querySelector('.card-title').innerHTML = 'HuiPu <span class="huipu-badge">Beta</span>';
    card.querySelector('.card-note')?.remove();

    const body = card.querySelector('.card-body');
    body.innerHTML = '';
    const img = document.createElement('img');
    img.className = 'card-pupu card-huipu';
    img.src = './huipu/huipu-card.webp';
    img.alt = 'HuiPu：布布搂着普普一起自拍';
    body.appendChild(img);

    const panel = document.createElement('div');
    panel.className = 'pupu-release-panel';
    const label = document.createElement('p');
    label.className = 'pupu-release-label';
    label.textContent = 'Download';
    const row = document.createElement('div');
    row.className = 'pupu-download-row';
    row.append(
      makeDownload('Windows', cfg.windows, icons.windows),
      makeDownload('Mac', cfg.mac, icons.mac),
      makeDownload('夸克网盘', cfg.mirror, icons.quark, true)
    );
    panel.append(label, row);
    body.insertAdjacentElement('afterend', panel);
    return card;
  }

  function mountStageSwitch(huipuCard) {
    const pupuCard = cardByTitle('Pupu');
    const pet = document.getElementById('heroPet');
    if (!pupuCard || !huipuCard || !pet) return;
    const looks = {
      pupu: { src: pet.getAttribute('src'), alt: pet.alt || 'Pupu', duo: false },
      huipu: { src: './huipu/huipu-hero.webp', alt: 'HuiPu', duo: true }
    };
    new Image().src = looks.huipu.src; // preload so the swap is instant

    function show(key) {
      const look = looks[key];
      pet.src = look.src;
      pet.alt = look.alt;
      pet.classList.toggle('duo', look.duo);
      // Back to the middle of the screen, like the double-click reset.
      pet.style.left = '52%';
      pet.style.top = '45%';
      pet.style.transform = 'translate(-50%,-50%)';
      pupuCard.classList.toggle('on-stage', key === 'pupu');
      huipuCard.classList.toggle('on-stage', key === 'huipu');
    }

    for (const [card, key] of [[pupuCard, 'pupu'], [huipuCard, 'huipu']]) {
      card.classList.add('stage-switch');
      card.title = '点击，让 TA 出现在上面的屏幕里';
      card.addEventListener('click', (e) => {
        if (e.target.closest('a')) return; // download buttons stay plain links
        show(key);
      });
    }
    pupuCard.classList.add('on-stage');
  }

  function mount() {
    const card = mountCard();
    mountStageSwitch(card);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount, { once: true });
  } else {
    mount();
  }
})();
