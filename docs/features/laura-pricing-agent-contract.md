# Laura pricing contract for Sanity agents

Status: Available

## Job to be done

When an editing agent can access Sanity but not the repository, it needs the complete Prices contract so it can prepare valid edits and report publication accurately.

## Visible behavior

The deployed `pricesPage` schema identifies project `uag6kepo`, dataset `production`, the `pricesPage` singleton and `drafts.pricesPage`. Its description points to `options.agentEditingContract`, a versioned JSON string available through Sanity schema discovery.

The contract describes fixed/from/range/quote modes, required and incompatible fields, positive finite amounts, ordered range bounds, currency/scope, optional sections, service references, stable array keys, preservation of existing drafts and revision guards. Examples are explicitly illustrative. Current production remains quote-only unless the owner approves real rates and terms.

Every Prices field has readable help. The full JSON is schema metadata, so agents can retrieve it without adding helper content to published documents. Studio and website validation behavior stays the same.

Publishing changes Sanity immediately; the website changes after a successful rebuild/deployment. A Sanity-only agent must report website deployment as unverified without external evidence. The contract does not promise that a webhook or workflow has succeeded.

## Acceptance criteria

- The actual Sanity schema API returns the complete JSON contract in schema options.
- A reader using only serialized schema metadata can identify the singleton, all required fields and publication limits.
- All four exported examples pass the real validator; missing required and incompatible fields fail.
- Metadata-only examples produce valid full page data through the website build reader.
- The published Prices document revision and quote-only options are unchanged.

## Scope

Includes schema descriptions, structured agent metadata, contract conformance tests and production Studio/schema deployment. Excludes changes to public page layout, commercial rates, publishing permissions, webhooks and website validation rules. An agent must read and follow the contract; this does not add server-side enforcement to arbitrary API writes.
