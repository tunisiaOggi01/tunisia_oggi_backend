import { IsEnum } from 'class-validator';
import { ListingStatus } from '@prisma/client';

/** Request body for PATCH /admin/listings/:id — the only mutable field is the review status. */
export class UpdateListingDto {
  @IsEnum(ListingStatus)
  status: ListingStatus;
}
