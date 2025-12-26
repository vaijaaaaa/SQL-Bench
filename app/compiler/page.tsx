"use client";

import { useState, useEffect } from "react";
import { Play, RotateCcw, CheckCircle2, XCircle, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Maximize2, Loader } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

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
  const [activeTab, setActiveTab] = useState<"testcase" | "result">("testcase");
  const [testResults, setTestResults] = useState<any>(null);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const difficultyColors: Record<string, string> = {
    EASY: "text-[#C6FE1E] bg-[#C6FE1E]/10 border-[#C6FE1E]/20",
    MEDIUM: "text-[#FCD34D] bg-[#FCD34D]/10 border-[#FCD34D]/20",
    HARD: "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20"
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
      <div className="h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <Loader size={40} className="text-[#C6FE1E] animate-spin mx-auto mb-4" />
          <p className="text-[#71717A]">Loading problem...</p>
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <XCircle size={40} className="text-[#EF4444] mx-auto mb-4" />
          <p className="text-[#EF4444] mb-4">{error || 'Problem not found'}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-[#C6FE1E] text-black font-bold rounded-lg hover:bg-[#b5ed0d]"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#050505] flex flex-col">
      
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Panel - Problem Description */}
        <div className="w-[40%] border-r border-[#262626]/50 flex flex-col">
          
          {/* Back Button */}
          <div className="p-4 border-b border-[#262626]/50">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-[#71717A] hover:text-white transition-colors group"
            >
              <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-semibold">Back</span>
            </button>
          </div>

          <div className="p-6 border-b border-[#262626]/50 bg-[#0A0A0A]">
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${difficultyColors[problem.difficulty]}`}>
                {problem.difficulty}
              </span>
              <span className="text-xs text-[#71717A]">{problem.category}</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">{problem.title}</h1>
            <p className="text-xs text-[#71717A]">{problem._count.testCases} test cases</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {/* Problem Description */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Description</h3>
                <p className="text-[#A1A1AA] leading-relaxed text-sm">
                  {problem.description}
                </p>
              </div>

              {/* Schema */}
              <div>
                <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Schema</h3>
                <div className="bg-[#0A0A0A] border border-[#262626]/50 rounded-xl p-4">
                  <pre className="text-xs font-mono text-[#71717A] overflow-x-auto whitespace-pre-wrap break-words">
                    {problem.schema}
                  </pre>
                </div>
              </div>

              {/* Sample Data */}
              <div>
                <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Sample Data</h3>
                <div className="bg-[#0A0A0A] border border-[#262626]/50 rounded-xl p-4">
                  <pre className="text-xs font-mono text-[#71717A] overflow-x-auto">
                    {problem.sampleData}
                  </pre>
                </div>
              </div>

              {/* Solution */}
              <div>
                <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Solution</h3>
                <div className="bg-[#0A0A0A] border border-[#262626]/50 rounded-xl p-4">
                  <pre className="text-xs font-mono text-[#C6FE1E] overflow-x-auto">
                    {problem.solution}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="flex-1 flex flex-col">
          
          {/* Editor Header */}
          <div className="h-12 px-4 flex items-center justify-between border-b border-[#262626]/50 bg-[#0A0A0A]">
            <span className="text-xs font-semibold text-[#71717A] uppercase tracking-wider">SQL Editor</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="px-3 py-1.5 text-xs font-semibold text-[#71717A] hover:text-white hover:bg-[#1A1A1A] rounded-lg transition-all flex items-center gap-1.5"
              >
                <RotateCcw size={14} />
                Reset
              </button>
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="px-4 py-1.5 bg-[#0A0A0A] border border-[#262626] text-white text-xs font-bold rounded-lg hover:bg-[#1A1A1A] transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                {isRunning ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Running
                  </>
                ) : (
                  <>
                    <Play size={14} />
                    Run
                  </>
                )}
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-1.5 bg-[#C6FE1E] text-black text-xs font-bold rounded-lg hover:bg-[#b5ed0d] transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Submitting
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </div>

          {/* Code Editor */}
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 w-full p-6 bg-[#050505] text-[#A1A1AA] font-mono text-sm resize-none focus:outline-none custom-scrollbar"
            placeholder="Write your SQL query here..."
            spellCheck={false}
          />

          {/* Output Panel */}
          <div className="border-t border-[#262626]/50">
            {/* Tabs */}
            <div className="flex items-center border-b border-[#262626]/50 bg-[#0A0A0A]">
              <button
                onClick={() => {
                  setActiveTab("testcase");
                  setShowTestCases(true);
                }}
                className={`px-4 py-2.5 text-xs font-semibold transition-all ${
                  activeTab === "testcase"
                    ? "text-white border-b-2 border-[#C6FE1E]"
                    : "text-[#71717A] hover:text-white"
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
                    ? "text-white border-b-2 border-[#C6FE1E]"
                    : "text-[#71717A] hover:text-white"
                }`}
              >
                Result
              </button>
              <button
                className="px-4 py-2.5 text-xs font-semibold text-[#71717A] hover:text-white transition-all"
              >
                Console {consoleOutput.length > 0 && `(${consoleOutput.length})`}
              </button>
              <button 
                onClick={() => setShowTestCases(!showTestCases)}
                className="ml-auto px-4 text-[#71717A] hover:text-white transition-colors"
              >
                {showTestCases ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              </button>
            </div>

            {/* Output Content */}
            {showTestCases && (
              <div className="h-64 overflow-y-auto p-4 bg-[#050505] custom-scrollbar">
                {activeTab === "testcase" ? (
                  !testResults ? (
                    <div className="flex items-center justify-center h-full text-[#71717A] text-sm">
                      <div className="text-center">
                        <CheckCircle2 size={32} className="mx-auto mb-2 opacity-50" />
                        <p>Submit your solution to run test cases</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`text-sm font-bold ${testResults.passed === testResults.total ? 'text-[#C6FE1E]' : 'text-[#FCD34D]'}`}>
                          {testResults.passed === testResults.total ? (
                            <div className="flex items-center gap-2">
                              <CheckCircle2 size={20} className="text-[#C6FE1E]" />
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
                                ? "bg-[#C6FE1E]/5 border-[#C6FE1E]/20"
                                : "bg-[#EF4444]/5 border-[#EF4444]/20"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {testCase.passed ? (
                                  <CheckCircle2 size={16} className="text-[#C6FE1E]" />
                                ) : (
                                  <XCircle size={16} className="text-[#EF4444]" />
                                )}
                                <span className="text-sm font-semibold text-white">
                                  {testCase.name}
                                </span>
                              </div>
                              <span className="text-xs text-[#71717A]">{testCase.time}</span>
                            </div>
                            {!testCase.passed && testCase.error && (
                              <div className="mt-2 text-xs text-[#EF4444] font-mono">
                                {testCase.error}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ) : (
                  !output ? (
                    <div className="flex items-center justify-center h-full text-[#71717A] text-sm">
                      <div className="text-center">
                        <Play size={32} className="mx-auto mb-2 opacity-50" />
                        <p>Run your query to see results</p>
                      </div>
                    </div>
                  ) : output.success && output.rows ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-[#71717A]">
                        <span>{output.rows.length} rows returned</span>
                        <span>Execution time: {output.executionTime}</span>
                      </div>
                      <div className="bg-[#0A0A0A] border border-[#262626]/50 rounded-lg overflow-hidden">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-[#262626]/50">
                              {output.rows.length > 0 && Object.keys(output.rows[0]).map((key) => (
                                <th key={key} className="px-4 py-2 text-left font-semibold text-[#71717A] bg-[#111]">
                                  {key}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {output.rows.map((row: any, i: number) => (
                              <tr key={i} className="border-b border-[#262626]/30 hover:bg-[#0A0A0A] transition-colors">
                                {Object.values(row).map((val: any, j: number) => (
                                  <td key={j} className="px-4 py-2 text-[#A1A1AA] font-mono">
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
                      <div className="flex items-center gap-2 text-[#EF4444]">
                        <XCircle size={16} />
                        <span className="text-sm font-semibold">Query Error</span>
                      </div>
                      <div className="bg-[#0A0A0A] border border-[#EF4444]/20 rounded-lg p-4">
                        <pre className="text-xs text-[#EF4444] font-mono whitespace-pre-wrap break-words">{output.error}</pre>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
