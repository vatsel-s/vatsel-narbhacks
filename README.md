# PantryPal

PantryPal is a cross-platform (Web + React Native) app to help you track your pantry, discover recipes you can make, plan meals, and reach your nutrition goals. Built with Convex, Clerk, and modern React/React Native.

## Features

- **Authentication:** Secure sign-in/sign-up with Clerk.
- **Pantry Management:** Add, view, search, and delete pantry ingredients. Expiration date picker included.
- **Recipes:**
  - View all recipes.
  - See which recipes you can make with your current pantry.
  - Mark recipes as made (auto-updates pantry quantities).
  - View recipe details (ingredients, nutrition info).
  - Recipes are ranked by how well they match your nutrition goals.
- **Meal Planner:**
  - Schedule recipes on a calendar.
  - Remove scheduled meals.
  - Date picker for easy scheduling.
- **Nutrition Goals:**
  - Add, view, and delete nutrition goals (e.g., calories, protein).
  - Date picker for start/end dates.
- **Friends & Social Feed:**
  - Add, accept, and reject friends.
  - See friends' activity in a social feed.
- **Modern UI:**
  - Tab navigation with icons.
  - Responsive web and mobile design.

## Tech Stack
- **Frontend:** React, React Native, Expo
- **Backend:** Convex (serverless, real-time)
- **Auth:** Clerk
- **UI:** Tailwind CSS (web), React Native Paper + custom (native)
- **Calendar/Date Picker:** @react-native-community/datetimepicker

## Getting Started

### Prerequisites
- Node.js (18+ recommended)
- pnpm (or npm/yarn)
- Expo CLI (for native)

### Setup
1. Clone the repo:
   ```sh
   git clone <repo-url>
   cd vatsel-narbhacks
   ```
2. Install dependencies:
   ```sh
   pnpm install
   # or npm install
   ```
3. Set up environment variables:
   - Copy `.example.env` to `.env` in both `apps/web` and `apps/native` and fill in your Clerk/Convex keys.
4. Start the backend (Convex):
   ```sh
   cd packages/backend
   pnpm dev
   ```
5. Start the web app:
   ```sh
   cd apps/web
   pnpm dev
   ```
6. Start the native app:
   ```sh
   cd apps/native
   pnpm start
   # or expo start
   ```

## Contributing
- Fork the repo and create a feature branch.
- Open a pull request with a clear description.
- Please write clear commit messages and test your changes.

## License
MIT
