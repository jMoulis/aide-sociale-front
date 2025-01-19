import { useCallback, useState } from "react";

function useForm() {
  const [form, setForm] = useState({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getFormInputsValue = useCallback(
    <K extends string>(form: HTMLFormElement, inputKeys: K[]): Record<K, string | null> => {
      const inputsValues = inputKeys.reduce<Record<K, string | null>>((acc, key) => {
        const element = form.elements.namedItem(key) as
          | HTMLInputElement
          | HTMLSelectElement
          | HTMLTextAreaElement
          | null;

        acc[key] = element?.value || null;
        return acc;
      }, {} as Record<K, string | null>);

      return inputsValues;
    },
    []
  );
  const getValidInputsValue = useCallback(
    <K extends string>(form: HTMLFormElement, inputKeys: K[]): Record<K, string> => {
      const inputsValues = inputKeys.reduce<Record<K, string>>((acc, key) => {
        const element = form.elements.namedItem(key) as
          | HTMLInputElement
          | HTMLSelectElement
          | HTMLTextAreaElement
          | null;

        if (element?.value) {
          acc[key] = element.value;
        }
        return acc;
      }, {} as Record<K, string>);

      return inputsValues;
    },
    []
  );

  return { form, handleChange, getFormInputsValue, getValidInputsValue };
}

export default useForm;