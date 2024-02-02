// chart.component.ts
import { Component, OnInit } from '@angular/core';
import { ECharts, EChartsOption } from 'echarts';
import { DataService } from '../data.service';

@Component({
  selector: 'app-chart',
  template: '<div echarts [options]="chartOptions" class="chart"></div>',
  styleUrls: ['./chart.component.css'],
})
export class ChartComponent implements OnInit {
  private echartsInstance!: ECharts;
  chartOptions: EChartsOption = {};

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getData().subscribe((data) => {
      console.log('Data from DataService:', data);
      const xAxisData = data.map((item) => item.Letter);
      const seriesData = data.map((item) => item.Freq);

      this.chartOptions = {
        xAxis: {
          type: 'category',
          data: xAxisData,
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: seriesData,
            type: 'bar',
          },
        ],
      };
    });
  }

  onChartInit(ec: ECharts): void {
    this.echartsInstance = ec;
  }
}
