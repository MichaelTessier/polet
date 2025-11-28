# Polet - Expo App Instructions

## Project Architecture

This is an **Expo React Native app** using:

- **Expo Router** with file-based routing (`app/` directory structure)
- **Stack navigation** as root layout (simple setup)
- **TypeScript** with strict mode and path aliases (`@/*` → project root)
- **Minimal template** structure (previous complex setup moved to `app-example/`)

## Key File Structure Patterns

```
client/
  app/
    _layout.tsx         # Root stack navigation layout
    index.tsx           # Main screen (basic welcome)
  components/
    hello-wave.tsx      # Animated wave component
    themed-text.tsx     # Theme-aware text wrapper
  hooks/
    use-theme-color.ts  # Dynamic color resolution hook
```

## Development Workflows

**Start development:**

```bash
cd client && npx expo start
```

**Platform-specific testing:**

```bash
cd client
npx expo start --ios    # iOS Simulator
npx expo start --android # Android Emulator
npx expo start --web     # Web browser
```

**Reset project structure:**

```bash
npm run reset-project   # Moves current app to app-example/
```

_Note: After reset-project, you're working with a minimal Expo template. Previous features are preserved in `app-example/` directory._

## Project-Specific Conventions

### Current Template Components

- **HelloWave**: Animated wave component using CSS-style animations
- **ThemedText**: Theme-aware text wrapper with preset types (`default`, `title`, `subtitle`, `link`)

### Theming Pattern

- Use `ThemedText` component for consistent text styling
- Colors resolved via `useThemeColor` hook with light/dark color support
- Text types: `default`, `title`, `defaultSemiBold`, `subtitle`, `link`
- Component accepts `lightColor` and `darkColor` props for custom theming

### File-Based Routing

- Root `_layout.tsx` uses simple `<Stack />` component
- Main screen at `index.tsx` with basic centered layout
- No tab navigation currently (simplified from previous setup)

### Component Patterns

- Components accept `style` prop typed as `StyleProp<TextStyle>` or `StyleProp<ViewStyle>`
- Use `useThemeColor({ light: lightColor, dark: darkColor }, 'text')` for theme-aware colors
- Spread `...rest` props for flexibility
- Conditional styling with ternary operators for type-based styles

### Animation Patterns

- HelloWave uses CSS-style animation properties:
  - `animationName` with keyframes (`'50%': { transform: [{ rotate: '25deg' }] }`)
  - `animationIterationCount: 4`
  - `animationDuration: '300ms'`

## TypeScript Configuration

- Strict mode enabled with comprehensive type checking
- Path alias `@/*` resolves to project root (`client/`)
- Expo Router provides automatic typed routes
- React Native and Expo types available globally
- Components properly typed with React.ComponentProps extensions

## Expo-Specific Features

- **New Architecture** enabled (`newArchEnabled: true`)
- **Typed routes** experimental feature enabled
- **React Compiler** experimental feature enabled
- **Edge-to-edge** display configuration for Android
- **Adaptive icons** with background/foreground/monochrome variants
- **Reanimated** available for advanced animations
- File-based routing with automatic screen registration

## Project Structure

- Working directory is `client/` subdirectory
- Main project has minimal structure, complex features moved to `app-example/`
- Clean slate for building new features from Expo template
