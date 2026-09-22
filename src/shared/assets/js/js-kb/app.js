/**
 * 공통 유의사항 아코디언 초기화
 */
function initNoticeAccordion() {
  const accordionList = document.querySelectorAll('.common-notice-accordion');

  accordionList.forEach((accordion) => {
    const toggleBtn = accordion.querySelector('.btn-notice-toggle');
    const contentBody = accordion.querySelector('.notice-content-body');

    if (!toggleBtn || !contentBody) return;

    toggleBtn.addEventListener('click', function () {
      const isOpen = toggleBtn.classList.toggle('is-open');
      toggleBtn.setAttribute('aria-expanded', isOpen);

      if (isOpen) {
        contentBody.style.display = 'block';
      } else {
        contentBody.style.display = 'none';
      }
    });
  });
}

/**
 * 공통 인풋 삭제(X) 버튼 제어 초기화
 */
function initCommonInputClear() {
  const inputFields = document.querySelectorAll('.common-input-field');

  inputFields.forEach((field) => {
    const input = field.querySelector('.common-form-input');
    const clearBtn = field.querySelector('.btn-input-clear');

    if (!input || !clearBtn) return;

    function updateClearBtnVisibility() {
      if (input.value && input.value.trim().length > 0) {
        clearBtn.style.display = 'inline-flex';
      } else {
        clearBtn.style.display = 'none';
      }
    }

    updateClearBtnVisibility();

    input.addEventListener('input', updateClearBtnVisibility);

    clearBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      input.value = '';
      updateClearBtnVisibility();
      input.focus();

      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });
}

/**
 * 공통 가상 키패드 핸들러
 */
function createCommonKeypad(config) {
  let rawAmount = '';
  const maxDigits = config.maxDigits || 10;
  const maxAmount = config.maxAmount || 0;
  const keypadElem =
    typeof config.keypadContainer === 'string'
      ? document.querySelector(config.keypadContainer)
      : config.keypadContainer;
  const quickElem =
    typeof config.quickContainer === 'string' ? document.querySelector(config.quickContainer) : config.quickContainer;

  function notify() {
    const num = Number(rawAmount) || 0;
    if (typeof config.onChange === 'function') {
      config.onChange(rawAmount, num.toLocaleString('ko-KR'));
    }
  }

  function handleKeyPress(key) {
    if (key === 'delete') {
      rawAmount = rawAmount.slice(0, -1);
    } else if (key === '00') {
      if (rawAmount && rawAmount !== '0' && rawAmount.length + 2 <= maxDigits) {
        rawAmount += '00';
      }
    } else if (key === '0') {
      if (rawAmount && rawAmount !== '0' && rawAmount.length + 1 <= maxDigits) {
        rawAmount += '0';
      }
    } else {
      if (rawAmount.length < maxDigits) {
        rawAmount = (rawAmount === '0' ? '' : rawAmount) + key;
      }
    }
    notify();
  }

  keypadElem?.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-key');
    if (!btn) return;
    const key = btn.dataset.key;
    if (key) handleKeyPress(key);
  });

  quickElem?.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-quick-amount');
    if (!btn) return;

    if (btn.dataset.action === 'all') {
      rawAmount = String(maxAmount);
    } else if (btn.dataset.add) {
      const current = Number(rawAmount) || 0;
      rawAmount = String(current + Number(btn.dataset.add));
    }
    notify();
  });

  return {
    setAmount: function (val) {
      rawAmount = String(val || '');
      notify();
    },
    getAmount: function () {
      return Number(rawAmount) || 0;
    },
    clear: function () {
      rawAmount = '';
      notify();
    },
  };
}

/**
 * 공통 탭 네비게이션 초기화
 */
function initCommonTabNav() {
  var tabNav = document.querySelector('.common-tab-nav');
  if (!tabNav) return;

  var tabItems = tabNav.querySelectorAll('.tab-item');
  tabItems.forEach(function (item) {
    item.querySelector('.tab-btn')?.addEventListener('click', function () {
      tabItems.forEach(function (el) {
        el.classList.remove('is-active');
      });
      item.classList.add('is-active');
    });
  });
}

/**
 * 계좌 복사 토스트 초기화
 */
function initAccountCopyToast() {
  const copyBtn = document.getElementById('btnCopyAccount');
  const accountElem = document.getElementById('userWalletAccount');
  const toast = document.getElementById('accountCopyToast');
  if (!copyBtn || !accountElem || !toast) return;

  let toastTimer = null;

  copyBtn.addEventListener('click', function () {
    const accountText = accountElem.textContent.trim();
    navigator.clipboard.writeText(accountText).then(() => {
      clearTimeout(toastTimer);
      toast.classList.add('show');
      toastTimer = setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    });
  });
}

/**
 * 알림 설정 마스터/서브 스위치 동기화
 */
function initNotificationSettingSwitches() {
  const masterSwitch = document.getElementById('switchAllAlarms');
  const subSwitches = document.querySelectorAll('.sub-switch');
  if (!masterSwitch || subSwitches.length === 0) return;

  masterSwitch.addEventListener('change', function () {
    const isChecked = this.checked;
    subSwitches.forEach(function (sw) {
      sw.checked = isChecked;
    });
  });

  subSwitches.forEach(function (sw) {
    sw.addEventListener('change', function () {
      const allChecked = Array.from(subSwitches).every(function (item) {
        return item.checked;
      });
      masterSwitch.checked = allChecked;
    });
  });
}

/**
 * 은행 선택 바텀시트 초기화
 */
function initBankSelectSheet() {
  const sheet = document.getElementById('bankSelectSheet');
  if (!sheet) return;

  const closeBtn = document.getElementById('btnBankSheetClose');
  const bankList = sheet.querySelector('.bank-list-grid');

  closeBtn?.addEventListener('click', function () {
    sheet.classList.remove('active');
  });

  bankList?.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-bank-select-item');
    if (!btn) return;
    const bankName = btn.dataset.name;
    const bankCode = btn.dataset.code;
    console.log('선택된 은행:', bankName, bankCode);
    sheet.classList.remove('active');
  });
}

/**
 * 결제 금액 입력 키패드 바텀시트 초기화
 */
function initPaymentAmountKeypad() {
  const keypadSheet = document.getElementById('keypadSheet');
  const amountValElem = document.getElementById('keypadAmountVal');
  if (!keypadSheet || !amountValElem) return;

  const confirmBtn = document.getElementById('btnKeypadConfirm');
  const closeBtn = document.getElementById('btnKeypadClose');

  const keypad = createCommonKeypad({
    keypadContainer: '#keypadGrid',
    maxDigits: 9,
    onChange: function (rawVal, formattedVal) {
      const inputVal = Number(rawVal) || 0;

      if (!rawVal || inputVal === 0) {
        amountValElem.textContent = '0';
        confirmBtn.classList.add('disabled');
      } else {
        amountValElem.textContent = formattedVal;
        confirmBtn.classList.remove('disabled');
      }
    },
  });

  closeBtn?.addEventListener('click', function () {
    keypadSheet.classList.remove('active');
  });

  confirmBtn?.addEventListener('click', function () {
    if (confirmBtn.classList.contains('disabled')) return;
    console.log('입력 완료 금액:', keypad.getAmount());
    keypadSheet.classList.remove('active');
  });
}

/**
 * 실명확인(수취인) 바텀시트 초기화
 */
function initRecipientVerifySheet() {
  const sheet = document.getElementById('recipientVerifySheet');
  if (!sheet) return;

  const closeBtn = document.getElementById('btnRecipientClose');
  const cancelBtn = document.getElementById('btnRecipientCancel');
  const confirmBtn = document.getElementById('btnRecipientConfirm');
  const nameInput = document.getElementById('recipientNameInput');
  const clearBtn = document.getElementById('btnRecipientClear');

  function toggleClearBtn() {
    clearBtn.style.display = nameInput.value.length > 0 ? 'inline-flex' : 'none';
  }

  nameInput.addEventListener('input', toggleClearBtn);

  clearBtn.addEventListener('click', function () {
    nameInput.value = '';
    nameInput.focus();
    toggleClearBtn();
  });

  const closeSheet = () => sheet.classList.remove('active');
  closeBtn?.addEventListener('click', closeSheet);
  cancelBtn?.addEventListener('click', closeSheet);

  confirmBtn?.addEventListener('click', function () {
    console.log('실명확인 완료:', nameInput.value);
    closeSheet();
  });
}

/**
 * 지갑주소 입력 바텀시트 키패드 초기화
 */
function initWalletAddressKeypad() {
  const sheet = document.getElementById('walletAddressSheet');
  if (!sheet) return;

  const inputElem = document.getElementById('keypadAmountVal');
  const clearBtn = document.getElementById('btnWalletInputClear');
  const confirmBtn = document.getElementById('btnWalletAddressConfirm');
  const closeBtn = document.getElementById('btnWalletSheetClose');
  const keypadContainer = document.getElementById('walletKeypadGrid');

  const TARGET_LENGTH = 18;

  function updateUI(value) {
    let sanitizedVal = String(value || '').replace(/[^0-9]/g, '');
    if (sanitizedVal.length > TARGET_LENGTH) {
      sanitizedVal = sanitizedVal.slice(0, TARGET_LENGTH);
    }

    inputElem.value = sanitizedVal;

    if (sanitizedVal.length === TARGET_LENGTH) {
      confirmBtn.classList.remove('disabled');
      confirmBtn.removeAttribute('disabled');
      confirmBtn.disabled = false;
    } else {
      confirmBtn.classList.add('disabled');
      confirmBtn.setAttribute('disabled', 'disabled');
      confirmBtn.disabled = true;
    }
  }

  inputElem?.addEventListener('input', function () {
    updateUI(this.value);
  });

  keypadContainer?.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn-key');
    if (!btn) return;

    const key = btn.getAttribute('data-key');
    if (!key) return;

    let currentVal = inputElem.value;

    if (key === 'delete') {
      currentVal = currentVal.slice(0, -1);
    } else {
      if (currentVal.length < TARGET_LENGTH) {
        currentVal += key;
      }
    }

    updateUI(currentVal);
  });

  clearBtn?.addEventListener('click', function () {
    updateUI('');
  });

  closeBtn?.addEventListener('click', function () {
    sheet.classList.remove('active');
  });

  confirmBtn?.addEventListener('click', function () {
    if (confirmBtn.disabled || confirmBtn.classList.contains('disabled')) return;
    sheet.classList.remove('active');
  });

  updateUI(inputElem.value);
}

/**
 * 전환 키패드 초기화 (충전/출금 before 페이지)
 */
function initConvertKeypad() {
  const keypadGrid = document.getElementById('convertKeypadGrid');
  const titleElem = document.getElementById('convertQuestionTitle');
  if (!keypadGrid || !titleElem || document.getElementById('convertAmountInput')) return;

  const maxVal = Number(document.getElementById('maxAvailableAmount')?.dataset.max) || 471520;
  const amountWrapper = document.getElementById('availableAmountWrapper');

  createCommonKeypad({
    keypadContainer: '#convertKeypadGrid',
    quickContainer: '#convertQuickGroup',
    maxAmount: maxVal,
    onChange: function (rawVal, formattedVal) {
      const inputVal = Number(rawVal) || 0;

      if (!rawVal || inputVal === 0) {
        titleElem.textContent = '얼마를 전환할까요?';
        titleElem.classList.remove('has-value');
        if (amountWrapper) amountWrapper.classList.remove('is-insufficient');
      } else {
        titleElem.innerHTML = '<span class="val">' + formattedVal + '</span><span class="unit">원</span>';
        titleElem.classList.add('has-value');

        if (amountWrapper) {
          if (inputVal > maxVal) {
            amountWrapper.classList.add('is-insufficient');
          } else {
            amountWrapper.classList.remove('is-insufficient');
          }
        }
      }
    },
  });
}

/**
 * 전환 금액 직접입력 초기화 (충전/출금 input, insufficient 페이지 통합)
 */
function initConvertAmountInput() {
  const wrapper = document.getElementById('convertTitleWrapper');
  const input = document.getElementById('convertAmountInput');
  const maxAvailableElem = document.getElementById('maxAvailableAmount');
  if (!wrapper || !input || !maxAvailableElem) return;

  const amountWrapper = document.getElementById('availableAmountWrapper');
  const confirmBtn =
    document.getElementById('btnConvertConfirm') ||
    document.querySelector('.fixed-bottom-btn-wrapper .btn-confirm-bottom');
  const maxVal = Number(maxAvailableElem.dataset.max) || 471520;

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  function getTextWidth(text, font) {
    context.font = font;
    return context.measureText(text).width;
  }

  function adjustInputWidth(val) {
    if (!val) {
      input.style.width = '260px';
      wrapper.classList.remove('has-value');
    } else {
      wrapper.classList.add('has-value');
      const measuredWidth = getTextWidth(val, '500 30px Roboto');
      input.style.width = Math.ceil(measuredWidth + 2) + 10 + 'px';
    }
  }

  function checkAmountStatus(numVal) {
    if (amountWrapper) {
      if (numVal > 0 && numVal <= maxVal) {
        confirmBtn.classList.remove('disabled');
        confirmBtn.removeAttribute('disabled');
      } else {
        confirmBtn.classList.add('disabled');
        confirmBtn.setAttribute('disabled', 'disabled');
      }

      if (numVal > maxVal) {
        amountWrapper.classList.add('is-insufficient');
      } else {
        amountWrapper.classList.remove('is-insufficient');
      }
    } else {
      if (numVal && numVal > 0) {
        confirmBtn.classList.remove('disabled');
        confirmBtn.removeAttribute('disabled');
      } else {
        confirmBtn.classList.add('disabled');
        confirmBtn.setAttribute('disabled', 'disabled');
      }
    }
  }

  input.addEventListener('input', function () {
    let raw = this.value.replace(/[^0-9]/g, '');

    if (!raw) {
      this.value = '';
      adjustInputWidth('');
      checkAmountStatus(0);
      return;
    }

    let num = parseInt(raw, 10);
    if (!amountWrapper && num > maxVal) num = maxVal;

    const formatted = num.toLocaleString();
    this.value = formatted;
    adjustInputWidth(formatted);
    checkAmountStatus(num);
  });

  if (input.value) {
    const raw = input.value.replace(/[^0-9]/g, '');
    const num = parseInt(raw, 10) || 0;
    const formatted = num.toLocaleString();
    input.value = formatted;
    adjustInputWidth(formatted);
    checkAmountStatus(num);
  } else {
    checkAmountStatus(0);
  }
}

/**
 * 거래 코드 입력 초기화 (QR 직접 입력)
 */
function initTradeCodeInput() {
  const input = document.getElementById('tradeCodeInput');
  const btnConfirm = document.getElementById('btnConfirm');
  if (!input || !btnConfirm) return;

  input.addEventListener('input', function () {
    const hasValue = this.value.trim().length > 0;
    btnConfirm.disabled = !hasValue;
  });
}

/**
 * 거래 제한 모달 초기화
 */
function initModalTradeRestriction() {
  const modal = document.getElementById('modalTradeRestriction');
  if (!modal) return;

  const cancelBtn = document.getElementById('btnRestrictionCancel');
  const confirmBtn = document.getElementById('btnRestrictionConfirm');
  const chkToday = document.getElementById('chkDoNotShowToday');

  const closeModal = () => modal.classList.remove('active');

  cancelBtn?.addEventListener('click', closeModal);
  confirmBtn?.addEventListener('click', function () {
    if (chkToday?.checked) {
      console.log('오늘은 다시 보지 않기 설정됨');
    }
    closeModal();
  });
}

/**
 * 시스템 점검 모달 초기화
 */
function initModalSystemMaintenance() {
  const modal = document.getElementById('modalSystemMaintenance');
  if (!modal) return;

  const confirmBtn = document.getElementById('btnMaintenanceConfirm');

  confirmBtn?.addEventListener('click', function () {
    modal.classList.remove('active');
  });
}

/**
 * 계좌 개설 모달 초기화
 */
function initModalNeedAccount() {
  const modal = document.getElementById('modalNeedAccount');
  if (!modal) return;

  const cancelBtn = document.getElementById('btnAccountCancel');
  const createBtn = document.getElementById('btnAccountCreate');

  const closeModal = () => modal.classList.remove('active');

  cancelBtn?.addEventListener('click', closeModal);
  createBtn?.addEventListener('click', function () {
    closeModal();
  });
}

/**
 * 송금/환불 주소 입력 초기화 (단순 + 은행 선택 통합)
 */
function initRemitAddressInput() {
  const input = document.getElementById('remitAddressInput');
  const clearBtn = document.getElementById('btnRemitAddressClear');
  const nextBtn = document.getElementById('btnRemitNext');
  if (!input || !clearBtn || !nextBtn) return;

  const bankSelect = document.getElementById('bankSelect');
  const bankChips = document.querySelectorAll('.btn-bank-chip');
  const bannerBtn = document.querySelector('.btn-recent-remit-banner');

  function checkNextValidation() {
    const isAddressValid = input.value.trim().length >= 18;

    if (bankSelect) {
      const isBankSelected = Boolean(bankSelect.value);
      if (isAddressValid && isBankSelected) {
        nextBtn.classList.remove('disabled');
        nextBtn.removeAttribute('disabled');
      } else {
        nextBtn.classList.add('disabled');
        nextBtn.setAttribute('disabled', 'disabled');
      }
    } else {
      if (isAddressValid) {
        nextBtn.classList.remove('disabled');
        nextBtn.removeAttribute('disabled');
      } else {
        nextBtn.classList.add('disabled');
        nextBtn.setAttribute('disabled', 'disabled');
      }
    }
  }

  function handleInputState() {
    if (input.value.length > 18) {
      input.value = input.value.slice(0, 18);
    }

    if (input.value.length > 0) {
      clearBtn.style.display = 'inline-flex';
    } else {
      clearBtn.style.display = 'none';
    }

    checkNextValidation();
  }

  input.addEventListener('input', handleInputState);

  clearBtn.addEventListener('click', function () {
    input.value = '';
    input.focus();
    handleInputState();
  });

  if (bankSelect) {
    bankSelect.addEventListener('change', function () {
      const selectedCode = this.value;

      bankChips.forEach((chip) => {
        if (chip.dataset.code === selectedCode) {
          chip.classList.add('active');
        } else {
          chip.classList.remove('active');
        }
      });

      checkNextValidation();
    });

    bankChips.forEach((chip) => {
      chip.addEventListener('click', function () {
        const bankCode = this.dataset.code;
        bankSelect.value = bankCode;

        bankChips.forEach((c) => c.classList.remove('active'));
        this.classList.add('active');

        checkNextValidation();
      });
    });
  }

  if (bannerBtn) {
    bannerBtn.addEventListener('click', function () {
      const accountElem = document.getElementById('remit-account');
      if (accountElem) {
        const targetText = accountElem.textContent.trim().slice(0, 18);
        input.value = targetText;
        input.focus();
        handleInputState();
      }
    });
  }

  handleInputState();
}

/**
 * 송금/환불 금액 입력 초기화 (단순 + 한도 초과 통합)
 */
function initRemitAmountInput() {
  const remitInput = document.getElementById('remitAmountInput');
  const titleWrapper = document.getElementById('remitTitleWrapper');
  const maxAmountElem = document.getElementById('maxRemitAmount');
  const btnConfirm = document.getElementById('btnRemitAmountConfirm');
  if (!remitInput || !titleWrapper || !maxAmountElem || !btnConfirm) return;

  const maxAmount = parseInt(maxAmountElem.dataset.max, 10);
  const availableWrapper = document.getElementById('availableAmountWrapper');
  // 안심송금 안내 말풍선은 금액이 비었을 때만, 그리고 진입 후 10초 동안만 노출한다
  const safeRemitTooltip = document.getElementById('safeRemitTooltip');
  const TOOLTIP_VISIBLE_MS = 10000;
  let isTooltipDismissed = false;
  // .speech-bubble-tooltip 이 display:inline-flex 라서 hidden 속성으로는 가려지지 않는다
  const setTooltipVisible = (visible) => {
    if (!safeRemitTooltip) return;
    safeRemitTooltip.style.display = visible && !isTooltipDismissed ? '' : 'none';
  };

  if (safeRemitTooltip) {
    window.setTimeout(() => {
      isTooltipDismissed = true;
      setTooltipVisible(false);
    }, TOOLTIP_VISIBLE_MS);
  }

  const updateInputState = (valStr, fromUserInput) => {
    let rawValue = valStr.replace(/[^0-9]/g, '');

    if (rawValue === '' || parseInt(rawValue, 10) === 0) {
      remitInput.value = '';
      remitInput.style.width = '100%';
      titleWrapper.classList.remove('has-value');
      if (availableWrapper) availableWrapper.classList.remove('is-insufficient');
      setTooltipVisible(true);

      btnConfirm.disabled = true;
      btnConfirm.classList.add('disabled');
      return;
    }

    // 미리 채워진 금액으로 진입한 경우에는 말풍선을 남겨두고, 사용자가 직접 입력할 때만 감춘다
    if (fromUserInput) setTooltipVisible(false);

    let numericValue = parseInt(rawValue, 10);

    if (!availableWrapper && numericValue > maxAmount) {
      numericValue = maxAmount;
    }

    const formattedValue = numericValue.toLocaleString('ko-KR');
    remitInput.value = formattedValue;
    remitInput.style.width = `${formattedValue.length}ch`;
    titleWrapper.classList.add('has-value');

    if (availableWrapper) {
      if (numericValue > maxAmount) {
        availableWrapper.classList.add('is-insufficient');
        btnConfirm.disabled = true;
        btnConfirm.classList.add('disabled');
      } else {
        availableWrapper.classList.remove('is-insufficient');
        btnConfirm.disabled = false;
        btnConfirm.classList.remove('disabled');
      }
    } else {
      btnConfirm.disabled = false;
      btnConfirm.classList.remove('disabled');
    }
  };

  // 빈 값으로 시작하는 경우에도 말풍선/버튼 초기 상태를 맞춘다
  updateInputState(remitInput.value ?? '', false);

  remitInput.addEventListener('input', (e) => {
    updateInputState(e.target.value, true);
  });
}

/**
 * 본인확인 주민번호/전화번호 입력 제어
 */
function initIdentityVerify() {
  const rrnFirst = document.getElementById('userRrnFirst');
  const rrnSecond = document.getElementById('userRrnSecond');
  const phone = document.getElementById('userPhone');
  if (!rrnFirst) return;

  rrnFirst.addEventListener('input', function () {
    this.value = this.value.replace(/[^0-9]/g, '');
    if (this.value.length >= 6) {
      rrnSecond?.focus();
    }
  });

  rrnSecond?.addEventListener('input', function () {
    this.value = this.value.replace(/[^0-9]/g, '');
    if (this.value.length >= 1) {
      phone?.focus();
    }
  });

  phone?.addEventListener('input', function () {
    this.value = this.value.replace(/[^0-9]/g, '');
  });
}

/**
 * 공통 인라인 이벤트 위임 초기화
 * - data-href: 페이지 이동
 * - data-action="back": 뒤로가기
 * - .faq-question-btn: FAQ 아코디언 토글
 */
function initInlineActions() {
  document.addEventListener('click', function (e) {
    var target = e.target.closest('[data-href]');
    if (target) {
      location.href = target.dataset.href;
      return;
    }

    target = e.target.closest('[data-action="back"]');
    if (target) {
      history.back();
      return;
    }

    target = e.target.closest('.faq-question-btn');
    if (target) {
      target.parentElement.classList.toggle('is-open');
      return;
    }
  });
}

/**
 * 지갑 상세 필터 버튼 초기화
 */
function initWalletDetailFilter() {
  const filterBtns = document.querySelectorAll('.btn-wallet-detail-filter');
  const historyItems = document.querySelectorAll('.wallet-detail-history-item');
  if (filterBtns.length === 0 || historyItems.length === 0) return;

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (el) {
        el.classList.remove('active');
      });
      btn.classList.add('active');

      var filterText = btn.querySelector('.wallet-detail-filter').textContent.trim();

      historyItems.forEach(function (item) {
        if (filterText === '전체') {
          item.style.display = '';
          return;
        }
        var typeElem = item.querySelector('.wallet-detail-history-type');
        var typeText = typeElem ? typeElem.textContent.trim() : '';
        item.style.display = typeText.indexOf(filterText) === 0 ? '' : 'none';
      });
    });
  });
}

/**
 * 세그먼트 탭 초기화
 */
function initSegmentTab() {
  document.querySelectorAll('.segment-tab-wrapper').forEach(function (wrapper) {
    var buttons = wrapper.querySelectorAll('.btn-segment-tab');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) {
          b.classList.remove('is-active');
          b.setAttribute('aria-checked', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-checked', 'true');
      });
    });
  });
}

// DOM 로드 시 공통 컴포넌트 자동 실행
document.addEventListener('DOMContentLoaded', function () {
  initInlineActions();
  initNoticeAccordion();
  initCommonInputClear();
  initCommonTabNav();
  initAccountCopyToast();
  initNotificationSettingSwitches();
  initBankSelectSheet();
  initPaymentAmountKeypad();
  initRecipientVerifySheet();
  initWalletAddressKeypad();
  initConvertKeypad();
  initConvertAmountInput();
  initTradeCodeInput();
  initModalTradeRestriction();
  initModalSystemMaintenance();
  initModalNeedAccount();
  initRemitAddressInput();
  initRemitAmountInput();
  initIdentityVerify();
  initWalletDetailFilter();
  initSegmentTab();
});
