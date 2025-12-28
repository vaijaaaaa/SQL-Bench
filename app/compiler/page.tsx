"use client";

import { useState, useEffect } from "react";
import { Play, RotateCcw, CheckCircle2, XCircle, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Maximize2, Loader } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = 'nav { display: none !important; }';
  document.head.appendChild(style);
}

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  category: string;
  schema: string;
  sampleData: string;
  solution: string;
  _count: { testCases: number };
}

interface TestCase {
  id: string;
  input: string;
  expected: string;
  isHidden: boolean;
}

export default function CompilerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [code, setCode] = useState("-- Write your SQL query here\nSELECT * FROM users;");
  const [output, setOutput] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTestCases, setShowTestCases] = useState(true);
  const [activeTab, setActiveTab] = useState<"testcase" | "result" | "console">("testcase");
  const [testResults, setTestResults] = useState<any>(null);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const difficultyColors: Record<string, string> = {
    EASY: "text-green-500 bg-green-500/10 border-green-500/20",
    MEDIUM: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
    HARD: "text-red-500 bg-red-500/10 border-red-500/20"
  };

  // Fetch problem and test cases
  useEffect(() => {
    const problemId = searchParams.get('problemId');
    if (problemId) {
      fetchProblem(problemId);
    }
  }, [searchParams]);

  const fetchProblem = async (problemId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/problems/${problemId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to load problem (${response.status})`);
      }
      const data = await response.json();
      if (!data || !data.title) {
        throw new Error('Invalid problem data received');
      }
      setProblem(data);
      setCode("-- Write your SQL query here\n");
      
      // Fetch test cases
      const testResponse = await fetch(`/api/problems/${problemId}/testcases`);
      if (testResponse.ok) {
        const testData = await testResponse.json();
        setTestCases(testData);
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Failed to load problem';
      console.error('Fetch problem error:', errMsg);
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRun = async () => {
    if (!code.trim()) {
      setError('Please enter a SQL query');
      return;
    }

    setIsRunning(true);
    setActiveTab("result");
    setConsoleOutput([]);
    
    try {
      const response = await fetch('/api/submissions/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: problem?.id,
          code: code,
          isSubmission: false
        })
      });

      const result = await response.json();
      setConsoleOutput(prev => [...prev, "[INFO] Starting query execution..."]);
      
      if (result.success) {
        setConsoleOutput(prev => [...prev, "[SUCCESS] Query executed successfully"]);
        setConsoleOutput(prev => [...prev, `[INFO] ${result.rows?.length || 0} rows returned`]);
        setOutput({
          success: true,
          rows: result.rows || [],
          executionTime: "45ms"
        });
      } else {
        setConsoleOutput(prev => [...prev, `[ERROR] ${result.error}`]);
        setOutput({
          success: false,
          error: result.error || 'Unknown error'
        });
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Query execution failed';
      setConsoleOutput(prev => [...prev, `[ERROR] ${errMsg}`]);
      setOutput({
        success: false,
        error: errMsg
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      setError('Please enter a SQL query');
      return;
    }

    setIsSubmitting(true);
    setActiveTab("testcase");
    
    try {
      const response = await fetch('/api/submissions/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: problem?.id,
          code: code,
          isSubmission: true
        })
      });

      const result = await response.json();
      
      if (result.testResults) {
        setTestResults({
          passed: result.testResults.filter((t: any) => t.passed).length,
          total: result.testResults.length,
          cases: result.testResults.map((t: any, idx: number) => ({
            id: idx + 1,
            name: `Test Case ${idx + 1}`,
            passed: t.passed,
            time: "12ms",
            error: t.error
          }))
        });
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Submission failed';
      setConsoleOutput(prev => [...prev, `[ERROR] ${errMsg}`]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setCode("-- Write your SQL query here\n");
    setOutput(null);
    setTestResults(null);
    setActiveTab("testcase");
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader size={40} className="text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading problem...</p>
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <XCircle size={40} className="text-destructive mx-auto mb-4" />
          <p className="text-destructive mb-4">{error || 'Problem not found'}</p>
          <Button
            onClick={() => router.back()}
            variant="default"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Panel - Problem Description */}
        <div className="w-[40%] border-r border-border flex flex-col bg-card/50">
          
          {/* Back to Dashboard Button */}
          <div className="p-4 border-b border-border flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft size={16} className="mr-2" />
              Back to Dashboard
            </Button>
          </div>

          <div className="p-6 border-b border-border bg-card">
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${difficultyColors[problem.difficulty]}`}>
                {problem.difficulty}
              </span>
              <span className="text-xs text-muted-foreground">{problem.category}</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">{problem.title}</h1>
            <p className="text-xs text-muted-foreground">{problem._count.testCases} test cases</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {/* Problem Description */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wider">Description</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {problem.description}
                </p>
              </div>

              {/* Schema */}
              <div>
                <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wider">Schema</h3>
                <div className="bg-muted/50 border border-border rounded-xl p-4">
                  <pre className="text-xs font-mono text-muted-foreground overflow-x-auto whitespace-pre-wrap break-words">
                    {problem.schema}
                  </pre>
                </div>
              </div>

              {/* Sample Data */}
              <div>
                <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wider">Sample Data</h3>
                <div className="bg-muted/50 border border-border rounded-xl p-4">
                  <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
                    {problem.sampleData}
                  </pre>
                </div>
              </div>

              {/* Solution */}
              <div>
                <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wider">Solution</h3>
                <div className="bg-muted/50 border border-border rounded-xl p-4">
                  <pre className="text-xs font-mono text-primary overflow-x-auto">
                    {problem.solution}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="flex-1 flex flex-col bg-background">
          
          {/* Editor Header */}
          <div className="h-12 px-4 flex items-center justify-between border-b border-border bg-card">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">SQL Editor</span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="h-8 text-xs text-muted-foreground hover:text-foreground"
              >
                <RotateCcw size={14} className="mr-1.5" />
                Reset
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRun}
                disabled={isRunning}
                className="h-8 text-xs font-bold"
              >
                {isRunning ? (
                  <>
                    <Loader size={14} className="animate-spin mr-1.5" />
                    Running
                  </>
                ) : (
                  <>
                    <Play size={14} className="mr-1.5" />
                    Run
                  </>
                )}
              </Button>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="h-8 text-xs font-bold"
              >
                {isSubmitting ? (
                  <>
                    <Loader size={14} className="animate-spin mr-1.5" />
                    Submitting
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </div>

          {/* Code Editor */}
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 w-full p-6 bg-background text-foreground font-mono text-sm resize-none focus:outline-none custom-scrollbar"
            placeholder="Write your SQL query here..."
            spellCheck={false}
          />

          {/* Output Panel */}
          <div className="border-t border-border bg-card">
            {/* Tabs */}
            <div className="flex items-center border-b border-border">

              <button
                onClick={() => {
                  setActiveTab("testcase");
                  setShowTestCases(true);
                }}
                className={`px-4 py-2.5 text-xs font-semibold transition-all ${
                  activeTab === "testcase"
                    ? "text-foreground border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Testcase
              </button>
              <button
                onClick={() => {
                  setActiveTab("result");
                  setShowTestCases(true);
                }}
                className={`px-4 py-2.5 text-xs font-semibold transition-all ${
                  activeTab === "result"
                    ? "text-foreground border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Result
              </button>
              <button
                onClick={() => {
                  setActiveTab("console");
                  setShowTestCases(true);
                }}
                className={`px-4 py-2.5 text-xs font-semibold transition-all ${
                  activeTab === "console"
                    ? "text-foreground border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Console {consoleOutput.length > 0 && `(${consoleOutput.length})`}
              </button>
              <button 
                onClick={() => setShowTestCases(!showTestCases)}
                className="ml-auto px-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showTestCases ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              </button>
            </div>

            {/* Output Content */}
            {showTestCases && (
              <div className="h-64 overflow-y-auto p-4 bg-background custom-scrollbar">
                {activeTab === "testcase" ? (
                  !testResults ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                      <div className="text-center">
                        <CheckCircle2 size={32} className="mx-auto mb-2 opacity-50" />
                        <p>Submit your solution to run test cases</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`text-sm font-bold ${testResults.passed === testResults.total ? 'text-green-500' : 'text-yellow-500'}`}>
                          {testResults.passed === testResults.total ? (
                            <div className="flex items-center gap-2">
                              <CheckCircle2 size={20} className="text-green-500" />
                              <span>All test cases passed!</span>
                            </div>
                          ) : (
                            <span>{testResults.passed}/{testResults.total} test cases passed</span>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        {testResults.cases.map((testCase: any) => (
                          <div
                            key={testCase.id}
                            className={`p-4 rounded-lg border ${
                              testCase.passed
                                ? "bg-green-500/5 border-green-500/20"
                                : "bg-red-500/5 border-red-500/20"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {testCase.passed ? (
                                  <CheckCircle2 size={16} className="text-green-500" />
                                ) : (
                                  <XCircle size={16} className="text-red-500" />
                                )}
                                <span className="text-sm font-semibold text-foreground">
                                  {testCase.name}
                                </span>
                              </div>
                              <span className="text-xs text-muted-foreground">{testCase.time}</span>
                            </div>
                            {!testCase.passed && testCase.error && (
                              <div className="mt-2 text-xs text-red-500 font-mono">
                                {testCase.error}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ) : activeTab === "result" ? (
                  !output ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                      <div className="text-center">
                        <Play size={32} className="mx-auto mb-2 opacity-50" />
                        <p>Run your query to see results</p>
                      </div>
                    </div>
                  ) : output.success && output.rows ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{output.rows.length} rows returned</span>
                        <span>Execution time: {output.executionTime}</span>
                      </div>
                      <div className="bg-card border border-border rounded-lg overflow-hidden">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-border">
                              {output.rows.length > 0 && Object.keys(output.rows[0]).map((key) => (
                                <th key={key} className="px-4 py-2 text-left font-semibold text-muted-foreground bg-muted/50">
                                  {key}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {output.rows.map((row: any, i: number) => (
                              <tr key={i} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                                {Object.values(row).map((val: any, j: number) => (
                                  <td key={j} className="px-4 py-2 text-foreground font-mono">
                                    {String(val)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-destructive">
                        <XCircle size={16} />
                        <span className="text-sm font-semibold">Query Error</span>
                      </div>
                      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                        <pre className="text-xs text-destructive font-mono whitespace-pre-wrap break-words">{output.error}</pre>
                      </div>
                    </div>
                  )
                ) : activeTab === "console" ? (
                  <div className="h-full overflow-y-auto font-mono text-xs text-primary bg-card rounded-lg p-2">
                    {consoleOutput.length === 0 ? (
                      <div className="text-muted-foreground">No console output yet.</div>
                    ) : (
                      consoleOutput.map((line, idx) => (
                        <div key={idx}>{line}</div>
                      ))
                    )}
                  </div>
                ) : null}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
