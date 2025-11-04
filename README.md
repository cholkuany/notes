# notes server

---

## 🚀 Full Deployment Guide

You can deploy in **two ways**:

### 1. Manual Deployment (`build:ui`):

Build your frontend UI and move it into your backend manually, then commit and push the code yourself.

```bash
npm run build:ui
```

This runs:

```json
"build:ui": "rm -rf dist && cd ../notes && npm run build && cp -r dist ../backend"
```

## After this, you can manually commit and push to GitHub.

### 2. Automated Deployment (`deploy:full`):

Use the `deploy:full` command to build, commit, version, tag, and push everything automatically.

#### 🧩 Deployment Command Syntax

This command is defined in your `package.json` as:

```json
"deploy:full": "node deploy.js"
```

Run it with:

```bash
npm run deploy:full "COMMIT MESSAGE" [BRANCH] [BUMP_TYPE]
```

| Argument           | Required | Description                                                            | Default |
| ------------------ | -------- | ---------------------------------------------------------------------- | ------- |
| **COMMIT MESSAGE** | ✅       | The commit message for this deployment (e.g. `"update navbar styles"`) | —       |
| **BRANCH**         | ❌       | Git branch to push to (e.g. `main`, `deploy`, `staging`)               | `main`  |
| **BUMP_TYPE**      | ❌       | Version bump type — `patch`, `minor`, or `major`                       | `patch` |

#### 🧠 Examples / Quick Reference

##### 🔹 Default Deployment (Patch Bump)

```bash
npm run deploy:full "fix spacing on homepage"
```

- Pushes to **main**
- Bumps version from `v1.0.3` → `v1.0.4`
- Creates Git tag `v1.0.4`

##### 🔹 Minor Version Bump

```bash
npm run deploy:full "add dark mode support" main minor
```

- Pushes to **main**
- Bumps version from `v1.0.4` → `v1.1.0`
- Creates Git tag `v1.1.0`

##### 🔹 Major Version Bump

```bash
npm run deploy:full "migrate to new architecture" main major
```

- Pushes to **main**
- Bumps version from `v1.1.0` → `v2.0.0`
- Creates Git tag `v2.0.0`

##### 🧩 Optional: Deploy to a Different Branch

```bash
npm run deploy:full "update docs and assets" staging patch
```

- Pushes to **staging**
- Bumps version and tags the release

##### 🧩 Optional: Bump version (Default Branch)

```bash
npm run deploy:full "update docs and assets" minor
```

- Pushes to **main**
- Bumps version from `v1.0.4` → `v1.1.0`
- Creates Git tag `v1.1.0`

##### ✅ Summary

| Deployment Type | Example Command                                      | Version Change    | Tag Example |
| --------------- | ---------------------------------------------------- | ----------------- | ----------- |
| **Patch**       | `npm run deploy:full "update footer text"`           | `v1.0.3 → v1.0.4` | `v1.0.4`    |
| **Minor**       | `npm run deploy:full "add login feature" main minor` | `v1.0.4 → v1.1.0` | `v1.1.0`    |
| **Major**       | `npm run deploy:full "new API structure" main major` | `v1.1.0 → v2.0.0` | `v2.0.0`    |
| **Major**       | `npm run deploy:full "new API structure" major`      | `v1.1.0 → v2.0.0` | `v2.0.0`    |
