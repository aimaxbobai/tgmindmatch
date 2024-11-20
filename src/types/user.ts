export interface User {
  id: string;
  nickname?: string;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  language_code?: string | null;
  is_premium?: boolean;
  added_to_attachment_menu?: boolean;
  allows_write_to_pm?: boolean;
}
