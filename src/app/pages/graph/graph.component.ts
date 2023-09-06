import { Component } from '@angular/core';
import { ChartData } from 'chart.js';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styles: [
  ]
})
export class GraphComponent {
  
  public labels: string[] = ['Pan', 'Refresco', 'Tacos'];
  public data: ChartData<'doughnut'> = {
    labels: this.labels,
    datasets: [
      { data: [10, 15, 40] }
    ],
  };
}
