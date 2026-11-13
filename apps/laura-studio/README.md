# Laura content editing

Production Studio: <https://laura-faichney-all-things-art.sanity.studio/>.
Project: `uag6kepo`; dataset: `production`.

## Prices contract for Sanity-only agents

Read the deployed `pricesPage` schema before editing. With the Sanity connector:

```json
{"projectId": "uag6kepo", "dataset": "production", "type": "pricesPage"}
```

Pass that object to `get_schema`. The schema description points to
`options.agentEditingContract`, a JSON string containing the complete versioned
contract. Parse it as JSON; its examples are illustrative, not approved rates.

The contract includes singleton/draft IDs, required page fields, all four pricing
modes, required and incompatible values, supported currency codes, category and
service relationships, array keys, reference lookup, draft preservation and
revision guards. Every Prices field also has readable help.

Read existing published content and drafts, preserve unrequested edits, validate
before publishing, and re-read the result. API writes do not necessarily enforce
custom JavaScript validation. The current release remains quote-only unless the
owner approves real prices and terms.

Publishing changes Sanity. Website changes require a successful rebuild and
deployment. A Sanity-only agent must report deployment as unverified without
external evidence; it must not infer success from a publish or webhook request.

Source: `shared/lauraPricingContract.ts`. Schema field help and exported options
are maintained in `schemaTypes/pricesPage.ts`. Changes require deploying the
Studio/schema; editing normal Prices content does not update these instructions.

Run `bun run test:unit`, `bun run typecheck` and `bun run build` in this app.
Contract tests read only JSON-serializable schema metadata, then exercise actual
pricing validators using the exported examples and field requirements.
