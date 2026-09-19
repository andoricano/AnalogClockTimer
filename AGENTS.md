# AGENTS.md

## Project Overview

AnalogClockTimer is a timer application with two separate clients:

* `native-app/`: Expo + React Native application
* `web-app/`: Vite + React web application

The native application is the primary implementation and contains the intended test-schedule timer structure. Its current TypeScript/build verification has a known unresolved issue; see **Verification Status** below. The web application is a simplified standalone timer implementation.

Treat the two applications as separate implementations unless a task explicitly requires changes to both.

---

## Core Development Principles

### 1. Preserve the existing architecture

Prefer extending the existing architecture over introducing a new architectural pattern.

Do not:

* Replace the existing state-management approach without an explicit requirement.
* Move business logic into UI components unnecessarily.
* Merge the native and web implementations.
* Introduce a new framework or library when the existing implementation can support the requirement.
* Perform unrelated refactoring during a feature change.

Keep changes focused on the requested task.

### 2. Verify the existing implementation before changing it

Before modifying code:

* Inspect the relevant existing files.
* Trace the existing data flow.
* Identify the existing hook, context, storage module, or utility responsible for the behavior.
* Reuse existing abstractions when appropriate.

Do not infer an architecture that is not supported by the existing code.

If the implementation differs from the documentation, treat the actual code as the current source of truth.

### 3. Keep UI and business logic separated

Components and screens should primarily handle:

* Rendering
* User interaction
* Passing events to hooks or other application logic

Business logic should remain in the appropriate:

* hooks
* context
* storage modules
* utility modules

For the native application in particular:

* Timer execution logic belongs in `src/hooks/useTimer.ts`.
* Timer schedule creation/edit/delete logic belongs in `src/hooks/useSetTimer.ts`.
* Persistent schedule data belongs behind the storage layer.
* Time parsing and calculation belongs in `src/utils/timer.ts`.

Do not move this logic into screens or presentational components without a clear reason.

### 4. Preserve the native and web separation

`native-app` and `web-app` currently have separate implementations of similar concepts.

Do not automatically create shared packages or shared source files merely because both applications contain similar functionality.

If a change is required in both applications, evaluate each implementation independently and preserve their platform-specific behavior.

### 5. Respect the existing storage abstraction

Native user data is persisted through the storage layer.

Use the existing storage modules instead of accessing AsyncStorage directly from screens or components.

Do not bypass the existing storage abstraction unless the task explicitly requires changing that abstraction.

### 6. Do not introduce dependencies unnecessarily

Before adding a dependency:

1. Check whether the existing project already provides the required functionality.
2. Check whether the functionality can reasonably be implemented using existing code.
3. Add a dependency only when it provides a meaningful benefit for the requested task.

Do not add libraries simply to replace existing implementations.

### 7. Preserve existing behavior

When implementing a new feature:

* Do not change unrelated timer behavior.
* Do not change existing navigation behavior without a requirement.
* Do not change storage formats without considering existing persisted data.
* Do not remove existing functionality merely because it appears unused.
* Do not delete files only because they are not currently imported.

Existing unused or disconnected files may be intentionally retained for future use.

### 8. Distinguish existing issues from newly introduced issues

The repository may contain pre-existing TypeScript or build issues.

When verifying a change:

* Identify errors that existed before the change.
* Do not automatically attribute existing errors to the current modification.
* Do not fix unrelated pre-existing problems unless explicitly requested.
* If a verification command cannot run because dependencies or tooling are unavailable, report that fact rather than claiming verification succeeded.

### 9. Avoid speculative changes

Do not invent:

* APIs
* backend services
* authentication
* networking layers
* state-management systems
* architectural conventions
* platform behavior

unless they are required by the task or verified in the existing project.

If an implementation detail is unknown, inspect the repository before deciding.

---

## Project Structure

### Native

```text
native-app/
├── App.tsx
├── index.ts
└── src/
    ├── components/
    │   ├── schedule/
    │   ├── timeline/
    │   ├── modals/
    │   └── guide/
    ├── context/
    ├── hooks/
    ├── screens/
    ├── types/
    └── utils/
        └── storage/
```

### Web

```text
web-app/
└── src/
    ├── components/
    ├── context/
    ├── hooks/
    ├── screens/
    └── utils/
```

Refer to `ARCHITECTURE.md` for the current architecture and data flow.

---

## Native Application Rules

The native application uses:

* React Native
* Expo
* TypeScript
* React Navigation Native Stack
* React Context
* React hooks
* AsyncStorage
* `react-native-google-mobile-ads`
* `react-native-draggable-flatlist`

The native application contains implementations for:

* Test schedule creation
* Test schedule editing
* Test schedule deletion
* Test schedule reordering
* Persistent schedule storage
* Schedule-based timer execution structure (currently unverified because of the known TypeScript issue)
* Analog clock display
* Current-time clock display
* Banner advertising

Maintain these behaviors unless the task explicitly changes them.

### Navigation

The native navigation currently follows:

```text
Home
├── Setting
├── SetTimer
├── Timer
└── Clock
```

All five routes are sibling screens registered in the same Native Stack in `native-app/App.tsx`. `SetTimer` starts a selected schedule by calling `navigation.navigate('Timer', { id: currentId })`; `Timer` is not a nested child route of `SetTimer`.

Navigation types are defined in:

```text
native-app/src/types/navigation.ts
```

Use the existing navigation types and route structure.

### Timer

The main native timer engine is:

```text
native-app/src/hooks/useTimer.ts
```

It manages timer execution and schedule progression.

The schedule-based timer structure is an implementation intent, not a currently build-verified capability. `TimerScreen.tsx` imports `defaultExamData`, but `testStorage.ts` does not export it. Native TypeScript verification therefore currently fails.

Do not duplicate timer progression logic in screens or components.

### Schedule Editing

Schedule creation/editing logic is primarily handled by:

```text
native-app/src/hooks/useSetTimer.ts
```

Keep schedule mutation logic there unless the architecture is intentionally changed.

### Storage

Native persistent schedule data is stored through:

```text
native-app/src/utils/storage/
```

The storage layer owns AsyncStorage interaction.

### Time Handling

Time parsing, formatting, and duration calculations are handled by:

```text
native-app/src/utils/timer.ts
```

Maintain the existing handling of:

* `HH:mm`
* `HH:mm:ss`
* second-based timer calculations
* schedules crossing midnight

---

## Web Application Rules

The web application is a separate simplified implementation.

It currently provides:

* A single timer
* Current-time mode
* Timer setting dialog
* Analog clock

It does not currently provide:

* Persistent storage
* Test schedules
* Schedule editing
* Native navigation
* Advertising

Do not add native-specific behavior to the web application unless explicitly requested.

The main web timer logic is:

```text
web-app/src/hooks/useTimer.ts
```

---

## Code Style

Use TypeScript for application code.

Follow the existing naming conventions:

* Components: `PascalCase`
* Hooks: `useXxx`
* Utility modules: feature-oriented names
* React Native styles: `StyleSheet.create`
* Web styles: follow the existing local styling approach

Do not introduce a new styling convention without a specific reason.

---

## Verification

### Verification Status

The native application has a confirmed pre-existing TypeScript issue: `native-app/src/screens/TimerScreen.tsx` imports `defaultExamData` from `testStorage`, but that module does not export it. As a result, native TypeScript verification and a normal native build are currently unverified. Do not describe schedule-based timer execution as confirmed working until this issue is resolved and verification succeeds.

Use the project's existing commands when applicable.

### Web

```bash
npm run dev
npm run build
npm run lint
```

### Native

```bash
npm run start
npm run android
npm run ios
npm run web
```

Do not claim a command passed unless it was actually executed successfully.

If dependencies are missing or a command cannot execute, report the exact limitation.

---

## Change Scope

For each task:

1. Understand the existing implementation.
2. Identify the smallest appropriate change.
3. Implement the requested behavior.
4. Preserve unrelated behavior.
5. Run the relevant available verification.
6. Report any pre-existing or unrelated errors separately.

Do not perform broad cleanup, refactoring, dependency upgrades, or architectural changes unless explicitly requested.
