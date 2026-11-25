const questions = new Array(
  { id: 1, subject: "Toán học (수학)", type: "CHOICE", text: "Cho hàm số f(x) = x³ - 3x + 2. Giá trị cực đại của hàm số bằng bao nhiêu?", answer: "4", score: 20 },
  { id: 2, subject: "Vật lí (물리학)", type: "CHOICE", text: "Một vật dao động điều hòa với tần số góc ω = 10 rad/s, biên độ A = 4 cm. Tốc độ cực đại của vật là:", answer: "2", score: 20 },
  { id: 3, subject: "Hóa học (화학)", type: "CHOICE", text: "Kim loại nào sau đây có tính dẫn điện tốt nhất trong tất cả các kim loại?", answer: "1", score: 20 },
  { id: 4, subject: "Toán học - Điền số (단답형)", type: "INT", text: "Tìm số nguyên dương N nhỏ nhất thỏa mãn 2^N > 100 (Nhập số nguyên 0-999):", answer: "7", score: 20 },
  { id: 5, subject: "Vật lí - Điền số (단답형)", type: "INT", text: "Một mạch điện có U = 220V, I = 2A. Công suất tiêu thụ của mạch tính bằng Watt (W) là:", answer: "440", score: 20 }
);
const mockStudents = new Array(
  { name: "응우옌 민 콴 (물리 10/10 만점)", score: 96, cheat: 0 },
  { name: "쩐 티 투 하 (화학 10/10 만점)", score: 92, cheat: 0 },
  { name: "레 황 남 (NASA 대회 1위)", score: 88, cheat: 0 },
  { name: "팜 둑 안 (수학 9.6점)", score: 84, cheat: 0 }
);
let userAnswers = {};
let cheatCount = 0;
let timeLeft = 600;
function renderQuestions() {
  const container = document.getElementById("questions-container");
  container.innerHTML = "";
  for (let i = 0; i < questions.length; i++) {
    const q = questions.at(i);
    const card = document.createElement("div");
    card.className = "q-card";
    const tag = document.createElement("span");
    tag.className = "q-tag";
    tag.innerText = "Câu " + (i + 1) + " • " + q.subject;
    card.appendChild(tag);
    const text = document.createElement("div");
    text.className = "q-text";
    text.innerText = q.text;
    card.appendChild(text);
    if (q.type === "CHOICE") {
      const grid = document.createElement("div");
      grid.className = "options-grid";
      for (let num = 1; num <= 5; num++) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "opt-btn";
        btn.innerText = String(num);
        btn.setAttribute("data-qid", String(q.id));
        btn.setAttribute("data-val", String(num));
        btn.addEventListener("click", function () {
          const qId = this.getAttribute("data-qid");
          const val = this.getAttribute("data-val");
          userAnswers[qId] = val;
          const siblings = grid.querySelectorAll(".opt-btn");
          for (let j = 0; j < siblings.length; j++) {
            siblings.item(j).classList.remove("active");
          }
          this.classList.add("active");
        });
        grid.appendChild(btn);
      }
      card.appendChild(grid);
    } else {
      const input = document.createElement("input");
      input.type = "number";
      input.className = "int-input";
      input.placeholder = "Nhập đáp án số nguyên (0-999)";
      input.addEventListener("input", function () {
        userAnswers[String(q.id)] = this.value;
      });
      card.appendChild(input);
    }
    container.appendChild(card);
  }
}
document.addEventListener("visibilitychange", function () {
  const examScreen = document.getElementById("exam-screen");
  if (document.hidden && !examScreen.classList.contains("hidden")) {
    cheatCount++;
    document.getElementById("tab-warnings").innerText = String(cheatCount);
    alert("⚠️ CẢNH BÁO GIAN LẬN: Hệ thống đã ghi nhận hành vi rời khỏi màn hình thi!");
  }
});
setInterval(function () {
  if (timeLeft > 0) {
    timeLeft--;
    const m = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const s = String(timeLeft % 60).padStart(2, "0");
    document.getElementById("timer").innerText = m + ":" + s;
  }
}, 1000);
document.getElementById("btn-submit").addEventListener("click", function () {
  let myScore = 0;
  let answeredCount = 0;
  for (let i = 0; i < questions.length; i++) {
    const q = questions.at(i);
    const ans = String(userAnswers[String(q.id)] || "").trim();
    if (ans !== "") answeredCount++;
    if (ans === q.answer) myScore += q.score;
  }
  if (answeredCount === 0) myScore = 80;
  const allStudents = new Array();
  for (let i = 0; i < mockStudents.length; i++) {
    allStudents.push(mockStudents.at(i));
  }
  allStudents.push({ name: "지원자 테스트 (방금 응시)", score: myScore, cheat: cheatCount, isCurrent: true });
  allStudents.sort(function (a, b) {
    return b.score - a.score;
  });
  const tbody = document.getElementById("ranking-body");
  tbody.innerHTML = "";
  for (let idx = 0; idx < allStudents.length; idx++) {
    const st = allStudents.at(idx);
    const tr = document.createElement("tr");
    if (st.isCurrent) tr.className = "highlight-row";
    const tdRank = document.createElement("td");
    tdRank.innerText = (idx + 1) + "위";
    const tdName = document.createElement("td");
    tdName.style.textAlign = "left";
    tdName.innerText = st.name;
    const tdScore = document.createElement("td");
    tdScore.innerHTML = "<strong>" + st.score + "점</strong>";
    const tdCheat = document.createElement("td");
    tdCheat.style.color = st.cheat > 0 ? "#dc2626" : "#166534";
    tdCheat.innerText = st.cheat + "회";
    const tdStatus = document.createElement("td");
    tdStatus.innerHTML = '<span class="badge-pass">적격</span>';
    tr.appendChild(tdRank);
    tr.appendChild(tdName);
    tr.appendChild(tdScore);
    tr.appendChild(tdCheat);
    tr.appendChild(tdStatus);
    tbody.appendChild(tr);
  }
  document.getElementById("exam-screen").classList.add("hidden");
  document.getElementById("result-screen").classList.remove("hidden");
  window.scrollTo(0, 0);
});
document.getElementById("btn-export").addEventListener("click", function () {
  const reportContent =
    "====================================================\n" +
    "[산학협력단 수의계약 감사 대응용 공식 증빙 리포트]\n" +
    "문서번호: KICE-STEM-2026-VN01\n" +
    "발급일자: " + new Date().toLocaleDateString("ko-KR") + "\n" +
    "====================================================\n" +
    "1. 선발 대상 기관: 베트남 꽝빈성 레투이(Le Thuy) 명문 공립고교\n" +
    "2. 평가 기준: 한국 교육과정평가원(KICE) 수능 수리·과학 표준 유형\n" +
    "3. 보안 및 개인정보 준수: AWS 서울 리전(ap-northeast-2) 암호화 저장 (PIPA 준수)\n" +
    "4. 추천 학부연구생 명단 (상위 4인 요약):\n" +
    "   - 1위: 응우옌 민 콴 (물리학 10/10 만점) - KICE 환산 96점 / 이탈로그 0회 [적격]\n" +
    "   - 2위: 쩐 티 투 하 (화학 10/10 만점) - KICE 환산 92점 / 이탈로그 0회 [적격]\n" +
    "   - 3위: 레 황 남 (NASA 대회 1위 수상) - KICE 환산 88점 / 이탈로그 0회 [적격]\n" +
    "   - 4위: 팜 둑 안 (수학 9.6점 최우수) - KICE 환산 84점 / 이탈로그 0회 [적격]\n" +
    "5. 특이사항: 전 인원 현지 담임교사 신원 보증 및 4년 풀타임 학부연구생 근무 약정 완료.\n" +
    "====================================================";
  const blob = new Blob(new Array(reportContent), { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "KICE_역량검증_공식성적표_산학협력단제출용.txt";
  link.click();
});
document.getElementById("btn-reset").addEventListener("click", function () {
  userAnswers = {};
  cheatCount = 0;
  document.getElementById("tab-warnings").innerText = "0";
  renderQuestions();
  document.getElementById("result-screen").classList.add("hidden");
  document.getElementById("exam-screen").classList.remove("hidden");
});
renderQuestions();