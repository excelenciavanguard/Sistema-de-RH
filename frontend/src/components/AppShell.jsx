import { Header } from "./ui/header-3";

export function AppShell({ children, route, hideHeader = false }) {
  return (
    <div className={`app-shell${hideHeader ? " interview-mode-shell" : ""}`}>
      {!hideHeader ? <Header route={route} /> : null}
      {children}
    </div>
  );
}
