import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-creacion',
  templateUrl: './creacion.component.html'
})
export class CreacionComponent implements OnInit {

constructor(private http: HttpClient, private el: ElementRef) {}

ngOnInit() {}


/**
 * 
 */
public rxjsCreate():void{
}
}