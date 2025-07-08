import { useLayoutEffect } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

function MyPageDonut(props) {
  useLayoutEffect(() => {
    let root = am5.Root.new("chartdiv");

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
        am5themes_Animated.new(root)
    ]);
    
    
    // Create chart
    // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
    let chart = root.container.children.push(am5percent.PieChart.new(root, {
        layout: root.verticalLayout
    }));
    
    
    // Create series
    // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
    let series = chart.series.push(am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category"
    }));
    
    
    // Set data
    // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
    // 이 부분 서버 데이터로 바꿀 것
    series.data.setAll([
        { value: 10, category: "Java" },
        { value: 9, category: "Javascript" },
        { value: 6, category: "Python" },
        { value: 5, category: "C" },
    ]);
    
    
    // Create legend
    // https://www.amcharts.com/docs/v5/charts/percent-charts/legend-percent-series/
    let legend = chart.children.push(am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        marginTop: 15,
        marginBottom: 15
    }));
    
    legend.data.setAll(series.dataItems);
    
    
    // Play initial series animation
    // https://www.amcharts.com/docs/v5/concepts/animations/#Animation_of_series
    series.appear(1000, 100);
  

    return () => {
      root.dispose();
    };
  }, []);

  return (
    <div id="chartdiv" style={{ width: "500px", height: "500px" }}></div>
  );
}
export default MyPageDonut;