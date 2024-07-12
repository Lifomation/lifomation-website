import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import {MessageService} from 'primeng/api'
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [DialogModule,
    ButtonModule,
    InputTextModule,
    FileUploadModule, ToastModule],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss', '../../layout/header/header.component.scss'],
  providers: [MessageService]
})
export class UploadComponent {
  selectedFile: File | null = null;
  visible: boolean = false;
  @Output() documentUploaded = new EventEmitter<any>();
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor( private apiService: ApiService, private messageService: MessageService) {}


  showDialog() {
    this.visible = true;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] || null;
  }


  uploadFile() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('document', this.selectedFile);
      this.apiService.uploadDocument(formData).subscribe({
        next: (res) => {
          this.documentUploaded.emit(res.document);
          this.clearFileInput();
          this.messageService.add({severity: 'success', summary: 'Success', detail: 'Document successfully uploaded'});
        },
        error: (err) => {
          console.error(err);
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'Document upload failed'});
        }
      });

    }
  }


  clearFileInput() {
    this.fileInput.nativeElement.value = '';
    this.selectedFile = null;
    this.visible = false;
  }

}
