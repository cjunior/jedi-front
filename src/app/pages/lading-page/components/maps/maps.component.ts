import { Component, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import maplibregl, { Map, Marker } from 'maplibre-gl';
import { CiclesService } from '../../../../core/services/cicles.service';
import type { ICurrentCicleResponse } from '../../../../core/interfaces/ciclies.interface';
import municipiosBr from '../../mock-geoMunicipalities.json';

@Component({
  selector: 'app-maps',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements AfterViewInit, OnDestroy {
  private readonly ciclesService = inject(CiclesService);

  private map!: Map;
  private markers: Marker[] = [];

  protected currentCicle: ICurrentCicleResponse | null = null;
  hasCicle: boolean = false;

  ngAfterViewInit(): void {
    this.map = new maplibregl.Map({
      container: 'map',
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [-52, -3.5],
      zoom: 2,
    });

    this.ciclesService.getCurrentCicle().subscribe({
      next: (cicle) => {
        cicle.municipios.length ? this.hasCicle = true : this.hasCicle = false;
        this.currentCicle = cicle;
        this.loadMarkers();
      },
      error: (err) => {
        console.error('Erro ao obter ciclo atual:', err)
      },
    });
  }

  private loadMarkers(): void {
    if (!this.currentCicle) return;

    // Remove markers antigos
    this.markers.forEach((m) => m.remove());
    this.markers = [];

    const filtered = municipiosBr.filter((mun: any) =>
      this.currentCicle!.municipios.includes(mun.nome)
    );

    filtered.forEach((mun: any) => {
      const marker = new maplibregl.Marker()
        .setLngLat([mun.longitude, mun.latitude])
        .setPopup(new maplibregl.Popup().setHTML(`<b>${mun.nome}</b>`))
        .addTo(this.map);

      this.markers.push(marker);
    });

    // Centraliza no primeiro município
    if (filtered.length) {
      this.map.setCenter([filtered[0].longitude, filtered[0].latitude]);
      this.map.setZoom(8);
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}
