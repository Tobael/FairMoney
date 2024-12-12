import "./HLineText.scss";

export default function HLineText({text, size = "default"}) {
    return (
        <div className={`hline_text ${size === "small" ? 'hline_small_text' : ""}`}>
            {text}
        </div>

    );
};
