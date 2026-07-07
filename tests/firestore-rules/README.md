# Firestore Rules Tests (Phase 6C.10.1)

## Prerequisites

- **Node.js** 20+
- **Yarn** 1.22+
- **Java** 11+ (required by Firestore emulator)

Verify Java:

```bash
java -version
```

## Run

From repository root:

```bash
yarn install
yarn test:rules
```

The script runs `firebase emulators:exec` which starts a temporary Firestore emulator, executes 36 rules tests, then shuts down.

## Cursor / VS Code note

`yarn test:rules` unsets `VSCODE_CWD` so `firebase-tools` resolves template paths correctly inside the IDE terminal.

## Manual emulator

```bash
cp .firebaserc.example .firebaserc   # placeholder project id only
yarn emulators:start
```

## Suites (36 tests)

| File | Tests |
|------|-------|
| `multiTenant.test.ts` | 4 |
| `userProfile.test.ts` | 2 |
| `orgMembership.test.ts` | 4 |
| `assessmentSessions.test.ts` | 6 |
| `clinical.test.ts` | 4 |
| `research.test.ts` | 5 |
| `catalogs.test.ts` | 3 |
| `reports.test.ts` | 4 |
| `auditLogs.test.ts` | 4 |
