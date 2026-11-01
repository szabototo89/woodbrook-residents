import '@lynx-js/types';

declare module '@lynx-js/types' {
  interface GlobalProps {
    /** Top safe-area inset in logical pixels, supplied by the native host. */
    safeAreaTop?: number;
  }
}
