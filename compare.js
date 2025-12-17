document.addEventListener("DOMContentLoaded", () => {
  // 아코디언 토글
  document.querySelectorAll(".acc-q").forEach((btn) => {
    btn.addEventListener("click", () => {
      const panel = btn.nextElementSibling;
      const opened = panel.style.display === "block";
      panel.style.display = opened ? "none" : "block";
      btn.classList.toggle("open", !opened);
    });
  });

  // 첫 섹션만 기본 오픈(가독성)
  const first = document.querySelector(".acc-q");
  if (first) first.click();
});
