import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AgencyService } from '../../agency/agency.service';
import { OrderService } from '../../orders/order.service';
import * as M from "materialize-css/dist/js/materialize";

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.css']
})
export class EditOrderComponent implements OnInit {

  farmers: any = [];
  fscs: any = [];
  bscs: any = [];
  dscs: any = [];
  orderForm: FormGroup;
  orderBy: string;
  products: any = [];
  price: number = 0;
  order: any;

  constructor(private as: AgencyService,
    private os: OrderService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.orderForm = new FormGroup({
      order_no: new FormControl(''),
      order_created_by: new FormControl('', Validators.required),
      created_disctributor_id: new FormControl('', Validators.required),
      created_disctributor_amount: new FormControl('', [Validators.required, Validators.pattern(/^(?!0(\.0*)?$)\d+(\.?\d{0,2})?$/)]),
      all_product: new FormArray([])
    });
    this.formControlValueChanges();
    this.getDistributors();
    this.getFarmers();
    this.getProducts();
    this.getOrder();
    setTimeout(()=>{
      M.updateTextFields();
    },500);
    setTimeout(()=>{
      let elems = document.querySelectorAll('select');
      let instances = M.FormSelect.init(elems);
    },500);
  }

  getOrder() {
    const order_no = this.route.snapshot.paramMap.get('order_no');
    const dist_id = this.route.snapshot.paramMap.get('dist_id');
    this.os.getOrder(order_no, dist_id).subscribe(res=>{
      if (res['result']) {
        res['data'][0]['all_product'].forEach(e => {
          this.addProduct();
        });
        this.order = res['data'][0];
        this.orderForm.patchValue(res['data'][0]);
        setTimeout(()=>{
          M.updateTextFields();
        },500);
        setTimeout(()=>{
          let elems = document.querySelectorAll('select');
          let instances = M.FormSelect.init(elems);
        },500);
      }
    });
  }

  get prod() { return this.orderForm.get('all_product') as FormArray; }

  addProduct() {
    let prodToAdd = new FormGroup({
      prod_id: new FormControl('', Validators.required),
      qty: new FormControl(0, [Validators.required, Validators.pattern(/^(?!0(\.0*)?$)\d+(\.?\d{0,2})?$/)]),
      rate_of_prod: new FormControl(0, [Validators.required, Validators.pattern(/^(?!0(\.0*)?$)\d+(\.?\d{0,2})?$/)]),
      amt: new FormControl(0, [Validators.required, Validators.pattern(/^(?!0(\.0*)?$)\d+(\.?\d{0,2})?$/)])
    });

    prodToAdd.get('prod_id').valueChanges.subscribe(val=>{
      this.products.forEach(product => {
        if (product.id == val) {
          prodToAdd.get('rate_of_prod').setValue(product.farmer_price);
          prodToAdd.get('qty').setValue(0);
          prodToAdd.get('amt').setValue(0);
        }
      });
    });

    prodToAdd.get('qty').valueChanges.subscribe(val=>{
      prodToAdd.get('amt').setValue(prodToAdd.get('rate_of_prod').value*val);
    });

    this.prod.push(prodToAdd);
    setTimeout(()=>{
      M.updateTextFields();
    },500);
    setTimeout(()=>{
      let elems = document.querySelectorAll('select');
      let instances = M.FormSelect.init(elems);
    },500);
  }

  deleteProduct(index) {
    this.prod.removeAt(index);
  }

  formControlValueChanges() {
    this.orderForm.get('order_created_by').valueChanges.subscribe(val=>{
      this.orderBy = val;
      this.orderForm.get('created_disctributor_id').setValue('');
      setTimeout(()=>{
        let elems = document.querySelectorAll('select');
        let instances = M.FormSelect.init(elems);
      },500);
    });

    this.prod.valueChanges.subscribe(val=>{
      this.price = 0;
      val.forEach(element => {
        if (element.amt) {
          this.price +=element.amt;
        }
      });
      this.orderForm.get('created_disctributor_amount').setValue(this.price);

    });

    // this.orderForm.get('prod_id').valueChanges.subscribe(val=>{
    //   this.products.forEach(product => {
    //     if (product.id == val) {
    //       this.orderForm.get('rate_of_prod').setValue(product.farmer_price);
    //       this.orderForm.get('qty').setValue(0);
    //       this.price = product.farmer_price;
    //     }
    //   });
    // });

    // this.orderForm.get('qty').valueChanges.subscribe(val=>{
    //   this.orderForm.get('created_disctributor_amount').setValue(this.price*val);
    // });
  }

  getProducts() {
    this.os.getProducts().subscribe(res=>{
      if (res['result']) {
        this.products = res['data'];
      }
    });
  }

  getFarmers() {
    this.os.getFarmers().subscribe(res=>{
      if (res['result']) {
        this.farmers = res['data'];
      }
    });
  }

  getDistributors() {
    this.as.getDistributors().subscribe(res=>{
      if (res['result']) {
        this.fscs = res['data'];
        this.bscs = res['data'];
        this.dscs = res['data'];
      }
    });
  }

  onSubmit() {
    if (this.orderForm.invalid) {
      return;
    }
    // console.log(this.orderForm.value);
    this.os.updateOrder(this.orderForm.value).subscribe(res=>{
      if (res['result']) {
        this.toastr.success('Order updated successfully!');
        this.router.navigate(['/admin', 'my-orders']);
      } else {
        this.toastr.error(res['message']);
      }
    });
  }

}
