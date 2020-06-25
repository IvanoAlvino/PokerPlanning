import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
	selector: 'card',
	templateUrl: './card.component.html',
	styleUrls: ['./card.component.scss']
})
export class CardComponent
{

	@Input()
	public estimate: string;

	/**
	 * Whether this card is currently selected.
	 */
	@Input()
	public selected: boolean = false;

	/**
	 * Output event emitted when this card has been selected.
	 */
	@Output()
	public onCardSelect = new EventEmitter<void>();

	/**
	 * Emit the event to signal the card has been selected.
	 */
	public emitCardSelected(): void
	{
		this.onCardSelect.emit();
	}
}
