// components/PieChartComponent.tsx
import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

interface PieChartComponentProps {
  data: Array<{ name: string; value: number }>;
  colorArray: string[];
}

const PieChartComponent: React.FC<PieChartComponentProps> = ({ data, colorArray }) => {
  const hasNonZeroValue = (data: Array<{ value: number }>) => {
    return data.some((entry) => entry.value > 0);
  };

  const chartData = data && hasNonZeroValue(data) ? data : [
    { name: "No Data", value: 1, color: "#cccccc" },
  ];

  return (
    <PieChart
      data={chartData.map((item, index) => ({
        ...item,
        color: colorArray[index % colorArray.length],
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      }))}
      width={Dimensions.get('window').width - 40}
      height={220}
      chartConfig={{
        backgroundColor: '#ffffff',
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      }}
      accessor="value"
      backgroundColor="transparent"
      paddingLeft="15"
      absolute
    />
  );
};

const styles = StyleSheet.create({
  noDataContainer: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataImage: {
    width: 200,
    height: 150,
    resizeMode: 'contain',
  },
});

export default PieChartComponent;