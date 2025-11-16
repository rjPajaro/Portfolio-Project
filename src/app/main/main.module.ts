import { NgModule } from "@angular/core";
import { MainComponent } from "./main.component";
import { MainRoutingModule } from "./main-routing.module";
import { CommonModule } from "@angular/common";
import { BackgroundComponent } from "../background/background.component";

@NgModule({
  declarations: [MainComponent, BackgroundComponent],
  imports: [
    CommonModule,
    MainRoutingModule
  ]
})
export class MainModule { }