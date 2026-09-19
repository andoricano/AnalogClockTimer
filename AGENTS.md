# AGENTS.md

## Project Scope

AnalogClockTimer is a single Expo and React Native application rooted at this repository.

```text
App.tsx
index.ts
app.json
assets/
src/
```

There is no `native-app/` subproject and no web application. Treat repository-root paths as canonical.

## Confirmed Architecture

The application uses React Native, Expo, TypeScript, React Navigation Native Stack, React Context, React hooks, AsyncStorage, `react-native-google-mobile-ads`, and `react-native-draggable-flatlist`.

* `index.ts` registers `App` through Expo.
* `App.tsx` provides `TimerProvider`, initializes the navigation container, and renders the banner-ad shell.
* The Expo configuration targets iOS and Android and sets portrait orientation.

### Navigation

The following routes are sibling screens in one Native Stack defined in `App.tsx`:

```text
Home
Setting
SetTimer
Timer
Clock
```

`SetTimer` starts a selected schedule with `navigation.navigate('Timer', { id })`. `Timer` is not a child navigator of `SetTimer`. Route types are in `src/types/navigation.ts`.

### Responsibilities

Keep existing responsibilities in their current layers.

| Responsibility | Location |
| --- | --- |
| Timer execution and schedule progression | `src/hooks/useTimer.ts` |
| Schedule creation, editing, deletion, ordering, and persistence coordination | `src/hooks/useSetTimer.ts` |
| Application initialization and advertisement readiness | `src/context/TimerContext.tsx` |
| AsyncStorage wrapper and domain storage modules | `src/utils/storage/` |
| Time parsing, formatting, and duration calculations | `src/utils/timer.ts` |
| Rendering and user interaction | `src/screens/` and `src/components/` |

Do not move timer, schedule, storage, or time-calculation logic into screens or presentational components without an explicit architectural change.

### Storage

Persistent data is accessed through:

```text
src/utils/storage/storage.ts
src/utils/storage/appStorage.ts
src/utils/storage/testStorage.ts
```

Screens and components must not access `AsyncStorage` directly. Reuse or extend this storage layer instead.

## Development Rules

These maintenance rules are derived from the current code structure.

1. Preserve the single-project Expo/React Native structure. Do not introduce a web client, shared package, or state-management library unless explicitly requested.
2. Keep changes focused. Do not perform unrelated refactors, dependency upgrades, or storage-format changes as part of another task.
3. Preserve current time handling: `HH:mm` and `HH:mm:ss` values, second-based timer updates, and schedules crossing midnight.
4. Preserve the Native Stack route model and use `RootStackParamList` for route changes.
5. Use TypeScript; components use `PascalCase`, hooks use `useXxx`, and utilities use feature-oriented names.
6. Use `StyleSheet.create` for React Native styling unless an existing component requires an established alternative.
7. Do not remove a file solely because it is currently disconnected from the render path.

## Current Verification Baseline

The following facts are confirmed:

* `npx tsc --noEmit` passes. The previous `defaultExamData` import error in `src/screens/TimerScreen.tsx` has been resolved.
* `npx expo export --platform android` succeeds and creates an Android JavaScript bundle.
* `npm run lint` is unavailable because there is no `lint` script and no ESLint configuration was found.
* No test framework, test files, or CI configuration were found.
* Actual UI behavior on an emulator or device has not been verified.

The TypeScript baseline currently passes. Continue to run the type check for changes that affect TypeScript code; Android export success does not verify device UI behavior.

## Verification Guidance

Available scripts are:

```bash
npm run start
npm run android
npm run ios
npm run web
```

Use the relevant available command and report its actual result. Do not claim that a build, test, lint, or device run passed unless it executed successfully.

## Recommendations, Not Confirmed Policy

No CI, test, lint, formatting, commit, or pull-request policy was found in the repository. Any future recommendation in these areas is a proposal, not an existing project rule.


## Git Rules

- Do not create Git commits unless explicitly requested by the user.
- Do not run `git reset --hard`, `git clean`, or other destructive Git commands.
- Do not discard or overwrite user changes.
- Before making changes, inspect the current working tree when relevant.
- After making changes, report:
  - changed files
  - relevant `git diff` summary
  - verification results
- Keep each change focused on the requested task.
- Do not modify unrelated files.
