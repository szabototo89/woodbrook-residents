import 'sanity'

declare module 'sanity' {
  interface DocumentOptions {
    /** JSON documentation exported with the schema for Sanity-only editing agents. */
    agentEditingContract?: string
  }
}
