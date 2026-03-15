'use client';

import { useState, useEffect, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const API = "/api";

const api = {
  getTopics: () => fetch(`${API}/topics`).then(r => r.json()),
  getArticles: (topic) => fetch(`${API}/articles${topic ? `?topic=${topic}` : ""}`).then(r => r.json()),
  getArticle: (id) => fetch(`${API}/articles/${id}`).then(r => r.json()),
  getStats: () => fetch(`${API}/stats`).then(r => r.json()),
  search: (q) => fetch(`${API}/search?q=${encodeURIComponent(q)}`).then(r => r.json()),
  runNow: () => fetch(`${API}/scheduler/run-now`, { method: "POST" }).then(r => r.json()),
  getArticleStats: (id) => fetch(`${API}/articles/${id}/stats`, { method: "POST" }).then(r => r.json()),
};

const TOPIC_COLORS = {
  Technology: "#3B82F6",
  Economics: "#10B981",
  Politics: "#F59E0B",
  Health: "#EF4444",
  Climate: "#06B6D4",
  Other: "#8B5CF6",
};

function TopBar({ onSearch, onRefresh, refreshing, view, setView }) {
  const [q, setQ] = useState("");
  useEffect(() => {
    const t = setTimeout(() => onSearch(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(18, 18, 24, 0.95)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
      display: "flex", alignItems: "center", gap: 16,
      padding: "0 32px", height: 56,
    }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginRight: 24 }}>
        <span style={{ fontFamily: "'Georgia', serif", fontSize: 20, fontWeight: 700, letterSpacing: "-0.5px", color: "#f5f5f7" }}>NEWS</span>
        <span style={{ fontFamily: "'Georgia', serif", fontSize: 20, fontWeight: 400, color: "#a1a1a6" }}>FILE</span>
      </div>

      <nav style={{ display: "flex", gap: 4 }}>
        {["dashboard", "feed", "search"].map(v => (
          <button key={v} onClick={() => setView(v)} style={{
            padding: "5px 14px", borderRadius: 6, border: "none", cursor: "pointer",
            fontSize: 13, fontWeight: 500, textTransform: "capitalize",
            background: view === v ? "rgba(255,255,255,0.12)" : "transparent",
            color: view === v ? "#f5f5f7" : "#a1a1a6",
            transition: "all 0.15s",
          }}>{v}</button>
        ))}
      </nav>

      <div style={{ flex: 1 }} />

      {view === "search" && (
        <input
          value={q} onChange={e => setQ(e.target.value)}
          placeholder="Search articles..."
          style={{
            width: 280, padding: "7px 14px", borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.1)", fontSize: 13, outline: "none",
            background: "rgba(255,255,255,0.05)", color: "#f5f5f7",
          }}
        />
      )}

      <button onClick={onRefresh} disabled={refreshing} style={{
        padding: "7px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(255,255,255,0.05)", color: "#a1a1a6", fontSize: 13, fontWeight: 500,
        cursor: refreshing ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 6,
        opacity: refreshing ? 0.6 : 1, transition: "all 0.15s",
      }}>
        <span style={{ display: "inline-block", animation: refreshing ? "spin 1s linear infinite" : "none" }}>↻</span>
        {refreshing ? "Refreshing..." : "Refresh"}
      </button>
    </header>
  );
}

function StatCard({ label, value, sub, color }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "20px 24px",
      border: "1px solid rgba(255,255,255,0.08)", flex: 1, minWidth: 140,
    }}>
      <div style={{ fontSize: 28, fontWeight: 700, color: color || "#8080ff", fontFamily: "'Georgia', serif" }}>{value}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#f5f5f7", marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: "#a1a1a6", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function TopicBar({ topic, count, total, onClick }) {
  const pct = total ? Math.round((count / total) * 100) : 0;
  const color = TOPIC_COLORS[topic] || "#8080ff";
  return (
    <div onClick={onClick} style={{ cursor: "pointer", marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#f5f5f7" }}>{topic}</span>
        <span style={{ fontSize: 12, color: "#a1a1a6" }}>{count} articles</span>
      </div>
      <div style={{ height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 4, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`, background: color,
          borderRadius: 4, transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
        }} />
      </div>
    </div>
  );
}

function ArticleRow({ article, onClick }) {
  const color = TOPIC_COLORS[article.topic] || "#8080ff";
  return (
    <div onClick={() => onClick(article)} style={{
      padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", cursor: "pointer",
      display: "flex", gap: 14, alignItems: "flex-start",
      transition: "background 0.1s",
    }}
      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >
      <div style={{
        width: 4, height: 44, borderRadius: 2, background: color,
        flexShrink: 0, marginTop: 2,
      }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#f5f5f7", lineHeight: 1.4, marginBottom: 4 }}>
          {article.title}
        </div>
        <div style={{ fontSize: 12, color: "#a1a1a6", display: "flex", gap: 10 }}>
          <span>{article.source}</span>
          <span>·</span>
          <span style={{
            background: `${color}22`, color: color,
            padding: "1px 8px", borderRadius: 10, fontWeight: 500,
          }}>{article.topic}</span>
          {article.word_count && <><span>·</span><span>{article.word_count} words</span></>}
        </div>
      </div>
    </div>
  );
}

function ArticleModal({ article, onClose }) {
  const [full, setFull] = useState(null);
  const [stats, setStats] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    if (!article) return;
    api.getArticle(article.id).then(setFull);
    return () => setFull(null);
  }, [article?.id]);

  const handleStatsClick = () => {
    if (showStats) {
      setShowStats(false);
    } else {
      setLoadingStats(true);
      api.getArticleStats(article.id).then(data => {
        setStats(data);
        setShowStats(true);
        setLoadingStats(false);
      });
    }
  };

  if (!article) return null;
  const color = TOPIC_COLORS[article.topic] || "#8080ff";

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
      zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "rgba(18,18,24,0.95)", borderRadius: 16, width: "100%", maxWidth: 680,
        maxHeight: "85vh", overflow: "hidden", display: "flex", flexDirection: "column",
        boxShadow: "0 20px 60px rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)",
      }}>
        <div style={{ padding: "24px 28px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
            <h2 style={{ fontFamily: "'Georgia', serif", fontSize: 20, fontWeight: 700, color: "#f5f5f7", lineHeight: 1.4, margin: 0 }}>
              {article.title}
            </h2>
            <button onClick={onClose} style={{
              border: "none", background: "rgba(255,255,255,0.1)", borderRadius: 6,
              width: 28, height: 28, cursor: "pointer", fontSize: 16, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center", color: "#a1a1a6",
            }}>×</button>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 10, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: "#a1a1a6" }}>{article.source}</span>
            <span style={{
              fontSize: 12, background: `${color}22`, color: color,
              padding: "2px 10px", borderRadius: 10, fontWeight: 600,
            }}>{article.topic}</span>
            <a href={article.url} target="_blank" rel="noreferrer" style={{
              fontSize: 12, color: "#8080ff", textDecoration: "none",
            }}>Read original →</a>
            <button onClick={handleStatsClick} style={{
              marginLeft: "auto", fontSize: 12, padding: "4px 12px", borderRadius: 6,
              border: "1px solid rgba(255,255,255,0.2)", background: "rgba(128,128,255,0.15)",
              color: "#8080ff", cursor: "pointer", fontWeight: 500,
            }}>
              {loadingStats ? "Loading..." : showStats ? "Hide Stats" : "View Stats"}
            </button>
          </div>
        </div>
        <div style={{ padding: "20px 28px", overflowY: "auto", flex: 1 }}>
          {showStats && stats ? (
            <div>
              <p style={{ fontSize: 14, color: "#d0d0d6", marginTop: 0, marginBottom: 16 }}>
                {stats.summary}
              </p>
              
              {stats.chart_data && stats.chart_data.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 600, color: "#f5f5f7", marginBottom: 12 }}>Weekly Views</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={stats.chart_data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="name" stroke="#a1a1a6" style={{ fontSize: 12 }} />
                      <YAxis stroke="#a1a1a6" style={{ fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6 }}
                        labelStyle={{ color: "#f5f5f7" }}
                      />
                      <Bar dataKey="value" fill="#8080ff" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {stats.stats && stats.stats.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 600, color: "#f5f5f7", marginBottom: 12 }}>Key Metrics</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {stats.stats.map((stat, i) => (
                      <div key={i} style={{
                        background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: 12,
                        border: "1px solid rgba(255,255,255,0.08)"
                      }}>
                        <div style={{ fontSize: 11, color: "#a1a1a6", marginBottom: 4 }}>{stat.label}</div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: "#8080ff" }}>{stat.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {stats.key_facts && stats.key_facts.length > 0 && (
                <div>
                  <h3 style={{ fontSize: 13, fontWeight: 600, color: "#f5f5f7", marginBottom: 12 }}>Key Facts</h3>
                  <ul style={{ margin: 0, paddingLeft: 20, color: "#d0d0d6", fontSize: 13, lineHeight: 1.6 }}>
                    {stats.key_facts.map((fact, i) => (
                      <li key={i} style={{ marginBottom: 8 }}>{fact}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <>
              {full ? (
                <p style={{ fontSize: 14, lineHeight: 1.8, color: "#d0d0d6", margin: 0, whiteSpace: "pre-wrap" }}>
                  {full.full_text || full.summary || "No content available."}
                </p>
              ) : (
                <div style={{ color: "#a1a1a6", fontSize: 14 }}>Loading...</div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Dashboard({ topics, articles, onTopicClick }) {
  const total = topics.reduce((s, t) => s + t.count, 0);
  const sources = {};
  articles.forEach(a => { sources[a.source] = (sources[a.source] || 0) + 1; });
  const topSources = Object.entries(sources).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Georgia', serif", fontSize: 28, fontWeight: 700, color: "#f5f5f7", margin: "0 0 4px" }}>
          Good morning.
        </h1>
        <p style={{ fontSize: 14, color: "#a1a1a6", margin: 0 }}>
          {total} articles tracked across {topics.length} topics
        </p>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap" }}>
        <StatCard label="Total Articles" value={total} color="#8080ff" />
        <StatCard label="Topics" value={topics.length} color="#6B9EFF" />
        <StatCard label="Top Topic" value={topics[0]?.topic || "—"} sub={`${topics[0]?.count || 0} articles`} color={TOPIC_COLORS[topics[0]?.topic]} />
        <StatCard label="Sources" value={Object.keys(sources).length} color="#5FD29E" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "20px 24px", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "#f5f5f7", margin: "0 0 16px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Articles by Topic
          </h3>
          {topics.map(t => (
            <TopicBar key={t.topic} topic={t.topic} count={t.count} total={total} onClick={() => onTopicClick(t.topic)} />
          ))}
        </div>

        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "20px 24px", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "#f5f5f7", margin: "0 0 16px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Top Sources
          </h3>
          {topSources.map(([source, count]) => (
            <div key={source} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ fontSize: 14, color: "#f5f5f7", fontWeight: 500 }}>{source}</span>
              <span style={{ fontSize: 13, color: "#a1a1a6", background: "rgba(255,255,255,0.08)", padding: "2px 10px", borderRadius: 10 }}>{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Feed({ topics, articles, onArticleClick }) {
  const [activeTopic, setActiveTopic] = useState(null);
  const filtered = activeTopic ? articles.filter(a => a.topic === activeTopic) : articles;

  return (
    <div style={{ display: "flex", gap: 24 }}>
      <div style={{ width: 200, flexShrink: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#a1a1a6", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Topics</div>
        <button onClick={() => setActiveTopic(null)} style={{
          display: "block", width: "100%", textAlign: "left", padding: "7px 10px",
          borderRadius: 7, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500,
          background: !activeTopic ? "rgba(255,255,255,0.12)" : "transparent", color: !activeTopic ? "#f5f5f7" : "#a1a1a6",
          marginBottom: 2,
        }}>All Articles</button>
        {topics.map(t => (
          <button key={t.topic} onClick={() => setActiveTopic(t.topic)} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            width: "100%", textAlign: "left", padding: "7px 10px",
            borderRadius: 7, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500,
            background: activeTopic === t.topic ? "rgba(255,255,255,0.12)" : "transparent",
            color: activeTopic === t.topic ? "#f5f5f7" : "#a1a1a6",
            marginBottom: 2,
          }}>
            <span>{t.topic}</span>
            <span style={{ fontSize: 11, opacity: 0.6 }}>{t.count}</span>
          </button>
        ))}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, color: "#a1a1a6", marginBottom: 12 }}>
          {filtered.length} articles {activeTopic ? `in ${activeTopic}` : ""}
        </div>
        {filtered.slice(0, 50).map(a => (
          <ArticleRow key={a.id} article={a} onClick={onArticleClick} />
        ))}
      </div>
    </div>
  );
}

function SearchView({ onArticleClick }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q.trim()) { setResults([]); return; }
    const t = setTimeout(() => {
      setLoading(true);
      api.search(q).then(r => { setResults(r); setLoading(false); });
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <input
        value={q} onChange={e => setQ(e.target.value)}
        placeholder="Search articles by title..."
        autoFocus
        style={{
          width: "100%", padding: "12px 18px", borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.1)", fontSize: 15, outline: "none",
          background: "rgba(255,255,255,0.05)", color: "#f5f5f7", marginBottom: 20,
          boxSizing: "border-box",
        }}
      />
      {loading && <div style={{ color: "#a1a1a6", fontSize: 14 }}>Searching...</div>}
      {!loading && q && results.length === 0 && <div style={{ color: "#a1a1a6", fontSize: 14 }}>No results for "{q}"</div>}
      {results.map(a => <ArticleRow key={a.id} article={a} onClick={onArticleClick} />)}
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("dashboard");
  const [topics, setTopics] = useState([]);
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQ, setSearchQ] = useState("");

  const loadData = useCallback(() => {
    api.getTopics().then(t => {
      if (Array.isArray(t)) {
        setTopics(t.sort((a, b) => b.count - a.count));
      }
    });
    api.getArticles().then(articles => {
      if (Array.isArray(articles)) {
        setArticles(articles);
      }
    });
  }, []);

  useEffect(() => { loadData(); }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try { await api.runNow(); } catch (e) {}
    setTimeout(() => { loadData(); setRefreshing(false); }, 3000);
  };

  const handleTopicClick = (topic) => {
    setView("feed");
  };

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: "#121218", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 6px; } 
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
      `}</style>

      <TopBar
        onSearch={setSearchQ}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        view={view}
        setView={setView}
      />

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "80px 24px 40px" }}>
        {view === "dashboard" && (
          <Dashboard topics={topics} articles={articles} onTopicClick={handleTopicClick} />
        )}
        {view === "feed" && (
          <Feed topics={topics} articles={articles} onArticleClick={setSelectedArticle} />
        )}
        {view === "search" && (
          <SearchView onArticleClick={setSelectedArticle} />
        )}
      </main>

      <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
    </div>
  );
}
