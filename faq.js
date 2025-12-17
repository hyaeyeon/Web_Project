const FAQS = [
  {
    q: "컴퓨터공학과는 수학을 잘해야 하나요?",
    a: "기초적인 수학과 논리적 사고가 도움이 됩니다. 다만 모든 과목이 고급 수학을 요구하는 것은 아니며, 프로그래밍과 문제 해결 능력이 더 중요하게 작용합니다."
  },
  {
    q: "융합보안학과는 코딩을 못해도 괜찮을까요?",
    a: "기본적인 코딩 이해는 필요하지만, 개발자 수준의 구현 능력보다는 분석, 시스템 이해, 보안 원리 파악이 더 중요합니다."
  },
  {
    q: "두 전공의 가장 큰 차이점은 무엇인가요?",
    a: "컴퓨터공학과는 ‘무언가를 만드는 것’에 초점이 있고, 융합보안학과는 ‘문제를 예방하고 분석하는 것’에 초점이 있습니다."
  },
  {
    q: "취업 전망은 어떤 전공이 더 좋은가요?",
    a: "두 전공 모두 IT 산업에서 수요가 높습니다. 중요한 것은 전공보다도 개인의 역량, 프로젝트 경험, 관심 분야입니다."
  },
  {
    q: "전공 선택 전에 어떤 준비를 해보면 좋을까요?",
    a: "간단한 코딩 실습이나 보안 사례 조사처럼 각 전공의 특징을 체험해보는 것이 도움이 됩니다."
  },
  {
    q: "전공을 바꿀 수 있는 기회가 있나요?",
    a: "대부분의 학교에서는 전과나 복수전공, 부전공 등의 제도가 있으므로 학과 공지와 학사 규정을 확인해 보는 것이 좋습니다."
  }
];

const faqList = document.getElementById("faqList");
const searchInput = document.getElementById("searchInput");

function renderFaq(items){
  faqList.innerHTML = "";

  items.forEach((item, idx) => {
    const wrap = document.createElement("div");
    wrap.style.borderBottom = "1px solid rgba(15,23,42,.08)";
    wrap.style.padding = "14px 0";

    wrap.innerHTML = `
      <div
        class="faq-q"
        data-index="${idx}"
        style="
          display:flex;
          justify-content:space-between;
          align-items:center;
          cursor:pointer;
          font-weight:800;
        "
      >
        <span>${item.q}</span>
        <span style="color:var(--muted)">+</span>
      </div>
      <div
        class="faq-a"
        style="
          display:none;
          margin-top:8px;
          color:var(--muted);
          line-height:1.5;
        "
      >
        ${item.a}
      </div>
    `;

    faqList.appendChild(wrap);
  });
}

function attachToggle(){
  document.querySelectorAll(".faq-q").forEach(qEl => {
    qEl.addEventListener("click", () => {
      const answer = qEl.nextElementSibling;
      const icon = qEl.querySelector("span:last-child");

      const opened = answer.style.display === "block";
      answer.style.display = opened ? "none" : "block";
      icon.textContent = opened ? "+" : "−";
    });
  });
}

searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.trim();

  const filtered = FAQS.filter(item =>
    item.q.includes(keyword) || item.a.includes(keyword)
  );

  renderFaq(filtered);
  attachToggle();
});

// 초기 렌더
renderFaq(FAQS);
attachToggle();
