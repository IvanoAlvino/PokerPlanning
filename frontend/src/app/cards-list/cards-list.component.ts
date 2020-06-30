import {Component, EventEmitter, Output} from '@angular/core';
import {RoomService} from "../services/room/room.service";
import {ErrorResponse} from "../services/room/domain/error/ApiError";
import {Router} from "@angular/router";

@Component({
	selector: 'cards-list',
	templateUrl: './cards-list.component.html',
	styleUrls: ['./cards-list.component.scss']
})
export class CardsListComponent
{
	/**
	 * Output event emitted when this card has been selected.
	 */
	@Output()
	public onCardSelect = new EventEmitter<void>();

	/**
	 * The list of all possible estimates.
	 */
	public readonly possibleEstimates: string[] =
		["0", "0.5", "1", "2", "3", "5", "8", "13", "20", "40", "100", "?"];

	/**
	 * The currently selected card's estimate.
	 */
	public selectedEstimate: string = undefined;

	constructor(private RoomService: RoomService,
		private router: Router)
	{
	}

	/**
	 * Update the {@link selectedEstimate} based on the selected card.
	 * If the {@link selectedEstimate} was different than the provided estimate coming from the
	 * selected card, calling this method will assign such value to {@link selectedEstimate}.
	 * If the card was already selected, calling this method will set {@link selectedEstimate} to
	 * undefined, basically deselecting the previously selected card.
	 * @param estimate The estimate coming from the card that has been selected
	 */
	public async toggleCard(estimate: string): Promise<void>
	{
		this.selectedEstimate = this.selectedEstimate !== estimate ? estimate : undefined;
		this.onCardSelect.emit();

		try
		{
			await this.RoomService.vote(this.selectedEstimate);
		}
		catch (e)
		{
			this.handleErrorResponse(e.response);
		}
	}

	/**
	 * Handle the error.
	 * @param errorResponse The error response to handle.
	 */
	private handleErrorResponse(errorResponse: ErrorResponse): void
	{
		switch (errorResponse)
		{
			default:
			case (ErrorResponse.ROOM_DOESNT_EXIST):
			{
				this.router.navigateByUrl('/welcome')
					.then(() => {})
					.catch(() => console.log("Not possible to navigate to /poker"));
			}
		}
	}
}
