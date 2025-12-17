const STORAGE_KEY = "major_helper_result_v1";

const ROADMAPS = {
  backend: {
    now: [
      "Java 또는 Python 문법 정리",
      "HTTP/REST 기본 구조 이해",
      "간단한 CRUD 흐름 설계"
    ],
    next: [
      "DB(MySQL) 기초 쿼리 실습",
      "Spring/FastAPI 구조 이해",
      "미니 API 프로젝트"
    ],
    later: [
      "트래픽/성능 개념 학습",
      "협업(Git, PR) 경험",
      "포트폴리오 정리"
    ]
  },
  frontend: {
    now: [
      "HTML/CSS 레이아웃 연습",
      "JavaScript 기본 문법",
      "반응형 UI 이해"
    ],
    next: [
      "React 기본 컴포넌트",
      "상태 관리 개념",
      "UI 클론 프로젝트"
    ],
    later: [
      "UX 개선 경험",
      "API 연동 구조 이해",
      "배포 경험"
    ]
  },
  security: {
    now: [
      "네트워크 기본 개념",
      "운영체제 구조 이해",
      "보안 사고 사례 분석"
    ],
    next: [
      "로그 분석 실습",
      "OWASP Top 10 정리",
      "침해사고 대응 흐름"
    ],
    later: [
      "보안 자동화 개념",
      "실무 도구 경험",
      "전문 분야 선택"
    ]
  },
  consultant: {
    now: [
      "정보보안 개론 정리",
      "보안 정책/법 개요",
      "위험 관리 개념"
    ],
    next: [
      "보안 점검 시나리오",
      "모의 컨설팅 리포트",
      "커뮤니케이션 연습"
    ],
    later: [
      "자격증 로드맵 정리",
      "실무 사례 연구",
      "전문 컨설팅 분야 선택"
    ]
  }
};

function $(id){ return document.getElementById(id); }

function loadResult(){
  try{
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  }catch{
    return null;
  }
}

function renderRoadmap(jobKey){
  const data = ROADMAPS[jobKey];
  if(!data) return;

  $("roadmapCard").style.display = "block";

  renderList("stepNow", data.now);
  renderList("stepNext", data.next);
  renderList("stepLater", data.later);
}

function renderList(id, items){
  const ul = $(id);
  ul.innerHTML = "";
  items.forEach(text => {
    const li = document.createElement("li");
    li.textContent = text;
    ul.appendChild(li);
  });
}

function highlightRecommended(){
  const result = loadResult();
  if(!result) return;

  let recommended = null;
  if(result.major === "컴퓨터공학과") recommended = ["backend", "frontend"];
  if(result.major === "융합보안학과") recommended = ["security", "consultant"];

  if(!recommended) return;

  document.querySelectorAll(".job-btn").forEach(btn => {
    if(recommended.includes(btn.dataset.job)){
      btn.style.border = "2px solid var(--primary)";
      btn.style.background = "rgba(91,92,226,.12)";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  highlightRecommended();

  document.querySelectorAll(".job-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".job-btn").forEach(b => b.classList.remove("primary"));
      btn.classList.add("primary");

      renderRoadmap(btn.dataset.job);
    });
  });
});
