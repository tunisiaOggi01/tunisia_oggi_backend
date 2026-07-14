import { PartialType } from '@nestjs/mapped-types';
import { CreatePublicationDto } from './create-publication.dto';

/** Request body for PATCH /admin/publications/:id. */
export class UpdatePublicationDto extends PartialType(CreatePublicationDto) {}
