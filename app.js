const STORAGE_KEY = "major_helper_result_v1";

function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }

function setRing(percent){
  const ring = document.querySelector(".ring");
  if(!ring) return;
  const deg = clamp(percent, 0, 100) * 3.6;
  ring.style.background = `conic-gradient(var(--primary) ${deg}deg, rgba(15,23,42,.10) 0deg)`;
}

function renderChart(values){
  const labels = ["개발·구현", "보안·분석", "균형도", "편향도", "보완 필요"];

  const el = document.getElementById("miniChart");
  if(!el) return;
  el.innerHTML = "";

  values.forEach((v, i) => {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = `${clamp(v, 0, 10) * 10}%`;

// 숫자 표시
    const val = document.createElement("div");
    val.className = "val";
    val.textContent = `${Number(v).toFixed(1)}%`;

// 라벨 표시 
    const label = document.createElement("span");
    label.textContent = labels[i] ?? `Skill ${i+1}`;
   
    bar.appendChild(val);
    bar.appendChild(label);
    el.appendChild(bar);
  });
}


function loadResult(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  }catch(e){
    return null;
  }
}

function renderDashboard(){
  const result = loadResult();

  // 홈에서만 렌더링되도록 안전장치
  const kpiMajor = document.getElementById("kpiMajor");
  if(!kpiMajor) return;

  /* =========================
     1️⃣ 테스트 결과가 없을 때
     ========================= */
  if(!result){
    // KPI
    document.getElementById("kpiMajor").textContent = "테스트 필요";
    document.getElementById("kpiHint").textContent =
      "성향 테스트를 완료하면 결과가 여기에 표시됩니다.";

    document.getElementById("kpiCE").textContent = "-";
    document.getElementById("kpiSEC").textContent = "-";
    document.getElementById("barCE").style.width = "0%";
    document.getElementById("barSEC").style.width = "0%";

    // 링 차트
    document.getElementById("ringScore").textContent = "--/100";
    setRing(0);

    // 요약 / 태그
    document.getElementById("summaryText").textContent =
      "아직 테스트 결과가 없습니다. 테스트를 먼저 진행해 주세요.";
    document.getElementById("chipRow").innerHTML = "";

    // 다음 행동
    const list = document.getElementById("nextActions");
    list.innerHTML =
      `<li class="muted">테스트 완료 후 추천 행동이 표시됩니다.</li>`;

    // 서브 스킬 차트 (데모 값)
    renderChart([3, 6, 5, 7, 4]);

    return; // ⚠️ 여기서 반드시 종료
  }

  /* =========================
     2️⃣ 테스트 결과가 있을 때
     ========================= */
  const {
    ceScore,
    secScore,
    major,
    tags,
    summary,
    nextActions
  } = result;

  // KPI
  document.getElementById("kpiMajor").textContent = major;
  document.getElementById("kpiHint").textContent = "마지막 테스트 결과 기준입니다.";

  document.getElementById("kpiCE").textContent = `${ceScore}%`;
  document.getElementById("kpiSEC").textContent = `${secScore}%`;

  document.getElementById("barCE").style.width =
    `${clamp(ceScore, 0, 100)}%`;
  document.getElementById("barSEC").style.width =
    `${clamp(secScore, 0, 100)}%`;

  // 링 차트 (fit score)
  const total = ceScore + secScore;
  const fit =
    total === 0 ? 0 : Math.round((Math.max(ceScore, secScore) / total) * 100);

  document.getElementById("ringScore").textContent = `${fit}/100`;
  setRing(fit);

  // 요약 텍스트
  document.getElementById("summaryText").textContent =
    summary ?? "결과 요약이 없습니다.";

  // 태그
  const chipRow = document.getElementById("chipRow");
  chipRow.innerHTML = "";
  (tags ?? []).slice(0, 6).forEach(t => {
    const chip = document.createElement("div");
    chip.className = "chip";
    chip.textContent = t;
    chipRow.appendChild(chip);
  });

  // 다음 행동
  const list = document.getElementById("nextActions");
  list.innerHTML = "";
  (nextActions ?? []).forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });

  // Sub Skill 차트 (0~10 스케일 → %로 표시됨)
  const s1 = Math.round((ceScore / 100) * 10);                       // 개발·구현
  const s2 = Math.round((secScore / 100) * 10);                      // 보안·분석
  const s3 = Math.round(((ceScore + secScore) / 200) * 10);          // 균형도
  const s4 = Math.round((Math.abs(ceScore - secScore) / 100) * 10);  // 편향도
  const s5 = Math.round(((100 - Math.min(ceScore, secScore)) / 100) * 10); // 보완 필요

  renderChart([s1, s2, s3, s4, s5]);
}


document.addEventListener("DOMContentLoaded", () => {
  const btnReset = document.getElementById("btnReset");
  if(btnReset){

    btnReset.addEventListener("click", () => {
     localStorage.removeItem(STORAGE_KEY);

  // 차트 영역 명시적으로 초기화
     const chart = document.getElementById("miniChart");
     if(chart){
      chart.innerHTML = "";
    }

  // 홈 화면을 '테스트 전 상태'로 다시 렌더링
     renderDashboard();
});
  }
  renderDashboard();
});
