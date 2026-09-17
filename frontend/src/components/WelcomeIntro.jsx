import { useEffect, useState } from "react";

export function WelcomeIntro({ userName, message: customMessage, subtitle = "Pessoas no centro. Gestão com propósito.", onComplete }) {
  const message = customMessage ?? `Bem-vindo, ${userName}`;
  const [text, setText] = useState("");
  const [phase, setPhase] = useState("typing");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const characterDelay = reducedMotion ? 0 : 70;
    const fadeDuration = reducedMotion ? 0 : 600;
    const typingDuration = characterDelay * message.length;
    const exitStart = fadeDuration + typingDuration + 850;
    const timers = [];

    document.body.classList.add("welcome-intro-active");

    if (reducedMotion) {
      setText(message);
    } else {
      [...message].forEach((_, index) => {
        timers.push(window.setTimeout(() => setText(message.slice(0, index + 1)), fadeDuration + characterDelay * (index + 1)));
      });
    }

    timers.push(window.setTimeout(() => setPhase("leaving"), exitStart));
    timers.push(window.setTimeout(() => {
      setVisible(false);
      document.body.classList.remove("welcome-intro-active");
      onComplete?.();
    }, exitStart + fadeDuration + 50));

    return () => {
      timers.forEach(window.clearTimeout);
      document.body.classList.remove("welcome-intro-active");
    };
  }, [message]);

  if (!visible) return null;

  return (
    <div className={`welcome-intro ${phase === "leaving" ? "is-leaving" : ""}`} style={{ "--welcome-fade-duration": "600ms" }} role="status" aria-live="polite" aria-label={message}>
      <div className="welcome-intro-content">
        <img className="welcome-intro-logo" src="/assets/Logo%20Rh.png" alt="Alpha RH" />
        <div className="welcome-intro-rule" aria-hidden="true" />
        <p aria-hidden="true"><span className="welcome-intro-reserve">{message}</span><span className="welcome-intro-typed">{text}<i /></span></p>
        <small>{subtitle}</small>
      </div>
      <span className="welcome-intro-footer" aria-hidden="true">SEU ESPAÇO DE GESTÃO DE PESSOAS</span>
    </div>
  );
}
