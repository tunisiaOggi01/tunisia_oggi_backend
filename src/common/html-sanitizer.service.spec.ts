jest.mock('sanitize-html', () => jest.fn());

import sanitizeHtml from 'sanitize-html';
import { HtmlSanitizerService } from './html-sanitizer.service';

describe('HtmlSanitizerService', () => {
  let service: HtmlSanitizerService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new HtmlSanitizerService();
  });

  it('calls sanitize-html with allowedTags: [] and allowedAttributes: {}', () => {
    (sanitizeHtml as jest.Mock).mockReturnValue('cleaned');
    const result = service.sanitize('<p>test</p>');
    expect(sanitizeHtml).toHaveBeenCalledWith('<p>test</p>', {
      allowedTags: [],
      allowedAttributes: {},
    });
    expect(result).toBe('cleaned');
  });

  it('strips all HTML from dangerous input', () => {
    (sanitizeHtml as jest.Mock).mockReturnValue('alert("xss")');
    expect(service.sanitize('<script>alert("xss")</script>')).toBe(
      'alert("xss")',
    );
  });

  it('passes plain text through', () => {
    (sanitizeHtml as jest.Mock).mockReturnValue('just text');
    expect(service.sanitize('just text')).toBe('just text');
  });
});
