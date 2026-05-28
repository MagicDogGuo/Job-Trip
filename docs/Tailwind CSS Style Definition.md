# Defined in the Tailwind CSS style used in the JobsPage.tsx file to provide reference for other page development

## icon
- Icons use Lucide React icon library

## Layout style
- `container-lg`: container width control
- `section space-y-6`: The section spacing is 6 units
- `flex flex-col md:flex-row`: vertical arrangement on mobile terminal and horizontal arrangement on desktop terminal
- `md:items-center md:justify-between`: Desktop elements are centered and aligned on both ends
- `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`: Responsive grid layout

## Cards and Containers
- `bg-white/50 dark:bg-gray-800/50`: translucent background supports light/dark mode
- `backdrop-blur-xl`: background blur effect
- `rounded-2xl`: large rounded corners
- `shadow-sm`: slight shadow
- `ring-2 ring-gray-900/5 dark:ring-gray-100/5`: thin border effect
- `hover:shadow-lg transition-all duration-200`: Transition animation for shadow deepening when hovering

## Button style
- Main button: `inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25 transition-colors`
- secondary buttons: `inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors`
- Paging buttons: `inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors`

## Input box
- `w-full h-11 pl-10 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow`
- Drop-down box similar style

## Label/status style
- Basic tags: `inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium`
- Status style function `getStatusStyles`: returns different color combinations according to different states
  - If new: `bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400`
  - Pending: `bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400`
  - Reject: `bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400`

## Text style
- Title: `text-2xl font-semibold text-gray-900 dark:text-gray-100`
- Subtitle: `text-lg font-medium`
- Description text: `text-gray-500 dark:text-gray-400`
- Label text: `text-sm font-medium text-gray-700 dark:text-gray-300`

## Loading and status
- Loading animation: `animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500`
- Error message: `rounded-xl bg-red-50 dark:bg-red-500/10 p-4 text-red-600 dark:text-red-400`

## Responsive design
- Mobile-first design, using `md:` and `lg:` prefixes to achieve responsive layout
- Flexible use of `flex-col` and `flex-row` to adjust layout direction on different screen sizes

## Dark mode support
- Full support for dark mode, almost all elements have alternative styles prefixed with `dark:`

This page follows modern design trends, using translucent effects, blurred backgrounds, large rounded corners, and subtle borders, while maintaining good dark mode support and a responsive layout.
