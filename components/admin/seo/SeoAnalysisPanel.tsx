import React from 'react';

interface SeoAnalysisPanelProps {
  score: number;
  passed: string[];
  failed: string[];
  warnings: string[];
  suggestions: string[];
}

export default function SeoAnalysisPanel({ passed, failed, warnings, suggestions }: SeoAnalysisPanelProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 font-medium text-gray-700">
        SEO Analysis Results
      </div>
      <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
        
        {/* Errors */}
        {failed.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-red-600 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span> Errors ({failed.length})
            </h4>
            <ul className="space-y-2">
              {failed.map((msg, i) => (
                <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                  <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {msg}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Warnings */}
         {warnings.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-yellow-600 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span> Warnings ({warnings.length})
            </h4>
            <ul className="space-y-2">
              {warnings.map((msg, i) => (
                <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                  <svg className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {msg}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Passed */}
        {passed.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-green-600 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span> Good Results ({passed.length})
            </h4>
            <ul className="space-y-2">
              {passed.map((msg, i) => (
                <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {msg}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actionable Suggestions */}
         {suggestions.length > 0 && (
          <div className="mt-6 border-t border-gray-100 pt-4">
            <h4 className="text-sm font-semibold text-blue-600 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Suggestions
            </h4>
            <ul className="list-disc list-inside space-y-1">
              {suggestions.map((msg, i) => (
                <li key={i} className="text-sm text-gray-600">{msg}</li>
              ))}
            </ul>
          </div>
        )}
        
        {passed.length === 0 && failed.length === 0 && warnings.length === 0 && (
            <div className="text-sm text-gray-500 text-center py-4">
                Enter a focus keyword and content to see analysis results.
            </div>
        )}

      </div>
    </div>
  );
}
