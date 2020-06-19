import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input()
  public value: number;

  @Input()
  public selected: boolean = false;

  @Output()
  public select = new EventEmitter<boolean>();


  constructor() { }

  ngOnInit() {
  }

  public toggle(): void {
    this.select.emit(this.selected);
  }

}
