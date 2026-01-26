import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from "@/components/PageHeader";
import {
  Sparkles,
  Send,
  BarChart3,
  Users,
  TrendingUp,
  TrendingDown,
  Calendar,
  Trophy,
  ClipboardList,
  GraduationCap,
  Clock,
  Loader2,
  History,
  X,
  Lightbulb,
} from "lucide-react";

const SUGGESTED_QUERIES = [
  {
    id: 1,
    icon: GraduationCap,
    label: "Grade Results",
    query: "Overall student results of Grade 10",
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  {
    id: 2,
    icon: BarChart3,
    label: "Subject Performance",
    query: "How are students performing in Math in Grade 8?",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    id: 3,
    icon: TrendingDown,
    label: "Weakest Subject",
    query: "Which subject do students score lowest in Grade 9?",
    color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  },
  {
    id: 4,
    icon: Trophy,
    label: "Top Students",
    query: "Top 10 students in Grade 8",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  {
    id: 5,
    icon: TrendingUp,
    label: "Bottom Students",
    query: "Bottom 5 students in Grade 9",
    color: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  },
  {
    id: 6,
    icon: Users,
    label: "Compare Students",
    query: "Compare Manish and Riya's performance",
    color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  },
  {
    id: 7,
    icon: ClipboardList,
    label: "Science Trend",
    query: "Science performance of Grade 9 students",
    color: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-400",
  },
  {
    id: 8,
    icon: Calendar,
    label: "Term Comparison",
    query: "Compare Manish's Term 1 and Term 2 results",
    color: "bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400",
  },
];

const SAMPLE_RESPONSES = {
  "Show top performing students this month": {
    type: "table",
    title: "Top 5 Performing Students - January 2026",
    data: [
      { rank: 1, name: "Priya Sharma", class: "10-A", score: "98.5%", trend: "up" },
      { rank: 2, name: "Rahul Thapa", class: "10-B", score: "96.2%", trend: "up" },
      { rank: 3, name: "Anita Gurung", class: "9-A", score: "95.8%", trend: "same" },
      { rank: 4, name: "Suman Karki", class: "10-A", score: "94.1%", trend: "up" },
      { rank: 5, name: "Maya Rai", class: "9-B", score: "93.7%", trend: "down" },
    ],
  },
  "Attendance summary for Class 10": {
    type: "stats",
    title: "Class 10 Attendance Summary",
    stats: [
      { label: "Average Attendance", value: "92.5%", icon: Users },
      { label: "Present Today", value: "78/85", icon: GraduationCap },
      { label: "On Leave", value: "5", icon: Calendar },
      { label: "Absent", value: "2", icon: TrendingDown },
    ],
  },
  default: {
    type: "text",
    title: "AI Response",
    content: "Based on the available data, here's what I found for your query. The analysis shows positive trends overall with some areas requiring attention. Would you like me to provide more specific details?",
  },
};

export default function AiInterface() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [recentQueries, setRecentQueries] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("ai-recent-queries");
    if (saved) {
      setRecentQueries(JSON.parse(saved));
    }
  }, []);

  const saveToRecent = (q) => {
    const updated = [q, ...recentQueries.filter((r) => r !== q)].slice(0, 5);
    setRecentQueries(updated);
    localStorage.setItem("ai-recent-queries", JSON.stringify(updated));
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    saveToRecent(query);

    // Simulate API call
    setTimeout(() => {
      const matchedResponse = SAMPLE_RESPONSES[query] || SAMPLE_RESPONSES.default;
      setResponse({ ...matchedResponse, query });
      setLoading(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.query);
    setResponse(null);
  };

  const handleRecentClick = (q) => {
    setQuery(q);
    setResponse(null);
  };

  const clearRecent = () => {
    setRecentQueries([]);
    localStorage.removeItem("ai-recent-queries");
  };

  const renderResponse = () => {
    if (!response) return null;

    if (response.type === "table") {
      return (
        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-emerald-500" />
              {response.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Rank</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Class</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Score</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {response.data.map((row, idx) => (
                    <tr key={idx} className="border-b dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${idx === 0 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                          idx === 1 ? "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300" :
                            idx === 2 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                              "bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                          }`}>
                          {row.rank}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium">{row.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{row.class}</td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">{row.score}</span>
                      </td>
                      <td className="py-3 px-4">
                        {row.trend === "up" && <TrendingUp className="h-4 w-4 text-emerald-500" />}
                        {row.trend === "down" && <TrendingDown className="h-4 w-4 text-rose-500" />}
                        {row.trend === "same" && <span className="text-gray-400">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (response.type === "stats") {
      return (
        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              {response.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {response.stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700">
                    <Icon className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-500" />
            {response.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{response.content}</p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="AI Interface"
        description="Query insights about student performance, attendance, grades, and more."
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Query Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Query Form */}
          <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                placeholder="Ask me anything... e.g., 'Show top performing students this month'"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="min-h-[100px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground invisible">
                  <Lightbulb className="h-3.5 w-3.5" />
                  <span>Press Enter to submit, Shift+Enter for new line</span>
                </div>
                <Button
                  type="submit"
                  disabled={!query.trim() || loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Ask AI
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {loading && (
            <div className="bg-white dark:bg-gray-800 p-8 border border-gray-200 dark:border-gray-700 rounded-sm">
              <div className="flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
                <p className="text-muted-foreground">Analyzing your query...</p>
              </div>
            </div>
          )}

          {!loading && response && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground px-1">
                <Clock className="h-4 w-4" />
                <span>Response for: &ldquo;{response.query}&rdquo;</span>
              </div>
              {renderResponse()}
            </div>
          )}

          {!loading && !response && (
            <div className="bg-white dark:bg-gray-800 p-8 border border-gray-200 dark:border-gray-700 rounded-sm border-dashed">
              <div className="flex flex-col items-center justify-center text-center space-y-3">
                <Sparkles className="h-10 w-10 text-gray-400" />
                <div className="space-y-1">
                  <h3 className="text-base font-medium">Ready to assist</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Type your question above or click one of the suggested queries to get started.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-sm">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                Suggested Queries
              </h3>
            </div>
            <div className="p-2 space-y-1">
              {SUGGESTED_QUERIES.map((suggestion) => {
                const Icon = suggestion.icon;
                return (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left p-3 rounded-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-md ${suggestion.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {suggestion.label}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {suggestion.query}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recent Queries */}
          {recentQueries.length > 0 && (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-sm">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <History className="h-4 w-4 text-gray-500" />
                  Recent Queries
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearRecent}
                  className="h-7 text-xs text-muted-foreground hover:text-destructive"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              </div>
              <div className="p-2 space-y-1">
                {recentQueries.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleRecentClick(q)}
                    className="w-full text-left p-2.5 rounded-sm text-sm text-muted-foreground hover:text-foreground hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors truncate"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
