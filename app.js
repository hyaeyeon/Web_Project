const STORAGE_KEY = "major_helper_result_v1";

function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }

function setRing(percent){
  const ring = document.querySelector(".ring");
  if(!ring) return;
  const deg = clamp(percent, 0, 100) * 3.6;
  ring.style.background = `conic-gradient(var(--primary) ${deg}deg, rgba(15,23,42,.10) 0deg)`;
}

function renderChart(values){
  const el = document.getElementById("miniChart");
  if(!el) return;
  el.innerHTML = "";
  values.forEach((v, i) => {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = `${clamp(v, 0, 10) * 10}%`;
    const label = document.createElement("span");
    label.textContent = `Skill ${i+1}`;
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
  const kpiMajor = document.getElementById("kpiMajor");
  if(!kpiMajor) return; // index.html에서만 렌더

  if(!result){
    renderChart([3,6,5,7,4]);
    return;
  }

  const { ceScore, secScore, major, tags, summary, nextActions } = result;
  const total = ceScore + secScore;
  const fit = total ? Math.round((Math.max(ceScore, secScore) / total) * 100) : 0;

  document.getElementById("kpiMajor").textContent = major;
  document.getElementById("kpiCE").textContent = `${ceScore}`;
  document.getElementById("kpiSEC").textContent = `${secScore}`;

  document.getElementById("barCE").style.width = `${clamp(ceScore,0,100)}%`;
  document.getElementById("barSEC").style.width = `${clamp(secScore,0,100)}%`;

  document.getElementById("ringScore").textContent = `${fit}/100`;
  setRing(fit);

  document.getElementById("summaryText").textContent = summary ?? "결과 요약이 없습니다.";

  const chipRow = document.getElementById("chipRow");
  chipRow.innerHTML = "";
  (tags ?? []).slice(0,6).forEach(t => {
    const chip = document.createElement("div");
    chip.className = "chip";
    chip.textContent = t;
    chipRow.appendChild(chip);
  });

  const list = document.getElementById("nextActions");
  list.innerHTML = "";
  (nextActions ?? []).forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });

  // 차트는 임시로 5개 스킬로 매핑 (나중에 테스트 문항 카테고리로 연결)
  renderChart([
    Math.round((ceScore/100)*10),
    Math.round((secScore/100)*10),
    6, 7, 5
  ]);
}

document.addEventListener("DOMContentLoaded", () => {
  const btnReset = document.getElementById("btnReset");
  if(btnReset){
    btnReset.addEventListener("click", () => {
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    });
  }
  renderDashboard();
});
