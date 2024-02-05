import { Component } from '@angular/core';
import { DataService } from './data.service';
import { EChartsOption, LineSeriesOption } from 'echarts';
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

  constructor(private dataService: DataService) {
    // Initialize selectedData with empty keys
    this.dataService.getData().subscribe((data: DataItem[]) => {
      data.forEach((item) => {
        const key = item.Letter;
        this.selectedData[key] = false;
        this.dataKeys.push(key);
      });
    });
  }

  generateChart() {
    const selectedDataKeys = Object.keys(this.selectedData).filter(
      (key) => this.selectedData[key]
    );

    if (selectedDataKeys.length === 0 && !this.allDataSelected) {
      console.log('Select at least one data or choose all data');
      return;
    }

    this.dataService.getData().subscribe((allData: DataItem[]) => {
      const chartOptions = this.generateChartOptions(
        this.selectedChartType,
        selectedDataKeys,
        allData
      );
      this.chartOptions = chartOptions;
    });
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

    const series: LineSeriesOption[] = [
      {
        data: seriesData,
        type: chartType as 'line',
      },
    ];

    return {
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
