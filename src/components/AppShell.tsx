import type { PropsWithChildren } from "react";
import { navigate } from "../hooks/useHashRoute";
import { useMessages } from "../i18n/useMessages";

function isCurrentNavigationTarget(href: string, currentHash: string): boolean {
  if (href === "#/what-if") return currentHash === href || currentHash.startsWith(`${href}/`);
  return currentHash === href;
}

export function AppShell({ children }: PropsWithChildren) {
  const messages = useMessages();
  const currentHash = window.location.hash || "#/dashboard";
  const links = [
    ["#/dashboard", messages.navOverview],
    ["#/gpa", messages.navGpa],
    ["#/what-if", messages.navWhatIf],
    ["#/data", messages.navData],
    ["#/settings", messages.navSettings],
    ["#/about", messages.navAbout],
  ] as const;

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        {messages.skipToContent}
      </a>
      <header className="topbar">
        <button className="brand" onClick={() => navigate("/dashboard")} aria-label={messages.homeLabel}>
          <span className="brand__mark">G</span>
          <span>
            <strong>{messages.appName}</strong>
            <small>{messages.tagline}</small>
          </span>
        </button>
        <nav aria-label="Primary navigation">
          {links.map(([href, label]) => (
            <a
              href={href}
              key={href}
              aria-current={isCurrentNavigationTarget(href, currentHash) ? "page" : undefined}
            >
              {label}
            </a>
          ))}
        </nav>
      </header>
      <main id="main-content" className="main-content">
        {children}
      </main>
      <footer className="footer">
        <span>{messages.madeBy}</span>
        <a href="https://github.com/sanskarIN" target="_blank" rel="noreferrer">
          {messages.github}
        </a>
        <a href="https://buymeacoffee.com/sanskarIN" target="_blank" rel="noreferrer">
          {messages.buyMeCoffee}
        </a>
      </footer>
    </div>
  );
}
