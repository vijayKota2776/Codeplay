import { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Terminal } from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function IdePage() {
    const [code, setCode] = useState('// Start coding here!\nconsole.log("Hello, Codeplay!");');
    const [output, setOutput] = useState('');
    const [running, setRunning] = useState(false);
    const editorRef = useRef(null);

    const handleEditorDidMount = (editor) => {
        editorRef.current = editor;
    };

    const runCode = () => {
        setRunning(true);
        setOutput('');

        // Simulate code execution
        setTimeout(() => {
            try {
                // Capture console.log output
                const logs = [];
                const originalLog = console.log;
                console.log = (...args) => {
                    logs.push(args.join(' '));
                    originalLog(...args);
                };

                // Execute code
                // eslint-disable-next-line no-eval
                eval(code);

                // Restore console.log
                console.log = originalLog;

                setOutput(logs.join('\n') || 'Code executed successfully (no output)');
            } catch (error) {
                setOutput(`Error: ${error.message}`);
            } finally {
                setRunning(false);
            }
        }, 500);
    };

    return (
        <AppLayout>
            <div className="space-y-4 animate-fadeInUp">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gradient">
                            Code Playground
                        </h1>
                        <p className="text-[var(--text-secondary)] mt-1">
                            Experiment with JavaScript in real-time
                        </p>
                    </div>
                    <Button
                        variant="primary"
                        size="lg"
                        loading={running}
                        onClick={runCode}
                        icon={<Play className="w-5 h-5 fill-current" />}
                    >
                        Run Code
                    </Button>
                </div>

                {/* Editor */}
                <Card variant="glass" className="p-0 overflow-hidden">
                    <div className="h-[400px]">
                        <Editor
                            height="100%"
                            defaultLanguage="javascript"
                            value={code}
                            onChange={(value) => setCode(value || '')}
                            onMount={handleEditorDidMount}
                            theme="vs-dark"
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                lineNumbers: 'on',
                                roundedSelection: true,
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                            }}
                        />
                    </div>
                </Card>

                {/* Output Console */}
                <Card variant="glass">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-2">
                            <Terminal className="w-5 h-5" />
                            Console Output
                        </h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setOutput('')}
                        >
                            Clear
                        </Button>
                    </div>
                    <div className="bg-[var(--color-dominant)] rounded-lg p-4 min-h-[120px] font-mono text-sm">
                        {output ? (
                            <pre className="text-[var(--text-primary)] whitespace-pre-wrap">
                                {output}
                            </pre>
                        ) : (
                            <p className="text-[var(--text-tertiary)] italic">
                                Run your code to see output here...
                            </p>
                        )}
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
