import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const MoodChart = ({ data = [] }) => {

  const chartData = data.map((value, index) => ({
    day: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][index],
    mood: value
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={chartData}>
        <XAxis dataKey="day" stroke="#888" />
        <YAxis domain={[0, 10]} stroke="#888" />
        <Tooltip />
        <Line type="monotone" dataKey="mood" stroke="#22c55e" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MoodChart;