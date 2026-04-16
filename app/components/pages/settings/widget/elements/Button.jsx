export default function Button({
    children,
    onClick,
    isActive,
    disabled = false
}) {
    const handleClick = () => {
        onClick();
    }
    return (
        <>
            {disabled ?
                <s-clickable disabled={true} borderRadius="base" overflow="hidden" border="base" borderColor="base">
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "7px 5px", backgroundColor: "#E4E4E4", color: "transparent" }}>
                        {children}
                    </div>
                </s-clickable>
                :
                <s-clickable onClick={handleClick} borderRadius="base" overflow="hidden" border="base" borderColor={isActive ? "strong" : "base"}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "7px 5px", backgroundColor: isActive ? "#CDFED4" : "transparent", color: isActive ? "#303030" : "#616161" }}>
                        {children}
                    </div>
                </s-clickable>
            }
        </>
    )
}