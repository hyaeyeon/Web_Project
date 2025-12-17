const STORAGE_KEY = "major_helper_result_v1";

/**
 * 문항 설계
 * - type: "CE" 또는 "SEC"
 * - 점수: 1~5 (높을수록 해당 전공 성향이 강함)
 */
const QUESTIONS = [
  // CE 성향 (컴공)
  { id: "q1", type: "CE", text: "논리적으로 문제를 분해하고 해결하는 과정이 재미있다." },
  { id: "q2", type: "CE", text: "코드를 작성해 기능이 동작할 때 성취감을 크게 느낀다." },
  { id: "q3", type: "CE", text: "서비스/앱을 만들고 사용자의 경험을 개선하는 데 관심이 많다." },
  { id: "q4", type: "CE", text: "자료구조/알고리즘처럼 원리를 이해하는 공부를 선호한다." },
  { id: "q5", type: "CE", text: "새로운 기술을 빠르게 테스트하고 적용해보는 편이다." },
  { id: "q6", type: "CE", text: "팀 프로젝트에서 개발 역할을 맡는 것이 잘 맞는다." },

  // SEC 성향 (융합보안)
  { id: "q7", type: "SEC", text: "사고/이슈의 원인을 추적하고 증거를 기반으로 분석하는 것을 좋아한다." },
  { id: "q8", type: "SEC", text: "규칙(정책/표준)을 세우고 리스크를 관리하는 일에 흥미가 있다." },
  { id: "q9", type: "SEC", text: "시스템의 취약점이나 공격 방법에 대해 원리가 궁금해진다." },
  { id: "q10", type: "SEC", text: "네트워크/운영체제 같은 기반 지식을 파고드는 편이다." },
  { id: "q11", type: "SEC", text: "작은 실수도 치명적일 수 있어 꼼꼼하게 점검하는 편이다." },
  { id: "q12", type: "SEC", text: "보안 사고를 예방하는 설계(보안 고려 개발)에 관심이 있다." },
];

function el(id){ return document.getElementById(id); }

function renderQuestions(){
  const form = el("testForm");
  form.innerHTML = "";

  QUESTIONS.forEach((q, idx) => {
    const wrap = document.createElement("div");
    wrap.className = "card";
    wrap.style.boxShadow = "none";
    wrap.style.border = "1px solid rgba(15,23,42,.08)";
    wrap.style.padding = "14px";

    wrap.innerHTML = `
      <div style="display:flex; justify-content:space-between; gap:10px; align-items:flex-start;">
        <div>
          <div class="muted" style="font-weight:800; font-size:12px; letter-spacing:.2px;">
            Q${idx+1} · ${q.type === "CE" ? "컴공 성향" : "보안 성향"}
          </div>
          <div style="font-weight:850; margin-top:6px; line-height:1.35;">${q.text}</div>
        </div>
        <div class="chip" style="background: rgba(91,92,226,.08); border-color: rgba(91,92,226,.14);">
          1 ~ 5
        </div>
      </div>

      <div style="display:flex; gap:10px; margin-top:12px; flex-wrap:wrap;">
        ${[1,2,3,4,5].map(v => `
          <label style="display:flex; align-items:center; gap:8px; padding:8px 10px; border:1px solid rgba(15,23,42,.08); border-radius:12px; cursor:pointer; background: rgba(255,255,255,.7);">
            <input type="radio" name="${q.id}" value="${v}" />
            <span style="font-weight:750">${v}</span>
          </label>
        `).join("")}
      </div>
    `;

    form.appendChild(wrap);
  });

  form.addEventListener("change", updateProgress);
}

function getAnswers(){
  const data = {};
  QUESTIONS.forEach(q => {
    const checked = document.querySelector(`input[name="${q.id}"]:checked`);
    data[q.id] = checked ? Number(checked.value) : null;
  });
  return data;
}

function updateProgress(){
  const answers = getAnswers();
  const answered = Object.values(answers).filter(v => v !== null).length;
  const total = QUESTIONS.length;

  const pct = Math.round((answered / total) * 100);
  el("progressBar").style.width = `${pct}%`;
  el("progressText").textContent = `${answered} / ${total} answered`;
}

function calcResult(){
  const answers = getAnswers();
  const unanswered = Object.values(answers).some(v => v === null);
  if(unanswered){
    alert("모든 문항에 응답해 주세요.");
    return null;
  }

  let ceRaw = 0;
  let secRaw = 0;

  QUESTIONS.forEach(q => {
    const v = answers[q.id];
    if(q.type === "CE") ceRaw += v;
    if(q.type === "SEC") secRaw += v;
  });

  // 6문항 * 5점 = 30점 만점 → 0~100으로 정규화
  const ceScore = Math.round((ceRaw / 30) * 100);
  const secScore = Math.round((secRaw / 30) * 100);

  const major = ceScore === secScore
    ? "둘 다 잘 맞음"
    : (ceScore > secScore ? "컴퓨터공학과" : "융합보안학과");

  const summary =
    major === "둘 다 잘 맞음"
      ? "두 전공 성향이 비슷하게 나타났습니다. 비교 페이지에서 흥미 분야(개발/보안/데이터/네트워크)를 기준으로 최종 선택을 추천합니다."
      : (major === "컴퓨터공학과"
          ? "문제 해결·구현 중심 성향이 강합니다. 프로젝트 기반 학습과 개발 경험을 쌓을수록 적합도가 더 높아집니다."
          : "분석·예방·리스크 관리 성향이 강합니다. 네트워크/시스템 기반 지식을 쌓고 보안 사고 사례를 학습하면 강점이 커집니다.");

  const tags = buildTags(ceScore, secScore);
  const nextActions = buildNextActions(major);

  return { ceScore, secScore, major, summary, tags, nextActions };
}

function buildTags(ceScore, secScore){
  const tags = [];
  if (ceScore >= 70) tags.push("구현/개발 지향");
  if (ceScore >= 60) tags.push("문제 해결");
  if (secScore >= 70) tags.push("리스크/예방 지향");
  if (secScore >= 60) tags.push("분석/추적");

  // 균형형
  if (Math.abs(ceScore - secScore) <= 10) tags.push("균형형");

  // 취향 태그 (UI용)
  tags.push("커리큘럼 비교");
  tags.push("진로 로드맵");
  return tags.slice(0, 6);
}

function buildNextActions(major){
  if(major === "컴퓨터공학과"){
    return [
      "기초: Python/Java 중 하나로 미니 프로젝트 1개 만들기",
      "DB/웹: 간단한 CRUD 페이지 구조 이해하기",
      "협업: Git 브랜치/PR 흐름 연습하기"
    ];
  }
  if(major === "융합보안학과"){
    return [
      "기초: 네트워크(HTTP/DNS) 흐름 요약하기",
      "보안: OWASP Top 10 키워드 정리하기",
      "실습: 간단한 로그 분석 시나리오 따라하기"
    ];
  }
  return [
    "Compare에서 흥미 키워드로 전공 차이 확인하기",
    "Roadmap에서 목표 직무를 먼저 정해보기",
    "학습 선호(개발/분석/정책)를 기준으로 선택 정리하기"
  ];
}

function renderResult(result){
  el("resultCard").style.display = "block";
  el("resMajor").textContent = result.major;
  el("resCE").textContent = `${result.ceScore}`;
  el("resSEC").textContent = `${result.secScore}`;

  el("resBarCE").style.width = `${result.ceScore}%`;
  el("resBarSEC").style.width = `${result.secScore}%`;

  el("resReason").textContent = result.summary;

  const tagWrap = el("resTags");
  tagWrap.innerHTML = "";
  result.tags.forEach(t => {
    const chip = document.createElement("div");
    chip.className = "chip";
    chip.textContent = t;
    tagWrap.appendChild(chip);
  });
}

function clearForm(){
  QUESTIONS.forEach(q => {
    document.querySelectorAll(`input[name="${q.id}"]`).forEach(r => r.checked = false);
  });
  updateProgress();
  el("resultCard").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  renderQuestions();
  updateProgress();

  let lastResult = null;

  el("btnCalc").addEventListener("click", () => {
    const r = calcResult();
    if(!r) return;
    lastResult = r;
    renderResult(r);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  });

  el("btnSubmit").addEventListener("click", () => {
    const r = calcResult();
    if(!r) return;
    lastResult = r;
    renderResult(r);
    alert("결과를 확인한 뒤, Save to Dashboard를 눌러 저장하세요.");
  });

  el("btnSave").addEventListener("click", () => {
    if(!lastResult){
      alert("먼저 Calculate로 결과를 산출해 주세요.");
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lastResult));
    alert("저장 완료! Dashboard로 이동합니다.");
    location.href = "index.html";
  });

  el("btnClear").addEventListener("click", clearForm);
});
