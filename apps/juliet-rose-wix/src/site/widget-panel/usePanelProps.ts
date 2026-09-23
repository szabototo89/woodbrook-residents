import { widget } from '@wix/editor';
import { useEffect, useState } from 'react';

export type PanelPropsStatus = 'loading' | 'ready' | 'error';

export type PanelPropsState = Readonly<{
  values: Readonly<Record<string, string>>;
  status: PanelPropsStatus;
  error: string | null;
  save: (key: string, value: string) => Promise<void>;
}>;

export function usePanelProps(keys: readonly string[]): PanelPropsState {
  const [values, setValues] = useState<Readonly<Record<string, string>>>({});
  const [status, setStatus] = useState<PanelPropsStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const keySignature = keys.join('|');

  useEffect(() => {
    const cancellation = { current: false };
    async function loadProps() {
      setStatus('loading');
      setError(null);
      try {
        const signatureKeys =
          keySignature === '' ? [] : keySignature.split('|');
        const entries = await Promise.all(
          signatureKeys.map(async (key) => {
            const value = await widget.getProp(key);
            return [key, value ?? ''] as const;
          }),
        );
        if (!cancellation.current) {
          setValues(Object.fromEntries(entries));
          setStatus('ready');
        }
      } catch (unknownError) {
        if (!cancellation.current) {
          setError(
            unknownError instanceof Error
              ? unknownError.message
              : 'Could not load settings',
          );
          setStatus('error');
        }
      }
    }
    void loadProps();
    return () => {
      cancellation.current = true;
    };
  }, [keySignature]);

  async function save(key: string, value: string): Promise<void> {
    setValues((current) => ({ ...current, [key]: value }));
    await widget.setProp(key, value);
  }

  return { values, status, error, save };
}
