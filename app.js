/**
 * Fordele & Ulemper (Pros & Cons)
 * VSCode styled two-column decision maker with rich keyboard shortcuts
 */

(function () {
  'use strict';

  // --- TRANSLATIONS (Dansk & English) ---
  const I18N = {
    da: {
      appTitle: "Fordele & Ulemper",
      copyText: "Kopier",
      clearText: "Ryd",
      topicLabel: "Emne / Beslutning:",
      topicPlaceholder: "Hvad overvejer du? (f.eks. Nyt jobtilbud, Køb af elbil, Flytte...)",
      topicShortcutHint: "Tip: Tryk [Alt + T] for at fokusere emnet",
      shortcutColumnSwitch: "Alt + 1 / Alt + 2 eller Alt + ←/→: Skift kolonne",
      shortcutNewItem: "Enter: Nyt punkt",
      shortcutDelete: "Backspace i tomt felt: Slet",
      prosTitle: "Fordele",
      consTitle: "Ulemper",
      prosHeading: "Fordele",
      consHeading: "Ulemper",
      addProText: "Tilføj fordel",
      addConText: "Tilføj ulempe",
      prosEmptyHint: "Ingen fordele endnu. Klik på '+ Tilføj fordel' eller tryk Enter for at starte.",
      consEmptyHint: "Ingen ulemper endnu. Klik på '+ Tilføj ulempe' eller tryk Enter for at starte.",
      itemPlaceholderPro: "Skriv en fordel...",
      itemPlaceholderCon: "Skriv en ulempe...",
      statusNoTopic: "Intet emne angivet",
      statusSaved: "✓ Gemt lokalt",
      statusSaving: "Gemmer...",
      statusShortcuts: "⌨️ Tastaturgenveje (?)",
      toastCopied: "Kopieret til udklipsholder som Markdown!",
      toastCleared: "Alt indhold er ryddet.",
      confirmClear: "Er du sikker på, at du vil rydde hele emnet samt alle fordele og ulemper?",
      modalTitle: "Tastaturgenveje",
      modalColAction: "Handling",
      modalColShortcut: "Genvej",
      scNewItem: "Opret nyt punkt på næste linje",
      scDeleteEmpty: "Slet tomt punkt og hop til forrige",
      scSwitchColumns: "Skift mellem Fordele og Ulemper",
      scFocusProCol: "Fokusér / Hop til Fordele kolonne",
      scFocusConCol: "Fokusér / Hop til Ulemper kolonne",
      scFocusTopic: "Fokusér emne-feltet",
      scNavigateUpDown: "Navigér op og ned mellem punkter",
      scMoveUpDown: "Flyt punkt op / ned i listen",
      scCopyMarkdown: "Kopier alt som Markdown",
      scToggleHelp: "Åbn / Luk denne genvejshjælp",
      modalClose: "Forstået",
      themeDark: "VSCode Dark",
      themeLight: "VSCode Light"
    },
    en: {
      appTitle: "Pros & Cons",
      copyText: "Copy",
      clearText: "Clear",
      topicLabel: "Topic / Decision:",
      topicPlaceholder: "What are you considering? (e.g. New job offer, EV vs Gas, Relocation...)",
      topicShortcutHint: "Tip: Press [Alt + T] to focus topic",
      shortcutColumnSwitch: "Alt + 1 / Alt + 2 or Alt + ←/→: Switch column",
      shortcutNewItem: "Enter: New item",
      shortcutDelete: "Backspace in empty row: Delete",
      prosTitle: "Pros",
      consTitle: "Cons",
      prosHeading: "Pros",
      consHeading: "Cons",
      addProText: "Add pro",
      addConText: "Add con",
      prosEmptyHint: "No pros yet. Click '+ Add pro' or press Enter to begin.",
      consEmptyHint: "No cons yet. Click '+ Add con' or press Enter to begin.",
      itemPlaceholderPro: "Write a advantage / pro...",
      itemPlaceholderCon: "Write a disadvantage / con...",
      statusNoTopic: "No topic set",
      statusSaved: "✓ Saved locally",
      statusSaving: "Saving...",
      statusShortcuts: "⌨️ Keyboard Shortcuts (?)",
      toastCopied: "Copied to clipboard as Markdown!",
      toastCleared: "All content cleared.",
      confirmClear: "Are you sure you want to clear the topic and all pros and cons?",
      modalTitle: "Keyboard Shortcuts",
      modalColAction: "Action",
      modalColShortcut: "Shortcut",
      scNewItem: "Create new item on next line",
      scDeleteEmpty: "Delete empty item & jump to previous",
      scSwitchColumns: "Switch between Pros and Cons",
      scFocusProCol: "Focus Pros column",
      scFocusConCol: "Focus Cons column",
      scFocusTopic: "Focus topic field",
      scNavigateUpDown: "Navigate up and down items",
      scMoveUpDown: "Reorder item up / down",
      scCopyMarkdown: "Copy everything as Markdown",
      scToggleHelp: "Open / Close this shortcut help",
      modalClose: "Got it",
      themeDark: "VSCode Dark",
      themeLight: "VSCode Light"
    }
  };

  // --- STATE ---
  const STORAGE_KEY = 'dosanddonts_app_state_v1';
  let state = {
    lang: 'da',
    theme: 'dark',
    topic: '',
    pros: [
      { id: generateId(), text: '', weight: 1 }
    ],
    cons: [
      { id: generateId(), text: '', weight: 1 }
    ]
  };

  // Helper: unique ID generator
  function generateId() {
    return 'id_' + Math.random().toString(36).substring(2, 9);
  }

  // --- DOM ELEMENTS ---
  const htmlRoot = document.documentElement;
  const topicInput = document.getElementById('topicInput');
  const prosList = document.getElementById('prosList');
  const consList = document.getElementById('consList');
  const prosCount = document.getElementById('prosCount');
  const consCount = document.getElementById('consCount');
  const prosBadgeCount = document.getElementById('prosBadgeCount');
  const consBadgeCount = document.getElementById('consBadgeCount');
  const prosEmptyHint = document.getElementById('prosEmptyHint');
  const consEmptyHint = document.getElementById('consEmptyHint');

  const addProBtn = document.getElementById('addProBtn');
  const addConBtn = document.getElementById('addConBtn');
  const copyBtn = document.getElementById('copyBtn');
  const clearBtn = document.getElementById('clearBtn');
  const shortcutsBtn = document.getElementById('shortcutsBtn');
  const statusBarShortcutBtn = document.getElementById('statusBarShortcutBtn');
  const langToggleBtn = document.getElementById('langToggleBtn');
  const langFlag = document.getElementById('langFlag');
  const langLabel = document.getElementById('langLabel');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIconDark = document.getElementById('themeIconDark');
  const themeIconLight = document.getElementById('themeIconLight');

  const statusTopicText = document.getElementById('statusTopicText');
  const saveIndicator = document.getElementById('saveIndicator');
  const statusThemeLabel = document.getElementById('statusThemeLabel');
  const statusLangLabel = document.getElementById('statusLangLabel');

  const shortcutsModal = document.getElementById('shortcutsModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalOkBtn = document.getElementById('modalOkBtn');
  const toast = document.getElementById('toast');

  // --- INITIALIZATION ---
  function init() {
    loadSavedState();
    applyTheme(state.theme);
    applyLanguage(state.lang);
    renderAll();
    setupEventListeners();
  }

  // --- STORAGE ---
  function loadSavedState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        state = {
          ...state,
          ...parsed,
          pros: Array.isArray(parsed.pros) && parsed.pros.length > 0 ? parsed.pros : [{ id: generateId(), text: '', weight: 1 }],
          cons: Array.isArray(parsed.cons) && parsed.cons.length > 0 ? parsed.cons : [{ id: generateId(), text: '', weight: 1 }]
        };
      }
    } catch (e) {
      console.warn('Failed to load local storage state:', e);
    }
  }

  let saveTimeout;
  function triggerSave() {
    saveIndicator.textContent = I18N[state.lang].statusSaving;
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        saveIndicator.textContent = I18N[state.lang].statusSaved;
      } catch (e) {
        console.warn('Error saving state:', e);
      }
    }, 250);
  }

  // --- THEME ---
  function applyTheme(theme) {
    state.theme = theme;
    htmlRoot.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      themeIconDark.classList.remove('hidden');
      themeIconLight.classList.add('hidden');
      statusThemeLabel.textContent = I18N[state.lang].themeDark;
    } else {
      themeIconDark.classList.add('hidden');
      themeIconLight.classList.remove('hidden');
      statusThemeLabel.textContent = I18N[state.lang].themeLight;
    }
    triggerSave();
  }

  function toggleTheme() {
    const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  }

  // --- LANGUAGE (i18n) ---
  function applyLanguage(lang) {
    state.lang = lang;
    htmlRoot.setAttribute('lang', lang);
    const strings = I18N[lang];

    // Update text elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (strings[key]) {
        el.textContent = strings[key];
      }
    });

    // Inputs & Placeholders
    topicInput.placeholder = strings.topicPlaceholder;
    langFlag.textContent = lang === 'da' ? '🇩🇰' : '🇬🇧';
    langLabel.textContent = lang.toUpperCase();
    statusLangLabel.textContent = lang.toUpperCase();
    statusThemeLabel.textContent = state.theme === 'dark' ? strings.themeDark : strings.themeLight;

    updateStatusTopic();
    renderAllPlaceholders();
    triggerSave();
  }

  function toggleLanguage() {
    const nextLang = state.lang === 'da' ? 'en' : 'da';
    applyLanguage(nextLang);
  }

  function renderAllPlaceholders() {
    const strings = I18N[state.lang];
    document.querySelectorAll('#prosList .item-input').forEach(input => {
      input.placeholder = strings.itemPlaceholderPro;
    });
    document.querySelectorAll('#consList .item-input').forEach(input => {
      input.placeholder = strings.itemPlaceholderCon;
    });
  }

  // --- RENDERING ---
  function renderAll() {
    topicInput.value = state.topic || '';
    updateStatusTopic();

    renderColumn('pro');
    renderColumn('con');
    updateCounts();
  }

  function updateStatusTopic() {
    const strings = I18N[state.lang];
    if (state.topic && state.topic.trim().length > 0) {
      statusTopicText.textContent = state.topic;
    } else {
      statusTopicText.textContent = strings.statusNoTopic;
    }
  }

  function updateCounts() {
    const proFiltered = state.pros.filter(p => p.text.trim().length > 0);
    const conFiltered = state.cons.filter(c => c.text.trim().length > 0);

    prosCount.textContent = proFiltered.length;
    consCount.textContent = conFiltered.length;
    prosBadgeCount.textContent = `(${proFiltered.length})`;
    consBadgeCount.textContent = `(${conFiltered.length})`;

    if (state.pros.length === 0) {
      prosEmptyHint.classList.add('visible');
    } else {
      prosEmptyHint.classList.remove('visible');
    }

    if (state.cons.length === 0) {
      consEmptyHint.classList.add('visible');
    } else {
      consEmptyHint.classList.remove('visible');
    }
  }

  function renderColumn(type) {
    const container = type === 'pro' ? prosList : consList;
    const items = type === 'pro' ? state.pros : state.cons;
    const strings = I18N[state.lang];

    container.innerHTML = '';

    items.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = 'item-row';
      row.dataset.id = item.id;
      row.dataset.type = type;
      row.dataset.index = index;

      // Bullet
      const bullet = document.createElement('span');
      bullet.className = 'item-bullet';
      bullet.textContent = type === 'pro' ? '+' : '−';

      // Input field
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'item-input';
      input.value = item.text || '';
      input.placeholder = type === 'pro' ? strings.itemPlaceholderPro : strings.itemPlaceholderCon;
      input.autocomplete = 'off';

      // Actions container
      const actions = document.createElement('div');
      actions.className = 'item-actions';

      // Delete button
      const delBtn = document.createElement('button');
      delBtn.className = 'btn-item-delete';
      delBtn.title = strings.shortcutDelete;
      delBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      `;

      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteItem(type, item.id);
      });

      actions.appendChild(delBtn);

      row.appendChild(bullet);
      row.appendChild(input);
      row.appendChild(actions);

      container.appendChild(row);

      // Event listeners on input
      input.addEventListener('input', (e) => {
        item.text = e.target.value;
        updateCounts();
        triggerSave();
      });

      input.addEventListener('keydown', (e) => handleItemKeyDown(e, type, item.id, index));
    });
  }

  // --- ACTIONS ---
  function addItem(type, targetIndex = -1, focusNew = true) {
    const list = type === 'pro' ? state.pros : state.cons;
    const newItem = { id: generateId(), text: '', weight: 1 };

    if (targetIndex >= 0 && targetIndex < list.length) {
      list.splice(targetIndex + 1, 0, newItem);
    } else {
      list.push(newItem);
    }

    renderColumn(type);
    updateCounts();
    triggerSave();

    if (focusNew) {
      requestAnimationFrame(() => {
        const row = document.querySelector(`.item-row[data-id="${newItem.id}"]`);
        if (row) {
          const input = row.querySelector('.item-input');
          if (input) input.focus();
        }
      });
    }

    return newItem;
  }

  function deleteItem(type, itemId, moveFocusToAdjacent = false) {
    const list = type === 'pro' ? state.pros : state.cons;
    const index = list.findIndex(i => i.id === itemId);
    if (index === -1) return;

    list.splice(index, 1);

    // Keep at least one empty item if the list becomes empty
    if (list.length === 0) {
      list.push({ id: generateId(), text: '', weight: 1 });
    }

    renderColumn(type);
    updateCounts();
    triggerSave();

    if (moveFocusToAdjacent) {
      requestAnimationFrame(() => {
        const nextIndex = Math.max(0, index - 1);
        const nextItem = list[nextIndex];
        if (nextItem) {
          const row = document.querySelector(`.item-row[data-id="${nextItem.id}"]`);
          if (row) {
            const input = row.querySelector('.item-input');
            if (input) {
              input.focus();
              input.setSelectionRange(input.value.length, input.value.length);
            }
          }
        }
      });
    }
  }

  function moveItem(type, index, direction) {
    const list = type === 'pro' ? state.pros : state.cons;
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const [moved] = list.splice(index, 1);
    list.splice(targetIndex, 0, moved);

    renderColumn(type);
    triggerSave();

    requestAnimationFrame(() => {
      const row = document.querySelector(`.item-row[data-id="${moved.id}"]`);
      if (row) {
        const input = row.querySelector('.item-input');
        if (input) input.focus();
      }
    });
  }

  function focusColumn(type) {
    const list = type === 'pro' ? state.pros : state.cons;
    if (list.length === 0) {
      addItem(type, -1, true);
      return;
    }
    const firstItem = list[0];
    const row = document.querySelector(`.item-row[data-id="${firstItem.id}"]`);
    if (row) {
      const input = row.querySelector('.item-input');
      if (input) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      }
    }
  }

  function switchColumnFromCurrent(currentType, currentIndex) {
    const targetType = currentType === 'pro' ? 'con' : 'pro';
    const targetList = targetType === 'pro' ? state.pros : state.cons;

    if (targetList.length === 0) {
      addItem(targetType, -1, true);
      return;
    }

    const safeIndex = Math.min(currentIndex, targetList.length - 1);
    const targetItem = targetList[safeIndex];
    const row = document.querySelector(`.item-row[data-id="${targetItem.id}"]`);
    if (row) {
      const input = row.querySelector('.item-input');
      if (input) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      }
    }
  }

  // --- KEYBOARD SHORTCUT NAVIGATION ---
  function handleItemKeyDown(e, type, itemId, index) {
    const input = e.target;
    const list = type === 'pro' ? state.pros : state.cons;

    // 1. Enter: Create next item
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem(type, index, true);
      return;
    }

    // 2. Backspace in empty item: delete & hop to previous
    if (e.key === 'Backspace' && input.value.trim() === '' && list.length > 1) {
      e.preventDefault();
      deleteItem(type, itemId, true);
      return;
    }

    // 3. Tab or Alt + Left / Right: Switch column
    if (e.key === 'Tab') {
      e.preventDefault();
      switchColumnFromCurrent(type, index);
      return;
    }

    if (e.altKey && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
      e.preventDefault();
      switchColumnFromCurrent(type, index);
      return;
    }

    // 4. Alt + Up / Down: Reorder items
    if (e.altKey && e.key === 'ArrowUp') {
      e.preventDefault();
      moveItem(type, index, -1);
      return;
    }

    if (e.altKey && e.key === 'ArrowDown') {
      e.preventDefault();
      moveItem(type, index, 1);
      return;
    }

    // 5. Arrow Up / Down: Navigate list
    if (e.key === 'ArrowUp') {
      const isCaretAtStart = input.selectionStart === 0 && input.selectionEnd === 0;
      if (isCaretAtStart && index > 0) {
        e.preventDefault();
        const prevItem = list[index - 1];
        const prevRow = document.querySelector(`.item-row[data-id="${prevItem.id}"]`);
        if (prevRow) {
          const prevInput = prevRow.querySelector('.item-input');
          if (prevInput) {
            prevInput.focus();
            prevInput.setSelectionRange(prevInput.value.length, prevInput.value.length);
          }
        }
      }
    }

    if (e.key === 'ArrowDown') {
      const isCaretAtEnd = input.selectionStart === input.value.length && input.selectionEnd === input.value.length;
      if (isCaretAtEnd && index < list.length - 1) {
        e.preventDefault();
        const nextItem = list[index + 1];
        const nextRow = document.querySelector(`.item-row[data-id="${nextItem.id}"]`);
        if (nextRow) {
          const nextInput = nextRow.querySelector('.item-input');
          if (nextInput) {
            nextInput.focus();
            nextInput.setSelectionRange(nextInput.value.length, nextInput.value.length);
          }
        }
      }
    }
  }

  // --- GLOBAL KEYBOARD SHORTCUTS ---
  function handleGlobalKeyDown(e) {
    // Check if modal is open
    const isModalOpen = !shortcutsModal.classList.contains('hidden');

    if (e.key === 'Escape') {
      if (isModalOpen) {
        closeShortcutsModal();
      }
      return;
    }

    // Alt + 1: Jump to Pros
    if (e.altKey && (e.key === '1' || e.code === 'Digit1')) {
      e.preventDefault();
      focusColumn('pro');
      return;
    }

    // Alt + 2: Jump to Cons
    if (e.altKey && (e.key === '2' || e.code === 'Digit2')) {
      e.preventDefault();
      focusColumn('con');
      return;
    }

    // Alt + T: Focus Topic
    if (e.altKey && (e.key === 't' || e.key === 'T')) {
      e.preventDefault();
      topicInput.focus();
      topicInput.select();
      return;
    }

    // Ctrl + Shift + C: Copy markdown
    if (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
      e.preventDefault();
      copyAsMarkdown();
      return;
    }

    // '?' toggle help if not focused in an input
    const activeTagName = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
    const isEditing = activeTagName === 'input' || activeTagName === 'textarea';

    if (e.key === '?' && !isEditing) {
      e.preventDefault();
      openShortcutsModal();
      return;
    }
  }

  // --- COPY AS MARKDOWN ---
  function copyAsMarkdown() {
    const strings = I18N[state.lang];
    const topicHeader = state.topic.trim() ? `# ${state.topic.trim()}` : `# ${strings.appTitle}`;
    
    const prosTexts = state.pros
      .map(p => p.text.trim())
      .filter(t => t.length > 0)
      .map(t => `- ${t}`);

    const consTexts = state.cons
      .map(c => c.text.trim())
      .filter(t => t.length > 0)
      .map(t => `- ${t}`);

    let md = `${topicHeader}\n\n`;
    md += `## ${strings.prosHeading} (${prosTexts.length})\n`;
    md += prosTexts.length > 0 ? prosTexts.join('\n') + '\n\n' : `_${strings.prosEmptyHint}_\n\n`;
    md += `## ${strings.consHeading} (${consTexts.length})\n`;
    md += consTexts.length > 0 ? consTexts.join('\n') + '\n' : `_${strings.consEmptyHint}_\n`;

    navigator.clipboard.writeText(md).then(() => {
      showToast(strings.toastCopied);
    }).catch(err => {
      console.error('Clipboard copy failed:', err);
      // Fallback
      showToast('Kopiering mislykkedes.');
    });
  }

  function clearAll() {
    const strings = I18N[state.lang];
    if (confirm(strings.confirmClear)) {
      state.topic = '';
      state.pros = [{ id: generateId(), text: '', weight: 1 }];
      state.cons = [{ id: generateId(), text: '', weight: 1 }];
      renderAll();
      triggerSave();
      showToast(strings.toastCleared);
      topicInput.focus();
    }
  }

  // --- MODAL ---
  function openShortcutsModal() {
    shortcutsModal.classList.remove('hidden');
    modalOkBtn.focus();
  }

  function closeShortcutsModal() {
    shortcutsModal.classList.add('hidden');
  }

  // --- TOAST ---
  let toastTimer;
  function showToast(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.remove('hidden');
    toastTimer = setTimeout(() => {
      toast.classList.add('hidden');
    }, 2500);
  }

  // --- EVENT LISTENERS ---
  function setupEventListeners() {
    // Topic input
    topicInput.addEventListener('input', (e) => {
      state.topic = e.target.value;
      updateStatusTopic();
      triggerSave();
    });

    topicInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        focusColumn('pro');
      }
    });

    // Column add buttons
    addProBtn.addEventListener('click', () => addItem('pro', -1, true));
    addConBtn.addEventListener('click', () => addItem('con', -1, true));

    // Top action buttons
    copyBtn.addEventListener('click', copyAsMarkdown);
    clearBtn.addEventListener('click', clearAll);
    langToggleBtn.addEventListener('click', toggleLanguage);
    themeToggleBtn.addEventListener('click', toggleTheme);

    // Shortcuts modal triggers
    shortcutsBtn.addEventListener('click', openShortcutsModal);
    statusBarShortcutBtn.addEventListener('click', openShortcutsModal);
    closeModalBtn.addEventListener('click', closeShortcutsModal);
    modalOkBtn.addEventListener('click', closeShortcutsModal);

    shortcutsModal.addEventListener('click', (e) => {
      if (e.target === shortcutsModal) {
        closeShortcutsModal();
      }
    });

    // Global keyboard listener
    window.addEventListener('keydown', handleGlobalKeyDown);
  }

  // Start app
  init();
})();

