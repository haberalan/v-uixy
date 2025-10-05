export interface UixyInputOTPProps {
  disabled?: boolean;
  filled?: (code: string) => Promise<boolean>;
}
