import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ChartComponent } from './chart/chart.component'; // Importer le composant ChartComponent
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent, ChartComponent],
  imports: [BrowserModule, HttpClientModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
