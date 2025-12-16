import { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { api } from '../api';
import AppLayout from '../layouts/AppLayout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';

export default function LabPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const courseId = searchParams.get('courseId');
    const topicId = searchParams.get('topicId');

    const [labData, setLabData] = useState(null);
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(true);
    const [running, setRunning] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const editorRef = useRef(null);

    useEffect(() => {
        if (!courseId || !topicId) {
            navigate('/courses');
            return;
        }

        const fetchLabData = async () => {
            try {
                const res = await api.get(`/lab?courseId=${courseId}&topicId=${topicId}`);
                setLabData(res.data);
                setCode(res.data.starterCode || '// Start coding here!');
            } catch (error) {
                console.error('Failed to fetch lab data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLabData();
    }, [courseId, topicId, navigate]);

    const handleEditorDidMount = (editor) => {
        editorRef.current = editor;
    };

    const runCode = async () => {
        setRunning(true);
        setOutput('▶ Running code in Docker environment...\n');

        try {
            const res = await api.post('/execute-code', {
                code,
                language: labData?.language || 'javascript',
                courseId,
                topicId,
            });

            setOutput(prev => prev + '\n' + (res.data.output || 'Code executed successfully'));
        } catch (error) {
            setOutput(prev => prev + '\nError: ' + (error.response?.data?.error || 'Execution failed'));
        } finally {
            setRunning(false);
        }
    };

    const submitCode = async () => {
        setSubmitting(true);

        try {
            await api.post('/submit-code', {
                code,
                courseId,
                topicId,
            });

            setOutput('✅ Code submitted successfully!\n\nYour submission has been recorded.');
        } catch (error) {
            setOutput('❌ Submission failed: ' + (error.response?.data?.error || 'Please try again'));
        } finally {
            setSubmitting(false);
        }
    };

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
            <div className="space-y-4 animate-fadeInUp">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-extrabold text-gradient">
                                {labData?.title || 'Lab Environment'}
                            </h1>
                            <Badge variant="accent" dot pulse>
                                Live Environment
                            </Badge>
                        </div>
                        <p className="text-[var(--text-secondary)]">
                            {labData?.description || 'Complete the lab exercise below'}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="secondary"
                            onClick={runCode}
                            loading={running}
                            icon={
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                            }
                        >
                            Run
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

                {/* Instructions */}
                {labData?.instructions && (
                    <Card variant="glass">
                        <h3 className="font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Instructions
                        </h3>
                        <div className="prose prose-invert max-w-none">
                            <p className="text-[var(--text-secondary)]">{labData.instructions}</p>
                        </div>
                    </Card>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Editor */}
                    <Card variant="glass" className="p-0 overflow-hidden">
                        <div className="bg-[var(--surface-secondary)] px-4 py-2 border-b border-[var(--border-color)]">
                            <span className="text-sm font-mono text-[var(--text-secondary)]">
                                editor.{labData?.language || 'js'}
                            </span>
                        </div>
                        <div className="h-[500px]">
                            <Editor
                                height="100%"
                                defaultLanguage={labData?.language || 'javascript'}
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

                    {/* Output/Terminal */}
                    <Card variant="glass">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Output
                            </h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setOutput('')}
                            >
                                Clear
                            </Button>
                        </div>
                        <div className="bg-[var(--color-dominant)] rounded-lg p-4 h-[500px] overflow-y-auto font-mono text-sm">
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
            </div>
        </AppLayout>
    );
}
