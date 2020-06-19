import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PokerPlanningComponent} from "./poker-planning/poker-planning.component";
import {WelcomePageComponent} from "./welcome-page/welcome-page.component";


const routes: Routes = [
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  { path: 'welcome', component: WelcomePageComponent },
  { path: 'poker/:room-id', component: PokerPlanningComponent },
  { path: '**', redirectTo: '/welcome', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
