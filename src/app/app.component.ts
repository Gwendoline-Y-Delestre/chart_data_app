import { Component } from '@angular/core';
import { DataService } from './data.service';
import { EChartsOption, BarSeriesOption, PieSeriesOption } from 'echarts';
import { Observable } from 'rxjs';

interface DataItem {
  Letter: string;
  Freq: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  selectedChartType: string = 'bar';
  selectedData: { [key: string]: boolean } = {};
  allDataSelected: boolean = false;
  dataKeys: string[] = []; // Array to hold data keys

  chartOptions: EChartsOption | null = null;
  allData: DataItem[] = []; // All data loaded once

  constructor(private dataService: DataService) {
    // Initialize selectedData with empty keys
    this.dataService.getData().subscribe((data: DataItem[]) => {
      this.allData = data; // Store all data once
      data.forEach((item) => {
        const key = item.Letter;
        this.selectedData[key] = false;
        this.dataKeys.push(key);
      });
    });
  }

  // Utilisez cette fonction pour le graphique empilé
  generateChart() {
    const selectedDataKeys = Object.keys(this.selectedData).filter(
      (key) => this.selectedData[key]
    );
    if (selectedDataKeys.length === 0 && !this.allDataSelected) {
      console.log('Select at least one data or choose all data');
      return;
    }
    console.log(this.selectedChartType);
    if (this.selectedChartType === 'stackedBar') {
      this.generateStackedBarChartOptions(selectedDataKeys);
    } else if (this.selectedChartType === 'pie') {
      const chartOptions = this.generatePieChartOptions(
        this.selectedChartType,
        selectedDataKeys,
        this.allData
      );

      this.chartOptions = chartOptions;
    } else if (this.selectedChartType === 'bar') {
      const chartOptions = this.generateBarChartOptions(
        this.selectedChartType,
        selectedDataKeys,
        this.allData
      );

      this.chartOptions = chartOptions;
    } else if (this.selectedChartType === 'line') {
      const chartOptions = this.generateLineChartOptions(
        this.selectedChartType,
        selectedDataKeys,
        this.allData
      );

      this.chartOptions = chartOptions;
    }
  }

  // private generateStackedBarChartOptions(selectedDataKeys: string[]): void {
  //   const xAxisData: string[] = [];
  //   const seriesData: { [key: string]: number[] } = {
  //     AllData: [],
  //     Vowels: [],
  //     Consonants: [],
  //   };

  //   selectedDataKeys.forEach((key) => {
  //     const dataItem = this.allData.find((item) => item.Letter === key);

  //     if (dataItem) {
  //       xAxisData.push(dataItem.Letter);
  //       seriesData['AllData'].push(dataItem.Freq);
  //       // Vérifiez si la lettre est une voyelle
  //       const isVowel = ['a', 'e', 'i', 'o', 'u', 'y'].includes(
  //         key.toLowerCase()
  //       );

  //       // Ajoutez à la série correspondante
  //       if (isVowel) {
  //         seriesData['Vowels'].push(dataItem.Freq);
  //         console.log(seriesData['Vowels']);
  //       } else {
  //         seriesData['Consonants'].push(dataItem.Freq);
  //         console.log(seriesData['Consonants']);
  //       }
  //     }
  //   });

  //   const chartOptions: EChartsOption = {
  //     title: {
  //       text: `Stacked Bar Chart - Data: ${selectedDataKeys.join(', ')}`,
  //       left: 'center',
  //     },
  //     legend: {
  //       data: xAxisData,
  //       align: 'right',
  //       top: 30,
  //     },
  //     xAxis: {
  //       type: 'category',
  //       data: ['All Data', 'Vowels', 'Consonants'],
  //     },
  //     yAxis: {
  //       type: 'value',
  //     },
  //     series: [
  //       {
  //         name: 'All Data',
  //         type: 'bar',
  //         stack: 'stack',
  //         data: seriesData['Vowels'],
  //       },
  //       {
  //         name: 'Vowels',
  //         type: 'bar',
  //         stack: 'stack',
  //         data: seriesData['Vowels'],
  //       },
  //       {
  //         name: 'Consonants',
  //         type: 'bar',
  //         stack: 'stack',
  //         data: seriesData['Consonants'],
  //       },
  //     ],
  //   };

  //   // const chartOptions: EChartsOption = {
  //   //   xAxis: {
  //   //     type: 'category',
  //   //     data: ['A', 'B', 'C', 'D', 'E'],
  //   //   },
  //   //   yAxis: {
  //   //     type: 'value',
  //   //   },
  //   //   series: [
  //   //     {
  //   //       name: 'Vowels',
  //   //       type: 'bar',
  //   //       stack: 'stack',
  //   //       data: [1, 2, 3, 4, 5],
  //   //     },
  //   //     {
  //   //       name: 'Consonants',
  //   //       type: 'bar',
  //   //       stack: 'stack',
  //   //       data: [5, 4, 3, 2, 1],
  //   //     },
  //   //   ],
  //   // };

  //   // Assigner les options au graphique
  //   this.chartOptions = chartOptions;
  // }

  private generateStackedBarChartOptions(selectedDataKeys: string[]): void {
    const xAxisData: string[] = [];
    const seriesData: { [key: string]: number[] } = {
      AllData: [],
      Vowels: [],
      Consonants: [],
    };

    let series: BarSeriesOption[] = [];

    if (this.allDataSelected) {
      this.allData.forEach((dataItem) => {
        xAxisData.push(dataItem.Letter);
        seriesData['AllData'].push(dataItem.Freq);

        const isVowel = ['a', 'e', 'i', 'o', 'u', 'y'].includes(
          dataItem.Letter.toLowerCase()
        );

        if (isVowel) {
          seriesData['Vowels'].push(dataItem.Freq);
        } else {
          seriesData['Consonants'].push(dataItem.Freq);
        }

        // Ajout des données à la série
        series.push({
          name: dataItem.Letter,
          type: 'bar',
          stack: 'ad',
          data: [
            dataItem.Freq,
            isVowel ? dataItem.Freq : 0,
            isVowel ? 0 : dataItem.Freq,
          ],
        });
      });
    } else {
      selectedDataKeys.forEach((key) => {
        const dataItem = this.allData.find((item) => item.Letter === key);

        if (dataItem) {
          xAxisData.push(dataItem.Letter);
          seriesData['AllData'].push(dataItem.Freq);

          const isVowel = ['a', 'e', 'i', 'o', 'u', 'y'].includes(
            key.toLowerCase()
          );

          if (isVowel) {
            seriesData['Vowels'].push(dataItem.Freq);
            series.push({
              name: dataItem.Letter,
              type: 'bar',
              stack: 'ad',
              data: [dataItem.Freq, dataItem.Freq, 0],
            });
          } else {
            seriesData['Consonants'].push(dataItem.Freq);
            series.push({
              name: dataItem.Letter,
              type: 'bar',
              stack: 'ad',
              data: [dataItem.Freq, 0, dataItem.Freq],
            });
          }
        }
      });
    }

    const chartOptions: EChartsOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {},
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: ['All Data', 'Vowels', 'Consonants'],
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series: series,
    };

    this.chartOptions = chartOptions;
  }

  private generatePieChartOptions(
    chartType: string,
    selectedDataKeys: string[],
    allData: DataItem[]
  ): EChartsOption {
    const xAxisData: string[] = [];
    const seriesData: number[] = [];
    const dataLegend: { value: number; name: string }[] = [];

    // if (this.allDataSelected) {
    //   // Si "All Data" est sélectionné, utilisez toutes les données
    //   allData.forEach((item) => {
    //     xAxisData.push(item.Letter);
    //     seriesData.push(item.Freq);
    //   });
    // } else {
    //   // Utilisez uniquement les données sélectionnées individuellement
    //   selectedDataKeys.forEach((key) => {
    //     const dataItem = allData.find((item) => item.Letter === key);

    //     if (dataItem) {
    //       xAxisData.push(dataItem.Letter);
    //       seriesData.push(dataItem.Freq);
    //     }
    //   });
    // }

    if (this.allDataSelected) {
      // Si "All Data" est sélectionné, utilisez toutes les données
      this.allData.forEach((item) => {
        xAxisData.push(item.Letter);
        seriesData.push(item.Freq);
        dataLegend.push({ value: item.Freq, name: item.Letter });
      });
    } else {
      // Si "All Data" n'est pas sélectionné, utilisez les données sélectionnées
      selectedDataKeys.forEach((key) => {
        const dataItem = this.allData.find((item) => item.Letter === key);

        if (dataItem) {
          xAxisData.push(dataItem.Letter);
          seriesData.push(dataItem.Freq);
          dataLegend.push({ value: dataItem.Freq, name: dataItem.Letter });
        }
      });
    }

    const series: PieSeriesOption[] = [
      {
        data: dataLegend,
        type: 'pie',
        label: {
          show: true,
          formatter: '{b}: {d}%', // {b}: name, {c}: value, {d}: percentage
        },
      },
    ];

    return {
      title: {
        text: `Pie Chart - Data: ${selectedDataKeys.join(', ')}`,
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: series,
    };
  }

  private generateLineChartOptions(
    chartType: string,
    selectedDataKeys: string[],
    allData: DataItem[]
  ): EChartsOption {
    const xAxisData: string[] = [];
    const seriesData: number[] = [];

    if (this.allDataSelected) {
      // Si "All Data" est sélectionné, utilisez toutes les données
      allData.forEach((item) => {
        xAxisData.push(item.Letter);
        seriesData.push(item.Freq);
      });
    } else {
      // Utilisez uniquement les données sélectionnées individuellement
      selectedDataKeys.forEach((key) => {
        const dataItem = allData.find((item) => item.Letter === key);

        if (dataItem) {
          xAxisData.push(dataItem.Letter);
          seriesData.push(dataItem.Freq);
        }
      });
    }

    const series: BarSeriesOption[] = [
      {
        data: seriesData,
        type: chartType as 'bar',
      },
    ];

    return {
      title: {
        text: `Line Chart - Data: ${selectedDataKeys.join(', ')}`,
        left: 'center',
      },
      legend: {
        data: [`Line Chart`],
        align: 'right',
        top: 30,
      },
      label: {
        show: true,
        position: 'top',
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
      },
      yAxis: {
        type: 'value',
      },
      series: series,
    };
  }

  private generateBarChartOptions(
    chartType: string,
    selectedDataKeys: string[],
    allData: DataItem[]
  ): EChartsOption {
    const xAxisData: string[] = [];
    const seriesData: number[] = [];

    if (this.allDataSelected) {
      // Si "All Data" est sélectionné, utilisez toutes les données
      allData.forEach((item) => {
        xAxisData.push(item.Letter);
        seriesData.push(item.Freq);
      });
    } else {
      // Utilisez uniquement les données sélectionnées individuellement
      selectedDataKeys.forEach((key) => {
        const dataItem = allData.find((item) => item.Letter === key);

        if (dataItem) {
          xAxisData.push(dataItem.Letter);
          seriesData.push(dataItem.Freq);
        }
      });
    }

    const series: BarSeriesOption[] = [
      {
        data: seriesData,
        type: 'bar',
        label: {
          show: true,
          position: 'top',
          formatter: '{c}', // {c}: value
        },
      },
    ];

    return {
      title: {
        text: `Bar Chart - Data: ${selectedDataKeys.join(', ')}`,
        left: 'center',
      },
      legend: {
        data: [`Bar Chart`],
        align: 'right',
        top: 30,
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
      },
      yAxis: {
        type: 'value',
      },
      series: series,
    };
  }

  private generateChartOptions(
    chartType: string,
    selectedDataKeys: string[],
    allData: DataItem[]
  ): EChartsOption {
    const xAxisData: string[] = [];
    const seriesData: number[] = [];

    if (this.allDataSelected) {
      // Si "All Data" est sélectionné, utilisez toutes les données
      allData.forEach((item) => {
        xAxisData.push(item.Letter);
        seriesData.push(item.Freq);
      });
    } else {
      // Utilisez uniquement les données sélectionnées individuellement
      selectedDataKeys.forEach((key) => {
        const dataItem = allData.find((item) => item.Letter === key);

        if (dataItem) {
          xAxisData.push(dataItem.Letter);
          seriesData.push(dataItem.Freq);
        }
      });
    }

    const series: BarSeriesOption[] = [
      {
        data: seriesData,
        type: chartType as 'bar',
      },
    ];

    return {
      title: {
        text: `${chartType} Chart - Data: ${selectedDataKeys.join(', ')}`,
        left: 'center',
      },
      legend: {
        data: [`${chartType} Chart`],
        align: 'right',
        top: 30,
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
      },
      yAxis: {
        type: 'value',
      },
      series: series,
    };
  }
}
