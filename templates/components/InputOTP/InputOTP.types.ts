export interface UixyInputOTPProps {
  disabled?: boolean;
  autoFocus?: boolean;
  filled?: (code: string) => Promise<boolean>;
}
