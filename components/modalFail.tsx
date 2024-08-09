
import SmallModalContainer from "./smallModalContainer";
import { NoSymbolIcon } from "@heroicons/react/24/outline";

export default function ModalFail({ message, onClose, isOpen }: { message: string, onClose: any, isOpen: any }) {
  return (
    <SmallModalContainer isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center justify-center rounded-2xl bg-primary w-[32rem] h-80 opacity-100">
        <div className="pb-5">
            <NoSymbolIcon className="h-24 w-24 bg-red"></NoSymbolIcon>
        </div>
        <p className="pb-5 text-accent text-wrap w-96 text-center font-semibold font text-lg">
          {message}
        </p>
        <button className="bg-cred w-24 h-8 rectangle-generic text-white" onClick={onClose}>
          OK
        </button>
      </div>
    </SmallModalContainer>
  );
}
