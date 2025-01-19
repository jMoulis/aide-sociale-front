import { isClerkErrors } from "@/lib/utils/auth/utils";
import { useTranslations } from "next-intl";
import { useCallback } from "react";

export type ClerkErrorType = {
  code: string;
  lon_message: string;
  message: string;
  meta: {
    paramName: string;
  }
}

function useClerkErrorLocalization() {
  const t = useTranslations('ClerkSection.errors');

  const onCatchErrors = useCallback((error: unknown): string[] => {
    const { status, parsedError } = isClerkErrors(error);
    if (status) {
      const { errors } = parsedError;
      return errors.map((error: ClerkErrorType) => {
        if (t.has(`${error.code}` as any)) {
          return t(`${error.code}` as any);
        }
        return error.message
      });
    }
    return [(error as any).message];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { onCatchErrors };
}

export default useClerkErrorLocalization;