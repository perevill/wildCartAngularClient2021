import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IProducto } from 'src/app/model/producto-interfaces';
import { ProductoService } from 'src/app/service/producto.service';
import { Subject } from 'rxjs';
import { Location } from '@angular/common';
import { IconService } from 'src/app/service/icon.service';
import { IUsuario } from 'src/app/model/usuario-interfaces';

@Component({
  selector: 'app-remove-producto',
  templateUrl: './remove-producto.component.html',
  styleUrls: ['./remove-producto.component.css']
})
export class RemoveProductoComponent implements OnInit {
  strEntity: string = "producto"
  strOperation: string = "remove"
  strTitleSingular: string = "Producto";
  strTitlePlural: string = "Productos";
  id: number = 0;
  oProduct: IProducto;
  oUserSession: IUsuario;
  strResult: string = null;

  constructor(
    private oProductoService: ProductoService,
    private oActivatedRoute: ActivatedRoute,
    private oRoute: ActivatedRoute,
    private oRouter: Router,
    private oLocation: Location,
    public oIconService: IconService
  ) {
    if (this.oRoute.snapshot.data.message) {
      this.oUserSession = this.oRoute.snapshot.data.message;
      localStorage.setItem("user", JSON.stringify(this.oRoute.snapshot.data.message));
    } else {
      localStorage.clear();
      oRouter.navigate(['/home']);
    }
    // recogida de parámetros
    this.id = this.oActivatedRoute.snapshot.params.id
    // llamada al servidor
    this.getOne();
  }

  ngOnInit(): void {
  }

  getOne = () => {
    this.oProductoService.get(this.id).subscribe((oData: IProducto) => {
      this.oProduct = oData;
    })
  }

  removeOne() {
    this.oProductoService.removeOne(this.id).subscribe((oData: IProducto) => {
      if (oData) {
        this.strResult = this.strTitleSingular +  ' con ID=' + this.id + ' ha sido borrado con éxito';
      } else {
        this.strResult = 'Error en el borrado de ' + this.strTitleSingular;
      }
      this.openModal();
    })
  }

  goBack() {
    this.oLocation.back();
  }

  eventsModalSubject: Subject<void> = new Subject<void>();

  openModal() {
    this.eventsModalSubject.next();
  }

  closeModal() {
    this.oRouter.navigate(['/' + this.strEntity + '/plist']);
  }



}
