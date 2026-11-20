(() => {
  'use strict';
  const STORE_KEY = 'zin-wallet-vault-v2';
  const ITERATIONS = 310000;
  const encoder = new TextEncoder();
  const $ = id => document.getElementById(id);
  const gate = $('vault-gate');
  const dashboard = $('wallet-dashboard');
  const form = $('vault-form');
  const password = $('vault-password');
  const confirmPassword = $('vault-confirm');
  const gateMessage = $('vault-message');
  const sendMessage = $('send-message');
  let wallet = null;
  let vaultMode = 'create';

  const toBase64 = bytes => {
    let binary = '';
    bytes.forEach(byte => { binary += String.fromCharCode(byte); });
    return btoa(binary);
  };
  const fromBase64 = value => Uint8Array.from(atob(value), char => char.charCodeAt(0));
  const randomBytes = length => {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return bytes;
  };
  const format = cents => (cents / 100).toLocaleString(undefined, {minimumFractionDigits:2,maximumFractionDigits:2});
  const setMessage = (node, message, kind) => {
    node.textContent = message;
    node.className = 'form-message' + (kind ? ' ' + kind : '');
  };
  const deriveKey = async (secret, salt) => {
    const material = await crypto.subtle.importKey('raw', encoder.encode(secret), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:ITERATIONS,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
  };
  const makeDemoAddress = async () => {
    const digest = await crypto.subtle.digest('SHA-256', randomBytes(32));
    return 'ZIN-DEMO-' + Array.from(new Uint8Array(digest).slice(0,10), b => b.toString(16).padStart(2,'0')).join('').toUpperCase();
  };
  const saveEncrypted = async secret => {
    const salt = randomBytes(16);
    const iv = randomBytes(12);
    const key = await deriveKey(secret, salt);
    const plaintext = encoder.encode(JSON.stringify(wallet));
    const ciphertext = await crypto.subtle.encrypt({name:'AES-GCM',iv},key,plaintext);
    localStorage.setItem(STORE_KEY,JSON.stringify({version:2,iterations:ITERATIONS,salt:toBase64(salt),iv:toBase64(iv),ciphertext:toBase64(new Uint8Array(ciphertext))}));
  };
  const unlockEncrypted = async secret => {
    const envelope = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
    if (!envelope || envelope.version !== 2 || envelope.iterations !== ITERATIONS) throw new Error('This wallet vault is not recognised. Reset it and create a new demo vault.');
    const key = await deriveKey(secret,fromBase64(envelope.salt));
    const plaintext = await crypto.subtle.decrypt({name:'AES-GCM',iv:fromBase64(envelope.iv)},key,fromBase64(envelope.ciphertext));
    const parsed = JSON.parse(new TextDecoder().decode(plaintext));
    if (!parsed || typeof parsed.address !== 'string' || !Number.isSafeInteger(parsed.balanceCents) || parsed.balanceCents < 0 || !Array.isArray(parsed.transactions)) throw new Error('Wallet data could not be validated.');
    wallet = parsed;
  };
  const hasVault = () => {
    try { return Boolean(localStorage.getItem(STORE_KEY)); } catch (_) { return false; }
  };
  const showGate = () => {
    gate.classList.remove('hidden');
    dashboard.classList.add('hidden');
    $('gate-title').textContent = vaultMode === 'create' ? 'Create your demo wallet' : 'Unlock your demo wallet';
    $('gate-description').textContent = vaultMode === 'create'
      ? 'Protect this browser\'s simulated wallet data with a password. Your encrypted vault stays on this device.'
      : 'Enter the password you created for this browser\'s encrypted demo vault.';
    $('password-label').textContent = vaultMode === 'create' ? 'Create a password' : 'Wallet password';
    $('confirm-label').classList.toggle('hidden',vaultMode !== 'create');
    confirmPassword.classList.toggle('hidden',vaultMode !== 'create');
    confirmPassword.required = vaultMode === 'create';
    password.autocomplete = vaultMode === 'create' ? 'new-password' : 'current-password';
    $('vault-submit').innerHTML = vaultMode === 'create' ? 'Create encrypted vault <span>→</span>' : 'Unlock wallet <span>→</span>';
    $('switch-vault-mode').classList.toggle('hidden',!hasVault() && vaultMode === 'create');
    setMessage(gateMessage,'','');
  };
  const showWallet = () => {
    gate.classList.add('hidden');
    dashboard.classList.remove('hidden');
    $('wallet-balance').textContent = format(wallet.balanceCents);
    $('available-balance').textContent = format(wallet.balanceCents) + ' DEMO ZIN';
    $('wallet-id-short').textContent = wallet.address.slice(0,19) + '…';
    $('receive-address').textContent = wallet.address;
    renderActivity();
  };
  const renderActivity = () => {
    const list = $('activity-list');
    list.replaceChildren();
    if (!wallet.transactions.length) {
      const empty = document.createElement('div'); empty.className = 'empty-state';
      const icon = document.createElement('span'); icon.textContent = '↻';
      const title = document.createElement('b'); title.textContent = 'No activity yet';
      const description = document.createElement('p'); description.textContent = 'Your simulated transfers will appear here.';
      empty.append(icon,title,description); list.appendChild(empty); return;
    }
    wallet.transactions.slice().reverse().forEach(tx => {
      const row = document.createElement('div'); row.className = 'activity-item';
      const left = document.createElement('div'); left.className = 'activity-left';
      const icon = document.createElement('span'); icon.className = 'activity-icon'; icon.textContent = '↗';
      const copy = document.createElement('div'); copy.className = 'activity-copy';
      const title = document.createElement('b'); title.textContent = 'Sent to ' + tx.recipient;
      const date = document.createElement('small'); date.textContent = new Date(tx.time).toLocaleString();
      copy.append(title,date); left.append(icon,copy);
      const amount = document.createElement('span'); amount.className = 'activity-amount'; amount.textContent = '−' + format(tx.amountCents) + ' DEMO ZIN';
      row.append(left,amount); list.appendChild(row);
    });
  };
  const switchTab = name => {
    document.querySelectorAll('.action-button').forEach(button => button.classList.toggle('active',button.dataset.tab === name));
    ['send','receive','activity'].forEach(tab => $(tab + '-panel').classList.toggle('hidden',tab !== name));
  };

  $('switch-vault-mode').addEventListener('click',() => {
    vaultMode = 'unlock'; confirmPassword.value = ''; password.value = ''; showGate();
  });
  form.addEventListener('submit',async event => {
    event.preventDefault();
    if (!window.crypto || !crypto.subtle || !window.isSecureContext) {
      setMessage(gateMessage,'Secure WebCrypto is unavailable. Open this page over HTTPS in a supported browser.','error'); return;
    }
    const secret = password.value;
    if (secret.length < 8) { setMessage(gateMessage,'Use a password with at least 8 characters.','error'); return; }
    const submit = $('vault-submit'); submit.disabled = true;
    try {
      if (vaultMode === 'create') {
        if (secret !== confirmPassword.value) throw new Error('The passwords do not match.');
        if (hasVault()) throw new Error('A demo vault already exists here. Unlock it or reset it first.');
        wallet = {address:await makeDemoAddress(),balanceCents:100000,transactions:[]};
        await saveEncrypted(secret);
      } else {
        await unlockEncrypted(secret);
      }
      password.value = ''; confirmPassword.value = ''; showWallet();
    } catch (error) {
      wallet = null;
      const message = vaultMode === 'unlock' && error.name === 'OperationError' ? 'Incorrect password. Please try again.' : (error.message || 'Could not open the wallet vault.');
      setMessage(gateMessage,message,'error');
    } finally { submit.disabled = false; }
  });

  document.querySelectorAll('.action-button').forEach(button => button.addEventListener('click',() => switchTab(button.dataset.tab)));
  $('send-form').addEventListener('submit',async event => {
    event.preventDefault();
    if (!wallet) return;
    const recipient = $('recipient').value.trim();
    const raw = $('amount').value.trim();
    const amount = Number(raw);
    if (!recipient) { setMessage(sendMessage,'Enter a recipient label or demo ID.','error'); return; }
    if (!Number.isFinite(amount) || amount <= 0 || !/^\d+(\.\d{1,2})?$/.test(raw)) { setMessage(sendMessage,'Enter a valid amount with up to 2 decimal places.','error'); return; }
    const cents = Math.round(amount * 100);
    if (!Number.isSafeInteger(cents) || cents > wallet.balanceCents) { setMessage(sendMessage,'Insufficient demo balance.','error'); return; }
    const submit = event.submitter; if (submit) submit.disabled = true;
    try {
      const previousBalance = wallet.balanceCents;
      wallet.balanceCents -= cents;
      wallet.transactions.push({recipient:recipient.slice(0,64),amountCents:cents,time:new Date().toISOString()});
      try { await saveEncrypted(passwordForSession); }
      catch (error) { wallet.balanceCents = previousBalance; wallet.transactions.pop(); throw error; }
      showWallet(); $('recipient').value = ''; $('amount').value = '';
      setMessage(sendMessage,'Demo transfer recorded in your encrypted local vault. No blockchain transaction was created.','success');
    } catch (_) { setMessage(sendMessage,'Could not save this transfer. Your balance was not changed.','error'); }
    finally { if (submit) submit.disabled = false; }
  });

  let passwordForSession = null;
  const originalShowWallet = showWallet;
  const unlockSubmit = form;
  unlockSubmit.addEventListener('submit',() => { passwordForSession = password.value; },true);
  $('copy-address').addEventListener('click',async () => {
    try { await navigator.clipboard.writeText(wallet.address); setMessage($('receive-message'),'Demo address copied.','success'); }
    catch (_) { setMessage($('receive-message'),'Clipboard unavailable. Select and copy the address above.','error'); }
  });
  $('lock-wallet').addEventListener('click',() => { wallet = null; passwordForSession = null; password.value = ''; confirmPassword.value = ''; vaultMode = 'unlock'; showGate(); });
  const resetDialog = $('reset-dialog');
  $('reset-wallet').addEventListener('click',() => resetDialog.showModal());
  $('confirm-reset').addEventListener('click',() => {
    try { localStorage.removeItem(STORE_KEY); } catch (_) {}
    wallet = null; passwordForSession = null; vaultMode = 'create'; password.value = ''; confirmPassword.value = ''; showGate();
  });
  if (hasVault()) vaultMode = 'unlock';
  showGate();
})();