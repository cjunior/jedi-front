import { Component, inject, type OnInit } from '@angular/core';
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { CiclesService } from '../../../../core/services/cicles.service';
import type { ICurrentCicleResponse } from '../../../../core/interfaces/ciclies.interface';
import municipiosBr from '../../mock-geoMunicipalities.json';

@Component({
  selector: 'app-maps',
  standalone: true,
  imports: [GoogleMap, MapMarker, CommonModule],
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {
  private readonly ciclesService = inject(CiclesService);

  protected currentCicle: ICurrentCicleResponse | null = null;

  center: google.maps.LatLngLiteral = { lat: -3.5, lng: -52 };
  markers: { position: google.maps.LatLngLiteral; nome: string }[] = [];

  ngOnInit(): void {
    this.ciclesService.getCurrentCicle().subscribe({
      next: (cicle) => {
        console.log('Ciclo atual:', cicle);
        this.currentCicle = cicle;
        this.loadMarkers();
      },
      error: (error) => {
        console.error('Erro ao obter o ciclo atual:', error);
      },
    });
  }

  private loadMarkers(): void {
    if (!this.currentCicle) return;

    // Filtra apenas os municípios que vieram do backend
    const filtered = municipiosBr.filter((mun: any) =>
      this.currentCicle!.municipios.includes(mun.nome)
    );

    // Cria os markers
    this.markers = filtered.map((mun: any) => ({
      position: {
        lat: mun.latitude,
        lng: mun.longitude
      },
      nome: mun.nome
    }));

    // Opcional: centralizar o mapa no primeiro município
    if (this.markers.length) {
      this.center = this.markers[0].position;
    }
  }
}
