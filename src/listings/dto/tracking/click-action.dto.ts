import { IsIn } from 'class-validator';

export const LISTING_ACTIONS = ['PHONE', 'EMAIL', 'WEBSITE'] as const;
export type ListingAction = (typeof LISTING_ACTIONS)[number];

/** Request body for POST /public/listings/:id/click — which contact action was tapped. */
export class ClickActionDto {
  @IsIn(LISTING_ACTIONS)
  action: ListingAction;
}
