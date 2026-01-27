---
description: Safe deployment flow: Build, Check, Commit, Push
---

1. Run the build to ensure no errors
// turbo
2. npm run build

3. Check git status
// turbo
4. git status

5. Stage all changes
// turbo
6. git add .

7. Commit the changes. (PROMPT: Generate a semantic commit message based on the recent changes)

8. Push to the remote repository
// turbo
9. git push
