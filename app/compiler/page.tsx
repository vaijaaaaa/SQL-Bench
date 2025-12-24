"use client";

import { useState, useEffect } from "react";
import { Play, RotateCcw, CheckCircle2, XCircle, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";


if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = 'nav { display: none !important; }';
  document.head.appendChild(style);
}

export default function CompilerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState("-- Write your SQL query here\nSELECT * FROM customers;");
  const [output, setOutput] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTestCases, setShowTestCases] = useState(true);
  const [problemTitle, setProblemTitle] = useState("Customers Who Never Order");
  const [activeTab, setActiveTab] = useState<"testcase" | "result">("testcase");
  const [testResults, setTestResults] = useState<any>(null);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Mock problem navigation
  const problems = [
    "Customers Who Never Order",
    "Select All Columns",
    "Inner Join Basics",
    "Window Functions"
  ];
  const currentIndex = problems.findIndex(p => p === problemTitle);
  const hasNext = currentIndex < problems.length - 1;
  const hasPrev = currentIndex > 0;
  
  useEffect(() => {
    const title = searchParams.get('title');
    if (title) {
      setProblemTitle(decodeURIComponent(title));
    }
  }, [searchParams]);

  const handleRun = () => {
    setIsRunning(true);
    setActiveTab("result");
    setConsoleOutput([]);
    setConsoleOutput(prev => [...prev, "[INFO] Starting query execution..."]);
    setTimeout(() => {
      setConsoleOutput(prev => [...prev, "[SUCCESS] Query executed successfully"]);
      setConsoleOutput(prev => [...prev, `[INFO] ${3} rows returned in 45ms`]);
      setOutput({
        success: true,
        rows: [
          { id: 1, name: "John Doe", email: "john@example.com" },
          { id: 2, name: "Jane Smith", email: "jane@example.com" },
          { id: 3, name: "Bob Johnson", email: "bob@example.com" },
        ],
        executionTime: "45ms"
      });
      setIsRunning(false);
    }, 1000);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setActiveTab("testcase");
    setTimeout(() => {
      setTestResults({
        passed: 3,
        total: 4,
        cases: [
          { id: 1, name: "Basic Test", passed: true, time: "12ms" },
          { id: 2, name: "Empty Result", passed: true, time: "8ms" },
          { id: 3, name: "Multiple Records", passed: true, time: "15ms" },
          { id: 4, name: "Edge Case", passed: false, time: "10ms", error: "Expected 2 rows, got 3" },
        ]
      });
      setIsSubmitting(false);
    }, 1500);
  };

  const handleReset = () => {
    setCode("-- Write your SQL query here\nSELECT * FROM customers;");
    setOutput(null);
    setTestResults(null);
    setActiveTab("testcase");
  };

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
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase text-[#C6FE1E] bg-[#C6FE1E]/10 border-[#C6FE1E]/20">
                EASY
              </span>
              <span className="text-xs text-[#71717A]">Basic Select</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">{problemTitle}</h1>
          </div>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {/* Problem Description */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Description</h3>
                <p className="text-[#A1A1AA] leading-relaxed text-sm">
                  Write a SQL query to find all customers who have registered but never placed an order. 
                  Return the <code className="px-1.5 py-0.5 bg-[#1A1A1A] rounded text-[#C6FE1E] text-xs">name</code> field for all matching records.
                </p>
              </div>

              {/* Schema */}
              <div>
                <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Schema</h3>
                <div className="bg-[#0A0A0A] border border-[#262626]/50 rounded-xl p-4 space-y-4">
                  <div>
                    <div className="text-xs font-bold text-[#C6FE1E] mb-2">Customers</div>
                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex justify-between text-[#A1A1AA]">
                        <span>id</span>
                        <span className="text-[#71717A]">INT</span>
                      </div>
                      <div className="flex justify-between text-[#A1A1AA]">
                        <span>name</span>
                        <span className="text-[#71717A]">VARCHAR</span>
                      </div>
                      <div className="flex justify-between text-[#A1A1AA]">
                        <span>email</span>
                        <span className="text-[#71717A]">VARCHAR</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#C6FE1E] mb-2">Orders</div>
                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex justify-between text-[#A1A1AA]">
                        <span>id</span>
                        <span className="text-[#71717A]">INT</span>
                      </div>
                      <div className="flex justify-between text-[#A1A1AA]">
                        <span>customerId</span>
                        <span className="text-[#71717A]">INT</span>
                      </div>
                      <div className="flex justify-between text-[#A1A1AA]">
                        <span>amount</span>
                        <span className="text-[#71717A]">DECIMAL</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Example */}
              <div>
                <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Example</h3>
                <div className="bg-[#0A0A0A] border border-[#262626]/50 rounded-xl p-4">
                  <div className="text-xs text-[#71717A] mb-2">Input:</div>
                  <pre className="text-xs font-mono text-[#A1A1AA] mb-3">
{`Customers:
+----+----------+
| id | name     |
+----+----------+
| 1  | Henry    |
| 2  | Max      |
+----+----------+

Orders:
+----+------------+
| id | customerId |
+----+------------+
| 1  | 3          |
+----+------------+`}
                  </pre>
                  <div className="text-xs text-[#71717A] mb-2">Output:</div>
                  <pre className="text-xs font-mono text-[#A1A1AA]">
{`+----------+
| name     |
+----------+
| Henry    |
| Max      |
+----------+`}
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
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-[#71717A] uppercase tracking-wider">SQL Editor</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => hasPrev && setProblemTitle(problems[currentIndex - 1])}
                  disabled={!hasPrev}
                  className="p-1.5 text-[#71717A] hover:text-white hover:bg-[#1A1A1A] rounded transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Previous Problem"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => hasNext && setProblemTitle(problems[currentIndex + 1])}
                  disabled={!hasNext}
                  className="p-1.5 text-[#71717A] hover:text-white hover:bg-[#1A1A1A] rounded transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Next Problem"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="px-3 py-1.5 text-xs font-semibold text-[#71717A] hover:text-white hover:bg-[#1A1A1A] rounded-lg transition-all flex items-center gap-1.5"
                title="Toggle Fullscreen"
              >
                <Maximize2 size={14} />
              </button>
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
                  <>
                    Submit
                  </>
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
                                  Test Case {testCase.id}: {testCase.name}
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
                  ) : output.success ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-[#71717A]">
                        <span>{output.rows.length} rows returned</span>
                        <span>Execution time: {output.executionTime}</span>
                      </div>
                      <div className="bg-[#0A0A0A] border border-[#262626]/50 rounded-lg overflow-hidden">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-[#262626]/50">
                              {Object.keys(output.rows[0]).map((key) => (
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
                                    {val}
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
                        <pre className="text-xs text-[#EF4444] font-mono">{output.error}</pre>
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
