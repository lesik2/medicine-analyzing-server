export interface SendMailProps {
  to: string;
  template: string;
  subject: string;
  context?: Record<string, string>;
}
