import { useContext, type DragEvent, type ReactNode } from "react";
import DnDContext from "../utils/DnDContext";
import MessageIcon from "./MessageIcons";

export default function NodesPanel() {
  
  return (
    <section>
      <p className="py-2 font-medium text-gray-500 pr-4 text-right">Nodes Panel</p>
      
      <hr className="py-2" />

      <div className="flex gap-2 px-4 flex-wrap">
        <CustomNode 
          icon={
            <MessageIcon classNames="" />
          }
          title="Message"
          nodeType='textUpdater'
        />
      </div>
    </section>
  );
}

function CustomNode({
  title, 
  icon,
  nodeType
}: {
  title: string; 
  icon: ReactNode
  nodeType: string;
}) {
  const [_, setType] = useContext(DnDContext);

  const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: string) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div 
      className="flex flex-col justify-between align-middle gap-2 border-2 rounded-lg p-4 hover:cursor-pointer hover:border-blue-500 hover:text-blue-500" 
      onDragStart={(event) => onDragStart(event, nodeType)} 
      draggable
    >
      <span className="self-center">{icon}</span>
      <p>{title}</p>
    </div>
  );
}