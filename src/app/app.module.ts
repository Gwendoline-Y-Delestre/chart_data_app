// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgxEchartsModule } from 'ngx-echarts';
import { AppComponent } from './app.component';
import { ChartComponent } from './chart/chart.component';
import { DataService } from './data.service';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, ChartComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
  ],
  providers: [DataService],
  bootstrap: [AppComponent],
})
export class AppModule {}
