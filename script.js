const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav');
if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const isOpen = navigation.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    menuButton.textContent = isOpen ? '×' : '☰';
  });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    menuButton.textContent = '☰';
  }));
}
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Browser-only ZIN wallet simulation. It never creates keys or contacts a network.
(() => {
  const form = document.getElementById('wallet-send-form');
  if (!form) return;
  const balanceNode = document.getElementById('wallet-balance');
  const addressNode = document.getElementById('wallet-address');
  const historyNode = document.getElementById('wallet-history');
  const messageNode = document.getElementById('wallet-message');
  const storageKey = 'zin-demo-wallet-v1';
  const makeId = () => {
    const bytes = new Uint8Array(4);
    if (window.crypto && window.crypto.getRandomValues) window.crypto.getRandomValues(bytes);
    else for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
    return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  };
  const freshWallet = () => ({ address: 'ZIN-DEMO-' + makeId(), balanceCents: 100000, transactions: [] });
  const loadWallet = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      if (saved && typeof saved.address === 'string' && Number.isSafeInteger(saved.balanceCents) &&
          saved.balanceCents >= 0 && Array.isArray(saved.transactions)) return saved;
    } catch (_) { /* Start a clean demo if browser storage is unavailable or invalid. */ }
    return freshWallet();
  };
  let wallet = loadWallet();
  const saveWallet = () => {
    try { localStorage.setItem(storageKey, JSON.stringify(wallet)); }
    catch (_) { messageNode.textContent = 'Browser storage is unavailable; this demo may reset when you leave.'; }
  };
  const money = cents => (cents / 100).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2});
  const render = () => {
    balanceNode.innerHTML = money(wallet.balanceCents) + ' <small>DEMO ZIN</small>';
    addressNode.textContent = wallet.address;
    historyNode.replaceChildren();
    if (!wallet.transactions.length) {
      const empty = document.createElement('p');
      empty.className = 'wallet-empty';
      empty.textContent = 'No demo transactions yet. Try sending a small amount above.';
      historyNode.appendChild(empty);
      return;
    }
    wallet.transactions.slice().reverse().forEach(tx => {
      const row = document.createElement('div'); row.className = 'wallet-transaction';
      const details = document.createElement('div');
      const title = document.createElement('strong'); title.textContent = 'Demo send to ' + tx.recipient;
      const date = document.createElement('small'); date.textContent = new Date(tx.time).toLocaleString();
      details.append(title, date);
      const amount = document.createElement('span'); amount.className = 'amount'; amount.textContent = '−' + money(tx.amountCents) + ' DEMO ZIN';
      row.append(details, amount); historyNode.appendChild(row);
    });
  };
  form.addEventListener('submit', event => {
    event.preventDefault();
    const recipient = String(form.elements.recipient.value || '').trim();
    const amountText = String(form.elements.amount.value || '').trim();
    const amount = Number(amountText);
    if (!recipient) { messageNode.textContent = 'Enter a recipient label or demo ID.'; messageNode.className = 'wallet-message error'; return; }
    if (!Number.isFinite(amount) || amount <= 0 || !/^\d+(\.\d{1,2})?$/.test(amountText)) {
      messageNode.textContent = 'Enter a valid amount with up to 2 decimal places.'; messageNode.className = 'wallet-message error'; return;
    }
    const cents = Math.round(amount * 100);
    if (!Number.isSafeInteger(cents) || cents > wallet.balanceCents) {
      messageNode.textContent = 'Insufficient demo balance.'; messageNode.className = 'wallet-message error'; return;
    }
    wallet.balanceCents -= cents;
    wallet.transactions.push({ recipient: recipient.slice(0, 48), amountCents: cents, time: new Date().toISOString() });
    saveWallet(); render(); form.reset();
    messageNode.textContent = 'Demo transfer simulated. No blockchain transaction was created.';
    messageNode.className = 'wallet-message success';
  });
  document.getElementById('copy-address').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(wallet.address);
      messageNode.textContent = 'Demo receiving ID copied.';
    } catch (_) { messageNode.textContent = 'Copy is unavailable; select the demo ID manually.'; }
    messageNode.className = 'wallet-message';
  });
  document.getElementById('wallet-reset').addEventListener('click', () => {
    wallet = freshWallet(); saveWallet(); render(); form.reset();
    messageNode.textContent = 'Demo wallet reset to 1,000.00 demo credits.';
    messageNode.className = 'wallet-message';
  });
  render();
})();
