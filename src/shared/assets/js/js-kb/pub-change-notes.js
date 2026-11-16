/**
 * 스토리보드 0.7을 반영하며 마크업·스타일·문구가 바뀐 퍼블 화면과 새로 만든 화면에 들어오면 바뀐 곳을 팝업으로 알려 준다.
 * - 퍼블 목록(kbPubList.html)에서 파란 글씨로 표시한 화면과 같은 목록이다.
 * - 항목에 선택자가 있으면 누를 때 팝업을 닫고 그 부분을 잠깐 강조한다.
 * - [확인 완료]는 퍼블 목록의 체크박스와 같은 저장소(localStorage kbPubListChecked)에 저장한다.
 * - 팝업을 닫은 뒤에는 오른쪽 아래 [바뀐 곳] 버튼으로 다시 연다.
 */
(function () {
  // [문구, 강조할 선택자(없으면 생략)]
  // 스토리보드 0.7(2026.10.19) 반영분만 표시한다 (마크업·스타일·문구가 바뀐 화면과 새로 만든 화면). 0.6까지 반영분 표시는 지웠다 (2026-10-28 사용자 요청).
  var GO_MAIN = ['상단 [메인으로] → [전자지갑 메인] (0.7 공통 상단)', '.btn-go-main'];
  var VOUCHER_HEADER = ['상단 [닫기](X) → [전자지갑 메인] (0.7 220p)', '.btn-go-main'];
  var PAY_AMOUNT = [
    '예금 토큰 잔액: \'결제 가능 금액\' 라벨 제거, 은행·지갑주소·잔액만 (0.7 98p)',
    '.available-balance-wrapper',
  ];
  var PAY_BANK = ['예금 토큰 잔액 은행 표기 \'국민\' → \'KB국민\' (0.7 98p)', '.available-balance-wrapper'];
  var REMIT_BANK = ['받는 분 은행 표기 \'국민\' → \'KB국민\' (0.7 138p)', '.remit-target-info'];
  var REMIT_ADDRESS = ['받는 분 지갑 주소 가운데 \'-\' 표시 (예: 012345-67-890125, 0.7 138p)', '.target-account'];
  var REFUND_AMOUNT = [
    REMIT_ADDRESS,
    ['송금 금액 입력과 같은 구성으로 맞춤 (앱은 같은 화면, 0.7 250p)', '.remit-amount-main'],
    ['상단 송금 한도 안내 \'※ 1회 송금 한도 100만원, 1일 송금 한도 500만원\' 추가 (0.7 250p 4)', '.remit-limit-notice'],
    ['입력 안내 \'얼마를 송금할까요?\' → \'얼마를 송금하시겠어요?\' (0.7 250p 1-1)', '.question-input'],
    ['받는 분 은행 표기 \'국민\' → \'KB국민\' (0.7 250p)', '.remit-target-info'],
  ];
  var MAP_AREA = ['\'이 지역 검색\' → \'이 지역에서 검색\' (0.7 228p 5)', '.btn-search-this-area'];
  var MAP_NAME = ['말풍선 사용처 명 최대 10글자, 넘으면 말줄임 (0.7 228p 7)', '.map-bubble-marker'];
  var REFUND_ADDRESS_TITLE = ['제목 \'누구의 지갑으로 보낼까요?\' → \'누구에게 송금하시겠어요?\' (0.7 248p)', '.remit-address-title'];

  var NOTI_RECEIVE = ['알림 타이틀 \'받기\' → \'받음\' (0.7 204p)', '.alarm-item-title'];

  var NOTES = {
    'bizHistoryDetail.html': [GO_MAIN],
    'bizRegistrationCompleted.html': [GO_MAIN],
    'historyDetailCashback.html': [
      ['\'바우처 정보\' 줄 제거 (제목과 중복, 0.7 74p)', '.history-detail-info-list'],
      ['버튼 \'바우처 상세 보기\' → \'바우처 자세히 보기\' (0.7 74p 3)', '.btn-outline-detail'],
      ['하단 \'알려드립니다\' 추가 (0.7 74p 6, 문구는 73p 이용자 오프라인 결제)', '.common-notice-accordion'],
    ],
    'historyDetailOfframp.html': [
      ['제목 \'스피카 나폴리 합정\' → \'토큰을 예금으로 전환\' (0.7 78p 1)', '.history-detail-title'],
      ['연계계좌 은행 표기 \'국민\' → \'KB국민\' (0.7 78p)', '.history-detail-info-list'],
    ],
    'historyDetailOnramp.html': [
      ['제목 \'연동계좌에서 전환 입금\' → \'예금을 토큰으로 전환\' (0.7 77p 1)', '.history-detail-title'],
      ['금액 항목 \'캐시백 금액\' → \'전환 입금 금액\' (0.7 77p 3)', '.history-detail-info-label'],
      ['연계계좌 은행 표기 \'국민\' → \'KB국민\' (0.7 77p)', '.history-detail-info-list'],
    ],
    'inquiry_answer_before.html': [['상단 닫기(X) 헤더 → [전자지갑 메인] 공통 헤더 (0.7 234p)', '.btn-go-main']],
    'inquiry_answer_complete.html': [
      ['상단 닫기(X) 헤더 → [전자지갑 메인] 공통 헤더 (0.7 234p)', '.btn-go-main'],
      ['답변 상태 \'답변 완료\' → \'답변완료\' (0.7 231p)', '.common-badge'],
      ['답변완료 왼쪽 \'A.\' 제거 (0.7 234p 2)', '.answer-header'],
    ],
    'inquiry_category_bottom_sheet.html': [
      ['유형에 \'환불\'·\'전환\' 추가, \'서비스이용\' → \'서비스 이용\' (0.7 232p)', '.select-menu-list'],
    ],
    'inquiry_list.html': [['답변 상태 \'답변 준비중\'·\'답변 완료\' → \'답변준비중\'·\'답변완료\' (0.7 231p)', '.common-badge']],
    'notificationLast.html': [GO_MAIN, NOTI_RECEIVE],
    'notificationList.html': [GO_MAIN, NOTI_RECEIVE],
    'notificationListDelete.html': [GO_MAIN, NOTI_RECEIVE],
    'notificationIconList.html': [['아이콘 이름 \'받기\' → \'받음\' (0.7 204p)', '.icon-label']],
    'paymentCertPassword.html': [GO_MAIN],
    'paymentCompleteCashback.html': [GO_MAIN],
    'paymentCompleteDefault.html': [GO_MAIN],
    'paymentCompleteVoucher.html': [GO_MAIN],
    'paymentConfirmCashback.html': [GO_MAIN],
    'paymentConfirmDefault.html': [GO_MAIN],
    'paymentConfirmSubsidy.html': [GO_MAIN],
    'paymentQR.html': [GO_MAIN],
    'paymentQRAmountAfter.html': [PAY_AMOUNT, PAY_BANK, GO_MAIN],
    'paymentQRAmountBefore.html': [PAY_AMOUNT, PAY_BANK, GO_MAIN],
    'paymentQRAmountOverBalance.html': [PAY_AMOUNT, PAY_BANK, GO_MAIN],
    'paymentQRExpired.html': [GO_MAIN],
    'paymentQRShow.html': [GO_MAIN],
    'refundAddressBefore.html': [
      ['연락처송금 버튼 제거, QR송금만 (0.7 248p)', '.remit-quick-actions'],
      REFUND_ADDRESS_TITLE,
      GO_MAIN,
    ],
    'refundAddressError.html': [REFUND_ADDRESS_TITLE, GO_MAIN],
    'refundAddressInputting.html': [REFUND_ADDRESS_TITLE, GO_MAIN],
    'refundAmountBefore.html': REFUND_AMOUNT.concat([
      ['송금 한도 영역 \'[잔액부족] 송금 가능 금액\' → \'송금 한도\' (0.7 250p 1)', '.available-amount-wrapper'],
      GO_MAIN,
    ]),
    'refundAmountComplete.html': REFUND_AMOUNT.concat([
      ['송금 한도 영역 \'[잔액부족] 송금 가능 금액\' → \'송금 한도\' (0.7 250p 1)', '.available-amount-wrapper'],
      GO_MAIN,
    ]),
    'refundBalanceInsufficient.html': REFUND_AMOUNT.concat([
      ['새 화면: 지갑 잔액 부족 시 \'지갑 잔액을 확인해주세요\' (자동 충전 안내 팝업 대신, 0.7 250p 1-2)', '.available-amount-wrapper'],
    ]),
    'refundConfirm.html': [
      ['송금 금액 확인과 같은 구성으로 맞춤: 보내는·받는 은행 심볼, \'100,000원을 송금하시겠어요?\', 받는 분·전자지갑 주소 (0.7 251p)', '.main-content'],
      ['받는 분 은행 표기 \'KB국민\' (0.7 251p)', '.target-account-wrapper'],
      ['받는 분·전자지갑 주소 가운데 \'-\' 표시 (0.7 251p)', '.target-account-wrapper'],
      GO_MAIN,
    ],
    'refundDayLimitExceed.html': REFUND_AMOUNT.concat([
      ['새 화면: 1일 송금 한도 초과 \'[1일 송금 한도 초과] 한도 5,000,000원\' (0.7 250p 1-2)', '.available-amount-wrapper'],
    ]),
    'refundHistoryDetail.html': [GO_MAIN],
    'refundHistoryDetailBadge.html': [GO_MAIN],
    'refundLimitExceed.html': REFUND_AMOUNT.concat([
      ['한도 초과 문구 \'[한도초과] 송금 가능 금액\' → \'[1회 송금 한도 초과] 한도\' (0.7 250p 1-2)', '.available-amount-wrapper'],
      GO_MAIN,
    ]),
    'refundQRScan.html': [GO_MAIN],
    'refundTransferComplete.html': [
      ['전자지갑 주소 은행 표기 \'국민\' → \'KB국민\' (0.7 255p)', '.convert-info-list'],
      ['전자지갑 주소 가운데 \'-\' 표시 (0.7 255p)', '.convert-info-list'],
    ],
    'setting_all.html': [
      ['\'개인정보 처리방침\' → \'개인정보처리방침\' (0.7 208·209p)'],
      ['\'개인정보처리방침\' → 개인정보처리방침 개정 목록 연결 (0.7 236p 1)', '.page-list-container'],
      ['\'약관 및 이용 동의\' → 약관 및 이용 동의 팝업 연결 (0.7 235p 1)', '.page-list-container'],
    ],
    'shopMapRotate1.html': [MAP_AREA, MAP_NAME],
    'shopMapRotate2.html': [MAP_AREA, MAP_NAME],
    'shopMapSearchEmpty.html': [MAP_AREA],
    'shopMapSearchInput.html': [MAP_AREA, MAP_NAME],
    'shopMapView.html': [MAP_AREA, MAP_NAME],
    'simple_password_change_complete.html': [GO_MAIN],
    'transferAmountConfirm.html': [
      ['받는 분·전자지갑 주소 은행 표기 \'국민\' → \'KB국민\' (0.7 139p)', '.target-account-wrapper'],
      ['받는 분·전자지갑 주소 가운데 \'-\' 표시 (0.7 139p)', '.target-account-wrapper'],
    ],
    'transferBalanceInsufficient.html': [REMIT_BANK, REMIT_ADDRESS],
    'transferComplete.html': [
      ['전자지갑 주소 은행 표기 \'국민\' → \'KB국민\' (0.7 143p)', '.convert-info-list'],
      ['전자지갑 주소 가운데 \'-\' 표시 (0.7 143p)', '.convert-info-list'],
    ],
    'transferDayLimitExceed.html': [REMIT_BANK, REMIT_ADDRESS],
    'transferEmptyInput.html': [REMIT_BANK, REMIT_ADDRESS],
    'transferInputting.html': [REMIT_BANK, REMIT_ADDRESS],
    'transferLimitExceed.html': [REMIT_BANK, REMIT_ADDRESS],
    'voucher_detail_cashback.html': [VOUCHER_HEADER],
    'voucher_detail_expired.html': [VOUCHER_HEADER],
    'voucher_detail_subsidy.html': [VOUCHER_HEADER],
    'voucher_detail_subsidy_history.html': [
      ['새 화면: 이용 내역 보조금 바우처 결제는 바우처명, 예금 토큰 결제는 사용처명, 바우처로만 결제하면 예금 토큰 \'0원\' (0.7 220p 5-1)', '.history-list'],
      VOUCHER_HEADER,
    ],
    'walletDetailEmpty.html': [['이용내역 없음 \'이용내역이 없어요.\' → \'최근에 이용한 내역이 없어요.\' (0.7 69p 4)', '.main-empty-state']],
    'walletDetailSearchEmpty.html': [['새 화면: 검색 결과 없음 \'검색어 + 검색 결과가 없습니다.\' (0.7 69p 4)', '.main-empty-state']],
    'popMainFraud.html': [['체크박스 \'오늘은 다시 보지 않기\' → \'오늘 하루 보지 않기\' (0.7 62p 1)', '.checkbox-text']],
    'transferBankSelectError.html': [['오류 문구 \'입력하신 정보를…\' → \'입력한 정보를 다시 확인해주세요.\' (0.7 137p 2)', '.error-text']],
    'bottomSheetTransferWalletAddress.html': [['제목 \'지갑주소\' → \'받는 분 전자지갑 주소 입력\' (0.7 140p 1)', '.bottom-sheet-title']],
    'historyDetailBadge.html': [['거래 구분 \'받기\' → \'받음\' (0.7 72p)', '.common-badge']],
    'cashReceiptIssueComplete.html': [
      ['거래 구분 \'받기\' → \'받음\' (0.7 72p)', '.common-badge'],
      ['\'현금영수증 발행을 요청했습니다.\' 토스트 추가 (0.7 243p 4)', '.common-toast-bottom'],
    ],
    'bottomSheetMyWalletQR.html': [['새 화면: 내 지갑 QR 바텀시트 \'상대방이 이 QR을 스캔하면 나에게 송금할 수 있어요.\' (0.7 61p)', '.wallet-qr-guide']],
    'paymentProcessing.html': [['새 화면: 결제 진행 \'결제하는 중이에요\' (0.7 101p 1)', '.convert-progress-title']],
    'popTransferRecipientLimit.html': [['새 화면: 받는 분 지갑 한도 초과·거래 제한 송금 실패 팝업 (0.7 142p 5)', '.modal-dialog-content']],
    'terms_bottom_sheet_withdraw.html': [['새 화면: \'자동 출금을 이용하려면 동의가 필요해요\' 약관 동의 (0.7 216p 1-1)', '.bottom-sheet-title']],
    'walletDetailBizDeleteToast.html': [['새 화면: 사업자 정보 삭제 후 \'사업자 정보를 삭제했습니다.\' 토스트 (0.7 92p 5-2)', '.common-toast-bottom']],
    'bizWalletDetailModifyToast.html': [['새 화면: 사업자 정보 변경 후 \'사업자 정보를 변경했습니다.\' 토스트 (0.7 92p 6-2)', '.common-toast-bottom']],
    'popSignupCreateCert.html': [['새 화면: KB국민인증서 미발급 안내 팝업 \'전자지갑을 만들려면 KB국민인증서가 필요해요.\' (0.7 36p 3)', '.modal-dialog-container']],
    'popSignupKbWalletJoined.html': [['새 화면: 국민지갑 서비스 가입 완료 안내 팝업 \'국민지갑 서비스에 가입했어요\' (0.7 38p 2)', '.modal-dialog-container']],
    'popSignupAccountUnavailable.html': [['새 화면: 사용 불가 계좌 안내 팝업 \'사용 불가한 계좌입니다. 다시 선택해주세요.\' (0.7 40p 7)', '.modal-dialog-container']],
    'popSignupAccountPasswordExceed.html': [['새 화면: 계좌 비밀번호 인증 횟수 초과 시 연결 계좌 변경 안내 팝업 (0.7 44p 3)', '.modal-dialog-container']],
    'privacy_policy_list.html': [
      ['새 화면: 개인정보처리방침 개정 목록, 최신 개정이 맨 위 (0.7 236p 2)', '.policy-list'],
      ['개정 항목 터치 → 개인정보처리방침 개정 팝업 (0.7 236p 2-1)', '.policy-list'],
    ],
    'privacy_policy_pdf_popup.html': [['새 화면: 개인정보처리방침 개정 팝업, 받아온 PDF 파일을 읽어 표시, 좌/우 넘김, \'개정사항 비교표 보기\' (0.7 237p 2)', '.modal-pdf-viewer .modal-dialog-container']],
    'terms_pdf_popup.html': [['새 화면: 약관 및 이용 동의 팝업, 받아온 PDF 파일을 읽어 표시, 좌/우 넘김 (0.7 235p 2)', '.modal-pdf-viewer .modal-dialog-container']],
  };

  var file = decodeURIComponent(location.pathname.split('/').pop() || '');
  var notes = NOTES[file];
  if (!notes) return;

  var STORE_KEY = 'kbPubListChecked';
  var readChecked = function () {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY) || '{}') || {};
    } catch (e) {
      return {};
    }
  };
  var writeChecked = function (value) {
    var saved = readChecked();
    if (value) saved[file] = true;
    else delete saved[file];
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(saved));
    } catch (e) {}
  };

  var css =
    '.pcn-dim{position:fixed;inset:0;z-index:2147483000;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box}' +
    '.pcn-box{width:100%;max-width:420px;max-height:80vh;display:flex;flex-direction:column;background:#fff;border-radius:16px;box-shadow:0 8px 24px rgba(0,0,0,.2);font-family:inherit;color:#111;text-align:left}' +
    '.pcn-head{padding:20px 20px 8px}.pcn-title{margin:0;font-size:17px;font-weight:700;line-height:1.4}' +
    '.pcn-file{margin:4px 0 0;font-size:12px;color:#8e8e93;font-family:Consolas,"Courier New",monospace}' +
    '.pcn-list{margin:0;padding:4px 20px 8px;list-style:none;overflow-y:auto}' +
    '.pcn-item{position:relative;padding:9px 0 9px 14px;border-bottom:1px solid #f0f0f2;font-size:14px;line-height:1.5;word-break:keep-all}' +
    '.pcn-item:last-child{border-bottom:none}.pcn-item::before{content:"";position:absolute;left:2px;top:17px;width:5px;height:5px;border-radius:50%;background:#0068b7}' +
    '.pcn-item.pcn-link{cursor:pointer;color:#0068b7}.pcn-item.pcn-link::after{content:" 위치 보기 ›";font-size:12px;color:#8e8e93;white-space:nowrap}' +
    '.pcn-foot{display:flex;gap:8px;padding:12px 20px 20px}' +
    '.pcn-btn{flex:1;height:44px;display:flex;align-items:center;justify-content:center;margin:0;padding:0 8px;border:none;border-radius:10px;font-size:15px;font-weight:600;line-height:1.2;text-align:center;cursor:pointer}' +
    '.pcn-close{background:#f0f0f2;color:#3a3a3c}.pcn-done{background:#0068b7;color:#fff}.pcn-done.is-done{background:#e5f0f8;color:#0068b7}' +
    '.pcn-fab{position:fixed;right:12px;bottom:96px;z-index:2147483000;height:36px;display:flex;align-items:center;margin:0;padding:0 14px;line-height:1;border:none;border-radius:18px;background:#0068b7;color:#fff;font-size:13px;font-weight:600;box-shadow:0 4px 12px rgba(0,0,0,.2);cursor:pointer}' +
    '.pcn-highlight{outline:3px dashed #f23f3f !important;outline-offset:2px !important;animation:pcn-blink .5s ease-in-out 6 alternate}' +
    '@keyframes pcn-blink{from{outline-color:#f23f3f}to{outline-color:transparent}}';

  var el = function (tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  };

  var dim;
  var fab;

  var highlight = function (selector) {
    var targets = document.querySelectorAll(selector);
    if (!targets.length) return;
    targets[0].scrollIntoView({ block: 'center', behavior: 'smooth' });
    targets.forEach(function (node) {
      node.classList.remove('pcn-highlight');
      void node.offsetWidth;
      node.classList.add('pcn-highlight');
    });
    setTimeout(function () {
      targets.forEach(function (node) {
        node.classList.remove('pcn-highlight');
      });
    }, 3200);
  };

  var close = function () {
    if (dim) dim.remove();
    dim = null;
    fab.style.display = '';
  };

  var open = function () {
    fab.style.display = 'none';
    dim = el('div', 'pcn-dim');
    var box = el('div', 'pcn-box');
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    var head = el('div', 'pcn-head');
    head.appendChild(el('h3', 'pcn-title', '스토리보드 반영으로 바뀐 곳'));
    head.appendChild(el('p', 'pcn-file', file));
    var list = el('ul', 'pcn-list');
    notes.forEach(function (note) {
      var selector = note[1];
      var hasTarget = selector && document.querySelector(selector);
      var item = el('li', 'pcn-item' + (hasTarget ? ' pcn-link' : ''), note[0]);
      if (hasTarget) {
        item.addEventListener('click', function () {
          close();
          highlight(selector);
        });
      }
      list.appendChild(item);
    });
    var foot = el('div', 'pcn-foot');
    var closeBtn = el('button', 'pcn-btn pcn-close', '닫기');
    closeBtn.type = 'button';
    closeBtn.addEventListener('click', close);
    var doneBtn = el('button', 'pcn-btn pcn-done');
    doneBtn.type = 'button';
    var renderDone = function () {
      var isDone = readChecked()[file] === true;
      doneBtn.textContent = isDone ? '확인 완료됨 (누르면 해제)' : '확인 완료';
      doneBtn.classList.toggle('is-done', isDone);
    };
    doneBtn.addEventListener('click', function () {
      writeChecked(readChecked()[file] !== true);
      renderDone();
    });
    renderDone();
    foot.appendChild(closeBtn);
    foot.appendChild(doneBtn);
    box.appendChild(head);
    box.appendChild(list);
    box.appendChild(foot);
    dim.appendChild(box);
    dim.addEventListener('click', function (event) {
      if (event.target === dim) close();
    });
    document.body.appendChild(dim);
  };

  var init = function () {
    var style = el('style');
    style.textContent = css;
    document.head.appendChild(style);
    fab = el('button', 'pcn-fab', '바뀐 곳');
    fab.type = 'button';
    fab.addEventListener('click', open);
    document.body.appendChild(fab);
    open();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
