import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {WelcomePageComponent} from "./welcome-page/welcome-page.component";
import {PokerPlanningComponent} from './poker-planning/poker-planning.component';
import {AppComponent} from "./app.component";
import {CardsListComponent} from './cards-list/cards-list.component';
import {CardComponent} from './card/card.component';
import {UsersListComponent} from './users-list/users-list.component';
import {VoteResultsComponent} from './vote-results/vote-results.component';
import {ChartsModule} from "ng2-charts";
import { FireworksComponent } from './fireworks/fireworks/fireworks.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import { ChangeRoomAdminModalComponent } from './change-room-admin-modal/change-room-admin-modal.component';
import {ClipboardModule} from "@angular/cdk/clipboard";
import {MatChipsModule} from "@angular/material/chips";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatDialogModule} from "@angular/material/dialog";
import {MatSelectModule} from "@angular/material/select";
import {MatCardModule} from "@angular/material/card";
import {MatSnackBarModule} from "@angular/material/snack-bar";

@NgModule({
	declarations: [
		AppComponent,
		WelcomePageComponent,
		PokerPlanningComponent,
		CardsListComponent,
		CardComponent,
		UsersListComponent,
		VoteResultsComponent,
		FireworksComponent,
  ChangeRoomAdminModalComponent,
	],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatInputModule,
        HttpClientModule,
        FormsModule,
        ChartsModule,
        MatDialogModule,
        MatToolbarModule,
        MatIconModule,
        MatSelectModule,
        MatCardModule,
        MatChipsModule,
        ClipboardModule,
        MatSnackBarModule,
        MatChipsModule
    ],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule
{
}
