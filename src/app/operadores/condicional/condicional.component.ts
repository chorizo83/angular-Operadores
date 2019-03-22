import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsersModel } from './../models/users-model';
import { defaultIfEmpty, map, mergeAll,every,tap, filter,bufferCount, debounceTime, mergeMap,
sequenceEqual } from 'rxjs/operators';
import { of, from, fromEvent } from 'rxjs';

@Component({
  selector: 'app-condicional',
  templateUrl: './condicional.component.html'
})
export class CondicionalComponent implements OnInit {

public users:UsersModel[]=[];
public strSalida:String='';
public txtVal:String='';
public inputVisible:Boolean=false;

constructor(private http: HttpClient, private el: ElementRef) {}

ngOnInit() {}

/**
 * Si nos fijamos, no emitimos ningún valor a través de of y por lo tanto aplica un valor por defecto
 */
public rxjsDefaultIfEmpty():void{
  const Obs1$ = of().pipe(defaultIfEmpty('Valor por defecto'));
  Obs1$.subscribe(val => this.strSalida=val);
}

/**
 * Devuelbe true o false dependiendo de si todos los valores cumplen con la condición establecida
 */
public rxjsEvery():void{
  const funente = of(1, 2, 3);
  const unidos$ = funente.pipe(
      map(val => this.http.get('https://jsonplaceholder.typicode.com/users/'+val)),
      mergeAll(),
      every((res:UsersModel)=>(res.name != "")),
      tap(e => this.strSalida=`¿Cumplen con la condición todas las peticiones? : ${e}`)
  );
  unidos$.subscribe();
}

/**
 * Comparamos las secuencias capturadas a través de keyup agrupadas por el bufferCount, si el
 * array de la secuencia coincide con la secuenciaModelo será ok sino no.
 */
public rxjsSequenceEqual():void{
  this.inputVisible=true;

  const secuenciaModelo$ = from(['h', 'ho', 'hol', 'hola']);

  const event$ = fromEvent(this.el.nativeElement, 'keyup')
    .pipe (
        map((e:any) => e.target.value), 
        tap(v => console.log(v)),
        bufferCount(4),
        mergeMap(keyDowns =>
          from(keyDowns)
            .pipe(
              sequenceEqual(secuenciaModelo$),
              tap(esOk =>
                this.strSalida=(esOk) ? 'Las secuencias coinciden!' : 'vuelve a probar!')
        ))
    );

  event$.subscribe(); 
}
  



}