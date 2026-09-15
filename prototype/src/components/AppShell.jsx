import { Header } from "./ui/header-3";

export function AppShell({ children, route }) {
  return (
    <div className="app-shell">
      <Header route={route} />
      {children}
    </div>
  );
}
