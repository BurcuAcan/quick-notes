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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <p className="text-red-600 dark:text-red-400">Error: {error}</p>
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">📊 Notes Analytics</h2>
        <button
          onClick={reanalyzeNotes}
          disabled={reanalyzing || analytics?.totalNotes === 0}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            reanalyzing || analytics?.totalNotes === 0
              ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {reanalyzing ? '🔄 Analyzing...' : '🤖 Reanalyze All Notes'}
        </button>
      </div>
      
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{analytics.totalNotes}</div>
          <div className="text-sm text-blue-800 dark:text-blue-300">Total Notes</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{analytics.recentActivity.thisWeek}</div>
          <div className="text-sm text-green-800 dark:text-green-300">This Week</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{analytics.recentActivity.thisMonth}</div>
          <div className="text-sm text-purple-800 dark:text-purple-300">This Month</div>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{analytics.averageSentimentScore.toFixed(2)}</div>
          <div className="text-sm text-orange-800 dark:text-orange-300">Avg Sentiment</div>
        </div>
      </div>

      {/* Sentiment Distribution - Always show, even if empty */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">😊 Sentiment Analysis</h3>
        {sentimentTotal > 0 ? (
          <div>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-20 text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <span className="mr-1">😊</span> Positive
                </div>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3 mx-2">
                  <div 
                    className="bg-green-500 h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${(analytics.sentimentDistribution.positive / sentimentTotal) * 100}%` }}
                  ></div>
                </div>
                <div className="w-16 text-sm text-gray-600 dark:text-gray-400 text-right">
                  {analytics.sentimentDistribution.positive} 
                  <span className="text-xs ml-1">({((analytics.sentimentDistribution.positive / sentimentTotal) * 100).toFixed(0)}%)</span>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-20 text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <span className="mr-1">😐</span> Neutral
                </div>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3 mx-2">
                  <div 
                    className="bg-gray-500 h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${(analytics.sentimentDistribution.neutral / sentimentTotal) * 100}%` }}
                  ></div>
                </div>
                <div className="w-16 text-sm text-gray-600 dark:text-gray-400 text-right">
                  {analytics.sentimentDistribution.neutral} 
                  <span className="text-xs ml-1">({((analytics.sentimentDistribution.neutral / sentimentTotal) * 100).toFixed(0)}%)</span>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-20 text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <span className="mr-1">😞</span> Negative
                </div>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3 mx-2">
                  <div 
                    className="bg-red-500 h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${(analytics.sentimentDistribution.negative / sentimentTotal) * 100}%` }}
                  ></div>
                </div>
                <div className="w-16 text-sm text-gray-600 dark:text-gray-400 text-right">
                  {analytics.sentimentDistribution.negative} 
                  <span className="text-xs ml-1">({((analytics.sentimentDistribution.negative / sentimentTotal) * 100).toFixed(0)}%)</span>
                </div>
              </div>
            </div>
            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">
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
          <div className="text-center py-8 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            <div className="text-4xl mb-2">🤖</div>
            <p>No sentiment analysis available yet.</p>
            <p className="text-sm">Create some notes to see your mood patterns!</p>
          </div>
        )}
      </div>

      {/* Category Distribution */}
      {Object.keys(analytics.categoryDistribution).length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">📁 Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {Object.entries(analytics.categoryDistribution)
              .sort(([, a], [, b]) => b - a)
              .map(([category, count]) => (
                <div key={category} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">{count}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 capitalize">{category}</div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Top Keywords */}
      {analytics.topKeywords.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">🔥 Top Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {analytics.topKeywords.map(({ keyword, count }) => (
              <span 
                key={keyword}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
              >
                #{keyword} ({count})
              </span>
            ))}
          </div>
        </div>
      )}

      {analytics.totalNotes === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No notes yet! Create your first note to see analytics.</p>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
