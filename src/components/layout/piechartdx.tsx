import { VictoryPie, VictoryLegend } from "victory";
import { PieDataType } from "../../@types/chartdatadxtype";

const PieChart = (
  fundData: PieDataType[],
  total: number,
  labels: string[],
  showLegend: boolean = true
) => {
  return (
    <div style={{ maxHeight: 300 }}>
      <VictoryPie
        labelPlacement={"perpendicular"}
        colorScale={["tomato", "orange", "gold", "cyan"]}
        data={fundData}
        x={(d: PieDataType) => (d.value / total) * 100}
        y="value"
        labels={labels}
      />
      {showLegend && (
        <VictoryLegend
          x={0}
          orientation="horizontal"
          data={[
            { name: labels[0], symbol: { fill: "tomato" } },
            { name: labels[1], symbol: { fill: "orange" } },
            { name: labels[2], symbol: { fill: "gold" } },
            { name: labels[3], symbol: { fill: "cyan" } },
          ]}
        />
      )}
    </div>
  );
};

export default PieChart;
