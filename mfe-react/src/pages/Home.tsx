import React from "react";
import { LineChart, BarChart, PieChart, ScatterChart } from "@mui/x-charts";

const Home: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-8">Bem Vindo ao React!</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-4 flex justify-center">
          <LineChart
            xAxis={[{ data: [0, 1, 2, 3, 4] }]}
            series={[{ data: [2, 5, 3, 7, 4] }]}
            width={300}
            height={200}
          />
        </div>

        <div className="bg-white rounded-xl shadow p-4 flex justify-center">
          <BarChart
            xAxis={[{ scaleType: "band", data: ["A", "B", "C", "D"] }]}
            series={[{ data: [4, 3, 5, 2] }]}
            width={300}
            height={200}
          />
        </div>

        <div className="bg-white rounded-xl shadow p-4 flex justify-center">
          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: 10, label: "Apple" },
                  { id: 1, value: 15, label: "Banana" },
                  { id: 2, value: 20, label: "Cherry" },
                ],
              },
            ]}
            width={300}
            height={200}
          />
        </div>

        <div className="bg-white rounded-xl shadow p-4 flex justify-center">
          <ScatterChart
            series={[
              {
                data: [
                  { x: 1, y: 2 },
                  { x: 2, y: 3 },
                  { x: 3, y: 5 },
                ],
              },
            ]}
            xAxis={[{ label: "X", min: 0, max: 5 }]}
            yAxis={[{ label: "Y", min: 0, max: 6 }]}
            width={300}
            height={200}
          />
        </div>

        <div className="bg-white rounded-xl shadow p-4 flex justify-center">
          <LineChart
            xAxis={[{ data: [1, 2, 3, 4, 5] }]}
            series={[{ data: [5, 6, 3, 4, 7] }]}
            width={300}
            height={200}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
