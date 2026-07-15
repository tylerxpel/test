/* XPEL Signature Generator — application logic */
/* Requires assets.js to be loaded first       */

const APPLE_URL  = 'https://apps.apple.com/pl/app/xpel/id6477790775';
const ANDROID_URL = 'https://play.google.com/store/apps/details?id=com.xpel.mobileapp';

const state = {
  name: '',
  title: '',
  phone: '',
  email: '',
  website: 'xpel.com',
  showAppLinks: false
};

/* ─── Wizard ─────────────────────────────────────────────────────── */
let currentPage = 1;

const $ = id => document.getElementById(id);
const previewFrame = $('preview-frame');
const plaintextPreviewEl = $('plaintext-preview');
const toast = $('toast');

/* Set header logo from embedded asset */
$('header-logo').src = ASSETS.logoLight;

function showPage(n) {
  n = Math.max(1, Math.min(4, n));
  currentPage = n;

  document.querySelectorAll('.page').forEach((p, i) => {
    p.classList.toggle('active', i + 1 === n);
  });

  document.querySelectorAll('.step').forEach((s, i) => {
    const sn = i + 1;
    s.classList.toggle('active', sn === n);
    s.classList.toggle('done', sn < n);
  });

  if (n >= 2) render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* Allow clicking completed steps */
document.querySelectorAll('.step').forEach(s => {
  const go = () => {
    const t = parseInt(s.dataset.step, 10);
    if (t < currentPage) showPage(t);
  };
  s.addEventListener('click', go);
  s.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') go(); });
});

$('next-1').addEventListener('click', () => showPage(2));
$('back-2').addEventListener('click', () => showPage(1));
$('next-2').addEventListener('click', () => showPage(3));
$('back-3').addEventListener('click', () => showPage(2));
$('next-3').addEventListener('click', () => showPage(4));
$('back-4').addEventListener('click', () => showPage(3));

/* ─── Utilities ─────────────────────────────────────────────────── */
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  })[c]);
}

function telHref(phone) {
  return 'tel:' + String(phone || '').replace(/[^\d+]/g, '');
}

function urlHref(url) {
  url = String(url || '').trim();
  if (!url) return '#';
  if (/^https?:\/\//i.test(url)) return url;
  return 'https://' + url;
}

function generateSignature(s) {
  // Light mode is now the only appearance (dark mode option removed)
  const bg           = '#FFFFFD';
  const nameColor    = '#2d2d2d';
  const titleColor   = '#2d2d2d';
  const contactColor = '#2d2d2d';
  const colorScheme  = 'only light';
  const logo    = ASSETS.logoDark;
  const divider = ASSETS.dividerLight;

  // Layout values (compact is now the only signature size)
  const cardPad     = '20px';
  const logoW       = '110';
  const logoH       = '28';   // native logo asset is 1020x262; 110px wide -> ~28px tall
  const divH        = '72';
  const nameSize    = '22';
  const nameMgn     = '3px';
  const nameLh      = '24';
  const titleSize   = '9';
  const titleMgn    = '8px';
  const titleLh     = '13';
  const contactSize = '11';
  const contactGap  = '2px';
  const contactLh   = '15';
  const diamondsW   = '125';
  const diamondsH   = '103';  // native diamonds asset is 800x656; 125px wide -> ~103px tall

  const name    = escapeHtml(s.name);
  const title   = escapeHtml(s.title.toUpperCase());
  const phone   = escapeHtml(s.phone);
  const email   = escapeHtml(s.email);
  const website = escapeHtml(s.website);

  const hasPhone = (s.phone || '').trim().length > 0;
  const phoneLine = hasPhone
    ? `<p class="xsig-contact" style="margin:0 0 ${contactGap} 0;padding:0;font-size:${contactSize}px;color:${contactColor};mso-color-alt:${contactColor};font-family:Helvetica,Arial,sans-serif;line-height:${contactLh}px;mso-line-height-rule:exactly;"><a href="${telHref(s.phone)}" style="color:${contactColor};mso-color-alt:${contactColor};text-decoration:none;"><span style="color:${contactColor};mso-color-alt:${contactColor};text-decoration:none;">${phone}</span></a></p>`
    : '';

  // Mobile app block now renders as its own full-width row beneath the
  // main signature block, left-aligned flush with the disclaimer text
  // (rather than stacked inside the 239px content column, which used to
  // add unwanted height to the primary card).
  const appLinksRowContent = s.showAppLinks
    ? `<p class="xsig-contact" style="margin:0;padding:0;font-size:${contactSize}px;color:${contactColor};mso-color-alt:${contactColor};font-family:Helvetica,Arial,sans-serif;line-height:${contactLh}px;mso-line-height-rule:exactly;">Download the <strong style="font-weight:700;color:${contactColor};mso-color-alt:${contactColor};">XPEL Mobile App</strong> Today:&nbsp;&nbsp;<a href="${APPLE_URL}" style="color:${contactColor};mso-color-alt:${contactColor};text-decoration:none;"><strong style="font-weight:700;color:${contactColor};mso-color-alt:${contactColor};">APPLE</strong></a><span style="color:${contactColor};mso-color-alt:${contactColor};">&nbsp;|&nbsp;</span><a href="${ANDROID_URL}" style="color:${contactColor};mso-color-alt:${contactColor};text-decoration:none;"><strong style="font-weight:700;color:${contactColor};mso-color-alt:${contactColor};">ANDROID</strong></a></p>`
    : '&nbsp;';
  const appLinksRowPad = s.showAppLinks ? `4px 0 6px 0` : `0`;
  const appLinksFontSize = s.showAppLinks ? '' : 'font-size:0;line-height:0;';

  // iOS Mail / Apple Mail + Outlook mobile color lock
  const styleBlock = `<style type="text/css">
@media screen and (prefers-color-scheme:dark){
  .xsig-card{background-color:${bg}!important}
  .xsig-name{color:${nameColor}!important}
  .xsig-title{color:${titleColor}!important}
  .xsig-contact,.xsig-contact a{color:${contactColor}!important}
}
@media screen and (prefers-color-scheme:light){
  .xsig-card{background-color:${bg}!important}
  .xsig-name{color:${nameColor}!important}
  .xsig-title{color:${titleColor}!important}
  .xsig-contact,.xsig-contact a{color:${contactColor}!important}
}
[data-ogsc] .xsig-card,[data-ogsb] .xsig-card{background-color:${bg}!important}
[data-ogsc] .xsig-name{color:${nameColor}!important}
[data-ogsc] .xsig-title{color:${titleColor}!important}
[data-ogsc] .xsig-contact,[data-ogsc] .xsig-contact a{color:${contactColor}!important}
</style>`;

  return styleBlock + `<table cellpadding="0" cellspacing="0" border="0" width="600" bgcolor="${bg}" class="xsig-card" role="presentation" style="border-collapse:collapse;background-color:${bg};color-scheme:${colorScheme};mso-table-lspace:0pt;mso-table-rspace:0pt;font-family:Helvetica,Arial,sans-serif;width:600px;table-layout:fixed;">
  <tr>
    <td width="30" style="padding:0;width:30px;font-size:0;line-height:0;">&nbsp;</td>
    <td width="145" valign="middle" align="center" style="padding:${cardPad} 0;width:145px;font-size:0;line-height:0;">
      <img src="${logo}" width="${logoW}" height="${logoH}" alt="XPEL" style="display:block;border:0;outline:none;text-decoration:none;width:${logoW}px;height:${logoH}px;">
    </td>
    <td width="30" style="padding:0;width:30px;font-size:0;line-height:0;">&nbsp;</td>
    <td width="1" valign="middle" align="center" style="padding:0;width:1px;font-size:0;line-height:0;mso-line-height-rule:exactly;">
      <table cellpadding="0" cellspacing="0" border="0" align="center" role="presentation" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
        <tr>
          <td height="${divH}" style="height:${divH}px;width:1px;padding:0;font-size:0;line-height:0;mso-line-height-rule:exactly;">
            <img src="${divider}" width="1" height="${divH}" alt="" border="0" style="display:block;width:1px;height:${divH}px;border:0;outline:none;text-decoration:none;">
          </td>
        </tr>
      </table>
    </td>
    <td width="30" style="padding:0;width:30px;font-size:0;line-height:0;">&nbsp;</td>
    <td width="239" valign="middle" style="padding:${cardPad} 0;width:239px;font-family:Helvetica,Arial,sans-serif;">
      <p class="xsig-name" style="margin:0 0 ${nameMgn} 0;padding:0;font-size:${nameSize}px;font-weight:700;color:${nameColor};mso-color-alt:${nameColor};line-height:${nameLh}px;mso-line-height-rule:exactly;font-family:Helvetica,Arial,sans-serif;word-break:break-word;">${name}</p>
      <p class="xsig-title" style="margin:0 0 ${titleMgn} 0;padding:0;font-size:${titleSize}px;color:${titleColor};mso-color-alt:${titleColor};font-weight:400;line-height:${titleLh}px;mso-line-height-rule:exactly;font-family:Helvetica,Arial,sans-serif;">${title}</p>
      ${phoneLine}
      <p class="xsig-contact" style="margin:0 0 ${contactGap} 0;padding:0;font-size:${contactSize}px;color:${contactColor};mso-color-alt:${contactColor};font-family:Helvetica,Arial,sans-serif;line-height:${contactLh}px;mso-line-height-rule:exactly;"><a href="mailto:${email}" style="color:${contactColor};mso-color-alt:${contactColor};text-decoration:none;"><span style="color:${contactColor};mso-color-alt:${contactColor};text-decoration:none;">${email}</span></a></p>
      <p class="xsig-contact" style="margin:0;padding:0;font-size:${contactSize}px;color:${contactColor};mso-color-alt:${contactColor};font-family:Helvetica,Arial,sans-serif;line-height:${contactLh}px;mso-line-height-rule:exactly;"><a href="${urlHref(s.website)}" style="color:${contactColor};mso-color-alt:${contactColor};text-decoration:none;"><span style="color:${contactColor};mso-color-alt:${contactColor};text-decoration:none;">${website}</span></a></p>
    </td>
    <td width="125" valign="bottom" align="right" style="padding:0;width:125px;font-size:0;line-height:0;">
      <img src="${ASSETS.diamonds}" width="${diamondsW}" height="${diamondsH}" alt="" style="display:block;border:0;outline:none;text-decoration:none;width:${diamondsW}px;height:${diamondsH}px;">
    </td>
  </tr>
  <tr>
    <td colspan="7" bgcolor="${bg}" class="xsig-card" style="padding:${appLinksRowPad};${appLinksFontSize}font-family:Helvetica,Arial,sans-serif;">
      ${appLinksRowContent}
    </td>
  </tr>
</table>
<table cellpadding="0" cellspacing="0" border="0" width="600" role="presentation" style="border-collapse:collapse;width:600px;color-scheme:only light;mso-table-lspace:0pt;mso-table-rspace:0pt;font-family:Helvetica,Arial,sans-serif;background-color:#ffffff;">
  <tr style="background-color:#ffffff;">
    <td bgcolor="#ffffff" style="padding:10px 0 0 0;font-size:10px;line-height:1.5;color:#000000;font-family:Helvetica,Arial,sans-serif;background-color:#ffffff;mso-line-height-rule:exactly;">
      Notice from XPEL Inc: This message may contain information that is proprietary, confidential, and not to be disclosed. It is intended for use only by the person to whom it is addressed. If you have received this in error, please do not forward or use this information and notify the sender immediately. Neither this information block nor the typed name of the sender constitutes an electronic signature unless expressly stated otherwise.
    </td>
  </tr>
</table>`;
}

function generatePlainTextSignature(s) {
  // Outlook Mobile signatures don't sync from desktop and are error-prone
  // to paste as rich HTML, so this is a single simplified plain-text
  // signature used for both iOS and Android — no logo/table, and clearly
  // marked as a mobile signature via the closing line.
  const name    = (s.name || '').trim();
  const title   = (s.title || '').trim().toUpperCase();
  const phone   = (s.phone || '').trim();
  const email   = (s.email || '').trim();
  const website = (s.website || '').trim();

  const lines = [];
  if (name) lines.push(name);
  if (title) lines.push(title);
  if ((name || title) && (phone || email || website)) lines.push('');
  if (phone) lines.push(phone);
  if (email) lines.push(email);
  if (website) lines.push(website);

  if (s.showAppLinks) {
    lines.push('');
    lines.push('Download the XPEL Mobile App Today:');
    lines.push(`Apple: ${APPLE_URL}`);
    lines.push(`Android: ${ANDROID_URL}`);
  }

  lines.push('');
  lines.push('Sent via XPEL Mobile');

  return lines.join('\n');
}


function renderPreview(html, frame, frameWidth) {
  const cardBg = '#FFFFFD';
  // Two-tone background: top portion matches the card color so it sits
  // seamlessly; white below where the disclaimer renders. We measure the
  // actual card height after write so the transition is correct even when
  // optional rows (e.g. phone) are omitted.
  const doc = frame.contentDocument;
  doc.open();
  doc.write(`<!doctype html><html><head><meta charset="utf-8"><style>
    html,body{margin:0;padding:0;}
    body{
      min-width:${frameWidth}px;
      padding:0;
      background:${cardBg};
      font-family:Helvetica,Arial,sans-serif;
    }
    body>table{margin:0 auto;}
    a{color:inherit;text-decoration:none;}
  </style></head><body>${html}</body></html>`);
  doc.close();

  // Size iframe to its content, and apply the two-tone gradient based on
  // the actual card height (which varies if the phone line is omitted).
  requestAnimationFrame(() => {
    try {
      const tables = doc.body.getElementsByTagName('table');
      const cardHeight = tables.length ? Math.round(tables[0].getBoundingClientRect().height) : 217;
      doc.body.style.background = `linear-gradient(to bottom, ${cardBg} 0, ${cardBg} ${cardHeight}px, #ffffff ${cardHeight}px, #ffffff 100%)`;
      const h = doc.body.scrollHeight || 240;
      frame.style.height = h + 'px';
    } catch (e) { frame.style.height = '260px'; }
  });
}


function render() {
  try { renderPreview(generateSignature(state), previewFrame, 600); }
  catch (e) { console.error('Desktop preview failed:', e); }

  try { plaintextPreviewEl.textContent = generatePlainTextSignature(state) || 'Fill in your details on step 1 to see a preview here.'; }
  catch (e) { console.error('Plain-text preview failed:', e); }
}

/* ─── Toast ─────────────────────────────────────────────────────── */
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 4200);
}

/* ─── Form fields ────────────────────────────────────────────────── */
document.querySelectorAll('[data-field]').forEach(input => {
  const key = input.dataset.field;
  input.value = state[key] ?? '';
  input.addEventListener('input', () => {
    state[key] = input.value;
    if (currentPage >= 2) render();
  });
});

/* ─── Boolean toggle fields ─────────────────────────────────────── */
document.querySelectorAll('[data-bool-field]').forEach(input => {
  const key = input.dataset.boolField;
  input.checked = state[key] ?? false;
  input.addEventListener('change', () => {
    state[key] = input.checked;
    if (currentPage >= 2) render();
  });
});

/* ─── Install instructions: device / version filter (Web & Desktop) ── */
const installUI = { device: 'windows', version: 'new' };

function updateInstallCards() {
  document.querySelectorAll('.install-card[data-device]').forEach(card => {
    const matches = card.dataset.device === installUI.device && card.dataset.version === installUI.version;
    card.classList.toggle('is-hidden', !matches);
  });
}

document.querySelectorAll('.mode-btn[data-device]').forEach(btn => {
  btn.addEventListener('click', () => {
    installUI.device = btn.dataset.device;
    document.querySelectorAll('.mode-btn[data-device]').forEach(b => {
      b.classList.toggle('active', b.dataset.device === installUI.device);
    });
    updateInstallCards();
  });
});

document.querySelectorAll('.mode-btn[data-version]').forEach(btn => {
  btn.addEventListener('click', () => {
    installUI.version = btn.dataset.version;
    document.querySelectorAll('.mode-btn[data-version]').forEach(b => {
      b.classList.toggle('active', b.dataset.version === installUI.version);
    });
    updateInstallCards();
  });
});

updateInstallCards();

/* ─── Install instructions: mobile platform filter ───────────────── */
const mobileUI = { platform: 'ios' };

function updateMobileInstallCards() {
  document.querySelectorAll('.install-card[data-platform]').forEach(card => {
    card.classList.toggle('is-hidden', card.dataset.platform !== mobileUI.platform);
  });
}

document.querySelectorAll('.mode-btn[data-platform]').forEach(btn => {
  btn.addEventListener('click', () => {
    mobileUI.platform = btn.dataset.platform;
    document.querySelectorAll('.mode-btn[data-platform]').forEach(b => {
      b.classList.toggle('active', b.dataset.platform === mobileUI.platform);
    });
    updateMobileInstallCards();
  });
});

updateMobileInstallCards();

function copyRichViaExecCommand(html) {
  // Render the HTML into a hidden contenteditable, select it, run copy.
  // This older API path works from file:// origins and enterprise policies
  // that block the newer navigator.clipboard.write().
  const container = document.createElement('div');
  container.setAttribute('contenteditable', 'true');
  container.style.cssText = 'position:fixed;left:-99999px;top:0;opacity:0;pointer-events:none;width:600px;';
  container.innerHTML = html;
  document.body.appendChild(container);

  const range = document.createRange();
  range.selectNodeContents(container);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);

  let ok = false;
  try { ok = document.execCommand('copy'); } catch (_) { ok = false; }

  sel.removeAllRanges();
  document.body.removeChild(container);
  return ok;
}


function openManualCopyTab(html) {
  // Last resort: open a new tab with the rendered signature so the user
  // can select-all and copy from there using the OS clipboard.
  const doc = `<!doctype html><html><head><meta charset="utf-8"><title>XPEL Signature — manual copy</title>
<style>
  body{margin:0;padding:32px;background:#eee;font-family:Helvetica,Arial,sans-serif;color:#1a1a1a;}
  .notice{background:#FFB81C;padding:14px 18px;border-radius:6px;margin-bottom:24px;max-width:600px;font-size:14px;line-height:1.5;}
  .notice kbd{background:#1a1a1a;color:#fff;padding:2px 6px;border-radius:3px;font:12px ui-monospace,Menlo,Consolas,monospace;}
  .sig{max-width:600px;}
</style>
</head><body>
<div class="notice"><strong>Manual copy:</strong> click into the signature below, press <kbd>Ctrl</kbd>+<kbd>A</kbd> (or <kbd>⌘</kbd>+<kbd>A</kbd> on Mac) to select it, then <kbd>Ctrl</kbd>+<kbd>C</kbd> (or <kbd>⌘</kbd>+<kbd>C</kbd>) to copy. Paste into your Outlook signature editor.</div>
<div class="sig">${html}</div>
</body></html>`;
  try {
    const w = window.open('', '_blank');
    if (!w) return false;
    w.document.open();
    w.document.write(doc);
    w.document.close();
    return true;
  } catch (_) { return false; }
}


async function copyRichHtml(html, successMsg) {
  if (window.ClipboardItem && navigator.clipboard && navigator.clipboard.write) {
    try {
      await navigator.clipboard.write([new ClipboardItem({
        'text/html':  new Blob([html], { type: 'text/html' }),
        'text/plain': new Blob([html], { type: 'text/plain' }),
      })]);
      showToast(successMsg);
      return;
    } catch (_) { /* fall through */ }
  }

  if (copyRichViaExecCommand(html)) {
    showToast(successMsg);
    return;
  }

  if (openManualCopyTab(html)) {
    showToast('Opened in a new tab — select and copy the signature from there');
    return;
  }

  showToast('Copy blocked — click the preview, Ctrl+A, Ctrl+C, then paste into Outlook');
}

$('copy-rich').addEventListener('click', () => {
  copyRichHtml(generateSignature(state), 'Copied — paste into your Outlook signature editor');
});

$('copy-mobile').addEventListener('click', async () => {
  const text = generatePlainTextSignature(state);
  const successMsg = 'Copied — paste into your Outlook Mobile signature field';

  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      showToast(successMsg);
      return;
    } catch (_) { /* fall through */ }
  }

  // Fallback: hidden textarea + execCommand for older/blocked contexts
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;left:-99999px;top:0;opacity:0;';
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try { ok = document.execCommand('copy'); } catch (_) { ok = false; }
  document.body.removeChild(ta);

  if (ok) {
    showToast(successMsg);
  } else {
    showToast('Copy blocked — click the text above, Ctrl+A, Ctrl+C, then paste into Outlook');
  }
});

/* ─── Initial render ─────────────────────────────────────────────── */
window.addEventListener('load', () => { render(); });
render();
