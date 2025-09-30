## Issues 

[X] Refresh to current route (dashboard) after submit
[ ] Error handling for Duplicate names
[ ] Error handling for Non Capitalized names
[ ] Add table pagination to Dashboard and Search
[ ] Generate Invoice Button
[ ] Split up dashboard component into subcomponents for better readability and DRY
[ ] Deleting items by ID from the mini sidebar, clears all of that ID (ie. doesn't allow duplicate selections)





Code Quality Issues Analysis

  Critical Issues

  1. Mixed File Extensions - Inconsistent .js vs .jsx usage (page.js:2, Layout.jsx:1)
  2. Prop Drilling Anti-pattern - Excessive prop passing through components (FuneralDashboard.jsx:216-274)
  3. Massive Components - CreateFuneralModal.jsx (317 lines), FuneralDashboard.jsx (279 lines)
  4. Hardcoded Data - Layout.jsx:6-180 contains static coffin/flower data
  5. No TypeScript - Missing type safety throughout

  Code Structure Issues

  6. Poor State Management - 15+ useState hooks in FuneralDashboard.jsx:18-36
  7. Inconsistent Naming - Mixed camelCase/snake_case (formData vs client_details)
  8. Large Functions - resetState() function spans 17 lines (FuneralDashboard.jsx:38-54)
  9. Missing Error Boundaries - No error handling for component failures
  10. No Custom Hooks - Repeated API logic across components

  Performance Issues

  11. Unnecessary Re-renders - Missing React.memo and useCallback
  12. Inefficient UUID Generation - Creating UUIDs on every render (Layout.jsx:7-14)
  13. No Data Fetching Optimization - No caching or loading states

  Maintainability Issues

  14. Console.log Pollution - Debug statements throughout production code
  15. Inline Styles - Mixed with Tailwind classes (page.js:5-8)
  16. No Component Documentation - Missing PropTypes or JSDoc
  17. Duplicate Code - Similar API fetch patterns repeated

  Improvement Steps

⏺ Phase 1: Foundation (High Priority)

  1. Convert to TypeScript
    - Add TypeScript configuration
    - Create interface definitions for props
    - Migrate critical components first
  2. Fix File Extensions
    - Rename .js files containing JSX to .jsx
    - Update import statements accordingly
  3. Implement State Management
    - Add React Context or Zustand
    - Centralize form state and API data
    - Remove prop drilling

  Phase 2: Architecture (Medium Priority)

  4. Component Decomposition
  // Before: CreateFuneralModal.jsx (317 lines)
  // After: Split into:
  - FuneralForm.jsx
  - FuneralSummary.jsx
  - BillableItemsSection.jsx
  5. Create Custom Hooks
  // Examples:
  - useApi(endpoint)
  - useFuneralData()
  - useModalState()
  6. Move Static Data to Configuration
  // Create: src/data/funeral-categories.js
  export const FUNERAL_CATEGORIES = [...]

  Phase 3: Performance (Medium Priority)

  7. Optimize Re-renders
  // Add React.memo for pure components
  export default React.memo(DisplayGroupTiles);

  // Use useCallback for handlers
  const handleSubmit = useCallback(async (e) => {
    // handler logic
  }, [dependencies]);
  8. Implement Loading States
  // Add proper loading/error states
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  Phase 4: Quality Improvements (Lower Priority)

  9. Add Error Boundaries
  // Create: src/components/ErrorBoundary.jsx
  class ErrorBoundary extends React.Component {
    // Error handling logic
  }
  10. Code Cleanup
    - Remove all console.log statements
    - Standardize naming conventions
    - Add PropTypes or TypeScript interfaces
    - Extract inline styles to CSS modules
  11. Add Testing Infrastructure
    - Configure Jest and React Testing Library
    - Add unit tests for critical components
    - Implement integration tests for workflows

  Quick Wins (Can implement immediately)

  - Remove unused imports (Layout.jsx:3 imports unused useState)
  - Fix HTML attributes (InventoryDashboard.jsx:119 - use colSpan not colspan)
  - Standardize button styling - Create reusable Button component
  - Add loading states for all API calls
  - Extract API URLs to environment configuration
