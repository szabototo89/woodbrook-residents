import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

import { apps } from '../features/dashboard/registry';
import { EnvironmentsView } from '../features/environments/EnvironmentsView';
import {
  getWorkspaceEnvironments,
  parseEnvironmentFilters,
  serializeEnvironmentFilters,
  type EnvironmentFilters,
} from '../features/environments/environments';

function toSearchParams(search: Record<string, unknown>): URLSearchParams {
  return new URLSearchParams(searchEntries(search));
}

function searchEntries(
  search: Record<string, unknown>,
): Array<[string, string]> {
  return Object.entries(search).flatMap(([key, value]) =>
    typeof value === 'string' && value.length > 0 ? [[key, value]] : [],
  );
}

export const Route = createFileRoute('/_shell/environments/')({
  validateSearch: (search: Record<string, unknown>): EnvironmentFilters =>
    parseEnvironmentFilters(toSearchParams(search)),
  component: function EnvironmentsRoute() {
    const filters = Route.useSearch();
    const navigate = useNavigate();

    useEffect(() => {
      function onKeyDown(event: KeyboardEvent) {
        const target = event.target;
        if (event.key !== '/' || !(target instanceof HTMLElement)) return;
        if (target.closest('input, textarea, select, [role="dialog"]')) return;
        event.preventDefault();
        const input =
          document.querySelector<HTMLInputElement>('input[type="text"]');
        input?.focus();
      }
      window.addEventListener('keydown', onKeyDown);
      return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    function handleFiltersChange(next: EnvironmentFilters) {
      void navigate({
        to: '/environments',
        search: Object.fromEntries(serializeEnvironmentFilters(next).entries()),
      });
    }

    return (
      <EnvironmentsView
        environments={getWorkspaceEnvironments(apps)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />
    );
  },
});
