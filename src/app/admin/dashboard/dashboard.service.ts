import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Observable } from 'rxjs';
//import { environment } from 'src/environments/environment';
import { environment } from 'src/environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  urlforapi = environment.apiurl;
  token = '';
  constructor(private http: HttpClient, private ngxService: NgxUiLoaderService) { }

  public getToken(): string {
    return localStorage.getItem('token');
  }

  getAgency(): Observable<any> {
    this.token = this.getToken();
    return this.http.post(`${this.urlforapi}webagencylist?token=${this.token}`, null);
  }

  dashboarddata(): Observable<any> {
    this.token = this.getToken();
    return this.http.post(`${this.urlforapi}webdash_counting?token=${this.token}`, null);
  }

  getFarmersDashReport(farmerData) {
    this.token = this.getToken();
    this.ngxService.start();
    let result= this.http.post(`${this.urlforapi}webdash_farmer_list?token=${this.token}`, farmerData);
    this.ngxService.stop();
    return result;
  }

  webdash_farmer_count(farmerData) {
    this.token = this.getToken();
    this.ngxService.start();
    let result= this.http.post(`${this.urlforapi}webdash_farmer_count?token=${this.token}`, farmerData);
    this.ngxService.stop();
    return result;
  }


  webdash_dist_count(farmerData) {
    this.token = this.getToken();
    this.ngxService.start();
    let result= this.http.post(`${this.urlforapi}webdash_distributor_count?token=${this.token}`, farmerData);
    this.ngxService.stop();
    return result;
  }

  getDistDashReport(farmerData) {
    this.token = this.getToken();
    this.ngxService.start();
    let result= this.http.post(`${this.urlforapi}webdash_distributor_list?token=${this.token}`, farmerData);
    this.ngxService.stop();
    return result;
  }

  

 
}
