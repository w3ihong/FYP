
import SmallModalContainer from "./smallModalContainer";

export default function ModalSuccess({ message, onClose, isOpen }: { message: string, onClose: any, isOpen: any }) {
  return (
    <SmallModalContainer isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center justify-center rounded-2xl bg-primary w-[32rem] h-80 opacity-100">
        <div className="pb-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            className="w-20 h-20 stroke-cgreen"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </div>
        <p className="pb-5 text-accent text-wrap w-96 text-center font-semibold font text-lg">
          {message}
        </p>
        <button className="bg-cgreen w-24 h-8 rectangle-generic text-white" onClick={onClose}>
          OK
        </button>
      </div>
    </SmallModalContainer>
  );
}
