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

const Dashboard = () => {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/insights/dashboard",
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
        <div className="text-zinc-400">Loading dashboard...</div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout>
        <div className="text-red-500">Failed to load data</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>

      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">

        <TodayTasks tasks={data?.todayTasks || []} />

        <TransformationProgress
          progress={data?.transformationProgress ?? 0}
        />

      </div>

      {/* Prediction + Focus Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">

        {/* ✅ FIXED */}
        <TransformationPrediction prediction={data?.prediction} />

        <FocusAreaProgress
          focusAreas={data?.focusAreas || []}
        />

      </div>

      {/* Behavioral State */}
      <section className="mb-12">
        <BehavioralStateCard
          state={data?.overallState || "Unknown"}
          burnoutRisk={data?.burnoutRisk ? "High" : "Low"}
          emotionalTrend={data?.emotionalTrend || "Stable"}
          recoveryStatus={data?.recoveryDetected ? "Active" : "Stable"}
        />
      </section>

      {/* Behavioral Trends */}
      <section className="mb-12">
        <BehavioralTrendSection
          trends={data?.trends || []}
          moodTrend={data?.moodTrend || []}
        />
      </section>

      {/* Discipline Heatmap */}
      <section className="mb-12">
        <DisciplineHeatmap />
      </section>

      {/* Weekly Intelligence */}
      <section>
        <WeeklyIntelligencePanel
          classification={data?.overallState || "Unknown"}
          moodAverage={data?.weeklyMoodAverage || 0}
          performanceAverage={`${data?.weeklyPerformanceAverage || 0}%`}
          weeklyScore={`${data?.weeklyScore || 0}%`}
        />
      </section>

    </DashboardLayout>
  );

};

export default Dashboard;