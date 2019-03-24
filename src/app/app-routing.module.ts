import {NgModule} from '@angular/core';
import {Routes,RouterModule} from '@angular/router';

import { AppComponent } from './app.component';
import { IndexComponent } from './index/index.component';
import { CombinacionComponent } from './operadores/combinacion/combinacion.component';
import { CondicionalComponent } from './operadores/condicional/condicional.component';
import { CreacionComponent } from './operadores/creacion/creacion.component';
import { TransformComponent } from './operadores/transform/transform.component';


const appRoutes:Routes=[
  {path:'', component:IndexComponent},
  {path:'combinacion', component:CombinacionComponent},
  {path:'condicional', component:CondicionalComponent},
  {path:'transform', component:TransformComponent},
  {path:'creacion', component:CreacionComponent},
  {
    path:'**',
    redirectTo:'',
    pathMatch:'full'
  }
  
]

@NgModule({
imports:[
      RouterModule.forRoot(appRoutes)
],exports:[RouterModule]
})
export class AppRoutingModule{

}