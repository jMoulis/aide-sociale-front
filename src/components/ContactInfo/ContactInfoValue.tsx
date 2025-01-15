type Props = {
  type: string;
  value: string;
};
const ContactInfoValue = ({ type, value }: Props) => {
  switch (type) {
    case 'phone':
      return (
        <a className='text-sm' href={`tel:${value}`}>
          {value}
        </a>
      );
    case 'email':
      return (
        <a className='text-sm' href={`mailto:${value}`}>
          {value}
        </a>
      );
    case 'website':
      return (
        <a className='text-sm' href={`${value}`} target='_blank'>
          {value}
        </a>
      );
    default:
      return <span className='text-sm'>{value}</span>;
  }
};
export default ContactInfoValue;
