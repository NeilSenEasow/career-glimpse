import React from 'react';
import { Compass, Zap } from 'lucide-react';

function AnalysisLoading() {
  return (
    <div className="text-center py-20 animate-fade-in">
      <div className="relative w-20 h-20 mx-auto mb-4">
        <Compass className="w-20 h-20 text-blue-500 animate-spin-slow" />
        <Zap className="w-8 h-8 text-yellow-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      </div>
      <p className="mt-4 text-xl text-gray-700">Analyzing your responses...</p>
    </div>
  );
}

export default AnalysisLoading;