"use client";

import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";

/**
 * Error boundary : affiche un état d'erreur explicite (quoi + comment corriger)
 * au lieu d'un écran blanc. Les erreurs sont consignées dans la console.
 */
export class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Error boundary:", error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="max-w-sm rounded-2xl border border-error/25 bg-error/10 p-6 text-center">
          <p className="text-sm font-semibold text-error">
            Une erreur est survenue
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">
            Le rendu de cette page a échoué. Rechargez la page pour repartir.
          </p>
          <p className="mt-3 truncate rounded-md bg-surface-base px-2 py-1 font-mono text-[11px] text-text-muted">
            {this.state.error.message}
          </p>
          <button
            type="button"
            onClick={() => this.setState({ error: null })}
            className="mt-4 rounded-lg bg-accent px-3.5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-accent-hover"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }
}