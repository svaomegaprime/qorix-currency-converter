export default function CopyCurrencyEmbed({ title, value }) {
    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        shopify.toast.show("Copied to clipboard", { duration: 1000 });
    }
    return (
        <div style={{ background: "#F5F7F9", border: "1px solid #E1E3E5", borderRadius: "10px", boxShadow: "rgb(241 238 238) 2px 3px 5px 0px" }}>
            <s-stack padding="small base" gap="small">
                <s-heading>{title}</s-heading>
                <s-grid gridTemplateColumns="1fr auto" gap="small">
                    <s-text-field value={value} readOnly />
                    <s-button icon="clipboard" variant="secondary" onClick={handleCopy}>Copy</s-button>
                </s-grid>
            </s-stack>
        </div>
    )
}