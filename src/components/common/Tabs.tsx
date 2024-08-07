export interface ITab {
  label: string;
  id: number;
  [key: string]: any;
}

interface TabsProp {
  tabs: ITab[];
  selectedTab: number;
  onChange: (value: number) => void;
  className: string;
  size?: "small" | "default";
}

const Tabs: React.FC<TabsProp> = ({
  tabs,
  selectedTab,
  onChange,
  className,
  size,
}) => {
  return (
    <>
      {/* Tabs */}
      <div
        className={`text-center text-gray-700 border-b-2 border-gray-200 mb-6 ${className}`}
      >
        <ul className="flex gap-x-6 flex-nowrap whitespace-nowrap -mb-px overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <li
              key={tab.id}
              className={`${
                tab.id === selectedTab &&
                "border-b-2 border-blue-700 text-blue-700 pointer-events-none"
              } hover:border-b-2 hover:text-gray-900 hover:border-gray-400 px-3 cursor-pointer pb-2 transition-all duration-300 ease-in-out text-sm ${
                size === "small" ? "md:text-sm" : "md:text-base"
              }`}
              onClick={() => onChange(tab.id)}
            >
              {tab.label}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Tabs;
