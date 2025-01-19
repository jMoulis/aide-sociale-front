type Props<T> = {
  hit: T;
};
function HitComponent<T>({ hit }: Props<T>) {
  return <li className='hit-list-item'>{JSON.stringify(hit)}</li>;
}

export default HitComponent;
