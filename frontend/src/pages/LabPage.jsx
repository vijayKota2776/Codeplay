import { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'; // Removed Link
import Editor from '@monaco-editor/react';
import ReactDOM from 'react-dom/client'; // Import ReactDOM for direct React 18 render if needed, though often iframe uses its own
import { api } from '../api';
import AppLayout from '../layouts/AppLayout';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';

export default function LabPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate(); // eslint-disable-line no-unused-vars
    const courseId = searchParams.get('courseId');
    const topicId = searchParams.get('topicId');

    // -- State Definitions --
    const [code, setCode] = useState(`// Welcome to the React Playground!
// Define a component named App to see your changes.

const App = () => {
  const [count, setCount] = React.useState(0);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>Hello CodePlay! 🚀</h1>
      <p>This is a live React environment.</p>
      
      <div style={{ 
        marginTop: '20px', 
        padding: '20px', 
        background: 'rgba(255,255,255,0.1)', 
        borderRadius: '8px' 
      }}>
        <h2>Clicks: {count}</h2>
        <button onClick={() => setCount(count + 1)}>
          Click Me
        </button>
      </div>
    </div>
  );
};

// DO NOT DELETE: This line is required for the preview system to find your component
window.App = App;
`);
    const [output, setOutput] = useState('');
    const [running, setRunning] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [labData, setLabData] = useState(null);
    const [activeTab, setActiveTab] = useState('preview'); // 'preview' or 'console'

    const editorRef = useRef(null);

    // Initial load
    useEffect(() => {
        const fetchLabData = async () => {
            if (!courseId || !topicId) {
                setLoading(false);
                return;
            }
            try {
                // Here we would fetch the specific exercise details
                // const res = await api.get(\`/courses/\${courseId}/topics/\${topicId}\`);
                // setLabData(res.data);

                // For now, mock it or fetch basic course info
                setLabData({ title: 'React Lab' });
            } catch (error) {
                console.error("Failed to load lab data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLabData();
    }, [courseId, topicId]);

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
    };

    const generatePreview = () => {
        // We inject the user's code into an HTML template
        // Note: In a real production app, you might want to use a more robust bundler or sandbox (like Sandpack)
        const html = `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8" />
                    <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
                    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
                    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
                    <style>
                        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #fff; background: transparent; margin: 0; padding: 1rem; }
                        /* Add some basic fast styling for common elements */
                        h1 { color: #60a5fa; }
                        button { background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 1rem; transition: background 0.2s; }
                        button:hover { background: #2563eb; }
                    </style>
                </head>
                <body>
                    <div id="root"></div>
                    <script type="text/babel">
                        window.onerror = function(message, source, lineno, colno, error) {
                            window.parent.postMessage({ type: 'ERROR', message }, '*');
                        };
                        
                        try {
                            // -- USER CODE START --
                            ${code}
                            // -- USER CODE END --

                            // Check if App exists and render it
                            // We look for window.App if declared globally, or simply App if in scope
                            const UserApp = window.App || (typeof App !== 'undefined' ? App : null);

                            if (UserApp) {
                                const root = ReactDOM.createRoot(document.getElementById('root'));
                                root.render(<UserApp />);
                            } else {
                                document.getElementById('root').innerHTML = '<div style="color: #fbbf24; padding: 20px; text-align: center;">⚠️ <strong>App</strong> component not found.<br/><br/>Please define <code>const App = () => { ... }</code> and ensure <code>window.App = App</code> is at the end if strict mode is active.</div>';
                            }
                        } catch (err) {
                            window.parent.postMessage({ type: 'ERROR', message: err.message }, '*');
                        }
                    </script>
                </body>
            </html>
        `;
        return html;
    };

    const runCode = async () => {
        setRunning(true);
        setActiveTab('preview');
        // Reset output
        setOutput('');

        // Update the iframe
        const iframe = document.getElementById('preview-frame');
        if (iframe) {
            iframe.srcdoc = generatePreview();
        }

        // Emulate a delay for UX
        setTimeout(() => {
            setRunning(false);
        }, 800);
    };

    const submitCode = async () => {
        setSubmitting(true);
        try {
            await api.post('/submissions', {
                courseId,
                topicId,
                code,
                status: 'completed'
            });
            alert('Great job! Your code has been saved.');
        } catch (error) {
            console.error('Submission error', error);
            alert('Failed to submit code. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    // Listen for iframe errors
    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data?.type === 'ERROR') {
                setOutput(prev => prev + '\n❌ Runtime Error: ' + event.data.message);
                setActiveTab('console');
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    if (loading) {
        return (
            <AppLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Spinner size="xl" />
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="space-y-4 animate-fadeInUp max-w-[1920px] mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                                {labData?.title || 'React Playground'}
                            </h1>
                            <Badge variant="accent" dot>
                                Live Preview
                            </Badge>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)]">
                            Create an <code>App</code> component to visualize your code.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="success"
                            onClick={runCode}
                            loading={running}
                            className="min-w-[100px]"
                            icon={
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                        >
                            Run Code
                        </Button>
                        <Button
                            variant="primary"
                            onClick={submitCode}
                            loading={submitting}
                        >
                            Submit
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-250px)] min-h-[500px]">
                    {/* Editor Column */}
                    <div className="glass rounded-xl overflow-hidden flex flex-col h-full border border-[var(--border-color)] shadow-lg">
                        <div className="bg-[var(--surface-secondary)] px-4 py-2 border-b border-[var(--border-color)] flex justify-between items-center">
                            <span className="text-sm font-mono text-[var(--text-secondary)] flex items-center gap-2">
                                <svg className="w-4 h-4 text-[#61DAFB]" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                                </svg>
                                App.jsx
                            </span>
                        </div>
                        <div className="flex-1 relative">
                            <Editor
                                height="100%"
                                defaultLanguage="javascript"
                                language="javascript"
                                value={code}
                                onChange={(value) => setCode(value || '')}
                                onMount={handleEditorDidMount}
                                theme="vs-dark"
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 15,
                                    lineNumbers: 'on',
                                    padding: { top: 16 },
                                    roundedSelection: true,
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                    fontFamily: '"Fira Code", monospace',
                                }}
                            />
                        </div>
                    </div>

                    {/* Preview Column */}
                    <div className="glass rounded-xl overflow-hidden flex flex-col h-full border border-[var(--border-color)] shadow-lg relative bg-black/40">
                        <div className="bg-[var(--surface-secondary)] px-4 py-2 border-b border-[var(--border-color)] flex gap-4">
                            <button
                                onClick={() => setActiveTab('preview')}
                                className={`text-sm font-medium pb-2 -mb-2.5 px-2 transition-colors ${activeTab === 'preview' ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                            >
                                Preview
                            </button>
                            <button
                                onClick={() => setActiveTab('console')}
                                className={`text-sm font-medium pb-2 -mb-2.5 px-2 transition-colors ${activeTab === 'console' ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                            >
                                Console / Errors
                            </button>
                        </div>

                        <div className="flex-1 relative bg-white/5">
                            {/* Iframe Preview */}
                            <iframe
                                id="preview-frame"
                                title="Live Preview"
                                className={`w-full h-full border-none bg-black/80 ${activeTab === 'preview' ? 'block' : 'hidden'}`}
                                sandbox="allow-scripts allow-same-origin"
                            />

                            {/* Console Output */}
                            <div className={`p-4 font-mono text-sm h-full overflow-y-auto ${activeTab === 'console' ? 'block' : 'hidden'}`}>
                                {output ? (
                                    <pre className="text-red-400 whitespace-pre-wrap">{output}</pre>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-[var(--text-tertiary)]">
                                        <p>No errors detected.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
