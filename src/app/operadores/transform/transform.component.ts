import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsersModel } from './../models/users-model';
import { Observable, of } from 'rxjs';
import { mergeMap, switchMap} from 'rxjs/operators';


@Component({
  selector: 'app-transform',
  templateUrl: './transform.component.html'
})
export class TransformComponent implements OnInit {

  public users:UsersModel[]=[];

  constructor(private http: HttpClient) {}

  ngOnInit() {
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