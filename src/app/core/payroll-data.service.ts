import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CycleDto {
  id: number;
  clientId: number;
  clientName: string;
  periodMonth: string;
  offCycle: boolean;
  status: string;
  rejectCount: number;
  updatedAt: string;
}

export interface FileDto {
  id: number;
  cycleId: number;
  originalName: string;
  kind: string;
  status: string;
  sizeBytes: number;
  uploadedBy: string;
  uploadedAt: string;
}

// File kinds mirror the backend FileKind enum (payroll workflow stages).
export type FileKind =
  | 'CLIENT_INPUT'
  | 'PAYROLL_REPORT'
  | 'BANK_FILE'
  | 'CHALLAN'
  | 'PAID_CHALLAN';

@Injectable({ providedIn: 'root' })
export class PayrollDataService {
  private base = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  // ---- Cycles ----
  listCycles(clientId?: number): Observable<CycleDto[]> {
    const q = clientId != null ? `?clientId=${clientId}` : '';
    return this.http.get<CycleDto[]>(`${this.base}/cycles${q}`);
  }

  openMonth(clientId: number, periodMonth: string, offCycle = false): Observable<CycleDto> {
    return this.http.post<CycleDto>(`${this.base}/cycles/open`, { clientId, periodMonth, offCycle });
  }

  // ---- Files ----
  listFiles(opts: { cycleId?: number; clientId?: number } = {}): Observable<FileDto[]> {
    const params: string[] = [];
    if (opts.cycleId != null) params.push(`cycleId=${opts.cycleId}`);
    if (opts.clientId != null) params.push(`clientId=${opts.clientId}`);
    const q = params.length ? `?${params.join('&')}` : '';
    return this.http.get<FileDto[]>(`${this.base}/files${q}`);
  }

  /** Upload with progress events. */
  uploadFile(cycleId: number, kind: FileKind, file: File): Observable<HttpEvent<FileDto>> {
    const form = new FormData();
    form.append('file', file);
    const req = new HttpRequest(
      'POST',
      `${this.base}/files?cycleId=${cycleId}&kind=${kind}`,
      form,
      { reportProgress: true }
    );
    return this.http.request<FileDto>(req);
  }

  /** Download as a blob so we can trigger a browser save with the JWT attached. */
  downloadFile(fileId: number): Observable<Blob> {
    return this.http.get(`${this.base}/files/${fileId}/download`, { responseType: 'blob' });
  }
}
