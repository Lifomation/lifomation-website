import { CommonModule, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-doc-view',
  standalone: true,
  imports: [NgIf, NgxExtendedPdfViewerModule, ImageModule, CommonModule],
  templateUrl: './doc-view.component.html',
  styleUrl: './doc-view.component.scss',
})
export class DocViewComponent {
  documentUrl: any = '';
  documentType: string | null = null;
  loading = true;
  keyInfo: any = null;
  document: any;
  copiedKey: string | null = null;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    let index = this.route.snapshot.paramMap.get('id');
    if (!index) {
      return;
    }
    const i = parseInt(index, 10);
    this.apiService.getUserId().subscribe((userId: string | undefined) => {
      if (userId && userId !== 'Unknown UID') {
        this.apiService.getFile(i, userId).subscribe({
          next: (blob: Blob) => {
            this.documentType = blob.type === 'application/pdf' ? 'pdf' : null;
            const objectUrl = URL.createObjectURL(blob);
            this.documentUrl =
              this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);

            this.apiService.getDocument(i, userId).subscribe({
              next: (res: any) => {
                console.log(res);
                this.loading = false;
                this.document = res.document;
                this.keyInfo = res.document.keyInfo;
              },
              error: (err) => {
                console.error(err);
              },
            });
          },
          error: (err) => {
            console.error(err);
          },
        });

        this.apiService.updateLastOpened(i, userId).subscribe({
          next: () => {},
          error: (err) => {
            console.error(err);
          },
        });
      } else {
        console.error('User ID not found');
      }
    });
  }

  keyInfoKeys(): string[] {
    return Object.keys(this.keyInfo);
  }

  copyToClipboard(text: string, key: string) {
    navigator.clipboard.writeText(text).then(
      () => {
        console.log('Text copied to clipboard!');
        this.copiedKey = key;
        setTimeout(() => {
          this.copiedKey = null;
        }, 2000);
      },
      (err) => console.error('Failed to copy text: ', err)
    );
  }

  editKeyInfo(key: string) {
    const value = this.keyInfo[key];
    let newValue = prompt('Enter new value for ' + key, value);
    console.log('key:', key, 'newValue:', newValue);
    if (newValue !== null) {
      this.apiService.editKeyInfo(this.document.id, key, newValue).subscribe({
        next: () => {
          this.keyInfo[key] = newValue;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
  }
}
