import { Injectable } from '@nestjs/common';
import sanitizeHtml from 'sanitize-html';

/** Server-side sanitizer for markdown bodies. Strips all HTML tags to prevent injection. */
@Injectable()
export class HtmlSanitizerService {
  sanitize(input: string): string {
    return sanitizeHtml(input, { allowedTags: [], allowedAttributes: {} });
  }
}
