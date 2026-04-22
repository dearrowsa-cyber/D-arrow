import React from 'react';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import SeoScoreGauge from './SeoScoreGauge';

interface AnalysisResult {
  score: number;
  checks: {
    id: string;
    label: string;
    passed: boolean;
    points: number;
    maxPoints: number;
  }[];
  suggestions: string[];
}

interface Props {
  result: AnalysisResult | null;
  loading?: boolean;
}

export default function SeoAnalysisPanel({ result, loading }: Props) {
  if (loading) {
    return (
      <div className="admin-card" style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
        <div style={{ width: 40, height: 40, border: '3px solid rgba(255,77,109,0.2)', borderTopColor: '#FF4D6D', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="admin-card" style={{ padding: '24px', textAlign: 'center', color: '#9CA3AF' }}>
        Enter content and focus keyword to see analysis.
      </div>
    );
  }

  return (
    <div className="admin-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
        <SeoScoreGauge score={result.score} size={120} />
        <h3 style={{ marginTop: '16px', marginBottom: '0' }}>SEO Score</h3>
      </div>

      {result.suggestions.length > 0 && (
        <div style={{ marginBottom: '24px', background: 'rgba(239, 68, 68, 0.1)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EF4444', marginBottom: '12px' }}>
            <AlertCircle size={18} /> Improvements Needed
          </h4>
          <ul style={{ margin: 0, paddingLeft: '24px', color: '#E6E6EA', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {result.suggestions.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      )}

      <div>
        <h4 style={{ marginBottom: '16px' }}>Detailed Checks</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {result.checks.map(check => (
            <div key={check.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'rgba(11, 13, 31, 0.4)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {check.passed ? (
                  <CheckCircle2 size={18} color="#22C55E" />
                ) : (
                  <XCircle size={18} color="#EF4444" />
                )}
                <span style={{ fontSize: '14px', color: check.passed ? '#E6E6EA' : '#9CA3AF' }}>{check.label}</span>
              </div>
              <span style={{ fontSize: '12px', color: '#6B7280' }}>{check.points}/{check.maxPoints} pts</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
