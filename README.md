# PayFlow Secure — Angular 19 (NgModule / non-standalone)

A pixel-faithful Angular 19 rebuild of the "Stitch Ascent Payroll Gateway" sample UI.
The project deliberately uses the **classic NgModule architecture (no standalone components)**,
and **every component is split into separate `.ts`, `.html`, and `.css` files**.

## Screens / Routes

| Route          | Component                    | Screen                          |
|----------------|------------------------------|---------------------------------|
| `/login`       | `LoginComponent`             | Secure login                    |
| `/dashboard`   | `DashboardComponent`         | Dashboard + payroll calendar    |
| `/file-upload` | `FileUploadComponent`        | File upload & audit             |
| `/status`      | `StatusDownloadsComponent`   | Processing status & downloads   |
| `/users`       | `UserManagementComponent`    | User management                 |

Shared layout lives in `src/app/layout/` — `HeaderComponent`, `SidebarComponent`, `FooterComponent`.

## Project structure

```
src/
├─ index.html            # Tailwind CDN + design tokens (colors/fonts/spacing)
├─ styles.css            # global styles + pulse keyframes
├─ main.ts               # bootstraps AppModule (platformBrowserDynamic)
└─ app/
   ├─ app.module.ts          # declares every component (NgModule)
   ├─ app-routing.module.ts  # RouterModule.forRoot(routes)
   ├─ app.component.{ts,html,css}
   ├─ layout/
   │  ├─ header/   header.component.{ts,html,css}
   │  ├─ sidebar/  sidebar.component.{ts,html,css}
   │  └─ footer/   footer.component.{ts,html,css}
   └─ components/
      ├─ login/            login.component.{ts,html,css}
      ├─ dashboard/        dashboard.component.{ts,html,css}
      ├─ file-upload/      file-upload.component.{ts,html,css}
      ├─ status-downloads/ status-downloads.component.{ts,html,css}
      └─ user-management/  user-management.component.{ts,html,css}
```

## Styling

Tailwind is loaded via CDN in `index.html`, with the exact design tokens (Material-style
color palette, Inter / JetBrains Mono fonts, custom spacing scale) from the original sample.
No Tailwind build step is required. Material Symbols icons are loaded from Google Fonts.

## Requirements

- **Node.js 18.19+ or 20+** (Node 22 recommended)
- npm 9+

## Run it

```bash
npm install
npm start        # ng serve  →  http://localhost:4200
```

Other commands:

```bash
npm run build    # production build into dist/
ng generate component components/my-feature --module app   # scaffold more NgModule components
```

> Note: because components are non-standalone, remember to add any new component to the
> `declarations` array in `app.module.ts` (the `--module app` flag does this automatically).

---

## Editing this project directly in VS Code

1. **Install VS Code** — https://code.visualstudio.com/

2. **Unzip** `payflow-secure.zip` somewhere on your machine.

3. **Open the folder in VS Code**
   - Launch VS Code → *File ▸ Open Folder…* → select the `payflow-secure` folder.
   - Or from a terminal inside the folder: `code .`

4. **Install the dependencies** (the zip ships without `node_modules`)
   - Open the integrated terminal: *Terminal ▸ New Terminal* (`Ctrl+`` ` `` / `Cmd+`` ` ``).
   - Run:
     ```bash
     npm install
     ```

5. **Recommended VS Code extensions** (open the Extensions panel, `Ctrl+Shift+X`):
   - **Angular Language Service** (`angular.ng-template`) — template autocomplete, error checking, go-to-definition inside `.html` files.
   - **Prettier** (`esbenp.prettier-vscode`) — consistent formatting.
   - **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`) — class-name autocomplete for the Tailwind utilities used throughout.
   - **ESLint** (`dbaeumer.vscode-eslint`) — optional linting.
   A `.vscode/extensions.json` is already included so VS Code will prompt you to install the core ones.

6. **Run the dev server with live reload**
   ```bash
   npm start
   ```
   Open http://localhost:4200 — any edit you make to a `.ts`, `.html`, or `.css` file
   is hot-reloaded in the browser automatically.

7. **Where to edit what**
   - Change page markup → the component's `.html` file.
   - Change page logic / data → the component's `.ts` file.
   - Change component-scoped styles → the component's `.css` file.
   - Change global theme (colors, fonts, spacing) → `src/index.html` (the `tailwind.config` block).
   - Add/reorder routes → `src/app/app-routing.module.ts`.

8. **Debugging (optional)** — a `.vscode/launch.json` is included; press `F5` to launch a
   Chrome debug session against the running dev server.
