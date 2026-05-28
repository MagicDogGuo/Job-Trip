[Mode:Plan][Model:Claude 3.7 Sonnet]

#404 Page Refactoring Plan - Career Compass/Navigation Concept

## File overview
File that needs to be modified: `frontend/src/pages/NotFoundPage.tsx`

## Design ideas
Create a 404 page consistent with the JobTrip theme, using the "career compass/navigation concept" to show the creative visual effect of users getting lost in their job search journey. Use Tailwind CSS to implement the design, ensuring the page has responsive layout and dark mode support.

## Technical details

### Import items
1. Import Link from react-router-dom
2. Import icons from lucide-react: Compass, Map, Home, RotateCcw

### Page structure
1. Main container - full screen centered layout
2. Visual Focus – Large Compass Graphic/Animation
3. Error text area - contains 404 title and description text
4. Navigation button area - return to homepage button

### Style features
1. Use the main color of the project #6366F1 (indigo blue)
2. Apply translucent background and blur effects
3. Large rounded corner design elements
4. Subtle shadows and circular borders
5. Hover animation effect
6. Responsive layout

### Main component design

#### Compass animation/graphics
- Large circular compass design
- The pointer points to the "404°" position
- Add subtle animation effects like slight wiggles or pulsations
- Use project primary and secondary colors

#### Text content
- Main title: "404 - The career navigation system cannot locate this page"
- Subtitle: "You seem to have strayed from your job search journey"
- Description text: "Our career GPS cannot find the destination you are trying to visit"
- Prompt text: "Need help finding the direction? Return to the homepage and start navigation again"

#### Action button
- "Return to homepage" button - Use project style button design
- Optional "Retry" button - Refresh the page

### Responsive design
- Mobile devices: arrange elements vertically, reduce compass size
- Tablet/Desktop: Arrange text and graphics horizontally, increase compass size
- Ensure text is readable on various screen sizes

### Dark mode support
- Added dark mode style variants to all elements
- Adjust color and brightness to suit dark mode

## Implementation Checklist:
1. Update the import part of the NotFoundPage.tsx file to introduce React, Link and the required Lucide icons
2. Create the main container of the page, use flex layout and achieve full-screen centering effect
3. Implement compass graphic components, including circular background and pointer elements
4. Add "404°" mark and pointer animation effects
5. Create a text area containing main title, subtitle and description text
6. Design and implement the "Return to Home Page" button and apply project style
7. Add responsive layout styles to ensure correct display on different devices
8. Implement dark mode support and add dark mode style variants to all elements
9. Add transition animation effects to enhance user experience
10. Test page performance on different screen sizes and display modes
