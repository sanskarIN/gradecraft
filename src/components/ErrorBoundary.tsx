import { Component, type ErrorInfo, type PropsWithChildren, type ReactNode } from "react";
import { log } from "../data/logger";
import { Button } from "./Button";

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<PropsWithChildren, State> {
  override state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  override componentDidCatch(error: unknown, info: ErrorInfo) {
    log("error", "ui.unhandled", {
      kind: error instanceof Error ? error.name : "unknown",
      componentStackPresent: Boolean(info.componentStack),
    });
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <main className="main-content" id="main-content">
          <div className="page-stack">
            <section className="card">
              <p className="eyebrow">Recovery mode</p>
              <h1>GradeCraft hit an unexpected error</h1>
              <p>
                Your saved browser data has not been intentionally changed. Reload the app to retry from the last
                persisted state.
              </p>
              <div className="form-actions">
                <Button onClick={() => window.location.reload()}>Reload GradeCraft</Button>
                <Button variant="secondary" onClick={() => this.setState({ hasError: false })}>
                  Try again
                </Button>
              </div>
            </section>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}
