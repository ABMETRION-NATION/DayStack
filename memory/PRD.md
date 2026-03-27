# DayStack PRD

## Problem Statement
Build a clean, simple mobile utility app for Android called DayStack.

Purpose:
Help users manage daily routines, recurring tasks, and one-time tasks in a fast, minimal, and useful way.

Design requirements:
- Minimalist UI
- Dark theme by default
- Clean spacing and simple layout
- No heavy animations or complex visuals
- Focus on speed and usability

Core features:
- View today's tasks
- Mark tasks as complete
- Quick-add a task from home screen
- View upcoming tasks
- Organize tasks into categories (Home, Work, Health, Hobby)
- Recurring tasks (daily, weekly, custom)
- Delete tasks
- Local storage only (no backend)

User choices captured:
- Existing tasks should be editable by tapping a task
- Custom recurrence should support both every X days and specific weekdays
- Upcoming should show the next 5 upcoming tasks
- Stats should show lifetime total completed plus weekly stats
- Dark by default, with light mode available in Settings

## Architecture
- Frontend: Expo Router + React Native + TypeScript
- State: React context for tasks and theme
- Persistence: AsyncStorage only
- Navigation: Bottom tabs + modal task editor
- Backend: Not used for app flows by request (local-only product)

## User Personas
- Busy professional tracking repeat work routines
- Student managing daily habits and one-off tasks
- General productivity user wanting a fast, low-friction planner

## Core Requirements
### P0
- Fast home dashboard for today's tasks
- Completion toggles with visible progress
- Quick add from home
- Full tasks list with category and type filters
- Add/edit task flow
- Recurring scheduling
- Delete tasks reliably
- Local persistence

### P1
- Stats summary with streak and weekly completions
- Theme toggle in settings
- Notification toggle UI
- Future sync buttons UI

### P2
- Advanced analytics and charts
- Reminder scheduling
- Sync/auth backend

## Implemented
### 2026-03-27
- Built DayStack as a local-first Expo app with bottom tab navigation
- Added Home screen with today's tasks, progress header, upcoming 5 tasks, and quick add
- Added Tasks screen with category filters, recurring/one-time filter, edit on tap, and delete support
- Added Add/Edit Task modal with one-time, daily, weekly, interval, and weekday recurrence options
- Added Stats screen with lifetime completed, weekly count, streak, and weekly activity bars
- Added Settings screen with dark/light theme toggle, notifications UI toggle, future sync buttons, and About section
- Added AsyncStorage persistence for tasks, completions, theme, and settings
- Added web-safe delete fallback while preserving swipe-delete structure for native behavior
- Added testIDs across interactive elements for automated testing

## Prioritized Backlog
### P0 Remaining
- None for the requested MVP

### P1 Remaining
- Real notifications and reminder scheduling
- Empty-state illustrations and richer onboarding guidance

### P2 Remaining
- Cloud sync and optional login
- Search, sort, and archived tasks
- Calendar view and deeper productivity insights

## Next Tasks List
- Add reminder scheduling with real device notifications
- Add optional sorting/search in the Tasks screen
- Add onboarding tips for recurrence setup and stats meaning