import "./HLineText.scss";

/**
 * Component for a horizontal line with text.
 *
 * @returns {JSX.Element} - The HLineText component.
 */
export default function HLineText({text, size = "default"}) {
    return (
        <div className={`hline-text ${size === "small" ? 'hline-small-text' : ""}`}>
            {text}
        </div>

    );
};
