import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { CaseNftModel } from '../../../models/case-nft.model';
import { SmartContractCaseService } from '../../../services/smart-contract-case/smart-contract-case.service';
import { EvidenceNftModel } from '../../../models/evidence-nft.model';
import { SmartContractEvidenceService } from '../../../services/smart-contract-evidence/smart-contract-evidence.service';
import { ExtrinsicService } from '../../../services/extrinsic/extrinsic.service';
import { ExecuteExtrinsicsStatusModel } from '../../../models/execution-extrinsics-status.model';

@Component({
  selector: 'app-case-detail',
  templateUrl: './case-detail.component.html',
  styleUrl: './case-detail.component.scss'
})
export class CaseDetailComponent {
  breadcrumbHome: MenuItem | undefined;
  breadcrumbItems: MenuItem[] | undefined;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public decimalPipe: DecimalPipe,
    private smartContractCaseService: SmartContractCaseService,
    private smartContractEvidenceService: SmartContractEvidenceService,
    private extrinsicService: ExtrinsicService
  ) { }

  isLoading: boolean = true;
  categories: string[] = [
    'Scam',
    'Web',
    'Person',
    'Conspiracy/Theory',
    'Others'
  ];
  statuses: string[] = [
    'New',
    'Voted',
    'Close'
  ];
  caseDetail: CaseNftModel = new CaseNftModel();
  evidences: EvidenceNftModel[] = [];

  showProcessModal: boolean = false;
  isProcessing: boolean = false;

  executionExtrinsicsStatus: ExecuteExtrinsicsStatusModel | undefined;

  public getCaseById(caseId: number): void {
    this.caseDetail = new CaseNftModel() || undefined;
    this.smartContractCaseService.getCaseById(caseId).subscribe(
      result => {
        let data: any = result;
        if (data != null || data != undefined) {
          this.caseDetail = {
            caseId: data.caseId,
            title: data.title,
            description: data.description,
            category: data.category,
            owner: data.owner,
            bounty: data.bounty,
            file: data.file,
            status: data.status
          };
        }

        this.getAllEvidenceByCaseId();
      },
      error => { }
    )
  }

  public getAllEvidenceByCaseId(): void {
    this.evidences = [];
    this.smartContractEvidenceService.getAllEvidenceByCaseId(this.caseDetail.caseId).subscribe(
      result => {
        let data: any = result;
        if (data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            this.evidences.push({
              evidenceId: data[i].evidenceId,
              description: data[i].description,
              owner: data[i].owner,
              file: data[i].file,
              caseId: data[i].caseId,
              caseTitle: data[i].caseTitle,
              status: data[i].status
            });
          }
        }

        this.isLoading = false;
      },
      error => { }
    )
  }

  public viewEvidenceDetail(data: EvidenceNftModel): void {
    this.router.navigate(['/app/evidence/detail/' + 1]);
  }

  ngOnInit() {
    this.breadcrumbHome = { icon: 'pi pi-home', routerLink: '/app/dashboard' };
    this.breadcrumbItems = [
      { label: 'Dashboard' },
      { label: 'Case' },
      { label: 'Case Detail' },
    ];

    let caseId: number = 0;
    this.route.params.subscribe(params => {
      caseId = parseInt(params['id']);
    });

    this.getCaseById(caseId);
  }
}
