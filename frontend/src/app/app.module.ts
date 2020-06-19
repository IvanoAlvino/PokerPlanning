import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {WelcomePageComponent} from "./welcome-page/welcome-page.component";

@NgModule({
  declarations: [
	  WelcomePageComponent
  ],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MatButtonModule,
		MatInputModule,
		HttpClientModule,
		FormsModule
	],
  providers: [],
  bootstrap: [WelcomePageComponent]
})
export class AppModule { }
