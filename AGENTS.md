# SkyUni AI Agent Guidelines

This document helps AI coding agents understand SkyUni's architecture, conventions, and development patterns.

---

## Project Overview

**SkyUni** is a university student social platform combining Ekşi Sözlük's knowledge-sharing culture with Discord's multi-channel architecture.

- **Tech Stack**: React 19 + Vite (frontend), Node.js Express (backend)
- **Status**: Early development (MVP phase)
- **Language**: Turkish (component names, UI text)

---

## Architecture

### Frontend Structure
```
src/
├── pages/           # Page-level components (5 main routes)
├── components/      # Reusable UI components (currently empty)
├── assets/          # Images, icons, media
├── App.jsx          # Router setup
├── index.css        # Global styles
└── main.jsx         # Entry point
```

### Backend Structure
```
backend/
├── controllers/     # Request handlers
├── models/          # MongoDB schemas (User, Channel, Message, etc.)
├── middleware/      # Auth, content filtering
├── routes/          # Express route definitions
└── server.js        # Server entry point
```

### Routes
| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | AnaSayfa | Main chat/feed interface |
| `/giris` | GirisYap | Login page |
| `/kayit` | KayitOl | Registration page |
| `/profil` | Profil | User profile page |
| `/universiteler` | Universiteler | University list/navigation |

---

## Theming & Styling System

⚠️ **Current State**: SkyUni uses **inline React styles with hardcoded colors**. There is no formal theming system yet.

### Color Palette

All colors should use this **single dark theme** palette:

```javascript
const THEME_COLORS = {
  // Primary brand
  primary: '#646cff',           // Buttons, active states, links
  
  // Backgrounds
  darkBg: '#2c2c2c',            // Sidebars, dark panels
  veryDarkBg: '#1a1a2e',        // Page background
  lightBg: '#f5f5f5',           // Card backgrounds, light content
  inputBg: '#2c2c3e',           // Form input backgrounds
  
  // Text & Borders
  textLight: '#ffffff9a',       // Body text (with opacity)
  textDark: '#000000',          // Input text
  borderGray: '#444',           // Dark borders
  borderLightGray: '#ddd',      // Light borders
  subtleGray: '#888',           // Secondary text, placeholders
  
  // Status
  error: '#ff4444',             // Error states, destructive actions
};
```

### Styling Patterns

#### **1. Buttons**
All buttons use this pattern:
```jsx
<button style={{
  width: '100%',
  padding: '10px',
  backgroundColor: '#646cff',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer'
}}>
  Button Text
</button>
```

**When to use**:
- Form submissions
- Navigation actions
- Call-to-action elements

**Color variants**:
- Primary (default): `backgroundColor: '#646cff'`
- Danger/Logout: `backgroundColor: '#ff4444'`

#### **2. Form Inputs & Textareas**
```jsx
<input type="text" style={{
  width: '100%',
  padding: '8px',
  marginBottom: '10px',
  backgroundColor: '#2c2c3e',
  color: '#000000',
  border: '1px solid #444',
  borderRadius: '8px',
  fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
}} />
```

**Always include**:
- `width: '100%'` for form containers
- `marginBottom: '10px'` for field spacing
- `backgroundColor: '#2c2c3e'`
- `borderRadius: '8px'`
- `border: '1px solid #444'`

#### **3. Cards & Content Containers**
```jsx
<div style={{
  backgroundColor: '#f5f5f5',
  padding: '1rem',
  borderRadius: '8px',
  marginBottom: '1rem'
}}>
  Content
</div>
```

#### **4. Sidebars & Dark Panels**
```jsx
<div style={{
  width: '250px',
  backgroundColor: '#2c2c2c',
  overflowY: 'auto',
  borderRight: '1px solid #444',
  padding: '1rem'
}}>
  Sidebar content
</div>
```

#### **5. Full-Screen Split Layouts**
For pages like AnaSayfa and Universiteler (chat + sidebar):
```jsx
<div style={{
  display: 'flex',
  height: '100vh',
  backgroundColor: '#1a1a2e'
}}>
  {/* Sidebar */}
  <div style={{ width: '250px', backgroundColor: '#2c2c2c' }}>...</div>
  
  {/* Main content */}
  <div style={{ flex: 1, overflow: 'auto' }}>...</div>
</div>
```

### Spacing Scale

❌ **Currently inconsistent**. When adding new code, use one of these values:
- Extra-small: `4px`
- Small: `8px`
- Medium: `10px` or `1rem` (16px)
- Large: `2rem`

Prefer `px` for padding/margins within components, `rem` for page-level spacing.

### Border Radius
- Standard: `8px` (buttons, inputs, cards)
- Compact: `4px` (small elements)
- Circles: `50%` (user avatars)

### Typography

**Font**: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif

**Current state**: No explicit heading hierarchy or font-size scale defined. Use semantic HTML and default browser sizing.

---

## Development Commands

### Frontend
```bash
npm run dev      # Start Vite dev server (http://localhost:5173)
npm run build    # Build for production
npm run lint     # Run ESLint
```

### Backend
```bash
cd backend
npm start        # Start Express server
```

### API Documentation
See [API-Tasarimi.md](API-Tasarimi.md) for REST endpoint specifications.

---

## Code Conventions

### Turkish Naming
- Component/page names are **in Turkish**: `AnaSayfa`, `GirisYap`, `KayitOl`, `Profil`, `Universiteler`
- This is intentional—maintain Turkish naming for consistency
- Comments and documentation can be in Turkish or English

### React Patterns
- **Router**: React Router v7.5 with hash-based routing (`HashRouter`)
- **HTTP Client**: Axios for API calls
- **State Management**: (Currently none—add if needed)

### File Organization
- Pages go in `src/pages/` 
- Reusable components go in `src/components/` (currently unused)
- Global CSS in `src/index.css`
- No CSS modules; use inline styles for component-scoped styling

---

## Common Tasks & Patterns

### Adding a New Page
1. Create file in `src/pages/PageName.jsx`
2. Add route in `App.jsx`
3. Use split-layout pattern (sidebar + content) for consistency
4. Use inline styles with THEME_COLORS
5. Example structure:
```jsx
export default function NewPage() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <MainContent />
    </div>
  )
}
```

### Adding a Form
1. Wrap inputs in a container: `maxWidth: '400px'`, `margin: 'auto'`
2. Use standard input pattern with `marginBottom: '10px'`
3. Add submit button at bottom with full-width `#646cff` style
4. Example:
```jsx
<div style={{ maxWidth: '400px', margin: 'auto', padding: '2rem' }}>
  <h2>Form Title</h2>
  <input type="text" placeholder="..." style={inputStyle} />
  <button style={buttonStyle}>Submit</button>
</div>
```

### Making API Calls
- Import `axios`
- Endpoint base URL: (check backend server.js for actual URL)
- Example:
```javascript
import axios from 'axios'

const response = await axios.post('/api/auth/login', { 
  email, 
  password 
})
```

---

## Known Issues & Limitations

1. **No theming system**: Colors are hardcoded. A future refactor could extract theme to React Context or CSS variables.
2. **No component library**: Styles repeated across pages—could benefit from `<FormInput />`, `<Card />`, etc.
3. **No responsive design**: Layout may not work well on mobile. Consider adding media queries or a CSS framework.
4. **No dark/light mode**: Single dark theme. Multi-theme support would require major refactor.
5. **Empty components folder**: Components directory exists but is unused—consider consolidating or removing.

---

## Improving This Guide

AI agents should respect established patterns but can suggest improvements. Common enhancement opportunities:

- [ ] Extract repeated style objects into utility functions
- [ ] Move color values to a `THEME_COLORS` constant file
- [ ] Create reusable component abstractions (Button, Input, Card)
- [ ] Add Tailwind CSS or CSS modules for scalability
- [ ] Implement dark/light mode toggle with React Context
- [ ] Add responsive design breakpoints
- [ ] Document API endpoints with JSDoc or OpenAPI

---

## Reference Links

- [API-Tasarimi.md](API-Tasarimi.md) — REST API specifications
- [Gereksinim_Analizi.md](Gereksinim_Analizi.md) — Project requirements (Turkish)
- [Postman Collection](SkyUni.postman_collection.json) — API endpoints for testing
- [Backend Models](backend/models/) — Data structure definitions
- [Backend Routes](backend/routes/) — Route definitions
