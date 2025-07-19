export default function Header({
  saveFlow, 
  savedInstanceNames,
  flowName,
  onFlowSelect
}: {
  saveFlow: (val: string) => void;
  savedInstanceNames: string[];
  flowName: string;
  onFlowSelect: (name: string) => void
}) {

  return (
    <header className="flex justify-between items-start">
      <select 
        className={`
          border border-gray-400 h-auto self-center ml-4 px-4 py-2
          hover:ring-1 hover:ring-blue-500 hover:cursor-pointer rounded-sm
        `}
        onChange={(e) => {
          onFlowSelect(e.target.value);
        }}
      >
        <option>
          {savedInstanceNames.length
            ? 'Select a flow to show'
            : 'No saved flow found'
          }
        </option>
        {savedInstanceNames.map(i => {
          return <option key={i} value={i}>{i}</option>
        })}
      </select>

      <div className="self-center">
        <p 
          className={`
            w-auto bg-slate-100/40 min-w-48 px-2 py-1 rounded-sm text-center text-lg font-medium
          `}
        >
          {flowName.length ? flowName : 'untitled flow'}
        </p>
        
      </div>

      <button
        className={`
          self-end m-4 px-4 py-2 ring-1 ring-gray-400 text-blue-500
          hover:ring-1 hover:ring-blue-500 hover:cursor-pointer 
          rounded-sm
        `}
        onClick={() => {
          saveFlow(flowName);
        }}
      >
        Save changes
      </button>
    </header>
  );
}