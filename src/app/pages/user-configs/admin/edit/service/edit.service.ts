import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class editService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = environment.apiUrl;


    getdados(): Observable<any> {
        return this.http.get(`${this.apiUrl}loadlandpage/get`);
      }
      
      putdados(formData: FormData): Observable<any> {
        return this.http.put(`${this.apiUrl}header/update`, formData);
      }

       putdadosall(formData: FormData): Observable<any> {
        return this.http.put(`${this.apiUrl}loadlandpage/update-all`, formData,  { responseType: 'text' });
      }


      //parte das imagens manifesto

     postBanner(formData: FormData): Observable<any> {
  return this.http.post(`${this.apiUrl}banner/slides/add`, formData, { responseType: 'text' });
}

         putimage(formData: FormData): Observable<any> {
        return this.http.post(`${this.apiUrl}banner/slide/update`, formData);
      }

           deleteimage(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}banner/slide/${id}`,);
      }

    puttextmanifest(title: string, description: string): Observable<any> {
  const body = {
    title,
    description
  };
  return this.http.put(`${this.apiUrl}banner/update`, body);
}

// team equipe
   postTeam(formData: FormData): Observable<any> {
  return this.http.post(`${this.apiUrl}team/members/add`, formData, { responseType: 'text' });
}


   DeleteTeam(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}team/member/${id}`, );
}

//content parte


   postcontent(formData: FormData): Observable<any> {
  return this.http.post(`${this.apiUrl}content/slides/add`, formData, { responseType: 'text' });
}
      

   Deletecontet(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}content/slide/${id}`, );
}
 
}
