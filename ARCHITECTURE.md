# Architecture

## Overview

AnalogClockTimer is composed of two independent applications:

* `native-app/`: Expo + React Native application
* `web-app/`: Vite + React web application

The native application is the primary implementation and contains the intended test-schedule timer structure. A known TypeScript issue currently prevents its normal build/type-check verification; see **Current Verification Notes**.

The web application is a simplified standalone timer implementation.

The two applications contain separate implementations of similar concepts. There is currently no shared source package between them.

---

# Repository Structure

```text
AnalogClockTimer/
├── README.md
├── native-app/
│   ├── App.tsx
│   ├── index.ts
│   ├── app.json
│   └── src/
│       ├── components/
│       │   ├── schedule/
│       │   ├── timeline/
│       │   ├── modals/
│       │   └── guide/
│       ├── context/
│       ├── hooks/
│       ├── screens/
│       ├── types/
│       └── utils/
│           └── storage/
│
└── web-app/
    └── src/
        ├── components/
        ├── context/
        ├── hooks/
        ├── screens/
        └── utils/
```

---

# Native Application

## Technology

* React Native
* Expo
* TypeScript
* React Navigation Native Stack
* React Context API
* React hooks
* AsyncStorage
* `react-native-google-mobile-ads`
* `react-native-draggable-flatlist`

The native application is configured for portrait orientation and supports iOS and Android through Expo configuration.

---

## Native Navigation

The native application uses React Navigation Native Stack.

```text
Home
├── Setting
├── SetTimer
├── Timer
└── Clock
```

All five routes are sibling screens registered in the same Native Stack in `native-app/App.tsx`. `SetTimer` moves to `Timer` by calling `navigation.navigate('Timer', { id: currentId })`; `Timer` is not nested under `SetTimer`.

### Home

The initial screen.

Displays the stored test schedule list.

### Setting

Provides application settings, including deletion of all stored test timers.

### SetTimer

Used to create, edit, and view a test schedule.

The screen receives:

* `mode`
* optional `id`

The supported modes are represented by the existing navigation/type definitions.

### Timer

Contains the UI and implementation intent to execute a selected test schedule. This behavior is not currently build-verified because of the known TypeScript issue described in **Current Verification Notes**.

It receives an optional schedule ID.

### Clock

Displays the current time as a full-screen-style analog clock.

---

# Native State Management

The native application uses React state, effects, and Context API rather than an external global state library.

## Global Context

The native context currently contains:

* `clockMode`
* advertisement readiness (`isAdReady`)
* initial storage readiness (`isInitialized`)

The application also has timer-specific state contained inside hooks.

## Timer State

`native-app/src/hooks/useTimer.ts` manages timer execution state including:

* `timerStatus`
* current schedule
* current schedule item index
* subject name
* start time
* end time
* rendering/current time

Timer states include:

```text
READY
RUNNING
PAUSED
FINISHED
```

## Schedule Editing State

`native-app/src/hooks/useSetTimer.ts` manages:

* create mode
* edit mode
* view mode
* schedule title
* schedule contents
* target schedule ID
* schedule creation
* schedule modification
* schedule deletion
* schedule reordering
* automatic persistence

---

# Native Data Flow

The primary native data flow is:

```text
Application startup
      ↓
TimerProvider
      ↓
Check AsyncStorage initialization
      ↓
First launch?
      ├── Yes → Save examTemplateList to TEST_LIST
      └── No
      ↓
HomeScreen
      ↓
Read TEST_LIST
      ↓
Display schedule list
      ↓
SetTimerScreen / useSetTimer
      ↓
Create / edit / delete / reorder
      ↓
Persist complete schedule array to TEST_LIST
      ↓
TimerScreen
      ↓
Load schedule by ID
      ↓
useTimer
      ↓
Run the implementation that advances schedule items every second
      ↓
Next item or FINISHED
```

---

# Native Persistent Storage

Native persistent data is stored using AsyncStorage.

The storage implementation is located under:

```text
native-app/src/utils/storage/
```

The application uses a storage abstraction rather than having screens directly manage AsyncStorage.

## Initial Templates

The first-launch templates are defined in code.

Current templates include:

* `고등학교 시험`
* `공무원 시험`

These are stored as the initial `TEST_LIST` data when required.

---

# Timer Model

Schedule times are represented as strings.

Supported representations include:

```text
HH:mm
HH:mm:ss
```

The timer engine converts these values into seconds for timer calculations.

When an end time is earlier than its start time, the implementation treats the end time as belonging to the following day by adding 24 hours.

The timer implementation is written to progress on a one-second basis. Normal native build execution is currently unverified because of the known TypeScript issue.

When the current schedule item finishes:

```text
Current item
    ↓
Next schedule item
    ↓
...
    ↓
FINISHED
```

---

# Native Component Structure

## Schedule

The main schedule UI follows:

```text
HomeScreen
└── TestScheduleList
    └── TestScheduleItemRow
```

The schedule list represents stored test timers.

## Timeline

The schedule editing UI follows:

```text
SetTimerScreen
└── TimelineList
    └── TimelineItemRow
```

`react-native-draggable-flatlist` is used for schedule item reordering.

## Timer Settings

```text
SetTimerScreen
└── TimerSettingDialog
    └── TimeBlockInput
```

## Timer Screen

```text
TimerScreen
├── AnalogClock
├── ScheduleController
└── TimelineSelectDialog
```

## Clock Screen

```text
ClockScreen
└── AnalogClock
```

---

# Native Business Logic

Business logic is primarily separated from rendering.

| Responsibility                        | Location                              |
| ------------------------------------- | ------------------------------------- |
| Timer execution                       | `native-app/src/hooks/useTimer.ts`    |
| Schedule creation/edit/delete/reorder | `native-app/src/hooks/useSetTimer.ts` |
| Persistent storage                    | `native-app/src/utils/storage/`       |
| Time parsing/formatting/calculation   | `native-app/src/utils/timer.ts`       |
| Navigation types                      | `native-app/src/types/navigation.ts`  |

Screens and components primarily handle rendering and user interaction.

---

# Native External Integrations

There is no application backend or external HTTP API currently implemented.

The native application uses the following external integrations.

## AsyncStorage

Used for local persistent storage.

```text
@react-native-async-storage/async-storage
```

## Google Mobile Ads

Used for banner advertising.

```text
react-native-google-mobile-ads
```

The application:

* initializes the advertising SDK at startup
* reads the banner ad unit ID from `EXPO_PUBLIC_BANNER_ID`
* tracks advertisement readiness
* displays the banner outside the Timer screen according to the current UI logic

Expo configuration also contains Android production advertisement application configuration and an iOS test advertisement application ID.

---

# Web Application

## Technology

* React
* Vite
* TypeScript
* React Context API
* React hooks

The web application is intentionally simpler than the native application.

---

# Web Navigation

There is no router or multi-screen navigation.

The structure is:

```text
App
└── TimerScreen
```

---

# Web State Management

The web application uses React state, effects, hooks, and Context API.

The global context currently stores:

```text
clockMode
```

Timer state is maintained by:

```text
web-app/src/hooks/useTimer.ts
```

The timer manages:

* start time
* end time
* running state
* rendering/current time

---

# Web Data Flow

The web application does not persist schedules.

Its primary flow is:

```text
TimerScreen
      ↓
TimerSetting / TimerSettingDialog
      ↓
User enters time range
      ↓
useTimer.setTimeRange
      ↓
Timer state
      ↓
TimerScreen
```

There is no AsyncStorage or server persistence in the current web implementation.

---

# Web Component Structure

```text
TimerScreen
├── Header
├── AnalogClock
├── TimerSetting
└── TimerSettingDialog
    └── TimeBlockInput
```

---

# Native vs Web

| Area                 | Native                                | Web                      |
| -------------------- | ------------------------------------- | ------------------------ |
| Runtime              | React Native + Expo                   | React + Vite             |
| Navigation           | React Navigation Stack                | None                     |
| Screens              | Multiple                              | Single                   |
| Test schedules       | Yes                                   | No                       |
| Schedule CRUD        | Yes                                   | No                       |
| Schedule persistence | AsyncStorage                          | None                     |
| Timer                | Intended schedule-based structure; not build-verified | Single timer             |
| Advertising          | Google Mobile Ads                     | None                     |
| UI styling           | React Native StyleSheet               | Inline/local web styling |
| Timer state          | `READY / RUNNING / PAUSED / FINISHED` | Running boolean          |
| Storage              | Local                                 | None                     |

---

# Unused or Disconnected Files

The following files exist in the repository but were not found in the current application render/import path during the architecture inspection:

* `native-app/src/components/guide/GuideOverlay.tsx`
* `native-app/src/components/guide/TimerGuidComponents.tsx`
* `native-app/src/utils/storage/timeStorage.ts`
* `native-app/src/components/TimerSetting.tsx`

Their presence does not by itself indicate that they should be removed.

---

# Development and Verification

## Web

Available project commands include:

```bash
npm run dev
npm run build
npm run lint
```

The web build uses:

```text
tsc -b && vite build
```

## Native

Available commands include:

```bash
npm run start
npm run android
npm run ios
npm run web
```

No test framework, test files, or CI configuration were identified during the architecture inspection.

---

# Current Verification Notes

The architecture inspection identified the following existing verification issues.

## Native TypeScript Issue

`native-app/src/screens/TimerScreen.tsx` imports `defaultExamData` from `testStorage`, but the corresponding `testStorage.ts` does not currently export `defaultExamData`.

This is an existing codebase issue identified during inspection.

## Web Dependency Issue

The web build could not be executed successfully in the inspection environment because:

```text
tsc: command not found
```

The `web-app/node_modules` dependencies were not installed in that environment.

Therefore, web build success was not verified.

These findings describe the state observed during the architecture inspection and should not be interpreted as architectural requirements.
