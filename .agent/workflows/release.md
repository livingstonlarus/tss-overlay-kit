---
description: How to release a new version (SemVer)
---

# Release New Version

## 1. Pre-Release Verification (The Robocop Gate)
**Strict Rule:** If ANY of these fail, STOP. Do not release.
1. `pnpm typecheck`
2. `pnpm lint`
3. `pnpm build`
4. `npx @semgrep/semgrep --config auto .`

## 2. Versioning
1. Determine next version (Major.Minor.Patch).
2. Update `package.json` version.
3. Update `CHANGELOG.md` with date and version header.

## 3. Git & GitHub Workflow
1. **Commit**:
   ```bash
   git commit -am "chore(release): bump to X.Y.Z"
   ```
2. **Push**:
   ```bash
   git push origin main
   ```
3. **Create PR**:
   ```bash
   gh pr create --title "Release X.Y.Z" --body "Automated release"
   gh pr merge --auto --merge
   ```
4. **Create Release**:
   ```bash
   gh release create vX.Y.Z --generate-notes
   ```

## 4. Issue Management
- If no issue exists for the task, create one.
- Use issue number in commit messages (e.g., `#123: fix: ...`).
- Close the issue after release.
