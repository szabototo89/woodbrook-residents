import { actions, apps, infraLinks } from './registry';

export function DashboardPage() {
  return (
    <main id="main-content">
      <header className="dash-hero">
        <p className="dash-kicker">Woodbrook · Developer dashboard</p>
        <h1>Workspace status and actions</h1>
        <p>
          Tracked applications, infrastructure deep-links, and runnable
          workspace actions for software engineers.
        </p>
      </header>

      <section aria-labelledby="apps-heading">
        <h2 id="apps-heading">Applications</h2>
        <ul className="dash-grid">
          {apps.map((app) => (
            <li key={app.name} className="dash-card">
              <h3>{app.name}</h3>
              <p>{app.description}</p>
              <p className="dash-meta">{app.stack}</p>
              <p>
                <a href={app.localUrl}>{app.localUrl}</a>
              </p>
              <ul>
                {Object.entries(app.scripts).map(([name, command]) => (
                  <li key={name}>
                    <code>
                      {name}: {command}
                    </code>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="infra-heading">
        <h2 id="infra-heading">Infrastructure</h2>
        <ul>
          {infraLinks.map((link) => (
            <li key={link.label}>
              <a href={link.url}>
                {link.label} ({link.group})
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="actions-heading">
        <h2 id="actions-heading">Build actions</h2>
        <ul>
          {actions.map((action) => (
            <li key={action.label}>
              <strong>{action.label}:</strong> <code>{action.command}</code>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
