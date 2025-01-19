import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import InputWithButton from './InputWithButton/InputWithButton';
import {
  faEye,
  faEyeSlash
} from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { useState } from 'react';
import colors from 'tailwindcss/colors';

type Props = {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  id: string;
  value?: string;
};
function InputPassword({ onChange, id, name, value }: Props) {
  const [showInput, setShowInput] = useState(false);
  if (onChange) {
    return (
      <InputWithButton
        onChange={onChange}
        id={id}
        name={name}
        required
        type={showInput ? 'text' : 'password'}
        value={value}
        onClick={() => setShowInput(!showInput)}
        action={{
          style: {
            color: showInput ? '#fff' : '',
            backgroundColor: showInput ? colors.indigo[500] : ''
          }
        }}
        Icon={
          showInput ? (
            <FontAwesomeIcon icon={faEye} />
          ) : (
            <FontAwesomeIcon icon={faEyeSlash} />
          )
        }
      />
    );
  }
  return (
    <InputWithButton
      id={id}
      name={name}
      required
      type={showInput ? 'text' : 'password'}
      onClick={() => setShowInput(!showInput)}
      action={{
        style: {
          color: showInput ? '#fff' : '',
          backgroundColor: showInput ? colors.indigo[500] : ''
        }
      }}
      Icon={
        showInput ? (
          <FontAwesomeIcon icon={faEye} />
        ) : (
          <FontAwesomeIcon icon={faEyeSlash} />
        )
      }
    />
  );
}

export default InputPassword;
