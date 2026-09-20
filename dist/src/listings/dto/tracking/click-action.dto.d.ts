export declare const LISTING_ACTIONS: readonly ["PHONE", "EMAIL", "WEBSITE"];
export type ListingAction = (typeof LISTING_ACTIONS)[number];
export declare class ClickActionDto {
    action: ListingAction;
}
