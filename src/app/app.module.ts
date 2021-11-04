import { OverlayModule } from '@angular/cdk/overlay';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { SuggestionListComponent } from './suggestion-list/suggestion-list.component';
import { SuggestionTriggerDirective } from './suggestion-trigger.directive';
import { ListItemsComponent } from './list-items/list-items.component';
import { ListItems2Component } from './list-items2/list-items2.component';

@NgModule({
  declarations: [AppComponent, SuggestionTriggerDirective, SuggestionListComponent, ListItemsComponent, ListItems2Component],
  imports: [BrowserModule, ReactiveFormsModule, OverlayModule],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule {
}
