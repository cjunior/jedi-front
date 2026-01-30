import { Component, inject, signal } from '@angular/core';
import { CarouselComponent } from './components/carousel/carousel.component';

import { AcordionComponent } from './components/acordion/acordion.component';
import { CarouselSquareComponent } from './components/carousel-square/carousel.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { InputMaskModule } from 'primeng/inputmask';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PreRegistrationService } from '../../core/services/pre-registration.service';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { landingPageService } from './services/lading-page.service';
import { CarouselModule } from 'primeng/carousel';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FooterComponent } from '../../shared/footer/footer.component';
import { CarouselContentComponent } from './components/carousel-content/carousel.component';
import { DropdownModule } from 'primeng/dropdown';
import { MapsComponent } from './components/maps/maps.component';
import { BannerMultiploService } from '../../core/services/banner-multiplo.service';
import type { IBanner } from '../../core/interfaces/banner.interface';

interface BlogCard {
  id: number;
  titulo: string;
  autor: string;
  data: string;
  tempoLeitura: string;
  imagem: string;
  descricao: string;
  descricaoImagem: string;
}

@Component({
  selector: 'app-lading-page',
  imports: [
    CarouselComponent,
    AcordionComponent,
    CarouselSquareComponent,
    DropdownComponent,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputMaskModule,
    FormsModule,
    ReactiveFormsModule,
    Toast,
    CarouselModule,
    CommonModule,
    FooterComponent,
    CarouselContentComponent,
    DropdownModule,
    MapsComponent
  ],
  templateUrl: './lading-page.component.html',
  styleUrl: './lading-page.component.scss',
  providers: [MessageService],
})
export class LadingPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly pregristrationService = inject(PreRegistrationService);
  private readonly messageService = inject(MessageService);
  private readonly landingPageService = inject(landingPageService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly bannerMultiploService = inject(BannerMultiploService);

  showErrors = signal(false);
  isLoading = signal(false);
  isInitialLoading = true;
  imagesLoaded = false;
  dataLoaded = false;
  loadingProgress = 0;
  visible = false;
  confirmVisible = false;
  successVisible = false;
  showRegistrationModal = false;
  showBackToTop = false;

  blogDestaque: BlogCard | null = null;
  blogItems = []
  bannersMultiplos: IBanner[] = [];
  bannerImageCache = new Map<string, string>();

  form = this.formBuilder.group({
    name: ['', [Validators.minLength(6), Validators.required]],
    email: ['', [Validators.email, Validators.required]],
    phone: [
      '',
      [Validators.required, Validators.minLength(10), Validators.maxLength(11)],
    ],
    municipality: [''],
    otherMunicipality: [{ value: '', disabled: true }, Validators.required],
    isOtherMunicipality: [false],
    acceptedTerms: [false, Validators.required]
  });

  protected municipiosDisponiveis = [
    { label: 'Belém', value: 'Belém' },
    { label: 'Ananindeua', value: 'Ananindeua' },
    { label: 'Castanhal', value: 'Castanhal' },
    { label: 'Santa Izabel do Pará', value: 'Santa Izabel do Pará' },
    { label: 'Marituba', value: 'Marituba' },
    { label: 'Benevides', value: 'Benevides' },
    { label: 'Vigia', value: 'Vigia' },
    { label: 'Portel', value: 'Portel' },
    { label: 'Breves', value: 'Breves' },
    { label: 'Abaetetuba', value: 'Abaetetuba' },
    { label: 'Moju', value: 'Moju' },
    { label: 'Cametá', value: 'Cametá' },
    { label: 'Barcarena', value: 'Barcarena' },
    { label: 'Tailândia', value: 'Tailândia' },
    { label: 'Igarapé-Miri', value: 'Igarapé-Miri' },
    { label: 'Acará', value: 'Acará' },
    { label: 'Tomé-Açú', value: 'Tomé-Açú' },
    { label: 'Baião', value: 'Baião' },
    { label: 'Bragança', value: 'Bragança' },
    { label: 'Capanema', value: 'Capanema' },
    { label: 'Viseu', value: 'Viseu' },
    { label: 'Capitão Poço', value: 'Capitão Poço' },
    { label: 'Curuçá', value: 'Curuçá' },
    { label: 'São Miguel do Guamá', value: 'São Miguel do Guamá' },
    { label: 'Salinópolis', value: 'Salinópolis' },
  ];

  protected isOtherMunicipality = false;

  ngOnInit() {
    window.addEventListener('scroll', () => {
      this.showBackToTop = window.pageYOffset > 300;
    });

    this.preloadImages();

    this.bannerMultiploService.getBanners().subscribe({
      next: (banners) => {
        this.bannersMultiplos = banners;
        banners.forEach(banner => {
          this.loadImageWithNgrokHeader(banner.imgUrl);
        });
      },
      error: () => {
        this.bannersMultiplos = [];
      }
    });

    this.landingPageService.getdados().subscribe({
      next: (dados) => {
        this.dataLoaded = true;
        this.loadingProgress = Math.max(this.loadingProgress, 50) + 50;
        this.checkLoadingComplete();
        const blogItems = dados.blogSectionResponseDto?.items || [];
        this.blogItems = blogItems;

        this.blogDestaque =
          blogItems.length > 0
            ? {
                id: blogItems[0].id,
                titulo: (blogItems[0].title || '').replace(/\s+/g, ' ').trim(),
                autor: (blogItems[0].author || '').replace(/\s+/g, ' ').trim(),
                data: (blogItems[0].date || '').replace(/\s+/g, ' ').trim(),
                tempoLeitura: (blogItems[0].readingTime || '')
                  .replace(/\s+/g, ' ')
                  .trim(),
                imagem: blogItems[0].imageUrl,
                descricao: (blogItems[0].description || ''),
                descricaoImagem: (blogItems[0].imageDescription || '')
                  .replace(/\s+/g, ' ')
                  .trim(),
              }
            : null;
      },
      error: (error) => {
        this.dataLoaded = true;
        this.loadingProgress = 100;
        this.checkLoadingComplete();
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Ocorreu um erro ao carregar os dados.',
        });
      },
    });
  }

  private checkLoadingComplete() {
    if (this.dataLoaded && this.imagesLoaded) {
      this.loadingProgress = 100;
      setTimeout(() => {
        this.isInitialLoading = false;
        setTimeout(() => this.scrollToMunicipiosIfNeeded(), 150);
      }, 800);
    }
  }

  private scrollToMunicipiosIfNeeded(): void {
    const fragment = this.route.snapshot.fragment ?? window.location.hash?.slice(1);
    if (fragment === 'municipios') {
      document.getElementById('municipios')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  private preloadImages() {
    const imageUrls = [
      '/logo.svg',
      './diva4.jpg',
      './ondas.svg',
      './onda2.svg',
      './step/ttt.jpg',
      './step/Passo1.jpg',
      './step/Passo2.jpg',
      './step/Passo3.jpg',
      './step/Passo4.jpg',
      './fotoH.jpg',
      './edit.svg',
      './tes.svg',
      './icons/instagram.svg',
      './icons/youtube.svg',
      './icons/email.png'
    ];

    let loadedCount = 0;
    const totalImages = imageUrls.length;

    imageUrls.forEach(url => {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        this.loadingProgress = Math.round((loadedCount / totalImages) * 50);
        if (loadedCount === totalImages) {
          this.imagesLoaded = true;
          this.checkLoadingComplete();
        }
      };
      img.onerror = () => {
        loadedCount++;
        this.loadingProgress = Math.round((loadedCount / totalImages) * 50);
        if (loadedCount === totalImages) {
          this.imagesLoaded = true;
          this.checkLoadingComplete();
        }
      };
      img.src = url;
    });
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  openFortalezaNews() {
    const fortalezaNewsId = 15;
    this.router.navigate(['/noticias', fortalezaNewsId]);
    window.scrollTo(0, 0);
  }

  openBannerLink(linkUrl: string) {
    if (linkUrl) {
      window.open(linkUrl, '_blank', 'noopener,noreferrer');
    }
  }

  redirectToBlog() {
    this.router.navigate(['/noticias']);
    window.scrollTo(0, 0);
  }

  isAuthenticated(): boolean {
    return this.authService.isLoggedIn();
  }

  redirectToConfigs() {
    this.router.navigate(['/configuracoes']);
  }

  onOtherMunicipalityChange(isChecked: boolean) {
    this.isOtherMunicipality = isChecked;
    this.form.patchValue({ isOtherMunicipality: isChecked });

    if (isChecked) {
      this.form.patchValue({ municipality: 'Outros' });
      this.form.get('municipality')?.disable();

      this.form.get('otherMunicipality')?.enable();
      this.form.get('otherMunicipality')?.setValidators([Validators.required]);
      this.form.get('otherMunicipality')?.updateValueAndValidity();
    } else {
      this.form.patchValue({ municipality: '', otherMunicipality: '' });
      this.form.get('municipality')?.enable();
      this.form.get('municipality')?.setValidators([Validators.required]);
      this.form.get('municipality')?.updateValueAndValidity();

      this.form.get('otherMunicipality')?.clearValidators();
      this.form.get('otherMunicipality')?.updateValueAndValidity();
      this.form.get('otherMunicipality')?.disable();
    }
  }

  async onSubmit() {
    this.showErrors.set(true);

    if (this.form.valid) {
      const payload = {
        completeName: this.form.value.name,
        email: this.form.value.email,
        cellphone: this.form.value.phone,
        municipality: this.isOtherMunicipality ? 'Outros' : this.form.value.municipality,
        otherMunicipality: this.isOtherMunicipality ? this.form.value.otherMunicipality : '',
        acceptedTerms: this.form.value.acceptedTerms,
      };

      this.confirmVisible = true;
    } else {
      this.form.markAllAsTouched();
    }
  }

  confirmSubmit() {
    const completeName: string = this.form.value.name ?? '';
    const email: string = this.form.value.email ?? '';
    const cellphone: string = this.form.value.phone ?? '';
    const municipality: string = this.form.value.otherMunicipality ? 'Outros' : (this.form.value.municipality ?? '');
    const otherMunicipality: string = this.form.value.otherMunicipality ?? '';
    const acceptedTerms: boolean = this.form.value.acceptedTerms ?? false;

    this.confirmVisible = false;
    this.isLoading.set(true);

    this.pregristrationService
      .makePreRegistration({ completeName, email, cellphone, municipality, otherMunicipality, acceptedTerms })
      .subscribe({
        next: (response) => {
          this.isLoading.set(false);

          this.showErrors.set(false);
          this.visible = false;
          this.confirmVisible = false;
          this.successVisible = true;
          this.form.reset();
        },
        error: (error) => {
          this.isLoading.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail:
              `${error?.error?.errors?.cellphone || ``} ${
                error?.error?.message || ``
              }` || 'Ocorreu um erro durante o pré-cadastro.',
          });
        },
      });
  }

  redirectToRegistration(state: 'para' | 'ceara') {
    this.showRegistrationModal = false;
    
    const urls = {
      para: 'https://ee.kobotoolbox.org/x/MhHcsBoM',
      ceara: 'https://ee.kobotoolbox.org/x/GjJmopXx'
    };
    
    window.open(urls[state], '_blank');
  }

  loadImageWithNgrokHeader(imageUrl: string): void {
    if (this.bannerImageCache.has(imageUrl)) {
      return;
    }

    fetch(imageUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob();
      })
      .then(blob => {
        const blobUrl = URL.createObjectURL(blob);
        this.bannerImageCache.set(imageUrl, blobUrl);
      })
      .catch(() => {
        this.bannerImageCache.set(imageUrl, imageUrl);
      });
  }

  getBannerImageUrl(banner: IBanner): string {
    if (!banner || !banner.imgUrl) {
      return '';
    }
    const cachedUrl = this.bannerImageCache.get(banner.imgUrl);
    return cachedUrl || banner.imgUrl;
  }
}

