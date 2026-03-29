import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const PerformanceChart = ({ data = [] }) => {

  const chartData = data.map((value, index) => ({
    day: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][index],
    score: value
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={chartData}>
        <XAxis dataKey="day" stroke="#888" />
        <YAxis domain={[0, 100]} stroke="#888" />
        <Tooltip />
        <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PerformanceChart;