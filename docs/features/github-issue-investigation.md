# GitHub issue investigation

Status: Available

## Job to be done

When a GitHub proposal or bug is unclear, a maintainer wants screenshots or a small experiment attached to the issue so the implementation scope follows observed behavior.

## Visible behavior

- The project skill `github-issue-investigation` guides issue exploration when visual or behavioral evidence helps.
- Agents may capture additional screenshots, recordings, and small throwaway prototypes. Prototypes stay in ignored scratch space and do not require feature tests, builds, commits, handoffs, PRs, or deployment.
- Issue comments identify the question, evidence, findings, limitations, and remaining decisions. Prototype results are labelled as exploratory; sample content is identified.
- Captures use supported GitHub uploads or accessible links on an already authorized host. When upload is unavailable, the issue receives textual findings and an explicit attachment limitation.
- Product implementation requires its own authorization and follows the repository's normal workflow.

## Acceptance criteria

- Given an issue needs visual clarification, when the skill is applied, then the agent chooses evidence that answers a concrete question rather than creating artifacts for every issue.
- Given an experiment is disposable, when it is explored, then its source and captures remain uncommitted and isolated from tracked product files.
- Given evidence is posted, when another reader opens the issue, then observed behavior, proposals, sample content, and limitations are distinguishable.
- Given an attachment cannot be uploaded, when findings are posted, then the agent states the limitation without claiming a local path is an accessible attachment.
- Given only investigation is requested, when the work finishes, then no product implementation is claimed or performed.

## Scope

Included: a project-local skill, automatic discovery metadata, and repository guidance for issue investigation.

Excluded: a new uploader, new artifact hosting, changes to resident applications, and relaxing implementation quality rules.
