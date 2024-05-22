

export default function ModalBackdrop({children, onClick}: {children: any, onClick: any}) {
    return (
        <div className=" absolute top-0 w-full h-full z-40 bg-[#000000af] flex justify-center items-center" onClick={onClick}>
            {children}
        </div>
    );
}