'use client';

import React, { useState, useEffect } from 'react';

interface Analytics {
  totalNotes: number;
  sentimentDistribution: {
    positive: number;
    negative: number;
    neutral: number;
  };
  categoryDistribution: { [key: string]: number };
  averageSentimentScore: number;
  topKeywords: { keyword: string; count: number }[];
  recentActivity: {
    thisWeek: number;
    thisMonth: number;
  };
}

const AnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reanalyzing, setReanalyzing] = useState(false);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/notes/analytics', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const reanalyzeNotes = async () => {
    setReanalyzing(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/notes/reanalyze', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to reanalyze notes');
      }

      const result = await response.json();
      alert(`Successfully reanalyzed ${result.updated} notes!`);

      // Refresh analytics after reanalysis
      await fetchAnalytics();
    } catch (err) {
      alert('Error reanalyzing notes: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setReanalyzing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
  <div className="bg-card rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-muted rounded"></div>
            <div className="h-3 bg-muted rounded w-5/6"></div>
            <div className="h-3 bg-muted rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
  <div className="bg-card rounded-lg shadow-md p-6">
  <p className="text-danger">Error: {error}</p>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  const sentimentTotal = analytics.sentimentDistribution.positive +
    analytics.sentimentDistribution.negative +
    analytics.sentimentDistribution.neutral;

  return (
  <div className="bg-card rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
  <h2 className="text-xl font-bold text-foreground">📊 Notes Analytics</h2>
        <button
          onClick={reanalyzeNotes}
          disabled={reanalyzing || analytics?.totalNotes === 0}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${reanalyzing || analytics?.totalNotes === 0
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'bg-primary hover:bg-secondary text-primary-foreground'
            }`}
        >
          {reanalyzing ? '🔄 Analyzing...' : '🤖 Reanalyze All Notes'}
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-secondary rounded-lg p-4">
          <div className="text-2xl font-bold text-primary">{analytics.totalNotes}</div>
          <div className="text-sm text-secondary-foreground">Total Notes</div>
        </div>
        <div className="bg-success rounded-lg p-4">
          <div className="text-2xl font-bold text-background">{analytics.recentActivity.thisWeek}</div>
          <div className="text-sm text-muted-foreground">This Week</div>
        </div>
        <div className="bg-accent rounded-lg p-4">
          <div className="text-2xl font-bold text-background">{analytics.recentActivity.thisMonth}</div>
          <div className="text-sm text-muted-foreground">This Month</div>
        </div>
        <div className="bg-muted rounded-lg p-4">
          <div className="text-2xl font-bold text-primary">{analytics.averageSentimentScore.toFixed(2)}</div>
          <div className="text-sm text-muted-foreground">Avg Sentiment</div>
        </div>
      </div>

      {/* Sentiment Distribution - Always show, even if empty */}
      <div className="mb-6">
  <h3 className="text-lg font-semibold mb-3 text-foreground">😊 Sentiment Analysis</h3>
        {sentimentTotal > 0 ? (
          <div>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-20 text-sm text-muted-foreground flex items-center">
                  <span className="mr-1">😊</span> Positive
                </div>
                <div className="flex-1 bg-muted rounded-full h-3 mx-2">
                  <div
                    className="bg-success h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(analytics.sentimentDistribution.positive / sentimentTotal) * 100}%` }}
                  ></div>
                </div>
                <div className="w-16 text-sm text-muted-foreground text-right">
                  {analytics.sentimentDistribution.positive}
                  <span className="text-xs ml-1">({((analytics.sentimentDistribution.positive / sentimentTotal) * 100).toFixed(0)}%)</span>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-20 text-sm text-muted-foreground flex items-center">
                  <span className="mr-1">😐</span> Neutral
                </div>
                <div className="flex-1 bg-muted rounded-full h-3 mx-2">
                  <div
                    className="bg-neutral h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(analytics.sentimentDistribution.neutral / sentimentTotal) * 100}%` }}
                  ></div>
                </div>
                <div className="w-16 text-sm text-muted-foreground text-right">
                  {analytics.sentimentDistribution.neutral}
                  <span className="text-xs ml-1">({((analytics.sentimentDistribution.neutral / sentimentTotal) * 100).toFixed(0)}%)</span>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-20 text-sm text-muted-foreground flex items-center">
                  <span className="mr-1">😞</span> Negative
                </div>
                <div className="flex-1 bg-muted rounded-full h-3 mx-2">
                  <div
                    className="bg-danger h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(analytics.sentimentDistribution.negative / sentimentTotal) * 100}%` }}
                  ></div>
                </div>
                <div className="w-16 text-sm text-muted-foreground text-right">
                  {analytics.sentimentDistribution.negative}
                  <span className="text-xs ml-1">({((analytics.sentimentDistribution.negative / sentimentTotal) * 100).toFixed(0)}%)</span>
                </div>
              </div>
            </div>
            <div className="mt-3 p-3 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">
                <strong>Overall Mood:</strong> {analytics.averageSentimentScore.toFixed(2)}
                <span className="ml-2">
                  {analytics.averageSentimentScore > 0.2 ? '😊 Generally Positive' :
                    analytics.averageSentimentScore < -0.2 ? '😔 Generally Negative' :
                      '😐 Mostly Neutral'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-border rounded-lg">
            <div className="text-4xl mb-2">🤖</div>
            <p>No sentiment analysis available yet.</p>
            <p className="text-sm">Create some notes to see your mood patterns!</p>
          </div>
        )}
      </div>

      {/* Category Distribution */}
      {Object.keys(analytics.categoryDistribution).length > 0 && (
        <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3 text-foreground">📁 Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {Object.entries(analytics.categoryDistribution)
              .sort(([, a], [, b]) => b - a)
              .map(([category, count]) => (
                <div key={category} className="bg-muted rounded-lg p-3 text-center">
                  <div className="text-lg font-semibold text-foreground">{count}</div>
                  <div className="text-xs text-muted-foreground capitalize">{category}</div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Top Keywords */}
      {analytics.topKeywords.length > 0 && (
        <div>
      <h3 className="text-lg font-semibold mb-3 text-foreground">🔥 Top Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {analytics.topKeywords.map(({ keyword, count }) => (
              <span
                key={keyword}
                className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
              >
                #{keyword} ({count})
              </span>
            ))}
          </div>
        </div>
      )}

      {analytics.totalNotes === 0 && (
  <div className="text-center py-8 text-muted-foreground">
          <p>No notes yet! Create your first note to see analytics.</p>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
