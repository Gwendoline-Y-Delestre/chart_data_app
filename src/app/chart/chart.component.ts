import { Component, Input } from '@angular/core';
import { ECharts, EChartsOption } from 'echarts';

@Component({
  selector: 'app-chart',
  template: '<div echarts [options]="chartOptions" class="chart"></div>',
  styleUrls: ['./chart.component.css'],
})
export class ChartComponent {
  @Input() chartOptions: EChartsOption | null = null;
}
