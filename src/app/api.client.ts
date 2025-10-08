// Angular Modules 
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { ApiResponse } from './models/api-response';
import { UtilsServiceService } from './utils/utils-service.service';
@Injectable()
export class ApiService {

    private DOMAIN_URL = "https://payrollapi.nginfosolutions.com/";
    private url = "https://payrollapi.nginfosolutions.com/";

    constructor(
        // Angular Modules 
        private http: HttpClient,
        private util: UtilsServiceService,
    ) { }
    // public get(url: string): Observable<ApiResponse<any>> {
    //     return this.http.get<ApiResponse<any>>(this.DOMAIN_URL + url);
    // }
    public get<T = any>(url: string): Observable<ApiResponse<T>> {
        return this.http.get<ApiResponse<T>>(this.DOMAIN_URL + url);
    }

    public post(url: any, data: any) {
        var reqHeader = new HttpHeaders({ 'No-Auth': 'false' });
        return this.http.post(this.DOMAIN_URL + url, data);
    }
    // public put(url: string, data: any, options?: any) {
    //     return this.http.put(url, data, options);
    // }
    // public delete(url: string) {
    //     return this.http.delete(url);
    // }

    public put(url: string, data: any): Observable<ApiResponse<any>> {
        return this.http.put<ApiResponse<any>>(this.DOMAIN_URL + url, data);
    }
    public delete(url: string) {
        return this.http.delete<ApiResponse<any>>(this.DOMAIN_URL + url);
    }
    public patch(url: any, data: any) {
        var reqHeader = new HttpHeaders({ 'No-Auth': 'false' });
        return this.http.patch(this.DOMAIN_URL + url, data);
    }
    login(url: any, email: any, password: any) {
        var reqHeader = new HttpHeaders({ 'No-Auth': 'True' });
        return this.http.post<any>(this.DOMAIN_URL + url, {
            email: email,
            password: password
        }, { headers: reqHeader })
    }
    updatePassword(url: any, email: any, OldPassword: any, newPassword: any) {
        var reqHeader = new HttpHeaders({ 'No-Auth': 'True' });
        return this.http.post<any>(this.DOMAIN_URL + url, {
            email: email,
            OldPassword: OldPassword,
            newPassword: newPassword
        }, { headers: reqHeader })
    }
    register(url: any, body: any) {
        var reqHeader = new HttpHeaders({ 'No-Auth': 'True' });
        return this.http.post<any>(this.DOMAIN_URL + url, body,
            { headers: reqHeader })
    }
    upload_docs(url: any, formData: any) {

        const accessToken = this.util.decrypt_Text(localStorage.getItem('access_token'));

        var reqHeader = new HttpHeaders({ 'Authorization': `Bearer ${accessToken}` });
        return this.http.post<any>(this.DOMAIN_URL + url, formData,
            { headers: reqHeader })
    }
    addEmployee(url: any, formData: any) {
        const accessToken = this.util.decrypt_Text(localStorage.getItem('access_token'));

        var reqHeader = new HttpHeaders({ 'Authorization': `Bearer ${accessToken}` });
        return this.http.post<any>(this.DOMAIN_URL + url, formData,
            { headers: reqHeader })
    }
    bulkUploadAttendance(url:any, payload: any): Observable<any> {
        return this.http.post<any>(this.DOMAIN_URL + url, payload);
    }
} 