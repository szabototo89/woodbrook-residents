# GitHub issue investigation

Status: Available

## Job to be done

When a GitHub proposal or bug is unclear, a maintainer wants screenshots or a small experiment attached to the issue so the implementation scope follows observed behavior.

## Visible behavior

- Project guidance and `writing-issues` route UI, design, layout, responsiveness and interaction tickets to `github-issue-investigation` before filing, including issue-only requests.
- Visual issues receive relevant screenshots or recordings and findings before completion. Design comparisons use paired application/reference captures at matching viewports. A concrete capture or reproduction blocker is recorded when evidence is unavailable.
- Small throwaway prototypes remain optional. Prototypes stay in ignored scratch space and do not require feature tests, builds, commits, handoffs, PRs, or deployment.
- Issue comments identify the question, evidence, findings, limitations, and remaining decisions. Prototype results are labelled as exploratory; sample content is identified.
- Captures use supported GitHub uploads or accessible links on an already authorized host. When upload is unavailable, the issue receives textual findings and an explicit attachment limitation.
- Product implementation requires its own authorization and follows the repository's normal workflow.

## Acceptance criteria

- Given an issue-only request concerns UI or design, when the ticket is finalized, then it contains relevant visual evidence or a concrete blocker after checking available tools/runtimes.
- Given design alignment is requested, when current evidence is collected, then paired captures compare the application and reference at matching viewports and comparable content states.
- Given motion or native rotation is reported, when evidence is recorded, then the host actually exercised is identified and browser resizing is not presented as native proof.
- Given screenshots are feasible, when acceptance criteria are drafted, then a future screenshot requirement does not substitute for collecting current evidence.
- Given an issue is nonvisual, when it is filed, then no irrelevant screenshots or prototype are required.
- Given an experiment is disposable, when it is explored, then its source and captures remain uncommitted and isolated from tracked product files.
- Given evidence is posted, when another reader opens the issue, then observed behavior, proposals, sample content, and limitations are distinguishable.
- Given an attachment cannot be uploaded, when findings are posted, then the agent states the limitation without claiming a local path is an accessible attachment.
- Given only investigation is requested, when the work finishes, then no product implementation is claimed or performed.

## Scope

Included: a project-local skill, automatic discovery metadata, and repository guidance for issue investigation.

Excluded: a new uploader, new artifact hosting, changes to resident applications, and relaxing implementation quality rules.
