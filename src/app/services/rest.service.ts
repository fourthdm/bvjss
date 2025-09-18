import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private http: HttpClient) { }

  url = `http://localhost:8000`;
  // url=`https://ysurveillance.com/BvjssBackend`;
  // url=`https://ysurveillance.com/Backend`;

  Addfeedback(data: any) {
    return this.http.post(this.url + '/addfeedback', data);
  }

  Allfeedback() {
    return this.http.get(this.url + '/Allfeedbacks');
  }

  Donate(data: any) {
    return this.http.post(this.url + '/getDonatationsform', data);
  }

}
