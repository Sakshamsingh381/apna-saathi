import { useEffect, useState } from "react";

import DashboardLayout from "../components/layout/DashboardLayout";

import TodayTasks from "../components/TodayTasks";
import TransformationProgress from "../components/TransformationProgress";
import TransformationPrediction from "../components/TransformationPrediction";
import FocusAreaProgress from "../components/FocusAreaProgress";
import DisciplineHeatmap from "../components/DisciplineHeatmap";

import BehavioralStateCard from "../components/behavior/BehavioralStateCard";
import BehavioralTrendSection from "../components/behavior/BehavioralTrendSection";
import WeeklyIntelligencePanel from "../components/behavior/WeeklyIntelligencePanel";

import CardWrapper from "../components/ui/CardWrapper";

const Dashboard = () => {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        const token = localStorage.getItem("token");

        const response = await fetch(
          "https://apna-saathi-production.up.railway.app/api/insights/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const result = await response.json();

        if (result.success) {
          setData(result);
        }

      } catch (error) {

        console.error("Failed to load dashboard data");

      } finally {

        setLoading(false);

      }

    };

    fetchDashboard();

  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-40 text-zinc-400">
          Loading your dashboard...
        </div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-40 text-red-400">
          Unable to load dashboard data
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>

      <div className="relative px-4 sm:px-6 lg:px-8 py-6 bg-gradient-to-br from-[#0F172A] via-[#0B1220] to-[#020617] min-h-screen text-white overflow-hidden">

        {/* 🔥 Background Glow Effects */}
        <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-green-500/20 rounded-full blur-3xl"></div>

        {/* 🔥 Subtle Pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[size:20px_20px]"></div>

        {/* Content */}
        <div className="relative z-10">

          {/* Top Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch mb-8">

            <CardWrapper>
              <TodayTasks tasks={data?.todayTasks || []} />
            </CardWrapper>

            <CardWrapper>
              <TransformationProgress
                progress={data?.transformationProgress ?? 0}
              />
            </CardWrapper>

          </div>

          {/* Prediction + Focus Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch mb-8">

            <CardWrapper>
              <TransformationPrediction prediction={data?.prediction} />
            </CardWrapper>

            <CardWrapper>
              <FocusAreaProgress
                focusAreas={data?.focusAreas || []}
              />
            </CardWrapper>

          </div>

          {/* Behavioral State */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4 text-zinc-200 tracking-wide">
              Behavioral State
            </h2>

            <CardWrapper>
              <BehavioralStateCard
                state={data?.overallState || "Unknown"}
                burnoutRisk={data?.burnoutRisk ? "High" : "Low"}
                emotionalTrend={data?.emotionalTrend || "Stable"}
                recoveryStatus={data?.recoveryDetected ? "Active" : "Stable"}
              />
            </CardWrapper>
          </section>

          {/* Behavioral Trends */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4 text-zinc-200 tracking-wide">
              Behavioral Trends
            </h2>

            <CardWrapper>
              <BehavioralTrendSection
                trends={data?.trends || []}
                moodTrend={data?.moodTrend || []}
              />
            </CardWrapper>
          </section>

          {/* Discipline Heatmap */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4 text-zinc-200 tracking-wide">
              Discipline Heatmap
            </h2>

            <CardWrapper>
              <DisciplineHeatmap />
            </CardWrapper>
          </section>

          {/* Weekly Intelligence */}
          <section>
            <h2 className="text-lg font-semibold mb-4 text-zinc-200 tracking-wide">
              Weekly Intelligence
            </h2>

            <CardWrapper>
              <WeeklyIntelligencePanel
                classification={data?.overallState || "Unknown"}
                moodAverage={data?.weeklyMoodAverage || 0}
                performanceAverage={`${data?.weeklyPerformanceAverage || 0}%`}
                weeklyScore={`${data?.weeklyScore || 0}%`}
              />
            </CardWrapper>
          </section>

        </div>

      </div>

    </DashboardLayout>
  );

};

export default Dashboard;