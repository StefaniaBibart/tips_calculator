document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const billAmountInput = document.getElementById("billAmount");
  const customTipInput = document.getElementById("customTip");
  const tipButtons = document.querySelectorAll(".tip-btn");
  const calculateBtn = document.getElementById("calculateBtn");
  const resetBtn = document.getElementById("resetBtn");
  const resultDiv = document.getElementById("result");
  const initialAmountEl = document.getElementById("initialAmount");
  const tipAmountEl = document.getElementById("tipAmount");
  const totalAmountEl = document.getElementById("totalAmount");
  const participantsList = document.getElementById("participantsList");
  const participantInput = document.getElementById("participantInput");
  const addParticipantButton = document.getElementById("addParticipantButton");
  const selectWinnerButton = document.getElementById("selectWinnerButton");
  const winnerDialog = document.getElementById("winnerDialog");
  const winnerNameEl = document.getElementById("winnerName");
  const closeDialogButton = document.getElementById("closeDialogButton");
  const errorMessage = document.getElementById("errorMessageParticipantName");
  const toggleSidebarButton = document.getElementById("toggleSidebar");
  const sidebar = document.getElementById("sidebar");
  const settingsButton = document.getElementById("settingsButton");
  const settingsDropdown = document.getElementById("settingsDropdown");
  const currencySymbolEl = document.getElementById("currencySymbol");
  const currencySubmenuItems = document.querySelectorAll(
    ".dropdown-item:nth-child(1) .submenu-item"
  );
  const themeSubmenuItems = document.querySelectorAll(
    ".dropdown-item:nth-child(2) .submenu-item"
  );

  // Variables
  let billAmount = "";
  let tipPercentage = "";
  let customTip = "";
  let currentCurrencySymbol = "$";
  let participants = [];
  let selectedCurrency = "default";
  let selectedTheme = "pink";

  // Utility Functions
  function updateCalculateButtonState() {
    calculateBtn.disabled = !billAmount || (!tipPercentage && !customTip);
  }

  function getDefaultCurrencySymbol() {
    return navigator.language.startsWith("en") ? "$" : "€";
  }

  function resetCalculations() {
    billAmountInput.value = "";
    customTipInput.value = "";
    tipButtons.forEach((btn) => btn.classList.remove("selected"));
    resultDiv.style.display = "none";
    updateCalculateButtonState();
  }

  function updateResultCurrency(currencySymbol) {
    initialAmountEl.textContent = `Initial Amount: ${currencySymbol}${parseFloat(
      billAmount || 0
    ).toFixed(2)}`;
    tipAmountEl.textContent = `Tip Amount: ${currencySymbol}${parseFloat(
      tipAmountEl.dataset.amount || 0
    ).toFixed(2)}`;
    totalAmountEl.textContent = `Total: ${currencySymbol}${parseFloat(
      totalAmountEl.dataset.amount || 0
    ).toFixed(2)}`;
  }

  // Currency and Theme Handlers
  function applyCurrency() {
    currentCurrencySymbol =
      selectedCurrency === "euro" ? "€" : getDefaultCurrencySymbol();
    currencySymbolEl.textContent = currentCurrencySymbol;
    resetCalculations();
  }

  function applyTheme() {
    document.body.classList.toggle("dark", selectedTheme === "dark");
    document.body.style.backgroundColor =
      selectedTheme === "pink" ? "#ffe4e6" : "";
  }

  // Event Listeners
  tipButtons.forEach((button) => {
    button.addEventListener("click", function () {
      tipButtons.forEach((btn) => btn.classList.remove("selected"));
      button.classList.add("selected");
      tipPercentage = button.getAttribute("data-percentage");
      customTip = "";
      customTipInput.value = "";
      updateCalculateButtonState();
    });
  });

  billAmountInput.addEventListener("input", function () {
    billAmount = billAmountInput.value;
    updateCalculateButtonState();
  });

  customTipInput.addEventListener("input", function () {
    tipButtons.forEach((btn) => btn.classList.remove("selected"));
    customTip = customTipInput.value;
    tipPercentage = "";
    updateCalculateButtonState();
  });

  calculateBtn.addEventListener("click", function () {
    const bill = parseFloat(billAmount);
    const tipPercent = customTip
      ? parseFloat(customTip)
      : parseFloat(tipPercentage);
    const tipAmount = bill * (tipPercent / 100);
    const totalAmount = bill + tipAmount;

    resultDiv.style.display = "block";
    initialAmountEl.textContent = `Initial Amount: ${currentCurrencySymbol}${bill.toFixed(
      2
    )}`;
    tipAmountEl.textContent = `Tip Amount: ${currentCurrencySymbol}${tipAmount.toFixed(
      2
    )}`;
    totalAmountEl.textContent = `Total: ${currentCurrencySymbol}${totalAmount.toFixed(
      2
    )}`;
  });

  resetBtn.addEventListener("click", resetCalculations);

  addParticipantButton.addEventListener("click", function () {
    const participantName = participantInput.value.trim();
    if (participantName && !participants.includes(participantName)) {
      participants.push(participantName);
      renderParticipants();
      participantInput.value = "";
      errorMessage.style.display = "none";
    } else {
      errorMessage.style.display = "block";
    }
    selectWinnerButton.disabled = participants.length < 2;
  });

  participantInput.addEventListener(
    "input",
    () => (errorMessage.style.display = "none")
  );

  participantsList.addEventListener("click", function (e) {
    if (e.target.tagName === "BUTTON") {
      participants.splice(e.target.getAttribute("data-index"), 1);
      renderParticipants();
      selectWinnerButton.disabled = participants.length < 2;
    }
  });

  function renderParticipants() {
    participantsList.innerHTML = participants
      .map(
        (name, index) =>
          `<li>${name} <button data-index="${index}">X</button></li>`
      )
      .join("");
  }

  selectWinnerButton.addEventListener("click", function () {
    if (participants.length > 1) {
      const winner =
        participants[Math.floor(Math.random() * participants.length)];
      winnerNameEl.textContent = `The winner is: ${winner}`;
      winnerDialog.showModal();
    }
  });

  closeDialogButton.addEventListener("click", function () {
    winnerDialog.close();
    participants = [];
    renderParticipants();
    selectWinnerButton.disabled = true;
  });

  toggleSidebarButton.addEventListener("click", function () {
    sidebar.classList.toggle("collapsed");
    toggleSidebarButton.textContent = sidebar.classList.contains("collapsed")
      ? "→"
      : "←";
  });

  settingsButton.addEventListener("click", (event) => {
    event.stopPropagation();
    settingsDropdown.classList.toggle("open");
  });

  document.addEventListener("click", (e) => {
    if (
      !settingsButton.contains(e.target) &&
      !settingsDropdown.contains(e.target)
    ) {
      settingsDropdown.classList.remove("open");
    }
  });

  currencySubmenuItems.forEach((item) => {
    item.addEventListener("click", function () {
      selectedCurrency = item.dataset.value;
      applyCurrency();
      settingsDropdown.classList.remove("open");
    });
  });

  themeSubmenuItems.forEach((item) => {
    item.addEventListener("click", function () {
      selectedTheme = item.dataset.value;
      applyTheme();
      settingsDropdown.classList.remove("open");
    });
  });

  // Initialize
  applyTheme();
  applyCurrency();
});
