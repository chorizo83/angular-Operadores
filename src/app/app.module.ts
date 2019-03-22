import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';

import { AppComponent } from './app.component';
import { IndexComponent } from './index/index.component';
import { CombinacionComponent } from './operadores/combinacion/combinacion.component';
import { CondicionalComponent } from './operadores/condicional/condicional.component';
import { CreacionComponent } from './operadores/creacion/creacion.component';

@NgModule({
  imports:[ 
    BrowserModule, 
    AppRoutingModule,
    FormsModule,
    HttpClientModule
    ],
  declarations: [ 
    AppComponent, 
    IndexComponent,
    CombinacionComponent,
    CondicionalComponent,
    CreacionComponent
    ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
