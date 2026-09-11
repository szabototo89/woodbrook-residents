export function formatErrorChain(error: unknown) {
  const messages: string[] = [];
  const seen = new Set<unknown>();

  const collect = (current: unknown): void => {
    if (current === undefined || current === null || seen.has(current)) {
      return;
    }
    seen.add(current);
    const message =
      current instanceof Error ? current.message : String(current);

    if (message && !messages.includes(message)) {
      messages.push(message);
    }

    collect(current instanceof Error ? current.cause : undefined);
  };

  collect(error);

  return messages.length > 0 ? messages : ['Unknown build error.'];
}
