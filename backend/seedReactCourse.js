require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/Course');

// Use existing environment variable or fallback to local default for development
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/codeplay';

// Define the 10 separate modules as individual courses
const reactModules = [
    {
        title: 'React Module 1: Fundamentals',
        description: 'Understand Component-based architecture, JSX, props, composition, and basic state management with useState.',
        duration: '1 Week',
        icon: '⚛️',
        level: 'Beginner',
        type: 'docs',
        difficulty: 'beginner',
        tags: ['react', 'components', 'jsx', 'props'],
        sections: [
            {
                title: 'Core Concepts',
                order: 1,
                topics: [
                    {
                        title: 'Component-based architecture',
                        content: `In this topic, we explore the core philosophy of React: Component-Based Architecture.
                        
**Key Concepts:**
- **Decomposition:** Breaking down complex UI (like CodePlay's navbar, dashboard, and IDE) into smaller, manageable, and reusable pieces.
- **Reusability:** Creating components once (e.g., a 'Button' or 'Card') and using them everywhere to maintain consistency.
- **Isolation:** Each component manages its own structure and logic, making debugging and testing easier.

**Practical Application in CodePlay:**
We will identify the main parts of our application:
1. **Layout Components:** Navbar, Sidebar, Footer.
2. **Page Components:** Dashboard, CourseList, LabIDE.
3. **UI Elements:** Buttons, Modals, Inputs, Cards.

By the end of this lesson, you will understand how to structure a large-scale React application effectively.`
                    },
                    {
                        title: 'JSX, props, and composition',
                        content: `JSX (JavaScript XML) is the syntax extension for JavaScript that allows us to write HTML-like code within our JavaScript files.
                        
**Topics Covered:**
- **JSX Syntax:** Understanding how React converts JSX into 'React.createElement' calls.
- **Props (Properties):** Passing data from parent to child components to make them dynamic.
- **Prop Types:** enforcing type checking (using PropTypes or TypeScript) to catch bugs early.
- **Composition vs. Inheritance:** Why React prefers composition (using 'children' props) to build flexible UI wrappers.

**CodePlay Example:**
We will build a 'DashboardLayout' component that accepts children, wrapping every page with a consistent Navbar and Footer.`
                    },
                    {
                        title: 'State with useState',
                        content: `State is the heart of any interactive React application. It represents the data that changes over time.

**Focus Areas:**
- **The 'useState' Hook:** Declaring state variables and updater functions.
- **Handling Interactivity:** Toggling simple UI elements like dropdowns, modals, and accordion menus.
- **Complex State:** Managing arrays and objects immutably (e.g., adding a new file to the file explorer without mutating the original array).

**Challenge:**
Implement the state logic for the "File Explorer" in the CodePlay IDE, allowing users to select and highlight active files.`
                    }
                ]
            }
        ]
    },
    {
        title: 'React Module 2: State & Data Flow',
        description: 'Learn about lifting state up, prop drilling, Context API for global state, and custom hooks.',
        duration: '1 Week',
        icon: '🔄',
        level: 'Intermediate',
        type: 'docs',
        difficulty: 'intermediate',
        tags: ['react', 'state', 'context', 'hooks'],
        sections: [
            {
                title: 'Data Flow Patterns',
                order: 1,
                topics: [
                    {
                        title: 'Lifting state and prop drilling',
                        content: `As applications grow, sharing state between components becomes challenging.
                        
**Concepts:**
- **Lifting State Up:** Moving state to the closest common ancestor when simple siblings need to communicate.
- **Prop Drilling:** The practice (and pitfall) of passing data through multiple layers of components that don't need it.
- **Solution:** When to stop lifting state and start using Context or Global State managers.

**Scenario:**
Sharing the 'activeTheme' (dark/light mode) between the Navbar settings and the main IDE editor window.`
                    },
                    {
                        title: 'Context API for global app state',
                        content: `The Context API is React's built-in solution for avoiding prop drilling for global data.

**We will implement:**
1. **AuthContext:** To manage the currently logged-in user, JWT tokens, and authentication status across the entire specific.
2. **CourseContext:** To cache the list of enrolled courses and track user progress without re-fetching on every page load.

**Pattern:**
Creating custom Provider components (e.g., '<AuthProvider>') to wrap our application.`
                    },
                    {
                        title: 'Custom hooks for CodePlay logic',
                        content: `Custom Hooks allow you to extract component logic into reusable functions.

**Hooks we will build:**
- **useAuth():** A hook to easily access user data and login/logout functions.
- **useCourses():** To encapsulate the logic for fetching, filtering, and sorting courses.
- **useLabs():** To handle the complex logic of initializing and managing the IDE state.

**Benefit:**
Keeps our UI components clean and focused purely on rendering, while logic lives in testable hooks.`
                    }
                ]
            }
        ]
    },
    {
        title: 'React Module 3: Routing',
        description: 'Master React Router DOM, URL parameters, query strings, and protecting routes for authenticated users.',
        duration: '1 Week',
        icon: '🔗',
        level: 'Intermediate',
        type: 'docs',
        difficulty: 'intermediate',
        tags: ['react', 'router', 'navigation'],
        sections: [
            {
                title: 'Navigation Logic',
                order: 1,
                topics: [
                    {
                        title: 'React Router basics',
                        content: `Single Page Applications (SPAs) need client-side routing to navigate without refreshing the page.

**Setup:**
- Configuring 'react-router-dom'.
- Defining Routes: '/', '/login', '/dashboard'.
- Dynamic Segments: '/courses/:courseId'.

**Layout Routes:**
Using nested routes to apply different layouts (e.g., AuthLayout for login/register vs. AppLayout for the dashboard).`
                    },
                    {
                        title: 'URL params and query strings',
                        content: `The URL is a powerful source of truth for application state.

**Techniques:**
- **useParams:** Accessing dynamic segments like ':courseId' to fetch the correct data.
- **useSearchParams:** Reading query strings (e.g., '/lab?file=index.js') to deep-link users directly to specific content.

**Use Case:**
Ensuring that when a user refreshes the browser while working on a specific lab topic, they return to the exact same state.`
                    },
                    {
                        title: 'Protected routes and redirects',
                        content: `Security is paramount. We must prevent unauthenticated users from accessing private pages.

**Implementation:**
- Creating a 'ProtectedRoute' wrapper component.
- Checking valid auth tokens in the 'AuthContext'.
- **Redirects:** Automatically forcing users to '/login' if they are not authenticated.
- **User Experience:** Storing the location they tried to visit (using 'location.state') so we can redirect them back after a successful login.`
                    }
                ]
            }
        ]
    },
    {
        title: 'React Module 4: API Integration',
        description: 'Connect your React app to a backend using fetch or Axios, manage loading states, and handle errors.',
        duration: '1 Week',
        icon: '📡',
        level: 'Intermediate',
        type: 'docs',
        difficulty: 'intermediate',
        tags: ['react', 'api', 'axios', 'async'],
        sections: [
            {
                title: 'Server Communication',
                order: 1,
                topics: [
                    {
                        title: 'Fetching with fetch or Axios',
                        content: `Connecting our React frontend to the Node.js/Express backend.

**Comparison:**
- **Fetch API:** Native, lightweight, but requires more boilerplate for error handling.
- **Axios:** Library with built-in features like interceptors, automatic JSON parsing, and request cancellation.

**Activity:**
Setting up a centralized 'api.js' service instance using Axios to handle base URLs and default headers.`
                    },
                    {
                        title: 'useEffect and lifecycle in React',
                        content: `Understanding how to synchronize component state with external systems (the backend).

**Best Practices:**
- Fetching data on component mount.
- **Dependency Arrays:** Controlling exactly when effects run to avoid infinite loops.
- **Cleanup Functions:** canceling active requests or clearing timers when a user navigates away to prevent memory leaks.`
                    },
                    {
                        title: 'Managing async state and loading UX',
                        content: `User experience is critical during data fetching.

**States to Handle:**
1. **Loading:** displaying skeletons or spinners while data is on the way.
2. **Success:** rendering the data.
3. **Error:** displaying user-friendly error messages (toasts or inline alerts) when things go wrong.

**Global Handling:**
Using Axios interceptors to automatically detect 401 Unauthorized errors and log the user out.`
                    }
                ]
            }
        ]
    },
    {
        title: 'React Module 5: IDE Implementation',
        description: 'Build the core features of the CodePlay IDE: File explorer, Monaco Editor integration, and state sync.',
        duration: '2 Weeks',
        icon: '💻',
        level: 'Advanced',
        type: 'docs',
        difficulty: 'advanced',
        tags: ['react', 'ide', 'monaco', 'files'],
        sections: [
            {
                title: 'Building the Editor',
                order: 1,
                topics: [
                    {
                        title: 'Modelling a file tree in React',
                        content: `The core of an IDE is the file explorer.

**Data Structure:**
Modeling a virtual file system using recursion or flat arrays with parent IDs.

**UI Implementation:**
- Recursive components to render folders and subfolders.
- Managing 'activeFile' and 'expandedFolder' states.
- Implementing keyboard navigation (arrow keys) for a native-like experience.`
                    },
                    {
                        title: 'Code editor integration',
                        content: `Integrating a professional code editor into our React app.

**Choice:** Monaco Editor (powering VS Code) vs. CodeMirror.

**Integration:**
- Wrapping the editor in a React component.
- **Two-way binding:** Syncing the editor's text content with our React state.
- **Debouncing:** preventing performance issues by waiting for the user to stop typing before updating the state or saving to the backend.`
                    },
                    {
                        title: 'Synchronizing editor and backend',
                        content: `Persisting code changes to the server.

**Workflow:**
1. **Initial Load:** GET '/labs/:id/files' to populate the file tree.
2. **Auto-Save:** Using a debounce timer to silently save changes.
3. **Optimistic UI:** Updating the local UI immediately (e.g., marking a file as "saved") before the server confirms, to make the app feel instant.`
                    }
                ]
            }
        ]
    },
    {
        title: 'React Module 6: Lab Previews',
        description: 'Implement live code previews using iframes, handle cross-origin security, and build real-time status polling.',
        duration: '1 Week',
        icon: '👁️',
        level: 'Advanced',
        type: 'docs',
        difficulty: 'advanced',
        tags: ['react', 'iframe', 'security'],
        sections: [
            {
                title: 'Live Preview System',
                order: 1,
                topics: [
                    {
                        title: 'Handling iframes in React',
                        content: `Displaying the user's running code safely.

**Mechanism:**
Using an '<iframe>' to render the result of the user's code, isolated from our main application context.

**Challenges:**
- Passing the 'devUrl' from the backend container service to the iframe 'src'.
- Handling loading states (iframe 'onLoad' events).
- Handling iframe connection errors (e.g., if the user's server crashes).`
                    },
                    {
                        title: 'Cross-origin and security considerations',
                        content: `Security risks when embedding user-generated content.

**Same-Origin vs. Cross-Origin:**
Understanding the browser security model. If the user's code runs on a different subdomain, we cannot directly access its DOM.

**Communication:**
Using the 'window.postMessage' API to safely send messages (like console logs or resize events) between the parent app and the preview iframe.`
                    },
                    {
                        title: 'Polling and real-time UX (optional)',
                        content: `Real-time feedback is essential for long-running processes like server startup.

**Strategy:**
Implementing a polling mechanism (using 'setInterval' inside 'useEffect') to check the status of a container ('starting', 'running', 'stopped').

**UI:**
Showing a live status indicator and disabling the "Open Preview" button until the backend service confirms the container is ready.`
                    }
                ]
            }
        ]
    },
    {
        title: 'React Module 7: Forms & Auth',
        description: 'Create robust forms for Login/Signup, manage JWT tokens securely, and build complex content management forms.',
        duration: '1 Week',
        icon: '📝',
        level: 'Intermediate',
        type: 'docs',
        difficulty: 'intermediate',
        tags: ['react', 'forms', 'auth', 'jwt'],
        sections: [
            {
                title: 'Forms and Security',
                order: 1,
                topics: [
                    {
                        title: 'Login/signup forms',
                        content: `Building robust forms for user authentication.

**Key Elements:**
- **Controlled Inputs:** managing input values via React state.
- **Validation:** Client-side checks (required fields, email format, password strength).
- **Submission:** Handling the form submit event to send JSON data to the auth endpoints.`
                    },
                    {
                        title: 'Managing JWT tokens in React',
                        content: `The standard for strict stateless authentication.

**Storage Strategy:**
- **localStorage:** Convenient, persistent, but vulnerable to XSS.
- **HttpOnly Cookies:** More secure, but requires backend configuring.
- **In-Memory:** Most secure, but lost on refresh.

**Our Approach:**
We will use 'localStorage' for simplicity in this course, while discussing the trade-offs.`
                    },
                    {
                        title: 'Course and content management forms',
                        content: `Admin interfaces for creating content.

**Complex Forms:**
- Handling multi-step wizards for creating a new course.
- Dynamic form fields (e.g., adding an arbitrary number of topics to a module).
- Uploading assets (images for course icons) and previewing them before submission.`
                    }
                ]
            }
        ]
    },
    {
        title: 'React Module 8: Optimization',
        description: 'Improve performance with React Profiler, React.memo, useCallback, useMemo, and Code Splitting.',
        duration: '1 Week',
        icon: '⚡',
        level: 'Advanced',
        type: 'docs',
        difficulty: 'advanced',
        tags: ['react', 'performance', 'optimization'],
        sections: [
            {
                title: 'Measuring and Improving',
                order: 1,
                topics: [
                    {
                        title: 'Avoiding unnecessary re-renders',
                        content: `React is fast, but we can make it faster.

**Profiling:**
Using the React DevTools Profiler to identify components that re-render too often.

**Optimization:**
- **React.memo:** preventing re-renders of presentational components if props haven't changed.
- **useCallback & useMemo:** ensuring functions and objects remain stable across renders to prevent breaking 'React.memo' optimizations.`
                    },
                    {
                        title: 'Code splitting and lazy loading',
                        content: `Reducing the initial bundle size for faster load times.

**Technique:**
Using 'React.lazy()' and '<Suspense>' to load heavy components (like the Monaco Editor or Admin Dashboard) only when the user navigates to them.

**Result:**
Improved Core Web Vitals and a faster First Contentful Paint (FCP).`
                    },
                    {
                        title: 'DevTools, debugging, and logging',
                        content: `Mastering the tools of the trade.

**Tools:**
- **React DevTools:** Inspecting the component tree, current props, and hook state.
- **Rubber Duck Debugging:** Logical steps to trace bugs.
- **Logging Strategy:** Writing structured logs for lifecycle events (e.g., 'LabContainer: Mounting...', 'LabContainer: Connecting WS...') to debug complex async flows.`
                    }
                ]
            }
        ]
    },
    {
        title: 'React Module 9: Testing',
        description: 'Write confident tests using React Testing Library. Cover unit tests, integration tests, and user flows.',
        duration: '1 Week',
        icon: '✅',
        level: 'Intermediate',
        type: 'docs',
        difficulty: 'intermediate',
        tags: ['react', 'testing', 'jest', 'rtl'],
        sections: [
            {
                title: 'Test Strategies',
                order: 1,
                topics: [
                    {
                        title: 'React Testing Library basics',
                        content: `Testing user interactions rather than implementation details.

**Philosophy:**
"The more your tests resemble the way your software is used, the more confidence they can give you."

**Tests:**
- Rendering a component.
- Searching for elements by text or role (accessibility focused).
- Firing events (clicks, typing) and asserting on the resulting UI changes.`
                    },
                    {
                        title: 'Integration tests for the Lab page',
                        content: `Testing complex flows that involve multiple components.

**Scenario:**
1. Mocking the API response for 'GET /courses'.
2. Rendering the CourseDetailPage.
3. Simulating a user clicking on a topic.
4. Verifying that the navigation occurs (checking if the Navigate function was called).`
                    }
                ]
            }
        ]
    },
    {
        title: 'React Module 10: UX & Deploy',
        description: 'Polish the UI with Tailwind CSS, add keyboard shortcuts, toast notifications, and deploy to Vercel.',
        duration: '1 Week',
        icon: '🚀',
        level: 'Beginner',
        type: 'docs',
        difficulty: 'beginner',
        tags: ['react', 'tailwind', 'deploy', 'ux'],
        sections: [
            {
                title: 'Polishing and Launching',
                order: 1,
                topics: [
                    {
                        title: 'Styling strategy (Tailwind or CSS modules)',
                        content: `Creating a beautiful, consistent design system.

**Utility-First CSS (Tailwind):**
Rapidly building custom designs without leaving your HTML. Configuring the 'tailwind.config.js' theme to match our brand colors.

**Scoped CSS:**
Using CSS Modules for complex, component-specific animations or layouts where utility classes become unwieldy.`
                    },
                    {
                        title: 'UX improvements',
                        content: `Polishing the application for a premium feel.

**Features:**
- **Keyboard Shortcuts:** Implementing 'Ctrl+S' to save files in the IDE.
- **Toasts:** Non-intrusive notifications for success/error actions.
- **Empty States:** Designing helpful screens for when there is no data to display (e.g., "No courses enrolled yet").`
                    },
                    {
                        title: 'Build and deploy',
                        content: `Going live!

**Build Process:**
Running 'npm run build' to create an optimized production bundle (minified HTML/CSS/JS).

**Environment Variables:**
Configuring 'REACT_APP_API_URL' for production vs. development.

**Hosting:**
Deploying our static frontend assets to platforms like Vercel or Netlify and connecting them to our Node.js backend.`
                    }
                ]
            }
        ]
    }
];

const seedReactCourse = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        console.log('Cleaning up old "React Fundamentals" course...');
        // Remove the old single big course if it exists
        await Course.deleteMany({ title: 'React Fundamentals for CodePlay' });
        // Also remove any pre-existing modules to avoid duplication if run multiple times
        await Course.deleteMany({ title: { $regex: /^React Module/ } });
        console.log('Cleanup complete.');

        console.log('Seeding 10 separate Module courses...');
        for (const moduleData of reactModules) {
            const course = new Course(moduleData);
            await course.save();
            console.log(`Created: ${moduleData.title}`);
        }

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedReactCourse();
