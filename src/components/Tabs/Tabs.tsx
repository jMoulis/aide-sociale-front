export type Tab = { label: string; value: string };
type Props = {
  tabs: Tab[];
  selectedTab: Tab;
  onSelectTab: (tab: Tab) => void;
};
function Tabs({ tabs, selectedTab, onSelectTab }: Props) {
  return (
    <ul className='rounded-lg border bg-card text-card-foreground shadow-sm p-3'>
      {tabs.map((tab) => (
        <li
          key={tab.value}
          className={`px-2 rounded ${
            selectedTab.value === tab.value ? 'bg-black text-white' : ''
          }`}>
          <button type='button' onClick={() => onSelectTab(tab)}>
            {tab.label}
          </button>
        </li>
      ))}
    </ul>
  );
}
export default Tabs;
