import React from 'react';
import {
  Award,
  Sparkles,
  BookOpen,
  Search,
  ExternalLink,
  Globe,
  Loader2,
  ChevronRight
} from 'lucide-react';

import CareerRoadmap from './CareerRoadmap';

const CareerCard = ({ career, isExpanded, toggleCareer }) => (
    <div
      className={`bg-white rounded-lg shadow-md p-6 transform transition-all duration-200 ${isExpanded ? 'scale-105 z-10' : 'hover:scale-102'}`}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-blue-600 cursor-pointer" onClick={toggleCareer}>
          {career.title || 'Career Option'}
          <ChevronRight className={`inline-block w-4 h-4 ml-1 transform transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
        </h3>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
          {career.match || career.matchScore || 0}% Match
        </span>
      </div>
      {isExpanded && (
        <>
          <p className="text-gray-600 mb-4">{career.description || 'No description available'}</p>
          <CareerRoadmap career={career} />
        </>
      )}
    </div>
);

const WebResultCard = ({ result }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-lg font-semibold text-gray-800">
        {result.title}
      </h3>
      <span className="text-sm text-blue-600 font-medium">
        {result.relevance}% Match
      </span>
    </div>
    <p className="text-gray-600 mb-3">{result.description}</p>
    {result.link && (
      <a
        href={result.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center text-sm text-blue-500 hover:text-blue-700"
      >
        Learn More
        <ExternalLink className="w-3 h-3 ml-1" />
      </a>
    )}
  </div>
);

const WebCareerCard = ({ career }) => (
  <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300">
    <div className="flex items-start justify-between">
      <h3 className="text-lg font-semibold text-gray-800">
        {career.title}
      </h3>
      <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
        {career.matchScore}% Match
      </span>
    </div>
    <p className="mt-3 text-gray-600">
      {career.description}
    </p>
    {career.keySkills && (
      <div className="mt-3">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          Key Skills:
        </h4>
        <div className="flex flex-wrap gap-2">
          {career.keySkills.map((skill, skillIndex) => (
            <span
              key={skillIndex}
              className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    )}
    {career.sourceLink && (
      <a
        href={career.sourceLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center mt-4 text-blue-500 hover:text-blue-700 transition-colors"
      >
        Learn More
        <ExternalLink className="w-4 h-4 ml-1" />
      </a>
    )}
  </div>
);

const CareerSection = ({ title, careers, icon: Icon }) => {
    const [expandedCareer, setExpandedCareer] = useState(null);
  
    const toggleCareer = (index) => {
        setExpandedCareer(expandedCareer === index ? null : index);
    };

    if (!careers || !Array.isArray(careers)) {
        return null;
    }

    return (
        <div className="mb-8 animate-fade-in">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Icon className="w-6 h-6 mr-2" />
            {title}
          </h2>
          <div className="space-y-6">
            {careers.map((career, index) => {
              const isExpanded = expandedCareer === index;
              return (
                <CareerCard
                  key={index}
                  career={career}
                  isExpanded={isExpanded}
                  toggleCareer={() => toggleCareer(index)}
                />
              );
            })}
          </div>
        </div>
      );
};


function RecommendationSection({
  careerResults,
  pdfCareerResults,
  webSearchResults,
  webCareerResults,
  handleWebSearch,
  handleWebCareerSearch,
  isSearching,
  isWebSearching
}) {
  return (
    <>
      <CareerSection
        title="AI-Generated Career Recommendations"
        careers={careerResults}
        icon={Sparkles}
      />

      {pdfCareerResults && (
        <CareerSection
          title="PDF-Based Career Matches"
          careers={pdfCareerResults}
          icon={BookOpen}
        />
      )}

      <div className="max-w-3xl mx-auto animate-slide-up">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Award className="w-8 h-8 text-yellow-400 animate-bounce" />
            <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Your Career Matches
            </h2>
          </div>
          <button
            onClick={handleWebSearch}
            disabled={isSearching}
            className="flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-gray-700 hover:text-blue-600"
          >
            {isSearching ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Globe className="w-4 h-4 mr-2" />
                Find More Careers
              </>
            )}
          </button>
        </div>
      </div>

      {webSearchResults && (
        <div className="max-w-3xl mx-auto mt-12 animate-slide-up">
          <div className="flex items-center space-x-3 mb-8">
            <Search className="w-7 h-7 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-800">
              Additional Career Suggestions
            </h2>
          </div>
          <div className="space-y-6">
            {webSearchResults.map((result, index) => (
              <WebResultCard key={index} result={result} />
            ))}
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto mt-8 text-center">
        <button
          onClick={handleWebCareerSearch}
          disabled={isWebSearching}
          className="group relative inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-102 disabled:opacity-50"
        >
          {isWebSearching ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Searching Web...
            </>
          ) : (
            <>
              <Globe className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              Discover More Careers Online
            </>
          )}
        </button>
      </div>

      {webCareerResults && (
        <div className="max-w-3xl mx-auto mt-12 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 animate-fade-in">
            <div className="flex items-center space-x-3 mb-6">
              <BookOpen className="w-6 h-6 text-blue-500" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Web Career Suggestions
              </h2>
            </div>
            <div className="space-y-6">
              {webCareerResults.map((career, index) => (
                <WebCareerCard key={index} career={career} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default RecommendationSection;