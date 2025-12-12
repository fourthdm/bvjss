import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private http: HttpClient) { }

  // url = `http://localhost:8000`;
  url = `https://bvjss.org/Backend`;

  Addfeedback(data: any) {
    return this.http.post(this.url + '/addfeedback', data);
  }

  Allfeedback() {
    return this.http.get(this.url + '/Allfeedbacks');
  }

  Donate(data: any) {
    return this.http.post(this.url + '/getDonatationsform', data);
  }

  AllBlogs() {
    return this.http.get(this.url + '/Allblogs');
  }

  AllGallerybyDepartment(data: any) {
    return this.http.post(this.url + '/Allgallerybydepartment', data);
  }

  AllDailyReport() {
    return this.http.get(this.url + '/AllDailyReports');
  }

  AlllatestUpdate() {
    return this.http.get(this.url + '/Alllatestupdate');
  }

  AllVideos() {
    return this.http.get(this.url + '/AllVideos');
  }

}