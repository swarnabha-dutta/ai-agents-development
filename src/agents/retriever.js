export async function retriever(plan) {
    const documents = [
        {
            id: 1,
            title: "React Documentation",
            content:
                "React Hooks allow functional components to manage state and lifecycle methods."
        },
        {
            id: 2,
            title: "React Guide",
            content:
                "useState and useEffect are the two most commonly used hooks."
        },
        {
            id: 3,
            title: "React Performance",
            content:
                "React.memo helps prevent unnecessary component re-renders."
        },
        {
            id: 4,
            title: "React useMemo",
            content:
                "useMemo memoizes expensive calculations to improve performance."
        },
        {
            id: 5,
            title: "React useCallback",
            content:
                "useCallback memoizes functions and helps optimize child component rendering."
        },
        {
            id: 6,
            title: "Context API",
            content:
                "Context API allows state sharing without prop drilling."
        },
        {
            id: 7,
            title: "Redux",
            content:
                "Redux centralizes application state using a predictable store."
        },
        {
            id: 8,
            title: "React Router",
            content:
                "React Router enables client-side routing for React applications."
        },
        {
            id: 9,
            title: "Virtual DOM",
            content:
                "React updates only changed DOM elements using the Virtual DOM."
        },
        {
            id: 10,
            title: "Component Lifecycle",
            content:
                "Functional components use Hooks instead of lifecycle methods."
        },
        {
            id: 11,
            title: "Lazy Loading",
            content:
                "React.lazy improves application performance through code splitting."
        },
        {
            id: 12,
            title: "Suspense",
            content:
                "Suspense displays fallback content while waiting for lazy-loaded components."
        },
        {
            id: 13,
            title: "Error Boundaries",
            content:
                "Error Boundaries catch rendering errors in React component trees."
        },
        {
            id: 14,
            title: "React Forms",
            content:
                "Controlled components provide better form state management."
        },
        {
            id: 15,
            title: "Custom Hooks",
            content:
                "Custom Hooks help reuse stateful logic across components."
        },
        {
            id: 16,
            title: "React Strict Mode",
            content:
                "Strict Mode helps detect potential problems during development."
        },
        {
            id: 17,
            title: "Server Components",
            content:
                "React Server Components reduce client-side JavaScript."
        },
        {
            id: 18,
            title: "Hydration",
            content:
                "Hydration attaches React to server-rendered HTML."
        },
        {
            id: 19,
            title: "State Management",
            content:
                "State should be kept as local as possible for better maintainability."
        },
        {
            id: 20,
            title: "Best Practices",
            content:
                "Keep components small, reusable, and focused on a single responsibility."
        }
    ];

    return {
        query: plan.originalQuery,
        totalDocuments: documents.length,
        documents
    };
}