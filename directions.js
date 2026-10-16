// Optional discoveries never hide the core portfolio content.
const questions = [
  "Why is this harder than it needs to be?",
  "What does someone expect before they click?",
  "Where does the next step become unclear?",
  "How do a community’s words shape trust?",
];
document.querySelectorAll(".question-box").forEach((box) => {
  let index = 0;
  const button = box.querySelector(".question-next");
  button.hidden = false;
  button.addEventListener("click", () => {
    index = (index + 1) % questions.length;
    box.querySelector(".question-text").textContent = questions[index];
  });
});
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", () => {
    const target = document.getElementById(link.hash.slice(1));
    if (!target || target === document.body) return;
    const hadTabindex = target.hasAttribute("tabindex");
    if (!hadTabindex) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    if (!hadTabindex)
      target.addEventListener(
        "blur",
        () => target.removeAttribute("tabindex"),
        { once: true },
      );
  });
});
