import type { Plugin } from 'vite';

export function watchHandoffDocuments(directory: string): Plugin {
  return {
    name: 'watch-handoff-documents',
    configureServer(server) {
      const refresh = () => {
        server.moduleGraph.invalidateAll();
        server.ws.send({ type: 'full-reload' });
      };
      const refreshDocument = (file: string) => {
        if (file.startsWith(`${directory}/`) && file.endsWith('/index.mdx'))
          refresh();
      };
      server.watcher.add(directory);
      server.watcher.on('add', refreshDocument);
      server.watcher.on('unlink', refreshDocument);
      server.watcher.once('ready', refresh);
    },
  };
}
