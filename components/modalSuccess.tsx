export default function ModalSuccess({message = "Success", onClose}: {message: string, onClose: any}) {
    return (
        <div className="absolute z-40">
            <div className="flex flex-col items-center justify-center rectangle-generic bg-primary border-accent">

                {/* add checkmark image */}
                <p className="">{message}</p>
                <button className="bg-cgreen  w-10 h-5" onClick={onClose}>OK</button>
            </div>
        </div>
    );
}