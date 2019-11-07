import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {DropdownSelectComponent} from './dropdown-select/dropdown-select.component';
import {DropdownDemoComponent} from './dropdown-demo/dropdown-demo.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    DropdownSelectComponent,
    DropdownDemoComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
