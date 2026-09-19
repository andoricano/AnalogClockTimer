# Architecture

## Scope and Evidence

This document describes the repository as inspected from its root. It is a single Expo and React Native project; no `native-app/` or `web-app/` directory exists.

Statements under **Confirmed implementation** are based on current source and configuration. **Recommendations and unknowns** are not established project policy.

## Repository Structure

```text
AnalogClockTimer/
├── App.tsx
├── index.ts
├── app.json
├── package.json
├── tsconfig.json
├── assets/
│   ├── analog_clock_icon.png
│   └── icon.png
└── src/
    ├── components/
    │   ├── guide/
    │   ├── modals/
    │   ├── schedule/
    │   └── timeline/
    ├── context/
    ├── hooks/
    ├── screens/
    ├── types/
    └── utils/
        └── storage/
```

## Confirmed Implementation

### Technology and Entry Points

* Runtime: React Native 0.85 with Expo SDK 56.
* Language: TypeScript with `strict: true`.
* Entry point: `index.ts`, which registers `App` with Expo.
* App shell: `App.tsx`, which wraps `MainLayout` in `TimerProvider` and `GestureHandlerRootView`.
* `app.json` targets iOS and Android and sets portrait orientation.

Dependencies include React Navigation Native Stack, AsyncStorage, Google Mobile Ads, and a draggable flat-list implementation.

### Navigation

`App.tsx` declares one React Navigation Native Stack. All routes are siblings:

```text
Home        initial route; stored schedule list
Setting     application settings and stored-schedule reset
SetTimer    create, edit, or view a schedule
Timer       run a selected schedule
Clock       current-time analog clock
```

`RootStackParamList` in `src/types/navigation.ts` defines route parameters. `SetTimer` reaches `Timer` with `navigation.navigate('Timer', { id: currentId })`; there is no nested `Timer` route below `SetTimer`.

### State Management

The code uses React state, effects, and Context rather than an external state-management library.

`TimerProvider` in `src/context/TimerContext.tsx` supplies `isInitialized`, `isAdReady`, and `clockMode`/`setClockMode`.

`useTimer` in `src/hooks/useTimer.ts` separately owns `timerStatus` (`READY`, `RUNNING`, `PAUSED`, `FINISHED`), timeline state, current subject, start/end/rendering time, and another local `clockMode`/setter.

The Context `clockMode` and `useTimer` `clockMode` are separate values. `TimerScreen` consumes the hook-local value; no synchronization was found.

`useSetTimer` in `src/hooks/useSetTimer.ts` owns editor mode, title, timeline, and target ID, and coordinates persistence for create/edit/delete/reorder actions.

### Data Flow

```text
App startup
  → TimerProvider
  → read init_app from AsyncStorage
  → first launch: save examTemplateList to TEST_LIST
  → HomeScreen reads TEST_LIST and displays it
  → SetTimerScreen / useSetTimer creates, edits, deletes, or orders schedules
  → testStorage writes the complete TEST_LIST
  → SetTimerScreen navigates to Timer with the selected ID
  → TimerScreen loads the schedule
  → useTimer advances rendering time each second
  → next timeline item or FINISHED
```

An end time earlier than its start time is handled as a next-day time by adding 24 hours.

### Local Storage

`src/utils/storage/storage.ts` wraps AsyncStorage. Domain modules use it:

| Module | Keys / role |
| --- | --- |
| `appStorage.ts` | `init_app`, first-launch flag |
| `testStorage.ts` | `TEST_LIST`, stored `ExamTimer` array and default templates |
| `timeStorage.ts` | timer time/minute/start/end keys; not found in the active render/import path |

Screens and UI components do not directly import AsyncStorage.

### Business Logic and Components

* `src/hooks/useTimer.ts`: timer progression, status transitions, current-item switching, time-range validation.
* `src/hooks/useSetTimer.ts`: schedule editor mode and storage-backed CRUD/order actions.
* `src/utils/timer.ts`: time conversion, formatting, and total-duration calculation.
* `src/components/schedule/`: saved schedule list and timer controls.
* `src/components/timeline/`: editable/reorderable timeline rows.
* `src/components/modals/`: timeline selection and time-entry dialogs.
* `src/components/AnalogClock.tsx`: clock-face rendering.

`GuideOverlay`, `TimerGuidComponents`, `timeStorage`, and `components/TimerSetting` exist but were not found in the active render/import path. Their presence alone does not establish that they should be removed.

### External Integrations

No application backend, HTTP API, authentication, or server data layer was found.

The app uses AsyncStorage for local persistence and `react-native-google-mobile-ads` for startup initialization and conditional banner display outside the `Timer` screen.

## Current Verification Baseline

### Commands Run

```bash
npx tsc --noEmit
npx expo export --platform android --output-dir /private/tmp/analog-clock-timer-native-baseline-after-default-fix
npx expo config --type public
npm ci --dry-run
npm run lint
npm run start -- --offline
adb devices
```

### Results

| Check | Result | Evidence |
| --- | --- | --- |
| TypeScript | Succeeded | `npx tsc --noEmit` completed after removal of the stale `defaultExamData` reference |
| Android Expo export | Succeeded | Metro bundled `index.ts` and produced an Android JavaScript bundle |
| Dependency lock consistency | Succeeded | `npm ci --dry-run` reported up to date |
| Lint | Unavailable | No `lint` script or ESLint configuration found |
| Automated tests | Unavailable | No test framework or test files found |
| Development server | Partially checked | Expo started project initialization offline; UI was not inspected |
| Device/emulator run | Not verified | `adb` daemon could not start in this environment because listener creation was not permitted |

Both TypeScript verification and Android JavaScript export currently succeed. Neither result verifies actual device or emulator UI behavior.

### Confirmed Existing Errors and Warnings

1. The previous `defaultExamData` import and `default_csat` branch in `TimerScreen` were removed because the legacy export no longer exists and no current route supplies that ID. TypeScript verification now passes.
2. Expo reports that the root-level `react-native-google-mobile-ads` key in `app.json` is an ignored extra configuration key. The plugin configuration nested under `expo.plugins` was still parsed.

Actual device UI behavior has not been verified.

## Recommendations and Unknowns

No CI, test, lint, formatter, commit, or pull-request policy was found. These should not be assumed.

Continue to run TypeScript verification and the relevant Expo build or device workflow when adding functionality. This is a development recommendation, not an existing automated policy.
