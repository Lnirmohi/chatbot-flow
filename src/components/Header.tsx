import { useEffect, useRef, useState, type Dispatch } from "react";

export default function Header({
  saveFlow, 
  savedInstanceNames,
  flowName,
  setFlowName
}: {
  saveFlow: () => void;
  savedInstanceNames: string[];
  flowName: string;
  setFlowName: Dispatch<React.SetStateAction<string>>;
}) {
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {

    function handleClickOutside(e: MouseEvent) {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setIsEditing(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [inputRef]);

  return (
    <header className="flex justify-between items-start">
      <select className={`
        border border-gray-400 h-auto self-center mr-4 px-4 py-2
        hover:ring-1 hover:ring-blue-500 hover:cursor-pointer rounded-sm
      `}>
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
        <input 
          value={flowName} 
          onChange={({target}) => {
            setFlowName(target.value);
          }}
          className={`
            w-auto bg-slate-100/40 py-1 rounded-sm text-center text-lg font-medium outline-none focus:bg-slate-200/50
          `}
          ref={inputRef}
          onClick={() => {setIsEditing(true);}}
        />
      </div>

      <button
        className={`
          self-end m-4 px-4 py-2 ring-1 ring-gray-400 text-blue-500
          hover:ring-1 hover:ring-blue-500 hover:cursor-pointer 
          rounded-sm
        `}
        onClick={() => {
          saveFlow();
        }}
      >
        Save changes
      </button>
    </header>
  );
}