import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsersModel } from './../models/users-model';
import { Observable, combineLatest, forkJoin, merge, of, from, race, zip} from 'rxjs';
import { combineAll, concatAll, mapTo, map, take, mergeAll, mergeMap, switchMap, mergeMapTo, delay, startWith, withLatestFrom} from 'rxjs/operators';
import 'rxjs/add/observable/timer';
import 'rxjs/add/observable/concat';
import 'rxjs/add/observable/interval';

@Component({
  selector: 'app-combinacion',
  templateUrl: './combinacion.component.html'
})
export class CombinacionComponent implements OnInit {

  public users:UsersModel[]=[];

  constructor(private http: HttpClient) {}

  ngOnInit() {}

/**
 * procesa uno y despues lo unimos al otro para darle forma, con lo reaslizamos un observable combinado ;)
 */
  public rxjsCombineAll():void{
    const fiveSecondTimer$ = Observable.timer(1000).pipe(take(1)); 
    const combination$ = fiveSecondTimer$.pipe(mapTo(this.http.get('https://jsonplaceholder.typicode.com/users/1')));
    const combinated$ = combination$.pipe(combineAll());

    combinated$.subscribe((res:UsersModel[]) => {
        this.users =  res;
      })
    
  }


/**
 * Unimos las peticiones, pero no las recibimos respuesta hasta que esten todas resultas
 */
  public rxjscombineLatest():void{
    const Obs1$ = this.http.get<UsersModel[]>('https://jsonplaceholder.typicode.com/users/2');
    const Obs2$ = this.http.get<UsersModel[]>('https://jsonplaceholder.typicode.com/users/1');
    const timerThree$ = Observable.timer(5000).pipe(map(val=>"Hola que ase"));

    const combinated$ = combineLatest(Obs1$, timerThree$, Obs2$);

    combinated$.subscribe(([res, res1, res2])=>{
      console.log(res);
      console.log(res1);
      console.log(res2);
    });
  }

  /**
   * Unimos las respuestas, pero las va procesando en orden y emitiendo las respuestas -una detrás de otra- esperando
   * siempre su turno de respuesta
   */
  public rxjsConcat():void{
    const Obs1$ = this.http.get('https://jsonplaceholder.typicode.com/users/2');
    const timer$ = Observable.timer(3000).pipe(mapTo(this.http.get('https://jsonplaceholder.typicode.com/users/5')));
    const flat_timer$ = timer$.pipe(combineAll());
    const Obs2$ = this.http.get('https://jsonplaceholder.typicode.com/users/1');
    const Obs3$ = this.http.get('https://jsonplaceholder.typicode.com/users/3');

    Observable.concat(Obs1$, flat_timer$, Obs2$, Obs3$)
      .subscribe((res:UsersModel[]) =>{ 
        this.users=res;
      });
  }


  /**
   * Podemos crear un bucle de periciones y concatean todas las respuestas para que pasen por el mismo
   * método de subscripción e ir procesandolas a medida que se vayan produciendo las respuestas del server
   */
  public rxjsConcatAll():void{
    const interval$ = Observable.interval(1000); 

    const combination$ = interval$.pipe(
      map(val => this.http.get('https://jsonplaceholder.typicode.com/users/'+(val+1))), 
      concatAll()
    );

    combination$.subscribe((res:UsersModel[])=>{
      this.users=res;
    });

  }


  /**
   * Procesa todos los resultados y cuando finalizan todos, podemos obtener el valor de forma ordenada a su invocación
   * es similar a combineLatest
   */
  public rxjsForkJoin():void{
    forkJoin(
      this.http.get('https://jsonplaceholder.typicode.com/users/2'),
      this.http.get('https://jsonplaceholder.typicode.com/users/1'),
      Observable.timer(5000).pipe(map(val=>"Hola")),
      Observable.timer(2000).pipe(map(val=>"Hola que ase"))
    )
    .subscribe(([res1, res2, res3, res4]) => {
      console.log(res1);
      console.log(res2);
      console.log(res3);
      console.log(res4);
    });

  }

 /**
   * emite todas las peticiones, e independientemente del orden de salida según se vayan procesando vamos recibiendo 
   * los valores de respuesta
   */
  public rxjsMerge():void{
    const rest1$ = this.http.get('https://jsonplaceholder.typicode.com/users/2');
    const timer$ = Observable.timer(3000).pipe(map(val=>"Hola"));
    const rest2$ = this.http.get('https://jsonplaceholder.typicode.com/users/1');
    const timer1$ = Observable.timer(5000).pipe(map(val=>"Que ase"));

    const unidos$ = merge(
      rest1$,timer$, rest2$, timer1$
    ) 
    unidos$.subscribe(res => {
      console.log(res);
    });
  }


 /**
   * emite todas las peticiones, cuando procesa el resultado de todas, emite un resultado conjunto
   */
  public rxjsMergeAll():void{
    const funente = of(1, 2, 3);
    this.users=[];
    
    const unidos$ = funente.pipe(
        map(val => this.http.get('https://jsonplaceholder.typicode.com/users/'+val).pipe(delay(3000))),
        mergeAll()
    );
    unidos$.subscribe((res:UsersModel) => {
      this.users.push(res);
    });
  }

 /**
   * emite todas las peticiones, La primera en responder o finalizar es la procesada
   */
  public rxjsRace():void{
    const unidos$ = race(
      this.http.get('https://jsonplaceholder.typicode.com/users/1').pipe(delay(3000)),
      this.http.get('https://jsonplaceholder.typicode.com/users/2').pipe(delay(1000)),
      this.http.get('https://jsonplaceholder.typicode.com/users/3').pipe(delay(4000)),
      this.http.get('https://jsonplaceholder.typicode.com/users/4').pipe(delay(5000))
    );
    unidos$.subscribe((res:UsersModel) => {
      this.users.push(res);
    });
  }

 /**
   * Añadimos un item inicial
   */
  public rxjsStartWith():void{
    const funente$ = of("que ase", "como estas", " Andrés");

    const unidos$ = funente$.pipe(
      startWith('Hola')
    );

    unidos$.subscribe(res => {
      console.log(res);
    });
  }


  /**
   * Cada vez que el conductor genera un valor de respuesta nos adjunta el valor del conducido sea cual fuere
   * su último valor, aún que este no se haya modificado
   */
  public rxjsWithLatestFrom():void{
    const intervalA$ = Observable.interval(1000); //observable conductor
    const intervalB$ = Observable.interval(5000); // observable conducido

    const unidos$ = intervalA$.pipe(
      withLatestFrom(intervalB$),
      map(([first, second]) => {
        return `(1s): ${first} --- (5s): ${second}`;
      })
    );

    unidos$.subscribe(res => {
      console.log(res);
    });
  }

  /**
   * La respuesta se produce cuando se procesan todos los observables, y nos retorna una array con los resultados
   */
  public rxjsZip():void{
    const unidos$ = zip(
      this.http.get<UsersModel>('https://jsonplaceholder.typicode.com/users/1').pipe(delay(3000)),
      this.http.get<UsersModel>('https://jsonplaceholder.typicode.com/users/2').pipe(delay(1000)),
      this.http.get<UsersModel>('https://jsonplaceholder.typicode.com/users/3').pipe(delay(4000)),
      this.http.get<UsersModel>('https://jsonplaceholder.typicode.com/users/4').pipe(delay(5000))
    );
    unidos$.subscribe((res:UsersModel[]) => {
      this.users=res;
    });
  }

  /**
   * MergeAll + Map
   */
  public rxjsMergeMap():void{
    const emit$ = of(1, 2, 3);
    this.users=[];

    const merge$ = emit$.pipe(
      mergeMap(data => this.http.get<UsersModel>('https://jsonplaceholder.typicode.com/users/'+data))
    );
    merge$.subscribe((res:UsersModel) => {
       this.users.push(res);
    });
  }

  /**
   * Tiene en cuenta el último valor emitido por el observable emisor, descartando los demás en el intervalo
   * de tiempo en el que se esta procesando el observable mapeado
   */
  public rxjsSwitchMap():void{
    const emit$ = of(1, 2, 3);
    this.users=[];

    const merge$ = emit$.pipe(
      switchMap(data => this.http.get('https://jsonplaceholder.typicode.com/users/'+data))
    );
    merge$.subscribe((res:UsersModel) => {
      this.users.push(res);
    });
  }

  






}