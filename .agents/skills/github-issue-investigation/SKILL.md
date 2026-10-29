---
name: github-issue-investigation
description: Investigate or refine this repository's GitHub issues with screenshots, small disposable prototypes, and evidence posted to the issue. Use when visual or behavioral exploration would clarify a proposal, bug, acceptance criteria, or implementation choice; exploration does not authorize feature implementation.
---

# GitHub issue investigation

Use visual evidence and small experiments to understand what an issue proposes before treating it as an implementation specification. Screenshots and prototypes are optional tools: use them when they answer a concrete question, not as a checklist for every issue.

## Choose useful evidence

- Read the issue, its discussion, and the relevant implementation first. Identify what remains uncertain and what observation would resolve it.
- Capture the existing interface when layout, navigation, responsiveness, or interaction matters. Use the relevant browser, native app, or terminal capture tools. Desktop and phone views help when the question concerns responsive behavior; include a short recording when still images cannot explain an interaction.
- Build the smallest runnable prototype when a proposed flow, layout, terminal interface, or technical behavior needs exploration. Compare alternatives only when that comparison helps decide the issue's scope.
- Clearly distinguish the existing implementation, a proposed design, and synthetic sample content. Record the branch/commit, viewport or host, relevant configuration, and steps needed to understand the observation. Do not invent local facts or imply a prototype proves native or production behavior that was not exercised.

## Disposable prototype exception

The repository owner explicitly permits throwaway prototypes for issue investigation **without committing them or following the feature implementation/testing workflow**.

- Keep prototype source, temporary dependencies, and captures in an isolated, ignored scratch directory such as `.tmp/issue-<number>/` inside the session worktree, or a session-owned OS temporary directory. Do not modify tracked product files to create the experiment. Use the repository's worktree guidance when creating a checkout.
- Do not require TDD, automated test suites, linting, full repository builds, feature documentation, handoffs, commits, PRs, or Cloudflare deployments just to explore a disposable prototype. Run it only as far as needed to answer the question and report its limits.
- Keep prototype processes and ports separate from other sessions. Stop the processes you started and remove only scratch resources you own when they are no longer needed.
- This exception applies only to exploratory artifacts. An experiment is not a feature implementation, and approval to investigate or create an issue does not authorize implementing it. If implementation is requested, make the production change separately under the normal repository quality, documentation, commit, and PR rules.

## Put the evidence on the issue

The owner authorizes posting relevant investigation findings and captures to the GitHub issue being worked on. Follow the repository's start/progress/completion comment guidance and the `writing-issues` skill when refining the ticket. Preserve existing discussion; append dated findings instead of silently replacing an agreed scope.

Publish a concise issue comment that includes:

- **Question:** the uncertainty or proposed behavior being explored.
- **Evidence:** annotated screenshots or recordings and a short account of the prototype or reproduction. Label each capture as existing behavior or an exploratory prototype, and identify sample content.
- **Findings:** what was actually observed, its limitations, and how it changes the proposed behavior or acceptance criteria. Separate observations from recommendations and unresolved choices.
- **Implementation status:** state that no product implementation was made when the work was exploratory. Identify remaining decisions and their owner or mark them unassigned.

Attach images through a supported GitHub upload workflow, or link durable review artifacts on an already authorized host that the issue's readers can access. Use image Markdown when the uploaded URL supports it. Do not commit throwaway source or captures just to obtain a link, invent an attachment API, or post local filesystem/localhost links as if they were remotely accessible.

When direct upload or artifact hosting is unavailable, still post the textual findings, state the attachment limitation, and report where local captures were retained to the user. Never claim screenshots are attached until the published issue shows working attachments or links. Check the posted comment and links before deleting local artifacts.

Exclude credentials, private resident records, and unrelated private content from public captures. Recording evidence does not authorize production content mutations or new hosting services.

## Finish

Summarize the issue link, the question answered, the evidence posted, and any remaining uncertainty. Keep exploration distinct from shipped behavior. Check that no prototype files have been staged or included in a commit.
