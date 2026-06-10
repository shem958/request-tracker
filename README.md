# PhotoMed Request Tracker

A premium, responsive, single-page web dashboard application built to submit, track, filter, and manage technical requests, bugs, and feedback. This project was completed as part of the software engineering attachee selection process for **PhotoMed**.

---

## 🚀 Live Demo & Repository Details

- **GitHub Repository**: `https://github.com/shem958/request-tracker`
- **Live Deployed App**: `https://request-track.netlify.app/`

---

## 🛠️ Technology Stack

I chose a lightweight but highly capable frontend tech stack to ensure the app is fast, clean, and has zero dependency configuration issues:

1. **HTML5**: Semantic and accessible markup structure.
2. **Vanilla CSS3**: 
   - Core design system leveraging customized CSS custom properties (variables) for HSL-tailored colors, radius settings, shadows, and spacing.
   - Beautiful dark-themed aesthetic featuring modern glassmorphism panels (`backdrop-filter: blur(12px)`).
   - Fully responsive layouts using Flexbox and CSS Grid.
   - Smooth hover micro-animations and transition states.
3. **Vanilla JavaScript (ES6+)**:
   - Centralized application state management.
   - Form field client-side validation logic with custom dynamic error alerts.
   - Multi-factor filtering engine (Product Area, Request Type, Priority, Status) and real-time text-based search.
   - Interactive modal popups for full details and engineering/admin notes.
   - LocalStorage synchronization to keep data persistent across page reloads.
   - Customizable toast notification system.
4. **Icons**: FontAwesome CDN for modern, high-quality vector icons.
5. **Typography**: Google Fonts ("Outfit" for headings, "Inter" for body copy).

---

## ✨ Core Features Built

- [x] **Request Submission Form**:
  - Validates full name (min 3 chars), email format, selected product, request type, priority (Low, Medium, High), and detailed message (min 10 chars).
  - Triggers smooth success toast notifications on valid submit.
  - Dynamically resets validation styling and inputs.
- [x] **Real-time Statistics Cards**:
  - Live counts of Total Requests, New, In Review, Resolved, and Rejected requests.
  - Recalculates and animates on status updates or deletion.
- [x] **Advanced Multi-Filter Control Panel**:
  - Search by Name, Email, or keyword in the Message description.
  - Multi-dropdown filters allowing simultaneous filter combinations (e.g. "Bug" reports + "High" priority + "PhotoMed Portal" product + "In Review" status).
  - Sorting options: Newest First, Oldest First, Priority: High to Low, and Priority: Low to High.
- [x] **Dynamic Card Listing**:
  - Color-coded left borders showing priority severity.
  - Interactive status dropdowns directly inside the card allowing quick triage.
  - Interactive details expansion buttons and delete actions.
  - Custom SVG/CSS empty states with filter reset options.
- [x] **Admin Details Modal**:
  - Expands full card description and submission details in an overlay modal.
  - Includes a dedicated text field for **Engineering/Admin Notes** to track resolutions.
  - Allows editing status values with live syncing.
- [x] **Robust Local Storage Persistence**:
  - Saved requests survive page reloads and cache clearing.
  - Auto-seeds 6 realistic PhotoMed-related mock tickets on initial visit to demonstrate filters and statistics.

---

## 📂 Project Structure

```bash
request-tracker/
├── index.html       # Primary layout, semantic structures, modal overlays, templates
├── styles.css       # CSS design tokens, dashboard styles, glassmorphism, responsive grid
├── app.js           # Core state logic, input validation, filters, sorting, modals, toasts
├── .gitignore       # Git ignore rules for editors and logs
└── README.md        # Comprehensive documentation
```

---

## 🏃 Local Setup Instructions

No build steps, node_modules, or package configurations required.

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd request-tracker
   ```
2. **Open the project**:
   - Double-click the `index.html` file to run directly in any modern browser.
   - Or serve it locally using any lightweight server extension like **Live Server** in VS Code.

---

## ⚓ Git Commit History

The project maintains a disciplined commit workflow using clean commit guidelines:
1. `Initial commit` - Setup basic `.gitignore`
2. `feat: implement CSS theme and variables` - Created design system tokens and responsive rules
3. `feat: build index.html layout and structure` - Created semantic layouts, modals, and container elements
4. `feat: implement app.js application logic, validators, stats, and search filtering` - Coded states, filters, validation, local storage, and toasts
5. `docs: add detailed README and setup instructions` - Completed documentation

---

## 💡 Challenges & Reflection

- **Challenge**: Coordinating multi-filtering logic so that search terms and dropdown selections interact together without canceling each other out.
- **Solution**: Implemented a pure, unified state query flow inside `renderRequests()` that filters the master `appState.requests` array through a sequence of checks sequentially before rendering, rather than filtering on individual event handlers.
- **Future Improvements with More Time**:
  - Add file attachment support (e.g. uploading screenshots/logs using Cloudflare R2).
  - Integrate a secure serverless backend (Cloudflare Pages Functions) and database (Cloudflare D1 SQL database) instead of relying solely on client-side LocalStorage.
  - Implement email alerts (using SendGrid or Resend API) to notify administrators when High-priority bugs are filed.
