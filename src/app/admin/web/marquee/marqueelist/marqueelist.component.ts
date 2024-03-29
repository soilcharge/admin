import { Component, OnInit } from '@angular/core';
import { WebService } from "../../web.service";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-marqueelist',
  templateUrl: './marqueelist.component.html',
  styleUrls: ['./marqueelist.component.css'],
})
export class MarqueelistComponent implements OnInit {

  p: number = 1;
  alllist: any;
  editid: any;
  constructor(public WebService: WebService,
    public router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.WebService.getMarqueList().subscribe(datalist => {
      this.alllist = datalist['data'];
    });

  }

  deleteCompanyProfile(id) {
    var obj = {
      id: id
    };

    this.WebService.getMarqueDelete(obj).subscribe(res => {
      if (res['result'] == true) {
        this.toastr.success("News deleted successfully!");
        this.router.navigate(['/admin', 'redirectself'], { state: ['/admin', 'marquee-list'] });
      }
    });
  }

  getForEdit(event) {
    this.editid = event;
    this.router.navigate(['/admin', 'marquee-edit', this.editid]);
  }

}
