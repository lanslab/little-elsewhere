(() => {
  const cfg = window.PUPU_RELEASE_LINKS || {};

  function makeDownload(label, url, primary = false) {
    const el = document.createElement(url ? 'a' : 'span');
    el.className = `pupu-download-btn${primary ? ' primary' : ''}${url ? '' : ' is-pending'}`;
    el.textContent = url ? label : `${label} · 待发布`;
    if (url) {
      el.href = url;
      el.target = '_blank';
      el.rel = 'noreferrer';
    }
    return el;
  }

  function makeSocial(label, url) {
    if (!url) return null;
    const a = document.createElement('a');
    a.className = 'pupu-social-link';
    a.href = url;
    a.target = '_blank';
    a.rel = 'noreferrer';
    a.textContent = label;
    return a;
  }

  function mount() {
    const card = [...document.querySelectorAll('.companion-card')]
      .find((item) => item.querySelector('h3')?.textContent.trim() === 'Pupu');
    if (!card) return;

    const bio = card.querySelector('.bio');
    if (!bio || bio.querySelector('.pupu-release-panel')) return;

    // Replace the original single Download Pupu link with platform-specific entry points.
    bio.querySelector('.download-hit')?.remove();

    const panel = document.createElement('div');
    panel.className = 'pupu-release-panel';

    const label = document.createElement('p');
    label.className = 'pupu-release-label';
    label.textContent = 'Download';

    const downloads = document.createElement('div');
    downloads.className = 'pupu-download-row';
    downloads.append(
      makeDownload('Windows', cfg.windows, true),
      makeDownload('macOS', cfg.mac),
      makeDownload('网盘 / Mirror', cfg.mirror)
    );

    const note = document.createElement('p');
    note.className = 'pupu-release-note';
    note.textContent = 'Choose your platform. The mirror is a backup download for users who prefer it.';

    panel.append(label, downloads, note);

    const socials = [
      makeSocial('GitHub', cfg.github),
      makeSocial('小红书', cfg.xiaohongshu)
    ].filter(Boolean);

    if (socials.length) {
      const socialBlock = document.createElement('div');
      socialBlock.className = 'pupu-social-block';
      const socialLabel = document.createElement('p');
      socialLabel.className = 'pupu-release-label';
      socialLabel.textContent = 'Follow Little Elsewhere';
      const socialRow = document.createElement('div');
      socialRow.className = 'pupu-social-row';
      socials.forEach((item) => socialRow.appendChild(item));
      socialBlock.append(socialLabel, socialRow);
      panel.appendChild(socialBlock);
    }

    bio.appendChild(panel);

    // Keep the install guide platform-neutral now that Windows and macOS are both supported.
    const steps = [...document.querySelectorAll('.step')];
    const installStep = steps.find((step) => step.querySelector('strong')?.textContent.includes('1.'));
    const launchStep = steps.find((step) => step.querySelector('strong')?.textContent.includes('2.'));
    const installText = installStep?.querySelector('p');
    const launchText = launchStep?.querySelector('p');

    if (installText) {
      installText.textContent = '在 Pupu 卡片选择 Windows、macOS 或网盘备用下载。Windows 安装包和 macOS DMG 均以本页官方入口为准。';
    }
    if (launchText) {
      launchText.textContent = 'Windows 安装后直接启动；macOS 打开 DMG 后将 Pupu 拖入 Applications。启动后，右键托盘图标可切换状态和调整大小。';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount, { once: true });
  } else {
    mount();
  }
})();
