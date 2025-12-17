import { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import ReactDOM from 'react-dom/client';
import { Terminal as TerminalIcon, Monitor, Code as CodeIcon, Folder, FileCode, FileText, Plus, Trash2, X, ChevronDown, ChevronUp, Layout, Users, Github, MessageSquare, RefreshCw, Send } from 'lucide-react';
import io from 'socket.io-client';

import AppLayout from '../layouts/AppLayout';
import Button from '../components/ui/Button';

// Default Files
const DEFAULT_FILES = [
    {
        id: '1',
        name: 'App.jsx',
        language: 'javascript',
        content: `// Welcome to CodePlay IDE
// Run "npm start" in the terminal to view your app!

import React, { useState } from 'react';

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="container">
      <div className="card">
        <h1>React Counter 🚀</h1>
        <p>Edit this file and run <code>npm start</code> to see changes.</p>
        
        <div className="counter-display">
            Count: {count}
        </div>
        
        <div className="button-group">
            <button onClick={() => setCount(count - 1)} className="btn btn-secondary">
                Decrease
            </button>
            <button onClick={() => setCount(count + 1)} className="btn btn-primary">
                Increase
            </button>
        </div>
      </div>
    </div>
  );
};

// Required for CodePlay mounting
window.App = App;
`
    },
    {
        id: '2',
        name: 'styles.css',
        language: 'css',
        content: `/* Global Styles */
body {
  font-family: 'Inter', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  background: linear-gradient(135deg, #1e1e2e 0%, #2d2b55 100%);
  color: #fff;
}

.container {
  text-align: center;
}

.card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  max-width: 400px;
}

h1 {
  margin-top: 0;
  background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.counter-display {
  font-size: 2rem;
  font-weight: bold;
  margin: 2rem 0;
  font-family: monospace;
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.1s, opacity 0.2s;
}

.btn:active {
  transform: scale(0.95);
}

.btn:hover {
  opacity: 0.9;
}

.btn-primary {
  background: #4facfe;
  color: #fff;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}
`
    }
];

export default function IdePage() {
    // -- State --
    const [files, setFiles] = useState(DEFAULT_FILES);
    const [activeFileId, setActiveFileId] = useState('1'); // App.jsx
    const [running, setRunning] = useState(false);

    // Layout State
    const [showPreview, setShowPreview] = useState(true);
    const [showTerminal, setShowTerminal] = useState(true);

    // Collaboration State
    const [socket, setSocket] = useState(null);
    const [room, setRoom] = useState(null);
    const [isCollaborating, setIsCollaborating] = useState(false);
    // Generate a random username for this session to identify "Me" vs others
    const [username] = useState(() => 'User-' + Math.floor(Math.random() * 10000));

    // Chat / Peer Review State
    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const chatEndRef = useRef(null);

    // GitHub State
    const [isGithubConnected, setIsGithubConnected] = useState(false);
    const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);
    const [isPushing, setIsPushing] = useState(false);

    // Terminal State
    const [terminalLines, setTerminalLines] = useState([
        { type: 'system', content: 'CodePlay Shell v1.2.0' },
        { type: 'system', content: 'Type "npm start" to run your React application.' },
        { type: 'system', content: 'Type "help" for a list of commands.' }
    ]);
    const [commandInput, setCommandInput] = useState('');
    const terminalEndRef = useRef(null);
    const editorRef = useRef(null);

    // Active Tab State
    const [activeTab, setActiveTab] = useState('terminal');

    // -- Derived State --
    const activeFile = files.find(f => f.id === activeFileId) || files[0];

    // -- Effects --
    useEffect(() => {
        // Auto-scroll terminal
        if (showTerminal) {
            terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [terminalLines, showTerminal, activeTab]);

    useEffect(() => {
        // Listen for logs from preview
        const handleMessage = (event) => {
            if (!event.data) return;
            const { type, message } = event.data;

            if (type === 'ERROR') {
                addToTerminal('error', `Runtime Error: ${message}`);
                // Only auto-open if we are in terminal tab, or switch to console? 
                // Let's just notify. 
                // setShowTerminal(true); 
            } else if (type === 'CONSOLE_LOG') {
                addToTerminal('info', message);
            } else if (type === 'CONSOLE_ERROR') {
                addToTerminal('error', message);
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    // Socket Listener for Code Changes
    useEffect(() => {
        if (!socket) return;

        socket.on('receive_code_change', (data) => {
            // Update the file content from the incoming data
            setFiles(prev => prev.map(f => f.id === data.fileId ? { ...f, content: data.content } : f));
        });

        return () => {
            socket.off('receive_code_change');
            socket.off('receive_message');
        };
    }, [socket]);

    // Auto-scroll chat
    useEffect(() => {
        if (activeTab === 'discuss') {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, activeTab]);

    // -- Handlers --

    const sendMessage = (e) => {
        e.preventDefault();
        if (!chatInput.trim() || !socket || !room) return;

        const msgData = {
            room,
            sender: username,
            message: chatInput,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        socket.emit('send_message', msgData);
        setMessages(prev => [...prev, msgData]); // Add own message to state
        setChatInput('');
    };

    const handleGithubPush = () => {
        if (!isGithubConnected) {
            const token = window.prompt("Enter a mock GitHub Token (type anything, e.g., '12345'):");
            if (!token) return;

            setIsPushing(true);
            setTimeout(() => {
                setIsPushing(false);
                setIsGithubConnected(true);
                addToTerminal('success', 'GitHub: Successfully connected to repository.');
                alert('Connected to GitHub! (Simulation)');
            }, 1000);
            return;
        }

        if (!window.confirm("Push changes to main branch?")) return;
        setIsPushing(true);
        setTimeout(() => {
            setIsPushing(false);
            addToTerminal('success', 'Git: Pushed changes to main branch.');
            alert('Successfully pushed code to GitHub Repository: vijayKota2776/codeplay-react-app');
        }, 1500);
    };

    const resetSandbox = () => {
        const iframe = document.getElementById('ide-preview-frame');
        if (iframe) {
            iframe.srcdoc = '';
            setTimeout(runCode, 500);
        }
        addToTerminal('system', 'Sandbox environment execution reset.');
    };

    const connectToRoom = () => {
        const roomId = prompt('Enter Collaboration Room ID (e.g., room-1):');
        if (!roomId) return;

        // Initialize socket connection
        const newSocket = io('http://localhost:5001'); // Adjust port if needed

        newSocket.on('connect', () => {
            addToTerminal('system', `Connected to collaboration server.`);
            newSocket.emit('join_room', roomId);
            setRoom(roomId);
            setIsCollaborating(true);
            addToTerminal('success', `Joined room: ${roomId}`);
        });

        newSocket.on('receive_message', (data) => {
            setMessages(prev => [...prev, data]);
        });

        setSocket(newSocket);
    };

    const handleEditorDidMount = (editor) => {
        editorRef.current = editor;
    };

    const handleFileChange = (value) => {
        setFiles(prev => prev.map(f => f.id === activeFileId ? { ...f, content: value } : f));

        // Emit change if collaborating
        if (socket && room) {
            socket.emit('code_change', { room, fileId: activeFileId, content: value });
        }
    };

    const addNewFile = () => {
        const fileName = prompt('Enter file name (e.g., Component.jsx, styles.css):');
        if (!fileName) return;

        if (files.some(f => f.name === fileName)) {
            alert('File already exists!');
            return;
        }

        const newFile = {
            id: Date.now().toString(),
            name: fileName,
            language: fileName.endsWith('.css') ? 'css' : 'javascript',
            content: fileName.endsWith('.css') ? '/* New CSS file */' : '// New Component'
        };

        setFiles(prev => [...prev, newFile]);
        setActiveFileId(newFile.id);
    };

    const deleteFile = (e, id) => {
        e.stopPropagation(); // Prevent activating file
        if (files.length <= 1) {
            alert('Cannot delete the last file.');
            return;
        }
        if (!window.confirm('Are you sure you want to delete this file?')) return;

        setFiles(prev => prev.filter(f => f.id !== id));
        if (activeFileId === id) {
            setActiveFileId(files[0].id);
        }
    };

    const addToTerminal = (type, content) => {
        setTerminalLines(prev => [...prev, { type, content }]);
    };

    const executeCommand = (cmd) => {
        const parts = cmd.trim().split(' ');
        const main = parts[0].toLowerCase();

        addToTerminal('command', `> ${cmd}`);

        switch (main) {
            case 'npm':
                if (parts[1] === 'start') {
                    addToTerminal('system', 'Starting development server...');
                    runCode();
                } else if (parts[1] === 'test') {
                    addToTerminal('info', 'No tests found in this project.');
                } else if (parts[1] === 'install' || parts[1] === 'i') {
                    addToTerminal('success', 'All packages are up to date.');
                } else {
                    addToTerminal('error', `Unknown npm command: ${parts[1]}`);
                }
                break;
            case 'ls':
                const fileList = files.map(f => f.name).join('  ');
                addToTerminal('info', fileList);
                break;
            case 'clear':
            case 'cls':
                setTerminalLines([]);
                break;
            case 'help':
                addToTerminal('info', 'Available commands:');
                addToTerminal('info', '  npm start   - Run the application');
                addToTerminal('info', '  ls          - List files');
                addToTerminal('info', '  cat [file]  - View file content');
                addToTerminal('info', '  clear       - Clear terminal');
                break;
            case 'cat':
                if (!parts[1]) {
                    addToTerminal('error', 'Usage: cat [filename]');
                    break;
                }
                const targetFile = files.find(f => f.name === parts[1]);
                if (targetFile) {
                    addToTerminal('info', targetFile.content.substring(0, 200) + '...');
                } else {
                    addToTerminal('error', `File not found: ${parts[1]}`);
                }
                break;
            case '':
                break;
            default:
                addToTerminal('error', `Command not found: ${main}`);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            executeCommand(commandInput);
            setCommandInput('');
        }
    };

    const generatePreview = () => {
        // Concatenate all JS content (naive approach for mock)
        const appCode = files.find(f => f.name === 'App.jsx')?.content || '';
        const stylesCode = files.filter(f => f.name.endsWith('.css')).map(f => f.content).join('\n');

        const html = `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8" />
                    <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
                    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
                    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
                    <style>
                        /* Base resets */
                        ${stylesCode}
                    </style>
                </head>
                <body>
                    <div id="root"></div>
                    <script>
                        // Shim for require/import to work with Babel Standalone and globals
                        window.require = function(module) {
                            if (module === 'react') return window.React;
                            if (module === 'react-dom') return window.ReactDOM;
                            if (module === 'react-dom/client') return window.ReactDOM;
                            return {};
                        };
                        window.process = { env: { NODE_ENV: 'development' } };
                    </script>
                    <script type="text/babel" data-presets="env,react">
                        const originalLog = console.log;
                        const originalError = console.error;

                        console.log = (...args) => {
                            window.parent.postMessage({ type: 'CONSOLE_LOG', message: args.join(' ') }, '*');
                            originalLog(...args);
                        };
                        console.error = (...args) => {
                            window.parent.postMessage({ type: 'CONSOLE_ERROR', message: args.join(' ') }, '*');
                            originalError(...args);
                        };
                        
                        window.onerror = function(message, source, lineno, colno, error) {
                            window.parent.postMessage({ type: 'ERROR', message }, '*');
                        };

                        // -- User Code --
                        ${appCode}
                        // -- End User Code --

                        // Render Logic
                        setTimeout(() => {
                            try {
                                const UserApp = window.App || (typeof App !== 'undefined' ? App : null);
                                if (UserApp) {
                                    const root = ReactDOM.createRoot(document.getElementById('root'));
                                    root.render(<UserApp />);
                                } else {
                                    console.warn("No 'App' component found. Make sure to define 'App' and optionally attach it to window.App.");
                                }
                            } catch (err) {
                                window.parent.postMessage({ type: 'ERROR', message: err.message }, '*');
                            }
                        }, 100);
                    </script>
                </body>
            </html>
        `;
        return html;
    };

    const runCode = () => {
        setRunning(true);
        // Ensure preview is visible when running
        setShowPreview(true);
        // show build output in terminal
        setActiveTab('terminal');
        // And make sure terminal panel is open
        setShowTerminal(true);

        setTimeout(() => {
            const iframe = document.getElementById('ide-preview-frame');
            if (iframe) {
                iframe.srcdoc = generatePreview();
            }
            setRunning(false);
            addToTerminal('success', 'Compiled successfully!');
            addToTerminal('info', 'Serving on localhost:3000 (mock)...');
        }, 800);
    };

    // -- Render --
    return (
        <AppLayout>
            <div className="h-[calc(100vh-100px)] flex flex-col animate-fadeInUp max-w-[1920px] mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 border-b border-[var(--border-color)] pb-4 px-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <CodeIcon className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-[var(--text-primary)]">CodePlay IDE</h1>
                            <p className="text-xs text-[var(--text-secondary)]">React 18 Environment</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        {isCollaborating ? (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-green-500/10 border border-green-500/20 text-xs text-green-400">
                                <Users className="w-3 h-3" />
                                <span>Room: {room}</span>
                            </div>
                        ) : (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={connectToRoom}
                                className="hidden md:flex text-blue-400 hover:bg-blue-400/10"
                                icon={<Users className="w-4 h-4" />}
                            >
                                Collaborate
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleGithubPush}
                            loading={isPushing}
                            className={`hidden md:flex hover:bg-[#333] ${isGithubConnected ? 'text-green-500' : ''}`}
                            icon={<Github className={`w-4 h-4 ${isGithubConnected ? 'text-green-500' : ''}`} />}
                        >
                            {isGithubConnected ? 'Push to GitHub' : 'Connect GitHub'}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowPreview(!showPreview)}
                            className="hidden md:flex"
                            icon={<Layout className="w-4 h-4" />}
                        >
                            {showPreview ? 'Hide Preview' : 'Show Preview'}
                        </Button>
                    </div>
                </div>

                {/* Main IDE Layout */}
                <div className="flex-1 min-h-0 flex gap-4">

                    {/* 1. File Explorer Sidebar */}
                    <div className="w-64 flex-shrink-0 rounded-xl border border-[var(--border-color)] bg-[var(--surface-secondary)] shadow-lg flex flex-col overflow-hidden">
                        <div className="p-3 border-b border-[var(--border-color)] flex items-center justify-between">
                            <span className="text-sm font-bold text-[var(--text-primary)]">EXPLORER</span>
                            <div className="flex gap-1">
                                <button
                                    onClick={addNewFile}
                                    className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
                                    title="New File"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2">
                            <div className="mb-2">
                                <div className="flex items-center gap-2 px-2 py-1 text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider">
                                    <Folder className="w-3 h-3" />
                                    Project
                                </div>
                                <div className="mt-1 space-y-0.5">
                                    {files.map(file => (
                                        <div
                                            key={file.id}
                                            onClick={() => setActiveFileId(file.id)}
                                            className={`group flex items-center justify-between px-3 py-1.5 rounded cursor-pointer text-sm transition-colors ${activeFileId === file.id
                                                ? 'bg-blue-500/20 text-blue-400'
                                                : 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                {file.name.endsWith('.css') ?
                                                    <span className="text-pink-400">#</span> :
                                                    <FileCode className="w-4 h-4 text-yellow-400" />
                                                }
                                                <span className="truncate">{file.name}</span>
                                            </div>
                                            {/* Delete button (hidden by default, show on hover) */}
                                            <button
                                                onClick={(e) => deleteFile(e, file.id)}
                                                className={`opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 hover:text-red-400 rounded transition-all ${files.length <= 1 ? 'hidden' : ''}`}
                                                title="Delete File"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                    {/* Mock items to look busy */}
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded text-sm text-gray-500 cursor-not-allowed opacity-50">
                                        <FileText className="w-4 h-4 text-gray-500" />
                                        package.json
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded text-sm text-gray-500 cursor-not-allowed opacity-50">
                                        <FileText className="w-4 h-4 text-gray-500" />
                                        README.md
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Work Area (Editor + Preview + Terminal) */}
                    <div className="flex-1 flex flex-col gap-4 min-w-0">

                        {/* Upper Section: Editor | Preview */}
                        <div className="flex-1 flex gap-4 min-h-0">
                            {/* Code Editor */}
                            <div className="flex-1 rounded-xl border border-[var(--border-color)] bg-[#1e1e1e] shadow-xl flex flex-col overflow-hidden min-w-[300px]">
                                {/* Tabs */}
                                <div className="flex bg-[#252526] border-b border-[#333] overflow-x-auto scrollbar-hide">
                                    {files.map(file => (
                                        <div
                                            key={file.id}
                                            onClick={() => setActiveFileId(file.id)}
                                            className={`px-4 py-2 text-sm cursor-pointer flex items-center gap-2 border-r border-[#333] flex-shrink-0 ${activeFileId === file.id
                                                ? 'bg-[#1e1e1e] text-blue-400 border-t-2 border-t-blue-400'
                                                : 'text-gray-400 hover:bg-[#2a2a2a]'
                                                }`}
                                        >
                                            <span>{file.name}</span>
                                            {activeFileId === file.id && (
                                                <span className="ml-1 w-2 h-2 rounded-full bg-blue-400 opacity-50 hover:opacity-100"></span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex-1 relative">
                                    <Editor
                                        height="100%"
                                        defaultLanguage={activeFile.language}
                                        language={activeFile.language}
                                        value={activeFile.content}
                                        onChange={handleFileChange}
                                        onMount={handleEditorDidMount}
                                        theme="vs-dark"
                                        path={activeFile.name}
                                        options={{
                                            minimap: { enabled: true },
                                            fontSize: 14,
                                            lineNumbers: 'on',
                                            roundedSelection: true,
                                            scrollBeyondLastLine: false,
                                            automaticLayout: true,
                                            fontFamily: '"Fira Code", monospace',
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Live Preview Pane */}
                            {showPreview && (
                                <div className="w-[40%] rounded-xl border border-[var(--border-color)] bg-white shadow-xl flex flex-col overflow-hidden transition-all duration-300">
                                    <div className="bg-gray-100 border-b border-gray-200 px-3 py-2 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Monitor className="w-4 h-4 text-gray-500" />
                                            <span className="text-xs font-bold text-gray-600 uppercase">Localhost:3000 (Sandboxed)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={resetSandbox}
                                                className="p-1 hover:bg-gray-200 rounded text-gray-500"
                                                title="Reset Execution Environment"
                                            >
                                                <RefreshCw className="w-3.5 h-3.5" />
                                            </button>
                                            <div className="flex gap-1">
                                                <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                                                <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 relative">
                                        {running && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-20 text-blue-600">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-2"></div>
                                                Building...
                                            </div>
                                        )}
                                        <iframe
                                            id="ide-preview-frame"
                                            title="IDE Preview"
                                            className="w-full h-full border-none"
                                            sandbox="allow-scripts allow-same-origin"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Lower Section: Terminal (Bottom) */}
                        <div className={`rounded-xl border border-[var(--border-color)] bg-[#1e1e1e] shadow-xl flex flex-col overflow-hidden transition-all duration-300 ${showTerminal ? 'h-48' : 'h-9'
                            }`}>
                            {/* Toggle Tabs */}
                            <div className="flex border-b border-[var(--border-color)] items-center pr-2 bg-[#1e1e1e]">
                                <div className="flex-1 flex">
                                    <button
                                        onClick={() => { setActiveTab('terminal'); setShowTerminal(true); }}
                                        className={`px-6 py-2 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'terminal' && showTerminal
                                            ? 'bg-[#2d2d2d] text-blue-400 border-t-2 border-t-blue-400'
                                            : 'text-gray-400 hover:bg-[#2d2d2d]'
                                            }`}
                                    >
                                        <TerminalIcon className="w-4 h-4" /> Terminal
                                    </button>
                                    <button
                                        onClick={() => { setActiveTab('discuss'); setShowTerminal(true); }}
                                        className={`px-6 py-2 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'discuss' && showTerminal
                                            ? 'bg-[#2d2d2d] text-green-400 border-t-2 border-t-green-400'
                                            : 'text-gray-400 hover:bg-[#2d2d2d]'
                                            }`}
                                    >
                                        <MessageSquare className="w-4 h-4" /> Discuss
                                    </button>
                                </div>
                                {/* Minimize/Maximize Toggle */}
                                <button
                                    onClick={() => setShowTerminal(!showTerminal)}
                                    className="p-1 hover:bg-white/10 rounded text-gray-400 ml-2"
                                    title={showTerminal ? "Minimize Panel" : "Maximize Panel"}
                                >
                                    {showTerminal ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                                </button>
                            </div>

                            {/* Content Area */}
                            {showTerminal && (
                                <div className="flex-1 relative bg-black">
                                    {/* Terminal View */}
                                    <div className={`absolute inset-0 flex flex-col bg-[#1e1e1e] p-4 text-sm font-mono transition-opacity duration-200 ${activeTab === 'terminal' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                                        }`}>
                                        <div className="flex-1 overflow-y-auto space-y-1 pb-2">
                                            {terminalLines.map((line, i) => (
                                                <div key={i} className={`break-words ${line.type === 'error' ? 'text-red-400' :
                                                    line.type === 'system' ? 'text-blue-400' :
                                                        line.type === 'success' ? 'text-green-400' :
                                                            line.type === 'command' ? 'text-gray-500 font-bold mt-2' :
                                                                'text-gray-300'
                                                    }`}>
                                                    {line.content}
                                                </div>
                                            ))}
                                            <div ref={terminalEndRef} />
                                        </div>
                                        <div className="flex items-center gap-2 pt-2 border-t border-gray-800">
                                            <span className="text-green-500 font-bold">➜</span>
                                            <span className="text-cyan-400 font-bold">~/project</span>
                                            <input
                                                type="text"
                                                className="flex-1 bg-transparent border-none outline-none text-white font-mono"
                                                value={commandInput}
                                                onChange={(e) => setCommandInput(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                                placeholder="npm start"
                                                spellCheck={false}
                                            />
                                        </div>
                                    </div>

                                    {/* Discussion / Peer Review View */}
                                    <div className={`absolute inset-0 flex flex-col bg-[#1e1e1e] transition-opacity duration-200 ${activeTab === 'discuss' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                                        }`}>
                                        {!isCollaborating ? (
                                            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-4 text-center">
                                                <MessageSquare className="w-12 h-12 mb-2 opacity-20" />
                                                <p>Join a collaboration room to start peer review.</p>
                                                <Button variant="outline" size="sm" onClick={connectToRoom} className="mt-4">Join Room</Button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                                    {messages.map((msg, idx) => {
                                                        const isMe = msg.sender === username;
                                                        return (
                                                            <div key={idx} className="flex flex-col">
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`${isMe ? 'text-blue-400' : 'text-green-400'} font-bold text-xs`}>
                                                                        {isMe ? 'Me' : msg.sender}
                                                                    </span>
                                                                    <span className="text-gray-600 text-[10px]">{msg.timestamp}</span>
                                                                </div>
                                                                <p className="text-gray-300 text-sm bg-white/5 rounded p-2 mt-1">{msg.message}</p>
                                                            </div>
                                                        );
                                                    })}
                                                    <div ref={chatEndRef} />
                                                </div>
                                                <form onSubmit={sendMessage} className="p-3 border-t border-gray-700 flex gap-2">
                                                    <input
                                                        type="text"
                                                        className="flex-1 bg-black/30 border border-gray-700 rounded px-3 py-1.5 text-sm text-white focus:border-blue-500 outline-none"
                                                        placeholder="Type your review comment..."
                                                        value={chatInput}
                                                        onChange={(e) => setChatInput(e.target.value)}
                                                    />
                                                    <Button size="sm" type="submit" icon={<Send className="w-3 h-3" />} />
                                                </form>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div >
        </AppLayout >
    );
}
