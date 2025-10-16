import { useState } from "react";
import { ShootingStars } from "./[ui]/shooting-stars";
import { StarsBackground } from "./[ui]/stars-background";
import { useNavigate } from "react-router";
import { ArrowLeft, Trophy, TrendingUp, Target, Zap, Award, BarChart3 } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  trend?: number;
}

const MetricCard = ({ title, value, subtitle, icon, color, trend }: MetricCardProps) => {
  return (
    <div className="group relative bg-gray-900/40 rounded-2xl overflow-hidden border border-gray-700/50 hover:border-gray-600 transition-all duration-300 p-6 backdrop-blur-sm">
      {/* Gradient overlay */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br ${color}`} />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${color} bg-opacity-10`}>
            {icon}
          </div>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 text-xs font-semibold ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              <TrendingUp size={14} className={trend < 0 ? 'rotate-180' : ''} />
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        
        <h3 className="text-gray-400 text-sm font-medium mb-2">{title}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl sm:text-4xl font-bold text-white">{value}</span>
          {subtitle && <span className="text-gray-500 text-sm">{subtitle}</span>}
        </div>
      </div>
    </div>
  );
};

interface ProgressBarProps {
  label: string;
  value: number;
  color: string;
}

const ProgressBar = ({ label, value, color }: ProgressBarProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-300">{label}</span>
        <span className="text-sm font-bold text-white">{value.toFixed(1)}%</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

const ScoreComponent = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'detailed'>('overview');

  // Mock data - replace with actual data from your model
  const overviewMetrics = [
    {
      title: "Overall Accuracy",
      value: "94.2",
      subtitle: "%",
      icon: <Trophy className="w-6 h-6 text-yellow-400" />,
      color: "from-yellow-400 to-orange-500",
      trend: 2.3
    },
    {
      title: "mAP@0.5",
      value: "89.7",
      subtitle: "%",
      icon: <Target className="w-6 h-6 text-blue-400" />,
      color: "from-blue-400 to-cyan-500",
      trend: 1.8
    },
    {
      title: "Inference Speed",
      value: "45",
      subtitle: "ms",
      icon: <Zap className="w-6 h-6 text-purple-400" />,
      color: "from-purple-400 to-pink-500",
      trend: -5.2
    },
    {
      title: "Total Detections",
      value: "12.5K",
      subtitle: "",
      icon: <BarChart3 className="w-6 h-6 text-green-400" />,
      color: "from-green-400 to-emerald-500",
      trend: 15.7
    }
  ];

  const classMetrics = [
    { label: "Astronaut", value: 95.3, color: "from-blue-400 to-cyan-500" },
    { label: "Tool", value: 92.8, color: "from-purple-400 to-pink-500" },
    { label: "Equipment", value: 88.5, color: "from-green-400 to-emerald-500" },
    { label: "Debris", value: 91.2, color: "from-yellow-400 to-orange-500" },
    { label: "Module", value: 87.9, color: "from-red-400 to-rose-500" },
    { label: "Cable", value: 85.6, color: "from-indigo-400 to-blue-500" }
  ];

  const performanceMetrics = [
    { label: "Precision", value: 93.5, color: "from-cyan-400 to-blue-500" },
    { label: "Recall", value: 91.8, color: "from-purple-400 to-pink-500" },
    { label: "F1-Score", value: 92.6, color: "from-green-400 to-emerald-500" },
    { label: "IoU", value: 88.3, color: "from-yellow-400 to-orange-500" }
  ];

  return (
    <div className="min-h-screen w-full bg-black font-sans p-3 sm:p-5 overflow-x-hidden">
      <StarsBackground />
      <ShootingStars />
      
      {/* Header */}
      <button
        className="absolute top-3 left-3 sm:top-5 sm:left-5 text-base sm:text-xl text-gray-500 items-center hover:text-gray-300 transition-colors duration-150 cursor-pointer flex flex-row gap-2 z-50"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="size-4 sm:size-5" />
        <span className="hidden sm:inline">back to home</span>
        <span className="sm:hidden">back</span>
      </button>

      <div className="relative z-10 w-full pt-16 sm:pt-8 pb-6 sm:pb-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Award className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400" />
              <h1 className="text-white font-semibold text-3xl sm:text-4xl lg:text-5xl font-sans">
                Model Performance Scores
              </h1>
            </div>
            <p className="text-gray-500 text-base sm:text-xl lg:text-2xl">
              Real-time metrics and detection accuracy
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-gray-900/40 rounded-xl p-1 border border-gray-700/50 backdrop-blur-sm">
              <button
                onClick={() => setSelectedTab('overview')}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedTab === 'overview'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setSelectedTab('detailed')}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedTab === 'detailed'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Detailed Metrics
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 space-y-8 pb-12">
        {selectedTab === 'overview' && (
          <>
            {/* Overview Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {overviewMetrics.map((metric, index) => (
                <div
                  key={index}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <MetricCard {...metric} />
                </div>
              ))}
            </div>

            {/* Class-wise Performance */}
            <div className="bg-gray-900/40 rounded-2xl border border-gray-700/50 p-6 sm:p-8 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl sm:text-2xl font-semibold text-white">
                  Class-wise Detection Accuracy
                </h2>
              </div>
              <div className="space-y-4">
                {classMetrics.map((metric, index) => (
                  <div
                    key={index}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ProgressBar {...metric} />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {selectedTab === 'detailed' && (
          <>
            {/* Performance Metrics */}
            <div className="bg-gray-900/40 rounded-2xl border border-gray-700/50 p-6 sm:p-8 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl sm:text-2xl font-semibold text-white">
                  Performance Metrics
                </h2>
              </div>
              <div className="space-y-4">
                {performanceMetrics.map((metric, index) => (
                  <div
                    key={index}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ProgressBar {...metric} />
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-900/40 rounded-2xl border border-gray-700/50 p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  Training Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Epochs</span>
                    <span className="text-white font-semibold">300</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Batch Size</span>
                    <span className="text-white font-semibold">16</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Learning Rate</span>
                    <span className="text-white font-semibold">0.001</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Dataset Size</span>
                    <span className="text-white font-semibold">15,000 images</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/40 rounded-2xl border border-gray-700/50 p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-green-400" />
                  Model Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Architecture</span>
                    <span className="text-white font-semibold">YOLOv8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Parameters</span>
                    <span className="text-white font-semibold">25.9M</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Model Size</span>
                    <span className="text-white font-semibold">52.4 MB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Framework</span>
                    <span className="text-white font-semibold">PyTorch</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ScoreComponent;