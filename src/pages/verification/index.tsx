import { useQuery, useMutation } from "@tanstack/react-query";
import { FC, MouseEventHandler, useCallback, useMemo, useState } from "react";
import { fetchChecks, submitCheckResults } from "~/services/api";

import { NO_OPTION, YES_OPTION } from "./contants";
import { useKeyboardNavigation } from "./effects";

import { Button } from "./components/Button";
import { Option } from "./components/Option";

import s from "./styles/verification.module.css";

export type SelectedOptions = { [key: string]: boolean };

const VerificationPage: FC = () => {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});

  const { data, isLoading, error, refetch } = useQuery(
    ["get-verification-flags"],
    async () => (await fetchChecks()).sort((a, b) => b.priority - a.priority),
    { staleTime: Infinity, refetchOnWindowFocus: false }
  );

  const selectedOptionsEntries = useMemo(
    () => Object.entries(selectedOptions),
    [selectedOptions]
  );

  const enabledOptions = useMemo(() => {
    const optionNoSelectedIndex = selectedOptionsEntries.findIndex(
      ([, optionAnswer]) => optionAnswer === NO_OPTION
    );

    const hasOptionNoSelected = optionNoSelectedIndex !== -1;

    return data?.slice(
      0,
      (hasOptionNoSelected
        ? optionNoSelectedIndex
        : selectedOptionsEntries.length) + 1
    );
  }, [data, selectedOptionsEntries]);

  const isSubmitDisabled = useMemo(
    () =>
      !selectedOptionsEntries.some(
        ([, optionsOFlagbject]) =>
          optionsOFlagbject === NO_OPTION ||
          data?.length === selectedOptionsEntries.length
      ),
    [selectedOptionsEntries, data]
  );

  const { focusedOptionIndex, setFocusedOptionIndex } = useKeyboardNavigation(
    enabledOptions,
    selectedOptions,
    setSelectedOptions
  );

  const handleOptionClick =
    (id: string, index: number, value: boolean) => () => {
      setFocusedOptionIndex(index);
      setSelectedOptions({ ...selectedOptions, [id]: value });
    };

  const handleSubmit = useCallback(() => {
    const payload = selectedOptionsEntries.map(([id, result]) => ({
      result: result ? "yes" : "no",
      checkId: id,
    }));

    return submitCheckResults(payload);
  }, [selectedOptionsEntries]);

  const { mutate, isLoading: isSubmitLoading } = useMutation(handleSubmit, {
    onSuccess: () => {
      setSelectedOptions({});
      setFocusedOptionIndex(0);
    },
    onError: () => alert("An error occurred, please try submitting again"),
  });

  if (isLoading)
    return <img className={s.loader} alt="Loading" src="/loader.gif" />;
  if (error)
    return (
      <div className={s["message-container"]}>
        <p>
          Error, please{" "}
          <b onClick={refetch as MouseEventHandler}>click here </b>
          to try again
        </p>
      </div>
    );
  if (data?.length === 0)
    return (
      <div className={s["message-container"]}>
        <p>Sorry, there are no verification options available at this time!</p>
      </div>
    );

  return (
    <div className={s.container}>
      {data!.map(({ description, id }, index) => (
        <Option
          key={id}
          disabled={!(enabledOptions!.length - 1 >= index)}
          focused={focusedOptionIndex === index}
          description={description}
          currentOption={selectedOptions[id]}
          handleOptionYesClick={handleOptionClick(id, index, YES_OPTION)}
          handleOptionNoClick={handleOptionClick(id, index, NO_OPTION)}
        />
      ))}
      <div className={s["container-footer"]}>
        <Button
          disabled={isSubmitDisabled || isSubmitLoading}
          role="submit-button"
          onClick={mutate}
        >
          <b>SUBMIT</b>
        </Button>
      </div>
    </div>
  );
};

export default VerificationPage;
