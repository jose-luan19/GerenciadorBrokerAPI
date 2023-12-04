import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../services/client.service';
import { ClientDetails } from '../interfaces/clientDetails';
import { format } from 'date-fns';
import { Client } from '../interfaces/client';
import { ModalComponent } from '../component/modal/modal.component';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.css']
})
export class ClientDetailsComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private clientService: ClientService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    )
    {}

    private currentId!: string;
    public currentClient!: ClientDetails;
    public listClients!: Client[];

    ngOnInit(): void {
      this.route.params.subscribe(params => {
        this.currentId = params['id'];
        this.getDetails(this.currentId);
      });
    }

    getDetails(id: string, onlyMessages: boolean = false){
      this.clientService.getDetailsClient(id).subscribe((client: ClientDetails)=>{
        this.currentClient = client;
        this.getMessages();
        if(!onlyMessages){
          this.getOtherClients();
        }
      this.cdr.detectChanges();
    });
  }
  getMessages(){
    this.currentClient.messages = this.currentClient.messages.sort((a, b) => {
      const dateA = new Date(a.createDate);
      const dateB = new Date(b.createDate);
      return dateA.getTime() - dateB.getTime();
    });
    this.formatarData();
    this.cdr.detectChanges();
  }
  getOtherClients(){
    this.clientService.getAll().subscribe((clients: Client[])=>{
      this.listClients = clients.filter(item => item.id !== this.currentClient.id).sort((a, b) => {
        const dateA = new Date(a.createDate);
        const dateB = new Date(b.createDate);
        return dateA.getTime() - dateB.getTime();
      });
    });
  }

  formatarData() {
    this.currentClient.messages.forEach(element => {
      const dataObj = new Date(element.sendMessageDate);
      element.sendMessageDateFormat = format(dataObj, 'yyyy/MM/dd HH:mm:ss');
    });
  }

  openModalMessageForClient(idClient: string, nameClient: string){
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '300px',
      data: {
        title: 'MENSAGEM PARA \'' + nameClient +'\'',
        parameterPlaceholder: 'Mensagem',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        const obj: Object = {
          clientId: idClient,
          message: result.name
        }
        this.messageService.sendMessage(obj).subscribe(
          () => {
            this.getDetails(this.currentId);
            this.openSnackBar(`Mensagem enviada para \' ${nameClient} \'`, 'Fechar', true);
          },
          (error) => {
            if(error.status === 400){
              this.openSnackBar(error.error, 'Fechar');
            }
          }
        );
      }
    });
  }


  openSnackBar(message: string, action: string, sucess: boolean = false) {
    this.snackBar.open(message, action, {
        duration: 6000,
        verticalPosition: 'bottom',
        horizontalPosition: 'end',
        panelClass: sucess ? ['success-snackbar'] : ['warning-snackbar']
    });
  }

  changeStatusClient(){
    this.clientService.changeStatus(this.currentId).subscribe(()=>{
      this.currentClient.isOnline = !this.currentClient.isOnline;
      this.openSnackBar(`Cliente \' ${this.currentClient.name} \' mudou de STATUS`, 'Fechar', true);
      setTimeout(()=>{this.getDetails(this.currentId, true)}, 3000);
    });
  }

}
