export type Contact = {
  email: string;
  github: string;
  linkedin: string;
  telegram: string;
  phoneNumber: string;
};

export type ContactChannelId =
  | "email"
  | "github"
  | "linkedin"
  | "telegram"
  | "phone";

export type ContactChannel = {
  id: ContactChannelId;
  display: string;
  href: string;
};
