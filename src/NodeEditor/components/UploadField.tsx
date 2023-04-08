import { ChangeEventHandler } from 'react';

const UploadField = ({
  onChange,
}: {
  onChange: ChangeEventHandler<HTMLInputElement>;
}) => <input type="file" onChange={onChange} />;

export default UploadField;
