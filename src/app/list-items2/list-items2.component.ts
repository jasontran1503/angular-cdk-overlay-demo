import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-items2',
  templateUrl: './list-items2.component.html',
  styleUrls: ['./list-items2.component.scss']
})
export class ListItems2Component implements OnInit {

  @Input() set inputValue(value: string) {
    if (!value) {
      this.items = this.dataSource;
      return;
    }
    this.items = this.dataSource.filter((item) => item[this.bindKeyFilter].includes(value));
  }

  @Input() dataSource: any[] = [];
  items: any[] = [];

  @Input() bindKeyFilter!: string;

  constructor() {}

  ngOnInit(): void {
    this.items = this.dataSource;
  }

}
