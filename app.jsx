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
  Technology: "#78b888",
  Finance: "#e0a860",
  Politics: "#b898d0",
  Health: "#c47e2a",
  Science: "#78b888",
  Business: "#e0a860",
};

function Sidebar({ topics, activeTopic, onTopicChange }) {
  return (
    <div style={{
      width: 200, background: "#2a1a0a", display: "flex", flexDirection: "column",
      borderRight: "0.5px solid #3d2810", height: "100vh", position: "fixed", left: 0, top: 0,
    }}>
      <div style={{ padding: "16px 14px 12px", borderBottom: "0.5px solid #3d2810" }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: "#f5e8d0", letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: 8, fontFamily: "Georgia, serif" }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#c47e2a" }} />
          NEWSFILE
        </div>
      </div>

      <div style={{ padding: "8px 0", flex: 1, overflowY: "auto" }}>
        <div style={{ padding: "12px 10px 6px", fontSize: 10, color: "#7a5030", letterSpacing: "0.06em", fontWeight: 500 }}>Topics</div>
        <button onClick={() => onTopicChange(null)} style={{
          display: "flex", alignItems: "center", gap: 8, padding: "7px 14px", fontSize: 12, color: activeTopic === null ? "#f0dfc0" : "#b89070",
          border: "none", background: activeTopic === null ? "#3d2410" : "transparent", cursor: "pointer",
          borderLeft: activeTopic === null ? "2px solid #c47e2a" : "2px solid transparent", width: "100%", textAlign: "left",
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", opacity: activeTopic === null ? 1 : 0.5 }} />
          All news
        </button>
        {topics.map(t => (
          <button key={t.topic} onClick={() => onTopicChange(t.topic)} style={{
            display: "flex", alignItems: "center", gap: 8, padding: "7px 14px", fontSize: 12, color: activeTopic === t.topic ? "#f0dfc0" : "#b89070",
            border: "none", background: activeTopic === t.topic ? "#3d2410" : "transparent", cursor: "pointer",
            borderLeft: activeTopic === t.topic ? "2px solid #c47e2a" : "2px solid transparent", width: "100%", textAlign: "left",
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", opacity: activeTopic === t.topic ? 1 : 0.5 }} />
            {t.topic}
            <span style={{ marginLeft: "auto", fontSize: 10, background: "#3a2010", color: "#9a7050", padding: "1px 6px", borderRadius: 10 }}>{t.count}</span>
          </button>
        ))}
        <div style={{ padding: "12px 10px 6px", fontSize: 10, color: "#7a5030", letterSpacing: "0.06em", fontWeight: 500 }}>Tools</div>
        <button style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 14px", fontSize: 12, color: "#b89070", border: "none", background: "transparent", cursor: "pointer", width: "100%", textAlign: "left" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", opacity: 0.5 }} />
          Stats
        </button>
      </div>

      <div style={{ padding: "12px 14px", borderTop: "0.5px solid #3d2810", fontSize: 11, color: "#7a5030", display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#6ab87a" }} />
        Live · just now
      </div>
    </div>
  );
}

function TopBar({ topics, articles, activeTopic, onSearch, onRefresh, refreshing }) {
  const [searchQ, setSearchQ] = useState("");
  const total = topics.reduce((s, t) => s + t.count, 0);
  const topicName = activeTopic ? topics.find(t => t.topic === activeTopic)?.topic : "All news";
  const count = activeTopic ? articles.filter(a => a.topic === activeTopic).length : articles.length;

  useEffect(() => {
    const t = setTimeout(() => onSearch(searchQ), 300);
    return () => clearTimeout(t);
  }, [searchQ]);

  return (
    <div style={{
      position: "fixed", top: 0, left: 200, right: 0, zIndex: 100,
      background: "#e8dcc0", borderBottom: "0.5px solid #c9b08a", display: "flex", flexDirection: "column",
    }}>
      <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: "#2a1a0a", fontFamily: "Georgia, serif" }}>{topicName}</span>
        <span style={{ fontSize: 11, color: "#9a7850" }}>{count} articles</span>
        <input
          value={searchQ} onChange={e => setSearchQ(e.target.value)}
          placeholder="Search articles..."
          style={{
            marginLeft: "auto", background: "#ddd0b0", border: "0.5px solid #c9b08a", borderRadius: 6,
            padding: "5px 10px", fontSize: 11, color: "#7a5a38", outline: "none", minWidth: 140,
          }}
        />
        <button onClick={onRefresh} disabled={refreshing} style={{
          background: "#2a1a0a", border: "0.5px solid #3d2810", borderRadius: 6, padding: "5px 10px",
          fontSize: 11, color: "#e8c890", cursor: refreshing ? "not-allowed" : "pointer", whiteSpace: "nowrap",
          opacity: refreshing ? 0.6 : 1,
        }}>
          {refreshing ? "Refreshing..." : "Refresh feeds"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 8, padding: "12px 14px", borderTop: "0.5px solid #c9b08a" }}>
        <div style={{ background: "#e0d0b0", borderRadius: 6, padding: "8px 10px", border: "0.5px solid #c9b08a" }}>
          <div style={{ fontSize: 16, fontWeight: 500, color: "#a05f18" }}>{total}</div>
          <div style={{ fontSize: 10, color: "#9a7850", marginTop: 1 }}>Total articles</div>
        </div>
        <div style={{ background: "#e0d0b0", borderRadius: 6, padding: "8px 10px", border: "0.5px solid #c9b08a" }}>
          <div style={{ fontSize: 16, fontWeight: 500, color: "#2a1a0a" }}>{Object.keys(new Set(articles.map(a => a.source))).length}</div>
          <div style={{ fontSize: 10, color: "#9a7850", marginTop: 1 }}>Sources</div>
        </div>
        <div style={{ background: "#e0d0b0", borderRadius: 6, padding: "8px 10px", border: "0.5px solid #c9b08a" }}>
          <div style={{ fontSize: 16, fontWeight: 500, color: "#3a7a48" }}>18</div>
          <div style={{ fontSize: 10, color: "#9a7850", marginTop: 1 }}>Today</div>
        </div>
        <div style={{ background: "#e0d0b0", borderRadius: 6, padding: "8px 10px", border: "0.5px solid #c9b08a" }}>
          <div style={{ fontSize: 16, fontWeight: 500, color: "#2a1a0a" }}>5m</div>
          <div style={{ fontSize: 10, color: "#9a7850", marginTop: 1 }}>Last refresh</div>
        </div>
      </div>
    </div>
  );
}

function ArticleCard({ article, onClick, featured }) {
  const tagColor = TOPIC_COLORS[article.topic] || "#c47e2a";
  const tagBg = article.topic === "Technology" ? "#1a2e20" : article.topic === "Finance" ? "#3d2410" : "#2a1830";
  const tagFg = article.topic === "Technology" ? "#78b888" : article.topic === "Finance" ? "#e0a860" : "#b898d0";

  return (
    <div onClick={() => onClick(article)} style={{
      background: "#ede0c4", borderRadius: 8, padding: "11px 13px", border: featured ? "2px solid #c47e2a" : "0.5px solid #c9b08a",
      borderLeft: featured ? "2px solid #c47e2a" : "0.5px solid #c9b08a",
      borderRadius: featured ? "0 8px 8px 0" : 8,
      display: "flex", flexDirection: "column", gap: 5, cursor: "pointer", transition: "background 0.1s",
    }}
      onMouseEnter={e => e.currentTarget.style.background = "#e8dcc4"}
      onMouseLeave={e => e.currentTarget.style.background = "#ede0c4"}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 4, fontWeight: 500, background: tagBg, color: tagFg }}>
          {article.topic}
        </span>
        <span style={{ fontSize: 10, color: "#9a7850" }}>{article.source}</span>
        <span style={{ fontSize: 10, color: "#b09870", marginLeft: "auto" }}>2h ago</span>
      </div>
      <div style={{ fontSize: 12, fontWeight: 500, color: "#1e1008", lineHeight: 1.4, fontFamily: "Georgia, serif" }}>
        {article.title}
      </div>
      <div style={{ fontSize: 11, color: "#7a5a38", lineHeight: 1.4 }}>
        {article.summary || article.title.substring(0, 80) + "..."}
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

  useEffect(() => {
    if (!article) return;
    // Reset stats display when article changes
    setShowStats(false);
    setStats(null);
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

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)",
      zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#f0e6d0", borderRadius: 12, width: "100%", maxWidth: 680,
        maxHeight: "85vh", overflow: "hidden", display: "flex", flexDirection: "column",
        boxShadow: "0 20px 60px rgba(0,0,0,0.15)", border: "0.5px solid #c9b08a",
      }}>
        <div style={{ padding: "24px 28px 16px", borderBottom: "0.5px solid #c9b08a" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: "#1e1008", lineHeight: 1.4, margin: 0 }}>
              {article.title}
            </h2>
            <button onClick={onClose} style={{
              border: "none", background: "#ddd0b0", borderRadius: 6,
              width: 28, height: 28, cursor: "pointer", fontSize: 16, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center", color: "#6a4a28",
            }}>×</button>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 10, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: "#9a7850" }}>{article.source}</span>
            <span style={{
              fontSize: 12, background: "#e0d0b0", color: "#a05f18",
              padding: "2px 10px", borderRadius: 10, fontWeight: 600,
            }}>{article.topic}</span>
            <a href={article.url} target="_blank" rel="noreferrer" style={{
              fontSize: 12, color: "#c47e2a", textDecoration: "none", fontWeight: 500,
            }}>Read original →</a>
            <button onClick={handleStatsClick} style={{
              marginLeft: "auto", fontSize: 12, padding: "4px 12px", borderRadius: 6,
              border: "0.5px solid #c9b08a", background: "#e8dcc0",
              color: "#a05f18", cursor: "pointer", fontWeight: 500,
            }}>
              {loadingStats ? "Loading..." : showStats ? "Hide Stats" : "View Stats"}
            </button>
          </div>
        </div>
        <div style={{ padding: "20px 28px", overflowY: "auto", flex: 1 }}>
          {showStats && stats ? (
            <div>
              <p style={{ fontSize: 14, color: "#7a5a38", marginTop: 0, marginBottom: 16 }}>
                {stats.summary}
              </p>
              
              {stats.chart_data && stats.chart_data.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 600, color: "#1e1008", marginBottom: 12 }}>Weekly Views</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={stats.chart_data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#c9b08a" />
                      <XAxis dataKey="name" stroke="#9a7850" style={{ fontSize: 12 }} />
                      <YAxis stroke="#9a7850" style={{ fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ background: "#ede0c4", border: "0.5px solid #c9b08a", borderRadius: 6 }}
                        labelStyle={{ color: "#1e1008" }}
                      />
                      <Bar dataKey="value" fill="#c47e2a" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {stats.stats && stats.stats.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 600, color: "#1e1008", marginBottom: 12 }}>Key Metrics</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {stats.stats.map((stat, i) => (
                      <div key={i} style={{
                        background: "#e0d0b0", borderRadius: 8, padding: 12,
                        border: "0.5px solid #c9b08a"
                      }}>
                        <div style={{ fontSize: 11, color: "#9a7850", marginBottom: 4 }}>{stat.label}</div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: "#c47e2a" }}>{stat.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {stats.key_facts && stats.key_facts.length > 0 && (
                <div>
                  <h3 style={{ fontSize: 13, fontWeight: 600, color: "#1e1008", marginBottom: 12 }}>Key Facts</h3>
                  <ul style={{ margin: 0, paddingLeft: 20, color: "#7a5a38", fontSize: 13, lineHeight: 1.6 }}>
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
                <p style={{ fontSize: 14, lineHeight: 1.8, color: "#7a5a38", margin: 0, whiteSpace: "pre-wrap" }}>
                  {full.full_text || full.summary || "No content available."}
                </p>
              ) : (
                <div style={{ color: "#9a7850", fontSize: 14 }}>Loading...</div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [topics, setTopics] = useState([]);
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTopic, setActiveTopic] = useState(null);
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

  const filtered = activeTopic ? articles.filter(a => a.topic === activeTopic) : articles;
  const searched = searchQ ? filtered.filter(a => a.title.toLowerCase().includes(searchQ.toLowerCase())) : filtered;

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: "#f0e6d0", minHeight: "100vh", display: "flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 6px; } 
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #c9b08a; border-radius: 3px; }
      `}</style>

      <Sidebar topics={topics} activeTopic={activeTopic} onTopicChange={setActiveTopic} />

      <div style={{ marginLeft: 200, display: "flex", flexDirection: "column", flex: 1 }}>
        <TopBar topics={topics} articles={articles} activeTopic={activeTopic} onSearch={setSearchQ} onRefresh={handleRefresh} refreshing={refreshing} />

        <div style={{
          marginTop: 180, paddingBottom: 40, paddingLeft: 14, paddingRight: 14, flex: 1, overflowY: "auto",
          display: "flex", flexDirection: "column", gap: 8,
        }}>
          {searched.slice(0, 50).map((a, i) => (
            <ArticleCard key={a.id} article={a} onClick={setSelectedArticle} featured={i === 0} />
          ))}
        </div>
      </div>

      <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
    </div>
  );
}
