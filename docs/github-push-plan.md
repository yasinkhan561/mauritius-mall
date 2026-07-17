# GitHub push plan for Mauritius Mall

## 1. Prepare the repository for public release

- Add a root README that explains the product, architecture, and setup steps.
- Add a root license file.
- Add a root .gitignore to prevent secrets and build artifacts from being committed.
- Make sure local environment files such as .env remain out of version control.

## 2. Clean up repository hygiene

- Keep configuration, docs, and app code organized by feature and responsibility.
- Avoid committing temporary files, local database dumps, or generated build output.
- Use meaningful folder structure and consistent naming across backend and storefront.

## 3. Create the GitHub repository

- Create a new public repository on GitHub.
- Use a clear repository name such as `mauritius-mall`.
- Add a short description and relevant tags like `medusa`, `nextjs`, `ecommerce`, and `typescript`.

## 4. Push the code safely

```bash
git init
git branch -M main
git add .
git commit -m "chore: initialize monorepo project"
git remote add origin <your-github-repo-url>
git push -u origin main
```

## 5. Protect the main branch

- Enable branch protection for `main`.
- Require pull request reviews before merging.
- Consider requiring status checks once CI is added.

## 6. Add scalable engineering practices

- Keep backend and storefront code separated but connected through shared workspace scripts.
- Use environment-based configuration for all deployment-specific values.
- Add CI later for linting and build checks on pull requests.
- Keep the code modular so new features can be added without creating technical debt.

## 7. Deployment readiness checklist

Before shipping publicly, verify:

- Dependencies install cleanly with pnpm
- Docker services start successfully
- Database migrations run without issues
- Backend and storefront build successfully
- Sensitive values are stored in environment variables, not committed to the repo

## 8. Recommended next steps

- Add a CI workflow for build and lint validation
- Add issue templates and pull request templates
- Define a release tagging strategy for milestones
- Document deployment steps for production hosting
